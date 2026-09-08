import * as THREE from "three";

export type CapConstruction = {
  readonly visorDrop: number;
  readonly stitchRows: number;
  readonly color: THREE.ColorRepresentation;
};

export function cadCrownPoint(phi: number, theta: number): THREE.Vector3 {
  return new THREE.Vector3(.102 * Math.sin(theta) * Math.sin(phi), .018 + .116 * Math.cos(theta), .097 * Math.sin(theta) * Math.cos(phi));
}

export function cadBillPoint(u: number, v: number, drop: number): THREE.Vector3 {
  const s = Math.sin((u - .5) * Math.PI);
  const taper = Math.sqrt(Math.max(0, 1 - s * s));
  const x = .100 * s;
  const root = .097 * Math.sqrt(Math.max(0, 1 - (x / .102) ** 2));
  return new THREE.Vector3(x, .018 - v * taper * (.004 + drop * s * s), root + v * .076 * taper);
}

export function cadBillGeometry(drop: number): THREE.BufferGeometry {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const columns = 48, rows = 16;
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const u = column / columns, v = row / rows;
      const s = Math.sin((u - .5) * Math.PI);
      positions.push(...cadBillPoint(u, v, drop).toArray());
      uvs.push((683 + s * (398 - 3 * v)) / 1368, 1 - (954 + 78 * s * s + v * (200 + 24 * s * s)) / 1824);
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * (columns + 1) + column, b = a + columns + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function cadRearOpening(phi: number): number {
  return .047 * Math.sqrt(Math.max(0, 1 - (Math.sin(phi) / .45) ** 2));
}

export function cadBillRim(drop: number): THREE.BufferGeometry {
  const positions: number[] = [], uvs: number[] = [];
  for (let step = 0; step < 48; step++) {
    const a = cadBillPoint(step / 48, 1, drop);
    const b = cadBillPoint((step + 1) / 48, 1, drop);
    const c = a.clone().add(new THREE.Vector3(0, -.0022, 0));
    const d = b.clone().add(new THREE.Vector3(0, -.0022, 0));
    positions.push(...a.toArray(), ...c.toArray(), ...b.toArray(), ...b.toArray(), ...c.toArray(), ...d.toArray());
    uvs.push(0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

export function cadCrownGeometry(): THREE.BufferGeometry {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const columns = 48, rows = 16;
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const phi = column / columns * Math.PI * 2;
      const opening = Math.cos(phi) < 0 ? cadRearOpening(phi) : 0;
      const theta = .001 + row / rows * (Math.acos(opening / .116) - .001);
      positions.push(...cadCrownPoint(phi, theta).toArray());
      uvs.push(column / columns, 1 - row / rows);
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * (columns + 1) + column, b = a + columns + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function cadStrapGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.PlaneGeometry(.104, .014, 24, 1);
  const positions = geometry.getAttribute("position");
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    positions.setXYZ(index, x, .025 + positions.getY(index), -.097 * Math.sqrt(1 - (x / .102) ** 2) - .0005);
  }
  geometry.computeVertexNormals();
  return geometry;
}
