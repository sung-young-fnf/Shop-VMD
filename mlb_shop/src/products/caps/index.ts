import * as THREE from 'three';

const products = [
  { id: 'M21N3ACP7701N', color: '#1e2c46', width: .043, height: .049 },
  { id: 'M22N3ACP0802N', color: '#1e2127', width: .058, height: .066 },
  { id: 'M24N3ACPVL64N', color: '#e0a4a9', width: .075, height: .049 },
  { id: 'M25N3ACP8805N', color: '#2f3b5d', width: .039, height: .060 },
  { id: 'M26N3ACPB296N', color: '#870215', width: .049, height: .062 },
  { id: 'M26N3ACPB336N', color: '#cabdaa', width: .050, height: .064 },
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
  const product = products[slot] ?? products[0];
  const group = new THREE.Group();
  group.name = `reference-cap-${product.id}`;
  group.userData['productId'] = product.id;
  group.userData['source'] = `reference/caps/${product.id}.png`;
  group.userData['hiddenGeometry'] = 'inferred rear, underside and closure';
  const cloth = fabric(product.color);
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), cloth);
  crown.scale.set(.102, .116, .097);
  crown.position.y = .018;
  crown.name = 'crown';
  group.add(crown);

  const bill = new THREE.Shape();
  bill.moveTo(-.088, .020);
  bill.bezierCurveTo(-.115, .080, -.112, .154, 0, .168);
  bill.bezierCurveTo(.112, .154, .115, .080, .088, .020);
  bill.quadraticCurveTo(0, .060, -.088, .020);
  const brimGeometry = new THREE.ExtrudeGeometry(bill, { depth: .003, bevelEnabled: false, curveSegments: 18 });
  const positions = brimGeometry.getAttribute('position');
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const x = positions.getX(vertex);
    const forward = positions.getY(vertex);
    const thickness = positions.getZ(vertex);
    positions.setXYZ(vertex, -x, .010 + .012 * (x / .112) ** 2 + thickness, forward);
  }
  brimGeometry.computeVertexNormals();
  const brim = new THREE.Mesh(brimGeometry, cloth);
  brim.name = 'curved-bill';
  group.add(brim);

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

  const seamMaterial = fabric(new THREE.Color(product.color).multiplyScalar(.83));
  for (let panel = 0; panel < 6; panel++) {
    const angle = panel * Math.PI / 3;
    const points = Array.from({ length: 14 }, (_, step) => {
      const theta = .05 + (step / 13) * 1.50;
      return new THREE.Vector3(.1024 * Math.sin(theta) * Math.sin(angle), .018 + .1164 * Math.cos(theta), .0974 * Math.sin(theta) * Math.cos(angle));
    });
    const seam = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 13, .00045, 3, false), seamMaterial);
    seam.name = `panel-seam-${panel}`;
    group.add(seam);
  }
  const button = new THREE.Mesh(new THREE.SphereGeometry(.007, 10, 6), cloth);
  button.scale.y = .42;
  button.position.y = .134;
  button.name = 'crown-button';
  group.add(button);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.096, .096, .008, 24, 1, true), seamMaterial);
  band.scale.z = .94;
  band.position.y = .014;
  band.name = 'inferred-sweatband';
  group.add(band);
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
