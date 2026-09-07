import * as THREE from 'three';
import source from './logo-mask.json';
import { frontSurfaceZ } from './capEmbroidery';

export function createSatinStrands(): THREE.InstancedMesh {
  const segments: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
  function point(px: number, py: number): THREE.Vector3 {
    const u = px / source.width - 0.5, v = 0.5 - py / source.height;
    const x = u * 0.56 - v * 0.08, y = 0.87 + v * 0.57;
    return new THREE.Vector3(x, y, frontSurfaceZ(x, y) + 0.0165);
  }
  for (let y = 1; y < source.height - 1; y++) {
    const row = source.rows[y];
    if (!row) continue;
    let start = -1;
    for (let x = 0; x <= source.width; x++) {
      if (row[x] === '1' && start < 0) start = x;
      if (row[x] !== '1' && start >= 0) {
        if (x - start > 4) segments.push({ start: point(start + 1.4, y + 0.5), end: point(x - 1.4, y + 0.5) });
        start = -1;
      }
    }
  }
  const material = new THREE.MeshStandardMaterial({ color: '#e5ddcd', roughness: 0.94, metalness: 0 });
  const geometry = new THREE.CylinderGeometry(1, 1, 1, 5, 1, false);
  const mesh = new THREE.InstancedMesh(geometry, material, segments.length);
  mesh.name = 'satin-stitches'; mesh.userData['explodeWithParent'] = true;
  const dummy = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
  segments.forEach(({ start, end }, index) => {
    const direction = end.clone().sub(start);
    dummy.position.copy(start).add(end).multiplyScalar(0.5);
    dummy.quaternion.setFromUnitVectors(up, direction.clone().normalize());
    dummy.scale.set(0.00065, direction.length(), 0.00065);
    dummy.updateMatrix(); mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true; mesh.castShadow = true;
  mesh.userData['construction'] = 'Geometry satin stitch rows follow observed white contour; thread count and thickness inferred.';
  return mesh;
}
