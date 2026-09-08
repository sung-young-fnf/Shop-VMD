import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
const errors = [];
const originalError = console.error;
try {
  THREE.TextureLoader.prototype.load = function () { return new THREE.Texture(); };
  console.error = (...args) => { errors.push(args.map(String).join(' ')); originalError(...args); };
  const { createShoe } = await server.ssrLoadModule('/src/products/shoes/index.ts');
  const { batchFixture } = await server.ssrLoadModule('/src/wall-fixtures/surfaces.ts');
  const { mergeFixture } = await server.ssrLoadModule('/src/central-fixtures/parts.ts');
  for (const batch of [batchFixture, mergeFixture]) {
    const fixture = new THREE.Group();
    for (const index of batch === batchFixture ? [0, 0, 1, 2, 3] : [0, 0]) {
      const shoe = createShoe(index);
      shoe.position.x = fixture.children.length * .4;
      fixture.add(shoe);
    }
    let before = 0;
    fixture.traverse(object => { if (object instanceof THREE.Mesh) before += object.geometry.index?.count ?? object.geometry.getAttribute('position').count; });
    batch(fixture);
    let after = 0;
    fixture.traverse(object => { if (object instanceof THREE.Mesh) after += object.geometry.index?.count ?? object.geometry.getAttribute('position').count; });
    assert.equal(after, before, `${batch.name} preserves every shoe triangle`);
    assert.deepEqual(errors, [], `${batch.name} emits no merge errors`);
    console.log(JSON.stringify({ batch: batch.name, triangleIndicesBefore: before, triangleIndicesAfter: after, errors: errors.length }));
  }
} finally {
  THREE.TextureLoader.prototype.load = originalLoad;
  console.error = originalError;
  await server.close();
}
