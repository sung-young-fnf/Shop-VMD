import * as THREE from "three";
import { realBill, realCrown, realCurve, realLowerAngle, realPatch } from "./real-surfaces";

export function addRealDetails(cap: THREE.Group, rearPhoto: THREE.MeshBasicMaterial, interiorPhoto: THREE.MeshBasicMaterial): void {
  const thread = new THREE.MeshStandardMaterial({ color: "#17273e", roughness: 1 });
  const dark = new THREE.MeshStandardMaterial({ color: "#0b1526", roughness: 1, side: THREE.DoubleSide });
  const silver = new THREE.MeshStandardMaterial({ color: "#9d9b90", roughness: .48, metalness: .8 });
  for (let panel = 0; panel < 6; panel++) {
    const theta = panel * Math.PI / 3;
    const end = panel === 0 || panel === 3 ? .72 : realLowerAngle(theta);
    const seam = realCurve(Array.from({ length: 32 }, (_, i) => realCrown(theta, .05 + (end - .05) * i / 31).multiplyScalar(1.002)), .002, thread);
    seam.name = `real-panel-seam-${panel}`;
    cap.add(seam);
  }
  const boundary = realCurve(Array.from({ length: 97 }, (_, i) => {
    const theta = i / 96 * Math.PI * 2;
    return realCrown(theta, realLowerAngle(theta));
  }), .0035, thread);
  boundary.name = "real-crown-bound-edge";
  cap.add(boundary);
  const billEdge = realCurve(Array.from({ length: 65 }, (_, i) => realBill(i / 32 - 1, 1).add(new THREE.Vector3(0, -.009, 0))), .010, thread);
  billEdge.name = "real-visor-bound-edge";
  cap.add(billEdge);
  const band = new THREE.Mesh(realPatch([64, 2], (u, v) => {
    const a = .46 + u * (Math.PI * 2 - .92) + Math.PI;
    const point = realCrown(a, Math.PI / 2, .024);
    point.y += v * .115 - .012;
    return point;
  }), dark);
  band.name = "cad-sweatband";
  cap.add(band);
  const button = new THREE.Mesh(new THREE.SphereGeometry(.075, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), thread);
  button.position.y = 1.20; button.scale.y = .44; button.name = "real-covered-button";
  cap.add(button);
  const clasp = realPatch([8, 4], (u, v) => {
    const x = -.66 + u * .25;
    return new THREE.Vector3(x, -.34 + v * .25, -1.05 * Math.sqrt(1 - x * x) - .030);
  });
  const claspUv = clasp.getAttribute("uv");
  for (let index = 0; index < claspUv.count; index++) {
    claspUv.setXY(index, (975 - claspUv.getX(index) * 98) / 1368, 1 - (1228 - claspUv.getY(index) * 111) / 1824);
  }
  const buckle = new THREE.Mesh(clasp, rearPhoto);
  buckle.name = "real-brushed-clasp";
  cap.add(buckle);
  const loop = realCurve(Array.from({ length: 33 }, (_, index) => {
    const theta = index / 32 * Math.PI * 2;
    const x = -.63 + .05 * Math.sign(Math.cos(theta)) * Math.abs(Math.cos(theta)) ** .6;
    const y = -.23 + .125 * Math.sign(Math.sin(theta)) * Math.abs(Math.sin(theta)) ** .6;
    return new THREE.Vector3(x, y, -1.05 * Math.sqrt(1 - x * x) - .014);
  }), .010, silver);
  loop.name = "real-strap-metal-loop";
  cap.add(loop);
  const label = realPatch([8, 4], (u, v) => realCrown(-1.92 + u * .40, 1.45 - v * .24, .018).add(new THREE.Vector3(0, -.024, 0)));
  const labelUv = label.getAttribute("uv");
  for (let index = 0; index < labelUv.count; index++) {
    const u = labelUv.getX(index), v = labelUv.getY(index);
    const px = 1124 + u * 236 + v * (4 - 14 * u);
    const py = 700 + u * 179 - v * (300 - 105 * u);
    labelUv.setXY(index, px / 1368, 1 - py / 1824);
  }
  const labelMaterial = interiorPhoto.clone();
  labelMaterial.side = THREE.DoubleSide;
  const labelMesh = new THREE.Mesh(label, labelMaterial);
  labelMesh.name = "photo-interior-woven-label";
  cap.add(labelMesh);
}
