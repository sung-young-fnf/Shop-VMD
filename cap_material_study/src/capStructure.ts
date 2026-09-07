import * as THREE from 'three';
import { brimPoint, crownPoint } from './capGeometry';

export function tube(points: THREE.Vector3[], radius: number, material: THREE.Material, name: string): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, points.length * 2), radius, 6, false), material);
  mesh.name = name;
  mesh.userData['explodeWithParent'] = true;
  mesh.castShadow = true;
  return mesh;
}
export function crownNormal(theta: number, t: number): THREE.Vector3 {
  const tangent = crownPoint(theta + 0.001, t).sub(crownPoint(theta - 0.001, t));
  const vertical = crownPoint(theta, Math.min(0.999, t + 0.001)).sub(crownPoint(theta, Math.max(0, t - 0.001)));
  return tangent.cross(vertical).normalize();
}
export function addStructure(crown: THREE.Group, brim: THREE.Group, thread: THREE.Material): void {
  const seams = new THREE.Group(); seams.name = 'panel-seams'; seams.userData['explodeWithParent'] = true;
  for (let i = 0; i < 6; i++) {
    const theta = i * Math.PI / 3;
    const points = Array.from({ length: 45 }, (_, j) => {
      const t = j / 46;
      return crownPoint(theta, t).addScaledVector(crownNormal(theta, t), 0.003);
    });
    seams.add(tube(points, 0.003, thread, `panel-seam-${i}`));
  }
  seams.add(tube(Array.from({ length: 97 }, (_, j) => crownPoint(j / 96 * Math.PI * 2, 0.004)), 0.006, thread, 'crown-base-seam'));
  crown.add(seams);
  const eyelets = new THREE.Group(); eyelets.name = 'eyelets'; eyelets.userData['explodeWithParent'] = true;
  const cavity = new THREE.MeshStandardMaterial({ color: '#171b24', roughness: 1, side: THREE.DoubleSide });
  for (let i = 0; i < 6; i++) {
    const theta = Math.PI / 6 + i * Math.PI / 3, t = 0.78;
    const position = crownPoint(theta, t), normal = crownNormal(theta, t);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.006, 8, 24), thread);
    ring.name = `eyelet-rim-${i}`;
    ring.position.copy(position).addScaledVector(normal, 0.003);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    ring.scale.z = 0.5;
    ring.castShadow = true;
    const inset = new THREE.Mesh(new THREE.CircleGeometry(0.018, 24), cavity);
    inset.name = `eyelet-inset-${i}`;
    inset.position.copy(position).addScaledVector(normal, 0.002);
    inset.quaternion.copy(ring.quaternion);
    eyelets.add(ring, inset);
  }
  crown.add(eyelets);
  const stitches = new THREE.Group(); stitches.name = 'visor-stitches'; stitches.userData['explodeWithParent'] = true;
  for (let row = 0; row < 6; row++) {
    const q = 0.36 + row * 0.095;
    const points = Array.from({ length: 73 }, (_, i) => brimPoint(-0.94 + 1.88 * i / 72, q).add(new THREE.Vector3(0, 0.004, 0)));
    stitches.add(tube(points, 0.002, thread, `visor-stitch-row-${row}`));
  }
  brim.add(stitches);
}
export function thickenSurface(source: THREE.BufferGeometry, thickness: number): THREE.BufferGeometry {
  const position = source.getAttribute('position'), normal = source.getAttribute('normal'), uv = source.getAttribute('uv');
  const vertices: number[] = [], texcoords: number[] = [], indices: number[] = [];
  for (let i = 0; i < position.count; i++) if (position.getX(i) ** 2 + position.getZ(i) ** 2 < 0.000001) normal.setXYZ(i, 0, 1, 0);
  const n = position.count, edgeUses = new Map<string, { a: number; b: number; count: number }>();
  for (let side = 0; side < 2; side++) for (let i = 0; i < n; i++) {
    const offset = side === 0 ? 0 : -thickness;
    vertices.push(position.getX(i) + normal.getX(i) * offset, position.getY(i) + normal.getY(i) * offset, position.getZ(i) + normal.getZ(i) * offset);
    texcoords.push(uv.getX(i), uv.getY(i));
  }
  const sourceIndex = source.getIndex();
  if (!sourceIndex) throw new TypeError('Indexed surface required for cloth shell');
  for (let i = 0; i < sourceIndex.count; i += 3) {
    const a = sourceIndex.getX(i), b = sourceIndex.getX(i + 1), c = sourceIndex.getX(i + 2);
    indices.push(a, b, c, c + n, b + n, a + n);
    for (const [u, v] of [[a, b], [b, c], [c, a]]) {
      if (u === undefined || v === undefined) continue;
      const key = `${Math.min(u, v)}:${Math.max(u, v)}`, old = edgeUses.get(key);
      if (old) old.count++; else edgeUses.set(key, { a: u, b: v, count: 1 });
    }
  }
  for (const { a, b, count } of edgeUses.values()) if (count === 1) indices.push(a, a + n, b, b, a + n, b + n);
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  result.setAttribute('uv', new THREE.Float32BufferAttribute(texcoords, 2));
  result.setIndex(indices); result.computeVertexNormals(); source.dispose();
  return result;
}
