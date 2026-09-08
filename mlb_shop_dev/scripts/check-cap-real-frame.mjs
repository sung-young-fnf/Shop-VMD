import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
try {
  THREE.TextureLoader.prototype.load = function () { return new THREE.Texture(); };
  const { createPhotoCap } = await server.ssrLoadModule('/src/products/caps/photo-cap.ts');
  const cap = createPhotoCap();
  assert.equal(cap.children.filter(child => child.name.startsWith('real-crown-panel-')).length, 6, 'The user-selected frame has six actual surface panels');
  const { realCrown, realBill, VISOR_HALF_WIDTH } = await server.ssrLoadModule('/src/products/caps/real-surfaces.ts');
  for (let step = 0; step <= 100; step++) {
    const u = step / 50 - 1;
    assert.ok(realBill(u, 0).distanceTo(realCrown(Math.asin(VISOR_HALF_WIDTH * u), Math.PI / 2)) < 1e-12, 'Photo-corrected forward visor and crown share the same attachment equation');
  }
  assert.ok(realCrown(0, 0).distanceTo(new THREE.Vector3(0, 1.2, 0)) < 1e-12);
  assert.ok(realCrown(0, Math.PI / 2).distanceTo(new THREE.Vector3(0, .26, 1.05)) < 1e-12);
  assert.ok(realBill(0, 1).distanceTo(new THREE.Vector3(0, -.035, 1.91)) < 1e-12, 'User-requested steeper tip preserves forward reach');
  assert.equal(cap.scale.x, .1); assert.equal(cap.scale.y, .1); assert.equal(cap.scale.z, .1);
  console.log('Cap-real frame: six panels, reference equations and shared seam PASS');
} finally {
  THREE.TextureLoader.prototype.load = originalLoad;
  await server.close();
}
