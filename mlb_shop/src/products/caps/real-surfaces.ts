import * as THREE from "three";

const CROWN_HEIGHT_POWER = 1.05;
export const VISOR_HALF_WIDTH = .91;

export function realCrown(theta: number, t: number, inset = 0): THREE.Vector3 {
  const radial = Math.sin(t) ** .95;
  const forward = Math.cos(theta);
  const attachment = Math.sqrt(1 - VISOR_HALF_WIDTH ** 2);
  const frontRise = Math.max(0, (forward - attachment) / (1 - attachment));
  const base = .02 + (.10 * forward + .14 * frontRise ** 2 - .13 * (1 - forward)) * Math.sin(t) ** 2;
  const posterior = THREE.MathUtils.smoothstep(-forward, 0, .75);
  const rearVolume = Math.sin(t) ** .55 - radial + .22 * Math.sin(t) ** 4 * Math.sin(2 * t) - .03 * Math.sin(t) ** 8;
  return new THREE.Vector3(Math.sin(theta) * Math.sin(t) ** .65 * (1 - inset), base + 1.18 * Math.max(0, Math.cos(t)) ** CROWN_HEIGHT_POWER, forward * (radial + posterior * rearVolume) * (1.05 - inset));
}

export function realLowerAngle(theta: number): number {
  const x = Math.sin(theta);
  const opening = Math.cos(theta) < 0 && Math.abs(x) < .46 ? .58 * Math.sqrt(1 - (x / .46) ** 2) : 0;
  return Math.acos((opening / 1.18) ** (1 / CROWN_HEIGHT_POWER));
}

export function realBill(u: number, q: number): THREE.Vector3 {
  const x = VISOR_HALF_WIDTH * u;
  const root = realCrown(Math.asin(x), Math.PI / 2);
  const taper = Math.sqrt(Math.max(0, 1 - u * u));
  const flare = .30 * u * q * taper;
  const transverseRoll = .48 * u * u * q * taper;
  return new THREE.Vector3(x + flare, root.y - (.32 + .30 * x * x) * q * taper + .025 * q * q * taper - transverseRoll, root.z + .86 * taper * q);
}

export function realPatch(grid: readonly [number, number], sample: (u: number, v: number) => THREE.Vector3): THREE.BufferGeometry {
  const [columns, rows] = grid;
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      positions.push(...sample(column / columns, row / rows).toArray());
      uvs.push(column / columns, row / rows);
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
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

export function realCurve(points: THREE.Vector3[], radius: number, material: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), Math.max(24, points.length), radius, 5, false), material);
}
