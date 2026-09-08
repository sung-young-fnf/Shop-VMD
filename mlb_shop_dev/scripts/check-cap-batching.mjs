import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
const originalError = console.error;
const results = [];
try {
  THREE.TextureLoader.prototype.load = function () { return new THREE.Texture(); };
  const { createCap } = await server.ssrLoadModule('/src/products/caps/index.ts');
  const { batchFixture } = await server.ssrLoadModule('/src/wall-fixtures/surfaces.ts');
  const { mergeFixture } = await server.ssrLoadModule('/src/central-fixtures/parts.ts');
  for (const batch of [batchFixture, mergeFixture]) {
    for (const indices of [[0, 0], [0, 0, 1, 2, 3, 4, 5]]) {
      const fixture = new THREE.Group();
      const errors = [];
      console.error = (...args) => { errors.push(args.map(String).join(' ')); };
      for (const index of indices) {
        const cap = createCap(index);
        cap.position.set(fixture.children.length * .4, .2, -.1);
        cap.rotation.y = .3;
        fixture.add(cap);
      }
      const snapshot = group => {
        let triangleIndices = 0;
        const source = [];
        const schemas = [];
        group.traverse(object => {
          if (!(object instanceof THREE.Mesh)) return;
          const geometry = object.geometry;
          triangleIndices += geometry.index?.count ?? geometry.getAttribute('position').count;
          const attribute = (geometry.index ? geometry.toNonIndexed() : geometry).getAttribute('capSourcePosition');
          if (attribute) source.push(...attribute.array);
          if (object.name.includes('inferred-bill')) schemas.push({ name: object.name, attributes: Object.keys(geometry.attributes).sort() });
        });
        return { triangleIndices, source: source.sort((a, b) => a - b), schemas };
      };
      const before = snapshot(fixture);
      batch(fixture);
      const after = snapshot(fixture);
      results.push({ batch: batch.name, indices, before: before.triangleIndices, after: after.triangleIndices, schemas: before.schemas, errors });
      assert.deepEqual(after.source, before.source, 'production batching preserves capSourcePosition values');
    }
  }
  console.log(JSON.stringify(results, null, 2));
  for (const result of results) {
    assert.deepEqual(result.errors, [], `${result.batch} emits no cap merge errors`);
    assert.equal(result.after, result.before, `${result.batch} preserves every cap triangle`);
  }
} finally {
  THREE.TextureLoader.prototype.load = originalLoad;
  console.error = originalError;
  await server.close();
}
