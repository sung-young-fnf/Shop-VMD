import * as THREE from 'three';
export async function materials(){
 const loader=new THREE.TextureLoader();
 const [twill,ny,rear]=await Promise.all(['twill-refined.png','ny.png','rear.png'].map(name=>loader.loadAsync(`/assets/${name}`)));
 for(const texture of [twill,ny,rear]){texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=16;}
 twill.wrapS=twill.wrapT=THREE.RepeatWrapping;twill.repeat.set(1.35,1.35);
 const cloth=new THREE.MeshStandardMaterial({map:twill,roughness:1,metalness:0,side:THREE.DoubleSide,color:0xa6adba});
 const thread=new THREE.MeshStandardMaterial({color:0x17273e,roughness:1});
 const dark=new THREE.MeshStandardMaterial({color:0x0b1526,roughness:1,side:THREE.DoubleSide});
 const ivory=new THREE.MeshStandardMaterial({color:0xc4c4b8,roughness:1});
 const silver=new THREE.MeshStandardMaterial({color:0x9d9b90,roughness:.48,metalness:.8});
 const logo=new THREE.MeshBasicMaterial({map:ny,transparent:true,alphaTest:.15,side:THREE.DoubleSide,toneMapped:false});
 const rearLogo=new THREE.MeshBasicMaterial({map:rear,side:THREE.DoubleSide,toneMapped:false});
 return {cloth,thread,dark,ivory,silver,logo,rearLogo};
}
export type CapMaterials=Awaited<ReturnType<typeof materials>>;
