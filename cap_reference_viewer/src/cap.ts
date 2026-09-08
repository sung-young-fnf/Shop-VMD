import * as THREE from 'three';
import {tapeMaterial} from './interior';
import {bill,crown,curve,frontSurface,lowerAngle,patch} from './surfaces';
import type {CapMaterials} from './materials';
export function createCap(m:CapMaterials):THREE.Group{
 const tape=tapeMaterial();
 const cap=new THREE.Group();cap.name='M21N3ACP7701N';
 const add=(geometry:THREE.BufferGeometry,material:THREE.Material,name:string)=>{const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;cap.add(mesh);return mesh;};
 for(let panel=0;panel<6;panel++){
  const theta0=panel*Math.PI/3;
  add(patch(32,40,(u,v)=>{const a=theta0+u*Math.PI/3;return crown(a,.012+(lowerAngle(a)-.012)*v);},[2.8,4]),m.cloth,`crown-panel-${panel}`);
  const points=Array.from({length:45},(_,i)=>crown(theta0,.05+(lowerAngle(theta0)-.05)*i/44).multiplyScalar(1.002));
  cap.add(curve(points,.004,m.thread));
  for(const offset of [-.012,.012]){
   const seam=Array.from({length:45},(_,i)=>crown(theta0+offset,.13+(lowerAngle(theta0)-.13)*i/44).multiplyScalar(1.003));
   cap.add(curve(seam,.0018,m.thread));
  }
 }
 add(patch(96,36,(u,v)=>bill(u*2-1,v),[6.4,3.5]),m.cloth,'curved-visor');
 add(patch(96,24,(u,v)=>bill(u*2-1,v).add(new THREE.Vector3(0,-.018,0)),[6.4,3.5]),m.cloth,'visor-underside');
 cap.add(curve(Array.from({length:97},(_,i)=>bill(i/48-1,1)),.012,m.thread));
 for(let row=0;row<7;row++){
  cap.add(curve(Array.from({length:97},(_,i)=>bill((i/48-1)*.986,.27+row*.105).add(new THREE.Vector3(0,.004,0))),.002,m.thread));
 }
 cap.add(curve(Array.from({length:145},(_,i)=>{const a=i/144*Math.PI*2;return crown(a,lowerAngle(a)).multiplyScalar(1.003);}),.011,m.thread));
 const button=add(new THREE.SphereGeometry(.075,32,16),m.cloth,'covered-button');button.position.y=1.208;button.scale.y=.44;
 for(let i=0;i<6;i++){
  const a=(i+.5)*Math.PI/3,p=crown(a,.83).multiplyScalar(1.005);
  const normal=new THREE.Vector3(p.x,p.y*.65,p.z).normalize();
  const eyelet=add(new THREE.TorusGeometry(.021,.006,8,20),m.thread,`eyelet-${i}`);eyelet.position.copy(p);eyelet.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);
  const hole=add(new THREE.CircleGeometry(.012,16),m.dark,'eyelet-shadow');hole.position.copy(p.clone().addScaledVector(normal,-.002));hole.quaternion.copy(eyelet.quaternion);
 }
 const logo=add(patch(24,28,(u,v)=>frontSurface((u-.5)*.35,.44+(1-v)*.36),[1,1]),m.logo,'photo-ny-embroidery');
 const uv=logo.geometry.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setY(i,1-uv.getY(i));
 add(patch(32,6,(u,v)=>{const a=u*Math.PI*2,p=crown(a,Math.PI/2,.024);p.y+=v*.115-.012;return p;}),m.dark,'interior-sweatband');
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3;
  add(patch(4,35,(u,v)=>{const t=.06+(lowerAngle(a)-.06)*v;const p=crown(a+(u-.5)*.055/Math.max(.15,Math.sin(t)),t,.011);p.y-=.012;return p;}),tape,`inside-seam-tape-${i}`);
 }
 add(patch(40,4,(u,v)=>{const x=(u-.5)*1.3;return new THREE.Vector3(x,-.06+v*.135,-1.05*Math.sqrt(1-x*x)-.018);},[3,.45]),m.cloth,'adjustable-strap');
 const buckle=add(new THREE.BoxGeometry(.24,.165,.045),m.silver,'brushed-clasp');buckle.position.set(-.47,.025,-.97);buckle.rotation.y=-.3;
 const claspLine=add(new THREE.BoxGeometry(.007,.12,.048),m.dark,'clasp-edge');claspLine.position.copy(buckle.position).add(new THREE.Vector3(.083,0,-.024));
 const loop=add(new THREE.TorusGeometry(.075,.012,8,32),m.silver,'strap-metal-loop');loop.scale.set(.55,1,1);loop.position.set(-.66,.04,-.84);loop.rotation.y=-.55;
 const back=add(patch(20,16,(u,v)=>{const x=(u-.5)*.34,y=.51+(1-v)*.215,p=frontSurface(x,y,.011,true);return p;}),m.rearLogo,'rear-mlb-embroidery');
 const buv=back.geometry.getAttribute('uv');for(let i=0;i<buv.count;i++){buv.setX(i,1-buv.getX(i));buv.setY(i,1-buv.getY(i));}
 const rivet=add(new THREE.SphereGeometry(.025,12,8),m.silver,'inside-button-rivet');rivet.position.y=1.168;rivet.scale.y=.3;
 return cap;
}
