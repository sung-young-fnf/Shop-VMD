import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { evidence, hash, launch, layout, sourceHashes } from './qa-support.mjs';

const url = 'http://127.0.0.1:4175';
const factoryUrl = 'http://127.0.0.1:5175/scripts/products-preview.html';
assert.ok(process.cwd().replaceAll('\\', '/').endsWith('/mlb_shop_dev'), 'Must run in development clone');
const stage = process.env.MLB_PRODUCTS_STAGE ?? 'initial';
const productsOnly = process.env.MLB_PRODUCTS_ONLY === '1';
const categories = process.env.MLB_PRODUCTS_CATEGORY ? [process.env.MLB_PRODUCTS_CATEGORY] : ['caps', 'clothes', 'shoes'];
assert.ok(categories.every(category => ['caps', 'clothes', 'shoes'].includes(category)));
assert.match(stage, /^[a-z0-9-]+$/i);
const ev = await evidence(`products-${stage}`);
const dir = `evidence/products/browser/${stage}`;
await mkdir(dir, { recursive: true });
ev.report.url = url;
ev.report.factoryUrl = factoryUrl;
ev.report.harnessHashes = Object.fromEntries(await Promise.all(['scripts/qa-products.mjs', 'scripts/products-preview.html', 'scripts/products-preview.mjs'].map(async path => [path, await hash(path)])));
ev.report.matrix = { viewports: [[375, 812], [768, 900], [1280, 900], [844, 390]], views: ['diorama', 'exterior', 'interior', 'plan'], zones: ['entrance', 'central', 'headwear', 'footwear', 'apparel', 'checkout', 'custom', 'fitting', 'upper-storage'], modes: ['day', 'night', 'ceiling', 'reference-1', 'reference-2', 'reference-3', 'reference-4', 'walk-start', 'walk-moving', 'walk-exit'], factoryAngles: ['front', 'offaxis'] };
const browser = await launch();
ev.report.browser = { version: browser.version(), channel: 'chrome' };
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
ev.watch(page);
const state = () => page.evaluate(() => window.__MLB_DEBUG__);
const ready = () => page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady && window.__MLB_DEBUG__.cameraSettled, undefined, { timeout: 120000 });
async function capture(target, name, snapshot, settle = true) {
  if (settle) await target.waitForTimeout(220);
  await target.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const path = `${dir}/${name}.png`;
  await target.screenshot({ path });
  const bytes = await readFile(path);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const dimensions = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  assert.deepEqual(dimensions, target.viewportSize());
  ev.report.captures.push({ name, path, dimensions, sha256: await hash(path), state: snapshot, capturedAt: new Date().toISOString() });
}
const shot = async name => capture(page, name, await state());
const click = async selector => { await page.locator(selector).click(); await ready(); };
async function check(name, task) {
  try { await task(); ev.report.checks.push({ name, pass: true }); }
  catch (error) { ev.report.checks.push({ name, pass: false, error: String(error) }); console.error(name, String(error)); }
}
try {
  if (!productsOnly) {
  await page.goto(url);
  await ready();
  ev.report.initial = await state();
  for (const [width, height] of ev.report.matrix.viewports) {
    await page.setViewportSize({ width, height });
    await click('#reset');
    for (const [index, view] of ev.report.matrix.views.entries()) await check(`${width}-${view}`, async () => {
      await click(`.view-list button:nth-child(${index + 1})`);
      assert.equal((await state()).view, view);
      assert.ok((await state()).stats.triangles > 0);
      await shot(`${width}-${view}`);
    });
    await click('#reset');
    await shot(`${width}-day`);
    await click('#night'); await shot(`${width}-night`);
    await click('#night'); await click('#ceiling'); await shot(`${width}-ceiling`);
    await click('#reset');
    await page.locator('#reference').click();
    for (let tab = 0; tab < 4; tab++) {
      await page.locator('.source-tabs button').nth(tab).click();
      await page.locator('#source-image').evaluate(image => image.decode());
      await shot(`${width}-reference-${tab + 1}`);
    }
    await page.keyboard.press('Escape');
    await page.locator('.view-list button').nth(2).focus(); await shot(`${width}-focus`);
    await page.locator('.view-list button').nth(2).hover(); await shot(`${width}-hover`);
    await check(`${width}-walk`, async () => {
      await click('#reset');
      await page.locator('#walk-toggle').click();
      await page.waitForFunction(() => window.__MLB_DEBUG__.navigation.mode === 'walk');
      await shot(`${width}-walk-start`);
      const before = (await state()).navigation.position;
      try {
        await page.keyboard.down('ArrowUp');
        await page.waitForFunction(before => Math.hypot(...window.__MLB_DEBUG__.navigation.position.map((v, i) => v - before[i])) > .2, before);
        await capture(page, `${width}-walk-moving`, await state(), false);
      } finally { await page.keyboard.up('ArrowUp'); }
      await page.keyboard.press('Escape');
      assert.equal((await state()).navigation.mode, 'explore');
      await shot(`${width}-walk-exit`);
    });
    ev.report.checks.push({ name: `${width}-overflow`, pass: !(await layout(page)).horizontalOverflow });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await click('#reset');
  for (const [name, selector] of [['view', '.view-list button'], ['zone', '.zone-list button'], ['toolbar', '#night'], ['reference', '#reference'], ['walk-launcher', '#walk-toggle']]) {
    const element = page.locator(selector).first();
    await page.mouse.move(1100, 750); await element.blur();
    await shot(`primitive-${name}-rest`);
    await element.hover(); await page.waitForTimeout(90);
    await capture(page, `primitive-${name}-hover-mid`, await state(), false);
    await shot(`primitive-${name}-hover-settled`);
    await element.focus(); await shot(`primitive-${name}-focus`);
  }
  for (const [index, zone] of ev.report.matrix.zones.entries()) await check(`zone-${zone}`, async () => {
    await click(`.zone-list button:nth-child(${index + 1})`);
    assert.equal((await state()).zone, zone);
    await shot(`zone-${zone}`);
  });
  for (const [category, zone] of [['caps', 2], ['shoes', 3], ['clothes', 4]]) {
    await click(`.zone-list button:nth-child(${zone + 1})`);
    await click('#zoom-in'); await click('#zoom-in');
    await shot(`store-close-${category}`);
  }
  await check('walk-boundary-regression', async () => {
    await click('#reset'); await page.locator('#walk-toggle').click();
    try { await page.keyboard.down('ArrowDown'); await page.waitForTimeout(3000); }
    finally { await page.keyboard.up('ArrowDown'); }
    const observed = await state();
    assert.ok(observed.navigation.position[0] >= .5 && observed.navigation.position[2] <= 15.4);
    await shot('walk-collision-stop'); await page.keyboard.press('Escape');
  });
  ev.report.sceneProducts = (await state()).products;
  ev.report.sceneCategoryCounts = Object.fromEntries(['caps', 'clothes', 'shoes'].map(category => {
    const matches = ev.report.sceneProducts.materials.filter(material => material.url?.includes(`/products/${category}/`));
    return [category, { texturedMaterials: matches.length, distinctLoadedTextures: new Set(matches.map(material => material.url)).size, allReady: matches.every(material => material.ready) }];
  }));
  await check('actual-scene-product-metadata', async () => {
    assert.ok(ev.report.sceneProducts.instances > 0);
    assert.equal(ev.report.sceneProducts.productIds.length, 14);
    assert.ok(ev.report.sceneProducts.materials.filter(material => material.textured).every(material => material.ready));
  });
  }
  const factory = await context.newPage(); ev.watch(factory);
  ev.report.products = [];
  for (const category of categories) {
    const ids = new Set();
    for (let index = 0; index < 30; index++) {
      await factory.goto(`${factoryUrl}?category=${category}&index=${index}&angle=front`);
      await factory.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready, undefined, { timeout: 30000 });
      const observed = await factory.evaluate(() => window.__PRODUCT_EVIDENCE__);
      const id = observed.metadata.productId;
      assert.equal(typeof id, 'string');
      if (ids.has(id)) break;
      ids.add(id);
      const originalPath = `reference/${category}/${id}.png`;
      await access(originalPath);
      observed.provenance = { originalPath, originalSha256: await hash(originalPath), factoryPath: `src/products/${category}/index.ts`, factorySha256: await hash(`src/products/${category}/index.ts`), comparison: 'Original product image versus actual factory front and offaxis; hidden surfaces inferred' };
      assert.ok(observed.bounds.size.every(value => value > 0));
      assert.ok(observed.meshes.some(mesh => mesh.materials.some(material => material.map?.width > 0)));
      ev.report.products.push(observed);
      await capture(factory, `factory-${category}-${id}-front`, observed);
      await factory.goto(`${factoryUrl}?category=${category}&index=${index}&angle=offaxis`);
      await factory.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
      await capture(factory, `factory-${category}-${id}-offaxis`, await factory.evaluate(() => window.__PRODUCT_EVIDENCE__));
    }
    ev.report.checks.push({ name: `${category}-selected-sku-count`, pass: ids.size === (category === 'caps' ? 6 : 4), observed: [...ids] });
  }
  await factory.close();
  if (!productsOnly) {
    for (const scenario of ['asset-failure', 'webgl-unavailable', 'delayed-texture']) {
      await check(scenario, async () => {
        const probeContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
        try {
          const probe = await probeContext.newPage();
          const observations = { scenario, errors: [], requests: [] };
          probe.on('pageerror', error => observations.errors.push(error.message));
          probe.on('requestfailed', request => observations.requests.push({ url: request.url(), failure: request.failure() }));
          let release;
          const gate = new Promise(resolve => { release = resolve; });
          if (scenario === 'asset-failure') await probe.route('**/products/**', route => route.abort());
          if (scenario === 'delayed-texture') await probe.route('**/products/**', async route => { await gate; await route.continue(); });
          if (scenario === 'webgl-unavailable') await probe.addInitScript(() => {
            const original = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(kind, ...args) { return ['webgl', 'webgl2', 'experimental-webgl'].includes(kind) ? null : original.call(this, kind, ...args); };
          });
          await probe.goto(url, { waitUntil: 'domcontentloaded' });
          if (scenario === 'delayed-texture') {
            await probe.waitForTimeout(750);
            observations.beforeRelease = await probe.evaluate(() => window.__MLB_DEBUG__);
            assert.notEqual(observations.beforeRelease?.sceneReady, true);
            release();
            await probe.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady, undefined, { timeout: 120000 });
            observations.afterRelease = await probe.evaluate(() => window.__MLB_DEBUG__);
            assert.ok(observations.afterRelease.products.materials.filter(material => material.textured).every(material => material.ready));
          } else {
            await probe.locator('.fallback h2').waitFor({ timeout: 120000 });
            await probe.locator('.fallback img').evaluate(image => image.decode());
          }
          await capture(probe, scenario, observations);
          ev.report.checks.push({ name: `${scenario}-observations`, pass: true, observations });
        } finally { await probeContext.close(); }
      });
    }
  }
} catch (error) {
  ev.report.failure = String(error); process.exitCode = 1;
  await capture(page, 'fatal', await state());
} finally {
  await browser.close();
  ev.report.browserClosed = true;
  ev.report.endSourceHashes = await sourceHashes();
  ev.report.endHarnessHashes = Object.fromEntries(await Promise.all(Object.keys(ev.report.harnessHashes).map(async path => [path, await hash(path)])));
  ev.report.sourceStable = JSON.stringify(ev.report.endSourceHashes) === JSON.stringify(ev.report.sourceHashes);
  ev.report.harnessStable = JSON.stringify(ev.report.endHarnessHashes) === JSON.stringify(ev.report.harnessHashes);
  ev.report.finishedAt = new Date().toISOString();
  if (!ev.report.sourceStable || ev.report.errors.length || ev.report.failedRequests.length || ev.report.consoleErrors.length || ev.report.checks.some(check => !check.pass)) process.exitCode = 1;
  await writeFile(`${dir}/report.json`, JSON.stringify(ev.report, null, 2));
  console.log(JSON.stringify({ dir, captures: ev.report.captures.length, failed: ev.report.checks.filter(check => !check.pass), failure: ev.report.failure, sourceStable: ev.report.sourceStable }));
}
