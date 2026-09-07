import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import * as THREE from 'three';

const threeUrl = import.meta.resolve('three');
async function moduleUrl(path) {
  const source = await readFile(path, 'utf8');
  const emitted = stripTypeScriptTypes(source);
  const imports = [...emitted.matchAll(/from ['"]([^'"]+)['"]/g)];
  let linked = emitted;
  for (const match of imports) {
    const specifier = match[1];
    const url = specifier === 'three' ? threeUrl : await moduleUrl(resolve(dirname(path), `${specifier}.ts`));
    linked = linked.replace(match[0], `from '${url}'`);
  }
  return `data:text/javascript;base64,${Buffer.from(linked).toString('base64')}`;
}

const { createArchitecture } = await import(await moduleUrl(resolve('src/architecture/index.ts')));
const root = createArchitecture();
root.updateMatrixWorld(true);
const bounds = new THREE.Box3().setFromObject(root);
assert.ok([...bounds.min, ...bounds.max].every(Number.isFinite), 'Architecture bounds must be finite');
assert.equal(root.getObjectByName('1F slab19190×15935')?.position.y, -0.11);
for (const object of root.children.filter((child) => child.userData.layer)) assert.equal(object.visible, false, `${object.name} defaults to cutaway`);
let triangles = 0;
let meshes = 0;
const counts = {};
root.traverse((object) => {
  const kind = object.userData.countKind;
  if (typeof kind === 'string') counts[kind] = (counts[kind] ?? 0) + (object instanceof THREE.InstancedMesh ? object.count : 1);
  if (object instanceof THREE.Mesh) {
    meshes += 1;
    const count = object.geometry.index?.count ?? object.geometry.attributes.position.count;
    triangles += count / 3 * (object instanceof THREE.InstancedMesh ? object.count : 1);
    object.geometry.computeBoundingBox();
    assert.ok(object.geometry.boundingBox?.isEmpty() === false, `${object.name} geometry has extent`);
  }
});
assert.deepEqual(counts, { fittingRooms: 2, storageShelves: 424, storagePosts: 272, storageRackBays: 106, lockers: 2 });
const floor3 = root.getObjectByName('3F distinct plan with true VOID');
assert.ok(floor3);
const ray = new THREE.Raycaster(new THREE.Vector3(8.5, 7, 1), new THREE.Vector3(0, -1, 0), 0, 1);
assert.equal(ray.intersectObject(floor3, true).length, 0, '3F VOID is open geometry');
console.log(JSON.stringify({ bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() }, meshes, triangles, counts, verified: ['finite geometry', 'floor contact', 'default cutaway layers', 'physical rack and fitting counts', '3F VOID ray opening'] }, null, 2));
