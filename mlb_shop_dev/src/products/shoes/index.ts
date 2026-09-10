import * as THREE from 'three';
import { cadPhotoProfiles } from './cad-photo-profiles';
import { createCadPhotoShoe } from './cad-photo-shoe';

const prototypes = new Map<string, THREE.Group>();

export function createShoe(index: number): THREE.Group {
  const normalized = Number.isFinite(index) ? Math.trunc(index) : 0;
  const profile = cadPhotoProfiles[((normalized % cadPhotoProfiles.length) + cadPhotoProfiles.length) % cadPhotoProfiles.length];
  if (!profile) throw new Error('No verified footwear profile is available');
  let prototype = prototypes.get(profile.sku);
  if (!prototype) {
    prototype = createCadPhotoShoe(profile);
    prototypes.set(profile.sku, prototype);
  }
  return prototype.clone(true);
}
