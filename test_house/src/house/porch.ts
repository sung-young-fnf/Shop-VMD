import * as THREE from 'three';
import { beam, box, group, instances } from './primitives';
import type { Solid } from './primitives';
import type { HouseMaterials } from './materials';

export function createPorch(parent: THREE.Group, m: HouseMaterials): THREE.Group {
  const porch = group(parent, 'wraparound-porch');
  box(porch, { name: 'front-porch-slab', center: [-9.15, 0.19, 6.85], size: [14.85, 0.43, 3.9], material: m.stone });
  box(porch, { name: 'side-porch-slab', center: [-14.7, 0.19, -1.75], size: [3.8, 0.43, 13.3], material: m.stone });
  box(porch, { name: 'rear-porch-slab', center: [-10.5, 0.19, -6.7], size: [4.6, 0.43, 3.8], material: m.stone });
  for (let i = 0; i < 3; i++) box(porch, { name: 'front-entry-step', center: [-6.9, 0.07 + i * 0.11, 9.22 - i * 0.3], size: [4.4, 0.14, 1.25 - i * 0.2], material: i === 2 ? m.stone : m.brick });
  const posts: readonly (readonly [number, number])[] = [[-16.4,8.6],[-12.65,8.6],[-8.9,8.6],[-5.15,8.6],[-1.7,8.6],[-16.4,5],[-16.4,1.4],[-16.4,-2.2],[-16.4,-5.7],[-16.4,-8.5],[-12.65,-8.5],[-8.4,-8.5]];
  for (const [x, z] of posts) {
    box(porch, { name: 'timber-porch-column', center: [x, 1.7, z], size: [0.24, 2.65, 0.24], material: m.wood });
    box(porch, { name: 'column-base', center: [x, 0.52, z], size: [0.31, 0.23, 0.31], material: m.wood });
    box(porch, { name: 'column-capital', center: [x, 2.94, z], size: [0.34, 0.21, 0.34], material: m.wood });
  }
  box(porch, { name: 'front-timber-beam', center: [-9.1, 2.98, 8.6], size: [15, 0.24, 0.23], material: m.wood });
  box(porch, { name: 'side-timber-beam', center: [-16.4, 2.98, 0.05], size: [0.23, 0.24, 17.35], material: m.wood });
  box(porch, { name: 'rear-timber-beam', center: [-12.4, 2.98, -8.5], size: [8.2, 0.24, 0.23], material: m.wood });
  const edging: Solid[] = [];
  for (let x = -16.55; x < -1.5; x += 0.26) for (let row = 0; row < 2; row++) edging.push({ name: 'porch-brick-edging', center: [x + row * 0.13, 0.12 + row * 0.12, 8.83], size: [0.245, 0.105, 0.12], material: m.brick });
  instances(porch, edging);
  for (const x of [-11.6,-10.35,-3.2]) {
    const chair = group(porch, 'porch-armchair');
    chair.position.set(x, 0.43, 6.35);
    box(chair, { name: 'chair-seat', center: [0,0.4,0], size: [0.76,0.15,0.78], material: m.linen });
    const back = box(chair, { name: 'chair-back', center: [0,0.84,-0.34], size: [0.76,0.77,0.13], material: m.linen }); back.rotation.x=-0.1;
    for (const side of [-0.43,0.43]) {
      box(chair, { name: 'chair-arm', center: [side,0.62,0], size: [0.09,0.08,0.9], material: m.wood });
      for (const z of [-0.32,0.32]) box(chair, { name: 'chair-leg', center: [side,0.3,z], size: [0.07,0.6,0.07], material: m.wood });
    }
  }
  box(porch, { name: 'outdoor-side-table', center: [-9.35,0.91,6.5], size: [0.55,0.06,0.55], material: m.wood });
  box(porch, { name: 'outdoor-table-base', center: [-9.35,0.66,6.5], size: [0.12,0.5,0.12], material: m.wood });
  return porch;
}

export function createChimney(parent: THREE.Group, m: HouseMaterials): void {
  const chimney = group(parent, 'brick-chimney');
  box(chimney, { name: 'chimney-mortar-core', center: [-13.06,4.3,1.4], size: [0.95,7.8,1.38], material: m.mortar });
  box(chimney, { name: 'fireplace-breast', center: [-12.96,1.92,1.4], size: [1.1,3.1,1.76], material: m.brick });
  const bricks: Solid[] = [];
  for (let row=0; row<58; row++) {
    const y = 0.49 + row * 0.13;
    for (let i=0; i<5; i++) for (const side of [-1,1]) bricks.push({ name: 'chimney-brick-courses', center: [-13.06 + side*0.495,y,0.76+i*0.27+(row%2)*0.08], size: [0.055,0.113,0.25], material: m.brick });
    for (let i=0; i<3; i++) for (const side of [-1,1]) bricks.push({ name: 'chimney-brick-courses', center: [-13.38+i*0.32,y,1.4+side*0.71], size: [0.302,0.113,0.05], material: m.brick });
  }
  instances(chimney, bricks);
  box(chimney, { name: 'chimney-corbel', center: [-13.06,8.1,1.4], size: [1.14,0.34,1.58], material: m.brick });
  box(chimney, { name: 'chimney-crown', center: [-13.06,8.34,1.4], size: [1.23,0.12,1.68], material: m.stone });
  for (const x of [-13.36,-12.76]) beam(chimney, { start: [x,8.38,1.4], end:[x,8.67,1.4], width:0.055,name:'chimney-cap-support' }, m.black);
  box(chimney, { name: 'chimney-metal-cap', center: [-13.06,8.7,1.4], size: [0.98,0.12,1.3], material: m.black });
}
