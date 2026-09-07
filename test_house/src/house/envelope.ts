import * as THREE from 'three';
import { box, group, instances } from './primitives';
import type { Solid } from './primitives';
import type { HouseMaterials } from './materials';

type Opening = { readonly at: number; readonly width: number; readonly sill: number; readonly height: number; readonly garage?: boolean };
type Wall = { readonly name: string; readonly center: readonly [number, number]; readonly length: number; readonly turn: number; readonly openings: readonly Opening[] };

const walls: readonly Wall[] = [
  { name: 'front', center: [-3.73, 5], length: 18.15, turn: 0, openings: [{ at: -7.1, width: 1.8, sill: 0.12, height: 2.8 }, { at: -3.25, width: 2.3, sill: 0, height: 2.94 }, { at: 0.1, width: 1.7, sill: 0.12, height: 2.8 }, { at: 5.4, width: 0.95, sill: 0.68, height: 1.95 }, { at: 7.95, width: 0.95, sill: 0.68, height: 1.95 }] },
  { name: 'garage-front', center: [9.1, 5], length: 7.5, turn: 0, openings: [{ at: -1.78, width: 2.75, sill: 0, height: 3.05, garage: true }, { at: 1.78, width: 2.75, sill: 0, height: 3.05, garage: true }] },
  { name: 'east', center: [12.85, 0.075], length: 9.85, turn: Math.PI / 2, openings: [{ at: 2.8, width: 2.75, sill: 0, height: 3.05, garage: true }, { at: -1.8, width: 0.8, sill: 0.7, height: 1.9 }, { at: -3.75, width: 0.8, sill: 0.7, height: 1.9 }] },
  { name: 'rear-main', center: [5.05, -4.85], length: 15.6, turn: Math.PI, openings: [{ at: -2.65, width: 1.0, sill: 0, height: 2.45 }, { at: 1.8, width: 1.15, sill: 0.95, height: 1.65 }, { at: 4.0, width: 0.8, sill: 0.95, height: 1.65 }, { at: 6.9, width: 1.3, sill: 0.8, height: 1.85 }] },
  { name: 'rear-flex', center: [-10.5, -4.85], length: 4.6, turn: Math.PI, openings: [{ at: -0.8, width: 1, sill: 0, height: 2.55 }] },
  { name: 'west', center: [-12.8, 0.075], length: 9.85, turn: -Math.PI / 2, openings: [{ at: -3.3, width: 1, sill: 0.8, height: 1.85 }, { at: -0.3, width: 1.1, sill: 0, height: 2.65 }, { at: 3.6, width: 1.1, sill: 0, height: 2.65 }] },
  { name: 'wing-rear', center: [-5.45, -8.5], length: 5.5, turn: Math.PI, openings: [{ at: -1.8, width: 1.0, sill: 0.9, height: 1.8 }, { at: 0.2, width: 1.0, sill: 0.9, height: 1.8 }] },
  { name: 'wing-east', center: [-2.7, -6.68], length: 3.65, turn: Math.PI / 2, openings: [{ at: 0, width: 1.2, sill: 0.85, height: 1.9 }] },
  { name: 'wing-west', center: [-8.2, -6.68], length: 3.65, turn: -Math.PI / 2, openings: [{ at: -0.1, width: 0.7, sill: 1.35, height: 1.15 }] },
];

