import * as THREE from "three";
import { shoePhotoUv } from "./photo-shoe-calibration";

export function createShoeTongue(): { readonly front: THREE.BufferGeometry; readonly backing: THREE.BufferGeometry } {
  const rows = 28, columns = 20, stride = columns + 1;
  const positions: number[] = [], frontUvs: number[] = [], backUvs: number[] = [];
  const frontIndices: number[] = [], backingIndices: number[] = [];
  for (const back of [false, true]) {
    for (let row = 0; row <= rows; row++) {
      const t = row / rows;
      for (let column = 0; column <= columns; column++) {
        const q = 1 - column / columns * 2;
        const u = .43 + .21 * t - .014 * q * q * t ** 5;
        const y = .096 + .023 * Math.sin(t * Math.PI / 2) - (.003 + .024 * t) * q * q - (back ? .0018 : 0);
        const point = new THREE.Vector3((u - .5) * .314, y, q * (.027 + .002 * Math.sin(Math.PI * t)));
        positions.push(...point.toArray());
        frontUvs.push(...shoePhotoUv("top", point, u).toArray());
        backUvs.push((485 - q * 45) / 1368, 1 - (683 + 12 * t) / 1824);
      }
    }
  }
  const layer = (rows + 1) * stride;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * stride + column, b = a + 1, c = a + stride, d = c + 1;
      frontIndices.push(a, c, b, b, c, d);
      backingIndices.push(a + layer, b + layer, c + layer, b + layer, d + layer, c + layer);
    }
  }
  const boundary: number[] = [];
  for (let row = 0; row <= rows; row++) boundary.push(row * stride);
  for (let column = 1; column <= columns; column++) boundary.push(rows * stride + column);
  for (let row = rows - 1; row >= 0; row--) boundary.push(row * stride + columns);
  for (let column = columns - 1; column > 0; column--) boundary.push(column);
  for (const [index, a] of boundary.entries()) {
    const b = boundary[(index + 1) % boundary.length];
    if (b !== undefined) backingIndices.push(a, a + layer, b, b, a + layer, b + layer);
  }
  const front = new THREE.BufferGeometry();
  front.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  front.setAttribute("uv", new THREE.Float32BufferAttribute(frontUvs, 2));
  front.setIndex(frontIndices);
  front.computeVertexNormals();
  const backing = new THREE.BufferGeometry();
  backing.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  backing.setAttribute("uv", new THREE.Float32BufferAttribute(backUvs, 2));
  backing.setIndex(backingIndices);
  backing.computeVertexNormals();
  return { front, backing };
}
