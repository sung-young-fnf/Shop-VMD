import * as THREE from 'three';
import type { AssortmentCapDescriptor } from './assortment-types';
import { capPhotoUv, capRearClothUv, createAssortmentMaterials } from './assortment-material';
import { realBill, realCrown, realLowerAngle, realPatch } from './real-surfaces';

class AssortmentCapVariantError extends Error {
  constructor(readonly variant: never) { super(`Unsupported cap construction: ${variant}`); this.name = 'AssortmentCapVariantError'; }
}

const measuredBillTips: Readonly<Record<string, readonly [number, number]>> = {
  M22N3ACP0802N: [.618, 468 / 682],
  M26F3ACPB2766: [433 / 682, 477 / 682],
  M25N3ACPB915N: [415 / 682, 454 / 682],
  M26F3ACPB3266: [402 / 682, 423 / 682],
};

export function createAssortmentCap(descriptor: AssortmentCapDescriptor): THREE.Group {
  const cap = new THREE.Group();
  cap.name = `reference-cap-${descriptor.id}`;
  cap.userData['productId'] = descriptor.id;
  cap.userData['cadSource'] = descriptor.cadSource;
  cap.userData['representation'] = 'Volumetric parametric cap with original directional photos; captured lighting, inferred unseen cloth';
  const materials = createAssortmentMaterials(descriptor);
  const profile = (() => {
    switch (descriptor.bill) {
      case 'curved': return { flat: false, tip: .72, arch: .26 };
      case 'flat': return { flat: true, tip: .96, arch: 0 };
      default: throw new AssortmentCapVariantError(descriptor.bill);
    }
  })();
  const adjustable = (() => {
    switch (descriptor.rearConstruction) {
      case 'adjustable': return true;
      case 'fitted': return false;
      default: throw new AssortmentCapVariantError(descriptor.rearConstruction);
    }
  })();
  const lowerAngle = (theta: number) => adjustable ? realLowerAngle(theta) : Math.PI / 2;
  const billPoint = (u: number, q: number): THREE.Vector3 => {
    const point = realBill(u, q);
    if (profile.flat) {
      const root = realBill(u, 0);
      point.y = root.y + (.02 - root.y) * q * Math.sqrt(Math.max(0, 1 - u * u));
    }
    return point;
  };
  for (let panel = 0; panel < 6; panel++) {
    const source: number[] = [], frontUv: number[] = [], rearUv: number[] = [], sideUv: number[] = [], fabricUv: number[] = [];
    const geometry = realPatch([12, 18], (u, v) => {
      const theta = (panel + u) * Math.PI / 3;
      const t = lowerAngle(theta) * v;
      const height = Math.max(0, Math.cos(t)) ** 1.05;
      const point = realCrown(theta, t);
      source.push(Math.sin(theta), height, Math.cos(theta));
      fabricUv.push(Math.sin(theta) * .7 + Math.cos(theta) * .3, height * 1.3 + Math.cos(theta) * .17);
      const frontY = THREE.MathUtils.lerp(descriptor.front.crownBottom, descriptor.front.crownTop ?? descriptor.front.bounds[1], height);
      const rearTop = descriptor.rear.crownTop ?? descriptor.rear.bounds[1];
      let rearY = THREE.MathUtils.lerp(descriptor.rear.bounds[3], rearTop, height);
      const openingColumns = descriptor.rear.openingTopColumns;
      if (adjustable && Math.cos(theta) < 0 && openingColumns?.length) {
        const [, top, , bottom] = descriptor.rear.bounds;
        const edgeX = realCrown(theta, lowerAngle(theta)).x;
        const column = THREE.MathUtils.clamp(.5 - .49 * edgeX, 0, 1) * (openingColumns.length - 1);
        const start = openingColumns[Math.floor(column)] ?? bottom;
        const end = openingColumns[Math.ceil(column)] ?? start;
        const edgeY = Math.max(top, THREE.MathUtils.lerp(start, end, column % 1) - Math.max(.003, (bottom - top) * .012));
        const edgeHeight = Math.max(0, Math.cos(lowerAngle(theta))) ** 1.05;
        rearY = THREE.MathUtils.lerp(edgeY, rearTop, THREE.MathUtils.clamp((height - edgeHeight) / (1 - edgeHeight), 0, 1));
      }
      frontUv.push(...capPhotoUv(descriptor.front, [Math.sin(theta), frontY]).toArray());
      const rearProjection = adjustable && Math.cos(theta) < 0 ? capRearClothUv : capPhotoUv;
      rearUv.push(...rearProjection(descriptor.rear, [-Math.sin(theta), rearY]).toArray());
      if (descriptor.side) {
        const [left, top, right, bottom] = descriptor.side.bounds;
        const forward = THREE.MathUtils.clamp((point.z + 1.1) / 3.01, 0, 1);
        const horizontal = ({ left: 1 - forward, right: forward } as const)[descriptor.side.frontAt];
        sideUv.push(THREE.MathUtils.lerp(left, right, horizontal), 1 - THREE.MathUtils.lerp(bottom, top, THREE.MathUtils.clamp((point.y + .4) / 1.6, 0, 1)));
      } else sideUv.push(...descriptor.clothUv);
      return point;
    });
    geometry.setAttribute('capSourcePosition', new THREE.Float32BufferAttribute(source, 3));
    geometry.setAttribute('capFrontUv', new THREE.Float32BufferAttribute(frontUv, 2));
    geometry.setAttribute('capRearUv', new THREE.Float32BufferAttribute(rearUv, 2));
    geometry.setAttribute('capSideUv', new THREE.Float32BufferAttribute(sideUv, 2));
    geometry.setAttribute('capFabricUv', new THREE.Float32BufferAttribute(fabricUv, 2));
    const crown = new THREE.Mesh(geometry, materials.crown); crown.name = `assortment-crown-${panel}`; cap.add(crown);
    const lining = realPatch([12, 12], (u, v) => {
      const theta = (panel + u) * Math.PI / 3;
      return realCrown(theta, lowerAngle(theta) * v, .012).add(new THREE.Vector3(0, -.012, 0));
    });
    const inner = new THREE.Mesh(lining, materials.lining); inner.name = `assortment-lining-${panel}`; inner.material.side = THREE.BackSide; cap.add(inner);
  }
  const visor = realPatch([40, 16], (u, v) => billPoint(u * 2 - 1, v));
  const visorUv = visor.getAttribute('uv');
  for (let i = 0; i < visorUv.count; i++) {
    const u = visorUv.getX(i) * 2 - 1, q = visorUv.getY(i);
    const drop = profile.tip + profile.arch * u * u;
    const y = descriptor.front.crownBottom + (descriptor.front.bounds[3] - descriptor.front.crownBottom) * (.06 * u * u * (1 - q) + drop * q);
    if (descriptor.front.columns?.length) {
      const [left, top, right, bottom] = descriptor.front.bounds;
      const fraction = .5 + .49 * u;
      const column = fraction * (descriptor.front.columns.length - 1);
      const start = descriptor.front.columns[Math.floor(column)] ?? [top, bottom];
      const end = descriptor.front.columns[Math.ceil(column)] ?? start;
      const rootY = descriptor.front.crownBottom + (bottom - descriptor.front.crownBottom) * .06 * u * u;
      const crownTop = descriptor.front.crownTop ?? top;
      const sourceSplit = (descriptor.front.crownBottom - crownTop) / (bottom - crownTop);
      const topClothFraction = profile.flat || sourceSplit < .63 ? .95 : .34 + .55 * u * u;
      const measuredTip = measuredBillTips[descriptor.id];
      const semanticTip = measuredTip ? THREE.MathUtils.lerp(measuredTip[0], measuredTip[1], u * u) : descriptor.front.crownBottom + (bottom - descriptor.front.crownBottom) * topClothFraction;
      const columnTip = THREE.MathUtils.lerp(start[1], end[1], column % 1) - Math.max(.003, (bottom - top) * .015);
      const tipY = Math.max(rootY, Math.min(columnTip, semanticTip));
      visorUv.setXY(i, THREE.MathUtils.lerp(left, right, fraction), 1 - THREE.MathUtils.lerp(rootY, tipY, q));
    } else {
      const uv = capPhotoUv(descriptor.front, [u, y]); visorUv.setXY(i, uv.x, uv.y);
    }
  }
  const bill = new THREE.Mesh(visor, materials.front); bill.name = 'assortment-bill';
  bill.userData['photoBoundaryEvidence'] = measuredBillTips[descriptor.id] ? 'Manually observed source-image upper-cloth center and outer tip; see cap-builder evidence' : 'Conservative inferred upper-cloth boundary within measured source foreground columns';
  cap.add(bill);
  const underside = realPatch([40, 12], (u, v) => billPoint(u * 2 - 1, v).add(new THREE.Vector3(0, -.018, 0)));
  const undersideMaterial = materials.underside.clone(); undersideMaterial.onBeforeCompile = materials.underside.onBeforeCompile; undersideMaterial.customProgramCacheKey = materials.underside.customProgramCacheKey; undersideMaterial.side = THREE.DoubleSide;
  const bottom = new THREE.Mesh(underside, undersideMaterial); bottom.name = 'assortment-bill-underside'; cap.add(bottom);
  for (const q of [0, 1]) {
    const rim = new THREE.Mesh(realPatch([40, 1], (u, v) => billPoint(u * 2 - 1, q).add(new THREE.Vector3(0, -.018 * v, 0))), undersideMaterial);
    rim.name = `assortment-bill-rim-${q}`; cap.add(rim);
  }
  const bindingMaterial = materials.lining.clone(); bindingMaterial.onBeforeCompile = materials.lining.onBeforeCompile; bindingMaterial.customProgramCacheKey = materials.lining.customProgramCacheKey; bindingMaterial.side = THREE.DoubleSide;
  const binding = new THREE.Mesh(realPatch([72, 1], (u, v) => {
    const theta = u * Math.PI * 2;
    return realCrown(theta, lowerAngle(theta), .012 * v).add(new THREE.Vector3(0, -.012 * v, 0));
  }), bindingMaterial); binding.name = 'assortment-bound-hem'; cap.add(binding);
  if (adjustable) {
    const depth = -realCrown(Math.PI, Math.PI / 2).z * .98 / 1.05;
    const strap = realPatch([24, 3], (u, v) => {
      const x = (u - .5) * 1.3, radius = Math.sqrt(1 - x * x);
      return new THREE.Vector3(x, -.11 - .23 * radius + v * .22, -depth * radius - .018 + THREE.MathUtils.smoothstep(Math.abs(x), .46, .65) * .045);
    });
    const uv = strap.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) {
      const x = (uv.getX(i) - .5) * -1.3;
      const y = THREE.MathUtils.lerp(descriptor.rear.bounds[3], descriptor.rear.bounds[1], .015 + uv.getY(i) * .1);
      const value = capPhotoUv(descriptor.rear, [x, y]); uv.setXY(i, value.x, value.y);
    }
    materials.rear.side = THREE.DoubleSide;
    const closure = new THREE.Mesh(strap, materials.rear); closure.name = 'assortment-adjustment-strap'; cap.add(closure);
  }
  const button = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 8), materials.cloth); button.scale.y = .4; button.position.y = 1.2; button.name = 'assortment-button'; cap.add(button);
  for (const sign of [-1, 1]) {
    if (descriptor.catEars) {
      const shape = new THREE.Shape(); shape.moveTo(-.16, 0); shape.quadraticCurveTo(-.18, .25, -.04, .60); shape.quadraticCurveTo(.04, .66, .08, .43); shape.quadraticCurveTo(.14, .18, .18, 0); shape.closePath();
      const ear = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {depth:.055,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:2,steps:1,curveSegments:10}), materials.cloth);
      ear.position.set(sign * .65, .90, .03); ear.rotation.z = sign * -.15; ear.name = `assortment-ear-${sign}`; cap.add(ear);
    }
    if (descriptor.longEars) {
      const ear = new THREE.Mesh(realPatch([20, 24], (u, v) => {
        const angle = u * Math.PI * 2;
        const width = .19 * Math.sin(Math.PI * v) ** .3;
        return new THREE.Vector3(sign * (.62 + .49 * Math.sin(Math.PI * v * .62)) + Math.cos(angle) * width, 1.06 - 2.10 * v, -.05 + .10 * Math.sin(angle) * Math.sin(Math.PI * v));
      }), materials.cloth);
      ear.name = `assortment-long-ear-${sign}`; cap.add(ear);
    }
  }
  cap.scale.setScalar(.1);
  cap.position.y = .04;
  cap.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; } });
  return cap;
}
