import * as THREE from "three";

type CapPhotos = readonly [THREE.MeshBasicMaterial, THREE.MeshBasicMaterial, THREE.MeshBasicMaterial, THREE.MeshBasicMaterial];

export function capCrownPhoto(photos: CapPhotos): THREE.MeshBasicMaterial {
  const [front, rear, side, detail] = photos;
  const material = front.clone();
  material.onBeforeCompile = shader => {
    shader.uniforms["capFront"] = { value: front.map };
    shader.uniforms["capRear"] = { value: rear.map };
    shader.uniforms["capSide"] = { value: side.map };
    shader.uniforms["capDetail"] = { value: detail.map };
    shader.vertexShader = `attribute vec3 capSourcePosition;\nvarying vec3 capPosition;\n${shader.vertexShader}`.replace("#include <begin_vertex>", "#include <begin_vertex>\ncapPosition = capSourcePosition;");
    shader.fragmentShader = `uniform sampler2D capFront;\nuniform sampler2D capRear;\nuniform sampler2D capSide;\nuniform sampler2D capDetail;\nvarying vec3 capPosition;\n${shader.fragmentShader}`.replace("#include <map_fragment>", `
      float sx = capPosition.x / 0.102;
      float height = clamp((capPosition.y - 0.018) / 0.116, 0.0, 1.0);
      vec2 frontUv = vec2((683.0 + sx * 405.0) / 1368.0, 1.0 - (512.0 + (1.0 - height) * (440.0 + 88.0 * sx * sx)) / 1824.0);
      vec2 rearUv = vec2((683.0 - sx * 395.0) / 1368.0, 1.0 - (1237.0 - 76.0 * sx * sx * sx * sx - height * 688.0) / 1824.0);
      vec3 frontColor = texture2D(capFront, frontUv).rgb;
      vec3 rearColor = texture2D(capRear, rearUv).rgb;
      float sz = capPosition.z / 0.097;
      vec2 sideUv = vec2((890.0 - sz * 270.0) / 1368.0, 1.0 - (1120.0 - height * 480.0) / 1824.0);
      vec4 sidePixel = texture2D(capSide, sideUv);
      vec3 sideColor = mix(frontColor, sidePixel.rgb, sidePixel.a);
      vec3 topColor = vec3(0.0);
      for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 2; column++) {
          vec2 tile = fract(vec2(sx, sz) * 3.0 + vec2(float(column), float(row)) * 0.5);
          vec2 blend = sin(tile * 3.14159265);
          blend *= blend;
          vec2 topUv = vec2((830.0 + tile.x * 200.0) / 1368.0, 1.0 - (340.0 + tile.y * 200.0) / 1824.0);
          topColor += texture2D(capDetail, topUv).rgb * blend.x * blend.y;
        }
      }
      if (sz < 0.0) rearColor = mix(sideColor, rearColor, smoothstep(0.12, 0.24, height));
      if (sz < 0.0 && abs(sx) < 0.65 && rearUv.y < 0.48) rearColor = mix(rearColor, sideColor, smoothstep(0.08, 0.20, min(rearColor.r, min(rearColor.g, rearColor.b))));
      vec3 weights = pow(abs(vec3(sx, height, sz)), vec3(6.0));
      weights.y *= 0.2;
      weights /= max(dot(weights, vec3(1.0)), 0.0001);
      vec3 endColor = sz >= 0.0 ? frontColor : rearColor;
      diffuseColor.rgb *= sideColor * weights.x + topColor * weights.y + endColor * weights.z;
      if (!gl_FrontFacing) diffuseColor.rgb = vec3(0.018, 0.035, 0.076);
    `);
  };
  material.customProgramCacheKey = () => "cap-four-photo-multiview-v6";
  material.userData["photoTransition"] = "Front/rear/verified side and photographed logo-free fabric detail; inferred top mapping";
  return material;
}
