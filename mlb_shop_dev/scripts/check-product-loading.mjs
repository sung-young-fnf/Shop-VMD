import assert from 'node:assert/strict';
import { DefaultLoadingManager } from 'three';
import { awaitProductTextures, ProductTextureError } from '../src/products/loading.ts';

await awaitProductTextures();
DefaultLoadingManager.itemStart('/products/test-texture.png');
let finished = false;
const pending = awaitProductTextures().then(() => { finished = true; });
await Promise.resolve();
assert.equal(finished, false, 'Scene loading must wait for pending product textures');
DefaultLoadingManager.itemEnd('/products/test-texture.png');
await pending;
assert.equal(finished, true);
DefaultLoadingManager.itemStart('/products/missing.png');
DefaultLoadingManager.itemError('/products/missing.png');
DefaultLoadingManager.itemEnd('/products/missing.png');
await assert.rejects(awaitProductTextures(), ProductTextureError);
console.log('Product loading barrier: pending, completion, failure cases passed.');
