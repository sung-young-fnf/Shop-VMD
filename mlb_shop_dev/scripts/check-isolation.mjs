import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dev = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = JSON.parse(await readFile(path.join(dev, 'evidence/isolation/baseline.json'), 'utf8'));
const changed = [];
for (const entry of baseline.inventory) {
  const bytes = await readFile(path.join(baseline.source, entry.path));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== entry.sha256) changed.push(entry.path);
}
const result = { checkedAt: new Date().toISOString(), files: baseline.inventory.length, source: baseline.source, changed, preserved: changed.length === 0 };
await writeFile(path.join(dev, 'evidence/isolation/latest-check.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
if (changed.length) process.exitCode = 1;
