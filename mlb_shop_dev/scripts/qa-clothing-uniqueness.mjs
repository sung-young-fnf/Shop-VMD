import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const output = process.env.CLOTHING_QA_DIR ?? 'evidence/unique-clothing/placements';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { errors: [], runs: [] };
const expectedPositions = new Map();
for (const [id, x, z, sx, sz, modules] of [
  ['a', 3.1, 5.05, 1, 1, 2], ['b', 3.1, 11, 1, -1, 2],
  ['c', 14.65, 5.05, -1, 1, 3], ['d', 14.65, 11, -1, -1, 3],
]) {
  for (let bay = 0; bay < modules; bay++) for (let index = 0; index < 8; index++) {
    expectedPositions.set(`hg-${id}-${bay}/${index}`, [x + sx * (2.12 + bay * 1.24 + (index / 7 - .5) * 1.03), 1.63, z + sz * .94]);
  }
}
for (let bay = 0; bay < 2; bay++) for (let index = 0; index < 20; index++) {
  expectedPositions.set(`hg-f-${bay}/${index}`, [11.12 + (index / 19 - .5) * 3.1, 1.71, 8 + (bay ? .275 : -.275)]);
}
for (const [index, [x, z]] of [[-.27, -.37], [.27, -.36], [-.27, .3], [.27, .3]].entries()) {
  expectedPositions.set(`hg-e/${index}`, [6.15 + x, .801, 8 + z]);
  expectedPositions.set(`showcase/${index}`, [6.2 + x * 2, .695, 13.05 + z * .55]);
}
for (const [bay, x] of [4.95, 6.55, 8.15].entries()) for (let index = 0; index < 7; index++) {
  const angle = Math.PI - Math.PI / 18;
  const localX = -.47 + index * .155;
  expectedPositions.set(`w04-standard-0${bay + 1}/${index}`, [x + Math.cos(angle) * localX + Math.sin(angle) * .3, 1.6125, 15.38 - Math.sin(angle) * localX + Math.cos(angle) * .3]);
}
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', error => report.errors.push(error.message));
  // Given the complete development store, including both folded displays.
  for (let run = 0; run < 2; run++) {
    // When a fresh scene is built, allocation must be independent of prior builds.
    await page.goto(process.env.MLB_QA_URL ?? 'http://localhost:4175');
    await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady, undefined, { timeout: 120000 });
    await page.waitForFunction(() => window.__MLB_DEBUG__?.products.clothingSummary?.pairedPlacements === 149, undefined, { timeout: 120000 });
    const products = await page.evaluate(() => window.__MLB_DEBUG__.products);
    report.runs.push(products.clothing);
    // Then count real renderable clothing roots and their distinct source identities.
    assert.ok(Array.isArray(products.clothing), 'Real clothing placement evidence must exist');
    assert.equal(products.clothing.length, 149);
    assert.equal(new Set(products.clothing.map(item => item.productId)).size, Math.min(149, products.clothingSummary.verifiedPoolCount));
    assert.equal(products.clothingSummary.repeatedPlacements, 149 - Math.min(149, products.clothingSummary.verifiedPoolCount));
    assert.equal(new Set(products.clothing.map(item => item.placementId)).size, 149);
    assert.equal(products.clothing.filter(item => item.kind === 'folded').length, 8);
    assert.ok(products.clothing.every(item => item.meshCount >= 2 && item.visible));
    assert.ok(products.clothing.every(item => item.front && item.rear && item.front !== item.rear));
    assert.ok(products.clothing.every(item => item.frontReady && item.rearReady));
    for (const item of products.clothing) {
      const expected = expectedPositions.get(item.placementId);
      assert.ok(expected, `Known original placement ${item.placementId}`);
      assert.ok(item.position.every((value, axis) => Math.abs(value - expected[axis]) < 1e-8), `Original world position preserved: ${item.placementId}`);
    }
    await page.screenshot({ path: `${output}/store-${run}.png` });
  }
  assert.deepEqual(report.runs[0], report.runs[1], 'Reload must preserve placement to SKU and world coordinate mapping');
  assert.deepEqual(report.errors, []);
  report.pass = true;
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await browser.close();
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
}
