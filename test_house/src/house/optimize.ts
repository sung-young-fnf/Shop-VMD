import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function mergeStaticDetails(root: THREE.Group): void {
  const groups: THREE.Group[] = [];
  root.traverse(object => { if (object instanceof THREE.Group) groups.push(object); });
  for (const part of groups) {
    const batches = new Map<THREE.Material, THREE.Mesh[]>();
    for (const child of part.children) {
      if (!(child instanceof THREE.Mesh) || child instanceof THREE.InstancedMesh || Array.isArray(child.material)) continue;
      if (typeof child.userData['roomId'] === 'string' || child.geometry.getAttribute('uv') === undefined) continue;
      const batch = batches.get(child.material) ?? [];
      batch.push(child);
      batches.set(child.material, batch);
    }
    let mergedIndex = 0;
    for (const [material, batch] of batches) {
      if (batch.length < 2) continue;
      const geometries = batch.map(mesh => {
        mesh.updateMatrix();
        const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrix);
        if (geometry.index === null) return geometry;
        const expanded = geometry.toNonIndexed();
        geometry.dispose();
        return expanded;
      });
      const geometry = mergeGeometries(geometries, false);
      geometries.forEach(item => item.dispose());
      if (geometry === null) continue;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = `${part.name}-static-details-${mergedIndex++}`;
      mesh.userData['sourceParts'] = batch.map(item => item.name);
      mesh.castShadow = batch.some(item => item.castShadow);
      mesh.receiveShadow = batch.some(item => item.receiveShadow);
      for (const original of batch) part.remove(original);
      part.add(mesh);
    }
  }
}
