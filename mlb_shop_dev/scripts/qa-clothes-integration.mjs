import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const dir = 'evidence/clothes-fidelity-20260908/store';
await mkdir(dir, { recursive: true });
const report = { errors: [], graphics: [], captures: [], maps: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.text().includes('Context')) report.graphics.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  const ready = () => page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady && window.__MLB_DEBUG__.cameraSettled);
  const capture = async name => {
    await ready();
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
    const path = `${dir}/${name}.png`;
    await page.screenshot({ path });
    report.captures.push(path);
  };
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:4175');
    await ready();
    const products = await page.evaluate(() => window.__MLB_DEBUG__.products);
    assert.equal(products.instances, 272);
    assert.equal(products.productIds.length, 14);
    report.maps = products.materials.filter(material => material.productId === 'M26F3AMTV0164' && material.textured);
    assert.ok(report.maps.some(material => material.url.endsWith('-rear.png') && material.ready && material.width === 2000));
    assert.ok(report.maps.some(material => material.url.endsWith('-front.png') && material.ready && material.width === 2000));
    for (const [zone, index] of [['apparel', 4], ['central', 1]]) {
      await page.locator('.zone-list button').nth(index).click();
      await capture(`${zone}-${width}`);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  await page.locator('#night').click();
  await capture('night');
  await page.locator('#walk-toggle').click();
  await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'walk');
  await page.screenshot({ path: `${dir}/walking.png` });
  report.captures.push(`${dir}/walking.png`);
  await page.keyboard.press('Escape');
  await page.goto('http://localhost:5175/scripts/products-preview.html?category=clothes&index=3');
  await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
  const before = await page.locator('canvas').screenshot();
  await page.mouse.move(550, 400);
  await page.mouse.down();
  await page.mouse.move(850, 440, { steps: 20 });
  await page.mouse.up();
  const after = await page.locator('canvas').screenshot();
  assert.equal(before.equals(after), false, 'Dragging the standalone clothing preview must rotate the real model');
  report.orbitWorks = true;
  assert.deepEqual(report.errors, []);
  report.pass = true;
} catch (error) {
  report.failure = String(error);
  const page = browser.contexts()[0]?.pages()[0];
  if (page && !page.isClosed()) report.lastState = await page.evaluate(() => ({
    ready: window.__MLB_DEBUG__?.sceneReady,
    settled: window.__MLB_DEBUG__?.cameraSettled,
    status: document.querySelector('#scene-status')?.textContent,
  }));
  throw error;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
