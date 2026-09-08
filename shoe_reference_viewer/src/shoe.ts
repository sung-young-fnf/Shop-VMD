import * as THREE from 'three';
import {edgeAngle,heelSurface,rearUV,grid,section,tube,upper} from './geometry';
import {addLaces} from './laces';
import {addSole} from './sole';
import {wordMark} from './marks';
import type {ShoeMaterials} from './materials';
export function createShoe(m:ShoeMaterials):THREE.Group{
 const root=new THREE.Group();root.name='M26N3ACVSP46N';
 const add=(geometry:THREE.BufferGeometry,material:THREE.Material,name:string)=>{const mesh=new THREE.Mesh(geometry,material);mesh.name=name;root.add(mesh);return mesh;};
 addSole(root,m);
 for(const sign of [-1,1]){
  add(grid(140,30,(u,v)=>{const z=-1.1+u*2.797;const a=edgeAngle(z)*v;const point=upper(z,sign===1?a:Math.PI-a),join=heelSurface(sign*Math.PI/2,v);return point.lerp(join,1-THREE.MathUtils.smoothstep(z,-1.1,-.85));},[18,4]),sign===1?m.outer:m.inner,`canvas-quarter-${sign}`);
 }
 const toeBoundary=(a:number)=>.75+.39*Math.sin(a);
 add(grid(70,40,(u,v)=>{const a=u*Math.PI,z=toeBoundary(a)+(1.697-toeBoundary(a))*v;return upper(z,a,.01);},[7,4]),m.fuzzy,'suede-toe-overlay');
 root.add(tube(Array.from({length:81},(_,i)=>{const a=i/80*Math.PI;return upper(toeBoundary(a),a,.019);}),.003,m.stitch));
 add(rearUV(grid(72,28,(u,v)=>heelSurface((u-.5)*Math.PI,v))),m.rearPhoto,'photo-continuous-heel');
 const perimeter=(t:number)=>{const u=t/(Math.PI*2);let z:number,x:number;
 if(u<.25){z=-1.1+.63*u/.25;x=section(z).width*Math.cos(edgeAngle(z));}
 else if(u<.35){const a=(u-.25)/.1*Math.PI;z=-.47+.025*Math.sin(a);x=section(-.47).width*Math.cos(edgeAngle(-.47))*Math.cos(a);}
 else if(u<.60){z=-.47-.63*(u-.35)/.25;x=-section(z).width*Math.cos(edgeAngle(z));}
 else{return heelSurface(-Math.PI/2+(u-.60)/.40*Math.PI,1);}
 return new THREE.Vector3(x,upper(z,edgeAngle(z)).y-.005,z);};
 const collar=Array.from({length:97},(_,i)=>perimeter(i/96*Math.PI*2));root.add(tube(collar,.044,m.lace));
 add(grid(96,14,(u,v)=>{const p=perimeter(u*Math.PI*2);p.x*=.95;p.y=THREE.MathUtils.lerp(p.y-.01,.36,v);return p;},[6,2]),m.lining,'open-collar-lining');
 add(grid(36,30,(u,v)=>{const a=u*Math.PI*2,r=v;return new THREE.Vector3(.29*Math.sin(a)*r,.36,-1.01+.65*Math.cos(a)*r);},[2,3]),m.lining,'visible-insole');

 const insoleMark=add(new THREE.PlaneGeometry(.26,.14),wordMark('MLB','#233236'),'reconstructed-insole-mark');insoleMark.rotation.x=-Math.PI/2;insoleMark.position.set(0,.366,-1.15);
 addLaces(root,m);
 return root;
}
