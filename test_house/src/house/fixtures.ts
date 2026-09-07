import * as THREE from 'three';
import { box, group, instances } from './primitives';
import type { Solid } from './primitives';
import type { HouseMaterials } from './materials';

export function createFixtures(parent: THREE.Group, m: HouseMaterials): THREE.Group {
  const fixtures=group(parent,'kitchen-and-service-fixtures'); fixtures.position.y=0.46;
  box(fixtures,{name:'kitchen-island',center:[-3.65,0.44,1.72],size:[1.07,0.88,3.46],material:m.sage});
  box(fixtures,{name:'island-stone-top',center:[-3.65,0.93,1.72],size:[1.23,0.08,3.62],material:m.trim});
  box(fixtures,{name:'farmhouse-sink',center:[-3.45,0.99,1.5],size:[0.57,0.09,0.71],material:m.wall});
  box(fixtures,{name:'sink-basin',center:[-3.44,1.04,1.5],size:[0.4,0.03,0.54],material:m.stone});
  box(fixtures,{name:'sink-faucet',center:[-3.15,1.17,1.5],size:[0.04,0.32,0.05],material:m.black});
  box(fixtures,{name:'faucet-spout',center:[-3.25,1.32,1.5],size:[0.24,0.04,0.05],material:m.black});
  for(const z of [0.3,1.4,2.5,3.6]) {
    box(fixtures,{name:'base-cabinet',center:[-1.9,0.44,z],size:[0.7,0.88,1.03],material:m.oak});
    box(fixtures,{name:'countertop',center:[-1.9,0.93,z],size:[0.77,0.075,1.06],material:m.trim});
    box(fixtures,{name:'cabinet-handle',center:[-2.27,0.7,z],size:[0.035,0.05,0.29],material:m.black});
  }
  box(fixtures,{name:'range-cooktop',center:[-1.92,0.985,1.65],size:[0.58,0.04,0.91],material:m.black});
  for (const x of [-2.08,-1.78]) for (const z of [1.42,1.87]) {
    const burner=new THREE.Mesh(new THREE.TorusGeometry(0.095,0.014,6,16),m.stone);
    burner.name='stove-burner';burner.rotation.x=-Math.PI/2;burner.position.set(x,1.01,z);fixtures.add(burner);
  }
  box(fixtures,{name:'refrigerator',center:[-1.92,1.0,4.35],size:[0.76,2.0,0.89],material:m.stone});
  box(fixtures,{name:'fridge-seam',center:[-2.31,1.01,4.35],size:[0.015,1.95,0.018],material:m.black});
  for (const z of [0.4,1.4,2.4,3.4]) {
    box(fixtures,{name:'island-stool',center:[-4.6,0.61,z],size:[0.4,0.08,0.4],material:m.oak});
    box(fixtures,{name:'stool-leg',center:[-4.6,0.3,z],size:[0.09,0.6,0.09],material:m.black});
  }
  for (const x of [0.9,2.15]) {
    box(fixtures,{name:'laundry-appliance',center:[x,0.48,-4.25],size:[0.9,0.96,0.8],material:m.trim});
    const door=new THREE.Mesh(new THREE.CylinderGeometry(0.29,0.29,0.06,24),m.black);
    door.name='washer-round-door';door.rotation.x=Math.PI/2;door.position.set(x,0.49,-3.82);fixtures.add(door);
  }
  for (const [x,z] of [[-7.3,-3.85],[-0.15,4.55]] as const) {
    box(fixtures,{name:'bath-vanity',center:[x,0.42,z],size:[1.62,0.84,0.61],material:m.oak});
    box(fixtures,{name:'vanity-top',center:[x,0.87,z],size:[1.7,0.06,0.67],material:m.trim});
  }
  box(fixtures,{name:'primary-shower-tray',center:[0.4,0.07,2.45],size:[1.2,0.12,1.22],material:m.trim});
  box(fixtures,{name:'shower-glass',center:[0.4,1.08,3.04],size:[1.2,2.0,0.035],material:m.glass});
  box(fixtures,{name:'guest-bath-tub',center:[-7.3,0.32,-6.55],size:[1.45,0.62,0.8],material:m.trim});
  box(fixtures,{name:'guest-bath-tub-basin',center:[-7.3,0.65,-6.55],size:[1.19,0.03,0.59],material:m.stone});
  const flooring: Solid[] = [];
  for (let x=-12.6;x<-1.5;x+=0.22) for(let z=-0.98;z<4.8;z+=1.6) flooring.push({name:'oak-floor-plank-seams',center:[x,0.032,z],size:[0.006,0.006,1.585],material:m.oak});
  instances(fixtures,flooring);
  const suspended=group(parent,'suspended-interior-fixtures');
  for(const z of [0.5,1.8,3.1]) {
    box(suspended,{name:'pendant-cord',center:[-3.65,2.9,z],size:[0.015,1.0,0.015],material:m.black});
    const shade=new THREE.Mesh(new THREE.ConeGeometry(0.25,0.25,24,1,true),m.black);
    shade.name='island-pendant-shade';shade.position.set(-3.65,2.36,z);suspended.add(shade);
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,8),m.light);bulb.name='pendant-bulb';bulb.position.set(-3.65,2.25,z);suspended.add(bulb);
  }
  return suspended;
}
