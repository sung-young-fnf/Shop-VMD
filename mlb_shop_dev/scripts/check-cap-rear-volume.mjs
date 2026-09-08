import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const root = 'evidence/cap-rear-volume-20260908';
await mkdir(root, { recursive: true });
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { realCrown, realBill } = await server.ssrLoadModule('/src/products/caps/real-surfaces.ts');
  const front = [], bill = [];
  for (let angle = 0; angle <= 36; angle++) for (let row = 0; row <= 20; row++) {
    const theta = -Math.PI / 2 + angle / 36 * Math.PI, t = row / 20 * Math.PI / 2;
    front.push({ theta, t, point: realCrown(theta, t).toArray().map(value => value + 0) });
  }
  for (let column = 0; column <= 40; column++) for (let row = 0; row <= 20; row++) {
    const u = column / 20 - 1, q = row / 20;
    bill.push({ u, q, point: realBill(u, q).toArray().map(value => value + 0) });
  }
  if (process.argv[2] === 'record-baseline') {
    await writeFile(`${root}/front-bill-baseline.json`, JSON.stringify({ front, bill }, null, 2), { flag: 'wx' });
    console.log('Recorded immutable pre-change front and bill baseline');
  } else {
    const baseline = JSON.parse(await readFile(`${root}/front-bill-baseline.json`, 'utf8'));
    assert.deepEqual(front, baseline.front, 'Forward hemisphere must remain exactly unchanged');
    assert.deepEqual(bill, baseline.bill, 'Every sampled bill vertex must remain exactly unchanged');
    // Given the real side photo, when following a posterior meridian toward its hem, then it rolls inward after a broad bulge.
    const theta = Math.PI - .55;
    const hem = realCrown(theta, Math.PI / 2);
    const samples = Array.from({ length: 101 }, (_, index) => realCrown(theta, .5 + index / 100 * (Math.PI / 2 - .5)));
    const outer = samples.reduce((best, point) => point.z < best.z ? point : best);
    const returnDepth = hem.z - outer.z;
    assert.ok(returnDepth > .045 && returnDepth < .13, `Posterior inward return ${returnDepth}`);
    assert.ok(outer.y - hem.y > .20 && outer.y - hem.y < .65, `Bulge above hem ${outer.y - hem.y}`);
    assert.ok(realCrown(theta, 1.0).z < -.78, 'Lower posterior has broad volume rather than a tip-only fillet');
    console.log(JSON.stringify({ pass: true, returnDepth, bulgeAboveHem: outer.y - hem.y, frontSamples: front.length, billSamples: bill.length }));
  }
} finally { await server.close(); }
