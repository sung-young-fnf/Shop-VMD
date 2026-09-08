import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const manifestPath = resolve('evidence/clothing-promotion-20260908-0200/postbuild-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath));
const operating = resolve('../mlb_shop');
const report = { checkedAt: new Date().toISOString(), operating, manifestPath, inventoryParts: manifest.inventoryParts, expectedFiles: manifest.totalFiles, checkedFiles: 0, changed: [], missing: [], pass: false };
const inventory = [];
for (const part of manifest.inventoryParts) inventory.push(...JSON.parse(await readFile(resolve(dirname(manifestPath), part))).inventory);
assert.equal(inventory.length, manifest.totalFiles);
assert.equal(new Set(inventory.map(item => item.path)).size, manifest.totalFiles);
for (const item of inventory) {
  try {
    const bytes = await readFile(resolve(operating, item.path));
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    if (sha256 !== item.sha256 || bytes.length !== item.bytes) report.changed.push({ path: item.path, expected: item.sha256, actual: sha256 });
    report.checkedFiles++;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    report.missing.push(item.path);
  }
}
report.pass = report.checkedFiles === manifest.totalFiles && !report.changed.length && !report.missing.length;
await mkdir('evidence/accessory-resume-20260908', { recursive: true });
const output = `evidence/accessory-resume-20260908/operating-preservation-${report.checkedAt.replace(/[:.]/g, '-')}.json`;
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, pass: report.pass, checkedFiles: report.checkedFiles, changed: report.changed, missing: report.missing }));
if (!report.pass) process.exitCode = 1;
