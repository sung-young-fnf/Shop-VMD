import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { createVisitor } from '../src/walk/visitor.ts';

// GLTFExporter uses the browser FileReader API only to package its untextured buffer.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(value => {
      this.result = `data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;
      this.onloadend?.();
    });
  }
};
const visitor = createVisitor();
const times = [0, .2, .4, .6, .8];
const tracks = [];
for (const side of [-1, 1]) for (const part of ['hip', 'knee', 'shoulder', 'elbow']) {
  const values = times.flatMap(time => {
    const swing = Math.sin(time / .8 * Math.PI * 2) * side;
    const angle = part === 'hip' ? swing * .48 : part === 'knee' ? Math.max(0, -swing) * .65 : part === 'shoulder' ? -swing * .38 : -.15 - Math.max(0, swing) * .2;
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(angle, 0, 0)).toArray();
  });
  tracks.push(new THREE.QuaternionKeyframeTrack(`${part}-${side}.quaternion`, times, values));
}
const clip = new THREE.AnimationClip('Walk', .8, tracks);
const output = await new GLTFExporter().parseAsync(visitor.root, { binary: true, animations: [clip] });
await mkdir('public/assets', { recursive: true });
await writeFile('public/assets/visitor.glb', Buffer.from(output));
visitor.dispose();
console.log(`visitor.glb: ${output.byteLength} bytes; articulated Walk clip; original procedural geometry`);
