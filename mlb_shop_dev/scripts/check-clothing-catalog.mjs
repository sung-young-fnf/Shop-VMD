import assert from 'node:assert/strict';
import { access, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { pairedClothesCatalog } = await server.ssrLoadModule('/src/products/clothes/catalog.ts');
  const { garmentGeometry, rearGarmentGeometry } = await server.ssrLoadModule('/src/products/clothes/geometry.ts');
  const sources = JSON.parse(await readFile('evidence/unique-clothing-20260908/sources.json', 'utf8'));
  assert.equal(pairedClothesCatalog.length, sources.length);
  assert.equal(new Set(pairedClothesCatalog.map(item => item.id)).size, sources.length);
  const results = [];
  for (const reference of pairedClothesCatalog) {
    const source = sources.find(item => item.id === reference.id);
    assert.ok(source?.verification.humanFree && source?.verification.frontRearConfirmed);
    await access(`public/products/clothes/${reference.frontImage}`);
    await access(`public/products/clothes/${reference.rearImage}`);
    const { face, shell } = garmentGeometry(reference);
    const rear = rearGarmentGeometry(face, reference.rearProjection);
    const positions = face.getAttribute('position');
    const normals = face.getAttribute('normal');
    const rearPositions = rear.getAttribute('position');
    const rearNormals = rear.getAttribute('normal');
    const uv = rear.getAttribute('uv');
    for (let i = 0; i < positions.count; i++) {
      assert.ok(normals.getZ(i) > 0 && rearNormals.getZ(i) < 0, `${reference.id}: outward photo normals`);
      assert.equal(positions.getX(i), rearPositions.getX(i));
      assert.equal(positions.getY(i), rearPositions.getY(i));
      assert.equal(positions.getZ(i), -rearPositions.getZ(i));
      assert.ok(uv.getX(i) >= 0 && uv.getX(i) <= 1 && uv.getY(i) >= 0 && uv.getY(i) <= 1, `${reference.id}: rear UV in real photo`);
    }
    const cap = shell.groups.find(group => group.materialIndex === 0);
    const shellPositions = shell.getAttribute('position');
    for (let i = cap.start; i < cap.start + cap.count; i++)
      assert.equal(shellPositions.getZ(i), 0, `${reference.id}: undercoat must not cover either photograph`);
    face.computeBoundingBox();
    assert.ok(face.boundingBox.max.x - face.boundingBox.min.x <= 0.651);
    results.push({ id: reference.id, category: reference.category, vertices: positions.count,
      outlinePoints: reference.outline.length, frontImage: reference.frontImage, rearImage: reference.rearImage });
    face.dispose(); shell.dispose(); rear.dispose();
  }
  await writeFile('evidence/unique-clothing-20260908/geometry-check.json', JSON.stringify({ pass: true, count: results.length, results }, null, 2));
  console.log(JSON.stringify({ pass: true, paired: results.length }));
} finally {
  await server.close();
}
