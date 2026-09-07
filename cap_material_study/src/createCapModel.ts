import * as THREE from 'three';
import { makeBrim, makeCrown, crownPoint, surfaceGeometry } from './capGeometry';
import { addStructure, thickenSurface } from './capStructure';
import { createEmbroidery } from './capEmbroidery';
import { createSatinStrands } from './satinStrands';
import { createProceduralMaterial } from './proceduralMaterials';
import { createImageClothMaterial, createImageEmbroideryMaterial } from './imageTexturing';

export function createCapModel(pass: string, variant: 'procedural' | 'image' = 'procedural'): THREE.Group {
  const root = new THREE.Group(); root.name = 'root'; root.position.x = 0.09;
  const detailed = pass !== 'blockout';
  const refined = detailed && pass !== 'structural-pass';
  const textured = refined && pass !== 'form-refinement';
  const cloth = textured ? (variant === 'image' ? createImageClothMaterial('crown') : createProceduralMaterial('twill')) : new THREE.MeshPhysicalMaterial({ color: '#2d303e', roughness: 0.91, metalness: 0, sheen: 0, clearcoat: 0, side: THREE.DoubleSide });
  const thread = new THREE.MeshStandardMaterial({ color: '#282c38', roughness: 0.96 });
  const nodes = new Map<string, THREE.Object3D>();
  function part(id: string, label: string, direction: THREE.Vector3): THREE.Group {
    const group = new THREE.Group(); group.name = id;
    group.userData['label'] = label; group.userData['explodeDirection'] = direction;
    group.userData['collider'] = { type: 'convex-hull', inferred: true };
    group.userData['destruction'] = { breakable: false, group: id };
    nodes.set(id, group); root.add(group); return group;
  }
  function mesh(parent: THREE.Group, name: string, geometry: THREE.BufferGeometry): THREE.Mesh {
    if (textured) {
      const uv = geometry.getAttribute('uv'), positions = geometry.getAttribute('position');
      for (let i = 0; i < uv.count; i++) {
        if (name.startsWith('gore-')) uv.setXY(i, (uv.getX(i) - 0.5) * Math.PI / 3 * Math.sqrt(Math.max(0, 1 - uv.getY(i) ** 2.05)), Math.asin(THREE.MathUtils.clamp(uv.getY(i), 0, 1)) / (Math.PI / 2) * 1.80);
        else if (name.startsWith('brim')) uv.setXY(i, positions.getX(i), positions.getZ(i));
        else if (name.startsWith('top-button')) uv.setXY(i, positions.getX(i), positions.getZ(i));
        else uv.setXY(i, uv.getX(i) * Math.PI * 2, uv.getY(i) * 0.08);
      }
      uv.needsUpdate = true;
    }
    const object = new THREE.Mesh(geometry, cloth); object.name = name;
    object.castShadow = true; object.receiveShadow = true; parent.add(object); nodes.set(name, object); return object;
  }
  const crown = part('crown', '모자 몸체', new THREE.Vector3(0, 0.55, 0));
  if (detailed) for (let i = 0; i < 6; i++) {
    const panel = surfaceGeometry((u, v) => crownPoint((i + u) * Math.PI / 3, v), 28, 48);
    mesh(crown, `gore-${i}`, thickenSurface(panel, 0.012));
  } else mesh(crown, 'crown-surface', makeCrown());
  const brim = part('brim', '챙', new THREE.Vector3(0, -0.25, 0.75));
  mesh(brim, 'brim-surface', detailed ? thickenSurface(makeBrim(), 0.018) : makeBrim());
  const button = part('top-button', '꼭지 단추', new THREE.Vector3(0, 1, 0));
  mesh(button, 'top-button-surface', new THREE.SphereGeometry(0.083, 32, 16));
  button.position.y = 1.35; button.scale.y = 0.43;
  if (detailed) {
    const band = part('sweatband', '안쪽 밴드 · 추정', new THREE.Vector3(0, -0.6, 0));
    const geometry = surfaceGeometry((u, v) => crownPoint(u * Math.PI * 2, 0.01 + v * 0.055).multiply(new THREE.Vector3(0.981, 1, 0.981)), 96, 4);
    mesh(band, 'sweatband-surface', thickenSurface(geometry, 0.014));
    addStructure(crown, brim, thread);
  }
  if (refined) {
    const yarn = textured ? (variant === 'image' ? createImageEmbroideryMaterial() : createProceduralMaterial('embroidery')) : new THREE.MeshStandardMaterial({ color: '#e7e0d3', roughness: 0.86, metalness: 0 });
    const embroidery = createEmbroidery(yarn);
    if (textured && pass !== 'material-pass') embroidery.add(createSatinStrands());
    root.add(embroidery);
  }
  root.userData['sculptRuntime'] = { pass, variant, stage: pass, nodes, componentIds: [...nodes.keys()], destructionGroups: ['crown', 'brim', 'top-button', 'sweatband'], approximation: 'Hidden rear and interior inferred; single-photo material scale inferred; no added sheen or clearcoat' };
  return root;
}
