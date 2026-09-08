import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const stage = process.env.CLOTHES_STAGE ?? 'after';
const dir = `evidence/clothes-fidelity-20260908/${stage}`;
await mkdir(dir, { recursive: true });
const report = { stage, errors: [], network: [], captures: [] };
report.sourcePage = 'https://www.mlb-korea.com/product-detail/3AMTV0164-02NYM';
report.references = [];
for (const side of ['front', 'rear']) {
  const source = `reference/clothes-detail/M26F3AMTV0164/${side}.png`;
  const asset = `public/products/clothes/M26F3AMTV0164-${side}.png`;
  const bytes = await readFile(source);
  assert.ok(bytes.equals(await readFile(asset)), 'Published photo must preserve the official source bytes');
  report.references.push({ side, source, asset, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1100 } });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.network.push({ url: response.url(), status: response.status() }); });
  for (const angle of ['front', 'offaxis', 'rear', 'rearOblique', 'right']) {
    await page.goto(`http://localhost:5175/scripts/products-preview.html?category=clothes&index=3&angle=${angle}`);
    await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
    const product = await page.evaluate(() => window.__PRODUCT_EVIDENCE__);
    const front = product.meshes.find(mesh => mesh.name === 'reference-visible-surface');
    const rear = product.meshes.find(mesh => mesh.name === 'reference-rear-surface');
    assert.deepEqual(rear.xyBounds, front.xyBounds, 'Front and rear must share one asymmetric garment silhouette at the side seam');
    for (const mesh of product.meshes.filter(mesh => mesh.name.startsWith('reference-'))) {
      assert.ok(mesh.materials.every(material => material.alphaTest === 0), 'Source transparency must blend over cloth rather than punch holes in its silhouette');
    }
    const visiblePixels = await page.locator('canvas').evaluate(canvas => {
      const gl = canvas.getContext('webgl2');
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let foreground = 0;
      for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 160 || pixels[i + 1] < 160 || pixels[i + 2] < 160) foreground++;
      return foreground;
    });
    assert.ok(visiblePixels > 3000, `${angle} must contain rendered clothing, not an empty canvas`);
    const path = `${dir}/${angle}.png`;
    await page.screenshot({ path });
    report.captures.push({ angle, path, visiblePixels, product: await page.evaluate(() => window.__PRODUCT_EVIDENCE__) });
  }
  if (report.errors.length || report.network.length) throw new Error('Product browser evidence contains failures');
} finally {
  await browser.close();
  await writeFile(`${dir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ captures: report.captures.length, errors: report.errors, network: report.network }));
}
