import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const directory = 'evidence/cap-store-integration-20260908';
const sha = async file => createHash('sha256').update(await readFile(file)).digest('hex');
const accepted = JSON.parse(await readFile('evidence/cap-rear-volume-20260908/final-corrected/report.json', 'utf8'));
const source = [
  ...(await readdir('src/products/caps')).filter(file => file.endsWith('.ts')).map(file => `src/products/caps/${file}`),
  'src/wall-fixtures/cabinet-details.ts', 'src/wall-fixtures/apparel-details.ts',
  'src/central-fixtures/merchandise.ts', 'src/central-fixtures/furniture.ts',
  'scripts/cap-store-preview.mjs', 'scripts/check-cap-store-placement.mjs', 'cap-store-preview.html',
];
const sourceHashes = Object.fromEntries(await Promise.all(source.map(async file => [file, await sha(file)])));
for (const [file, hash] of Object.entries(accepted.sourceHashes)) if (file.startsWith('src/products/caps/')) assert.equal(await sha(file), hash, `Accepted cap surface changed: ${file}`);
const originals = (await readdir('reference/caps-detail/M21N3ACP7701N')).filter(file => file.endsWith('.png')).map(file => `reference/caps-detail/M21N3ACP7701N/${file}`);
const report = { time: new Date().toISOString(), sourceHashes, originalHashes: Object.fromEntries(await Promise.all(originals.map(async file => [file, await sha(file)]))), runs: [], pass:false };
try {
  const tests = ['check-cap-multiview','check-cap-real-frame','check-cap-round-profile','check-cap-brim-profile','check-cap-cad','check-cap-batching','check-cap-rear-volume','check-cap-store-placement'];
  for (const test of tests) {
    const result = spawnSync(process.execPath, [`scripts/${test}.mjs`], { encoding:'utf8', maxBuffer:10*1024*1024 });
    report.runs.push({ command:`node scripts/${test}.mjs`, status:result.status, stdout:result.stdout, stderr:result.stderr });
    assert.equal(result.status,0,test);
  }
  const build = spawnSync('npm',['run','build'],{ encoding:'utf8', shell:true });
  report.runs.push({ command:'npm run build (tsc --noEmit + vite build)', status:build.status, stdout:build.stdout, stderr:build.stderr });
  assert.equal(build.status,0);
  const runtime = (await readdir('dist/assets')).find(file => /^runtime-.*\.js$/.test(file));
  assert.ok(runtime);
  report.runtime = { file:`dist/assets/${runtime}`, sha256:await sha(`dist/assets/${runtime}`) };
  for (const [file,hash] of Object.entries(sourceHashes)) assert.equal(await sha(file),hash,`Source changed during verification: ${file}`);
  report.pass = true;
} finally {
  await writeFile(`${directory}/frozen-verification.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify({ pass:report.pass,runs:report.runs.map(run=>({command:run.command,status:run.status})),runtime:report.runtime }));
}
