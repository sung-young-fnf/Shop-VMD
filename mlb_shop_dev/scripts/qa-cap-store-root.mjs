import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const stage = process.argv[2] ?? 'before';
const surface = process.argv[3] ?? 'headwear';
const width = Number(process.argv[4] ?? 1280);
assert.match(stage, /^[a-z0-9-]+$/);
assert.ok(['headwear', 'displays', 'controls'].includes(surface));
assert.ok([375, 768, 1280].includes(width));
const root = `${process.env.HEADWEAR_EVIDENCE_ROOT ?? 'evidence/cap-store-integration-20260908'}/${stage}`;
const sourceRoot=process.env.STORE_QA_SOURCE_ROOT ?? '.';
await mkdir(root, { recursive: true });
const files = (await Promise.all(['src/products/caps', 'src/central-fixtures', 'src/wall-fixtures'].map(async directory =>
  (await readdir(`${sourceRoot}/${directory}`)).filter(file => file.endsWith('.ts')).map(file => `${directory}/${file}`)))).flat();
const hashes = async () => Object.fromEntries(await Promise.all(files.map(async file => [file, createHash('sha256').update(await readFile(`${sourceRoot}/${file}`)).digest('hex')])));
const report = { stage, surface, width, url: process.env.STORE_QA_URL ?? 'http://localhost:5175', sourceHashes: await hashes(), errors: [], contextEvents: [], captures: [], pass: false };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await page.exposeFunction('recordCapStoreContext', type => report.contextEvents.push(type));
  await page.addInitScript(() => {
    for (const type of ['webglcontextlost', 'webglcontextrestored']) document.addEventListener(type, () => window.recordCapStoreContext(type), true);
  });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  const state = () => page.evaluate(() => {
    const debug = window.__MLB_DEBUG__;
    return { ready: debug?.sceneReady, settled: debug?.cameraSettled, stats: debug?.stats, view: debug?.view, zone: debug?.zone, fixture: debug?.fixture, camera: debug?.camera, target: debug?.target, navigation: debug?.navigation, status: document.querySelector('#scene-status')?.textContent };
  });
  const ready = () => page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady && window.__MLB_DEBUG__?.cameraSettled, undefined, { timeout: 12000, polling: 400 });
  const capture = async name => {
    const path = `${root}/${name}.png`;
    await page.screenshot({ path });
    report.captures.push({ path, state: await state() });
  };
  await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 12000 });
  await ready();
  await capture('store');
  await page.locator('.zone-list button').filter({ hasText: '헤드웨어' }).click();
  await ready();
  assert.equal((await state()).zone, 'headwear');
  await capture('headwear');
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, -280);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await capture('headwear-zoom');
  if (surface === 'headwear' && width === 1280) {
    const fixtureId=process.env.STORE_QA_CABINET ?? 'ca-04';
    const fixture = await page.evaluate(id => window.__MLB_DEBUG__.fixtures.find(item => item.id === id),fixtureId);
    assert.ok(fixture?.visible);
    await page.mouse.click(fixture.x, fixture.y);
    await ready();
    assert.equal((await state()).fixture, fixtureId);
    await capture('selected-cabinet');
    await page.mouse.move(700, 580);
    await page.mouse.wheel(0, -700);
    await page.mouse.down();
    await page.mouse.move(700, 500, { steps: 12 });
    await page.mouse.up();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await capture('cabinet-eye-level');
    await page.mouse.wheel(0, -1800);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await capture('cabinet-near-front');
  }
  if (surface === 'displays') {
    for (const [label, zone] of [['중앙 디스플레이', 'central'], ['어패럴', 'apparel']]) {
      await page.locator('.zone-list button').filter({ hasText: label }).click();
      await ready();
      assert.equal((await state()).zone, zone);
      await capture(zone);
    }
  }
  if (surface === 'controls') {
    await page.locator('#night').click();
    await capture('headwear-night');
    await page.locator('#ceiling').click();
    await capture('headwear-ceiling');
    await page.locator('#walk-toggle').click();
    await page.waitForFunction(() => window.__MLB_DEBUG__?.navigation.mode === 'walk', undefined, { timeout: 5000 });
    await page.keyboard.down('ArrowUp');
    await page.evaluate(() => new Promise(resolve => {
      let frames = 0;
      const frame = () => ++frames >= 12 ? resolve() : requestAnimationFrame(frame);
      requestAnimationFrame(frame);
    }));
    await page.keyboard.up('ArrowUp');
    await capture('walking');
    await page.keyboard.press('Escape');
    await page.locator('#reset').click();
    await ready();
    await capture('reset');
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.contextEvents, []);
  assert.deepEqual(await hashes(), report.sourceHashes);
  report.pass = true;
} catch (error) {
  report.failure = String(error);
  const page = browser.contexts()[0]?.pages()[0];
  if (page && !page.isClosed()) {
    await page.screenshot({ path: `${root}/failure.png` });
    report.failureState = await page.evaluate(() => ({ status: document.querySelector('#scene-status')?.textContent, ready: window.__MLB_DEBUG__?.sceneReady }));
  }
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${root}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
