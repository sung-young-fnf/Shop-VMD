import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const pass = process.argv[2] ?? 'blockout';
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:5186';
if (!/^[a-z-]+$/.test(pass)) throw new Error('Pass must contain lowercase letters and hyphens.');
const output = path.resolve('evidence', pass);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 899, height: 1200 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${baseUrl}/?capture=1&pass=${encodeURIComponent(pass)}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.capStudy?.ready === true);
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images, image => image.decode().catch(() => undefined)));
    await window.capStudy.renderer.compileAsync(window.capStudy.scene, window.capStudy.camera);
  });
  for (const view of ['reference', 'front', 'right', 'rear', 'left', 'material-closeup']) {
    await page.evaluate(async name => {
      window.capStudy.setView(name);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, view);
    await page.locator('canvas').screenshot({ path: path.join(output, `${view}.png`) });
  }
  const runtime = await page.evaluate(() => {
    const { model, renderer, frameTimes, pass: stage } = window.capStudy;
    const parts = [];
    let triangles = 0;
    let vertices = 0;
    let finite = true;
    model.traverse(object => {
      if (!object.isMesh) return;
      const position = object.geometry.getAttribute('position');
      const meshTriangles = (object.geometry.index?.count ?? position.count) / 3;
      vertices += position.count;
      triangles += meshTriangles;
      for (const number of position.array) if (!Number.isFinite(number)) finite = false;
      object.geometry.computeBoundingBox();
      parts.push({ name: object.name, parent: object.parent?.name, vertices: position.count, triangles: meshTriangles, visible: object.visible, userData: object.userData, bounds: object.geometry.boundingBox?.toJSON?.() ?? { min: object.geometry.boundingBox?.min.toArray(), max: object.geometry.boundingBox?.max.toArray() } });
    });
    return { pass: stage, sculptRuntime: model.userData.sculptRuntime, assemblies: model.children.map(part => ({ name: part.name, userData: part.userData })), parts, triangles, vertices, finite, renderer: { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures }, frameTimesMs: frameTimes, capturedAt: new Date().toISOString() };
  });
  await writeFile(path.join(output, 'runtime.json'), JSON.stringify({ ...runtime, browserErrors: errors }, null, 2));
  if (errors.length > 0) throw new Error(`Browser errors: ${errors.join('; ')}`);
  if (!runtime.finite || runtime.triangles === 0) throw new Error('Invalid or empty model geometry.');
  console.log(JSON.stringify({ output, pass, triangles: runtime.triangles, parts: runtime.parts.length, browserErrors: errors.length }));
} finally {
  await browser.close();
}
