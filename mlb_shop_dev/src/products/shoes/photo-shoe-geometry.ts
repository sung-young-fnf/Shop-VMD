import * as THREE from "three";
import { shoePhotoUv, shoeSection } from "./photo-shoe-calibration";
import type { ShoePhotoRole } from "./photo-shoe-calibration";

const longitudinalSegments = 100;
const ringSegments = 80;
export type ShoeSurface = { readonly role: ShoePhotoRole; readonly geometry: THREE.BufferGeometry };

function surfacePoint(u: number, ring: number): THREE.Vector3 {
  const { base, side, centre, width } = shoeSection(u);
  const point = new THREE.Vector3((u - .5) * .314, base, 0);
  if (ring <= 32) {
    const q = 1 - ring / 16;
    point.z = width * .86 * q;
    point.y = side + (centre - side) * Math.max(0, 1 - q * q) ** .65;
  } else if (ring <= 48) {
    const t = (ring - 32) / 16;
    point.y = THREE.MathUtils.lerp(side, base, t);
    point.z = -width * (.86 + .08 * t + .085 * Math.sin(Math.PI * t));
  } else if (ring <= 64) {
    point.z = width * .94 * ((ring - 48) / 8 - 1);
  } else {
    const t = (ring - 64) / 16;
    point.y = THREE.MathUtils.lerp(base, side, t);
    point.z = width * (.94 - .08 * t + .085 * Math.sin(Math.PI * t));
  }
  point.x -= .022 * THREE.MathUtils.smoothstep(u, .82, 1) * (point.y / .109) ** 2;
  return point;
}

export function createShoeSurfaces(): readonly ShoeSurface[] {
  const points: THREE.Vector3[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= longitudinalSegments; row++) {
    for (let ring = 0; ring < ringSegments; ring++) points.push(surfacePoint(row / longitudinalSegments, ring));
  }
  for (let row = 0; row < longitudinalSegments; row++) {
    for (let ring = 0; ring < ringSegments; ring++) {
      const a = row * ringSegments + ring, b = row * ringSegments + (ring + 1) % ringSegments;
      indices.push(a, a + ringSegments, b, b, a + ringSegments, b + ringSegments);
    }
  }
  const shell = new THREE.BufferGeometry();
  shell.setAttribute("position", new THREE.Float32BufferAttribute(points.flatMap(point => point.toArray()), 3));
  shell.setIndex(indices);
  shell.computeVertexNormals();
  const normals = shell.getAttribute("normal");
  const buckets: Record<ShoePhotoRole, { positions: number[]; normals: number[]; uvs: number[]; parameters: number[] }> = {
    lateral: { positions: [], normals: [], uvs: [], parameters: [] }, medial: { positions: [], normals: [], uvs: [], parameters: [] },
    top: { positions: [], normals: [], uvs: [], parameters: [] }, heel: { positions: [], normals: [], uvs: [], parameters: [] }, sole: { positions: [], normals: [], uvs: [], parameters: [] },
  };
  for (let triangle = 0; triangle < indices.length; triangle += 3) {
    const ring = Math.floor(triangle / 6) % ringSegments;
    const row = Math.floor(triangle / 6 / ringSegments);
    const centreU = (row + .5) / longitudinalSegments;
    const centre = surfacePoint(centreU, ring + .5);
    const side = ring >= 32 && ring < 48 || ring >= 64;
    const heel = side && (centreU > .965 || centreU > .845 && centre.y > .071);
    const role: ShoePhotoRole = heel ? "heel" : ring < 32 ? "top" : ring < 48 ? "medial" : ring < 64 ? "sole" : "lateral";
    const bucket = buckets[role];
    for (let corner = 0; corner < 3; corner++) {
      const vertex = indices[triangle + corner];
      const point = vertex === undefined ? undefined : points[vertex];
      if (vertex === undefined || !point) continue;
      bucket.positions.push(...point.toArray());
      bucket.normals.push(normals.getX(vertex), normals.getY(vertex), normals.getZ(vertex));
      const u = Math.floor(vertex / ringSegments) / longitudinalSegments;
      const uv = shoePhotoUv(role, point, u);
      if (role === "top" && u >= .50 && u <= .66 && Math.abs(point.z) < .021) uv.set(uv.x, 1 - (640 + (.66 - u) * 100) / 1824);
      bucket.uvs.push(...uv.toArray());
      bucket.parameters.push(u);
    }
  }
  shell.dispose();
  return (["lateral", "medial", "top", "heel", "sole"] as const).map(role => {
    const bucket = buckets[role];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(bucket.positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(bucket.normals, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(bucket.uvs, 2));
    geometry.setIndex(Array.from({ length: bucket.positions.length / 3 }, (_, index) => index));
    if (role === "lateral" || role === "medial" || role === "heel") {
      const sideUvs: number[] = [], heelUvs: number[] = [], topUvs: number[] = [], weights: number[] = [];
      for (let vertex = 0; vertex < bucket.positions.length; vertex += 3) {
        const position = new THREE.Vector3().fromArray(bucket.positions, vertex);
        const u = bucket.parameters[vertex / 3] ?? 0;
        const section = shoeSection(u);
        const lateral = role === "lateral" || role === "heel" && position.z >= 0;
        sideUvs.push(...shoePhotoUv(lateral ? "lateral" : "medial", position, u).toArray());
        heelUvs.push(...shoePhotoUv("heel", position, u).toArray());
        topUvs.push(...shoePhotoUv("top", position, u).toArray());
        const upperHeel = THREE.MathUtils.smoothstep(u, .80, .90) * THREE.MathUtils.smoothstep(position.y, .063, .075);
        const fullHeel = THREE.MathUtils.smoothstep(u, .91, .995);
        weights.push(Math.max(upperHeel, fullHeel), THREE.MathUtils.smoothstep((position.y - section.base) / (section.side - section.base), .965, 1), lateral ? 1 : 0);
      }
      geometry.setAttribute("shoeSideUv", new THREE.Float32BufferAttribute(sideUvs, 2));
      geometry.setAttribute("shoeHeelUv", new THREE.Float32BufferAttribute(heelUvs, 2));
      geometry.setAttribute("shoeTopUv", new THREE.Float32BufferAttribute(topUvs, 2));
      geometry.setAttribute("shoeWeights", new THREE.Float32BufferAttribute(weights, 3));
    }
    return { role, geometry };
  });
}
