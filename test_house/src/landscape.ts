import * as THREE from 'three';

export function createLandscape(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'landscape';
  const soil = new THREE.MeshStandardMaterial({color:0xa0ad82,roughness:1});
  const grass = new THREE.MeshStandardMaterial({color:0xa8bb89,roughness:1});
  const path = new THREE.MeshStandardMaterial({color:0xd7d5c1,roughness:1});
  const timber = new THREE.MeshStandardMaterial({color:0x786b50,roughness:1});
  const slab = new THREE.Mesh(new THREE.BoxGeometry(42,.7,30),soil);
  slab.name='garden-parcel'; slab.position.set(-1.8,-.49,0);slab.receiveShadow=true;root.add(slab);
  const lawn=new THREE.Mesh(new THREE.BoxGeometry(41.9,.12,29.9),grass);
  lawn.position.set(-1.8,-.08,0);lawn.receiveShadow=true;root.add(lawn);
  const drive=new THREE.Mesh(new THREE.BoxGeometry(8.4,.06,10),path);
  drive.position.set(9.05,.02,9.4);drive.receiveShadow=true;root.add(drive);
  const tileGeometry=new THREE.BoxGeometry(1.1,.08,.62);
  for(let i=0;i<7;i++){
    const tile=new THREE.Mesh(tileGeometry,path);tile.position.set(-6.2,.05,9.9+i*.74);tile.receiveShadow=true;root.add(tile);
  }
  const treePositions=[[-20,-11,6],[-17,-12,7],[-12,-12,6],[-8,-13,7],[-2,-12,5.8],[3,-12,7.8],[8,-12,6.3],[15,-10,7],[17,-5,6],[-21,-4,6.5],[-21,3,5.6],[17,1,5.5],[17,12,4.8],[-18,12,4]] as const;
  const trunkGeometry=new THREE.CylinderGeometry(.12,.23,1,7);
  const crownGeometry=new THREE.ConeGeometry(1,1,7);
  const foliage=[0x658c70,0x76977a,0x86a27b].map(color=>new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true}));
  for(const [x,z,h] of treePositions){
    const tree=new THREE.Group();tree.position.set(x,0,z);tree.name='garden-pine';
    const trunk=new THREE.Mesh(trunkGeometry,timber);trunk.scale.y=h*.75;trunk.position.y=h*.375;trunk.castShadow=true;tree.add(trunk);
    for(let level=0;level<4;level++){
      const crown=new THREE.Mesh(crownGeometry,foliage[level%3]);
      const radius=(1-level*.18)*h*.24;
      crown.scale.set(radius,h*.4,radius);crown.position.y=h*(.42+level*.145);crown.rotation.y=level*.7;crown.castShadow=true;tree.add(crown);
    }
    root.add(tree);
  }
  const shrubGeometry=new THREE.IcosahedronGeometry(1,1);
  const shrubs=new THREE.InstancedMesh(shrubGeometry,new THREE.MeshStandardMaterial({color:0x779264,roughness:1,flatShading:true}),48);
  const dummy=new THREE.Object3D();
  for(let i=0;i<48;i++){
    const row=i<28;const j=row?i:i-28;
    dummy.position.set(row?-15+j*.61:-18.6,.3,row?9.4:-9+j*.87);
    const s=.28+((i*17)%7)*.035;dummy.scale.set(s,s*1.2,s);dummy.rotation.y=i*1.37;dummy.updateMatrix();shrubs.setMatrixAt(i,dummy.matrix);
  }
  shrubs.castShadow=true;root.add(shrubs);
  const stemGeometry=new THREE.ConeGeometry(.035,.5,3);
  const grasses=new THREE.InstancedMesh(stemGeometry,new THREE.MeshStandardMaterial({color:0xb8b994,roughness:1}),160);
  for(let i=0;i<160;i++){
    const clump=Math.floor(i/10);const a=i*2.4;const spread=(i%10)*.035;
    dummy.position.set(-14+clump*1.45+Math.cos(a)*spread,.22,10.25+Math.sin(a)*spread);
    dummy.scale.set(1,.55+(i%7)*.12,1);dummy.rotation.set(Math.cos(a)*.2,a,Math.sin(a)*.2);dummy.updateMatrix();grasses.setMatrixAt(i,dummy.matrix);
  }
  root.add(grasses);
  return root;
}
