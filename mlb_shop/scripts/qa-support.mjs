import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

export const url = process.env.MLB_QA_URL ?? 'http://127.0.0.1:4174';
export const hash = async path => createHash('sha256').update(await readFile(path)).digest('hex');
export async function sourceHashes() {
  async function files(dir) {
    const list = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      list.push(...(entry.isDirectory() ? await files(path) : [path]));
    }
    return list;
  }
  const rootFiles = (await readdir('.', { withFileTypes: true })).filter(entry => entry.isFile() && (/\.(json|html|[cm]?[jt]s)$/.test(entry.name) || ['pnpm-lock.yaml', 'DESIGN.md'].includes(entry.name))).map(entry => entry.name);
  const paths = [...await files('src'), ...await files('public'), ...await files('dist'), ...rootFiles].sort();
  return Object.fromEntries(await Promise.all(paths.map(async path => [path, await hash(path)])));
}
export async function launch() {
  return chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl'], ignoreDefaultArgs: ['--disable-back-forward-cache'] });
}
export async function evidence(stage) {
  const dir = `evidence/browser/${stage}`;
  await mkdir(dir, { recursive: true });
  const report = { stage, url, startedAt: new Date().toISOString(), browser: {}, sourceHashes: await sourceHashes(), captures: [], checks: [], errors: [], consoleErrors: [], failedRequests: [], accessibility: [] };
  return {
    dir, report,
    watch(page) {
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
      page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), failure: request.failure() }));
      page.on('response', response => { if (response.status() >= 400) report.failedRequests.push({ url: response.url(), status: response.status() }); });
    },
    async capture(page, name, state, { settleCss = true } = {}) {
      const path = `${dir}/${name}.png`;
      if (settleCss) await page.waitForTimeout(200);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.screenshot({ path });
      const bytes = await readFile(path);
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      const dimensions = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
      assert.deepEqual(dimensions, page.viewportSize());
      report.captures.push({ name, path, dimensions, sha256: await hash(path), state, capturedAt: new Date().toISOString() });
    },
    async accessibility(page, name) {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      await writeFile(`${dir}/axe-${name}.json`, JSON.stringify(result, null, 2));
      report.accessibility.push({ name, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
    },
    async finish() {
      report.finishedAt = new Date().toISOString();
      const current = await sourceHashes();
      report.sourceStable = JSON.stringify(current) === JSON.stringify(report.sourceHashes);
      await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
      return report;
    },
  };
}
export async function layout(page) {
  return page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    buttons: [...document.querySelectorAll('button')].filter(el => el.getClientRects().length).map(el => {
      const rect = el.getBoundingClientRect();
      return { label: el.textContent.trim(), ariaLabel: el.getAttribute('aria-label'), width: rect.width, height: rect.height, x: rect.x, y: rect.y };
    }),
  }));
}
