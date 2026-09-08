import assert from 'node:assert/strict';
import { createServer } from 'vite';
import * as THREE from 'three';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
const requested = [];
THREE.TextureLoader.prototype.load = function (url) {
  requested.push(url);
  return new THREE.Texture();
};
try {
  // Given an imported factory, unused catalog entries must not allocate textures.
  const factory = await server.ssrLoadModule('/src/products/clothes/index.ts');
  assert.equal(requested.length, 0, 'Importing clothing must not load unused SKU textures');
  // When one paired SKU is instantiated repeatedly, resources are shared.
  const first = factory.createGarment('M26F3AMTV0164');
  const second = factory.createGarment('M26F3AMTV0164');
  assert.equal(requested.length, 2);
  assert.equal(first.userData.productId, 'M26F3AMTV0164');
  assert.equal(first.getObjectByName('reference-visible-surface').geometry,
    second.getObjectByName('reference-visible-surface').geometry);
  const folded = factory.createFoldedGarment('M26F3AMTV0164');
  assert.equal(folded.userData.rearImage, 'M26F3AMTV0164-rear.png');
  const foldedRear = folded.getObjectByName('reference-rear-surface');
  assert.ok(foldedRear, 'Folded garments retain a real rear photograph');
  assert.equal(foldedRear.material, first.getObjectByName('reference-rear-surface').material);
  const rearPositions = foldedRear.geometry.getAttribute('position');
  const rearNormals = foldedRear.geometry.getAttribute('normal');
  for (let i = 0; i < rearPositions.count; i++) {
    assert.ok(rearPositions.getY(i) < 0, 'Rear photograph stays outside the folded shell underside');
    assert.ok(rearNormals.getY(i) < 0, 'Folded rear photograph faces outward');
  }
  // Then unavailable assignments fail instead of repeating an unrelated SKU.
  assert.throws(() => factory.createGarment(999999), RangeError);
  assert.throws(() => factory.createGarment(-1), RangeError);
  assert.throws(() => factory.createGarment(1.5), RangeError);
  assert.throws(() => factory.createGarment('missing-sku'), RangeError);
  const { clothesCatalog } = await server.ssrLoadModule('/src/products/clothes/catalog.ts');
  const { garmentGeometry, rearGarmentGeometry } = await server.ssrLoadModule('/src/products/clothes/geometry.ts');
  const chicago = clothesCatalog.find(item => item.id === 'M26F3AMTV0164');
  const rescaled = garmentGeometry({ ...chicago,
    analysis: { width: 1798, height: 2400, top: 480, scale: 0.00042 },
    outline: chicago.outline.map(([x, y]) => [x * 2, y * 2]) });
  const original = garmentGeometry(chicago);
  assert.deepEqual([...rescaled.face.getAttribute('position').array], [...original.face.getAttribute('position').array],
    'Measured analysis resolution changes preserve physical garment coordinates');
  const rear = rearGarmentGeometry(original.face, { uScale: 0.8, uOffset: 0.1, vScale: 0.9, vOffset: 0.05 });
  const frontUV = original.face.getAttribute('uv');
  const rearUV = rear.getAttribute('uv');
  const frontPosition = original.face.getAttribute('position');
  const rearPosition = rear.getAttribute('position');
  for (let i = 0; i < rearUV.count; i++) {
    assert.ok(Math.abs(rearUV.getX(i) - ((1 - frontUV.getX(i)) * 0.8 + 0.1)) < 1e-6);
    assert.ok(Math.abs(rearUV.getY(i) - (frontUV.getY(i) * 0.9 + 0.05)) < 1e-6);
    assert.equal(rearPosition.getX(i), frontPosition.getX(i));
    assert.equal(rearPosition.getY(i), frontPosition.getY(i));
    assert.equal(rearPosition.getZ(i), -frontPosition.getZ(i));
  }
  console.log(JSON.stringify({ pass: true, textureRequests: requested.length }));
} finally {
  THREE.TextureLoader.prototype.load = originalLoad;
  await server.close();
}
