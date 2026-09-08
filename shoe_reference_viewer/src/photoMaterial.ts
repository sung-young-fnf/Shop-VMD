import * as THREE from 'three';
export function photoQuarter(base:THREE.Texture,photo:THREE.Texture,outer:boolean,gum=false):THREE.MeshBasicMaterial{
 const material=new THREE.MeshBasicMaterial({map:base,color:0xffffff,side:THREE.DoubleSide,toneMapped:false});
 material.onBeforeCompile=shader=>{
  shader.uniforms.shoePhoto={value:photo};
  shader.vertexShader='varying vec3 vShoePosition;\nvarying vec2 vShoeUv;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvShoePosition=position;vShoeUv=uv;');
  shader.fragmentShader='uniform sampler2D shoePhoto;\nvarying vec3 vShoePosition;\nvarying vec2 vShoeUv;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float sx=${outer?'200.0+(1.7-vShoePosition.z)/3.4*1600.0':'200.0+(1.7+vShoePosition.z)/3.4*1600.0'};
   vec2 photoUv=vec2(sx/2000.0,1.0-(1640.0-vShoePosition.y/3.4*1600.0)/2667.0);
   vec4 photographed=texture2D(shoePhoto,photoUv);
   float fade=1.0-smoothstep(0.79,0.99,vShoeUv.y/4.0);
   float valid=${outer?'photographed.a':'1.0-smoothstep(.90,.97,min(photographed.r,min(photographed.g,photographed.b)))'};
   ${gum?"valid*=smoothstep(1.05,1.16,photographed.r/max(.001,photographed.g))*smoothstep(1.03,1.13,photographed.g/max(.001,photographed.b))*smoothstep(.08,.30,abs(vShoePosition.x));":""}
   diffuseColor.rgb=mix(diffuseColor.rgb,photographed.rgb,fade*valid);
  `);
 };
 material.customProgramCacheKey=()=>`shoe-photo-${outer}-${gum}`;
 return material;
}
