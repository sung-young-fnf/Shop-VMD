import * as THREE from 'three';
import { beam, box, fixture, materials, slab } from './parts';
import { curvedPanel, perforatedPanel, bluePerforation } from './surfaces';
import { garments, foldedProducts } from './merchandise';

export function createIslands(): THREE.Group[] {
  const islands: THREE.Group[] = [];
  const rows = [
    { id: 'a', x: 3.1, z: 5.05, length: 4, sx: 1, sz: 1, page: 59 },
    { id: 'b', x: 3.1, z: 11, length: 4, sx: 1, sz: -1, page: 60 },
    { id: 'c', x: 14.65, z: 5.05, length: 5.24, sx: -1, sz: 1, page: 61 },
    { id: 'd', x: 14.65, z: 11, length: 5.24, sx: -1, sz: -1, page: 62 },
  ] as const;
  for (const row of rows) {
    const group = fixture(`hg-${row.id}`, `중앙 곡선 HG-${row.id.toUpperCase()}`, 'central');
    group.userData['sourcePages'] = [18, row.page, 66];
    group.userData['dimensionsMm'] = [row.length * 1000, 2480, 1520];
    for (const radius of [1.5, 0.9]) {
      for (const y of [0.02, 2.46]) {
        const curve = new THREE.EllipseCurve(1.5, 1.5, radius, radius, Math.PI, Math.PI * 1.5);
        const path = new THREE.CatmullRomCurve3(curve.getPoints(32).map((p) => new THREE.Vector3(p.x, y, p.y)));
        group.add(new THREE.Mesh(new THREE.TubeGeometry(path, 32, 0.012, 5, false), materials.metal));
        group.add(box([row.length - 1.5, 0.02, 0.04], [(row.length + 1.5) / 2, y, 1.5 - radius], materials.metal));
      }
    }
    for (const x of [1.5, 2.74, row.length]) for (const z of [0, 0.6]) group.add(box([0.02, 2.48, 0.04], [x, 1.24, z], materials.metal));
    for (const z of [0.6, 0]) group.add(box([0.04, 2.48, 0.02], [0.02 + z, 1.24, 1.5], materials.metal));
    group.add(curvedPanel(1.5), curvedPanel(0.9));
    const modules = row.length > 4 ? 3 : 2;
    for (let i = 0; i < modules; i++) {
      const x = 2.12 + i * 1.24;
      const panel = perforatedPanel(1.2, 2.44, i % 2 ? bluePerforation : undefined);
      panel.position.set(x, 1.24, 0.31);
      group.add(panel);
      group.add(beam([x - .58, 1.63, .94], [x + .58, 1.63, .94]));
      for (const side of [-.58, .58]) {
        group.add(beam([x + side, 1.63, .6], [x + side, 1.63, .94]));
        group.add(beam([x + side, 1.86, .6], [x + side, 1.63, .94]));
      }
      const clothing = garments(8, 1.03, `hg-${row.id}-${i}`);
      clothing.position.set(x, 1.63, .94);
      group.add(clothing);
    }
    if (row.id !== 'c') {
      const shelfX = row.id === 'd' ? 3.36 : 2.12;
      for (const y of [.435, .91, 1.385, 1.86]) {
        group.add(box([1.24, .025, .52], [shelfX, y, .27], materials.wood));
        group.add(box([1.16, .008, .016], [shelfX, y - .018, .51], materials.led));
      }
    }
    if (row.id === 'b' || row.id === 'd') group.add(box([1.2, 2.44, .008], [row.length - .62, 1.24, .61], materials.mirror));
    group.position.set(row.x, 0, row.z);
    group.scale.set(row.sx, 1, row.sz);
    islands.push(group);
  }
  const e = fixture('hg-e', '매달림 발광 진열판 HG-E', 'central');
  e.userData['sourcePages'] = [18, 64, 66];
  e.userData['installationClearanceMm'] = 745;
  e.userData['illustrativeMerchandise'] = true;
  const platform = slab([[-0.85, 0], [-0.35, -0.75], [0.85, -0.75], [0.85, 0.75], [-0.35, 0.75]], 0.055, materials.led);
  platform.position.y = 0.745;
  e.add(platform);
  const top = platform.clone();
  top.material = materials.metal;
  top.scale.set(.985, .2, .985);
  top.position.y = .79;
  e.add(top);
  const products = foldedProducts('hg-e');
  products.position.y = .801;
  e.add(products);
  for (const x of [-0.35, 0.85]) for (const z of [-0.73, 0.73]) e.add(box([0.025, 2.005, 0.025], [x, 1.8025, z], materials.blue));
  e.position.set(6.15, 0, 8);
  islands.push(e);
  const f = fixture('hg-f', '매달림 이중 행거 HG-F', 'central');
  f.userData['sourcePages'] = [18, 65, 66];
  f.userData['installationClearanceMm'] = 1700;
  f.userData['illustrativeMerchandise'] = true;
  for (const z of [-0.275, 0.275]) {
    f.add(beam([-1.66, 1.7125, z], [1.66, 1.7125, z]));
    for (const x of [-1.65, -0.55, 0.55, 1.65]) f.add(box([0.02, 1.38, 0.04], [x, 2.41, z], materials.blue));
  }
  f.position.set(11.12, 0, 8);
  for (const [index, z] of [-.275, .275].entries()) { const clothing = garments(20, 3.1, `hg-f-${index}`); clothing.position.set(0, 1.71, z); f.add(clothing); }
  islands.push(f);
  return islands;
}
