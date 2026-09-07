import assert from 'node:assert/strict';
import { createServer } from 'vite';
import * as THREE from 'three';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { clothesCatalog } = await server.ssrLoadModule('/src/products/clothes/catalog.ts');
  const { garmentGeometry } = await server.ssrLoadModule('/src/products/clothes/geometry.ts');
  const chicago = clothesCatalog.find(item => item.id === 'M26F3AMTV0164');
  assert.ok(chicago);
  assert.ok(chicago.rearImage, 'Chicago must use its real official rear photograph, not a plain inferred back');
  const geometry = garmentGeometry(chicago);
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry.shell), new THREE.Mesh(geometry.face));
  const rear = geometry.face.clone().rotateY(Math.PI);
  group.add(new THREE.Mesh(rear));
  const bounds = new THREE.Box3().setFromObject(group);
  const size = bounds.getSize(new THREE.Vector3());
  assert.ok(size.z >= 0.065 && size.z <= 0.10, 'Clothing depth must remain within the documented inferred profile');
  assert.ok(size.x <= 0.68 && bounds.min.y >= -0.75);
  const uv = rear.getAttribute('uv');
  const normals = rear.getAttribute('normal');
  for (let i = 0; i < uv.count; i++) {
    assert.ok(uv.getX(i) >= 0 && uv.getX(i) <= 1);
    assert.ok(uv.getY(i) >= 0 && uv.getY(i) <= 1);
    assert.ok(normals.getZ(i) < 0, 'Rear photography must face outward');
  }
  console.log(JSON.stringify({ pass: true, size: size.toArray(), rearImage: chicago.rearImage }));
} finally {
  await server.close();
}
