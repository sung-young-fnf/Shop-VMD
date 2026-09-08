import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
try {
  THREE.TextureLoader.prototype.load = function () { return new THREE.Texture(); };
  const { createCap } = await server.ssrLoadModule('/src/products/caps/index.ts');
  for (let index = 0; index < 6; index++) {
    const cap = createCap(index);
    assert.ok(cap.userData.cadSource?.endsWith('.jpg'), 'Given a displayed SKU, its model identifies the matching technical drawing');
    const meshes = [];
    cap.traverse(object => { if (object instanceof THREE.Mesh) meshes.push(object); });
    assert.equal(meshes.filter(mesh => mesh.name.startsWith('cad-inner-tape-')).length, index === 0 ? 0 : 6, 'Photographic interior tapes must not be doubled by modeled strips');
    const modeledEyelets = meshes.filter(mesh => mesh.name.startsWith('cad-eyelet-')).length;
    if (index === 0) {
      assert.equal(cap.userData.eyeletRepresentation, 'source-photographs');
      assert.equal(modeledEyelets, 0, 'Photographic eyelets must not be doubled by additional modeled rings');
      assert.equal(cap.userData.stitchRepresentation, 'source-photographs');
      assert.equal(cap.userData.interiorRepresentation, 'gallery-8-original-photograph');
      assert.ok(meshes.some(mesh => mesh.name === 'photo-interior-woven-label' && mesh.material.map));
      assert.equal(meshes.filter(mesh => mesh.name.startsWith('real-inner-panel-') && mesh.material.map).length, 6);
    } else assert.equal(modeledEyelets, 6, 'Non-photographic caps retain six modeled eyelets');
    assert.ok(meshes.some(mesh => mesh.name === 'cad-sweatband'), 'A hollow crown has a perimeter sweatband');
    assert.equal(meshes.filter(mesh => mesh.name.startsWith('cad-visor-stitch-')).length, [0, 6, 4, 5, 6, 5][index]);
    if (index >= 1 && index <= 3) assert.ok(meshes.some(mesh => mesh.name === 'cad-metal-rear-adjuster'));
    if (index === 2) assert.ok(meshes.some(mesh => mesh.name === 'cad-source-distressed-visor'));
    if (index === 4) {
      const badge = meshes.find(mesh => mesh.name === 'cad-source-championship-side-badge');
      assert.ok(badge);
      const geometry = badge.geometry;
      const positions = geometry.getAttribute('position');
      for (let triangle = 0; triangle < geometry.index.count; triangle += 3) {
        const center = new THREE.Vector3();
        for (let vertex = 0; vertex < 3; vertex++) center.add(new THREE.Vector3().fromBufferAttribute(positions, geometry.index.getX(triangle + vertex)));
        center.divideScalar(3);
        const radius = (center.x / .102) ** 2 + ((center.y - .018) / .116) ** 2 + (center.z / .097) ** 2;
        assert.ok(radius >= 1, 'Every badge triangle stays outside the crown instead of cutting through artwork');
      }
    }
    for (const mesh of meshes) {
      for (const attribute of Object.values(mesh.geometry.attributes)) assert.ok(Array.from(attribute.array).every(Number.isFinite));
    }
  }
  console.log('CAD cap construction: six displayed SKUs PASS');
} finally {
  THREE.TextureLoader.prototype.load = originalLoad;
  await server.close();
}
