import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { beam, box, fixture, materials } from './parts';
import { foldedProducts } from './merchandise';
import { perforatedPanel } from './surfaces';

export function createFurniture(): THREE.Group[] {
  const result: THREE.Group[] = [];
  for (const [i, x, z, rotation] of [[1, 16.92, 5.8, Math.PI / 2], [2, 16.92, 9.6, Math.PI / 2], [3, 11.95, 13.1, 0]] as const) {
    const g = fixture(`bench-0${i}`, `블루 패브릭 벤치 ${i}`, i === 3 ? 'apparel' : 'footwear');
    g.userData['sourcePages'] = [18, 67];
    g.add(box([1.55, .12, .5], [0, .41, 0], materials.metal));
    for (const xx of [-.6, .6]) { const leg = new THREE.Mesh(new RoundedBoxGeometry(.1, .35, .4, 3, .045), materials.metal); leg.position.set(xx, .175, 0); g.add(leg); }
    for (const zz of [-.16, 0, .16]) g.add(box([1.52, .025, .15], [0, .4825, zz], materials.fabric));
    for (const xx of [-.8, .8]) {
      g.add(beam([xx, .425, -.09], [xx, .425, .09], materials.blue));
      for (const zz of [-.09, .09]) g.add(beam([xx, .425, zz], [Math.sign(xx) * .76, .425, zz], materials.blue));
    }
    g.position.set(x, 0, z); g.rotation.y = rotation; result.push(g);
  }
  const showcase = fixture('showcase', '유리 쇼케이스 DP-T', 'apparel');
  showcase.userData['sourcePages'] = [18, 68];
  for (const x of [-1.1, 0, 1.1]) showcase.add(box([.1, .55, .4], [x, .275, 0], materials.metal));
  showcase.add(box([2.75, .12, .6], [0, .61, 0], materials.metal));
  for (const x of [-.91, 0, .91]) {
    showcase.add(box([.89, .09, .014], [x, .612, .306], materials.wood));
    showcase.add(box([.26, .012, .025], [x, .612, .325], materials.blue));
  }
  showcase.add(box([2.72, .016, .58], [0, .684, 0], materials.fabric));
  showcase.add(box([2.75, .008, .6], [0, .896, 0], materials.glass));
  for (const z of [-.297, .297]) showcase.add(box([2.75, .23, .005], [0, .785, z], materials.glass));
  for (const x of [-1.372, -.455, .455, 1.372]) showcase.add(box([.005, .23, .6], [x, .785, 0], materials.glass));
  showcase.add(box([2.7, .009, .012], [0, .88, -.28], materials.led));
  const display = foldedProducts(); display.scale.set(2, .7, .55); display.position.y = .695; showcase.add(display);
  showcase.position.set(6.2, 0, 13.05); result.push(showcase);
  for (const [i, z, direction] of [[1, 12.26, 1], [2, 15.47, -1]] as const) {
    const g = fixture(`fitting-accessories-${i}`, `피팅룸 ${i} 거울·선반`, 'fitting');
    g.userData['sourcePages'] = [35, 36, 76, 77, 78, 80];
    g.add(box([.67, 2.16, .008], [direction * .145, 1.1, -.07 * direction], materials.mirror));
    for (const x of [-.49, .49, -.2 * direction]) g.add(box([.02, 2.2, .04], [x, 1.1, 0], materials.metal));
    for (const y of [.02, 2.18]) g.add(box([1, .02, .23], [0, y, 0], materials.metal));
    for (const y of [1.08, 1.56]) g.add(box([.27, .02, .23], [-.355 * direction, y, 0], materials.wood));
    for (const x of [-.48, .48]) g.add(box([.008, 2.14, .008], [x, 1.1, .1 * direction], materials.led));
    const stool = new THREE.Mesh(new RoundedBoxGeometry(.5, .47, .5, 3, .05), materials.metal); stool.position.set(.55, .235, direction * .7); g.add(stool);
    g.add(box([.45, .025, .45], [.55, .4825, direction * .7], materials.fabric));
    g.add(beam([.77, 1.6, direction * .38], [.77, 1.6, direction * 1.055], materials.blue));
    for (const zz of [.38, 1.055]) g.add(beam([.77, 1.6, direction * zz], [.87, 1.6, direction * zz], materials.blue));
    const panel = perforatedPanel(1.75, 2.37); panel.position.set(0, 1.235, direction * 1.52); g.add(panel);
    g.position.set(18.06, 0, z); result.push(g);
  }
  const outer = fixture('fitting-outer-mirror', '피팅룸 외부 전신거울', 'fitting');
  outer.userData['sourcePages'] = [18, 79];
  outer.add(box([1, 2.5, .1], [0, 1.25, 0], materials.metal), box([.88, 2.48, .008], [0, 1.25, -.055], materials.mirror));
  for (const x of [-.47, .47]) outer.add(box([.035, 2.48, .012], [x, 1.25, -.052], materials.led));
  outer.position.set(15.8, 0, 15.63); result.push(outer);
  return result;
}
