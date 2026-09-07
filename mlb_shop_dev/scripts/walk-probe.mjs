import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const dir = 'evidence/walk/probe';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const report = { errors: [], checks: [] };
page.on('pageerror', error => report.errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:4175');
  await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady && window.__MLB_DEBUG__.cameraSettled);
  await page.screenshot({ path: `${dir}/explore.png` });
  const camera = await page.evaluate(() => window.__MLB_DEBUG__.camera);
  await page.keyboard.down('ArrowRight');
  await page.waitForFunction(before => Math.hypot(...window.__MLB_DEBUG__.camera.map((v, i) => v - before[i])) > .5, camera);
  await page.keyboard.up('ArrowRight');
  report.checks.push('arrow camera movement');
  await page.locator('#walk-toggle').click();
  await page.screenshot({ path: `${dir}/walk-start.png` });
  const start = await page.evaluate(() => window.__MLB_DEBUG__.navigation.position);
  await page.keyboard.down('ArrowUp');
  await page.waitForFunction(before => Math.hypot(...window.__MLB_DEBUG__.navigation.position.map((v, i) => v - before[i])) > .5, start, { timeout: 5000 });
  await page.screenshot({ path: `${dir}/walking.png` });
  await page.keyboard.up('ArrowUp');
  report.checks.push('visitor moves');
  report.visitor = await page.evaluate(() => window.__MLB_DEBUG__.navigation);
  for (const width of [375, 768, 844]) {
    await page.setViewportSize({ width, height: width === 844 ? 390 : 812 });
    await page.screenshot({ path: `${dir}/walk-${width}.png` });
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => window.__MLB_DEBUG__.navigation.mode), 'explore');
  report.checks.push('escape exit');
  assert.deepEqual(report.errors, []);
} catch (error) {
  report.failure = String(error);
  await page.screenshot({ path: `${dir}/failure.png` });
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
