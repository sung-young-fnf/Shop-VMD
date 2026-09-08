import * as THREE from "three";
import type { ShoePhotoRole } from "./photo-shoe-calibration";

export function blendShoePanels(materials: Readonly<Record<ShoePhotoRole, THREE.MeshBasicMaterial>>): void {
  for (const role of ["lateral", "medial", "heel"] as const) {
    const material = materials[role];
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, {
        shoeLateral: { value: materials.lateral.map }, shoeMedial: { value: materials.medial.map },
        shoeHeel: { value: materials.heel.map }, shoeTop: { value: materials.top.map },
        shoeCoverage: { value: new THREE.Color("#cbc8bd") },
      });
      const varyings = "varying vec2 vShoeSideUv; varying vec2 vShoeHeelUv; varying vec2 vShoeTopUv; varying vec3 vShoeWeights;";
      shader.vertexShader = `${varyings}\nattribute vec2 shoeSideUv; attribute vec2 shoeHeelUv; attribute vec2 shoeTopUv; attribute vec3 shoeWeights;\n${shader.vertexShader}`.replace("#include <begin_vertex>", "#include <begin_vertex>\nvShoeSideUv = shoeSideUv; vShoeHeelUv = shoeHeelUv; vShoeTopUv = shoeTopUv; vShoeWeights = shoeWeights;");
      shader.fragmentShader = `${varyings}\nuniform sampler2D shoeLateral; uniform sampler2D shoeMedial; uniform sampler2D shoeHeel; uniform sampler2D shoeTop; uniform vec3 shoeCoverage;\n${shader.fragmentShader}`.replace("#include <map_fragment>", `
        vec4 shoeSide = vShoeWeights.z > 0.5 ? texture2D(shoeLateral, vShoeSideUv) : texture2D(shoeMedial, vShoeSideUv);
        shoeSide.rgb = mix(shoeCoverage, shoeSide.rgb, shoeSide.a);
        vec3 shoeColour = mix(shoeSide.rgb, texture2D(shoeHeel, vShoeHeelUv).rgb, vShoeWeights.x);
        diffuseColor.rgb *= mix(shoeColour, texture2D(shoeTop, vShoeTopUv).rgb, vShoeWeights.y);
      `);
    };
    material.customProgramCacheKey = () => "shoe-original-photo-boundary-blend-v1";
  }
}
