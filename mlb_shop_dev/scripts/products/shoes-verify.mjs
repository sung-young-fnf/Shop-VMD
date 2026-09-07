import assert from 'node:assert/strict';
import * as THREE from 'three';
import { shoeProducts } from '../../src/products/shoes/catalog.ts';
import { cavityGeometry, shoeLoft } from '../../src/products/shoes/geometry.ts';

for (const product of shoeProducts) {
  const cavity = new THREE.Mesh(cavityGeometry(product), new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
  cavity.updateMatrixWorld();
  for (const x of [.055,.077,.10,.12]) {
    for (const z of [-.012,0,.012]) {
      const ray = new THREE.Raycaster(new THREE.Vector3(x,.2,z),new THREE.Vector3(0,-1,0));
      assert(ray.intersectObject(cavity).length > 0, 'Collar cavity must contain a sealed floor, not background holes');
    }
  }
  const edges = new Map();
  const cavityIndex = cavity.geometry.index;
  assert(cavityIndex);
  for (let i=0;i<cavityIndex.count;i+=3) {
    const face = [cavityIndex.getX(i),cavityIndex.getX(i+1),cavityIndex.getX(i+2)];
    for (let e=0;e<3;e++) {
      const a=face[e], b=face[(e+1)%3];
      const key=[Math.min(a,b),Math.max(a,b)].join(':');
      edges.set(key,(edges.get(key)??0)+1);
    }
  }
  assert.equal([...edges.values()].filter(count=>count===1).length,64,'Only the collar rim may remain an open boundary');
  cavity.geometry.dispose(); cavity.material.dispose();
  const upper = shoeLoft(product, false);
  const sole = shoeLoft(product, true);
  for (let ring = 1; ring < 40; ring++) {
    const vertex = ring * 25 + 6;
    const upperPoints = upper.getAttribute('position');
    const solePoints = sole.getAttribute('position');
    assert(Math.abs(upperPoints.getZ(vertex) - solePoints.getZ(vertex)) < 1e-7);
    assert(Math.abs(upperPoints.getY(vertex) - solePoints.getY(vertex) + .0003) < 1e-7,
      'Upper and outsole share a continuous slightly overlapping seam');
  }
  upper.dispose(); sole.dispose();
  for (const isSole of [false, true]) {
    const geometry = shoeLoft(product, isSole);
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    assert(bounds);
    assert(bounds.max.x - bounds.min.x <= .314001);
    assert(bounds.max.z - bounds.min.z <= .126001);
    assert(bounds.min.y >= -1e-7 && bounds.max.y <= .145001);
    assert.equal(geometry.groups.length, 2);
    const positions = geometry.getAttribute('position');
    const widths = new Set();
    for (let i = 0; i < positions.count; i++) widths.add(positions.getZ(i).toFixed(4));
    assert(widths.size > 100, 'Cross sections must vary in depth, not form a slab');
    const normals = geometry.getAttribute('normal');
    assert(normals.getY(10 * 25) > .3, 'Upper surface normals point outward');
    console.log(JSON.stringify({sku:product.sku, part:isSole?'sole':'upper', distinctZ:widths.size, groups:geometry.groups.length, bounds}));
    geometry.dispose();
  }
}
