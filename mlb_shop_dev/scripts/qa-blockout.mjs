import { evidence, launch, layout, url } from './qa-support.mjs';

const ev = await evidence('blockout');
const browser = await launch();
ev.report.browser = { version: browser.version(), channel: 'chrome', headless: true };
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
ev.watch(page);
try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true);
  for (const [index, name] of ['diorama', 'exterior', 'interior', 'plan'].entries()) {
    await page.locator('.view-list button').nth(index).click();
    await page.waitForFunction(() => window.__MLB_DEBUG__?.cameraSettled === true);
    await ev.capture(page, `1280-${name}`, await page.evaluate(() => window.__MLB_DEBUG__));
  }
  ev.report.layout = await layout(page);
  await ev.accessibility(page, '1280-plan');
} catch (error) {
  ev.report.failure = String(error);
  await ev.capture(page, 'failure', await page.evaluate(() => window.__MLB_DEBUG__));
  process.exitCode = 1;
} finally {
  const report = await ev.finish();
  console.log(JSON.stringify({ captures: report.captures.length, errors: report.errors, failure: report.failure, sourceStable: report.sourceStable }));
  await browser.close();
}
