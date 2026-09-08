import assert from 'node:assert/strict';
import { createServer } from 'vite';
import * as THREE from 'three';

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { clothingSlots, clothingAt, ClothingAllocationError } = await server.ssrLoadModule('/src/clothing-placement.ts');
  const { mergeFixture } = await server.ssrLoadModule('/src/central-fixtures/parts.ts');
  const { batchFixture } = await server.ssrLoadModule('/src/wall-fixtures/surfaces.ts');
  const { pairedClothesCatalog } = await server.ssrLoadModule('/src/products/clothes/catalog.ts');
  // Given all original display slots and the currently verified paired catalog.
  const first = clothingSlots.map(clothingAt);
  // When allocation is repeated in reverse construction order.
  const reverse = [...clothingSlots].reverse().map(clothingAt).reverse();
  // Then IDs stay deterministic and only the available-source shortfall repeats.
  assert.equal(clothingSlots.length, 149);
  assert.equal(new Set(clothingSlots).size, 149);
  assert.equal(new Set(first).size, Math.min(149, pairedClothesCatalog.length));
  assert.deepEqual(first, reverse);
  assert.throws(() => clothingAt('unknown/0'), ClothingAllocationError);
  assert.ok(first.every(id => pairedClothesCatalog.some(item => item.id === id && item.frontImage && item.rearImage)));

  // Given mirrored fixtures and nonuniformly scaled folded-display parents.
  for (const batch of [mergeFixture, batchFixture]) for (const scale of [[-1, 1, -1], [1, 1, 1]]) {
    const fixture = new THREE.Group();
    fixture.position.set(14.65, 0, 11);
    fixture.scale.set(...scale);
    const display = new THREE.Group();
    display.position.set(2.12, .695, .94);
    display.scale.set(2, .7, .55);
    const product = new THREE.Group();
    product.name = 'reference-folded-test';
    product.position.set(-.27, 0, -.37);
    product.add(new THREE.Mesh(new THREE.BoxGeometry(.4, .1, .3)));
    display.add(product);
    fixture.add(display);
    fixture.updateMatrixWorld(true);
    const before = product.matrixWorld.clone();
    // When the actual production fixture batcher processes the display.
    batch(fixture);
    fixture.updateMatrixWorld(true);
    // Then the same rendered object keeps its exact transform and mesh.
    assert.equal(fixture.children.length, 1);
    assert.equal(fixture.children[0], product);
    assert.equal(product.children.length, 1);
    assert.ok(product.matrixWorld.elements.every((value, index) => Math.abs(value - before.elements[index]) < 1e-10));
  }
  console.log(JSON.stringify({ pass: true, placements: first.length, distinctSkus: new Set(first).size, verifiedPoolCount: pairedClothesCatalog.length }));
} finally {
  await server.close();
}
