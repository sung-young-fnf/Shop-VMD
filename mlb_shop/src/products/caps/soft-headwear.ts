import * as THREE from 'three';
import { productPhoto } from '../photo-material';
import { realPatch } from './real-surfaces';
import type { CapPhotoView, SoftHeadwearDescriptor } from './assortment-types';

function sample(values: readonly number[], unit: number): number {
  const cursor = THREE.MathUtils.clamp(unit, .015, .985) * (values.length - 1);
  const index = Math.floor(cursor), first = values[index] ?? 1;
  return THREE.MathUtils.lerp(first, values[index + 1] ?? first, cursor - index);
}

function photoUv(view: CapPhotoView, position: THREE.Vector3, size: readonly [number, number]): THREE.Vector2 {
  const [left, top, right, bottom] = view.bounds;
  const height=THREE.MathUtils.clamp(position.y/size[1],.02,.98),row=(1-height)*64;
  const a=view.rows[Math.floor(row)]??[left,right],b=view.rows[Math.ceil(row)]??a;
  const lo=THREE.MathUtils.lerp(a[0],b[0],row%1),hi=THREE.MathUtils.lerp(a[1],b[1],row%1);
  const x=THREE.MathUtils.lerp(left,right,.5+position.x/size[0]);
  const imageX=THREE.MathUtils.clamp(x,lo+.012,hi-.012);
  const column=view.columns?.[Math.round(THREE.MathUtils.clamp((imageX-left)/(right-left),0,1)*64)];
  const imageY=THREE.MathUtils.lerp(bottom,top,height);
  return new THREE.Vector2(imageX,1-(column?THREE.MathUtils.clamp(imageY,column[0]+.009,column[1]-.009):imageY));
}

const clothSampling=`vec3 softCloth(sampler2D source,vec2 center,vec2 point){vec3 result=vec3(0.0);for(int y=0;y<2;y++){for(int x=0;x<2;x++){vec2 tile=fract(point+vec2(float(x),float(y))*.5);vec2 w=sin(tile*3.14159265);w*=w;result+=texture2D(source,center+(tile-.5)*.035).rgb*w.x*w.y;}}return result;}`;

