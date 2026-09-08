import { readFile, writeFile, mkdir, access, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { headwearSources } from './headwear-curation.mjs';

const output = 'evidence/headwear-assortment-20260908';
let cursor = 0;
const delivery = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < headwearSources.length) {
    const source = headwearSources[cursor++];
    const dir = `public/products/headwear/${source.id}`;
    await mkdir(dir, { recursive: true });
    const photos = {};
    for (const [role, index] of ['front', 'rear', 'side'].map((role, i) => [role, source.roles[i]])) {
      if (index < 0) continue;
      const original = source.assets[index];
      const width = ['M26F3ABNB1166','M26F3ABNB1866'].includes(source.id) ? 768 : 512;
      const url = original.url.replace('/images/goods/', `/cdn-cgi/image/width=${width},format=png/images/goods/`);
      let bytes, existing;
      for (const extension of ['png','jpg']) {
        try { existing = `${dir}/${role}-g${index}.${extension}`; bytes = await readFile(existing); break; }
        catch (error) { if (error.code !== 'ENOENT') throw error; existing = undefined; }
      }
      if (!bytes) {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`${source.id} ${role}: HTTP ${response.status}`);
        bytes = Buffer.from(await response.arrayBuffer());
      }
      const extension = bytes.toString('ascii',1,4)==='PNG'?'png':bytes[0]===255&&bytes[1]===216?'jpg':null;
      if (!extension) throw new Error(`Unsupported delivery image: ${source.id}/${role}`);
      const path=`${dir}/${role}-g${index}.${extension}`;
      if(existing && existing!==path) await rename(existing,path);
      if(!existing) await writeFile(path,bytes,{flag:'wx'});
      photos[role] = { ...original, galleryIndex: index, delivery: { path, texture: `headwear/${source.id}/${role}-g${index}.${extension}`, url, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), transform: 'Official CDN width resize; requested PNG, actual PNG/JPEG detected by signature; original source unchanged' } };
    }
    let cadSource = `reference/caps/${source.id}.jpg`;
    try { await access(cadSource); }
    catch (error) { if (error.code !== 'ENOENT') throw error; cadSource = null; }
    delivery.push({ ...source, photos, cadSource });
    console.log(`${source.id}: ${Object.keys(photos).length} photo surfaces`);
  }
}));
await writeFile(`${output}/delivery.json`, JSON.stringify(delivery.sort((a, b) => a.priority - b.priority), null, 2));
