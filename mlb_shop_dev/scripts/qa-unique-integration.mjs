import assert from 'node:assert/strict';
import { startEvidence, launch, watch, capture, finish, buildIdentity } from './qa-unique-support.mjs';
import { verifyPromotion } from './qa-promotion-manifest.mjs';

const evidence = await startEvidence('store');
const { report } = evidence;
const base = process.env.MLB_QA_URL ?? 'http://localhost:4175';
const browser = await launch();
let current = 'startup'; let page;
try {
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await watch(page, report);
  report.expectedStates = [375, 768, 1280].flatMap(width => ['headwear', 'footwear', 'apparel', 'central', 'night', 'walk-entry', 'walk-moving', 'walk-exit'].map(state => `${state}-${width}`));
  const ready = () => page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady && window.__MLB_DEBUG__.cameraSettled, undefined, { timeout: 180000 });
  const state = () => page.evaluate(() => window.__MLB_DEBUG__);
  const runtimeResponses = [];
  page.on('response', response => { if (/\/runtime-[^/]+\.js$/.test(new URL(response.url()).pathname)) runtimeResponses.push(response); });
  await page.goto(base); await ready();
  assert.equal(runtimeResponses.length, 1, 'One actual runtime chunk response expected');
  report.build = await buildIdentity(page, base, runtimeResponses[0]);
  report.applicationLabel = await page.locator('.masthead').innerText();
  if (process.env.MLB_QA_OPERATING === '1') {
    assert.ok(!/\bDEV\b/.test(report.applicationLabel), 'Operating masthead must retain its operating label');
    assert.equal(new URL(base).port, '4174');
    report.promotion = await verifyPromotion(report.projectRoot, report.sourceHashes);
  }
  const products = (await state()).products;
  report.products = products;
  report.identifiedProductContract = { clothing: 149, wallCaps: 8 * 6 * 3 + 9, shoes: 5 * 6 * 2 + 2 * 6 * 3 + 2,
    scope: 'Product-ID evidence: old272 omitted128 central clothing IDs; eight central caps and untagged bag proxies remain outside this existing evidence scope.' };
  assert.equal(products.instances, 149 + 153 + 98, '400 identified products from independently counted fixture loops');
  const rows = products.clothing; const summary = products.clothingSummary;
  assert.equal(rows.length, 149); assert.equal(summary.placements, 149);
  assert.equal(new Set(rows.map(row => row.placementId)).size, 149);
  assert.ok(Number.isInteger(summary.verifiedPoolCount) && summary.verifiedPoolCount > 0);
  const counts = Object.fromEntries([...new Set(rows.map(row => row.productId))].map(id => [id, rows.filter(row => row.productId === id).length]));
  report.skuCounts = counts;
  assert.equal(Object.keys(counts).length, Math.min(149, summary.verifiedPoolCount));
  assert.equal(summary.repeatedPlacements, 149 - Object.keys(counts).length);
  if (summary.verifiedPoolCount === 148) assert.deepEqual(Object.values(counts).filter(count => count > 1), [2]);
  assert.equal(rows.filter(row => row.kind === 'folded').length, 8);
  for (const row of rows) {
    assert.ok(row.visible && row.meshCount >= 2, `${row.placementId}: retained visible geometry`);
    assert.ok(row.position.length === 3 && row.position.every(Number.isFinite));
    assert.ok(row.front && row.rear && row.front !== row.rear && row.frontReady && row.rearReady, `${row.placementId}: both mapped photographs loaded`);
  }
  assert.equal(summary.pairedPlacements, 149);
  assert.ok(products.materials.filter(material => material.textured).every(material => material.ready && material.width > 0 && material.height > 0));
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [zone, index] of [['headwear', 2], ['footwear', 3], ['apparel', 4], ['central', 1]]) {
      current = `${zone}-${width}`; await page.locator('.zone-list button').nth(index).click(); await ready();
      const debug = await state(); assert.equal(debug.zone, zone);
      await capture(page, evidence, current, debug);
    }
    current = `night-${width}`; await page.locator('#night').click(); await ready();
    assert.equal((await state()).night, true); await capture(page, evidence, current, await state());
    await page.locator('#night').click();
    current = `walk-entry-${width}`; await page.locator('#walk-toggle').click();
    await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'walk');
    await capture(page, evidence, current, await state());
    const before = (await state()).navigation.position;
    current = `walk-moving-${width}`; let moving;
    await page.keyboard.down('w');
    try { await page.waitForTimeout(500); moving = await state(); await capture(page, evidence, current, moving); }
    finally {
      try { await page.keyboard.up('w'); }
      catch (error) { report.errors.push(`Walking key release failed: ${error}`); }
    }
    assert.ok(moving.navigation.position.some((value, index) => Math.abs(value - before[index]) > .01), 'Walking changes world position');
    current = `walk-exit-${width}`; await page.keyboard.press('Escape');
    await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'explore'); await ready();
    await capture(page, evidence, current, await state());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  assert.deepEqual(report.captures.map(item => item.name), report.expectedStates);
  assert.deepEqual(report.errors, []); assert.deepEqual(report.graphics, []); report.pass = true;
} catch (error) {
  report.failure = `${current}: ${error.stack ?? error}`;
  if (page && !page.isClosed()) {
    try { await page.screenshot({ path: `${evidence.dir}/failure-${current}.png` }); }
    catch (captureError) { report.secondaryCaptureFailure = String(captureError); }
  }
} finally { await finish(evidence, browser); }
