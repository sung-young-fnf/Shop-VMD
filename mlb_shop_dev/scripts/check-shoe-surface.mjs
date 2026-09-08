import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  // Given the shoe's continuous surface factory, without a browser or texture loader.
  const module = await server.ssrLoadModule('/src/products/shoes/photo-shoe-geometry.ts');
  // When the real geometry is built.
  const surfaces = module.createShoeSurfaces();
  // Then material boundaries weld into one closed shell rather than detached cards.
  const edges = new Map();
  for (const { geometry } of surfaces) {
    const positions = geometry.getAttribute('position');
    const uv = geometry.getAttribute('uv');
    const index = geometry.index;
    const key = vertex => [positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex)].map(value => Math.round(value * 1e7)).join(',');
    for (let i = 0; i < positions.count; i++) {
      assert.ok([positions.getX(i), positions.getY(i), positions.getZ(i), uv.getX(i), uv.getY(i)].every(Number.isFinite));
      assert.ok(uv.getX(i) >= 0 && uv.getX(i) <= 1 && uv.getY(i) >= 0 && uv.getY(i) <= 1);
    }
    for (let i = 0; i < index.count; i += 3) {
      const triangle = [key(index.getX(i)), key(index.getX(i + 1)), key(index.getX(i + 2))];
      if (new Set(triangle).size < 3) continue;
      for (let side = 0; side < 3; side++) {
        const edge = [triangle[side], triangle[(side + 1) % 3]].sort().join('|');
        edges.set(edge, (edges.get(edge) ?? 0) + 1);
      }
    }
  }
  assert.equal([...edges.values()].filter(count => count !== 2).length, 0, 'Every nondegenerate edge must join exactly two faces');
  assert.deepEqual(new Set(surfaces.map(surface => surface.role)), new Set(['lateral', 'medial', 'top', 'heel', 'sole']));
  const sole = surfaces.find(surface => surface.role === 'sole').geometry;
  const solePositions = sole.getAttribute('position');
  const soleNormals = sole.getAttribute('normal');
  for (let i = 0; i < sole.index.count; i += 3) {
    const a = sole.index.getX(i), b = sole.index.getX(i + 1), c = sole.index.getX(i + 2);
    const abX = solePositions.getX(b) - solePositions.getX(a), abZ = solePositions.getZ(b) - solePositions.getZ(a);
    const acX = solePositions.getX(c) - solePositions.getX(a), acZ = solePositions.getZ(c) - solePositions.getZ(a);
    const abY = solePositions.getY(b) - solePositions.getY(a), acY = solePositions.getY(c) - solePositions.getY(a);
    const face = [abY * acZ - abZ * acY, abZ * acX - abX * acZ, abX * acY - abY * acX];
    assert.ok(face[1] <= 0, 'Every outsole face winds outward/down, including its collapsed poles');
    for (const vertex of [a, b, c]) assert.ok(face[0] * soleNormals.getX(vertex) + face[1] * soleNormals.getY(vertex) + face[2] * soleNormals.getZ(vertex) >= -1e-12, 'Shading normals stay in the outward face hemisphere');
  }
  for (const role of ['lateral', 'medial']) {
    const geometry = surfaces.find(surface => surface.role === role).geometry;
    const weights = geometry.getAttribute('shoeWeights');
    assert.ok(Array.from({ length: weights.count }, (_, i) => weights.getZ(i)).every(sign => sign === (role === 'lateral' ? 1 : 0)), 'Photo ownership remains stable at collapsed toe poles');
    const original = geometry.getAttribute('shoeSideUv');
    const moved = geometry.clone().translate(3, 2, 1).toNonIndexed().getAttribute('shoeSideUv');
    assert.deepEqual(Array.from(moved.array), Array.from(original.array), 'Store transforms preserve source UV coordinates');
  }
  const tongueModule = await server.ssrLoadModule('/src/products/shoes/photo-shoe-tongue.ts');
  const tongue = tongueModule.createShoeTongue();
  const tonguePositions = tongue.front.getAttribute('position');
  const layer = tonguePositions.count / 2;
  for (let vertex = 0; vertex < layer; vertex++) {
    assert.ok(Math.abs(tonguePositions.getY(vertex) - tonguePositions.getY(vertex + layer) - .0018) < 1e-7, 'Tongue backing follows the front with 1.8 mm thickness instead of descending into the insole');
  }
  console.log(JSON.stringify({ surfaces: surfaces.length, weldedEdges: edges.size, closedShell: true }));
} finally {
  await server.close();
}
