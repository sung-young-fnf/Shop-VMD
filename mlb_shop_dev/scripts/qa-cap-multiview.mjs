import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const stage = process.argv[2] ?? 'baseline';
assert.match(stage, /^[a-z0-9-]+$/);
const evidenceRoot = process.env.CAP_EVIDENCE_ROOT ?? 'evidence/cap-multiview-20260908';
const dir = `${evidenceRoot}/${stage}`;
await mkdir(dir, { recursive: true });
const sources = (await readdir('src/products/caps')).filter(name => name.endsWith('.ts')).map(name => `src/products/caps/${name}`);
sources.push('scripts/products-preview.mjs', 'scripts/cap-multiview.mjs');
const hashes = async () => Object.fromEntries(await Promise.all(sources.map(async file => [file, createHash('sha256').update(await readFile(file)).digest('hex')])));
const report = { stage, sourceHashes: await hashes(), errors: [], graphics: [], captures: [], pass: false };
for (const file of sources) await writeFile(`${dir}/${file.split('/').at(-1)}.txt`, await readFile(file));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (/context lost|context restored|CONTEXT_LOST/i.test(message.text())) report.graphics.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  const requestedViews = process.argv[3]?.split(',') ?? ['front', 'side', 'oppositeSide', 'oblique', 'rear', 'top', 'underside', 'interiorDetail'];
  for (const view of requestedViews) {
    await page.goto(`http://localhost:5175/scripts/cap-multiview.html?view=${view}`);
    await page.waitForFunction(() => window.__CAP_COMPARISON__?.ready);
    const file = `${dir}/${view}.png`;
    await page.screenshot({ path: file });
    report.captures.push({ file, evidence: await page.evaluate(() => window.__CAP_COMPARISON__) });
  }
  if (!process.argv[3]) {
  for (const width of [375, 768, 1000]) {
    await page.setViewportSize({ width, height: width === 375 ? 667 : 900 });
    for (const angle of ['front', 'offaxis']) {
      await page.goto(`http://localhost:5175/scripts/products-preview.html?category=caps&index=0&angle=${angle}`);
      await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
      const file = `${dir}/default-${angle}-${width}.png`;
      await page.screenshot({ path: file });
      report.captures.push({ file, evidence: await page.evaluate(() => window.__PRODUCT_EVIDENCE__) });
    }
  }
  const digest = buffer => createHash('sha256').update(buffer).digest('hex');
  const restingHash = digest(await page.screenshot());
  await page.mouse.move(440, 400); await page.mouse.down();
  await page.mouse.move(570, 420, { steps: 12 }); await page.mouse.up();
  await page.mouse.wheel(0, -160);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const movedHash = digest(await page.screenshot({ path: `${dir}/interaction-drag-zoom.png` }));
  assert.notEqual(movedHash, restingHash, 'Real drag and zoom change the rendered cap');
  await page.reload(); await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
  const reloadedHash = digest(await page.screenshot({ path: `${dir}/interaction-reloaded.png` }));
  assert.equal(reloadedHash, restingHash, 'Reload restores the same product appearance');
  report.interaction = { restingHash, movedHash, reloadedHash, pass: true };
  }
  assert.deepEqual(await hashes(), report.sourceHashes);
  assert.deepEqual(report.errors, []); assert.deepEqual(report.graphics, []);
  report.pass = true;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage, pass: report.pass, captures: report.captures.length, errors: report.errors, graphics: report.graphics }));
}
