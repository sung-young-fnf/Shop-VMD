import * as THREE from 'three';
export function tapeMaterial():THREE.MeshStandardMaterial{
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=1024;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
 ctx.fillStyle='#122238';ctx.fillRect(0,0,128,1024);ctx.fillStyle='#7b8589';ctx.font='bold 32px Arial';ctx.textAlign='center';
 for(let y=95;y<1024;y+=210)ctx.fillText('MLB',64,y);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
 return new THREE.MeshStandardMaterial({map:texture,roughness:1,side:THREE.DoubleSide});
}
