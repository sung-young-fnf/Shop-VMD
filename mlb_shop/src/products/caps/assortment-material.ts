import * as THREE from 'three';
import { productPhoto } from '../photo-material';
import type { AssortmentCapDescriptor, CapPhotoView } from './assortment-types';

const clothSampling = `
  vec3 samplePhotoCloth(sampler2D photo, vec2 center, vec2 point) {
    vec3 value = vec3(0.0);
    for (int row = 0; row < 2; row++) {
      for (int column = 0; column < 2; column++) {
        vec2 tile = fract(point + vec2(float(column), float(row)) * .5);
        vec2 weight = sin(tile * 3.14159265); weight *= weight;
        value += texture2D(photo, center + (tile - .5) * .018).rgb * weight.x * weight.y;
      }
    }
    return value;
  }
`;

export function capPhotoUv(view: CapPhotoView, coordinate: readonly [number, number]): THREE.Vector2 {
  const [x, imageY] = coordinate;
  const [left, top, right, bottom] = view.bounds;
  const row = THREE.MathUtils.clamp((imageY - top) / (bottom - top), 0, 1) * Math.max(0, view.rows.length - 1);
  const start = view.rows[Math.floor(row)] ?? [left, right];
  const end = view.rows[Math.ceil(row)] ?? start;
  const low = THREE.MathUtils.lerp(start[0], end[0], row % 1);
  const high = THREE.MathUtils.lerp(start[1], end[1], row % 1);
  return new THREE.Vector2(THREE.MathUtils.lerp(low, high, .5 + .49 * x), 1 - imageY);
}

export function capRearClothUv(view: CapPhotoView, coordinate: readonly [number, number]): THREE.Vector2 {
  let uv = capPhotoUv(view, coordinate);
  const columns = view.openingTopColumns;
  if (!columns?.length) return uv;
  const [left, top, right, bottom] = view.bounds;
  for (let iteration = 0; iteration < 8; iteration++) {
    const column = THREE.MathUtils.clamp((uv.x - left) / (right - left), 0, 1) * (columns.length - 1);
    const start = columns[Math.floor(column)] ?? bottom;
    const end = columns[Math.ceil(column)] ?? start;
    const edge = Math.max(top, THREE.MathUtils.lerp(start, end, column % 1) - Math.max(.003, (bottom - top) * .012));
    if (1 - uv.y <= edge) break;
    uv = capPhotoUv(view, [coordinate[0], edge]);
  }
  return uv;
}

