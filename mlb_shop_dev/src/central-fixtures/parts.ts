import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const materials = {
  metal: new THREE.MeshStandardMaterial({ color: '#666b6e', metalness: 0.65, roughness: 0.48 }),
  blue: new THREE.MeshStandardMaterial({ color: '#53677f', metalness: 0.7, roughness: 0.4 }),
  wood: new THREE.MeshStandardMaterial({ color: '#c9ad82', roughness: 0.78 }),
  fabric: new THREE.MeshStandardMaterial({ color: '#647b98', roughness: 0.95 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#c4d8db', transparent: true, opacity: 0.24, roughness: 0.08, metalness: 0.15 }),
  mirror: new THREE.MeshStandardMaterial({ color: '#b8c6cc', roughness: 0.08, metalness: 1 }),
  led: new THREE.MeshStandardMaterial({ color: '#fff5df', emissive: '#fff4dd', emissiveIntensity: 1.4 }),
} as const;
const grainPixels = new Uint8Array(128 * 128 * 4);
for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
  const value = 210 + Math.round(18 * Math.sin(x * .42 + Math.sin(y * .09) * .7) + 10 * Math.sin(x * 2.7 + y * .13));
  const i = (y * 128 + x) * 4;
  grainPixels[i] = grainPixels[i + 1] = grainPixels[i + 2] = value;
  grainPixels[i + 3] = 255;
}
const grain = new THREE.DataTexture(grainPixels, 128, 128);
grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
grain.magFilter = THREE.LinearFilter;
grain.needsUpdate = true;
materials.wood.map = grain;
materials.wood.bumpMap = grain;
materials.wood.bumpScale = .0007;
materials.fabric.bumpMap = grain;
materials.fabric.bumpScale = .002;
export type Point = readonly [number, number, number];
export function box(size: Point, position: Point, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
export function fixture(id: string, label: string, zoneId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = id;
  group.userData = { fixtureId: id, label, zoneId, sourcePages: [] };
  return group;
}
export function beam(start: Point, end: Point, material = materials.metal): THREE.Mesh {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, a.distanceTo(b), 8), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
  return mesh;
}
export function slab(points: readonly (readonly [number, number])[], height: number, material: THREE.Material): THREE.Mesh {
  const shape = new THREE.Shape();
  points.forEach(([x, z], i) => { if (i === 0) shape.moveTo(x, -z); else shape.lineTo(x, -z); });
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  return new THREE.Mesh(geo, material);
}
export function mergeFixture(group: THREE.Group): void {
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  group.updateMatrixWorld(true);
  const inverse = group.matrixWorld.clone().invert();
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) return;
    const geo = child.geometry.clone().applyMatrix4(inverse.clone().multiply(child.matrixWorld));
    const entries = batches.get(child.material) ?? [];
    entries.push(geo.index ? geo.toNonIndexed() : geo);
    batches.set(child.material, entries);
  });
  group.clear();
  for (const [material, geometries] of batches) {
    const geometry = mergeGeometries(geometries, false);
    if (geometry) { const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); }
    geometries.forEach((geometry) => geometry.dispose());
  }
}
