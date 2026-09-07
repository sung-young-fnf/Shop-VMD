import * as THREE from 'three';

export function crownPoint(theta: number, t: number): THREE.Vector3 {
  const r = 1.00 * Math.sqrt(Math.max(0, 1 - t ** 2.05));
  return new THREE.Vector3(r * Math.sin(theta), 1.35 * t + 0.30 * Math.max(0, Math.cos(theta)) * (1 - t) ** 1.5, 1.04 * r * Math.cos(theta));
}
export function brimPoint(s: number, q: number): THREE.Vector3 {
  const edge = Math.sqrt(Math.max(0, 1 - s * s));
  const rootY = 0.30 * Math.sqrt(1 - (0.96 * s) ** 2);
  return new THREE.Vector3(
    0.96 * s * (1 + 0.12 * Math.sin(Math.PI * q) * edge),
    0.012 + rootY * (1 - q * edge) + (0.17 + 0.16 * s * s - 0.55 * s) * q * edge,
    1.08 * Math.sqrt(1 - (0.96 * s) ** 2) + 1.40 * q * edge - 0.025,
  );
}
export function surfaceGeometry(
  sample: (u: number, v: number) => THREE.Vector3,
  nu: number, nv: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const u = i / nu, v = j / nv;
    positions.push(...sample(u, v).toArray());
    uv.push(u, v);
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
    indices.push(a, b, c, b, d, c);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
export function makeCrown(): THREE.BufferGeometry {
  return surfaceGeometry((u, v) => crownPoint(u * Math.PI * 2, v), 96, 48);
}
export function makeBrim(): THREE.BufferGeometry {
  const geometry = surfaceGeometry((u, v) => brimPoint(2 * u - 1, v), 80, 40);
  const index = geometry.getIndex();
  if (!index) throw new TypeError('Brim surface must be indexed');
  for (let i = 0; i < index.count; i += 3) { const b = index.getX(i + 1); index.setX(i + 1, index.getX(i + 2)); index.setX(i + 2, b); }
  geometry.computeVertexNormals();
  return geometry;
}
