import * as THREE from 'three';
import {grid,section,base,heelSurface,rearUV,outsoleContour} from './geometry';
import bounds from './sole-bounds.json';
import type {ShoeMaterials} from './materials';
function lugGeometry():THREE.ExtrudeGeometry{const s=new THREE.Shape();s.moveTo(-.048,-.047);s.lineTo(.048,-.047);s.lineTo(.054,.015);s.lineTo(0,.064);s.lineTo(-.054,.015);s.closePath();return new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:true,bevelThickness:.007,bevelSize:.008,bevelSegments:2,steps:1});}
const treadLayout:readonly (readonly number[])[]=[
 [125,675,14,0],[140,620,18,.4],[177,582,18,1],[200,560,16,1],[255,548,17,0],[326,545,17,.4],[397,548,17,0],[465,559,15,1],
 [178,617,18,.5],[230,595,19,1],[295,587,23,1.5],[355,585,24,1.5],[418,587,23,1.5],[477,600,18,0],
 [120,710,16,2],[165,670,18,1],[215,674,22,1.5],[270,668,23,1.5],[327,667,25,1.5],[389,663,25,1.5],[448,663,23,1.5],
 [145,750,16,2],[180,729,19,3],[236,743,22,3],[295,748,21,3],[358,743,23,3],[418,720,21,2],[463,708,14,2],[489,702,12,2],
 [197,768,16,3],[260,779,16,3],[326,778,17,3],[540,577,15,0],[577,597,18,0],[626,595,16,0],[680,604,18,0],
 [722,636,21,0],[770,637,20,0],[803,692,22,1.5],[847,689,20,1.5],[782,607,16,0],[825,620,18,0],[859,647,16,0],
 [873,700,17,1],[864,745,15,2],[829,756,17,2],[782,766,20,3],[736,737,22,3],[680,736,22,3],[638,724,17,3],
 [618,677,18,1.5],[672,674,24,1.5],[736,686,22,1.5],[581,701,14,3],[541,710,14,3]
];
function photoUV(g:THREE.BufferGeometry,clip=false):void{
 const p=g.getAttribute('position'),uv=g.getAttribute('uv');for(let i=0;i<p.count;i++){const z=THREE.MathUtils.clamp(p.getZ(i),-1.698,1.698),w=section(z).width;if(clip){p.setZ(i,z);p.setX(i,THREE.MathUtils.clamp(p.getX(i),-w*.985,w*.985));}uv.setXY(i,(1.7-z)/3.4,1-(p.getX(i)/w+1)/2);}
}
export function addSole(root:THREE.Group,m:ShoeMaterials):void{
 for(const sign of [0,1]){const wall=new THREE.Mesh(grid(90,12,(u,v)=>{const t=u*Math.acos(-1.1/1.7),p=outsoleContour(sign===0?t:2*Math.PI-t);p.y=.07+(base(p.z)-.04)*v;return p;},[11,1]),sign===0?m.outerGum:m.innerGum);wall.name='photo-gum-sidewall';root.add(wall);}
 const floorGeometry=grid(50,150,(u,v)=>{const z=-1.67+3.37*v;return new THREE.Vector3((u*2-1)*section(z).width,.072,z);});photoUV(floorGeometry);
 const floor=new THREE.Mesh(floorGeometry,m.outsolePhoto);floor.name='photo-outsole-base';root.add(floor);
 root.add(new THREE.Mesh(grid(40,120,(u,v)=>{const z=-1.67+3.37*v;return new THREE.Vector3((u*2-1)*section(z).width,base(z)+.03,z);}),m.gum));
 for(const [px,py,size,angle] of treadLayout){
  const col=THREE.MathUtils.clamp(Math.round(px*2-200),0,1599),range=bounds[col],z=1.7-col/1600*3.4,x=((py*2-range[0])/(range[1]-range[0])*2-1)*section(z).width;
  const g=lugGeometry();g.scale(size*.070,size*.070,1);g.rotateZ(angle);g.rotateX(Math.PI/2);g.translate(x,.073,z);photoUV(g,true);const block=new THREE.Mesh(g,m.outsolePhoto);block.name='photo-aligned-tread';root.add(block);
 }
 const heel=new THREE.Mesh(grid(64,20,(u,v)=>{const a=(u-.5)*Math.PI,top=base(-1.1)+.03+.12*Math.cos(a)**2,y=.072+v*(top-.072),h=Math.max(0,(y-.18)/(.70+.12*Math.cos(a))),p=heelSurface(a,h,.002);p.x=(.435-.115*h*Math.cos(a)+.002)*Math.sin(a);p.y=y;return p;}),m.rearGum);rearUV(heel.geometry);heel.name='continuous-rubber-heel';root.add(heel);
}
