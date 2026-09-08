import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const category of ['caps', 'shoes']) {
    const page = await browser.newPage();
    // Given the representative SKU in the existing category factory.
    await page.goto(`http://localhost:5175/scripts/products-preview.html?category=${category}&index=0`);
    await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
    // When its real material and geometry evidence is collected.
    const product = await page.evaluate(() => window.__PRODUCT_EVIDENCE__);
    const photos = product.meshes.flatMap(mesh => mesh.materials).filter(material => material.map);
    // Then multiple source views preserve photographed appearance on bounded geometry.
    assert.ok(new Set(photos.map(material => material.map.url)).size >= 2, `${category} must use multiple real product views`);
    assert.ok(photos.every(material => material.userData.photoAppearance === true), `${category} photo materials must declare captured-lighting appearance`);
    assert.ok(product.bounds.size.every(value => value > .05 && value < .4));
    assert.ok(photos.every(material => material.map.width > 1000));
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto('http://localhost:5175/scripts/products-preview.html?category=caps&index=0');
  await page.waitForFunction(() => window.__PRODUCT_EVIDENCE__?.ready);
  const batching = await page.evaluate(async () => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const { createPhotoCap } = await import('/src/products/caps/photo-cap.ts');
    const cap = createPhotoCap();
    const crown = cap.getObjectByName('photo-front-crown');
    const source = crown.geometry.getAttribute('capSourcePosition');
    const transformed = crown.geometry.clone().applyMatrix4(new THREE.Matrix4().makeTranslation(3, 2, 1)).toNonIndexed();
    const originalIndex = crown.geometry.index.getX(0);
    return {
      preserved: transformed.getAttribute('capSourcePosition').getX(0) === source.getX(originalIndex),
      moved: Math.abs(transformed.getAttribute('position').getX(0) - source.getX(originalIndex) - 3) < .00001,
    };
  });
  assert.deepEqual(batching, { preserved: true, moved: true });
} finally {
  await browser.close();
}
