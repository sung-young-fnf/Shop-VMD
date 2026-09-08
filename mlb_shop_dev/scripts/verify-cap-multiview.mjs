import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = process.env.CAP_EVIDENCE_ROOT ?? 'evidence/cap-multiview-20260908';
const sourceStage = process.env.CAP_SOURCE_STAGE ?? 'final-closure';
const evidence = JSON.parse(await readFile(`${root}/${sourceStage}/report.json`, 'utf8'));
const sha = async file => createHash('sha256').update(await readFile(file)).digest('hex');
const production = Object.keys(evidence.sourceHashes).filter(file => file.startsWith('src/'));
for (const file of production) assert.equal(await sha(file), evidence.sourceHashes[file]);
const report = { sourceHashes: Object.fromEntries(await Promise.all(production.map(async file => [file, await sha(file)]))), runs: [], pass: false };
const tests = ['check-cap-multiview', 'check-cap-real-frame', 'check-cap-round-profile', 'check-cap-brim-profile', 'check-cap-cad', 'check-cap-batching', 'check-cap-rear-volume'];
try {
  for (const test of tests) {
    const result = spawnSync(process.execPath, [`scripts/${test}.mjs`], { encoding: 'utf8' });
    report.runs.push({ command: `node scripts/${test}.mjs`, status: result.status, stdout: result.stdout, stderr: result.stderr });
    assert.equal(result.status, 0, `${test} failed`);
  }
  const build = spawnSync('npm', ['run', 'build'], { encoding: 'utf8', shell: true });
  report.runs.push({ command: 'npm run build (tsc --noEmit + vite build)', status: build.status, stdout: build.stdout, stderr: build.stderr });
  assert.equal(build.status, 0);
  const runtime = (await readdir('dist/assets')).find(file => /^runtime-.*\.js$/.test(file));
  assert.ok(runtime);
  report.runtime = { file: `dist/assets/${runtime}`, sha256: await sha(`dist/assets/${runtime}`) };
  for (const file of production) assert.equal(await sha(file), report.sourceHashes[file]);
  report.pass = true;
} finally {
  await writeFile(`${root}/frozen-verification.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pass: report.pass, runs: report.runs.length, runtime: report.runtime }));
}
