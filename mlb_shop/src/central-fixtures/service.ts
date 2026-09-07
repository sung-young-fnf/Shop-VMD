import * as THREE from 'three';
import { beam, box, fixture, materials, slab } from './parts';
import { expandedMesh, perforatedPanel } from './surfaces';

export function createService(): THREE.Group[] {
  const counter = fixture('counter', '카운터', 'checkout');
  counter.userData['sourcePages'] = [18, 69, 70, 71, 72];
  const outline: [number, number][] = [[-1.65, -.4], [1.65, -.4], [1.65, .2]];
  for (let i = 1; i <= 16; i++) { const a = i * Math.PI / 32; outline.push([1.45 + .2 * Math.cos(a), .2 + .2 * Math.sin(a)]); }
  outline.push([-1.65, .4]);
  for (const [y, height, material] of [[0, .65, materials.metal], [.65, .1, materials.wood], [.75, .35, materials.metal], [1.1, .005, materials.glass]] as const) {
    const part = slab(outline, height, material); part.position.y = y; counter.add(part);
  }
  counter.add(box([3.1, .012, .01], [-.1, .742, .402], materials.led));
  for (let i = 0; i < 4; i++) {
    counter.add(box([.72, .75, .016], [-1.2 + i * .8, .425, -.41], materials.wood));
    counter.add(box([.22, .014, .03], [-1.2 + i * .8, .78, -.43], materials.blue));
  }
  const guardPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) { const a = i * Math.PI / 32; guardPoints.push(new THREE.Vector3(1.45 + .3 * Math.cos(a), .1475, .2 + .3 * Math.sin(a))); }
  counter.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(guardPoints), 20, .0125, 8, false), materials.mirror));
  for (const [x, z] of [[1.75, .2], [1.45, .5]] as const) counter.add(beam([x, 0, z], [x, .1475, z]));
  counter.add(box([.36, .04, .25], [-.4, 1.125, -.05], materials.blue));
  const terminal = box([.35, .26, .04], [-.4, 1.3, -.14], materials.metal); terminal.rotation.x = -.2; counter.add(terminal);
  counter.position.set(13.5, 0, 2.42);

  const back = fixture('counter-backwall', '카운터 격자 백월', 'checkout');
  back.userData['sourcePages'] = [30, 73];
  for (let i = 0; i <= 8; i++) back.add(box([.012, 2.34, .25], [-1.22 + i * .305, 1.17, 0], materials.metal));
  for (let i = 0; i <= 7; i++) back.add(box([2.45, .012, .25], [0, .32 + i * .286, 0], materials.metal));
  back.add(box([2.41, .277, .018], [0, 1.88, .128], materials.wood));
  const acrylic = materials.glass.clone(); acrylic.color.set('#617c9a'); acrylic.opacity = .45;
  back.add(box([2.4, 2.0, .008], [0, 1.32, -.09], acrylic), box([2.4, .02, .012], [0, .32, .115], materials.led));
  back.position.set(13.15, 0, .65);

  const service = fixture('service-table', '메시 백판 서비스장', 'checkout');
  service.userData['sourcePages'] = [30, 74];
  service.add(box([1.24, .9, .6], [0, .45, 0], materials.metal));
  for (const x of [-.41, 0, .41]) {
    service.add(box([.39, .8, .018], [x, .44, .31], materials.metal));
    service.add(box([.012, .2, .024], [x + .14, .65, .33], materials.blue));
    for (let j = 0; j < 5; j++) service.add(box([.24, .007, .02], [x, .13 + j * .025, .326], materials.blue));
  }
  const panel = perforatedPanel(1.2, 1.42, expandedMesh); panel.position.set(0, 1.61, -.27); service.add(panel);
  for (const x of [-.61, .61]) service.add(box([.02, 1.44, .6], [x, 1.62, 0], materials.metal));
  service.add(box([1.24, .02, .6], [0, 2.33, 0], materials.metal));
  for (const x of [-.2, .2]) service.add(box([.052, .015, .052], [x, 2.31, .07], materials.led));
  service.position.set(15.15, 0, .85);

  const screen = fixture('chain-screen', '체인 스크린 디스플레이', 'entrance');
  screen.userData['sourcePages'] = [18, 34, 75];
  screen.add(box([1.31, 2.25, .13], [0, 1.575, 0], materials.metal));
  screen.add(box([1.15, 1.1, .012], [0, 1.7, .071], materials.blue));
  for (const x of [-.57, .57]) {
    for (let i = 0; i < 12; i++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(.013, .003, 4, 8), materials.mirror);
      link.position.set(x, 2.71 + i * .023, 0); link.rotation.y = i % 2 * Math.PI / 2; screen.add(link);
    }
    const pulley = new THREE.Mesh(new THREE.TorusGeometry(.055, .016, 6, 12), materials.metal); pulley.position.set(x, 3.035, 0); screen.add(pulley);
  }
  screen.rotation.y = Math.PI / 2;
  screen.position.set(.5, 0, 4.55);
  return [counter, back, service, screen];
}
