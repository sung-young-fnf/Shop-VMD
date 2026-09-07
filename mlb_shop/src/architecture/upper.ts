import * as THREE from 'three';
import { box, layer, repeatedBoxes, surfaces } from './primitives';
import type { BoxPart } from './primitives';

type RackRun = { readonly x: number; readonly z: number; readonly bays: number; readonly alongX: boolean };

function storageRacks(): THREE.Group {
  const group = new THREE.Group();
  group.name = '2F angle racks ·106 bays /424 shelves /272 posts';
  group.userData['fixtureId'] = '2f-racks';
  group.userData['zoneId'] = 'upper-storage';
  group.userData['label'] = '2층 수납 앵글장106조';
  group.userData['sourcePages'] = [105, 106];
  group.userData['bays'] = 106;
  group.userData['shelves'] = 424;
  group.userData['posts'] = 272;
  group.userData['connectionStatus'] = 'inferred shared posts across30 source-derived runs';
  const runs: RackRun[] = [{ x: 6.425, z: 4.925, bays: 9, alongX: false }];
  for (const x of [7.613, 8.063, 9.217, 9.817, 10.979, 12.142, 12.724, 13.887, 15.032, 15.61, 17.04]) runs.push({ x, z: 4.93, bays: 3, alongX: false });
  runs.push({ x: 18.398, z: 3.73, bays: 4, alongX: false });
  for (const x of [7.613, 8.063, 9.217, 9.817, 10.979, 12.142, 12.724, 13.887, 15.032]) runs.push({ x, z: 9.43, bays: 4, alongX: false });
  runs.push({ x: 16.45, z: 9.43, bays: 5, alongX: false }, { x: 18.398, z: 9.70, bays: 5, alongX: false });
  runs.push({ x: 6.65, z: 15.48, bays: 7, alongX: true }, { x: 16.875, z: 15.48, bays: 1, alongX: true });
  runs.push({ x: 7.60, z: 1.97, bays: 1, alongX: true }, { x: 12.70, z: 0.43, bays: 2, alongX: true });
  runs.push({ x: 12.70, z: 0.68, bays: 1, alongX: false }, { x: 15.22, z: 0.68, bays: 2, alongX: false });
  const shelves: BoxPart[] = [];
  const posts: BoxPart[] = [];
  const bayRails: BoxPart[] = [];
  for (const run of runs) {
    for (let bay = 0; bay < run.bays; bay++) bayRails.push({ size: run.alongX ? [1.2, 0.045, 0.025] : [0.025, 0.045, 1.2], at: [run.x + (run.alongX ? bay * 1.2 + 0.6 : 0.21), 3.47, run.z + (run.alongX ? 0.21 : bay * 1.2 + 0.6)] });
    for (let bay = 0; bay < run.bays; bay++) for (const y of [0.11, 0.655, 1.205, 1.75]) {
      shelves.push({ size: run.alongX ? [1.2, 0.03, 0.45] : [0.45, 0.03, 1.2], at: [run.x + (run.alongX ? bay * 1.2 + 0.6 : 0), 3.4 + y, run.z + (run.alongX ? 0 : bay * 1.2 + 0.6)] });
    }
    for (let end = 0; end <= run.bays; end++) for (const side of [-0.21, 0.21]) {
      posts.push({ size: [0.035, 1.8, 0.035], at: [run.x + (run.alongX ? end * 1.2 : side), 4.3, run.z + (run.alongX ? side : end * 1.2)] });
    }
  }
  for (const [parts, kind] of [[shelves, 'storageShelves'], [posts, 'storagePosts'], [bayRails, 'storageRackBays']] as const) {
    const batch = repeatedBoxes(parts, surfaces.metal);
    batch.name = kind;
    batch.userData['countKind'] = kind;
    group.add(batch);
  }
  return group;
}

