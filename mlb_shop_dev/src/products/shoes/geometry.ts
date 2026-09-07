import * as THREE from "three";
import type { ShoeProduct } from "./catalog";

function sample(values: readonly number[], u: number): number {
  const t = u * (values.length - 1);
  const i = Math.floor(t);
  const a = values[i] ?? 0;
  return THREE.MathUtils.lerp(a, values[Math.min(i + 1, values.length - 1)] ?? a, t - i);
}

export function shoeLoft(product: ShoeProduct, sole: boolean): THREE.BufferGeometry {
  const positions: number[] = [], uvs: number[] = [];
  const front: number[] = [], rear: number[] = [];
  const geometry = new THREE.BufferGeometry();
  const rings = 40, segments = 24;
  for (let i = 0; i <= rings; i++) {
    const u = i / rings;
    for (let j = 0; j <= segments; j++) {
      const point = surfacePoint(product, sole, u, j / segments * Math.PI * 2);
      positions.push(point.x, point.y, point.z);
      uvs.push(u, point.y / product.height);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segments; j++) {
      if (!sole && i >= 26 && i <= 35 && (j < 3 || j >= segments - 3)) continue;
      const a = i * (segments + 1) + j, b = a + segments + 1;
      const indices = (sole ? j >= 6 && j < 11 : j >= 2 && j < 6) ? front : rear;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex([...front, ...rear]);
  geometry.addGroup(0, front.length, 0);
  geometry.addGroup(front.length, rear.length, 1);
  geometry.computeVertexNormals();
  return geometry;
}

function surfacePoint(product: ShoeProduct, sole: boolean, u: number, angle: number): THREE.Vector3 {
  const seam = sample(product.seam, u) * product.height;
  const top = sample(product.top, u) * product.height;
  const width = .061 * Math.pow(Math.sin(Math.PI * u), .28) * (1 - .23 * u);
  const cosine = Math.cos(angle);
  const y = sole
    ? seam * (1 + Math.min(0, Math.sign(cosine) * Math.pow(Math.abs(cosine), .35)))
    : seam - .0003 + (top - seam) * Math.pow(Math.max(0, cosine), .85);
  const z = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), .55) * width;
  return new THREE.Vector3((u - .5) * .314, y, z);
}

function collarCurve(product: ShoeProduct): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  for (let i = 26; i <= 36; i++) points.push(surfacePoint(product, false, i / 40, Math.PI / 4));
  for (let j = 2; j >= -3; j--) points.push(surfacePoint(product, false, .9, j / 24 * Math.PI * 2));
  for (let i = 35; i >= 26; i--) points.push(surfacePoint(product, false, i / 40, -Math.PI / 4));
  for (let j = -2; j <= 2; j++) points.push(surfacePoint(product, false, .65, j / 24 * Math.PI * 2));
  return new THREE.CatmullRomCurve3(points, true, "centripetal");
}

export function collarGeometry(product: ShoeProduct): THREE.TubeGeometry {
  return new THREE.TubeGeometry(collarCurve(product), 64, .0023, 6, true);
}

export function cavityGeometry(product: ShoeProduct): THREE.BufferGeometry {
  const boundary = collarCurve(product).getPoints(64).slice(0, -1);
  const vertices: number[] = [], indices: number[] = [];
  const floor = product.height * .45;
  for (const point of boundary) vertices.push(point.x, point.y, point.z);
  for (const point of boundary) vertices.push(point.x, floor, point.z);
  vertices.push(.077, floor, 0);
  const count = boundary.length;
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    indices.push(i, next, i + count, next, next + count, i + count);
    indices.push(count * 2, i + count, next + count);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function laceGeometry(product: ShoeProduct, index: number): THREE.TubeGeometry {
  const u = .27 + index * .047;
  const x = (u - .5) * .314;
  const y = sample(product.top, u) * product.height;
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(x - .004, y - .014, -.035),
    new THREE.Vector3(x, y + .001, 0),
    new THREE.Vector3(x + .004, y - .014, .035),
  ]);
  return new THREE.TubeGeometry(path, 8, .0018, 5, false);
}
