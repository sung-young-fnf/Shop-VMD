import * as THREE from 'three';

type Surface = 'twill' | 'embroidery';
type Channel = 'albedo' | 'normal' | 'roughness' | 'ao';
const loader = new THREE.TextureLoader();
function map(surface: Surface, channel: Channel): THREE.Texture {
  const texture = loader.load(`/materials/procedural/${surface}-${channel}.png`);
  texture.name = `A-${surface}-${channel}`;
  texture.colorSpace = channel === 'albedo' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.channel = 0; texture.anisotropy = 8;
  if (surface === 'twill') {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.setScalar(1 / 0.6);
  }
  return texture;
}
export function createProceduralMaterial(surface: Surface): THREE.MeshStandardMaterial {
  const cloth = surface === 'twill';
  const material = new THREE.MeshStandardMaterial({
    name: `A-procedural-${surface}`, color: '#ffffff', metalness: 0,
    roughness: 0.98, roughnessMap: map(surface, 'roughness'),
    map: map(surface, 'albedo'), normalMap: map(surface, 'normal'),
    normalScale: new THREE.Vector2(cloth ? 0.5 : 0.35, cloth ? 0.5 : 0.35),
    aoMap: map(surface, 'ao'), aoMapIntensity: 0.22, side: THREE.DoubleSide,
  });
  material.userData['provenance'] = 'evidence/procedural-material-design.json';
  return material;
}
