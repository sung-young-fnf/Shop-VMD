import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const manifestPath = process.argv[2] ?? 'evidence/unique-clothing-20260908/sources.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const sources = Array.isArray(manifest) ? manifest : manifest.entries;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = [];
const evidence = [];
try {
  const page = await browser.newPage();
  for (const source of sources) {
    if (source.id === 'M26F3AMTV0164') continue;
    const photos = [];
    for (const role of ['front', 'rear']) {
      const file = source[role].path;
      const data = await readFile(file);
      const photo = await page.evaluate(async ({ base64 }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = 450;
        canvas.height = Math.round(450 * image.height / image.width);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        const width = canvas.width, height = canvas.height;
        const mask = new Uint8Array(width * height);
        // Opaque garment pixels exclude the transparent cast shadow without deleting dark cloth.
        for (let i = 0; i < mask.length; i++)
          mask[i] = data[i * 4 + 3] >= 220 && data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2] > 35 ? 1 : 0;
        let largest = [];
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] !== 1) continue;
          const component = [i];
          mask[i] = 2;
          for (let n = 0; n < component.length; n++) {
            const p = component[n], x = p % width, y = Math.floor(p / width);
            for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
              const next = ny * width + nx;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height && mask[next] === 1) {
                mask[next] = 2;
                component.push(next);
              }
            }
          }
          if (component.length > largest.length) largest = component;
        }
        mask.fill(0);
        for (const i of largest) mask[i] = 1;
        const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] === 1;
        const firstPixel = Math.min(...largest.slice(0, 100000));
        const start = [firstPixel % width, Math.floor(firstPixel / width)];
        const neighbors = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
        const contour = [];
        let point = start, back = [start[0] - 1, start[1]], first;
        for (let step = 0; step < 40000; step++) {
          const begin = neighbors.findIndex(([x, y]) => point[0] + x === back[0] && point[1] + y === back[1]);
          let next;
          for (let n = 1; n <= 8; n++) {
            const index = (begin + n) % 8;
            const [x, y] = neighbors[index];
            if (inside(point[0] + x, point[1] + y)) {
              next = [point[0] + x, point[1] + y];
              const previous = neighbors[(index + 7) % 8];
              back = [point[0] + previous[0], point[1] + previous[1]];
              break;
            }
          }
          if (!next) throw new Error('Disconnected garment contour');
          if (first && point[0] === start[0] && point[1] === start[1] && next[0] === first[0] && next[1] === first[1]) break;
          first ??= next;
          contour.push(point);
          point = next;
          if (step === 39999) throw new Error('Contour did not close');
        }
        const simplify = points => {
          const a = points[0], b = points.at(-1);
          const dx = b[0] - a[0], dy = b[1] - a[1], length = dx * dx + dy * dy;
          let maximum = 0, split = 0;
          for (let i = 1; i < points.length - 1; i++) {
            const p = points[i];
            const t = length ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length)) : 0;
            const distance = Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dy * t);
            if (distance > maximum) { maximum = distance; split = i; }
          }
          return maximum > 1.2 ? [...simplify(points.slice(0, split + 1)).slice(0, -1), ...simplify(points.slice(split))] : [a, b];
        };
        const half = Math.floor(contour.length / 2);
        const outline = [...simplify(contour.slice(0, half + 1)).slice(0, -1), ...simplify([...contour.slice(half), contour[0]]).slice(0, -1)];
        const xs = outline.map(p => p[0]), ys = outline.map(p => p[1]);
        const bounds = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
        const channels = [[], [], []];
        for (let i = 0; i < largest.length; i += 13)
          for (let channel = 0; channel < 3; channel++) channels[channel].push(data[largest[i] * 4 + channel]);
        const color = '#' + channels.map(values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)].toString(16).padStart(2, '0')).join('');
        if (outline.length < 6 || largest.length < 1000 || bounds[0] === 0 || bounds[2] === width - 1)
          throw new Error('Invalid or edge-clipped garment silhouette');
        return { outline, width, height, bounds, color, pixels: largest.length };
      }, { base64: data.toString('base64') });
      photos.push(photo);
    }
    const [front, rear] = photos;
    const [fx0, fy0, fx1, fy1] = front.bounds;
    const [rx0, ry0, rx1, ry1] = rear.bounds;
    const targetHeight = { tee: 0.58, sweatshirt: 0.6, hoodie: 0.64, shirt: 0.63, jacket: 0.65, pants: 0.8, shorts: 0.44, skirt: 0.5, dress: 0.8 }[source.category] ?? 0.6;
    const uScale = (rx1 - rx0) / rear.width / ((fx1 - fx0) / front.width);
    const vScale = (ry1 - ry0) / rear.height / ((fy1 - fy0) / front.height);
    records.push({
      id: source.id, color: front.color, view: 'front', category: source.category,
      frontImage: source.frontImage ?? path.basename(source.front.path),
      rearImage: source.rearImage ?? path.basename(source.rear.path),
      maxBulge: ['jacket', 'hoodie', 'sweatshirt'].includes(source.category) ? 0.025 : 0.015,
      analysis: { width: front.width, height: front.height, top: fy0, scale: Math.min(targetHeight / (fy1 - fy0), 0.65 / (fx1 - fx0)) },
      rearProjection: { uScale, uOffset: rx0 / rear.width - (1 - fx1 / front.width) * uScale,
        vScale, vOffset: 1 - ry1 / rear.height - (1 - fy1 / front.height) * vScale },
      outline: front.outline,
    });
    evidence.push({ id: source.id, front, rear, alignment: 'rear mirrored-front bounding-box affine; side/depth inferred' });
  }
  await writeFile('src/products/clothes/source-catalog.ts', 'import type { GarmentReference } from "./catalog";\n\n// Generated measured photo contours; each row is one SKU reference.\nexport const sourcedClothesCatalog: readonly GarmentReference[] = [\n' + records.map(record => JSON.stringify(record)).join(',\n') + '\n];\n');
  await writeFile('evidence/unique-clothing-20260908/geometry-traces.json', JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify({ generated: records.length }));
} finally {
  await browser.close();
}
