import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const stage = process.env.MLB_CONTEXT_STAGE ?? 'recovery';
const dir = `evidence/walk-context/${stage}`;
await mkdir(dir, { recursive: true });
const report = { stage, errors: [], cycles: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: false });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto(process.env.MLB_QA_URL ?? 'http://localhost:4175');
  await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady);
  await page.locator('#walk-toggle').click();
  await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'walk');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
  const snapshot = () => page.evaluate(() => ({
    camera: window.__MLB_DEBUG__.camera,
    position: window.__MLB_DEBUG__.navigation.position,
    mode: window.__MLB_DEBUG__.navigation.mode,
    products: window.__MLB_DEBUG__.products,
    navigationStart: performance.timeOrigin,
  }));
  // Given the real store and its loaded product textures in walking mode.
  report.before = await snapshot();
  await page.screenshot({ path: `${dir}/before.png` });
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');
    const extension = gl.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('WEBGL_lose_context is required for this real GPU regression');
    window.contextRecoveryTest = { extension, lost: 0, restored: 0 };
    canvas.addEventListener('webglcontextlost', () => window.contextRecoveryTest.lost++);
    canvas.addEventListener('webglcontextrestored', () => window.contextRecoveryTest.restored++);
  });
  for (let cycle = 1; cycle <= 2; cycle++) {
    // When the GPU connection is lost, its drawing fallback must stay usable.
    await page.evaluate(() => window.contextRecoveryTest.extension.loseContext());
    await page.waitForFunction(() => document.querySelector('#app').classList.contains('unavailable'));
    assert.equal(await page.locator('#scene-status').isVisible(), true);
    await page.screenshot({ path: `${dir}/lost-${cycle}.png` });
    // When the same real context is restored, resume without reloading the app.
    await page.evaluate(() => window.contextRecoveryTest.extension.restoreContext());
    await page.waitForFunction(expected => window.contextRecoveryTest.restored === expected, cycle);
    report.cycles.push(await page.evaluate(() => ({
      lost: window.contextRecoveryTest.lost,
      restored: window.contextRecoveryTest.restored,
      ready: window.__MLB_DEBUG__.sceneReady,
      unavailable: document.querySelector('#app').classList.contains('unavailable'),
    })));
    await page.waitForFunction(() => window.__MLB_DEBUG__.sceneReady && !document.querySelector('#app').classList.contains('unavailable'), null, { timeout: 10000 });
    // Then camera, visitor position, product inventory and document survive.
    assert.deepEqual(await snapshot(), report.before);
    assert.equal(await page.locator('#scene-status').isVisible(), false);
    await page.screenshot({ path: `${dir}/restored-${cycle}.png` });
  }
  await page.keyboard.down('ArrowUp');
  try {
    await page.waitForFunction(position => Math.hypot(...window.__MLB_DEBUG__.navigation.position.map((value, index) => value - position[index])) > 0.15, report.before.position);
  } finally {
    await page.keyboard.up('ArrowUp');
  }
  report.afterMovement = await snapshot();
  assert.deepEqual(report.errors, []);
  report.pass = true;
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
}
