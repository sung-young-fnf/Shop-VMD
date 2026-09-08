import * as THREE from 'three';
import {grid,upper,edgeAngle,tube,section,opening} from './geometry';
import type {ShoeMaterials} from './materials';
export function addLaces(root:THREE.Group,m:ShoeMaterials):void{
 const tongueY=(z:number)=>.52+(.89-z)*.41;
 const tongue=new THREE.Mesh(grid(24,48,(u,v)=>{const z=.89-v*1.51;return new THREE.Vector3((u-.5)*Math.min(.53,2*opening(z)+.025),tongueY(z)+.035*Math.sin(u*Math.PI),z);},[2,6]),m.leather);tongue.name='single-tongue';root.add(tongue);
 for(const sign of [-1,1]){
  const stay=new THREE.Mesh(grid(5,40,(u,v)=>{const z=.81-v*1.30;const a=edgeAngle(z)-u*.17;const p=upper(z,sign===1?a:Math.PI-a,.012);return p;},[.8,6]),m.fuzzy);stay.name=`suede-eyestay-${sign}`;root.add(stay);
  root.add(tube(Array.from({length:42},(_,i)=>{const z=.81-i/41*1.3;const a=edgeAngle(z)-.17;return upper(z,sign===1?a:Math.PI-a,.019);}),.0027,m.stitch));
 }
 const count=6;
 for(let i=0;i<count;i++){
  const z=.69-i*.215,a=edgeAngle(z)-.045,p=upper(z,a,.028);
  for(const sign of [-1,1]){
   const eyelet=new THREE.Mesh(new THREE.TorusGeometry(.034,.008,8,20),m.eyelet);eyelet.position.copy(p);eyelet.position.x*=sign;eyelet.rotation.x=-Math.PI/2;eyelet.rotation.y=sign*.22;root.add(eyelet);
   const shadow=new THREE.Mesh(new THREE.CircleGeometry(.025,16),m.black);shadow.rotation.copy(eyelet.rotation);shadow.position.copy(eyelet.position);shadow.position.y-=.003;root.add(shadow);
  }
  const endY=p.y+.023;
  root.add(tube(Array.from({length:21},(_,j)=>{const q=j/20;return new THREE.Vector3(THREE.MathUtils.lerp(-p.x,p.x,q),endY+.012*Math.sin(q*Math.PI),z-.018*Math.sin(q*Math.PI));}),.018,m.lace));
  if(i<count-1){const nz=z-.215,na=edgeAngle(nz)-.045,np=upper(nz,na,.025);root.add(tube(Array.from({length:21},(_,j)=>{const q=j/20;return new THREE.Vector3(THREE.MathUtils.lerp(p.x,-np.x,q),THREE.MathUtils.lerp(endY,np.y+.025,q)+.015*Math.sin(q*Math.PI),THREE.MathUtils.lerp(z,nz,q));}),.016,m.lace));}
 }
 const tab=new THREE.Mesh(new THREE.BoxGeometry(.10,.012,.18),m.leather);tab.position.set(0,tongueY(.20)+.028,.20);root.add(tab);
 const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=320;const ctx=labelCanvas.getContext('2d');if(!ctx)throw new Error('No 2D canvas');ctx.fillStyle='#eeeee5';ctx.fillRect(0,0,512,320);ctx.fillStyle='#202b31';ctx.textAlign='center';ctx.font='bold 46px Arial';ctx.fillText('LOS ANGELES',256,70);ctx.font='bold 105px Georgia';ctx.fillText('LA',256,182);ctx.font='bold 43px Arial';ctx.fillText('DODGERS',256,262);
 const map=new THREE.CanvasTexture(labelCanvas);map.colorSpace=THREE.SRGBColorSpace;
 const label=new THREE.Mesh(grid(16,18,(u,v)=>{const z=-.58+v*.31;return new THREE.Vector3((u-.5)*.34,tongueY(z)+.035*Math.cos((u-.5)*.34/.53*Math.PI)+.008,z);}),new THREE.MeshStandardMaterial({map,roughness:1,side:THREE.DoubleSide}));const uv=label.geometry.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setY(i,1-uv.getY(i));label.name='reconstructed-tongue-label';root.add(label);
}