/** Continuous fabric shells with original front/rear photos; unobserved depth is inferred. */
export function createSoftHeadwear(spec: SoftHeadwearDescriptor): THREE.Group {
  const group = new THREE.Group();
  group.name = `reference-cap-${spec.id}`;
  group.userData['productId'] = spec.id;
  group.userData['cadSource'] = spec.cadSource;
  group.userData['representation'] = 'Continuous headwear shell; original same-SKU front/rear photographs, captured lighting';
  group.userData['hiddenGeometry'] = 'Unphotographed side depth, lining and display-folded ties inferred; not a scan';
  const front = productPhoto(spec.front.texture, spec.id), rear = productPhoto(spec.rear.texture, spec.id);
  front.side = spec.kind==='beanie'?THREE.DoubleSide:THREE.FrontSide;
  rear.side = front.side;
  for(const material of [front,rear]){
    const crop=spec.clothUv;
    material.onBeforeCompile=shader=>{
      shader.uniforms['clothCenter']={value:new THREE.Vector2(crop[0],1-crop[1])};
      shader.uniforms['softFabricPhoto']={value:front.map};
      shader.vertexShader=`attribute float softPhotoWeight; attribute vec3 softSourcePosition; varying float photoWeight; varying vec3 softPosition;\n${shader.vertexShader}`.replace('#include <begin_vertex>','#include <begin_vertex>\nphotoWeight=softPhotoWeight;softPosition=softSourcePosition;');
      shader.fragmentShader=`uniform sampler2D softFabricPhoto; uniform vec2 clothCenter; varying float photoWeight; varying vec3 softPosition;\n${clothSampling}\n${shader.fragmentShader}`.replace('#include <map_fragment>',`vec4 pixel=texture2D(map,vMapUv);vec3 fabric=softCloth(softFabricPhoto,clothCenter,vec2(softPosition.x+softPosition.z,softPosition.y)*5.0);float edge=max(step(.34,abs(softPosition.x)),max(1.0-step(.10,softPosition.y),step(.90,softPosition.y)));float bg=smoothstep(.40,.62,min(pixel.r,min(pixel.g,pixel.b)))*(1.0-step(.55,max(fabric.r,max(fabric.g,fabric.b))))*edge;float boundary=smoothstep(0.0,.04,softPosition.y)*(1.0-smoothstep(.38,.49,abs(softPosition.x)));diffuseColor.rgb*=mix(fabric,pixel.rgb,pixel.a*photoWeight*(1.0-bg)*boundary);`);
    };
    material.customProgramCacheKey=()=> 'soft-headwear-alpha-fill-v5';
  }
  const cloth = productPhoto(spec.front.texture, spec.id);
  cloth.side = THREE.DoubleSide;
  cloth.onBeforeCompile=shader=>{
    shader.uniforms['clothCenter']={value:new THREE.Vector2(spec.clothUv[0],1-spec.clothUv[1])};
    shader.vertexShader=`attribute vec3 softSourcePosition; varying vec3 softPosition;\n${shader.vertexShader}`.replace('#include <begin_vertex>','#include <begin_vertex>\nsoftPosition=softSourcePosition;');
    shader.fragmentShader=`uniform vec2 clothCenter; varying vec3 softPosition;\n${clothSampling}\n${shader.fragmentShader}`.replace('#include <map_fragment>','diffuseColor.rgb*=softCloth(map,clothCenter,vMapUv*5.0);');
  };
  cloth.customProgramCacheKey=()=> 'soft-headwear-cloth-v4';
  const shape = { width: spec.width, height: spec.height, depth: spec.depth };
  const top = (x: number) => sample(spec.roof, x / shape.width + .5) * shape.height;
  const add = (name: string, point: (u: number, v: number) => THREE.Vector3, material: THREE.MeshBasicMaterial) => {
    const geometry = realPatch([48, 24], point);
    const winding=geometry.getIndex();
    if(winding)for(let triangle=0;triangle<winding.count;triangle+=3){
      const second=winding.getX(triangle+1);winding.setX(triangle+1,winding.getX(triangle+2));winding.setX(triangle+2,second);
    }
    geometry.computeVertexNormals();
    const positions = geometry.getAttribute('position'), uv = geometry.getAttribute('uv');
    const view = material === rear ? spec.rear : spec.front;
    const weights:number[]=[],source:number[]=[];
    for (let index = 0; index < positions.count; index++) {
      const p = new THREE.Vector3().fromBufferAttribute(positions,index);
      let photoY=p.y;
      if(spec.kind==='visor'&&material!==cloth){
        const facing=(p.z/.095+1)*.5,base=.008+.017*facing,band=.030+.030*facing;
        const v=THREE.MathUtils.clamp((p.y-base)/band,0,1);
        photoY=shape.height*(material===rear?.08+v*.32:.44+v*.52);
      }
      const horizontal=name.includes('roof')||name.includes('top')||name.includes('brim');
      const clothCoordinate=horizontal?new THREE.Vector2(p.x/shape.width,p.z/shape.depth):new THREE.Vector2(p.x/shape.width+p.z/shape.depth,p.y/shape.height);
      const coordinate = material === cloth ? clothCoordinate : photoUv(view,new THREE.Vector3(material===rear?-p.x:p.x,photoY,p.z),[shape.width,shape.height]);
      uv.setXY(index,coordinate.x,coordinate.y);
      weights.push(Math.min(1,Math.abs(p.z)/(shape.depth*.43))**2);
      source.push(p.x/shape.width,p.y/shape.height,p.z/shape.depth);
    }
    geometry.setAttribute('softPhotoWeight',new THREE.Float32BufferAttribute(weights,1));
    geometry.setAttribute('softSourcePosition',new THREE.Float32BufferAttribute(source,3));
    const mesh = new THREE.Mesh(geometry,material); mesh.name=name; mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh);
  };
  const catBody = () => {
    for (const [name, material, offset] of [['front',front,0],['rear',rear,Math.PI]] as const) {
      add(`beanie-${name}-shell`,(u,v)=>{
        const theta=(u-.5)*Math.PI+offset, x=Math.sin(theta)*shape.width*.5;
        return new THREE.Vector3(x,Math.max(shape.height*.65,top(x))*v,Math.cos(theta)*shape.depth*.5*(.94+.06*Math.sin(v*Math.PI)));
      },material);
    }
    add('beanie-closed-cat-roof',(u,v)=>{
      const theta=u*Math.PI*2, x=Math.sin(theta)*shape.width*.5*v;
      return new THREE.Vector3(x,Math.max(shape.height*.65,top(x)),Math.cos(theta)*shape.depth*.5*v*.94);
    },cloth);
  };
  const roundBody = () => {
    for (const [name, material, offset] of [['front',front,0],['rear',rear,Math.PI]] as const) {
      add(`beanie-${name}-shell`,(u,v)=>{
        const rowCursor=(1-v)*64, row=Math.floor(rowCursor);
        const a=spec.front.rows[row]??[.5,.5], b=spec.front.rows[Math.min(64,row+1)]??a;
        const width=THREE.MathUtils.lerp(a[1]-a[0],b[1]-b[0],rowCursor-row)/(spec.front.bounds[2]-spec.front.bounds[0]);
        const theta=(u-.5)*Math.PI+offset, radius= v===1?0:width;
        return new THREE.Vector3(Math.sin(theta)*shape.width*.5*radius,v*shape.height,Math.cos(theta)*shape.depth*.5*Math.sqrt(Math.max(0,1-v**3)));
      },material);
    }
  };
  const brimmedBody = (visor: boolean) => {
    const brimLevel=visor?.025:.040, crownHeight=shape.height-brimLevel;
    for(const [name,material,offset] of [['front',front,0],['rear',rear,Math.PI]] as const){
      add(`${spec.kind}-${name}-crown`,(u,v)=>{
        const theta=(u-.5)*Math.PI+offset, radius=(visor?.095:.102)-v*(visor?0:.016);
        const facing=(Math.cos(theta)+1)*.5;
        const y=visor?.008+.017*facing+v*(.030+.030*facing):brimLevel+v*crownHeight;
        return new THREE.Vector3(Math.sin(theta)*radius,y,Math.cos(theta)*radius);
      },material);
    }
    add(`${spec.kind}-inner-band`,(u,v)=>{
      const theta=u*Math.PI*2,facing=(Math.cos(theta)+1)*.5;
      const radius=(visor?.093:.100)-v*(visor?0:.016);
      const y=visor?.008+.017*facing+v*(.030+.030*facing):brimLevel+v*crownHeight;
      return new THREE.Vector3(Math.sin(theta)*radius,y,Math.cos(theta)*radius);
    },cloth);
    if(!visor)add('bucket-closed-top',(u,v)=>new THREE.Vector3(Math.sin(u*Math.PI*2)*.086*v,shape.height,Math.cos(u*Math.PI*2)*.086*v),cloth);
    add(`${spec.kind}-curved-brim`,(u,v)=>{
      const theta=visor?(u-.5)*Math.PI:u*Math.PI*2;
      const extension=visor?.065*Math.cos(theta):.035;
      const radius=(visor?.095:.102)+extension*v;
      const base=visor?.008+.017*(Math.cos(theta)+1)*.5:brimLevel;
      return new THREE.Vector3(Math.sin(theta)*radius,base*(1-v)-.003*Math.sin(theta)**2*v,Math.cos(theta)*radius);
    },cloth);
  };
  switch(spec.style){
    case 'cat': case 'cat-ties': catBody(); break;
    case 'round': roundBody(); break;
    case 'bucket': case 'bucket-ties': brimmedBody(false); break;
    case 'visor': brimmedBody(true); break;
    default: { const exhaustive: never=spec.style; throw new TypeError(`Unknown headwear style ${exhaustive}`); }
  }
  const lining=new THREE.MeshStandardMaterial({color:spec.color,roughness:1,side:THREE.DoubleSide});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(spec.kind==='beanie'?.094:.091,.003,6,48),lining);
  ring.rotation.x=Math.PI/2;ring.position.y=.004;ring.scale.y=spec.kind==='beanie'?(shape.depth*.5-.005)/.094:1;ring.name='inferred-inner-hem';if(spec.kind!=='visor')group.add(ring);
  if(spec.style==='cat-ties'||spec.style==='bucket-ties'){
    for(const sign of [-1,1]){
      const points=Array.from({length:25},(_,i)=>{const angle=i/24*Math.PI*2;return new THREE.Vector3(sign*.06+.035*Math.sin(angle),.003,.018+.040*Math.cos(angle));});
      const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.0013,5,false),lining);mesh.name='inferred-display-coiled-tie';group.add(mesh);
    }
  }
  return group;
}
