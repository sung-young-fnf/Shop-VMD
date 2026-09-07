import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const output = 'public/materials/image-variant';
const evidence = 'evidence/image-variant';
await mkdir(output, { recursive: true });
await mkdir(evidence, { recursive: true });
const maps = [];

function joinEdges(data, size) {
  const band = Math.round(size * 0.12);
  for (let axis = 0; axis < 2; axis++) {
    for (let row = 0; row < size; row++) {
      for (let distance = 0; distance < band; distance++) {
        const blend = 0.5 * (1 - distance / band) ** 2;
        const first = axis === 0 ? row * size + distance : distance * size + row;
        const last = axis === 0 ? row * size + size - 1 - distance : (size - 1 - distance) * size + row;
        for (let channel = 0; channel < 3; channel++) {
          const a = data[first * 3 + channel];
          const b = data[last * 3 + channel];
          data[first * 3 + channel] = Math.round(a * (1 - blend) + b * blend);
          data[last * 3 + channel] = Math.round(b * (1 - blend) + a * blend);
        }
      }
    }
  }
}

for (const material of ['cloth', 'embroidery']) {
  for (const channel of ['albedo', 'roughness', 'normal', 'ao']) {
    const source = material === 'cloth'
      ? channel === 'albedo' ? 'public/materials/twill/delit.png' : `public/materials/twill/cap-fabric_${channel}.png`
      : `public/materials/embroidery/embroidery_${channel}.png`;
    const original = await readFile(source);
    const size = material === 'cloth' ? 1024 : 1024;
    const data = await sharp(original).resize(size, size, { fit: 'fill' }).removeAlpha().toColourspace('srgb').raw().toBuffer();
    if (material === 'cloth') joinEdges(data, size);
    if (channel === 'roughness') {
      for (let i = 0; i < data.length; i++) data[i] = Math.round(230 + data[i] / 255 * 20);
      assert.ok(Math.min(...new Set(data)) >= 230 && Math.max(...new Set(data)) <= 250);
    }
    if (channel === 'normal') {
      for (let i = 0; i < data.length; i += 3) {
        const x = data[i] / 127.5 - 1;
        const y = data[i + 1] / 127.5 - 1;
        const z = data[i + 2] / 127.5 - 1;
        const length = Math.hypot(x, y, z) || 1;
        data[i] = Math.round((x / length + 1) * 127.5);
        data[i + 1] = Math.round((y / length + 1) * 127.5);
        data[i + 2] = Math.round((z / length + 1) * 127.5);
      }
    }
    let edgeError = 0;
    if (material === 'cloth') {
      for (let row = 0; row < size; row++) {
        for (let c = 0; c < 3; c++) {
          edgeError = Math.max(edgeError, Math.abs(data[(row * size) * 3 + c] - data[(row * size + size - 1) * 3 + c]));
          edgeError = Math.max(edgeError, Math.abs(data[row * 3 + c] - data[((size - 1) * size + row) * 3 + c]));
        }
      }
      assert.equal(edgeError, 0, `${channel} opposite edge continuity`);
    }
    const destination = `${output}/${material}-${channel}.png`;
    await sharp(data, { raw: { width: size, height: size, channels: 3 } }).png().toFile(destination);
    const file = await readFile(destination);
    assert.deepEqual(await readFile(source), original, 'source preserved');
    maps.push({ material, channel, source, sourceSHA256: createHash('sha256').update(original).digest('hex'), destination, sha256: createHash('sha256').update(file).digest('hex'), size, colorSpace: channel === 'albedo' ? 'SRGBColorSpace' : 'NoColorSpace', uvChannel: 0, oppositeEdgeMaxError: material === 'cloth' ? edgeError : null });
  }
}
await writeFile(`${evidence}/texture-manifest.json`, JSON.stringify({
  maps,
  cloth: { sourceNativePixels: [153, 156], repeatWorldUnits: 0.6, method: 'Actual delit photo albedo and independent reference-extracted normal, AO, roughness; symmetric 12% edge blend; normal renormalization.' },
  embroidery: { sourceNativePixels: [125, 151], uv: 'x/125,1-y/151', method: 'Independent reference-extracted maps, original normalized photo coordinates; geometry supplies silhouette.' },
  material: { metalness: 0, roughnessFactor: 0.97, roughnessRange: [230 / 255 * 0.97, 250 / 255 * 0.97], sheen: 0, clearcoat: 0, aoChannel: 0 },
  limitations: ['Single image inferred PBR, not measured scan.', 'Upsampling adds no detail; 12% boundary blend softens tile edges.', 'Same observed cloth extrapolated to hidden surfaces and brim.', 'Photo-derived embroidery may retain residual photographed lighting.', 'Integration and visual QA remain parent responsibilities.'],
}, null, 2));
