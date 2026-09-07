import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const dir = 'evidence/promotion-20260907-products/browser';
await mkdir(dir, { recursive: true });
const report = { url: 'http://localhost:4174', errors: [], failures: [], captures: [], checks: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.failures.push({ url: response.url(), status: response.status() }); });
  await page.goto(report.url);
  const ready = () => page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady && window.__MLB_DEBUG__.cameraSettled);
  const capture = async name => {
    await ready();
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
    const path = `${dir}/${name}.png`;
    await page.screenshot({ path });
    report.captures.push(path);
  };
  await ready();
  report.products = await page.evaluate(() => window.__MLB_DEBUG__.products);
  assert.equal(report.products.productIds.length, 14);
  assert.equal(report.products.instances, 272);
  assert.ok(report.products.materials.every(material => material.ready));
  assert.equal(await page.locator('.masthead p').textContent(), '성수 플래그십 · 공간 아카이브');
  report.checks.push('14 SKUs, 272 placements, all product maps ready, operating brand retained');
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await capture(`overview-${width}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  for (let i = 0; i < 9; i++) {
    await page.locator('.zone-list button').nth(i).click();
    await capture(`zone-${i + 1}`);
  }
  for (let i = 0; i < 4; i++) {
    await page.locator('.view-list button').nth(i).click();
    await capture(`view-${i + 1}`);
  }
  await page.locator('#night').click();
  await capture('night');
  await page.locator('#reference').click();
  await page.locator('#source-image').evaluate(image => image.decode());
  await capture('reference');
  await page.keyboard.press('Escape');
  await page.locator('#reset').click();
  await ready();
  await page.locator('#walk-toggle').click();
  await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'walk');
  await page.screenshot({ path: `${dir}/walking.png` });
  report.captures.push(`${dir}/walking.png`);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => window.__MLB_DEBUG__.navigation.mode), 'explore');
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failures, []);
  report.checks.push('9 zones, 4 views, night, reference modal, walking entry/exit');
  report.pass = true;
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pass: report.pass, failure: report.failure, captures: report.captures.length, errors: report.errors, failures: report.failures }));
}
