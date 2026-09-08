import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const rows = (await readFile('reference/clothes/manifest.csv', 'utf8')).trim().split(/\r?\n/).slice(1).map(line => {
  const [id, group, stock, file, source] = line.split(',');
  const colorCode = source.match(/\/ec\/([^/]+)/)[1].slice(id.length);
  return { id, group, stock: Number(stock), colorCode, page: `https://www.mlb-korea.com/product-detail/${id.slice(4)}-${colorCode}` };
});
const output = 'evidence/unique-clothing-20260908';
await mkdir(output, { recursive: true });
const count = Number(process.argv[2] ?? 40);
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < Math.min(count, rows.length)) {
    const row = rows[cursor++];
    try {
      const response = await fetch(row.page, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const urls = [...new Set((html.match(/https:[^"<>\s]*?\/images\/goods\/[^"<>\s]+?\.(?:png|jpg)/g) ?? []).map(url => url.replace(/\/cdn-cgi\/image\/[^/]+/, '')))].filter(url => url.includes(`/ec/${row.id}${row.colorCode}/thnail/`));
      const dir = `reference/clothes-detail/${row.id}`;
      await mkdir(dir, { recursive: true });
      const assets = [];
      for (const [index, url] of urls.slice(0, 6).entries()) {
        const path = `${dir}/gallery-${index}.${url.endsWith('.png') ? 'png' : 'jpg'}`;
        let bytes;
        try { await access(path); bytes = await readFile(path); }
        catch { const image = await fetch(url, { signal: AbortSignal.timeout(30000) }); if (!image.ok) throw new Error(`Image HTTP ${image.status}`); bytes = Buffer.from(await image.arrayBuffer()); await writeFile(path, bytes, { flag: 'wx' }); }
        assets.push({ path, url, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
      }
      const result = { ...row, galleryCount: urls.length, assets, verification: 'pending visual inspection' };
      await writeFile(`${dir}/gallery-provenance.json`, JSON.stringify(result, null, 2));
      results.push(result);
      console.log(`${row.id}: ${assets.length} gallery sources`);
    } catch (error) { results.push({ ...row, error: String(error) }); console.log(`${row.id}: ${error}`); }
  }
}));
await writeFile(`${output}/discovery.json`, JSON.stringify(results.sort((a,b) => b.stock-a.stock), null, 2));
