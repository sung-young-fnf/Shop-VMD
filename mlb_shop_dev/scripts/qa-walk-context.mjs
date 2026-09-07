import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Given a real, headed Chrome rendering the complete product scene.
const stage = process.env.MLB_CONTEXT_STAGE ?? 'fixed';
const url = process.env.MLB_QA_URL ?? 'http://localhost:4175';
const dir = `evidence/walk-context/${stage}`;
await mkdir(dir, { recursive: true });
const report = { url, stage, errors: [], contextLost: false, steps: [], captures: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: false });
try {
  const page = await browser.newPage({ viewport: { width: 1768, height: 900 } });
  page.on('pageerror', error => report.errors.push(error.message));
  await page.exposeFunction('recordContextLoss', () => { report.contextLost = true; });
  await page.addInitScript(() => document.addEventListener('webglcontextlost', () => window.recordContextLoss(), true));
  await page.goto(url);
  await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady);
  await page.locator('#walk-toggle').click();
  // When holding successive directions, rather than instantaneous key presses.
  for (let i = 0; i < 30; i++) {
    const key = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'w', 'a', 's', 'd'][i % 8];
    await page.keyboard.down(key);
    await page.waitForTimeout(2000);
    await page.keyboard.up(key);
    const state = await page.evaluate(() => ({
      ready: window.__MLB_DEBUG__.sceneReady,
      position: window.__MLB_DEBUG__.navigation.position,
      fallback: document.querySelector('#app').classList.contains('unavailable'),
    }));
    report.steps.push({ key, ...state });
    console.log(JSON.stringify({ step: i, ...state }));
    // Then the canvas remains live, with no context loss or fallback.
    assert.equal(state.fallback, false, 'Walking must not replace the store with the drawing fallback');
    assert.equal(state.ready, true);
  }
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const path = `${dir}/walk-${width}.png`;
    await page.screenshot({ path });
    report.captures.push(path);
  }
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'explore');
  await page.screenshot({ path: `${dir}/explore.png` });
  report.captures.push(`${dir}/explore.png`);
  assert.equal(report.contextLost, false);
  assert.deepEqual(report.errors, []);
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
}
