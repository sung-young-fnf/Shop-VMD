import * as THREE from "three";
import { cadBillPoint, cadCrownGeometry, cadCrownPoint, cadRearOpening } from "./cad-geometry";
import type { CapConstruction } from "./cad-geometry";

export function addCadConstruction(group: THREE.Group, construction: CapConstruction): void {
  const clothColor = new THREE.Color(construction.color);
  const inside = new THREE.MeshStandardMaterial({ color: clothColor, side: THREE.BackSide, roughness: .95 });
  const liner = new THREE.Mesh(cadCrownGeometry(), inside);
  liner.name = "cad-hollow-inner-crown";
  liner.scale.set(.994, .994, .994);
  group.add(liner);
  const trim = new THREE.MeshStandardMaterial({ color: clothColor.clone().multiplyScalar(.64), roughness: .96, side: THREE.DoubleSide });
  const thread = new THREE.MeshStandardMaterial({ color: clothColor.clone().multiplyScalar(1.12), roughness: .9 });
  for (let panel = 0; panel < 6; panel++) {
    const phi = panel * Math.PI / 3;
    const end = Math.acos((Math.cos(phi) < 0 ? cadRearOpening(phi) : 0) / .116);
    const seamEnd = panel === 0 ? .76 : end;
    const points = Array.from({ length: 25 }, (_, step) => cadCrownPoint(phi, .045 + step / 24 * (seamEnd - .045)));
    const seam = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, .0002, 3, false), thread);
    seam.name = `cad-panel-seam-${panel}`;
    group.add(seam);
    const tapePositions: number[] = [], tapeIndices: number[] = [];
    for (let step = 0; step <= 24; step++) {
      const theta = .08 + step / 24 * (end - .08);
      for (const sign of [-1, 1]) {
        const delta = .003 / Math.max(.015, .102 * Math.sin(theta));
        const point = cadCrownPoint(phi + sign * delta, theta);
        point.x *= .98; point.z *= .98; point.y -= .0015;
        tapePositions.push(...point.toArray());
      }
      if (step < 24) {
        const a = step * 2;
        tapeIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const tapeGeometry = new THREE.BufferGeometry();
    tapeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(tapePositions, 3));
    tapeGeometry.setIndex(tapeIndices); tapeGeometry.computeVertexNormals();
    const tape = new THREE.Mesh(tapeGeometry, trim);
    tape.name = `cad-inner-tape-${panel}`;
    group.add(tape);
    const eyeletPhi = phi + Math.PI / 6;
    const eyeletPosition = cadCrownPoint(eyeletPhi, .67);
    const normal = new THREE.Vector3(eyeletPosition.x / (.102 ** 2), (eyeletPosition.y - .018) / (.116 ** 2), eyeletPosition.z / (.097 ** 2)).normalize();
    const eyelet = new THREE.Mesh(new THREE.TorusGeometry(.0016, .0005, 4, 10), thread);
    eyelet.position.copy(eyeletPosition).addScaledVector(normal, .0006);
    eyelet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    eyelet.name = `cad-eyelet-${panel}`;
    group.add(eyelet);
  }
  const bandPositions: number[] = [], bandIndices: number[] = [];
  for (let step = 0; step <= 64; step++) {
    const phi = -Math.PI + .475 + step / 64 * (Math.PI * 2 - .95);
    for (const y of [.014, .030]) {
      const radius = Math.sqrt(1 - (Math.max(0, y - .018) / .116) ** 2) - .012;
      bandPositions.push(.102 * radius * Math.sin(phi), y, .097 * radius * Math.cos(phi));
    }
    if (step < 64) {
      const a = step * 2;
      bandIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const bandGeometry = new THREE.BufferGeometry();
  bandGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bandPositions, 3));
  bandGeometry.setIndex(bandIndices); bandGeometry.computeVertexNormals();
  const band = new THREE.Mesh(bandGeometry, trim);
  band.name = "cad-sweatband";
  group.add(band);
  const bindingPoints = Array.from({ length: 49 }, (_, step) => {
    const phi = (step / 48 - .5) * 2.75;
    return new THREE.Vector3(.102 * Math.sin(phi), .0165, .097 * Math.cos(phi));
  });
  const binding = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bindingPoints), 48, .0015, 6, false), trim.clone());
  binding.name = "cad-crown-visor-binding";
  group.add(binding);
  for (let row = 0; row < construction.stitchRows; row++) {
    const v = .91 - row * .09;
    const points = Array.from({ length: 49 }, (_, step) => cadBillPoint(.025 + step / 48 * .95, v, construction.visorDrop).add(new THREE.Vector3(0, .0002, 0)));
    const stitch = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, .00016, 3, false), thread);
    stitch.name = `cad-visor-stitch-${row}`;
    group.add(stitch);
  }
}
