import * as THREE from 'three';
import { beam, group } from './primitives';
import type { V3 } from './primitives';
import type { HouseMaterials } from './materials';

type PorchPanel = {
  readonly name: string;
  readonly vertices: readonly V3[];
  readonly seamAxis: 'x' | 'z';
  readonly exposedEdges: readonly number[];
};

function polygonPanel(parent: THREE.Group, panel: PorchPanel, m: HouseMaterials): void {
  const part = group(parent, panel.name);
  const vertices = panel.vertices;
  const points = vertices.map(([x, , z]) => new THREE.Vector2(x, z));
  const triangles = THREE.ShapeUtils.triangulateShape(points, []);
  const positions: number[] = [];
  const put = (v: V3, offset: number): void => { positions.push(v[0], v[1] + offset, v[2]); };
  for (const triangle of triangles) {
    const a = vertices[triangle[0] ?? -1];
    const b = vertices[triangle[1] ?? -1];
    const c = vertices[triangle[2] ?? -1];
    if (a === undefined || b === undefined || c === undefined) continue;
    put(c, 0); put(b, 0); put(a, 0);
    put(a, -0.12); put(b, -0.12); put(c, -0.12);
  }
  vertices.forEach((a, index) => {
    const b = vertices[(index + 1) % vertices.length];
    if (b === undefined) return;
    put(a, 0); put(b, 0); put(b, -0.12);
    put(a, 0); put(b, -0.12); put(a, -0.12);
    if (panel.exposedEdges.includes(index)) beam(part, { start: a, end: b, width: 0.17, name: 'porch-exposed-fascia' }, m.trim);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, m.roof);
  mesh.name = `${panel.name}-mitred-sheet`;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  part.add(mesh);
  const axis = panel.seamAxis === 'x' ? 0 : 2;
  const values = vertices.map(v => v[axis]);
  for (let at = Math.min(...values) + 0.12; at < Math.max(...values); at += 0.38) {
    const intersections: V3[] = [];
    vertices.forEach((a, index) => {
      const b = vertices[(index + 1) % vertices.length];
      if (b === undefined || a[axis] === b[axis]) return;
      const t = (at - a[axis]) / (b[axis] - a[axis]);
      if (t >= 0 && t < 1) intersections.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + 0.045, a[2] + (b[2] - a[2]) * t]);
    });
    const [start, end] = intersections;
    if (start !== undefined && end !== undefined) beam(part, { start, end, width: 0.035, name: 'porch-standing-seam' }, m.seam);
  }
}

export function createPorchRoof(parent: THREE.Group, m: HouseMaterials): void {
  polygonPanel(parent, { name: 'front-porch-roof', vertices: [[-12.35,3.95,4.65],[-1.3,3.95,4.65],[-1.3,3.1,9],[-16.75,3.1,9]], seamAxis: 'x', exposedEdges: [1,2] }, m);
  polygonPanel(parent, { name: 'side-porch-roof', vertices: [[-12.35,3.95,-4.5],[-12.35,3.95,4.65],[-16.75,3.1,9],[-16.75,3.1,-8.8]], seamAxis: 'z', exposedEdges: [2] }, m);
  polygonPanel(parent, { name: 'rear-porch-roof', vertices: [[-16.75,3.1,-8.8],[-8.15,3.1,-8.8],[-8.15,3.95,-4.5],[-12.35,3.95,-4.5]], seamAxis: 'x', exposedEdges: [0,1] }, m);
  beam(parent, { name: 'front-porch-hip-cap', start: [-12.35,4.02,4.65], end: [-16.75,3.17,9], width: 0.11 }, m.seam);
  beam(parent, { name: 'rear-porch-hip-cap', start: [-12.35,4.02,-4.5], end: [-16.75,3.17,-8.8], width: 0.11 }, m.seam);
}
