import * as THREE from 'three';
import { box, surfaces } from './primitives';

export function createFitting(): THREE.Group {
  const fitting = new THREE.Group();
  fitting.name = 'fitting room shells';
  fitting.userData['zoneId'] = 'fitting';
  fitting.userData['sourcePages'] = [18, 32, 35, 36, 81];
  for (const z of [12.06, 13.865, 15.67]) fitting.add(box({ size: [1.94, 2.52, 0.14], at: [18.06, 1.26, z] }, surfaces.plaster));
  for (const [start, end] of [[12.13, 12.84], [13.64, 14.02], [14.82, 15.60]] as const) fitting.add(box({ size: [0.12, 2.52, end - start], at: [17.10, 1.26, (start + end) / 2] }, surfaces.metal));
  for (const [index, z, hinge] of [[1, 13.24, 1], [2, 14.42, -1]] as const) {
    const room = new THREE.Group();
    room.name = `fitting-room-${index}`;
    room.userData['fixtureId'] = `fitting-room-${index}`;
    room.userData['zoneId'] = 'fitting';
    room.userData['countKind'] = 'fittingRooms';
    room.userData['label'] = `피팅룸${index}`;
    room.userData['sourcePages'] = [18, 35 + index - 1, 81];
    room.add(box({ size: [0.12, 0.22, 0.80], at: [17.10, 2.41, z] }, surfaces.metal));
    const door = new THREE.Group();
    door.name = `fitting-door-${index}-hinge`;
    door.position.set(17.10, 0, z + hinge * 0.40);
    door.rotation.y = hinge * 0.12;
    door.add(box({ size: [0.04, 2.27, 0.78], at: [0, 1.145, -hinge * 0.40] }, surfaces.wood));
    door.add(box({ size: [0.03, 0.40, 0.02], at: [-0.045, 0.94, -hinge * 0.70] }, surfaces.blue));
    for (const y of [0.12, 2.10]) for (let row = 0; row < 3; row++) door.add(box({ size: [0.003, 0.006, 0.10], at: [-0.022, y + row * 0.016, -hinge * 0.4] }, surfaces.metal));
    for (const y of [0.2, 1.15, 2.08]) door.add(box({ size: [0.055, 0.06, 0.02], at: [0, y, 0] }, surfaces.metal));
    room.add(door);
    room.add(box({ size: [0.04, 0.035, 0.06], at: [17.02, 2.36, z], name: 'fitting door occupancy indicator' }, surfaces.light));
    fitting.add(room);
  }
  return fitting;
}
