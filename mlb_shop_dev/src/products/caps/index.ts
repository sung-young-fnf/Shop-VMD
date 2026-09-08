import * as THREE from 'three';
import { createPhotoCap } from './photo-cap';
import { cadBillGeometry, cadBillRim, cadCrownGeometry, cadStrapGeometry } from './cad-geometry';
import { addCadConstruction } from './cad-details';
import { addBostonPhotoDetails, addPinkDistress } from './cad-photo-details';

const products = [
  { id: 'M21N3ACP7701N', color: '#1e2c46', width: .043, height: .049, visorDrop: .052, stitchRows: 4 },
  { id: 'M22N3ACP0802N', color: '#1e2127', width: .058, height: .066, visorDrop: .052, stitchRows: 6 },
  { id: 'M24N3ACPVL64N', color: '#e0a4a9', width: .075, height: .049, visorDrop: .052, stitchRows: 4 },
  { id: 'M25N3ACP8805N', color: '#2f3b5d', width: .039, height: .060, visorDrop: .044, stitchRows: 5 },
  { id: 'M26N3ACPB296N', color: '#870215', width: .049, height: .062, visorDrop: .008, stitchRows: 6 },
  { id: 'M26N3ACPB336N', color: '#cabdaa', width: .050, height: .064, visorDrop: .052, stitchRows: 5 },
] as const;
const cache = new Map<number, THREE.Group>();
const loader = new THREE.TextureLoader();

function fabric(color: THREE.ColorRepresentation): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ color, roughness: .94, metalness: 0 });
  material.userData['merchandiseFabric'] = true;
  material.userData['referenceProduct'] = true;
  return material;
}

function crownPoint(x: number, y: number): number {
  return .097 * Math.sqrt(Math.max(0, 1 - (x / .102) ** 2 - ((y - .018) / .116) ** 2));
}

export function createCap(index: number): THREE.Group {
  const slot = ((Math.trunc(index) % products.length) + products.length) % products.length;
  const cached = cache.get(slot);
  if (cached) return cached.clone(true);
  if (slot === 0) {
    const photo = createPhotoCap();
    cache.set(slot, photo);
    return photo.clone(true);
  }
  const product = products[slot] ?? products[0];
  const group = new THREE.Group();
  group.name = `reference-cap-${product.id}`;
  group.userData['productId'] = product.id;
  group.userData['source'] = `reference/caps/${product.id}.png`;
  group.userData['cadSource'] = `reference/caps/${product.id}.jpg`;
  group.userData['hiddenGeometry'] = 'CAD-guided construction; dimensions, hidden texture and unshown closure details inferred';
  const cloth = fabric(product.color);
  const crown = new THREE.Mesh(cadCrownGeometry(), cloth);
  crown.name = 'crown';
  group.add(crown);

  const brimGeometry = cadBillGeometry(product.visorDrop);
  const brim = new THREE.Mesh(brimGeometry, cloth);
  brim.name = 'curved-bill';
  group.add(brim);
  const underside = new THREE.Mesh(brimGeometry.clone().translate(0, -.0022, 0), cloth);
  const undersideIndex = underside.geometry.index;
  if (undersideIndex) {
    for (let index = 0; index < undersideIndex.count; index += 3) {
      const second = undersideIndex.getX(index + 1);
      undersideIndex.setX(index + 1, undersideIndex.getX(index + 2));
      undersideIndex.setX(index + 2, second);
    }
    underside.geometry.computeVertexNormals();
  }
  underside.name = 'cad-bill-underside';
  group.add(underside);
  const rim = new THREE.Mesh(cadBillRim(product.visorDrop), cloth);
  rim.name = 'cad-bill-edge';
  group.add(rim);

  const patchGeometry = new THREE.PlaneGeometry(product.width, product.height, 14, 14);
  const patchPositions = patchGeometry.getAttribute('position');
  for (let vertex = 0; vertex < patchPositions.count; vertex++) {
    const x = patchPositions.getX(vertex);
    const y = patchPositions.getY(vertex) + .074;
    patchPositions.setXYZ(vertex, x, y, crownPoint(x, y) + .0007);
  }
  patchGeometry.computeVertexNormals();
  const texture = loader.load(`/products/caps/${product.id}-albedo.png`);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const embroidery = fabric('white');
  embroidery.map = texture;
  embroidery.transparent = true;
  embroidery.depthWrite = false;
  embroidery.polygonOffset = true;
  embroidery.polygonOffsetFactor = -1;
  const patch = new THREE.Mesh(patchGeometry, embroidery);
  patch.name = 'source-embroidery-crown-projection';
  group.add(patch);

  addCadConstruction(group, product);
  if (product.id === 'M26N3ACPB296N') addBostonPhotoDetails(group);
  if (product.id === 'M24N3ACPVL64N') addPinkDistress(group);
  const button = new THREE.Mesh(new THREE.SphereGeometry(.007, 10, 6), cloth);
  button.scale.y = .42;
  button.position.y = .134;
  button.name = 'crown-button';
  group.add(button);
  const strapMaterial = cloth.clone();
  strapMaterial.side = THREE.DoubleSide;
  const strap = new THREE.Mesh(cadStrapGeometry(), strapMaterial);
  strap.name = 'cad-adjustment-strap';
  group.add(strap);
  if (slot <= 3) {
    const buckleShape = new THREE.Shape();
    buckleShape.moveTo(-.005, -.007); buckleShape.lineTo(.005, -.007);
    buckleShape.lineTo(.005, .007); buckleShape.lineTo(-.005, .007); buckleShape.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-.0034, -.0053); hole.lineTo(-.0034, .0053);
    hole.lineTo(.0034, .0053); hole.lineTo(.0034, -.0053); hole.closePath();
    buckleShape.holes.push(hole);
    const buckle = new THREE.Mesh(new THREE.ExtrudeGeometry(buckleShape, { depth: .0012, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: '#85878a', metalness: .75, roughness: .38 }));
    buckle.position.set(.034, .025, -.0923);
    buckle.rotation.y = Math.PI - .34;
    buckle.name = 'cad-metal-rear-adjuster';
    group.add(buckle);
  }
  for (const part of group.children) part.position.y -= .010;
  group.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  cache.set(slot, group);
  return group.clone(true);
}
