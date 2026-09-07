import * as THREE from 'three';
import { materials } from './parts';

const pixels = new Uint8Array(64 * 64 * 4);
for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
  const dx = Math.max(Math.abs(x - 32) - 12, 0);
  const hole = dx * dx + (y - 32) ** 2 < 17 ** 2;
  const offset = (y * 64 + x) * 4;
  pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = hole ? 0 : 255;
  pixels[offset + 3] = 255;
}
const alpha = new THREE.DataTexture(pixels, 64, 64);
alpha.wrapS = alpha.wrapT = THREE.RepeatWrapping;
alpha.magFilter = THREE.LinearFilter;
alpha.needsUpdate = true;
export const perforation = materials.metal.clone();
perforation.alphaMap = alpha;
perforation.alphaTest = 0.5;
perforation.side = THREE.DoubleSide;
export const bluePerforation = perforation.clone();
bluePerforation.color.copy(materials.blue.color);
const diamondPixels = new Uint8Array(64 * 64 * 4);
for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
  const gap = Math.abs(Math.abs(x - 32) + Math.abs(y - 32) - 32) > 3;
  const offset = (y * 64 + x) * 4;
  diamondPixels[offset] = diamondPixels[offset + 1] = diamondPixels[offset + 2] = gap ? 0 : 255;
  diamondPixels[offset + 3] = 255;
}
const diamondAlpha = new THREE.DataTexture(diamondPixels, 64, 64);
diamondAlpha.wrapS = diamondAlpha.wrapT = THREE.RepeatWrapping;
diamondAlpha.needsUpdate = true;
export const expandedMesh = perforation.clone();
expandedMesh.alphaMap = diamondAlpha;

export function perforatedPanel(width: number, height: number, material = perforation): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(width, height);
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * width / 0.06, uv.getY(i) * height / 0.038);
  return new THREE.Mesh(geometry, material);
}
export function curvedPanel(radius: number): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, 2.44, 48, 1, true, Math.PI, Math.PI / 2);
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * radius * Math.PI / 0.12, uv.getY(i) * 2.44 / 0.038);
  const mesh = new THREE.Mesh(geometry, perforation);
  mesh.position.set(1.5, 1.24, 1.5);
  return mesh;
}
