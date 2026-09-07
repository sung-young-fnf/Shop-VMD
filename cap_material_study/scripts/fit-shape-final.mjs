import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const output = 'evidence/blockout/fit-final';
await fs.mkdir(output, { recursive: true });
const size = 224;
async function foreground(input, transparent) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const mask = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (Math.floor(y * info.height / size) * info.width + Math.floor(x * info.width / size)) * 4;
    mask[y * size + x] = transparent ? data[i + 3] > 24 : Math.hypot(255 - data[i], 255 - data[i + 1], 255 - data[i + 2]) > 24;
  }
  const seen = new Uint8Array(mask.length);
  let largest = [];
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i] || seen[i]) continue;
    const stack = [i], blob = [];
    seen[i] = 1;
    while (stack.length) {
      const index = stack.pop();
      blob.push(index);
      const x = index % size, y = Math.floor(index / size);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = ny * size + nx;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size && mask[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
      }
    }
    if (blob.length > largest.length) largest = blob;
  }
  mask.fill(0);
  for (const index of largest) mask[index] = 1;
  return mask;
}
const reference = await foreground('public/reference/cap-object.png', true);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 899, height: 1200 } });
await page.goto('http://127.0.0.1:5186/?capture=1&pass=blockout', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.capStudy?.ready);
const trials = [];
for (const power of [1.85, 1.95, 2.05]) for (const radius of [0.96, 0.98, 1]) for (const depth of [1.04, 1.08, 1.12]) {
  const parameters = { power, radius, depth };
  await page.evaluate(({ power, radius, depth }) => {
    const studio = window.capStudy;
    studio.model.position.x = 0.09;
    const geometry = studio.model.getObjectByName('crown-surface').geometry;
    const positions = geometry.attributes.position, uv = geometry.attributes.uv;
    for (let i = 0; i < positions.count; i++) {
      const theta = uv.getX(i) * Math.PI * 2, t = uv.getY(i);
      const r = radius * Math.sqrt(Math.max(0, 1 - t ** power));
      positions.setXYZ(i, r * Math.sin(theta), 1.35 * t + .30 * Math.max(0, Math.cos(theta)) * (1 - t) ** 1.5, depth * r * Math.cos(theta));
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    studio.renderer.render(studio.scene, studio.camera);
  }, parameters);
  const png = await page.locator('canvas').screenshot();
  const mask = await foreground(png, false);
  let intersection = 0, union = 0;
  for (let i = 0; i < mask.length; i++) { intersection += Boolean(mask[i] && reference[i]); union += Boolean(mask[i] || reference[i]); }
  const file = `${output}/candidate-${trials.length}.png`;
  await fs.writeFile(file, png);
  trials.push({ ...parameters, approximateIoU: intersection / union, file });
}
await browser.close();
trials.sort((a, b) => b.approximateIoU - a.approximateIoU);
await fs.writeFile(`${output}/trials.json`, JSON.stringify(trials, null, 2));
console.log(JSON.stringify(trials.slice(0, 3)));
for (const candidate of trials.slice(0, 3)) {
  const result = spawnSync('python', ['C:/Users/AC1143/.codex/skills/img2threejs/forge/stage4_review/diagnose_render.py', '--reference', 'public/reference/cap-object.png', '--render', candidate.file, '--spec', 'object-sculpt-spec.json', '--pass-id', 'blockout', '--map-stripped-render', candidate.file, '--json'], { encoding: 'utf8', env: { ...process.env, PYTHONUTF8: '1' } });
  await fs.writeFile(candidate.file.replace('.png', '-diagnostic.json'), result.stdout);
  console.log(JSON.stringify({ candidate, exitCode: result.status, output: result.stdout, stderr: result.stderr }));
}
