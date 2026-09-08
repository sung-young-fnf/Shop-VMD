import * as THREE from "three";
import { productPhoto } from "../photo-material";
import { capCrownPhoto } from "./photo-blend";
import { addRealDetails } from "./real-details";
import { realBill, realCrown, realLowerAngle, realPatch } from "./real-surfaces";

export function createPhotoCap(): THREE.Group {
  const sku = "M21N3ACP7701N";
  const cap = new THREE.Group();
  cap.name = `reference-cap-${sku}`;
  cap.userData["productId"] = sku;
  cap.userData["cadSource"] = `reference/caps/${sku}.jpg`;
  cap.userData["frameSource"] = "cap_real_skill.md / cap_reference_viewer/src/surfaces.ts";
  cap.userData["eyeletRepresentation"] = "source-photographs";
  cap.userData["stitchRepresentation"] = "source-photographs";
  cap.userData["interiorRepresentation"] = "gallery-8-original-photograph";
  cap.userData["representation"] = "User-selected cap-real frame with original four-photo appearance; captured lighting";
  cap.userData["hiddenGeometry"] = "Multi-view proportions and original interior photo projection; unseen structure inferred, not manufacturing dimensions";
  const front = productPhoto(`caps/${sku}-front.jpg`, sku);
  const rear = productPhoto(`caps/${sku}-rear.jpg`, sku);
  const side = productPhoto(`caps/${sku}-side.png`, sku);
  const detail = productPhoto(`caps/${sku}-detail.jpg`, sku);
  const crownMaterial = capCrownPhoto([front, rear, side, detail]);
  crownMaterial.side = THREE.FrontSide;
  const innerMaterial = productPhoto(`caps/${sku}-interior.jpg`, sku);
  innerMaterial.side = THREE.BackSide;
  for (let panel = 0; panel < 6; panel++) {
    const angle = panel * Math.PI / 3;
    const photoPositions: number[] = [];
    const geometry = realPatch([16, 24], (u, v) => {
      const theta = angle + u * Math.PI / 3;
      const t = .001 + (realLowerAngle(theta) - .001) * v;
      const radial = Math.sin(t) ** .6;
      let photoHeight = Math.cos(t);
      if (Math.cos(theta) < 0) {
        const lower = realLowerAngle(theta);
        const edgeX = Math.sin(lower) ** .6 * Math.sin(theta);
        const sourceOpening = .047 / .116 * Math.sqrt(Math.max(0, 1 - (edgeX / .45) ** 2));
        const frameOpening = Math.max(0, Math.cos(lower)) ** .88;
        photoHeight = sourceOpening + (1 - sourceOpening) * (Math.max(0, Math.cos(t)) ** .88 - frameOpening) / (1 - frameOpening);
      }
      photoPositions.push(.102 * radial * Math.sin(theta), .018 + .116 * photoHeight, .097 * radial * Math.cos(theta));
      return realCrown(theta, t);
    });
    geometry.setAttribute("capSourcePosition", new THREE.Float32BufferAttribute(photoPositions, 3));
    const mesh = new THREE.Mesh(geometry, crownMaterial);
    mesh.name = `real-crown-panel-${panel}`;
    cap.add(mesh);
    const innerPhotoCoordinates: number[] = [];
    const innerGeometry = realPatch([16, 16], (u, v) => {
      const theta = angle + u * Math.PI / 3;
      const t = .001 + (realLowerAngle(theta) - .001) * v;
      const point = realCrown(theta, t, .008);
      point.y -= .008;
      const arc = t / (Math.PI / 2);
      const x = Math.sin(theta) * arc ** .65 * (1.34 - .34 * arc);
      const posterior = THREE.MathUtils.smoothstep(-Math.cos(theta), 0, .75);
      const frontRadial = arc ** .95 * (1.54 - .54 * arc);
      const rearRadial = arc ** .55 * (1.28 - .28 * arc);
      const z = Math.cos(theta) * (frontRadial + posterior * (rearRadial - frontRadial));
      innerPhotoCoordinates.push((680 - x * 600) / 1368, 1 - (1370 + 630 * z - 240 * z * z) / 1824);
      return point;
    });
    innerGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(innerPhotoCoordinates, 2));
    const lining = new THREE.Mesh(innerGeometry, innerMaterial);
    lining.name = `real-inner-panel-${panel}`;
    cap.add(lining);
  }
  const visor = realPatch([64, 24], (u, v) => realBill(u * 2 - 1, v));
  const uv = visor.getAttribute("uv");
  for (let index = 0; index < uv.count; index++) {
    const u = uv.getX(index) * 2 - 1, q = uv.getY(index);
    uv.setXY(index, (683 + u * (398 - 3 * q)) / 1368, 1 - (954 + 78 * u * u + q * (200 + 24 * u * u)) / 1824);
  }
  const billMesh = new THREE.Mesh(visor, front);
  billMesh.name = "photo-curved-bill";
  cap.add(billMesh);
  const underside = realPatch([64, 16], (u, v) => realBill(u * 2 - 1, v).add(new THREE.Vector3(0, -.018, 0)));
  const undersideMaterial = new THREE.MeshStandardMaterial({ color: "#17273e", roughness: 1, side: THREE.DoubleSide });
  const undersideMesh = new THREE.Mesh(underside, undersideMaterial);
  undersideMesh.name = "inferred-bill-underside";
  cap.add(undersideMesh);
  const closureDepth = -realCrown(Math.PI, Math.PI / 2).z * .98 / 1.05;
  const strap = realPatch([32, 3], (u, v) => {
    const x = (u - .5) * 1.3;
    const rearRadius = Math.sqrt(1 - x * x);
    const tuck = THREE.MathUtils.smoothstep(Math.abs(x), .46, .65) * .045;
    return new THREE.Vector3(x, -.11 - .23 * rearRadius + v * .22, -closureDepth * rearRadius - .018 + tuck);
  });
  const strapUv = strap.getAttribute("uv");
  for (let index = 0; index < strapUv.count; index++) {
    const x = (strapUv.getX(index) - .5) * 1.3, v = strapUv.getY(index);
    strapUv.setXY(index, (683 - x * 210) / 1368, 1 - (1229 - 66 * x ** 4 - v * 65) / 1824);
  }
  rear.side = THREE.DoubleSide;
  const strapMesh = new THREE.Mesh(strap, rear);
  strapMesh.name = "photo-adjustment-strap";
  cap.add(strapMesh);
  addRealDetails(cap, rear, innerMaterial);
  cap.scale.setScalar(.1);
  cap.position.y = .028;
  cap.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return cap;
}
