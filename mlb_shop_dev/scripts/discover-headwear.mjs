import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const output = 'evidence/headwear-assortment-20260908';
const rows = (await readFile('reference/caps/manifest.csv', 'utf8')).trim().split(/\r?\n/).slice(1).map(line => {
  const [id, group, stock, file, source] = line.split(',');
  const identity = source.match(/\/ec\/([^/]+)/)?.[1];
  const matchesSku = Boolean(identity?.startsWith(id));
  const colorCode = matchesSku ? identity.slice(id.length) : '';
  return { id, group, stock: Number(stock), colorCode, source, matchesSku, page: `https://www.mlb-korea.com/product-detail/${id.slice(4)}-${colorCode}` };
});
await mkdir(output, { recursive: true });
let cursor = 0;
const results = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < rows.length) {
    const row = rows[cursor++];
    const dir = `reference/headwear-detail/${row.id}`;
    try {
      if (!row.matchesSku) throw new Error('Manifest photograph belongs to another SKU; excluded');
      const response = await fetch(row.page, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Page HTTP ${response.status}`);
      const html = await response.text();
      const urls = [...new Set((html.match(/https:[^"<>\s]*?\/images\/goods\/[^"<>\s]+?\.(?:png|jpg)/g) ?? []).map(url => url.replace(/\/cdn-cgi\/image\/[^/]+/, '')))]
        .filter(url => url.includes(`/ec/${row.id}${row.colorCode}/`)).slice(0, 12);
      await mkdir(dir, { recursive: true });
      const assets = [];
      for (const [index, url] of urls.entries()) {
        const path = `${dir}/gallery-${index}.${url.endsWith('.png') ? 'png' : 'jpg'}`;
        let bytes;
        try { bytes = await readFile(path); }
        catch (error) {
          if (error.code !== 'ENOENT') throw error;
          const image = await fetch(url, { signal: AbortSignal.timeout(30000) });
          if (!image.ok) throw new Error(`Image HTTP ${image.status}`);
          bytes = Buffer.from(await image.arrayBuffer());
          await writeFile(path, bytes, { flag: 'wx' });
        }
        assets.push({ path, url, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
      }
      const result = { ...row, assets, verification: 'pending visual classification; no assumed view roles' };
      await writeFile(`${dir}/provenance.json`, JSON.stringify(result, null, 2));
      results.push(result);
      console.log(`${row.id}: ${assets.length} same-color sources`);
    } catch (error) {
      results.push({ ...row, error: String(error), assets: [] });
      console.log(`${row.id}: ${error}`);
    }
  }
}));
await writeFile(`${output}/discovery.json`, JSON.stringify(results.sort((a, b) => b.stock - a.stock), null, 2));
