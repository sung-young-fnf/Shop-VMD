import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { startEvidence, launch, watch, framebufferCapture, finish } from './qa-unique-support.mjs';

const evidence = await startEvidence('catalog', {
  directories: ['src/products/clothes', 'public/products/clothes'],
  files: ['src/products/loading.ts', 'scripts/qa-catalog-preview.html', 'scripts/qa-catalog-preview.mjs', 'scripts/qa-unique-catalog.mjs', 'scripts/qa-unique-support.mjs', 'package.json', 'pnpm-lock.yaml'],
}); const { report, dir } = evidence;
const browser = await launch(); let current = 'startup';
try {
  const page = await browser.newPage({ viewport: { width: 512, height: 640 } }); await watch(page, report);
  await page.goto('http://localhost:5175/scripts/qa-catalog-preview.html');
  await page.waitForFunction(() => window.__CATALOG_QA__?.ids.length, undefined, { timeout: 120000 });
  const ids = await page.evaluate(() => window.__CATALOG_QA__.ids);
  report.ids = ids; report.products = []; report.expectedFrames = ids.length * 2;
  assert.equal(new Set(ids).size, ids.length); assert.ok(ids.length > 0);
  for (const id of ids) {
    for (const side of ['front', 'rear']) {
      current = `${id}-${side}`;
      const rendered = await page.evaluate(({ id, side }) => window.__CATALOG_QA__.render(id, side), { id, side });
      const { png, ...state } = rendered; report.products.push(state);
      assert.equal(state.metadata.productId, id);
      assert.ok(state.size.every(value => Number.isFinite(value) && value > 0));
      assert.ok(state.stats.triangles > 0 && state.meshes.every(mesh => mesh.vertices > 0));
      const maps = state.meshes.flatMap(mesh => mesh.materials).filter(material => material.url);
      assert.ok(maps.some(map => map.url.endsWith(state.metadata.frontImage) && map.ready));
      assert.ok(maps.some(map => map.url.endsWith(state.metadata.rearImage) && map.ready));
      assert.notEqual(state.metadata.frontImage, state.metadata.rearImage);
      await framebufferCapture(page, evidence, current, state, png);
    }
    console.log(JSON.stringify({ completed: id, frames: report.captures.length, total: report.expectedFrames }));
  }
  report.contactSheets = [];
  const contact = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  for (let start = 0; start < ids.length; start += 12) {
    const subset = ids.slice(start, start + 12); const cells = [];
    for (const id of subset) for (const side of ['front', 'rear']) {
      const bytes = await readFile(`${dir}/${id}-${side}-framebuffer.png`);
      cells.push(`<figure><img src="data:image/png;base64,${bytes.toString('base64')}"><figcaption>${id} · ${side}</figcaption></figure>`);
    }
    await contact.setContent(`<style>body{margin:0;background:#eee;font:12px sans-serif;display:grid;grid-template-columns:repeat(8,1fr)}figure{margin:0;padding:5px}img{width:180px;height:225px;object-fit:contain}figcaption{text-align:center;overflow-wrap:anywhere}</style>${cells.join('')}`);
    await contact.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
    const path = `${dir}/contact-${String(start / 12).padStart(2, '0')}.png`; await contact.screenshot({ path, fullPage: true });
    report.contactSheets.push({ path, ids: subset, frames: subset.length * 2 });
  }
  assert.equal(report.captures.length, report.expectedFrames);
  assert.deepEqual(report.errors, []); assert.deepEqual(report.graphics, []); report.pass = true;
} catch (error) { report.failure = `${current}: ${error.stack ?? error}`; }
finally { await finish(evidence, browser); }
