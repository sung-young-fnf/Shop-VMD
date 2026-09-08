import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { accessoryHashes, digest } from './qa-accessory-hashes.mjs';

const dir = `evidence/cap-real-hybrid-20260908/interaction-${new Date().toISOString().replace(/[:.]/g, '-')}`;
await mkdir(dir, { recursive: true });
const report = { pass: false, source: await accessoryHashes(['caps']), errors: [], captures: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' || /context.*lost/i.test(message.text())) report.errors.push(message.text()); });
  await page.goto('http://localhost:5175/scripts/products-preview.html?category=caps&index=0&angle=offaxis');
  await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
  const frame = async name => {
    const data = await page.locator('canvas').evaluate(canvas => canvas.toDataURL('image/png'));
    const bytes = Buffer.from(data.split(',')[1], 'base64');
    await writeFile(`${dir}/${name}.png`, bytes);
    report.captures.push({ name, path: `${dir}/${name}.png`, sha256: digest(bytes) });
    return data;
  };
  const initial = await frame('initial');
  await page.mouse.move(500, 500); await page.mouse.down();
  await page.mouse.move(700, 530, { steps: 15 }); await page.mouse.up();
  await page.waitForFunction(before => document.querySelector('canvas').toDataURL('image/png') !== before, initial);
  const rotated = await frame('rotated');
  await page.mouse.wheel(0, -250);
  await page.waitForFunction(before => document.querySelector('canvas').toDataURL('image/png') !== before, rotated);
  await frame('zoomed');
  await page.reload(); await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
  const reset = await frame('reloaded');
  assert.equal(reset, initial, 'Reload restores the identical reference view');
  assert.deepEqual(report.errors, []);
  report.pass = true;
} catch (error) {
  report.failure = error instanceof Error ? error.stack : String(error);
} finally {
  await browser.close();
  report.sourceStable = JSON.stringify(await accessoryHashes(['caps'])) === JSON.stringify(report.source);
  report.pass &&= report.sourceStable;
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ dir, pass: report.pass, failure: report.failure }));
  if (!report.pass) process.exitCode = 1;
}
