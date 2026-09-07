import * as THREE from 'three';

export function createMaterials() {
  return {
    wall: new THREE.MeshStandardMaterial({ color: '#eee9dc', roughness: 0.84 }),
    trim: new THREE.MeshStandardMaterial({ color: '#fff8e8', roughness: 0.7 }),
    roof: new THREE.MeshStandardMaterial({ color: '#364041', roughness: 0.52, metalness: 0.32 }),
    seam: new THREE.MeshStandardMaterial({ color: '#242c2d', roughness: 0.48, metalness: 0.4 }),
    wood: new THREE.MeshStandardMaterial({ color: '#77533a', roughness: 0.85 }),
    oak: new THREE.MeshStandardMaterial({ color: '#bd9565', roughness: 0.83 }),
    brick: new THREE.MeshStandardMaterial({ color: '#aa7962', roughness: 0.94 }),
    mortar: new THREE.MeshStandardMaterial({ color: '#c8b9a0', roughness: 1 }),
    stone: new THREE.MeshStandardMaterial({ color: '#cec5ad', roughness: 0.92 }),
    black: new THREE.MeshStandardMaterial({ color: '#222c2b', roughness: 0.47 }),
    glass: new THREE.MeshStandardMaterial({ color: '#8fa9a1', roughness: 0.19, metalness: 0.32, transparent: true, opacity: 0.68, emissive: '#ffb35d', emissiveIntensity: 0.08 }),
    floor: new THREE.MeshStandardMaterial({ color: '#c9ae81', roughness: 0.86 }),
    tile: new THREE.MeshStandardMaterial({ color: '#d9d3bc', roughness: 0.81 }),
    linen: new THREE.MeshStandardMaterial({ color: '#e8dfc7', roughness: 1 }),
    sage: new THREE.MeshStandardMaterial({ color: '#7f8b74', roughness: 1 }),
    terracotta: new THREE.MeshStandardMaterial({ color: '#b17155', roughness: 0.95 }),
    light: new THREE.MeshStandardMaterial({ color: '#fff0cd', emissive: '#ffbb66', emissiveIntensity: 0.3 }),
  };
}

export type HouseMaterials = ReturnType<typeof createMaterials>;
