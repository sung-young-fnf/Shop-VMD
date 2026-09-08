import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { realCrown, realBill, realLowerAngle, VISOR_HALF_WIDTH } = await server.ssrLoadModule('/src/products/caps/real-surfaces.ts');
  const failures = [];
  const check = (name, run) => {
    try { run(); console.log(`PASS: ${name}`); }
    catch (error) { if (!(error instanceof assert.AssertionError)) throw error; failures.push(name); console.error(`FAIL: ${name}: ${error.message}`); }
  };
  // Given the annotated bill, when sampling its centerline, then the forward fall is visibly steeper.
  check('steeper bill pitch', () => {
    const root = realBill(0, 0), tip = realBill(0, 1);
    assert.ok(root.y - tip.y > .25, `drop=${root.y - tip.y}, expected > .25`);
    assert.ok(Math.abs(tip.z - 1.91) < 1e-12);
  });
  // Given the rear-local depth roll, when sampling the hem, then its original vertical slope remains unchanged.
  check('side-to-rear hem preserves original heights', () => {
    for (const cos of [.40, .3, 0, -.3, -.6, -.85]) {
      const point = realCrown(Math.acos(cos), Math.PI / 2);
      const expected = -.11 + .23 * cos;
      assert.ok(Math.abs(point.y - expected) < 1e-10, `hem height residual=${point.y - expected}`);
    }
    for (let index = 1; index <= 100; index++) {
      const theta = Math.PI / 2 + index / 100 * Math.PI / 2;
      assert.ok(realCrown(theta, Math.PI / 2).distanceTo(realCrown(theta - 1e-5, Math.PI / 2)) < 2e-5, 'Rolled hem stays continuous');
    }
  });
  // Given an elliptical dome target, when sampling the shoulder, then it no longer has the previous broad flat top.
  check('rounded crown shoulder', () => {
    const shoulder = realCrown(0, Math.PI / 4);
    assert.ok(shoulder.z < .8, `shoulder radius=${shoulder.z}, expected < .8`);
    assert.ok(realCrown(0, 0).distanceTo({ x: 0, y: 1.2, z: 0 }) < 1e-12);
  });
  check('rear opening stays bounded and seams remain attached', () => {
    const lower = realLowerAngle(Math.PI);
    const opening = realCrown(Math.PI, lower).y - realCrown(Math.PI, Math.PI / 2).y;
    assert.ok(opening > .55 && opening < .70, `gallery-6 enlarged opening=${opening}`);
    for (let step = 0; step <= 100; step++) {
      const u = step / 50 - 1;
      assert.ok(realBill(u, 0).distanceTo(realCrown(Math.asin(VISOR_HALF_WIDTH * u), Math.PI / 2)) < 1e-12);
    }
  });
  assert.deepEqual(failures, []);
} finally {
  await server.close();
}
