import * as THREE from 'three';
import { box, layer, repeatedBoxes, surfaces } from './primitives';
import type { BoxPart } from './primitives';

function beltMesh(): THREE.MeshStandardMaterial {
  const width = 64;
  const data = new Uint8Array(width * width * 4);
  for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
    const wire = y % 16 < 3 || Math.abs((x + (y < 32 ? 6 : -6)) % 32 - 16) < 2;
    const i = (y * width + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 255;
    data[i + 3] = wire ? 255 : 0;
  }
  const texture = new THREE.DataTexture(data, width, width);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(160, 32);
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ color: '#71736e', map: texture, alphaTest: 0.45, side: THREE.DoubleSide, metalness: 0.85, roughness: 0.55 });
}

export function createFacade(): THREE.Group {
  const facade = layer('upper facade · fin / belt mesh / masonry', 'facade-upper');
  facade.userData['sourcePages'] = [8, 9, 10, 11, 12, 14];
  const brick = surfaces.brick.clone();
  brick.color.set('#ffffff');
  const meshMaterial = beltMesh();
  for (const y of [3.3, 6.6, 9.35]) facade.add(box({ size: [0.70, y > 9 ? 0.7 : 0.2, 17.035], at: [-0.15, y, 7.9675] }, surfaces.concrete));
  for (const floor of [{ base: 3.4, height: 3.1, windows: [2.7, 7.97, 13.3], width: 2.35 }, { base: 6.7, height: 2.3, windows: [2.15, 6.65, 10.05, 13.45], width: 1.70 }]) {
    const center = floor.base + floor.height / 2;
    const sill = floor.base + 1.10;
    const head = sill + 1.05;
    let cursor = 0;
    for (const z of floor.windows) {
      const start = z - floor.width / 2;
      facade.add(box({ size: [0.23, floor.height, start - cursor], at: [0.115, center, (cursor + start) / 2] }, brick));
      facade.add(box({ size: [0.23, sill - floor.base, floor.width], at: [0.115, (sill + floor.base) / 2, z] }, brick));
      facade.add(box({ size: [0.23, floor.base + floor.height - head, floor.width], at: [0.115, (head + floor.base + floor.height) / 2, z] }, brick));
      facade.add(box({ size: [0.015, 1.05, floor.width], at: [0.09, sill + 0.525, z] }, surfaces.glass));
      for (const edge of [z - floor.width / 2, z, z + floor.width / 2]) facade.add(box({ size: [0.06, 1.10, 0.045], at: [0.025, sill + 0.525, edge] }, surfaces.metal));
      for (const y of [sill, head]) facade.add(box({ size: [0.06, 0.045, floor.width], at: [0.025, y, z] }, surfaces.metal));
      cursor = z + floor.width / 2;
    }
    facade.add(box({ size: [0.23, floor.height, 15.935 - cursor], at: [0.115, center, (cursor + 15.935) / 2] }, brick));
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(15.91, floor.height - 0.04), meshMaterial);
    screen.rotation.y = -Math.PI / 2;
    screen.position.set(-0.16, center, 7.9675);
    facade.add(screen);
    const fins: BoxPart[] = Array.from({ length: 27 }, (_, i) => ({ size: [0.20, floor.height - 0.04, 0.020], at: [-0.36, center, 0.0125 + i * 15.91 / 26] }));
    facade.add(repeatedBoxes(fins, surfaces.blue));
    for (const z of [0.0125, 15.9225]) facade.add(box({ size: [0.53, floor.height - 0.04, 0.02], at: [-0.195, center, z] }, surfaces.blue));
    for (const y of [floor.base + 0.02, floor.base + floor.height - 0.02]) facade.add(box({ size: [0.035, 0.035, 15.91], at: [-0.17, y, 7.9675] }, surfaces.metal));
    facade.add(box({ size: [0.04, 0.04, 15.91], at: [-0.20, floor.base + 0.07, 7.9675] }, surfaces.light));
  }
  for (const z of [0.115, 15.82]) facade.add(box({ size: [18.96, 6.5, 0.23], at: [9.71, 6.45, z] }, brick));
  facade.add(box({ size: [0.23, 6.5, 15.475], at: [19.075, 6.45, 7.9675] }, brick));
  facade.add(box({ size: [19.19, 0.15, 15.935], at: [9.595, 9.625, 7.9675], name: 'flat roof cap' }, surfaces.concrete));
  const banner = new THREE.Group();
  banner.name = 'side banner · replaceable graphic 6000×5500';
  banner.userData['sourcePages'] = [12, 13, 14];
  const frame: BoxPart[] = [];
  for (const x of [0.38, 6.38]) frame.push({ size: [0.06, 5.55, 0.04], at: [x, 6.225, 16.09] });
  for (const y of [3.45, 6.55, 9.0]) frame.push({ size: [6.06, 0.04, 0.06], at: [3.38, y, 16.09] });
  for (let x = 0.38; x <= 6.38; x += 1) for (const y of [3.45, 6.55, 9.0]) frame.push({ size: [0.04, 0.04, 0.30], at: [x, y, 15.99] });
  banner.add(repeatedBoxes(frame, surfaces.metal));
  const graphic = box({ size: [6, 5.5, 0.008], at: [3.38, 6.225, 16.116], name: 'replaceable-banner-surface' }, new THREE.MeshStandardMaterial({ color: '#253747', roughness: 0.85 }));
  graphic.userData['replaceableArtwork'] = true;
  banner.add(graphic);
  facade.add(banner);
  return facade;
}
