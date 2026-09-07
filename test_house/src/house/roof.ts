import * as THREE from 'three';
import { beam, box, group } from './primitives';
import type { HouseMaterials } from './materials';
import { createPorchRoof } from './porch-roof';

type RoofSlope = { readonly x: readonly [number, number]; readonly z: readonly [number, number]; readonly y: readonly [number, number]; readonly name: string };

function slope(parent: THREE.Group, panel: RoofSlope, m: HouseMaterials): void {
  const part = group(parent, panel.name);
  const [x0, x1] = panel.x;
  const [z0, z1] = panel.z;
  const [y0, y1] = panel.y;
  const run = z1 - z0;
  const rise = y1 - y0;
  const mesh = box(part, { name: `${panel.name}-sheet`, center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], size: [x1 - x0, 0.12, Math.hypot(run, rise)], material: m.roof });
  mesh.rotation.x = -Math.atan2(rise, run);
  const ribGeometry = new THREE.BoxGeometry(0.035, 0.065, Math.hypot(run, rise));
  const count = Math.ceil((x1 - x0) / 0.38);
  const ribs = new THREE.InstancedMesh(ribGeometry, m.seam, count);
  ribs.name = `${panel.name}-standing-seams`;
  const matrix = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    matrix.position.set(x0 + i * 0.38, (y0 + y1) / 2 + 0.09, (z0 + z1) / 2);
    matrix.rotation.x = mesh.rotation.x;
    matrix.updateMatrix();
    ribs.setMatrixAt(i, matrix.matrix);
  }
  ribs.castShadow = true;
  part.add(ribs);
  for (const x of [x0, x1]) beam(part, { start: [x, y0 - 0.03, z0], end: [x, y1 - 0.03, z1], width: 0.17, name: 'gable-fascia' }, m.trim);
  const eaveZ = y0 < y1 ? z0 : z1;
  box(part, { name: 'eave-fascia', center: [(x0 + x1) / 2, Math.min(y0,y1) - 0.03, eaveZ], size: [x1 - x0, 0.19, 0.13], material: m.trim });
}

export function createRoof(parent: THREE.Group, m: HouseMaterials): THREE.Group {
  const roof = group(parent, 'roof-assembly');
  slope(roof, { name: 'main-front-roof', x: [-13.2, 13.3], z: [0.05, 5.4], y: [7.15, 3.68] }, m);
  slope(roof, { name: 'main-rear-roof', x: [-13.2, 13.3], z: [-5.3, 0.05], y: [3.68, 7.15] }, m);
  box(roof, { name: 'ridge-cap', center: [0.05, 7.2, 0.05], size: [26.65, 0.14, 0.24], material: m.seam });
  createPorchRoof(roof, m);
  const rear = group(roof, 'rear-bedroom-roof');
  slope(rear, { name: 'rear-wing-west', x: [2.9, 8.9], z: [-8.6, -5.45], y: [3.68, 5.65] }, m);
  slope(rear, { name: 'rear-wing-east', x: [2.9, 8.9], z: [-5.45, -2.3], y: [5.65, 3.68] }, m);
  box(rear, { name: 'rear-wing-ridge-cap', center: [5.9,5.71,-5.45], size: [6.1,0.12,0.22], material: m.seam });
  rear.rotation.y = Math.PI / 2;
  const wingGable = new THREE.Shape();
  wingGable.moveTo(-8.2,3.59); wingGable.lineTo(-5.45,5.59); wingGable.lineTo(-2.7,3.59); wingGable.closePath();
  const wingFace = new THREE.Mesh(new THREE.ExtrudeGeometry(wingGable,{depth:0.18,bevelEnabled:false}),m.wall);
  wingFace.name = 'rear-wing-gable-infill'; wingFace.position.z = -8.51; wingFace.castShadow = true; roof.add(wingFace);
  for (const x of [-12.82, 12.87]) {
    const shape = new THREE.Shape();
    shape.moveTo(-4.88, 3.59); shape.lineTo(0.05, 7.07); shape.lineTo(5.02, 3.59); shape.closePath();
    const face = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false }), m.wall);
    face.name = 'gable-infill'; face.rotation.y = Math.PI / 2; face.position.x = x; face.castShadow = true; roof.add(face);
    beam(roof, { start: [x + 0.12, 3.75, -4.6], end: [x + 0.12, 6.9, 0.05], width: 0.14, name: 'gable-timber-left' }, m.trim);
    beam(roof, { start: [x + 0.12, 6.9, 0.05], end: [x + 0.12, 3.75, 4.65], width: 0.14, name: 'gable-timber-right' }, m.trim);
    box(roof, { name: 'gable-king-post', center: [x + 0.12, 5.3, 0.05], size: [0.14, 3.0, 0.14], material: m.trim });
  }
  return roof;
}
