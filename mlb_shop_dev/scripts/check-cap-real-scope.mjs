import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const priorCaps = JSON.parse(await readFile('evidence/caps-cad-20260908/cad-final-review/report.json'));
const priorStore = JSON.parse(await readFile('evidence/caps-cad-20260908/store/store-2026-09-08T05-43-01-059Z/report.json'));
const expected = Object.fromEntries([
  ...Object.entries(priorCaps.source.hashes).filter(([path]) => /^(public\/products\/caps|reference\/caps)/.test(path) || /^src\/products\/caps\/(cad-|index)/.test(path)),
  ...Object.entries(priorStore.sourceHashes).filter(([path]) => /^(src|public)\/products\/(clothes|shoes)\//.test(path)),
]);
const report = { checkedAt: new Date().toISOString(), checked: 0, changed: [], pass: false };
for (const [path, hash] of Object.entries(expected)) {
  const actual = createHash('sha256').update(await readFile(path)).digest('hex');
  report.checked++;
  if (actual !== hash) report.changed.push(path);
}
report.pass = report.changed.length === 0;
const output = `evidence/cap-real-hybrid-20260908/scope-${report.checkedAt.replace(/[:.]/g, '-')}.json`;
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, ...report }));
assert.equal(report.pass, true, 'Excluded product code and original/cached photograph bytes remain unchanged');
