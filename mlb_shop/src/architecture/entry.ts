import * as THREE from 'three';
import { box, surfaces } from './primitives';

function baseballHandle(side: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'stitched semicircle baseball handle150×300×8';
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.15);
  shape.absarc(0, 0, 0.15, -Math.PI / 2, Math.PI / 2, side < 0);
  shape.closePath();
  const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.008, bevelEnabled: false, curveSegments: 20 }), surfaces.blue);
  group.add(plate);
  const vertices: number[] = [];
  for (let i = 0; i < 12; i++) {
    const y = -0.115 + i * 0.021;
    const x = side * (0.045 + 0.027 * (1 - (y / 0.15) ** 2));
    vertices.push(x - 0.009, y - 0.005, 0.009, x + 0.009, y + 0.005, 0.009);
  }
  const stitch = new THREE.BufferGeometry();
  stitch.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  group.add(new THREE.LineSegments(stitch, new THREE.LineBasicMaterial({ color: '#bbc4c3' })));
  for (const y of [-0.10, 0.10]) group.add(box({ size: [0.02, 0.01, 0.05], at: [side * 0.025, y, -0.025] }, surfaces.metal));
  group.rotation.y = -Math.PI / 2;
  return group;
}

function facadeLogo(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'MLB contour sign1170×340 · p101';
  group.userData['sourcePages'] = [101];
  const m = new THREE.Shape();
  m.moveTo(0, 0); m.lineTo(0.09, 0.30); m.lineTo(0.075, 0.34); m.lineTo(0.20, 0.34);
  m.lineTo(0.25, 0.15); m.lineTo(0.40, 0.34); m.lineTo(0.50, 0.34); m.lineTo(0.40, 0);
  m.lineTo(0.30, 0); m.lineTo(0.355, 0.18); m.lineTo(0.265, 0.085); m.lineTo(0.20, 0.085);
  m.lineTo(0.16, 0.20); m.lineTo(0.10, 0); m.closePath();
  const l = new THREE.Shape();
  l.moveTo(0.44, 0); l.lineTo(0.475, 0.035); l.lineTo(0.56, 0.30); l.lineTo(0.545, 0.34);
  l.lineTo(0.67, 0.34); l.lineTo(0.59, 0.072); l.lineTo(0.77, 0.072); l.lineTo(0.80, 0.09);
  l.lineTo(0.775, 0); l.closePath();
  const b = new THREE.Shape();
  b.moveTo(0.81, 0); b.lineTo(0.845, 0.035); b.lineTo(0.925, 0.30); b.lineTo(0.91, 0.34);
  b.lineTo(1.065, 0.34); b.bezierCurveTo(1.20, 0.34, 1.20, 0.235, 1.135, 0.17);
  b.bezierCurveTo(1.205, 0.065, 1.14, 0, 1.03, 0); b.closePath();
  for (const [x, y] of [[0.96, 0.205], [0.925, 0.075]] as const) {
    const hole = new THREE.Path();
    hole.moveTo(x, y); hole.lineTo(x + 0.09, y); hole.bezierCurveTo(x + 0.15, y, x + 0.15, y + 0.065, x + 0.10, y + 0.065);
    hole.lineTo(x + 0.02, y + 0.065); hole.closePath(); b.holes.push(hole);
  }
  for (const shape of [m, l, b]) {
    const glyph = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.055, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.002, bevelThickness: 0.002, curveSegments: 12 }), surfaces.light);
    glyph.rotation.y = -Math.PI / 2;
    glyph.position.set(-0.30, 2.81, 8.115);
    group.add(glyph);
  }
  group.add(box({ size: [0.25, 0.025, 1.40], at: [-0.16, 3.1725, 8.70] }, surfaces.metal));
  return group;
}

export function createEntry(): THREE.Group {
  const entry = new THREE.Group();
  entry.name = '6000 entry assembly';
  entry.userData['zoneId'] = 'entrance';
  entry.userData['fixtureId'] = 'main-entry';
  entry.userData['label'] = '양개 유리문 · 야구공 손잡이';
  entry.userData['sourcePages'] = [17, 18, 101];
  for (const z of [6.345, 11.055]) entry.add(box({ size: [0.30, 2.625, 1.17], at: [0.04, 1.3125, z] }, surfaces.blue));
  entry.add(box({ size: [0.38, 0.06, 6], at: [0.04, 2.655, 8.7] }, surfaces.blue));
  entry.add(box({ size: [0.045, 0.012, 5.90], at: [-0.17, 2.622, 8.70] }, surfaces.light));
  for (const z of [5.73, 11.67]) entry.add(box({ size: [0.30, 2.625, 0.06], at: [0.04, 1.3125, z] }, surfaces.blue));
  for (const z of [7.315, 10.085]) entry.add(box({ size: [0.012, 2.625, 0.77], at: [0.15, 1.3125, z] }, surfaces.glass));
  for (const side of [-1, 1]) {
    const leaf = new THREE.Group();
    leaf.name = `glass-door-hinge-${side}`;
    leaf.position.set(0.15, 0, 8.7 + side);
    leaf.add(box({ size: [0.012, 2.605, 0.99], at: [0, 1.3125, -side * 0.5] }, surfaces.glass));
    for (const y of [0.05, 2.59]) leaf.add(box({ size: [0.035, 0.035, 0.14], at: [0, y, -side * 0.08] }, surfaces.metal));
    for (const x of [-0.06, 0.06]) {
      const handle = baseballHandle(side);
      handle.position.set(x, 1.1, -side * 0.96);
      leaf.add(handle);
    }
    entry.add(leaf);
  }
  for (const z of [4.07, 13.2]) {
    entry.add(box({ size: [0.012, 2.05, 2.4], at: [0.15, 1.66, z] }, surfaces.glass));
    for (const y of [0.635, 2.685]) entry.add(box({ size: [0.14, 0.06, 2.52], at: [0.08, y, z] }, surfaces.metal));
    for (const edge of [z - 1.23, z + 1.23]) entry.add(box({ size: [0.14, 2.05, 0.06], at: [0.08, 1.66, edge] }, surfaces.metal));
    entry.add(box({ size: [0.25, 0.60, 2.52], at: [0.125, 0.30, z] }, surfaces.brick));
    entry.add(box({ size: [0.25, 0.355, 2.52], at: [0.125, 2.9225, z] }, surfaces.brick));
  }
  entry.add(box({ size: [0.07, 2.25, 0.86], at: [0.10, 1.125, 1.3], name: 'auxiliary stair door' }, surfaces.metal));
  entry.add(facadeLogo());
  return entry;
}
