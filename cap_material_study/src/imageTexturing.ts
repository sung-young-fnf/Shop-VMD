import * as THREE from 'three';

type ClothKind = 'crown' | 'brim' | 'button';
type MapChannel = 'albedo' | 'roughness' | 'normal' | 'ao';
type ImageSurface = 'cloth' | 'embroidery';

const loader = new THREE.TextureLoader();
const normalStrength = { crown: 0.08, brim: 0.07, button: 0.06 } as const;

function imageMap(surface: ImageSurface, channel: MapChannel): THREE.Texture {
  const texture = loader.load(`/materials/image-variant/${surface}-${channel}.png`);
  texture.name = `photo-${surface}-${channel}`;
  texture.colorSpace = channel === 'albedo' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  // Three r183 routes aoMap through its own texture.channel; 0 uses the mesh's uv.
  texture.channel = 0;
  texture.anisotropy = 8;
  if (surface === 'cloth') {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.setScalar(1 / 0.6);
  }
  return texture;
}

export function createImageClothMaterial(kind: ClothKind): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    name: `B-photo-cloth-${kind}`,
    color: 0xffffff,
    map: imageMap('cloth', 'albedo'),
    normalMap: imageMap('cloth', 'normal'),
    normalScale: new THREE.Vector2(normalStrength[kind], normalStrength[kind]),
    roughnessMap: imageMap('cloth', 'roughness'),
    roughness: 0.97,
    aoMap: imageMap('cloth', 'ao'),
    aoMapIntensity: 0.12,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  material.userData['provenance'] = 'evidence/image-variant/texture-manifest.json';
  material.userData['repeatWorldUnits'] = 0.6;
  return material;
}

export function createImageEmbroideryMaterial(): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    name: 'B-photo-embroidery',
    color: 0xffffff,
    map: imageMap('embroidery', 'albedo'),
    normalMap: imageMap('embroidery', 'normal'),
    normalScale: new THREE.Vector2(0.08, 0.08),
    roughnessMap: imageMap('embroidery', 'roughness'),
    roughness: 0.97,
    aoMap: imageMap('embroidery', 'ao'),
    aoMapIntensity: 0.18,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  material.userData['provenance'] = 'evidence/image-variant/texture-manifest.json';
  return material;
}
