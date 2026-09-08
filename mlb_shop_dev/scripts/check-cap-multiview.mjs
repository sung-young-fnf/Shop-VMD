import assert from 'node:assert/strict';
import { createServer } from 'vite';
import * as THREE from 'three';

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { realBill, realCrown, VISOR_HALF_WIDTH } = await server.ssrLoadModule('/src/products/caps/real-surfaces.ts');
  // Given gallery-5's nearly crown-wide free edge, when sampling it, then the visor is not a narrow tongue.
  const edge = Array.from({ length: 201 }, (_, i) => realBill(i / 100 - 1, 1));
  const halfWidth = Math.max(...edge.map(point => point.x));
  assert.ok(halfWidth > .95 && halfWidth < 1.05, `bill half-width ${halfWidth}`);
  // Given the source's upward central arch, when seen near eye level, then both corners sit below the center.
  const target = new THREE.Vector3(0, .082, .015);
  const camera = new THREE.PerspectiveCamera(10, 1000 / 900, .001, 100);
  camera.position.copy(target).add(new THREE.Vector3(0, Math.sin(.14), Math.cos(.14)).multiplyScalar(2));
  camera.lookAt(target); camera.updateMatrixWorld();
  const project = point => point.clone().multiplyScalar(.1).add(new THREE.Vector3(0, .028, 0)).project(camera);
  const left = project(realCrown(-Math.PI / 2, Math.PI / 2)), right = project(realCrown(Math.PI / 2, Math.PI / 2));
  const projected = edge.map(project);
  const archRatio = (project(realBill(0, 1)).y - Math.min(...projected.map(point => point.y))) * 900 / ((right.x - left.x) * 1000);
  assert.ok(archRatio > .10 && archRatio < .14, `gallery-5 projected arch ratio ${archRatio}`);
  // Given independently curved visor, when its root is sampled, then every point shares the crown boundary.
  for (let i = 0; i <= 100; i++) {
    const u = i / 50 - 1;
    assert.ok(realBill(u, 0).distanceTo(realCrown(Math.asin(VISOR_HALF_WIDTH * u), Math.PI / 2)) < 1e-12);
    for (const q of [0, .25, .5, 1]) {
      const point = realBill(u, q), mirror = realBill(-u, q);
      assert.ok(Math.abs(point.x + mirror.x) + Math.abs(point.y - mirror.y) + Math.abs(point.z - mirror.z) < 1e-12);
    }
  }
  console.log('PASS: source-derived bill width, transverse arch, continuity and symmetry');
} finally { await server.close(); }
