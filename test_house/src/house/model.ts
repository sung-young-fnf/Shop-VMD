import * as THREE from 'three';
import { createMaterials } from './materials';
import { createEnvelope } from './envelope';
import { createRoof } from './roof';
import { box, group } from './primitives';
import { rooms } from './plan';
import { createPorch, createChimney } from './porch';
import { createPartitions } from './partitions';
import { createFurniture } from './furniture';
import { createFixtures } from './fixtures';
import { mergeStaticDetails } from './optimize';

export async function createHouseModel() {
  const root = new THREE.Group();
  root.name = 'pine-house';
  const m = createMaterials();
  const foundation = group(root, 'foundation');
  box(foundation, { name: 'main-foundation', center: [0.025, 0.18, 0.075], size: [25.65, 0.4, 9.85], material: m.stone });
  box(foundation, { name: 'rear-wing-foundation', center: [-5.45, 0.18, -6.67], size: [5.5, 0.4, 3.65], material: m.stone });
  const selectable: THREE.Object3D[] = [];
  for (const room of rooms) {
    const floor = box(foundation, { name: room.id, center: room.center, size: [room.size[0] - 0.1, 0.055, room.size[1] - 0.1], material: room.id === 'garage' || room.id === 'porch' ? m.stone : m.floor });
    floor.userData['roomId'] = room.id;
    selectable.push(floor);
  }
  const upper = createEnvelope(root, m);
  await new Promise<void>(resolve => setTimeout(resolve, 0));
  const roof = createRoof(root, m);
  createPorch(root, m);
  createChimney(root, m);
  const partitions = createPartitions(root, m);
  await new Promise<void>(resolve => setTimeout(resolve, 0));
  createFurniture(root, m);
  const suspended = createFixtures(root, m);
  await new Promise<void>(resolve => setTimeout(resolve, 0));
  mergeStaticDetails(root);
  let cutaway = false;
  let exploded = false;
  const update = (): void => {
    roof.visible = !cutaway || exploded;
    roof.position.y = exploded ? 5 : 0;
    upper.visible = !cutaway;
    partitions.visible = !cutaway;
    suspended.visible = !cutaway;
  };
  return {
    root, roof, rooms, selectable,
    setCutaway(enabled: boolean): void { cutaway = enabled; update(); },
    setExploded(enabled: boolean): void { exploded = enabled; update(); },
    setNight(enabled: boolean): void { m.glass.emissiveIntensity = enabled ? 0.8 : 0.08; m.light.emissiveIntensity = enabled ? 2 : 0.3; },
  };
}
