import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import desktop from 'lighthouse/core/config/lr-desktop-config.js';
import { sourceHashes, url } from './qa-support.mjs';

const dir = `evidence/browser/${process.env.MLB_PERFORMANCE_STAGE ?? 'performance'}`;
await mkdir(dir, { recursive: true });
const hashes = await sourceHashes();
const report = {
  url, startedAt: new Date().toISOString(), sourceHashes: hashes, runs: [],
  method: 'Lighthouse Node API attached to Playwright-launched installed Chrome; local production preview; three runs per form factor; median per category.',
  cacheConditions: 'A fresh Chrome process is launched per run. The application is loaded once to verify scene readiness and camera settlement, then the warm-up page is closed before Lighthouse navigation. OS, GPU driver and shader caches are not flushed; this is not a guaranteed cold-device benchmark. Individual run order is retained.',
  methodRevision: 2,
  documentation: ['https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md', 'https://github.com/GoogleChrome/lighthouse/blob/main/core/config/lr-desktop-config.js', 'https://playwright.dev/docs/api/class-browsertype'],
};
const port = 9224;
try {
  for (const preset of ['mobile', 'desktop']) {
    for (let run = 1; run <= 3; run++) {
      const browser = await chromium.launch({ channel: 'chrome', headless: true, args: [`--remote-debugging-port=${port}`] });
      try {
        report.browserVersion = browser.version();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => window.__MLB_DEBUG__?.sceneReady === true);
        await page.waitForFunction(() => window.__MLB_DEBUG__?.cameraSettled === true);
        const initialScene = await page.evaluate(() => ({ startup: window.__MLB_DEBUG__.startup, stats: window.__MLB_DEBUG__.stats, cameraSettled: window.__MLB_DEBUG__.cameraSettled }));
        await page.close();
        const config = preset === 'desktop' ? desktop : { extends: 'lighthouse:default' };
        const result = await lighthouse(url, { port, logLevel: 'error', output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, config);
        if (!result) throw new Error('Lighthouse returned no result');
        await writeFile(`${dir}/${preset}-${run}.json`, JSON.stringify(result.lhr, null, 2));
        const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, category.score === null ? null : Math.round(category.score * 100)]));
        const findings = Object.entries(result.lhr.audits).filter(([, audit]) => audit.score !== null && audit.score < 1).map(([id, audit]) => ({ id, title: audit.title, score: audit.score, displayValue: audit.displayValue }));
        report.runs.push({ preset, run, initialScene, scores, findings, runtimeError: result.lhr.runtimeError, configSettings: result.lhr.configSettings });
        console.log(JSON.stringify({ preset, run, scores }));
      } finally {
        await browser.close();
      }
    }
  }
  report.medians = Object.fromEntries(['mobile', 'desktop'].map(preset => [preset, Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo'].map(category => {
    const values = report.runs.filter(run => run.preset === preset).map(run => run.scores[category]);
    return [category, values.some(value => value === null) ? null : values.sort((a, b) => a - b)[1]];
  }))]));
} catch (error) {
  report.failure = String(error);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  report.sourceStable = JSON.stringify(hashes) === JSON.stringify(await sourceHashes());
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ medians: report.medians, failure: report.failure, sourceStable: report.sourceStable }));
}
