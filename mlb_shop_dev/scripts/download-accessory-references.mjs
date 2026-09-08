import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const targets = [
  { category: 'caps', sku: 'M21N3ACP7701N', page: '3ACP7701N-50NYS' },
  { category: 'shoes', sku: 'M26N3ACVSP46N', page: '3ACVSP46N-07CRS' },
];
for (const target of targets) {
  const page = `https://www.mlb-korea.com/product-detail/${target.page}`;
  const response = await fetch(page, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Gallery HTTP ${response.status}`);
  const html = await response.text();
  const links = [...new Set((html.match(/https:[^"<>\s]*?\/images\/goods\/[^"<>\s]+?\.(?:png|jpg)/g) ?? [])
    .map(link => link.replace(/\/cdn-cgi\/image\/[^/]+/, '')))].slice(0, 9);
  const dir = `reference/${target.category}-detail/${target.sku}`;
  await mkdir(dir, { recursive: true });
  const assets = [];
  for (const [index, url] of links.entries()) {
    const image = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!image.ok) throw new Error(`Image HTTP ${image.status}: ${url}`);
    const bytes = Buffer.from(await image.arrayBuffer());
    const path = `${dir}/gallery-${index}.${url.endsWith('.png') ? 'png' : 'jpg'}`;
    await writeFile(path, bytes, { flag: 'wx' });
    assets.push({ path, url, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  await writeFile(`${dir}/provenance.json`, JSON.stringify({ ...target, page, assets }, null, 2), { flag: 'wx' });
  console.log(JSON.stringify({ sku: target.sku, assets }));
}
