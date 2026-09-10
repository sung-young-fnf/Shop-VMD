import { access, readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('evidence/shoe-cad-refresh/photo/model-candidates.json', 'utf8'));
const registrations = [
  ...JSON.parse(await readFile('evidence/shoe-cad-refresh/cad/registration.json', 'utf8')),
  ...JSON.parse(await readFile('evidence/shoe-cad-refresh/photo/registration-extra.json', 'utf8')),
];
const topRegistrations = [
  ...JSON.parse(await readFile('evidence/shoe-cad-refresh/cad/top-registration-anchors.json', 'utf8')),
  ...JSON.parse(await readFile('evidence/shoe-cad-refresh/photo/top-registration-extra.json', 'utf8')),
];
const [frontRegistrations, heelRegistrations] = await Promise.all([
  'evidence/shoe-cad-refinement/front/front-registrations.json',
  'evidence/shoe-cad-refinement/heel/heel-registrations.json',
].map(async path => JSON.parse(await readFile(path, 'utf8'))));

// Invert the observed bilinear source patch, without assigning an anatomical
// center to unmarked toe walls. Only explicit wrap/badge landmarks locate apex.
function frontApexAcross(front) {
  const feature = front.visibleForemostFeature;
  if (!feature || !/MLB|raised gum wrap|central toe wrap|vertically grooved/i.test(feature.feature)) return .5;
  const q = front.quad, point = feature.cropPixel;
  let u = .5, v = .5;
  for (let i = 0; i < 12; i++) {
    const p = [0, 1].map(axis => (1-u)*(1-v)*q[0][axis]+u*(1-v)*q[1][axis]+u*v*q[2][axis]+(1-u)*v*q[3][axis]);
    const du = [0, 1].map(axis => (1-v)*(q[1][axis]-q[0][axis])+v*(q[2][axis]-q[3][axis]));
    const dv = [0, 1].map(axis => (1-u)*(q[3][axis]-q[0][axis])+u*(q[2][axis]-q[1][axis]));
    const det = du[0]*dv[1]-du[1]*dv[0];
    if (Math.abs(det) < 1e-8) return .5;
    const x = point[0]-p[0], y = point[1]-p[1];
    u += (x*dv[1]-y*dv[0])/det;
    v += (du[0]*y-du[1]*x)/det;
  }
  return Number.isFinite(u) && u >= .025 && u <= .975 && v >= 0 && v <= 1 ? Number(u.toFixed(6)) : .5;
}
const refinedTops = JSON.parse(await readFile('evidence/shoe-cad-refinement/top-registrations.json', 'utf8'));
const bodyContour = JSON.parse(await readFile('evidence/shoe-cad-refinement/bump-body-contour.json', 'utf8'));
const assetPaths = [];
const profiles = candidates.map(candidate => {
  const registration = registrations.find(item => item.sku === candidate.sku);
  let topRegistration = topRegistrations.find(item => item.sku === candidate.sku)?.anchors;
  const refinedTop = refinedTops.find(item => item.sku === candidate.sku && item.admitted)?.views.top;
  if (refinedTop && topRegistration) {
    const prior = registration.views.top;
    topRegistration = topRegistration.map(([u, v], i, all) => [u, i === 0 ? 0 : i === all.length - 1 ? 1 : (prior.start + (prior.end - prior.start) * v - refinedTop.start) / (refinedTop.end - refinedTop.start)]);
  }
  if (!registration) throw new Error(`No verified registration: ${candidate.sku}`);
  if (!topRegistration || topRegistration.some((point, index) => !point.every(Number.isFinite) || index > 0 && (point[0] <= topRegistration[index - 1][0] || point[1] <= topRegistration[index - 1][1]))) throw new Error(`Invalid top correspondence ${candidate.sku}`);
  const views = {};
  for (const role of ['lateral', 'medial', 'top', 'heel', 'sole']) {
    const source = role === 'top' && refinedTop ? refinedTop : registration.views[role];
    if (!source || source.low.length !== source.high.length || source.low.length < 10) throw new Error(`Missing contour ${candidate.sku} ${role}`);
    if (!Number.isFinite(source.start) || !Number.isFinite(source.end) || source.start === source.end) throw new Error(`Invalid span ${candidate.sku} ${role}`);
    for (let i = 0; i < source.low.length; i++) {
      if (![source.low[i], source.high[i]].every(Number.isFinite) || source.low[i] >= source.high[i]) throw new Error(`Invalid trace ${candidate.sku} ${role} ${i}`);
    }
    views[role] = { path: `shoes/cad-photo/${candidate.sku}-${role}.jpg`, width: source.width, height: source.height, start: source.start, end: source.end, low: source.low, high: source.high };
  }
  const front = frontRegistrations.find(item => item.sku === candidate.sku);
  const heel = heelRegistrations.find(item => item.sku === candidate.sku);
  if (!front || !heel?.rear?.asset) throw new Error(`Missing observed endcap descriptors/assets: ${candidate.sku}`);
  if (front.quad.length !== 4 || front.quad.some(point => point.length !== 2 || !point.every(Number.isFinite))) throw new Error(`Invalid front quad: ${candidate.sku}`);
  const rear = heel.rear;
  for (const value of [heel.upperHeelU, heel.topHeelBodyY, heel.sideGroundY, rear.centerX, rear.groundY, rear.bodyTopY, rear.pixelsPerShoeLengthX, rear.pixelsPerShoeLengthY]) {
    if (!Number.isFinite(value)) throw new Error(`Invalid heel scalar: ${candidate.sku}`);
  }
  if (rear.pixelsPerShoeLengthX <= 0 || rear.pixelsPerShoeLengthY <= 0 || rear.groundY <= rear.bodyTopY) throw new Error(`Invalid heel projection scale: ${candidate.sku}`);
  if (!heel.topUpperHeelRows.length || heel.topUpperHeelRows.some(row => row.length !== 3 || !row.every(Number.isFinite) || row[1] >= row[2])) throw new Error(`Invalid upper heel rows: ${candidate.sku}`);
  const frontPath = front.source.replace(/^products\//, '');
  const heelPath = rear.asset.path.replace(/^products\//, '');
  assetPaths.push(`public/products/${frontPath}`, `public/products/${heelPath}`);
  const samplingQuad = candidate.sku === bodyContour.sku && bodyContour.frontSamplingQuad ? bodyContour.frontSamplingQuad : front.quad;
  const endcaps = {
    upperHeelU: heel.upperHeelU,
    ...(candidate.sku === bodyContour.sku ? {upperBodyRows: bodyContour.upperBodyRows, ...(bodyContour.medialLowerRows ? {sideLowerRows: {lateral: [...bodyContour.lateralLowerRows].sort((a,b)=>a[0]-b[0]), medial: [...bodyContour.medialLowerRows].sort((a,b)=>a[0]-b[0])}} : {})} : {}),
    topHeelBodyY: heel.topHeelBodyY,
    topUpperHeelRows: heel.topUpperHeelRows,
    sideGroundY: heel.sideGroundY,
    sideCollarCrestPx: heel.sideCollarCrestPx,
    sideUpperBackPx: heel.sideUpperBackPx,
    front: { path: frontPath, width: front.width, height: front.height, quad: samplingQuad, apexAcross: frontApexAcross({...front, quad: samplingQuad}) },
    heel: { path: heelPath, width: rear.asset.width, height: rear.asset.height, centerX: rear.centerX, groundY: rear.groundY, bodyTopY: rear.bodyTopY, outlineRows: rear.outlineRows, pixelsPerShoeLengthX: rear.pixelsPerShoeLengthX, pixelsPerShoeLengthY: rear.pixelsPerShoeLengthY },
  };
  return {
    sku: candidate.sku, name: candidate.cadName, family: candidate.cadFamily,
    length: .3, cad: `products/shoes/cad/${candidate.sku}.jpg`, source: `products/shoes/cad-photo/${candidate.sku}-lateral.jpg`, views, topRegistration, endcaps,
    notes: '사진에 보이는 외측·내측·윗면·뒤축·밑창을 재구성했습니다. 곡률과 30cm 진열 크기는 실측이 아닙니다. 입구는 사진에서 보이는 얕은 면까지이며, 숨은 내부 깊이·소재 두께는 제작하지 않았습니다. 촬영 명암이 포함되어 있습니다.',
  };
});
await Promise.all(assetPaths.map(path => access(path)));
await writeFile('src/products/shoes/cad-photo-profiles.ts', `// Generated from verified photo registrations. Run node scripts/build-shoe-cad-profiles.mjs.\nimport type { CadPhotoProfile } from './cad-photo-types';\n\nexport const cadPhotoProfiles = ${JSON.stringify(profiles, null, 2)} as const satisfies readonly CadPhotoProfile[];\n`);
console.log(`Generated ${profiles.length} independently registered shoe profiles`);
