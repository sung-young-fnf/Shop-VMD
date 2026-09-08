import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { launch } from './qa-support.mjs';

export { launch };
export const projectRoot = resolve(process.env.MLB_QA_PROJECT_ROOT ?? '.');
async function scopedHashes(scope) {
  if (!scope) {
    const rootFiles = (await readdir(projectRoot, { withFileTypes: true })).filter(entry => entry.isFile() && (/\.(json|html|[cm]?[jt]s)$/.test(entry.name) || ['pnpm-lock.yaml', 'DESIGN.md'].includes(entry.name))).map(entry => entry.name);
    scope = { directories: ['src', 'public', 'dist'], files: rootFiles };
  }
  const paths = [];
  async function collect(directory) {
    for (const entry of await readdir(resolve(projectRoot, directory), { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await collect(path); else paths.push(path);
    }
  }
  for (const directory of scope.directories) await collect(directory);
  paths.push(...scope.files);
  return Object.fromEntries(await Promise.all(paths.sort().map(async path => [path, createHash('sha256').update(await readFile(resolve(projectRoot, path))).digest('hex')])));
}
export async function startEvidence(kind, hashScope = null) {
  const stage = `${kind}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const dir = `${process.env.MLB_QA_EVIDENCE_DIR ?? 'evidence/unique-clothing-20260908/integration'}/${stage}`;
  await mkdir(dir, { recursive: true });
  const report = { stage, projectRoot, startedAt: new Date().toISOString(), pass: false, hashScope, sourceHashes: await scopedHashes(hashScope), errors: [], graphics: [], captures: [] };
  return { dir, report };
}
export async function watch(page, report) {
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') report.errors.push(`${message.text()} ${JSON.stringify(message.location())}`);
    if (/context.*lost|context.*restored/i.test(message.text())) report.graphics.push(message.text());
  });
  page.on('requestfailed', request => report.errors.push(`${request.url()} ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  await page.exposeFunction('qaContextEvent', event => report.graphics.push(event));
  await page.addInitScript(() => {
    for (const type of ['webglcontextlost', 'webglcontextrestored']) document.addEventListener(type, () => window.qaContextEvent(type), true);
  });
}
export async function pixels(page, bytes) {
  return page.evaluate(async base64 => {
    const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let opaque = 0; let nonblack = 0; const colors = new Set();
    for (let i = 0; i < data.length; i += 16) {
      if (data[i + 3] > 240) opaque++;
      if (Math.max(data[i], data[i + 1], data[i + 2]) > 12) nonblack++;
      colors.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
    }
    return { width: image.width, height: image.height, samples: Math.ceil(data.length / 16), opaque, nonblack, colors: colors.size };
  }, bytes.toString('base64'));
}
export async function capture(page, evidence, name, state, canvasOnly = false) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const path = `${evidence.dir}/${name}.png`;
  const bytes = await (canvasOnly ? page.locator('canvas').first() : page).screenshot({ path });
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  if (!canvasOnly) assert.deepEqual({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }, page.viewportSize());
  const canvasBytes = canvasOnly ? bytes : await page.locator('canvas').first().screenshot();
  const compositing = await pixels(page, canvasBytes);
  assert.ok(compositing.nonblack / compositing.samples > .2 && compositing.colors > 12, `${name}: canvas blank or not composited`);
  evidence.report.captures.push({ name, path, state, captureMethod: 'browser-screenshot', compositing, sha256: createHash('sha256').update(bytes).digest('hex'), capturedAt: new Date().toISOString() });
  return bytes;
}
export async function framebufferCapture(page, evidence, name, state, dataUrl) {
  const bytes = Buffer.from(dataUrl.split(',')[1], 'base64');
  const path = `${evidence.dir}/${name}-framebuffer.png`;
  await writeFile(path, bytes);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const compositing = await pixels(page, bytes);
  assert.deepEqual({ width: compositing.width, height: compositing.height }, page.viewportSize());
  assert.ok(compositing.nonblack / compositing.samples > .2 && compositing.colors > 12, `${name}: framebuffer blank`);
  evidence.report.captures.push({ name, path, state, captureMethod: 'framebuffer', compositing, sha256: createHash('sha256').update(bytes).digest('hex'), capturedAt: new Date().toISOString() });
}
export async function finish(evidence, browser) {
  await browser.close();
  evidence.report.sourceStable = JSON.stringify(await scopedHashes(evidence.report.hashScope)) === JSON.stringify(evidence.report.sourceHashes);
  if (!evidence.report.sourceStable || evidence.report.errors.length || evidence.report.graphics.length) evidence.report.pass = false;
  evidence.report.finishedAt = new Date().toISOString();
  await writeFile(`${evidence.dir}/report.json`, JSON.stringify(evidence.report, null, 2));
  console.log(JSON.stringify({ directory: evidence.dir, pass: evidence.report.pass, failure: evidence.report.failure }));
  if (!evidence.report.pass) process.exitCode = 1;
}
export async function buildIdentity(page, base, runtimeResponse) {
  const response = await page.request.get(base); const html = await response.text();
  const runtimePaths = (await readdir(resolve(projectRoot, 'dist/assets'))).filter(name => /^runtime-.*\.js$/.test(name)).map(name => `/assets/${name}`);
  assert.ok(runtimePaths.length > 0, 'Dynamic runtime chunk missing from dist');
  const paths = [...new Set([...html.matchAll(/(?:src|href)="([^\"]+\.(?:js|css))"/g)].map(match => match[1]).concat(runtimePaths))];
  const resources = [];
  for (const path of paths) {
    const remote = await page.request.get(new URL(path, base).href); const bytes = await remote.body();
    const local = await readFile(resolve(projectRoot, `dist/${path.replace(/^\//, '')}`));
    assert.ok(bytes.equals(local), `Served build differs from dist: ${path}`);
    resources.push({ path, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  assert.ok(resources.some(item => item.path.endsWith('.js')), 'Built JS identity missing');
  const loadedPath = new URL(runtimeResponse.url()).pathname;
  assert.ok(runtimePaths.includes(loadedPath), 'Actual browser runtime must belong to current dist');
  const loadedBytes = await runtimeResponse.body();
  assert.ok(loadedBytes.equals(await readFile(resolve(projectRoot, `dist${loadedPath}`))), 'Actual browser runtime response differs from dist');
  return { base, projectRoot, resources, actualRuntimeResponse: { url: runtimeResponse.url(), status: runtimeResponse.status(), sha256: createHash('sha256').update(loadedBytes).digest('hex') }, htmlSha256: createHash('sha256').update(html).digest('hex') };
}
