import * as THREE from 'three';
import { beam, box, fixture, materials, slab } from './parts';
import { perforatedPanel } from './surfaces';

export function createCustom(): THREE.Group[] {
  const custom = fixture('dp-t2', '모꾸존 120° 패치 테이블', 'custom');
  custom.userData['sourcePages'] = [18, 96, 97];
  const outline = [[0, 0], [1.38, 0], [2.12, -1.25], [1.60, -1.55], [1.053, -.6], [0, -.6]] as const;
  const top = slab(outline, .1, materials.metal); top.position.y = .82; custom.add(top);
  custom.add(box([1.05, .78, .6], [.525, .41, -.3], materials.metal));
  const arm = new THREE.Group();
  for (const x of [-.51, .51]) for (const z of [-.28, .28]) arm.add(box([.02, .8, .02], [x, .42, z], materials.metal));
  const panel = perforatedPanel(1.02, .74); panel.position.set(0, .43, -.28); arm.add(panel);
  for (const y of [.1, .3, .5, .7]) arm.add(box([1.02, .008, .55], [0, y, 0], materials.glass));
  arm.rotation.y = Math.PI / 3; arm.position.set(1.59, 0, -.85); custom.add(arm);
  for (let i = 0; i < 9; i++) arm.add(box([.008, .04, .54], [-.48 + i * .12, .9, 0], materials.wood));
  for (let i = 0; i < 5; i++) arm.add(box([1.02, .04, .008], [0, .9, -.27 + i * .135], materials.wood));
  for (const x of [.22, .7]) custom.add(box([.44, .7, .016], [x, .4, .011], materials.wood));
  custom.rotation.y = Math.PI / 2; custom.position.set(2.7, 0, 14.17);
  const result = [custom];
  for (const [i, x] of [[1, 1.3], [2, 2.35]] as const) {
    const g = fixture(`dp-t3-0${i}`, `모꾸존 장비대 ${i}`, 'custom');
    g.userData['sourcePages'] = [18, 98];
    g.userData['equipmentNote'] = 'Illustrative press proxy; 2 devices total. Source: separate outlets, no power strips; 1KWH ambiguous.';
    g.add(box([1, .53, .8], [0, .265, 0], materials.metal));
    for (const xx of [-.49, 0, .49]) g.add(box([.02, .25, .8], [xx, .665, 0], materials.metal));
    g.add(box([1, .02, .8], [0, .79, 0], materials.metal));
    for (const xx of [-.24, .24]) g.add(box([.46, .46, .018], [xx, .27, -.41], materials.metal));
    g.add(box([.38, .06, .58], [0, .83, 0], materials.blue));
    g.add(box([.12, .44, .1], [0, 1.06, .2], materials.metal));
    const press = box([.34, .10, .26], [0, 1.33, -.03], materials.metal); press.rotation.x = -.6; g.add(press);
    const platen = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .22, 16, 1, false, 0, Math.PI), materials.blue); platen.rotation.z = Math.PI / 2; platen.position.set(0, 1.04, -.08); g.add(platen);
    g.add(beam([0, 1.3, .14], [0, 1.4, -.22]));
    g.add(box([.13, .09, .015], [0, .94, -.23], materials.glass));
    g.position.set(x, 0, 14.85); result.push(g);
  }
  return result;
}
