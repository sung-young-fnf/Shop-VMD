import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

export async function verifyPromotion(projectRoot, sourceHashes) {
  const manifestPath = process.env.MLB_QA_PROMOTION_MANIFEST;
  assert.ok(manifestPath, 'Operating QA requires promotion manifest');
  const bytes = await readFile(manifestPath); const manifest = JSON.parse(bytes);
  assert.equal(resolve(manifest.root), projectRoot);
  const accessory = /^(?:src\/products|public\/products|dist\/products)\/(?:caps|shoes)\//;
  const before = manifest.before.filter(item => accessory.test(item.path));
  assert.ok(before.length > 0, 'Accessory pre-promotion hashes required');
  assert.deepEqual(Object.keys(sourceHashes).filter(path => accessory.test(path)).sort(), before.map(item => item.path).sort(), 'No accessory files added or removed');
  for (const item of before) assert.equal(sourceHashes[item.path], item.sha256, `Accessory unchanged: ${item.path}`);
  const allowlist = new Set([...manifest.code, ...manifest.assets]);
  const unchangedSource = manifest.before.filter(item => /^(src|public)\//.test(item.path) && !allowlist.has(item.path));
  for (const item of unchangedSource) assert.equal(sourceHashes[item.path], item.sha256, `Outside promotion allowlist unchanged: ${item.path}`);
  return { manifestPath, manifestSha256: createHash('sha256').update(bytes).digest('hex'), accessoryFilesUnchanged: before, outsideAllowlistUnchanged: unchangedSource.length, codeFiles: manifest.code.length, clothingPhotos: manifest.assets.length };
}
