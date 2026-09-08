import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export async function accessoryHashes(categories) {
  const directories = categories.flatMap(category => [`src/products/${category}`, `public/products/${category}`, `reference/${category}`, `reference/${category}-detail`]);
  const files = ['src/products/photo-material.ts', 'src/products/loading.ts', 'scripts/products-preview.mjs', 'scripts/products-preview.html', 'scripts/qa-accessory-fidelity.mjs', 'scripts/qa-accessory-hashes.mjs', 'package.json', 'pnpm-lock.yaml'];
  async function collect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await collect(path); else files.push(path);
    }
  }
  for (const directory of directories) await collect(directory);
  const hashes = {};
  for (const path of files.sort()) hashes[path] = digest(await readFile(path));
  return { scope: { categories, directories, shared: 'photo-material, loading, preview, QA harness and package closure' }, hashes };
}
