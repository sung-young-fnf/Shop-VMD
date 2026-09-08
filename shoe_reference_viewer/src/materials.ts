import * as THREE from 'three';
import {photoQuarter} from './photoMaterial';
export async function loadMaterials(){
 const loader=new THREE.TextureLoader();const [canvas,suede,la,heel]=await Promise.all(['canvas-refined.png','suede-refined.png','la-clean.png','heel.png'].map(p=>loader.loadAsync(`/assets/${p}`)));
 for(const texture of [canvas,suede,la,heel]){texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=16;}
 for(const texture of [canvas,suede])texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 const [outerPhoto,innerPhoto,solePhoto,rearAtlas]=await Promise.all(['outer-photo.png','inner-photo.jpg','outsole-atlas.png','rear-atlas.png'].map(p=>loader.loadAsync(`/assets/${p}`)));
 for(const texture of [outerPhoto,innerPhoto,solePhoto,rearAtlas]){texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=16;}
 const outer=photoQuarter(canvas,outerPhoto,true),inner=photoQuarter(canvas,innerPhoto,false);
 const gumBase=new THREE.DataTexture(new Uint8Array([162,122,83,255]),1,1);gumBase.colorSpace=THREE.SRGBColorSpace;gumBase.needsUpdate=true;
 const outerGum=photoQuarter(gumBase,outerPhoto,true,true),innerGum=photoQuarter(gumBase,innerPhoto,false,true);
 const rearPhoto=new THREE.MeshBasicMaterial({map:rearAtlas,side:THREE.DoubleSide,toneMapped:false});
 rearPhoto.onBeforeCompile=shader=>{shader.uniforms.heelSuede={value:suede};shader.fragmentShader=`uniform sampler2D heelSuede;
`+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
vec3 suedeColor=texture2D(heelSuede,vMapUv*vec2(4.0,5.0)).rgb;
float edge=smoothstep(.03,.22,vMapUv.x)*(1.0-smoothstep(.78,.97,vMapUv.x));
float rubber=smoothstep(1.10,1.20,diffuseColor.r/max(.001,diffuseColor.g));
diffuseColor.rgb=mix(suedeColor,diffuseColor.rgb,edge*(1.0-rubber));
`);};
 rearPhoto.customProgramCacheKey=()=> 'heel-suede-transition';
 const rearGum=new THREE.MeshBasicMaterial({map:rearAtlas,side:THREE.DoubleSide,toneMapped:false});
 rearGum.onBeforeCompile=shader=>{shader.uniforms.gumFallback={value:new THREE.Color(0x9e7952)};shader.fragmentShader=`uniform vec3 gumFallback;
`+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
float chroma=smoothstep(1.05,1.16,diffuseColor.r/max(.001,diffuseColor.g))*smoothstep(1.03,1.13,diffuseColor.g/max(.001,diffuseColor.b));diffuseColor.rgb=mix(gumFallback,diffuseColor.rgb,chroma);`);};
 rearGum.customProgramCacheKey=()=>"rear-gum-mask";
 for(const material of [rearPhoto,rearGum]){
  const compile=material.onBeforeCompile.bind(material),key=material.customProgramCacheKey();
  material.onBeforeCompile=(shader,renderer)=>{
   compile(shader,renderer);shader.uniforms.heelOuter={value:outerPhoto};shader.uniforms.heelInner={value:innerPhoto};
   shader.vertexShader=`varying vec3 heelPosition;
`+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
heelPosition=position;
`);
   shader.fragmentShader=`varying vec3 heelPosition;
uniform sampler2D heelOuter;
uniform sampler2D heelInner;
`+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
float sideX=200.0+(1.7+(heelPosition.x>0.0?-heelPosition.z:heelPosition.z))/3.4*1600.0;
vec2 sideUv=vec2(sideX/2000.0,1.0-(1640.0-heelPosition.y/3.4*1600.0)/2667.0);
vec4 sidePhoto=heelPosition.x>0.0?texture2D(heelOuter,sideUv):texture2D(heelInner,sideUv);
float sideValid=heelPosition.x>0.0?sidePhoto.a:1.0-smoothstep(.90,.97,min(sidePhoto.r,min(sidePhoto.g,sidePhoto.b)));
diffuseColor.rgb=mix(diffuseColor.rgb,sidePhoto.rgb,smoothstep(.22,.35,abs(heelPosition.x))*sideValid);
#include <color_fragment>
`);
  };material.customProgramCacheKey=()=>key+'-side-blend';
 }
 const outsolePhoto=new THREE.MeshBasicMaterial({map:solePhoto,side:THREE.DoubleSide,toneMapped:false});
 const cloth=new THREE.MeshStandardMaterial({map:canvas,roughness:1,side:THREE.DoubleSide,color:0xffffff});
 const fuzzy=new THREE.MeshStandardMaterial({map:suede,roughness:1,side:THREE.DoubleSide,color:0xffffff});
 const leather=new THREE.MeshStandardMaterial({color:0xd9dacf,roughness:.83,side:THREE.DoubleSide});
 const lining=new THREE.MeshStandardMaterial({map:canvas,color:0xb7c4bd,roughness:1,side:THREE.DoubleSide});
 const gum=new THREE.MeshStandardMaterial({color:0xb08a62,roughness:.94,side:THREE.DoubleSide});
 const tread=new THREE.MeshStandardMaterial({color:0xc59965,roughness:.94});
 const stitch=new THREE.MeshStandardMaterial({color:0xe2dfd0,roughness:1});
 const lace=new THREE.MeshStandardMaterial({map:canvas,color:0xebede5,roughness:1});
 const eyelet=new THREE.MeshStandardMaterial({color:0xbcb7a4,metalness:.35,roughness:.7});
 const black=new THREE.MeshStandardMaterial({color:0x172029,roughness:1,side:THREE.DoubleSide});
 const logo=new THREE.MeshBasicMaterial({map:la,transparent:true,alphaTest:.2,side:THREE.DoubleSide,toneMapped:false});
 const heelPrint=new THREE.MeshBasicMaterial({map:heel,transparent:true,alphaTest:.2,side:THREE.DoubleSide,toneMapped:false});
 return {rearGum,rearPhoto,outerGum,innerGum,outer,inner,outsolePhoto,cloth,fuzzy,leather,lining,gum,tread,stitch,lace,eyelet,black,logo,heelPrint};
}
export type ShoeMaterials=Awaited<ReturnType<typeof loadMaterials>>;
