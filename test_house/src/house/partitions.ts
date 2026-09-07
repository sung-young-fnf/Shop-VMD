import * as THREE from 'three';
import { box, group } from './primitives';
import type { HouseMaterials } from './materials';

type Partition = readonly [number, number, number, number];
const partitions: readonly Partition[] = [
  [-12.8,-1.25,-7.55,-1.25],[-6.65,-1.25,-1.4,-1.25],[-5.25,-4.85,-5.25,-1.25],
  [-8.2,-8.5,-8.2,-2.55],[-8.2,-2.55,-6.4,-2.55],[-6.4,-4.85,-6.4,-3.75],[-6.4,-3.0,-6.4,-2.55],
  [-6.4,-8.5,-6.4,-5.1],[-8.2,-7.0,-6.4,-7.0],[-8.2,-5.05,-6.4,-5.05],
  [-1.4,-4.85,-1.4,-1.2],[-1.4,0.1,-1.4,5],[1.15,0.1,1.15,1.7],[1.15,2.35,1.15,5],
  [-1.4,0.1,1.15,0.1],[1.15,0.1,1.85,0.1],[2.8,0.1,5.35,0.1],
  [-1.4,1.7,1.15,1.7],[-0.4,1.7,-0.4,3.35],[-1.4,4.4,1.15,4.4],
  [5.35,-4.85,5.35,-0.9],[5.35,0.0,5.35,5],[3.3,-4.85,3.3,-2.15],[3.3,-2.15,5.35,-2.15],
  [0.3,-4.85,0.3,-1.3],[0.3,-1.3,1.5,-1.3],[1.5,-1.3,1.5,-2.75],[1.5,-2.75,3.3,-2.75],
  [-1.4,-2.8,0.3,-2.8],[-1.4,-3.35,0.3,-3.35],
];

export function createPartitions(parent: THREE.Group, m: HouseMaterials): THREE.Group {
  const upper = group(parent, 'interior-upper-walls');
  const lower = group(parent, 'interior-cutaway-walls');
  for (const [x0,z0,x1,z1] of partitions) {
    const width = Math.abs(x1-x0) || 0.13;
    const depth = Math.abs(z1-z0) || 0.13;
    box(lower,{name:'partition-base',center:[(x0+x1)/2,0.95,(z0+z1)/2],size:[width,1.08,depth],material:m.wall});
    box(upper,{name:'partition-top',center:[(x0+x1)/2,2.56,(z0+z1)/2],size:[width,2.14,depth],material:m.wall});
    box(lower,{name:'skirting',center:[(x0+x1)/2,0.51,(z0+z1)/2],size:[width+0.04,0.13,depth+0.04],material:m.trim});
  }
  return upper;
}
