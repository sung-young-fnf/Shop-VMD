import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const dir = 'evidence/headwear-assortment-20260908';
const entries = JSON.parse(await readFile(`${dir}/discovery.json`, 'utf8')).filter(row => row.assets.length);
await mkdir(`${dir}/intake`, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (let start = 0; start < entries.length; start += 6) {
    const page = await browser.newPage({ viewport: { width: 2240, height: 1320 }, deviceScaleFactor: 1 });
    await page.route('https://headwear.local/**', async route => {
      const path = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
      try { await route.fulfill({ body: await readFile(path), contentType: path.endsWith('.png') ? 'image/png' : 'image/jpeg' }); }
      catch (error) { if (error.code !== 'ENOENT') throw error; await route.fulfill({ status: 404, body: '' }); }
    });
    let html = '<body style="margin:0;background:#ddd;font:13px Arial">';
    for (const [offset, entry] of entries.slice(start, start + 6).entries()) {
      html += `<section style="height:218px;display:flex;border-bottom:2px solid #555"><div style="width:130px;flex-shrink:0">${start + offset}: ${entry.id}<br>${entry.colorCode}</div>`;
      const paths = [`reference/caps/${entry.id}.jpg`, ...entry.assets.map(asset => asset.path)];
      for (const [index, path] of paths.entries()) html += `<div style="width:158px;text-align:center">${index === 0 ? 'CAD' : index - 1}<br><img style="width:154px;height:193px;object-fit:contain" src="https://headwear.local/${path}"></div>`;
      html += '</section>';
    }
    await page.setContent(html + '</body>');
    await page.locator('img').evaluateAll(images => Promise.all(images.filter(image => image.complete && image.naturalWidth).map(image => image.decode())));
    await page.waitForFunction(() => [...document.images].every(image => image.complete));
    await page.screenshot({ path: `${dir}/intake/sheet-${String(start / 6).padStart(2, '0')}.png`, fullPage: true });
    await page.close();
  }
} finally { await browser.close(); }
