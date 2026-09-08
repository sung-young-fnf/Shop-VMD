import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const stage = process.env.CAP_STAGE ?? 'first';
assert.match(stage, /^[a-z0-9-]+$/);
const dir = `evidence/cap-revision-20260908/${stage}`;
await mkdir(dir, { recursive: true });
const sources = ['src/products/caps/photo-cap.ts', 'src/products/caps/photo-blend.ts'];
const hashes = Object.fromEntries(await Promise.all(sources.map(async path => [path, createHash('sha256').update(await readFile(path)).digest('hex')])));
const report = { stage, hashes, captureMethod: 'real WebGL canvas readback after texture/compile readiness', errors: [], captures: [], regression: null };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const angle of ['front', 'offaxis', 'rear', 'rearOblique', 'right', 'top', 'underside']) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`http://localhost:5175/scripts/products-preview.html?category=caps&index=0&angle=${angle}`);
    await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
    const product = await page.evaluate(() => window.__PRODUCT_EVIDENCE__);
    if (angle === 'front') {
      report.regression = await page.evaluate(async () => {
        const THREE = await import('/node_modules/three/build/three.module.js');
        const { createPhotoCap } = await import('/src/products/caps/photo-cap.ts');
        const { awaitProductTextures } = await import('/src/products/loading.ts');
        const cap = createPhotoCap();
        await awaitProductTextures();
        const crown = cap.getObjectByName('photo-front-crown');
        const shader = { uniforms: {}, vertexShader: '#include <begin_vertex>', fragmentShader: '#include <map_fragment>' };
        crown.material.onBeforeCompile(shader);
        const textures = Object.entries(shader.uniforms).filter(([name]) => name.startsWith('cap')).map(([name, uniform]) => ({ name, width: uniform.value.image.naturalWidth, height: uniform.value.image.naturalHeight, complete: uniform.value.image.complete }));
        const source = crown.geometry.getAttribute('capSourcePosition');
        const moved = crown.geometry.clone().applyMatrix4(new THREE.Matrix4().makeTranslation(3, 2, 1));
        const bill = cap.getObjectByName('photo-curved-bill').geometry.getAttribute('position');
        let maxRootResidual = 0, maxTempleExtension = 0, minBillRadius = Infinity;
        for (let i = 0; i < 65; i++) maxRootResidual = Math.max(maxRootResidual, Math.abs((bill.getX(i) / .102) ** 2 + ((bill.getY(i) - .018) / .116) ** 2 + (bill.getZ(i) / .097) ** 2 - 1));
        for (let row = 1; row <= 32; row++) for (const column of [0, 64]) for (const getter of ['getX', 'getY', 'getZ']) maxTempleExtension = Math.max(maxTempleExtension, Math.abs(bill[getter](row * 65 + column) - bill[getter](column)));
        for (let i = 0; i < bill.count; i++) minBillRadius = Math.min(minBillRadius, (bill.getX(i) / .102) ** 2 + ((bill.getY(i) - .018) / .116) ** 2 + (bill.getZ(i) / .097) ** 2);
        return { textures, maxRootResidual, maxTempleExtension, minBillRadius, preserved: Array.from(source.array).every((value, index) => value === moved.getAttribute('capSourcePosition').array[index]) };
      });
      assert.equal(report.regression.textures.length, 4);
      assert.ok(report.regression.textures.every(texture => texture.complete && texture.width === 2000 && texture.height === 2667));
      assert.equal(report.regression.preserved, true);
      assert.ok(report.regression.maxRootResidual < .000001);
      assert.equal(report.regression.maxTempleExtension, 0);
      assert.ok(report.regression.minBillRadius > .999999);
    }
    const capture = await page.locator('canvas').evaluate(canvas => {
      const probe = document.createElement('canvas');
      probe.width = canvas.width; probe.height = canvas.height;
      const context = probe.getContext('2d');
      context.drawImage(canvas, 0, 0);
      const pixels = context.getImageData(0, 0, probe.width, probe.height).data;
      let foreground = 0, background = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] > 220 && pixels[i] < 240 && pixels[i + 1] > 220 && pixels[i + 1] < 240) background++;
        else if (pixels[i + 3] > 250 && pixels[i + 2] > 15) foreground++;
      }
      return { png: canvas.toDataURL('image/png'), foreground, background };
    });
    const path = `${dir}/caps-${angle}.png`;
    await writeFile(path, Buffer.from(capture.png.split(',')[1], 'base64'));
    assert.ok(capture.foreground > 10000 && capture.background > 10000, 'Incomplete framebuffer');
    report.captures.push({ angle, path, foreground: capture.foreground, background: capture.background, product });
    await page.close();
  }
  assert.deepEqual(report.errors, []);
} catch (error) {
  report.errors.push(error instanceof Error ? error.message : String(error));
  throw error;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage, captures: report.captures.length, errors: report.errors }));
}
