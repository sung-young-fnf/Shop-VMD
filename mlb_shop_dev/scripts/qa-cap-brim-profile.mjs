import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const stage = process.argv[2] ?? 'before';
assert.match(stage, /^[a-z0-9-]+$/);
const dir = `evidence/cap-brim-profile-20260908/${stage}`;
await mkdir(dir, { recursive: true });
const source = 'src/products/caps/real-surfaces.ts';
const hash = async () => createHash('sha256').update(await readFile(source)).digest('hex');
const report = { stage, sourceHash: await hash(), errors: [], graphics: [], captures: [], pass: false };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (/context lost|context restored|CONTEXT_LOST/i.test(message.text())) report.graphics.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  for (const [angle, width, height] of [['right', 1000, 900], ['offaxis', 1000, 900], ['front', 1000, 900], ['top', 1000, 900], ['underside', 1000, 900], ['rear', 1000, 900], ['offaxis', 375, 667], ['offaxis', 768, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`http://localhost:5175/scripts/products-preview.html?category=caps&index=0&angle=${angle}`);
    await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
    const file = `${dir}/${angle}-${width}.png`;
    await page.screenshot({ path: file });
    report.captures.push({ angle, width, height, file, evidence: await page.evaluate(() => window.__PRODUCT_EVIDENCE__) });
  }
  await page.mouse.move(380, 380);
  await page.mouse.down();
  await page.mouse.move(540, 420, { steps: 12 });
  await page.mouse.up();
  await page.mouse.wheel(0, -180);
  await page.screenshot({ path: `${dir}/interaction.png` });
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.graphics, []);
  assert.equal(await hash(), report.sourceHash);
  report.pass = true;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage, pass: report.pass, captures: report.captures.length, errors: report.errors, graphics: report.graphics }));
}
