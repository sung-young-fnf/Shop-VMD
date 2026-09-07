import * as THREE from 'three';

export type V3 = readonly [number, number, number];
export type Solid = { readonly name: string; readonly center: V3; readonly size: V3; readonly material: THREE.Material };
const cube = new THREE.BoxGeometry(1, 1, 1);

export function box(parent: THREE.Group, solid: Solid): THREE.Mesh {
  const mesh = new THREE.Mesh(cube, solid.material);
  mesh.name = solid.name;
  mesh.position.set(...solid.center);
  mesh.scale.set(...solid.size);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function beam(parent: THREE.Group, segment: { readonly start: V3; readonly end: V3; readonly width: number; readonly name: string }, material: THREE.Material): THREE.Mesh {
  const a = new THREE.Vector3(...segment.start);
  const b = new THREE.Vector3(...segment.end);
  const direction = b.clone().sub(a);
  const mesh = box(parent, { name: segment.name, center: [0, 0, 0], size: [segment.width, direction.length(), segment.width], material });
  mesh.position.copy(a.add(b).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

export function instances(parent: THREE.Group, solids: readonly Solid[]): void {
  const first = solids[0];
  if (first === undefined) return;
  const mesh = new THREE.InstancedMesh(cube, first.material, solids.length);
  mesh.name = first.name;
  const transform = new THREE.Object3D();
  solids.forEach((solid, index) => {
    transform.position.set(...solid.center);
    transform.scale.set(...solid.size);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

export function group(parent: THREE.Group, name: string): THREE.Group {
  const part = new THREE.Group();
  part.name = name;
  parent.add(part);
  return part;
}
