import * as THREE from 'three';
export function wordMark(text:string,color:string):THREE.MeshBasicMaterial{
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('No canvas context');ctx.fillStyle=color;ctx.font='italic 900 140px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,138);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.1,side:THREE.DoubleSide,toneMapped:false});
}