function frame(parent: THREE.Group, opening: Opening, m: HouseMaterials): void {
  const { at, width, height, sill } = opening;
  const centerY = sill + height / 2;
  box(parent, { name: 'glazing', center: [at, centerY, 0.025], size: [width - 0.12, height - 0.12, 0.05], material: m.glass });
  const trim = 0.12;
  for (const edge of [-1, 1]) {
    box(parent, { name: 'opening-surround', center: [at + edge * (width / 2 + 0.065), centerY, 0.02], size: [trim, height + 0.2, 0.25], material: m.trim });
    box(parent, { name: 'frame-stile', center: [at + edge * (width / 2 - 0.045), centerY, 0.05], size: [0.075, height, 0.12], material: m.black });
    box(parent, { name: 'frame-rail', center: [at, centerY + edge * (height / 2 - 0.04), 0.05], size: [width, 0.08, 0.12], material: m.black });
  }
  box(parent, { name: 'opening-header', center: [at, sill + height + 0.07, 0.02], size: [width + 0.25, 0.13, 0.25], material: m.trim });
  if (opening.garage === true) {
    box(parent, { name: 'garage-door', center: [at, 1.17, 0], size: [width - 0.14, 2.3, 0.08], material: m.black });
    for (const offset of [-0.66, 0.66]) {
      box(parent, { name: 'garage-inset-panel', center: [at + offset, 1.1, 0.055], size: [1.15, 2.03, 0.04], material: m.roof });
      box(parent, { name: 'garage-handle', center: [at + offset * 0.17, 1.3, 0.115], size: [0.045, 0.22, 0.065], material: m.mortar });
    }
    for (const offset of [-0.9, -0.3, 0.3, 0.9]) box(parent, { name: 'garage-transom-mullion', center: [at + offset, 2.7, 0.06], size: [0.04, 0.56, 0.12], material: m.black });
  } else {
    box(parent, { name: 'window-crossbar', center: [at, sill + height * 0.54, 0.06], size: [width, 0.045, 0.12], material: m.black });
    box(parent, { name: 'window-mullion', center: [at, centerY, 0.06], size: [0.055, height, 0.12], material: m.black });
    if (width > 1.6) for (const offset of [-0.25, 0.25]) box(parent, { name: 'secondary-mullion', center: [at + width * offset, centerY, 0.06], size: [0.036, height, 0.1], material: m.black });
    if (sill < 0.2) box(parent, { name: 'door-handle', center: [at + 0.14, 1.2, 0.15], size: [0.04, 0.25, 0.08], material: m.wood });
  }
}

export function createEnvelope(parent: THREE.Group, m: HouseMaterials): THREE.Group {
  const upper = group(parent, 'upper-envelope');
  for (const wall of walls) {
    const low = group(parent, `${wall.name}-lower`);
    const high = group(upper, `${wall.name}-upper`);
    for (const part of [low, high]) { part.position.set(wall.center[0], 0.42, wall.center[1]); part.rotation.y = wall.turn; }
    const openings = [...wall.openings].sort((a, b) => a.at - b.at);
    const solids: Solid[] = [];
    const fill = (start: number, end: number, bottom: number, top: number): void => {
      if (end - start < 0.01 || top - bottom < 0.01) return;
      const cutoff = Math.min(top, 1.08);
      if (bottom < cutoff) box(low, { name: 'lower-wall-span', center: [(start + end) / 2, (bottom + cutoff) / 2, 0], size: [end - start, cutoff - bottom, 0.18], material: m.wall });
      if (top > 1.08) box(high, { name: 'upper-wall-span', center: [(start + end) / 2, (Math.max(bottom, 1.08) + top) / 2, 0], size: [end - start, top - Math.max(bottom, 1.08), 0.18], material: m.wall });
      for (let x = Math.ceil(start / 0.27) * 0.27; x < end - 0.02; x += 0.27) solids.push({ name: 'board-and-batten', center: [x, (bottom + top) / 2, 0.116], size: [0.035, top - bottom, 0.045], material: m.trim });
    };
    let start = -wall.length / 2;
    for (const opening of openings) {
      fill(start, opening.at - opening.width / 2, 0, 3.2);
      fill(opening.at - opening.width / 2, opening.at + opening.width / 2, 0, opening.sill);
      fill(opening.at - opening.width / 2, opening.at + opening.width / 2, opening.sill + opening.height, 3.2);
      frame(high, opening, m);
      start = opening.at + opening.width / 2;
    }
    fill(start, wall.length / 2, 0, 3.2);
    instances(high, solids);
    for (const x of [-wall.length / 2, wall.length / 2]) box(high, { name: 'corner-board', center: [x, 1.6, 0.11], size: [0.15, 3.2, 0.065], material: m.trim });
  }
  return upper;
}
