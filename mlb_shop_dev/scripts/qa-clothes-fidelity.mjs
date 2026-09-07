import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const stage = process.env.CLOTHES_STAGE ?? 'after';
const dir = `evidence/clothes-fidelity-20260908/${stage}`;
await mkdir(dir, { recursive: true });
const report = { stage, errors: [], network: [], captures: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1100 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.network.push({ url: response.url(), status: response.status() }); });
  for (const angle of ['front', 'offaxis', 'rear', 'rearOblique', 'right']) {
    await page.goto(`http://localhost:5175/scripts/products-preview.html?category=clothes&index=3&angle=${angle}`);
    await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
    const visiblePixels = await page.locator('canvas').evaluate(canvas => {
      const gl = canvas.getContext('webgl2');
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let foreground = 0;
      for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 160 || pixels[i + 1] < 160 || pixels[i + 2] < 160) foreground++;
      return foreground;
    });
    assert.ok(visible