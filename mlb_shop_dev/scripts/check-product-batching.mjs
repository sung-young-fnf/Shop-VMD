import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { mock } from 'node:test';

const baseline = process.argv.includes('--baseline');
const baselineSource = baseline ? await readFile(new URL('../../mlb_shop/src/wall-fixtures/surfaces.ts', import.meta.url), 'utf8') : null;
const server = await createServer({
  server: { middlewareMode: true }, appType: 'custom',
  plugins: baselineSource ? [{ name: 'read-only-operating-batch-baseline', enforce: 'pre', transform(_code, id) {
    if (id.replaceAll('\\', '/').endsWith('/src/wall-fixtures/surfaces.ts')) return baselineSource;
  } }] : [],
});
try {
  const { batchFixture } = await server.ssrLoadModule('/src/wall-fixtures/surfaces.ts');
  const fixture = new THREE.Group();
  fixture.position.set(3, 1, 4);
  const material = new THREE.MeshStandardMaterial();
  material.userData['referenceProduct'] = true;
  material.userData['merchandiseFabric'] = true;
  material.map = new THREE.Texture();
  const geometry = new THREE.BoxGeometry(.3, .12, .12);
  const shoe = new THREE.Group();
  shoe.userData['productId'] = 'multi-material-shoe';
  const upper = new THREE.Mesh(geometry, [material, new THREE.MeshStandardMaterial()]);
  upper.name = 'reference-shoe-upper';
  upper.position.set(.2, .1, .4);
  shoe.add(upper);
  const single = new THREE.Mesh(new THREE.PlaneGeometry(.1, .1), material);
  single.position.set(-.3, .1, .1);
  shoe.add(single);
  fixture.add(shoe);
  const before = new THREE.Box3().setFromObject(fixture);
  batchFixture(fixture);
  const retained = fixture.getObjectByName('reference-shoe-upper');
  assert.ok(retained instanceof THREE.Mesh);
  assert.equal(retained.geometry.groups.length, geometry.groups.length);
  assert.equal(retained.material[0], material);
  assert.ok(fixture.children.some(mesh => mesh.material === material));
  assert.deepEqual(fixture.userData['batchedProductIds'], ['multi-material-shoe']);
  const after = new THREE.Box3().setFromObject(fixture);
  assert.ok(before.min.distanceTo(after.min) < 1e-6 && before.max.distanceTo(after.max) < 1e-6);

  const singleMaterialFixture = new THREE.Group();
  singleMaterialFixture.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material));
  const errors = [];
  const errorSpy = mock.method(console, 'error', (...args) => errors.push(args));
  try {
    batchFixture(singleMaterialFixture);
  } finally {
    errorSpy.mock.restore();
  }
  assert.deepEqual(errors, [], 'A fixture without multi-material meshes must not emit console errors');
  assert.equal(singleMaterialFixture.children.length, 1);
  console.log('Product batching: multi-material groups, mapped material, instance metadata and world bounds preserved.');
} finally {
  await server.close();
}
