import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { createServer } from 'vite';

const directory = 'evidence/cap-store-integration-20260908';
const stage = process.argv[2] ?? 'current';
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const originalLoad = THREE.TextureLoader.prototype.load;
const failures = [];
const records = [];
const clothing = [];
const batching = [];
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const check = (condition, message) => { if (!condition) failures.push(message); };
function meshSnapshot(group, selected, exact = false) {
  group.updateMatrixWorld(true);
  const points = [], source = [], correspondence = new Map();
  group.traverse(object => {
    if (!(object instanceof THREE.Mesh) || !selected(object)) return;
    const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry;
    const position = geometry.getAttribute('position');
    const attribute = geometry.getAttribute('capSourcePosition');
    const key = [object.material].flat().map(material => material.uuid).join('|');
    const ordered = correspondence.get(key) ?? { positions: [], source: [] };
    const point = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      point.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld);
      points.push(point.toArray().map(value => Math.round(value * 1e6)).join(','));
      if (exact) ordered.positions.push(...point.toArray());
    }
    if (attribute) for (const value of attribute.array) source.push(value);
    if (exact) {
      if (attribute) for (const value of attribute.array) ordered.source.push(value);
      correspondence.set(key, ordered);
    }
  });
  const result = { vertices: points.length, points: hash(points.sort()), source: hash(source.sort((a,b) => a-b)) };
  if (exact) result.correspondence = correspondence;
  return result;
}
try {
  THREE.TextureLoader.prototype.load = function () { return new THREE.Texture(); };
  const { createCabinetWalls } = await server.ssrLoadModule('/src/wall-fixtures/cabinets.ts');
  const { createApparelWalls } = await server.ssrLoadModule('/src/wall-fixtures/apparel.ts');
  const { createIslands } = await server.ssrLoadModule('/src/central-fixtures/islands.ts');
  const { createFurniture } = await server.ssrLoadModule('/src/central-fixtures/furniture.ts');
  const { batchFixture } = await server.ssrLoadModule('/src/wall-fixtures/surfaces.ts');
  const { mergeFixture } = await server.ssrLoadModule('/src/central-fixtures/parts.ts');
  const fixtures = [];
  for (const root of [createCabinetWalls(), createApparelWalls()]) root.traverse(object => {
    if (object instanceof THREE.Group && object.userData.fixtureId) fixtures.push([object, batchFixture]);
  });
  for (const fixture of [...createIslands(), ...createFurniture()]) fixtures.push([fixture, mergeFixture]);
  for (const [fixture, batch] of fixtures) {
    const caps = [];
    fixture.traverse(object => { if (object.name.startsWith('reference-cap-')) caps.push(object); });
    if (!caps.length) continue;
    fixture.removeFromParent(); fixture.position.set(0,0,0); fixture.rotation.set(0,0,0); fixture.updateMatrixWorld(true);
    const id = fixture.userData.fixtureId;
    const capMaterials = new Set();
    const folded = [];
    fixture.traverse(object => { if (object.name.startsWith('reference-folded-')) folded.push(object); });
    const clothMaterials = new Set();
    fixture.traverse(object => {
      if (!object.name.startsWith('reference-folded-') && !object.name.startsWith('reference-garment-')) return;
      object.traverse(mesh => { if (mesh instanceof THREE.Mesh) for (const material of [mesh.material].flat()) clothMaterials.add(material); });
    });
    const clothingBefore = meshSnapshot(fixture, mesh => [mesh.material].flat().some(material => clothMaterials.has(material)));
    for (const [index, cap] of caps.entries()) {
      cap.traverse(mesh => { if (mesh instanceof THREE.Mesh) for (const material of [mesh.material].flat()) capMaterials.add(material); });
      const bounds = new THREE.Box3().setFromObject(cap);
      const scale = new THREE.Vector3().setFromMatrixScale(cap.matrixWorld).toArray();
      const nominal = cap.userData.productId === 'M21N3ACP7701N' ? .1 : 1;
      const scales = scale.map(value => value / nominal);
      const axes = [0, 1, 2].map(axis => new THREE.Vector3().setFromMatrixColumn(cap.matrixWorld, axis).normalize());
      check(Math.abs(axes[0].dot(axes[1])) + Math.abs(axes[0].dot(axes[2])) + Math.abs(axes[1].dot(axes[2])) < 1e-8, `${id}/${index}: cap world basis is sheared`);
      const support = id.startsWith('ca-') ? .325 + Math.floor(index / 3) * .358
        : id === 'w04-perforated-01' ? .815 + Math.floor(index / 3) * .3
        : new THREE.Box3().setFromObject(folded[index]).max.y;
      const gap = bounds.min.y - support;
      const row = { fixture: id, index, sku: cap.userData.productId, scales, support, gap, min: bounds.min.toArray(), max: bounds.max.toArray() };
      records.push(row);
      check(Math.max(...scales) - Math.min(...scales) < 1e-8, `${id}/${index}: cap is anisotropically flattened ${scales}`);
      check(gap >= .0009 && gap < .003, `${id}/${index}: actual cap minimum misses support: gap=${gap}`);
      if (id === 'showcase') {
        check(bounds.max.y <= .891, `${id}/${index}: cap intersects glass lid`);
        check(bounds.min.z >= -.2935 && bounds.max.z <= .2935, `${id}/${index}: cap intersects front/back glass`);
        for (const x of [-1.372, -.455, .455, 1.372]) check(bounds.max.x < x - .0035 || bounds.min.x > x + .0035, `${id}/${index}: cap intersects glass divider ${x}`);
      }
      if (id.startsWith('ca-')) check(bounds.min.z >= -.18 && bounds.max.z <= .185, `${id}/${index}: cap exceeds cabinet shelf depth`);
      if (id === 'w04-perforated-01') check(bounds.min.z >= .016 && bounds.max.z <= .266, `${id}/${index}: cap exceeds pegboard shelf depth`);
    }
    const selected = mesh => [mesh.material].flat().some(material => capMaterials.has(material));
    const before = meshSnapshot(fixture, selected, true);
    batch(fixture);
    const after = meshSnapshot(fixture, selected, true);
    check(before.vertices === after.vertices, `${id}: batching drops cap vertices`);
    check(before.source === after.source, `${id}: batching changes capSourcePosition`);
    let maximumDelta = 0;
    for (const [material, ordered] of before.correspondence) {
      const baked = after.correspondence.get(material);
      check(baked?.positions.length === ordered.positions.length, `${id}: cap material vertex count changed`);
      if (!baked) continue;
      check(hash(ordered.source) === hash(baked.source), `${id}: capSourcePosition vertex association changed`);
      for (let i = 0; i < ordered.positions.length; i++) maximumDelta = Math.max(maximumDelta, Math.abs(ordered.positions[i] - baked.positions[i]));
    }
    check(maximumDelta < 3e-7, `${id}: batching changes cap coordinates beyond Float32 error: ${maximumDelta}`);
    batching.push({ fixture: id, vertices: before.vertices, maximumDelta, sourceBefore: before.source, sourceAfter: after.source });
    const clothingAfter = meshSnapshot(fixture, mesh => [mesh.material].flat().some(material => clothMaterials.has(material)));
    check(clothingBefore.points === clothingAfter.points, `${id}: batching changes clothing positions`);
    clothing.push({ fixture: id, ...clothingBefore });
  }
  await mkdir(directory, { recursive: true });
  const report = { stage, time: new Date().toISOString(), count: records.length, records, clothing, batching, failures };
  if (stage !== 'red') {
    const baseline = JSON.parse(await readFile(`${directory}/red.json`, 'utf8'));
    check(hash(clothing) === hash(baseline.clothing), 'Clothing world geometry differs from frozen pre-fix actual fixture baseline');
    check(hash(records.map(({fixture,index,sku}) => ({fixture,index,sku}))) === hash(baseline.records.map(({fixture,index,sku}) => ({fixture,index,sku}))), 'Cap SKU allocation changed');
  }
  await writeFile(`${directory}/${stage}.json`, JSON.stringify(report, null, 2), { flag: stage === 'red' ? 'wx' : 'w' });
  console.log(JSON.stringify({ count: records.length, examples: records.filter(row => row.sku === 'M21N3ACP7701N' || row.fixture === 'showcase').slice(-6), failures: failures.slice(0, 12), failureCount: failures.length }, null, 2));
  assert.equal(failures.length, 0, 'Actual store caps keep uniform shape, clear supports/glass, and survive production batching');
} finally { THREE.TextureLoader.prototype.load = originalLoad; await server.close(); }
