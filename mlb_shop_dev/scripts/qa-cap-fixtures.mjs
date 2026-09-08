import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const kind = process.argv[2] ?? 'cabinet';
assert.ok(['cabinet', 'pegboard', 'island', 'showcase'].includes(kind));
const root = `evidence/cap-store-integration-20260908/fixtures-${kind}`;
await mkdir(root, { recursive: true });
const sources = (await Promise.all(['src/products/caps', 'src/central-fixtures', 'src/wall-fixtures'].map(async directory =>
  (await readdir(directory)).filter(file => file.endsWith('.ts')).map(file => `${directory}/${file}`)))).flat();
sources.push('scripts/cap-store-preview.mjs');
const hashes = async () => Object.fromEntries(await Promise.all(sources.map(async file => [file, createHash('sha256').update(await readFile(file)).digest('hex')])));
const report = { kind, sourceHashes: await hashes(), errors: [], contextEvents: [], captures: [], pass: false };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  await page.exposeFunction('recordCapFixtureContext', type => report.contextEvents.push(type));
  await page.addInitScript(() => {
    for (const type of ['webglcontextlost', 'webglcontextrestored']) document.addEventListener(type, () => window.recordCapFixtureContext(type), true);
  });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  for (const [name, query] of [['whole', ''], ['navy-front', '&detail=1&view=front'], ['navy-oblique', '&detail=1']]) {
    await page.goto(`http://localhost:5175/cap-store-preview.html?fixture=${kind}${query}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__CAP_STORE__?.ready, undefined, { timeout: 12000 });
    if (kind === 'island' && name === 'whole') {
      await page.mouse.move(500, 400);
      await page.mouse.wheel(0, 250);
    }
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const path = `${root}/${name}.png`;
    await page.screenshot({ path });
    report.captures.push({ path, state: await page.evaluate(() => window.__CAP_STORE__) });
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.contextEvents, []);
  assert.deepEqual(await hashes(), report.sourceHashes);
  report.pass = true;
} finally {
  await browser.close();
  await writeFile(`${root}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ kind, pass: report.pass, captures: report.captures.map(item => item.path), errors: report.errors, contextEvents: report.contextEvents }));
}