export function createAssortmentMaterials(descriptor: AssortmentCapDescriptor) {
  const front = productPhoto(descriptor.front.texture, descriptor.id);
  const rear = productPhoto(descriptor.rear.texture, descriptor.id);
  const side = descriptor.side ? productPhoto(descriptor.side.texture, descriptor.id) : front;
  const cloth = front.clone();
  const center = new THREE.Vector2(descriptor.clothUv[0], 1 - descriptor.clothUv[1]);
  const rearCenter = descriptor.rearClothUv ? new THREE.Vector2(descriptor.rearClothUv[0], 1 - descriptor.rearClothUv[1]) : center;
  for (const photo of [front, rear]) {
    photo.onBeforeCompile = shader => {
      shader.uniforms['fabricPhoto'] = { value: front.map };
      shader.uniforms['clothCenter'] = { value: center };
      shader.fragmentShader = `uniform sampler2D fabricPhoto; uniform vec2 clothCenter;\n${shader.fragmentShader}`.replace('#include <map_fragment>', `
        vec4 pixel = texture2D(map, vMapUv);
        diffuseColor.rgb *= mix(texture2D(fabricPhoto, clothCenter).rgb, pixel.rgb, pixel.a);
      `);
    };
    photo.customProgramCacheKey = () => 'assortment-alpha-filled-photo-v1';
  }
  cloth.onBeforeCompile = shader => {
    shader.uniforms['clothCenter'] = { value: center };
    shader.fragmentShader = `uniform vec2 clothCenter;\n${clothSampling}\n${shader.fragmentShader}`.replace('#include <map_fragment>', `
      diffuseColor.rgb *= samplePhotoCloth(map, clothCenter, vMapUv * 3.0);
    `);
  };
  cloth.customProgramCacheKey = () => 'assortment-cloth-crop-v2';
  cloth.userData['representation'] = 'Same-SKU logo-free source cloth; inferred unseen surface';
  const crown = front.clone();
  crown.onBeforeCompile = shader => {
    shader.uniforms['assortmentFront'] = { value: front.map };
    shader.uniforms['assortmentRear'] = { value: rear.map };
    shader.uniforms['assortmentSide'] = { value: side.map };
    shader.uniforms['clothCenter'] = { value: center };
    shader.uniforms['sideSign'] = { value: descriptor.side ? ({ left: 1, right: -1 } as const)[descriptor.side.hemisphere] : 0 };
    shader.uniforms['rearClothCenter'] = { value: rearCenter };
    shader.uniforms['rearFabricEnabled'] = { value: descriptor.rearClothUv ? 1 : 0 };
    shader.uniforms['rearClosureOpen'] = { value: ({ adjustable: 1, fitted: 0 } as const)[descriptor.rearConstruction] };
    shader.uniforms['meshRear'] = { value: descriptor.meshRear ? 1 : 0 };
    shader.vertexShader = `attribute vec3 capSourcePosition; attribute vec2 capFrontUv; attribute vec2 capRearUv; attribute vec2 capSideUv; attribute vec2 capFabricUv;
      varying vec3 capPosition; varying vec2 frontUv; varying vec2 rearUv; varying vec2 sideUv; varying vec2 fabricUv;\n${shader.vertexShader}`.replace('#include <begin_vertex>', `#include <begin_vertex>
      capPosition = capSourcePosition; frontUv = capFrontUv; rearUv = capRearUv; sideUv = capSideUv; fabricUv = capFabricUv;`);
    shader.fragmentShader = `uniform sampler2D assortmentFront; uniform sampler2D assortmentRear; uniform sampler2D assortmentSide;
      uniform vec2 clothCenter; uniform vec2 rearClothCenter; uniform float rearFabricEnabled; uniform float rearClosureOpen; uniform float sideSign; uniform float meshRear;
      varying vec3 capPosition; varying vec2 frontUv; varying vec2 rearUv; varying vec2 sideUv; varying vec2 fabricUv;\n${clothSampling}\n${shader.fragmentShader}`.replace('#include <map_fragment>', `
      vec3 fabric = samplePhotoCloth(assortmentFront, clothCenter, fabricUv * 3.0);
      fabric = mix(fabric, samplePhotoCloth(assortmentRear, rearClothCenter, fabricUv * 3.0), rearFabricEnabled * (1.0 - smoothstep(.45, .60, capPosition.z)));
      vec4 fp = texture2D(assortmentFront, frontUv);
      vec4 rp = texture2D(assortmentRear, rearUv);
      vec4 sp = texture2D(assortmentSide, sideUv);
      float topBlend = smoothstep(.87, .995, capPosition.y);
      float frontWeight = pow(max(capPosition.z, 0.0), 4.0) * (1.0 - topBlend);
      float rearWeight = pow(max(-capPosition.z, 0.0), 4.0) * (1.0 - topBlend) * mix(1.0, smoothstep(.10, .20, capPosition.y), rearClosureOpen);
      float flankWeight = pow(max(sideSign * capPosition.x, 0.0), 4.0) * (1.0 - topBlend);
      float total = frontWeight + rearWeight + flankWeight;
      vec3 surface = mix(fabric, fp.rgb, fp.a) * frontWeight + mix(fabric, rp.rgb, rp.a) * rearWeight + mix(fabric, sp.rgb, sp.a) * flankWeight;
      diffuseColor.rgb *= surface + fabric * max(0.0, 1.0 - total);
      if (meshRear > .5 && capPosition.z < .2 && capPosition.y > .58 && capPosition.y < .92) {
        vec2 grid = abs(fract(vec2(atan(capPosition.x, capPosition.z) * 38.0, capPosition.y * 65.0)) - .5);
        if (grid.x < .20 && grid.y < .20) discard;
      }
    `);
  };
  crown.customProgramCacheKey = () => 'assortment-directional-photo-v3';
  crown.userData['photoDependencies'] = [front.map, rear.map, side.map];
  crown.userData['projectionOwnership'] = { front: descriptor.front.texture, rear: descriptor.rear.texture, side: descriptor.side?.hemisphere ?? null, unseen: 'same-SKU logo-free cloth crop' };
  const lining = cloth.clone();
  lining.onBeforeCompile = cloth.onBeforeCompile;
  lining.customProgramCacheKey = cloth.customProgramCacheKey;
  lining.color.setScalar(.8);
  const underside = descriptor.undersideColor ? new THREE.MeshBasicMaterial({ color: descriptor.undersideColor, toneMapped: false }) : lining.clone();
  if (descriptor.undersideColor) {
    underside.userData['referenceProduct'] = true;
    underside.userData['productId'] = descriptor.id;
    underside.userData['representation'] = 'Approximate color sampled from observed bill underside; not photo projection or PBR';
  } else {
    underside.onBeforeCompile = cloth.onBeforeCompile;
    underside.customProgramCacheKey = cloth.customProgramCacheKey;
  }
  return { front, rear, cloth, crown, lining, underside };
}
