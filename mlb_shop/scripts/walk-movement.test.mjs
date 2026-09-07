import assert from 'node:assert/strict';
import { test } from 'node:test';
import { movementAxis, moveWithCollision } from '../src/walk/movement.ts';
import * as THREE from 'three';
import { createWalkCollision } from '../src/walk/collision.ts';

test('Given diagonal keys, when movement is resolved, then speed equals straight movement', () => {
  const axis = movementAxis(new Set(['ArrowUp', 'ArrowRight']));
  assert.ok(Math.abs(Math.hypot(axis.x, axis.z) - 1) < 1e-9);
});
test('Given opposing keys, when movement is resolved, then movement cancels', () => {
  assert.deepEqual(movementAxis(new Set(['ArrowUp', 'ArrowDown'])), { x: 0, z: 0 });
});
test('Given a wall along x, when moving diagonally, then the visitor slides without crossing', () => {
  const position = moveWithCollision({ x: 0, z: 0 }, { x: 1, z: 1 }, (from, to) => to.x < .3);
  assert.ok(position.x < .3);
  assert.ok(Math.abs(position.z - 1) < 1e-9);
});
test('Given a thin obstacle, when a large frame displacement arrives, then substeps prevent tunnelling', () => {
  const position = moveWithCollision({ x: 0, z: 0 }, { x: 2, z: 0 }, (from, to) => !(to.x >= .5 && to.x <= .6));
  assert.ok(position.x < .5);
});
test('Given an actual hidden wall mesh, when walking toward it, then cutaway visibility does not disable collision', () => {
  const model = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(.1, 3, 3));
  wall.position.set(4, 1.5, 8);
  wall.visible = false;
  model.add(wall);
  const collision = createWalkCollision(model);
  assert.equal(collision.canMove({ x: 3.5, z: 8 }, { x: 4.5, z: 8 }), false);
  wall.geometry.dispose();
});
test('Given floor and overhead meshes, when walking through the aisle, then they do not block the visitor', () => {
  const model = new THREE.Group();
  for (const y of [-.1, 3.2]) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(19, .2, 16));
    mesh.position.set(9.5, y, 8);
    model.add(mesh);
  }
  assert.equal(createWalkCollision(model).canMove({ x: 2, z: 8 }, { x: 3, z: 8 }), true);
  model.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
});