export function createUpper(): THREE.Group {
  const upper = layer('2F /3F known non-retail structure', 'upper');
  upper.userData['zoneId'] = 'upper-storage';
  upper.userData['sourcePages'] = [103, 104, 105, 106];
  const floor2 = new THREE.Group();
  floor2.name = '2F office / rest / storage';
  floor2.userData['upperFloor'] = 2;
  floor2.add(box({ size: [18.73, 0.2, 15.555], at: [9.595, 3.3, 7.9675] }, surfaces.concrete));
  const walls2: BoxPart[] = [
    { size: [0.10, 2.7, 2.85], at: [5.83, 4.75, 3.885] },
    { size: [0.10, 2.7, 4.80], at: [5.90, 4.75, 7.97] },
    { size: [0.10, 2.7, 4.77], at: [5.90, 4.75, 13.30] },
    { size: [5.54, 2.7, 0.10], at: [3.0, 4.75, 10.57] },
    { size: [3.2, 2.7, 0.10], at: [9.18, 4.75, 2.16] },
    { size: [0.10, 2.7, 2.40], at: [15.55, 4.75, 1.55] },
    { size: [3.25, 2.7, 0.10], at: [17.335, 4.75, 2.70] },
  ];
  floor2.add(repeatedBoxes(walls2, surfaces.plaster), storageRacks());
  for (const x of [4.24, 5.17]) {
    const locker = box({ size: [0.9, 1.79, 0.51], at: [x, 4.295, 10.93], name: 'steel locker6-person2-tier' }, surfaces.metal);
    locker.userData['countKind'] = 'lockers';
    floor2.add(locker);
  }
  const stair2: BoxPart[] = Array.from({ length: 16 }, (_, i) => ({ size: [0.20, 0.18, 1.6], at: [2.76 + i * 0.20, 3.49 + i * 0.185, 1.17] }));
  floor2.add(repeatedBoxes(stair2, surfaces.concrete));
  for (const x of [9.87, 11.40]) floor2.add(box({ size: [0.09, 2.5, 1.80], at: [x, 4.65, 1.17] }, surfaces.plaster));
  upper.add(floor2);
  const floor3 = new THREE.Group();
  floor3.name = '3F distinct plan with true VOID';
  floor3.userData['upperFloor'] = 3;
  const x0 = 0.23;
  const x1 = 18.96;
  const z0 = 0.1675;
  const z1 = 15.7675;
  const voidX = [7.255, 10.475] as const;
  const voidZ = [0.3375, 1.7375] as const;
  floor3.add(repeatedBoxes([
    { size: [voidX[0] - x0, 0.2, z1 - z0], at: [(voidX[0] + x0) / 2, 6.6, (z0 + z1) / 2] },
    { size: [x1 - voidX[1], 0.2, z1 - z0], at: [(voidX[1] + x1) / 2, 6.6, (z0 + z1) / 2] },
    { size: [voidX[1] - voidX[0], 0.2, voidZ[0] - z0], at: [(voidX[0] + voidX[1]) / 2, 6.6, (voidZ[0] + z0) / 2] },
    { size: [voidX[1] - voidX[0], 0.2, z1 - voidZ[1]], at: [(voidX[0] + voidX[1]) / 2, 6.6, (voidZ[1] + z1) / 2] },
  ], surfaces.concrete));
  const walls3: BoxPart[] = [];
  for (const [start, end] of [[0.20, 3.95], [4.85, 9.6], [10.4, 13.8], [14.7, 15.7]] as const) walls3.push({ size: [0.1, 2.30, end - start], at: [5.935, 7.85, (start + end) / 2] });
  for (const [start, end] of [[3.85, 6.0], [6.7, 7.7], [8.8, 12.2], [13.3, 15.7]] as const) walls3.push({ size: [0.1, 2.30, end - start], at: [12.40, 7.85, (start + end) / 2] });
  walls3.push({ size: [4.7, 2.3, 0.1], at: [10.0, 7.85, 3.85] }, { size: [0.1, 2.3, 6.4], at: [7.65, 7.85, 7.05] });
  walls3.push({ size: [5.65, 2.3, 0.1], at: [3.055, 7.85, 11.9] }, { size: [0.1, 2.3, 5.4], at: [7.65, 7.85, 13.0] });
  walls3.push({ size: [3.43, 2.3, 0.10], at: [14.165, 7.85, 2.20] }, { size: [0.1, 2.3, 2.1], at: [16.56, 7.85, 1.22] });
  floor3.add(repeatedBoxes(walls3, surfaces.plaster));
  floor3.add(box({ size: [2.35, 0.08, 2.0], at: [17.75, 6.75, 1.2], name: '3F freight lift' }, surfaces.metal));
  floor3.add(repeatedBoxes(Array.from({ length: 10 }, (_, i) => ({ size: [0.18, 0.16, 0.95], at: [12.50 + i * 0.18, 6.80 + i * 0.20, 0.85] })), surfaces.concrete));
  upper.add(floor3);
  return upper;
}
