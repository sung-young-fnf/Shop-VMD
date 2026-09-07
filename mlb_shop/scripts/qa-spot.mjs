import { evidence, launch, url } from './qa-support.mjs';

const width = Number(process.env.MLB_QA_WIDTH ?? 375);
const ev = await evidence(`spot-${width}`);
const browser = await launch();
ev.report.browser = { version: browser.version(), channel: 'chrome', headless: true };
const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
ev.watch(page);
try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true);
  const cases = [
    ['diorama', '.view-list button:nth-child(1)'], ['exterior', '.view-list button:nth-child(2)'],
    ['central', '.zone-list button:nth-child(2)'], ['footwear', '.zone-list button:nth-child(4)'], ['custom', '.zone-list button:nth-child(7)'], ['fitting', '.zone-list button:nth-child(8)'],
    ['upper-storage', '.zone-list button:nth-child(9)'],
  ];
  for (const [name, selector] of cases) {
    await page.locator(selector).click(); await page.waitForFunction(() => window.__MLB_DEBUG__?.cameraSettled === true);
    await ev.capture(page, name, await page.evaluate(() => window.__MLB_DEBUG__));
  }
} catch (error) {
  ev.report.failure = String(error);
  await ev.capture(page, 'failure', await page.evaluate(() => window.__MLB_DEBUG__));
  process.exitCode = 1;
} finally {
  console.log(JSON.stringify(await ev.finish(), (key, value) => ['sourceHashes', 'state'].includes(key) ? undefined : value));
  await browser.close();
}
