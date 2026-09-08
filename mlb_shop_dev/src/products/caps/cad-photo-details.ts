import * as THREE from "three";
import { productPhoto } from "../photo-material";
import { cadBillPoint, cadCrownPoint } from "./cad-geometry";

export function addBostonPhotoDetails(group: THREE.Group): void {
  const material = productPhoto("caps/M26N3ACPB296N-source.png", "M26N3ACPB296N");
  const badge = new THREE.RingGeometry(0, 1, 48, 12);
  const badgePoints = badge.getAttribute("position");
  const badgeUv = badge.getAttribute("uv");
  for (let index = 0; index < badgePoints.count; index++) {
    const x = badgePoints.getX(index), y = badgePoints.getY(index);
    const point = cadCrownPoint(1.30 + x * .20, 1.02 - y * .25);
    point.multiplyScalar(1.006);
    badgePoints.setXYZ(index, point.x, point.y, point.z);
    badgeUv.setXY(index, (736 + x * 51) / 899, 1 - (607 - y * 78) / 1200);
  }
  badge.computeVertexNormals();
  const badgeMesh = new THREE.Mesh(badge, material);
  badgeMesh.name = "cad-source-championship-side-badge";
  group.add(badgeMesh);
  const sticker = new THREE.RingGeometry(0, 1, 40, 6);
  const stickerPoints = sticker.getAttribute("position");
  const stickerUv = sticker.getAttribute("uv");
  for (let index = 0; index < stickerPoints.count; index++) {
    const x = stickerPoints.getX(index), y = stickerPoints.getY(index);
    const lateral = -.026 + .023 * x;
    const u = .5 + Math.asin(lateral / .100) / Math.PI;
    const root = cadBillPoint(u, 0, .008);
    const tip = cadBillPoint(u, 1, .008);
    const v = (.130 - .015 * y - root.z) / (tip.z - root.z);
    const point = cadBillPoint(u, v, .008);
    stickerPoints.setXYZ(index, point.x, point.y + .00045, point.z);
    stickerUv.setXY(index, (244 + x * 67) / 899, 1 - (736 - y * 31) / 1200);
  }
  sticker.computeVertexNormals();
  const stickerMesh = new THREE.Mesh(sticker, material);
  stickerMesh.name = "cad-source-visor-sticker";
  group.add(stickerMesh);
}

export function addPinkDistress(group: THREE.Group): void {
  const geometry = new THREE.RingGeometry(0, 1, 48, 8);
  const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index), y = positions.getY(index);
    const lateral = .031 * x;
    const u = .5 + Math.asin(lateral / .100) / Math.PI;
    const root = cadBillPoint(u, 0, .052), tip = cadBillPoint(u, 1, .052);
    const v = (.139 - .007 * y - root.z) / (tip.z - root.z);
    const point = cadBillPoint(u, v, .052);
    positions.setXYZ(index, point.x, point.y + .0005, point.z);
    uv.setXY(index, (371 + x * 112) / 899, 1 - (774 - y * 25) / 1200);
  }
  geometry.computeVertexNormals();
  const material = productPhoto("caps/M24N3ACPVL64N-source.png", "M24N3ACPVL64N");
  material.transparent = true;
  material.depthWrite = false;
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `#include <map_fragment>
      vec2 localDetail = (vMapUv * vec2(899.0, 1200.0) - vec2(371.0, 426.0)) / vec2(112.0, 25.0);
      diffuseColor.a *= smoothstep(0.25, 0.50, min(diffuseColor.g, diffuseColor.b)) * (1.0 - smoothstep(0.20, 1.0, length(localDetail)));
    `);
  };
  material.customProgramCacheKey = () => "pink-original-frayed-thread-coverage-v2";
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "cad-source-distressed-visor";
  group.add(mesh);
}
