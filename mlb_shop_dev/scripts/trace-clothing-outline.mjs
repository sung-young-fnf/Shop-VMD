import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://localhost:5175');
  const outline = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/products/clothes/M26F3AMTV0164-front.png';
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 899; canvas.height = 1200;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const inside = (x, y) => {
      if (x < 0 || y < 0 || x >= 899 || y >= 1200) return false;
      const offset = (y * 899 + x) * 4;
      return data[offset + 3] >= 180 && data[offset] + data[offset + 1] + data[offset + 2] > 55;
    };
    let start;
    for (let y = 0; y < 1200 && !start; y++) for (let x = 0; x < 899; x++) if (inside(x, y)) { start = [x, y]; break; }
    if (!start) throw new Error('No garment silhouette');
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
      if (!next) throw new Error('Disconnected contour');
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
      return maximum > 2 ? [...simplify(points.slice(0, split + 1)).slice(0, -1), ...simplify(points.slice(split))] : [a, b];
    };
    const half = Math.floor(contour.length / 2);
    return [...simplify(contour.slice(0, half + 1)).slice(0, -1), ...simplify([...contour.slice(half), contour[0]]).slice(0, -1)];
  });
  await writeFile('evidence/clothes-fidelity-20260908/front-outline.json', JSON.stringify(outline));
  console.log(JSON.stringify(outline));
} finally {
  await browser.close();
}
