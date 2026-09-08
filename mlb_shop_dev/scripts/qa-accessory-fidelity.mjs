import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { accessoryHashes, digest } from './qa-accessory-hashes.mjs';

const categoryFilter = process.env.ACCESSORY_CATEGORY;
if (categoryFilter) assert.ok(['caps', 'shoes'].includes(categoryFilter), 'ACCESSORY_CATEGORY must be caps or shoes');
const categories = categoryFilter ? [categoryFilter] : ['caps', 'shoes'];
const indexes = (process.env.ACCESSORY_INDEXES ?? '0').split(',').map(Number);
assert.ok(indexes.length > 0 && indexes.every(index => Number.isInteger(index) && index >= 0 && index < 6));
const stage = process.env.ACCESSORY_STAGE ?? `${categoryFilter ?? 'all'}-${new Date().toISOString().replace(/[:.]/g, '-').toLowerCase()}`;
assert.match(stage, /^[a-z0-9-]+$/);
const parent = process.env.ACCESSORY_EVIDENCE_DIR ?? 'evidence/accessory-resume-20260908';
await mkdir(parent, { recursive: true });
const dir = `${parent}/${stage}`;
await mkdir(dir);
const source = await accessoryHashes(categories);
const report = { stage, categories, startedAt: new Date().toISOString(), pass: false, captureMethod: 'WebGL framebuffer PNG', source, errors: [], contextEvents: [], captures: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let current = 'startup';
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') report.errors.push(`${message.text()} ${JSON.stringify(message.location())}`);
    if (/context.*lost|context.*restored/i.test(message.text())) report.contextEvents.push(message.text());
  });
  page.on('requestfailed', request => report.errors.push(`${request.url()} ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  await page.exposeFunction('recordAccessoryContext', type => report.contextEvents.push(type));
  await page.addInitScript(() => {
    for (const type of ['webglcontextlost', 'webglcontextrestored']) document.addEventListener(type, () => window.recordAccessoryContext(type), true);
  });
  for (const category of categories) {
    for (const index of indexes) {
    for (const angle of ['front', 'offaxis', 'rear', 'rearOblique', 'right', 'top', 'underside']) {
      current = `${category}-${index}-${angle}`;
      await page.goto(`http://localhost:5175/scripts/products-preview.html?category=${category}&index=${index}&angle=${angle}`);
      await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
      const product = await page.evaluate(() => window.__PRODUCT_EVIDENCE__);
      const path = `${dir}/${category}${index === 0 ? '' : `-${index}`}-${angle}.png`;
      const frame = await page.locator('canvas').evaluate(canvas => {
        const probe = document.createElement('canvas');
        probe.width = canvas.width;
        probe.height = canvas.height;
        const context = probe.getContext('2d');
        context.drawImage(canvas, 0, 0);
        const pixels = context.getImageData(0, 0, probe.width, probe.height).data;
        let background = 0, foreground = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] > 220 && pixels[i] < 240 && pixels[i + 1] > 220 && pixels[i + 1] < 240) background++;
          else if (pixels[i + 3] > 250 && pixels[i + 2] > 15) foreground++;
        }
        if (background < 10000 || foreground < 10000) throw new Error('Incomplete WebGL framebuffer');
        return { png: canvas.toDataURL('image/png'), background, foreground };
      });
      await writeFile(path, Buffer.from(frame.png.split(',')[1], 'base64'));
      const bytes = await readFile(path);
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(bytes.readUInt32BE(16), 1000);
      assert.equal(bytes.readUInt32BE(20), 1000);
      assert.ok(bytes.length > 20000, 'Rendered product PNG must contain image detail');
      report.captures.push({ category, index, angle, path, product, foreground: frame.foreground, background: frame.background, sha256: digest(bytes), capturedAt: new Date().toISOString() });
    }
    }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.contextEvents, []);
  assert.equal(report.captures.length, categories.length * indexes.length * 7);
  report.pass = true;
} catch (error) {
  report.failure = `${current}: ${error.stack ?? error}`;
} finally {
  await browser.close();
  report.sourceStable = JSON.stringify(await accessoryHashes(categories)) === JSON.stringify(source);
  if (!report.sourceStable || report.errors.length || report.contextEvents.length) report.pass = false;
  report.finishedAt = new Date().toISOString();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage, dir, pass: report.pass, captures: report.captures.length, errors: report.errors, failure: report.failure }));
  if (!report.pass) process.exitCode = 1;
}
