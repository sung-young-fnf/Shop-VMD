import * as THREE from 'three';
import { box, layer, repeatedBoxes, surfaces } from './primitives';
import type { BoxPart } from './primitives';
import { createEntry } from './entry';
import { createFacade } from './facade';
import { createFitting } from './fitting';
import { createUpper } from './upper';

export function createArchitecture(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'MLB architecture · p018 / p008 / p103–106';
  root.add(box({ size: [19.19, 0.22, 15.935], at: [9.595, -0.11, 7.9675], name: '1F slab19190×15935' }, surfaces.floor));
  const trackShape = new THREE.Shape();
  trackShape.moveTo(1.5, 0); trackShape.lineTo(10.05, 0); trackShape.absarc(10.05, 1.5, 1.5, -Math.PI / 2, 0, false);
  trackShape.lineTo(11.55, 4.45); trackShape.absarc(10.05, 4.45, 1.5, 0, Math.PI / 2, false);
  trackShape.lineTo(1.5, 5.95); trackShape.absarc(1.5, 4.45, 1.5, Math.PI / 2, Math.PI, false);
  trackShape.lineTo(0, 1.5); trackShape.absarc(1.5, 1.5, 1.5, Math.PI, Math.PI * 1.5, false);
  const track = new THREE.Mesh(new THREE.ShapeGeometry(trackShape, 32), new THREE.MeshStandardMaterial({ color: '#ad8270', roughness: 0.96 }));
  track.rotation.x = -Math.PI / 2;
  track.position.set(3.1, 0.006, 11.05);
  track.name = 'PT04 central granular floor11550×5950 R1500';
  track.userData['sourcePages'] = [19];
  track.receiveShadow = true;
  root.add(track);
  const wall = layer('1F perimeter cutaway', 'cutaway-wall');
  wall.add(box({ size: [19.19, 3.1, 0.23], at: [9.595, 1.55, 0.115] }, surfaces.plaster));
  wall.add(box({ size: [19.19, 3.1, 0.235], at: [9.595, 1.55, 15.8175] }, surfaces.plaster));
  wall.add(box({ size: [0.23, 3.1, 15.475], at: [19.075, 1.55, 7.9675] }, surfaces.plaster));
  for (const [z, depth] of [[0.38, 0.76], [2.40, 0.94], [5.53, 0.28], [11.85, 0.30], [15.20, 1.46]] as const) {
    wall.add(box({ size: [0.25, 3.1, depth], at: [0.125, 1.55, z] }, surfaces.brick));
  }
  root.add(wall);
  const core = new THREE.Group();
  core.name = '1F core (stairs / WC / service)';
  core.add(box({ size: [9.48, 2.7, 0.13], at: [7.01, 1.35, 2.18] }, surfaces.plaster));
  for (const [start, end] of [[0.23, 0.92], [1.77, 2.27]] as const) core.add(box({ size: [end - start, 2.7, 0.13], at: [(start + end) / 2, 1.35, 2.18] }, surfaces.plaster));
  core.add(box({ size: [0.85, 0.4, 0.13], at: [1.345, 2.5, 2.18], name: 'staff stair doorway lintel' }, surfaces.plaster));
  const staffDoor = new THREE.Group();
  staffDoor.name = 'staff stair door hinge';
  staffDoor.position.set(0.92, 0, 2.18);
  staffDoor.rotation.y = -0.40;
  staffDoor.add(box({ size: [0.82, 2.27, 0.035], at: [0.41, 1.135, 0] }, surfaces.metal));
  core.add(staffDoor);
  for (const x of [4.70, 5.95, 8.05, 11.75]) core.add(box({ size: [0.13, 2.7, 1.95], at: [x, 1.35, 1.205] }, surfaces.plaster));
  const steps: BoxPart[] = Array.from({ length: 14 }, (_, i) => ({ size: [0.17, (i + 1) * 0.205, 1.6], at: [2.355 + i * 0.17, (i + 1) * 0.1025, 1.22] }));
  core.add(repeatedBoxes(steps, surfaces.concrete));
  core.add(box({ size: [2.61, 0.12, 2.52], at: [17.655, 0.06, 1.49], name: 'freight lift platform' }, surfaces.metal));
  for (const z of [0.28, 2.70]) core.add(box({ size: [0.10, 2.65, 0.10], at: [16.35, 1.325, z] }, surfaces.metal));
  core.add(box({ size: [0.10, 0.15, 2.52], at: [16.35, 2.58, 1.49] }, surfaces.metal));
  for (let i = 0; i < 14; i++) core.add(box({ size: [0.035, 2.40, 0.025], at: [16.35, 1.25, 0.40 + i * 0.16], name: 'freight lift gate bar' }, surfaces.metal));
  root.add(core);
  const columns = new THREE.Group();
  columns.name = 'existing square and circular columns';
  for (const x of [6.14, 6.73, 12.85]) for (const z of [5.34, 10.67]) columns.add(box({ size: [0.35, 3.1, 0.35], at: [x, 1.55, z] }, surfaces.concrete));
  for (const x of [9.71, 15.97]) for (const z of [0.35, 5.34, 10.67]) {
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 3.1, 16), surfaces.plaster);
    column.position.set(x, 1.55, z);
    columns.add(column);
  }
  root.add(columns);
  const ceiling = layer('1F concrete slab and beam soffits ·3100 /2700', 'ceiling');
  ceiling.userData['sourcePages'] = [18, 23, 25];
  ceiling.userData['heightConflict'] = 'beam2700 and barrisol2750 are both source values; intersection remains provisional';
  ceiling.add(box({ size: [19.19, 0.10, 15.935], at: [9.595, 3.15, 7.9675], name: '1F exposed slab soffit3100' }, surfaces.concrete));
  const beams: BoxPart[] = [];
  for (const x of [6.14, 6.73, 12.85]) beams.push({ size: [0.35, 0.40, 15.475], at: [x, 2.90, 7.9675] });
  for (const z of [5.34, 10.67]) beams.push({ size: [18.73, 0.40, 0.35], at: [9.595, 2.90, z] });
  ceiling.add(repeatedBoxes(beams, surfaces.concrete));
  root.add(ceiling);
  root.add(createFitting(), createEntry(), createUpper(), createFacade());
  return root;
}
