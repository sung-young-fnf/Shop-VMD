import * as THREE from 'three';
import { productPhoto } from '../photo-material';
import { createRegisteredSurfaces } from './cad-photo-geometry';
import type { CadPhotoProfile } from './cad-photo-types';

export function createCadPhotoShoe(profile: CadPhotoProfile): THREE.Group {
  const root = new THREE.Group();
  root.name = `shoe-${profile.sku}`;
  Object.assign(root.userData, {
    productId: profile.sku, productSku: profile.sku, productName: profile.name,
    family: profile.family, referenceSource: profile.source, cadSource: profile.cad,
    representation: 'Photo-registered upper and outsole with observed toe patch and fixed-plane masked rear projection',
    inferredSurfaces: profile.notes,
    dimensions: 'Display scale; sample shoe size is not an outsole measurement',
    reconstruction: 'shoe-cad-photo-realism',
  });
  const sources={...profile.views,front:profile.endcaps!.front,heel:profile.endcaps!.heel};
  const materials=Object.fromEntries(Object.entries(sources).map(([role,view])=>[role,productPhoto(view.path,profile.sku)]));
  for(const {role,geometry} of createRegisteredSurfaces(profile)) {
    const material=materials[role]!;
    if(role!=='sole') {
      material.onBeforeCompile=shader=>{
        shader.uniforms['registeredHeel']={value:materials['heel']!.map};
        shader.uniforms['registeredFront']={value:materials['front']!.map};
        shader.uniforms['registeredLateral']={value:materials['lateral']!.map};
        shader.uniforms['registeredMedial']={value:materials['medial']!.map};
        const varyings='varying vec2 vHeelUv; varying vec2 vFrontUv; varying vec2 vSideUv; varying float vHeelWeight; varying float vFrontWeight; varying float vShoeSide; varying float vSideWeight;';
        shader.vertexShader=`${varyings}\nattribute vec2 heelUv; attribute vec2 frontUv; attribute vec2 sideUv; attribute float heelWeight; attribute float frontWeight; attribute float shoeSide; attribute float sideWeight;\n${shader.vertexShader}`.replace('#include <begin_vertex>','#include <begin_vertex>\nvHeelUv=heelUv; vFrontUv=frontUv; vSideUv=sideUv; vHeelWeight=heelWeight; vFrontWeight=frontWeight; vShoeSide=shoeSide; vSideWeight=sideWeight;');
        const base=role==='heel'||role==='front'?'(vShoeSide < 0.0 ? texture2D(registeredMedial,vSideUv) : texture2D(registeredLateral,vSideUv))':'texture2D(map,vMapUv)';
        shader.fragmentShader=`${varyings}\nuniform sampler2D registeredHeel; uniform sampler2D registeredFront; uniform sampler2D registeredLateral; uniform sampler2D registeredMedial;\n${shader.fragmentShader}`.replace('#include <map_fragment>',`vec4 body=${base}; body=mix(body,(vShoeSide < 0.0 ? texture2D(registeredMedial,vSideUv) : texture2D(registeredLateral,vSideUv)),vSideWeight); vec4 rear=texture2D(registeredHeel,vHeelUv); vec4 toe=texture2D(registeredFront,vFrontUv); body.rgb=mix(body.rgb,rear.rgb,vHeelWeight*rear.a); body.rgb=mix(body.rgb,toe.rgb,vFrontWeight); diffuseColor*=vec4(body.rgb,1.0);`);
      };
      material.customProgramCacheKey=()=>`registered-shoe-endcaps-v2-${role}`;
    }
    material.userData['photoRole']=role;
    const mesh=new THREE.Mesh(geometry,material);mesh.name=`registered-${role}`;
    mesh.userData['sourcePhoto']=sources[role].path;mesh.castShadow=true;root.add(mesh);
  }
  return root;
}
