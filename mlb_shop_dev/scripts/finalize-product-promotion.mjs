import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('..');
const operating = path.join(root, 'mlb_shop');
const record = 'evidence/promotion-20260907-products';
const baselinePath = 'evidence/isolation/baseline.json';
const baseline = JSON.parse(await readFile(`${record}/backup/isolation-baseline.json`, 'utf8'));
const allowed = new Set([
  'src/central-fixtures/merchandise.ts', 'src/wall-fixtures/merchandise.ts',
  'src/wall-fixtures/surfaces.ts', 'src/runtime/debug.ts',
  'src/runtime/index.ts', 'src/runtime/scene.ts', 'dist/index.html',
]);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const changed = [];
for (const entry of baseline.inventory) {
  const relative = entry.path.replaceAll('\\', '/');
  const bytes = await readFile(path.join(operating, relative));
  if (digest(bytes) !== entry.sha256) {
    assert.ok(allowed.has(relative), `Unexpected operating change: ${relative}`);
    changed.push(relative);
  }
}
async function files(directory, relative = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.cache', '.vite', '.git'].includes(entry.name)) continue;
    const name = relative ? `${relative}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(absolute, name));
    else {
      const bytes = await readFile(absolute);
      result.push({ path: name, bytes: bytes.length, sha256: digest(bytes) });
    }
  }
  return result;
}
const inventory = (await files(operating)).sort((a, b) => a.path.localeCompare(b.path));
const report = {
  promotedAt: new Date().toISOString(), source: operating,
  authorization: 'User explicitly requested operating promotion of product images.',
  changedExistingFiles: changed, inventory,
  excluded: ['DEV branding', 'GPU context recovery', 'driver changes'],
  previousBaseline: 'promotion-20260907-products/backup/isolation-baseline.json',
};
await writeFile(`${record}/manifest.json`, JSON.stringify(report, null, 2));
await writeFile(baselinePath, JSON.stringify({ ...baseline, source: operating, inventory, approvedPromotion: report.promotedAt, previousBaseline: report.previousBaseline }, null, 2));
console.log(JSON.stringify({ changed, currentFiles: inventory.length, originalFiles: baseline.inventory.length }));
