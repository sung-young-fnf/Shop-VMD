import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { realBill, realCrown } = await server.ssrLoadModule('/src/products/caps/real-surfaces.ts');
  // Given the source side silhouette, when sampling the attachment, then it ends ahead of the temple.
  const endpoint = realBill(1, 0);
  assert.ok(endpoint.z > .4 && endpoint.x < .93, `Visor wraps back to temple: ${endpoint.toArray()}`);
  // Given the bounded visor, when sampling the root, then every point still meets the crown.
  for (let index = 0; index <= 100; index++) {
    const u = index / 50 - 1;
    const root = realBill(u, 0);
    assert.ok(root.distanceTo(realCrown(Math.asin(root.x), Math.PI / 2)) < 1e-12);
    for (const q of [0, .25, .5, .75, 1]) {
      const point = realBill(u, q), mirror = realBill(-u, q);
      assert.ok(point.y > -.50, `Rolled bill exceeds gallery-5 front profile: ${point.toArray()}`);
      assert.ok(Math.abs(point.x + mirror.x) + Math.abs(point.y - mirror.y) + Math.abs(point.z - mirror.z) < 1e-12);
    }
  }
  assert.deepEqual(realBill(1, 1).toArray(), endpoint.toArray(), 'Side edge tapers into one crown attachment');
  assert.ok(Math.abs(realBill(0, 1).z - 1.91) < 1e-12, 'Preserve central bill reach');
  console.log('PASS: forward attachment, shared seam, bounded side drop, mirror symmetry, tip reach');
} finally {
  await server.close();
}
