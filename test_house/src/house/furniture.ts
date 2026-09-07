import * as THREE from 'three';
import { box, group } from './primitives';
import type { HouseMaterials } from './materials';
import type { V3 } from './primitives';

function bed(parent: THREE.Group, center: V3, m: HouseMaterials): void {
  const part = group(parent, 'bed-assembly');
  part.position.set(...center);
  box(part,{name:'oak-bed-frame',center:[0,0.2,0],size:[1.82,0.28,2.18],material:m.oak});
  box(part,{name:'linen-mattress',center:[0,0.44,0],size:[1.72,0.24,2.06],material:m.linen});
  box(part,{name:'sage-duvet',center:[0,0.59,0.37],size:[1.75,0.09,1.25],material:m.sage});
  box(part,{name:'headboard',center:[0,0.6,-1.1],size:[1.87,1.2,0.12],material:m.oak});
  for (const x of [-0.44,0.44]) box(part,{name:'pillow',center:[x,0.64,-0.72],size:[0.67,0.16,0.43],material:m.linen});
  for (const x of [-1.22,1.22]) {
    box(part,{name:'bedside-table',center:[x,0.3,-0.75],size:[0.48,0.6,0.52],material:m.oak});
    box(part,{name:'bedside-lamp',center:[x,0.79,-0.75],size:[0.23,0.31,0.23],material:m.linen});
  }
}

function chair(parent: THREE.Group, center: V3, m: HouseMaterials): THREE.Group {
  const part=group(parent,'dining-chair'); part.position.set(...center);
  box(part,{name:'chair-seat',center:[0,0.45,0],size:[0.49,0.08,0.5],material:m.oak});
  box(part,{name:'chair-back',center:[0,0.77,-0.23],size:[0.48,0.46,0.06],material:m.oak});
  for (const x of [-0.2,0.2]) for (const z of [-0.2,0.2]) box(part,{name:'chair-leg',center:[x,0.22,z],size:[0.045,0.44,0.045],material:m.wood});
  return part;
}

export function createFurniture(parent: THREE.Group, m: HouseMaterials): void {
  const interior=group(parent,'furnished-interior'); interior.position.y=0.46;
  box(interior,{name:'living-rug',center:[-10.25,0.025,1.55],size:[3.9,0.025,4.5],material:m.linen});
  box(interior,{name:'sofa-plinth',center:[-8.8,0.2,1.45],size:[1.0,0.24,2.7],material:m.oak});
  box(interior,{name:'sofa-back',center:[-8.4,0.65,1.45],size:[0.23,0.82,2.7],material:m.linen});
  for (const z of [0.6,1.45,2.3]) box(interior,{name:'sofa-cushion',center:[-8.93,0.48,z],size:[0.78,0.25,0.79],material:m.linen});
  for (const z of [0.1,2.8]) box(interior,{name:'sofa-arm',center:[-8.8,0.58,z],size:[1.0,0.55,0.15],material:m.linen});
  box(interior,{name:'coffee-table',center:[-10.3,0.37,1.5],size:[1.2,0.1,1.5],material:m.oak});
  for(const x of [-10.75,-9.85]) for(const z of [0.95,2.05]) box(interior,{name:'coffee-table-leg',center:[x,0.17,z],size:[0.07,0.34,0.07],material:m.wood});
  box(interior,{name:'table-book',center:[-10.25,0.445,1.28],size:[0.36,0.04,0.48],material:m.sage});
  box(interior,{name:'fireplace-hearth',center:[-12.5,0.13,1.4],size:[0.55,0.24,2.0],material:m.stone});
  box(interior,{name:'fireplace-dark-opening',center:[-12.37,0.65,1.4],size:[0.15,0.96,1.1],material:m.black});
  box(interior,{name:'fireplace-mantel',center:[-12.37,1.5,1.4],size:[0.5,0.14,1.75],material:m.oak});
  box(interior,{name:'dining-tabletop',center:[-6.1,0.78,2.35],size:[1.2,0.1,2.6],material:m.oak});
  for (const x of [-6.52,-5.68]) for (const z of [1.3,3.4]) box(interior,{name:'dining-table-leg',center:[x,0.38,z],size:[0.08,0.76,0.08],material:m.wood});
  for (const z of [1.45,2.35,3.25]) {
    chair(interior,[-7.03,0,z],m).rotation.y = Math.PI / 2;
    chair(interior,[-5.17,0,z],m).rotation.y = -Math.PI / 2;
  }
  for (const x of [-6.36,-5.86]) for (const z of [1.6,2.4,3.2]) {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.022,24),m.trim);
    plate.name='dining-place-setting';plate.position.set(x,0.847,z);interior.add(plate);
  }
  bed(interior,[3.2,0,2.2],m);
  bed(interior,[-3.45,0,-3.25],m);
  bed(interior,[-4.6,0,-6.6],m);
  box(interior,{name:'flex-desk',center:[-11.85,0.76,-3.5],size:[0.62,0.1,1.7],material:m.oak});
  box(interior,{name:'flex-desk-support',center:[-11.85,0.35,-3.5],size:[0.5,0.7,1.4],material:m.wall});
  box(interior,{name:'desk-monitor',center:[-12.06,1.07,-3.5],size:[0.08,0.42,0.68],material:m.black});
  chair(interior,[-10.9,0,-3.4],m);
  box(interior,{name:'guest-daybed',center:[-9.0,0.37,-3.7],size:[1.25,0.5,1.9],material:m.linen});
  box(interior,{name:'garage-workbench',center:[9.45,0.93,-4.4],size:[4.4,0.13,0.75],material:m.oak});
  box(interior,{name:'garage-storage-cabinets',center:[6.0,0.85,-2.7],size:[0.75,1.7,2.7],material:m.sage});
  for (const x of [7.45,11.4]) box(interior,{name:'workbench-leg',center:[x,0.45,-4.4],size:[0.13,0.9,0.62],material:m.black});
  for (let i=0;i<5;i++) box(interior,{name:'garage-shelving',center:[6,0.4+i*0.34,-2.7],size:[0.8,0.05,2.72],material:m.oak});
}
