import * as THREE from 'three';

export type BoxPart = {
  readonly size: readonly [number, number, number];
  readonly at: readonly [number, number, number];
  readonly name?: string;
};

function brickTexture(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const row = Math.floor(y / 16);
    const seam = y % 16 < 2 || (x + (row % 2) * 32) % 64 < 2;
    const noise = ((x * 13 + y * 37) % 17) - 8;
    const i = (y * size + x) * 4;
    data[i] = (seam ? 135 : 125) + noise;
    data[i + 1] = (seam ? 130 : 94) + noise;
    data[i + 2] = (seam ? 120 : 77) + noise;
    data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export const surfaces = {
  concrete: new THREE.MeshStandardMaterial({ color: '#aaa59b', roughness: 0.94 }),
  floor: new THREE.MeshStandardMaterial({ color: '#99968f', roughness: 0.82 }),
  plaster: new THREE.MeshStandardMaterial({ color: '#b3afa6', roughness: 0.86 }),
  metal: new THREE.MeshStandardMaterial({ color: '#555b5c', roughness: 0.48, metalness: 0.75 }),
  blue: new THREE.MeshStandardMaterial({ color: '#354655', roughness: 0.43, metalness: 0.79 }),
  brick: new THREE.MeshStandardMaterial({ color: '#ffffff', map: brickTexture(), roughness: 0.96 }),
  wood: new THREE.MeshStandardMaterial({ color: '#bcb59c', roughness: 0.65 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#c3d4d4', roughness: 0.11, metalness: 0.08, transparent: true, opacity: 0.18, depthWrite: false }),
  light: new THREE.MeshStandardMaterial({ color: '#fff5db', emissive: '#fff2d0', emissiveIntensity: 1.8 }),
} as const;

export function box(part: BoxPart, material: THREE.Material): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(...part.size);
  if (material instanceof THREE.MeshStandardMaterial && material.map === surfaces.brick.map) {
    const position = geometry.getAttribute('position');
    const normal = geometry.getAttribute('normal');
    const uv = geometry.getAttribute('uv');
    for (let i = 0; i < position.count; i++) {
      const horizontal = Math.abs(normal.getX(i)) > 0.5 ? position.getZ(i) + part.at[2] : position.getX(i) + part.at[0];
      const vertical = Math.abs(normal.getY(i)) > 0.5 ? position.getZ(i) + part.at[2] : position.getY(i) + part.at[1];
      uv.setXY(i, horizontal / 0.88, vertical / 1.28);
    }
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...part.at);
  mesh.name = part.name ?? 'architectural-part';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function layer(name: string, visibility: string): THREE.Group {
  const group = new THREE.Group();
  group.name = name;
  group.userData['layer'] = visibility;
  group.visible = false;
  return group;
}

export function repeatedBoxes(parts: readonly BoxPart[], material: THREE.Material): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, parts.length);
  const transform = new THREE.Object3D();
  parts.forEach((part, index) => {
    transform.position.set(...part.at);
    transform.scale.set(...part.size);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
