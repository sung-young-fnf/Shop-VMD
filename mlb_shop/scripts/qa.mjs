import assert from 'node:assert/strict';
import { evidence, launch, layout, url } from './qa-support.mjs';

const ev = await evidence(process.env.MLB_QA_STAGE ?? 'final');
const browser = await launch();
ev.report.browser = { version: browser.version(), channel: 'chrome', headless: true, backForwardCacheEnabled: true };
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.addInitScript(() => {
  window.__MLB_QA_LIFECYCLE__ = { id: Math.random(), events: [] };
  for (const type of ['pagehide', 'pageshow']) addEventListener(type, event => window.__MLB_QA_LIFECYCLE__.events.push({ type, persisted: event.persisted }));
});
ev.watch(page);
const inspect = () => page.evaluate(() => window.__MLB_DEBUG__);
const settle = () => page.waitForFunction(() => window.__MLB_DEBUG__?.cameraSettled === true);
const click = async selector => { await page.locator(selector).click(); await settle(); };
const shot = async name => ev.capture(page, name, await inspect());
async function check(name, task) {
  try { await task(); ev.report.checks.push({ name, pass: true }); }
  catch (error) {
    const firstState = await inspect();
    await ev.capture(page, `${name.replace(/[^a-z0-9]+/gi, '-')}-failure`, firstState);
    await page.waitForTimeout(1000);
    ev.report.checks.push({ name, pass: false, error: String(error), firstState, laterState: await inspect() });
    console.log(JSON.stringify({ failed: name, error: String(error) }));
  }
}
const viewIds = ['diorama', 'exterior', 'interior', 'plan'];
const zoneIds = ['entrance', 'central', 'headwear', 'footwear', 'apparel', 'checkout', 'custom', 'fitting', 'upper-storage'];
try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true);
  await settle();
  ev.report.initial = await inspect();
  ev.report.device = await page.evaluate(() => {
    const gl = document.querySelector('canvas').getContext('webgl2');
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    return { renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), pixelRatio: devicePixelRatio, navigation: performance.getEntriesByType('navigation').map(e => e.toJSON()), resources: performance.getEntriesByType('resource').map(e => e.toJSON()) };
  });
  for (const [width, height] of [[1280, 900], [768, 900], [375, 812], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await click('#reset');
    for (const [index, view] of viewIds.entries()) {
      await check(`${width} view ${view}`, async () => {
        await click(`.view-list button:nth-child(${index + 1})`);
        const state = await inspect();
        assert.equal(state.view, view); assert.ok(state.stats.triangles > 0); assert.ok(state.stats.calls > 0);
        assert.equal(await page.locator('.view-list button').nth(index).getAttribute('aria-pressed'), 'true');
        await shot(`${width}-view-${view}`);
      });
    }
    for (const [index, zone] of zoneIds.entries()) {
      await check(`${width} zone ${zone}`, async () => {
        await click(`.zone-list button:nth-child(${index + 1})`);
        assert.equal((await inspect()).zone, zone);
        assert.equal(await page.locator('.zone-list button').nth(index).getAttribute('aria-pressed'), 'true');
        assert.ok((await page.locator('#selection-source').textContent()).includes('SOURCE'));
        await shot(`${width}-zone-${zone}`);
      });
    }
    await click('#reset');
    await click('#night'); await shot(`${width}-night`); await ev.accessibility(page, `${width}-night`);
    await click('#night'); await click('#ceiling'); await shot(`${width}-ceiling`);
    await click('#reset'); await shot(`${width}-reset`);
    await check(`${width} reset`, async () => { const state = await inspect(); assert.equal(state.view, 'diorama'); assert.equal(state.zone, null); assert.equal(state.night, false); assert.equal(state.ceiling, false); });
    await page.locator('#reference').click();
    for (let tab = 0; tab < 4; tab++) {
      await page.locator('.source-tabs button').nth(tab).click();
      await page.locator('#source-image').evaluate(img => img.decode());
      await shot(`${width}-reference-${tab + 1}`);
    }
    await ev.accessibility(page, `${width}-reference`);
    await check(`${width} modal keyboard`, async () => {
      const focusTrace = [];
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab');
        const focus = await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id, inside: document.querySelector('dialog').contains(document.activeElement) }));
        focusTrace.push(focus);
        assert.ok(focus.inside || focus.tag === 'BODY', 'Modal focus reached a background control');
      }
      ev.report.checks.push({ name: `${width} modal focus trace`, pass: true, focusTrace });
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog').isVisible(), false);
      assert.equal(await page.locator('#reference').evaluate(el => el === document.activeElement), true);
    });
    if (await page.locator('dialog').isVisible()) await page.locator('#close-reference').click();
    await page.locator('.view-list button').nth(2).focus(); await shot(`${width}-keyboard-focus`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.view-list button').nth(3).click();
    await check(`${width} reduced motion`, async () => assert.equal((await inspect()).cameraSettled, true, 'Reduced-motion camera must settle immediately'));
    await shot(`${width}-reduced-motion`);
    await page.emulateMedia({ reducedMotion: 'no-preference' }); await click('#reset');
    const bounds = await layout(page);
    ev.report.checks.push({ name: `${width} horizontal overflow`, pass: !bounds.horizontalOverflow, layout: bounds });
    await ev.accessibility(page, `${width}-day`);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  for (let repeat = 1; repeat <= 3; repeat++) {
    await check(`375 exact sequence repeat ${repeat}`, async () => {
      const sequence = ['.view-list button:nth-child(1)', '.view-list button:nth-child(2)', '.zone-list button:nth-child(2)', '.zone-list button:nth-child(4)', '.zone-list button:nth-child(7)', '.zone-list button:nth-child(8)', '.zone-list button:nth-child(9)'];
      const states = [];
      for (const selector of sequence) { const start = Date.now(); await click(selector); states.push({ selector, elapsedMs: Date.now() - start, state: await inspect() }); }
      ev.report.checks.push({ name: `375 exact sequence observations ${repeat}`, pass: true, states });
    });
  }
  await page.setViewportSize({ width: 1280, height: 900 }); await click('#reset');
  await shot('motion-view-start');
  const motionStarted = Date.now();
  await page.locator('.view-list button').nth(1).click(); await page.waitForTimeout(100); await ev.capture(page, 'motion-view-mid', await inspect(), { settleCss: false });
  await settle(); await shot('motion-view-settled');
  ev.report.cameraTransitionMilliseconds = Date.now() - motionStarted;
  await check('keyboard shortcuts', async () => {
    for (const [index, view] of viewIds.entries()) { await page.keyboard.press(String(index + 1)); await settle(); assert.equal((await inspect()).view, view); }
    await page.keyboard.press('n'); assert.equal((await inspect()).night, true);
    await page.keyboard.press('c'); assert.equal((await inspect()).ceiling, true);
    await page.keyboard.press('r'); await settle(); assert.equal((await inspect()).view, 'diorama');
  });
  await check('orbit drag does not pick', async () => {
    const before = await inspect();
    await page.mouse.move(800, 450); await page.mouse.down(); await page.mouse.move(960, 500, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(500);
    const after = await inspect(); assert.notDeepEqual(after.camera, before.camera); assert.equal(after.zone, before.zone); assert.equal(after.fixture, before.fixture);
    await shot('orbit-drag');
  });
  await check('wheel zoom', async () => {
    const before = await inspect(); await page.mouse.move(800, 400); await page.mouse.wheel(0, -240); await page.waitForTimeout(400); assert.notDeepEqual((await inspect()).camera, before.camera);
  });
  await check('right drag pan', async () => {
    const before = await inspect(); await page.mouse.move(800, 450); await page.mouse.down({ button: 'right' }); await page.mouse.move(860, 470, { steps: 8 }); await page.mouse.up({ button: 'right' }); await page.waitForTimeout(400); assert.notDeepEqual((await inspect()).target, before.target);
  });
  await check('zoom buttons', async () => { await click('#reset'); const before = await inspect(); await click('#zoom-in'); assert.notDeepEqual((await inspect()).camera, before.camera); await click('#zoom-out'); });
  await check('real canvas fixture picking', async () => {
    await click('.view-list button:nth-child(4)');
    const candidates = (await inspect()).fixtures.filter(f => f.visible && f.x > 350 && f.x < 1170 && f.y > 170 && f.y < 730);
    let picked = null;
    for (const point of candidates.slice(0, 12)) {
      await page.mouse.click(point.x, point.y); await settle(); const state = await inspect();
      if (state.fixture !== null) { picked = { aim: point, result: state.fixture, zone: state.zone }; break; }
    }
    assert.ok(picked, 'No actual fixture selected from visible projected points'); ev.report.canvasPick = picked; await shot('canvas-pick');
  });
  await click('#reset');
  ev.report.frameIntervals = await page.evaluate(() => new Promise(resolve => {
    const intervals = []; let previous; const tick = now => { if (previous !== undefined) intervals.push(now - previous); previous = now; if (intervals.length >= 120) resolve(intervals); else requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  }));
  await check('context loss fallback', async () => {
    const lost = await page.evaluate(() => { const gl = document.querySelector('canvas').getContext('webgl2'); const ext = gl.getExtension('WEBGL_lose_context'); if (!ext) return false; ext.loseContext(); return true; });
    assert.equal(lost, true); await page.locator('.fallback h2').waitFor();
    await page.locator('.fallback img').evaluate(img => img.decode()); await shot('context-loss-fallback');
    assert.equal((await inspect()).sceneReady, false);
    await page.getByRole('button', { name: '다시 시도', exact: true }).click(); await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true); await settle(); await shot('context-loss-retry');
  });
  await check('WebGL unavailable mobile fallback', async () => {
    const fallbackContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    await fallbackContext.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(kind, ...args) { if (['webgl', 'webgl2', 'experimental-webgl'].includes(kind)) return null; return original.call(this, kind, ...args); }; });
    try {
      const fallback = await fallbackContext.newPage(); await fallback.goto(url); await fallback.locator('.fallback h2').waitFor();
      await fallback.locator('.fallback img').evaluate(img => img.decode()); await ev.capture(fallback, '375-webgl-unavailable');
      assert.equal((await layout(fallback)).horizontalOverflow, false); await ev.accessibility(fallback, 'fallback');
      assert.equal(await fallback.getByRole('button', { name: '다시 시도', exact: true }).isVisible(), true);
    } finally { await fallbackContext.close(); }
  });
  await check('mobile touch controls', async () => {
    const touchContext = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    try {
      const touch = await touchContext.newPage(); await touch.goto(url); await touch.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true);
      await touch.locator('.zone-list button').nth(1).tap(); await touch.waitForFunction(() => window.__MLB_DEBUG__?.cameraSettled === true);
      assert.equal(await touch.evaluate(() => window.__MLB_DEBUG__.zone), 'central');
      await touch.locator('#reference').tap(); assert.equal(await touch.locator('dialog').isVisible(), true);
      await touch.locator('#close-reference').tap(); await touch.locator('#reset').tap();
      await touch.waitForFunction(() => window.__MLB_DEBUG__?.cameraSettled === true);
      assert.equal(await touch.evaluate(() => window.__MLB_DEBUG__.zone), null);
      await ev.capture(touch, '375-touch-reset', await touch.evaluate(() => window.__MLB_DEBUG__));
    } finally { await touchContext.close(); }
  });
  await check('actual back-forward cache return', async () => {
    await click('#reset');
    const before = await page.evaluate(() => window.__MLB_QA_LIFECYCLE__);
    const beforeCamera = (await inspect()).camera;
    const cdp = await context.newCDPSession(page); await cdp.send('Page.enable');
    const cacheNotUsed = []; cdp.on('Page.backForwardCacheNotUsed', event => cacheNotUsed.push(event));
    const away = new URL('/sources/plan.png', url); away.hostname = 'localhost';
    await page.goto(away.href);
    try { await page.goBack({ waitUntil: 'commit', timeout: 4000 }); }
    catch (error) { ev.report.cacheNavigationWait = String(error); }
    await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true);
    const after = await page.evaluate(() => window.__MLB_QA_LIFECYCLE__);
    ev.report.backForwardCache = { before, after, cacheNotUsed };
    assert.equal(after.id, before.id, 'A new lifecycle is an ordinary reload, not BFCache restoration');
    assert.ok(after.events.some(event => event.type === 'pageshow' && event.persisted));
    await click('.view-list button:nth-child(4)');
    assert.equal((await inspect()).view, 'plan'); assert.notDeepEqual((await inspect()).camera, beforeCamera);
    await shot('bfcache-restored-plan'); await cdp.detach();
  });
} catch (error) {
  ev.report.failure = String(error); process.exitCode = 1;
  await ev.capture(page, 'fatal-failure', await page.evaluate(() => window.__MLB_DEBUG__));
} finally {
  const report = await ev.finish();
  if (report.checks.some(check => !check.pass) || report.accessibility.some(result => result.violations.length) || !report.sourceStable || report.errors.length) process.exitCode = 1;
  console.log(JSON.stringify({ captures: report.captures.length, failures: report.checks.filter(check => !check.pass), accessibility: report.accessibility.filter(result => result.violations.length), errors: report.errors, sourceStable: report.sourceStable, failure: report.failure }));
  await browser.close();
}
