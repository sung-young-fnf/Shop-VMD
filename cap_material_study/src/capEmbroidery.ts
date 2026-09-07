import * as THREE from 'three';
import contourData from './logo-contours.json';
import { crownPoint } from './capGeometry';

export function frontSurfaceZ(x: number, y: number): number {
  let lo = 0, hi = 0.999;
  for (let i = 0; i < 20; i++) {
    const t = (lo + hi) / 2;
    const r = Math.sqrt(Math.max(0.0001, 1 - t ** 2.05));
    const theta = Math.asin(THREE.MathUtils.clamp(x / r, -0.999, 0.999));
    if (crownPoint(theta, t).y < y) lo = t; else hi = t;
  }
  const t = (lo + hi) / 2;
  const r = Math.sqrt(Math.max(0.0001, 1 - t ** 2.05));
  return 1.04 * Math.sqrt(Math.max(0.001, r * r - x * x));
}
export function createEmbroidery(material: THREE.Material): THREE.Group {
  const group = new THREE.Group(); group.name = 'embroidery';
  group.userData['label'] = 'NY 자수'; group.userData['explodeDirection'] = new THREE.Vector3(0, 0.1, 0.8);
  group.userData['collider'] = { type: 'surface-relief', thickness: 0.018 };
  group.userData['source'] = 'Observed ivory contour traced from M25N3ACPB135N.png';
  for (const contour of contourData.contours.filter(item => item.area > 100)) {
    const shape = new THREE.Shape();
    const points = contour.points.map(point => new THREE.Vector2((point[0] ?? 0) / contourData.width - 0.5, 0.5 - (point[1] ?? 0) / contourData.height));
    const first = points[0], last = points[points.length - 1];
    if (!first || !last) continue;
    shape.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
    for (let i = 0; i < points.length; i++) {
      const point = points[i], next = points[(i + 1) % points.length];
      if (point && next) shape.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
    }
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.003, bevelSegments: 2, steps: 1, curveSegments: 2 });
    const oldNormals = geometry.getAttribute('normal').clone();
    const position = geometry.getAttribute('position'); const uv = geometry.getAttribute('uv');
    for (let i = 0; i < position.count; i++) {
      const u = position.getX(i), v = position.getY(i), depth = position.getZ(i);
      const x = u * 0.56 - v * 0.08, y = 0.87 + v * 0.57;
      position.setXYZ(i, x, y, frontSurfaceZ(x, y) + 0.004 + depth);
      uv.setXY(i, u + 0.5, v + 0.5);
    }
    geometry.computeVertexNormals();
    const normals = geometry.getAttribute('normal');
    for (let i = 0; i < position.count; i++) if (Math.abs(oldNormals.getZ(i)) > 0.98) {
      const x = position.getX(i), y = position.getY(i), epsilon = 0.0005;
      const dx = (frontSurfaceZ(x + epsilon, y) - frontSurfaceZ(x - epsilon, y)) / (epsilon * 2);
      const dy = (frontSurfaceZ(x, y + epsilon) - frontSurfaceZ(x, y - epsilon)) / (epsilon * 2);
      const n = new THREE.Vector3(-dx, -dy, 1).normalize().multiplyScalar(Math.sign(oldNormals.getZ(i)));
      normals.setXYZ(i, n.x, n.y, n.z);
    }
    const mesh = new THREE.Mesh(geometry, material); mesh.name = 'embroidery-surface'; mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}
