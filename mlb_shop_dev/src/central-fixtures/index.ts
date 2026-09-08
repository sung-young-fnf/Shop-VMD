import * as THREE from 'three';
import { createIslands } from './islands';
import { createService } from './service';
import { createFurniture } from './furniture';
import { createCustom } from './custom';
import { mergeFixture } from './parts';

export function createCentralFixtures(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'central-service';
  const fixtures = [...createIslands(), ...createService(), ...createFurniture(), ...createCustom()];
  for (const fixture of fixtures) {
    mergeFixture(fixture);
    const center = new THREE.Box3().setFromObject(fixture).getCenter(new THREE.Vector3());
    fixture.worldToLocal(center);
    for (const child of fixture.children) {
      if (child instanceof THREE.Mesh) child.geometry.translate(-center.x, -center.y, -center.z);
      else child.position.sub(center);
    }
    fixture.position.add(center.multiply(fixture.scale).applyQuaternion(fixture.quaternion));
    root.add(fixture);
  }
  return root;
}
