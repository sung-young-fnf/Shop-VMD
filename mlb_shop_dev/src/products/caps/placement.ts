import * as THREE from 'three';

type CapSupport = { readonly x: number; readonly z: number; readonly top: number; readonly width?: number; readonly depth?: number };

export class CapPlacementError extends Error {
  constructor(readonly reason: 'attached-cap' | 'missing-folded-support') {
    super(reason === 'attached-cap' ? 'Place caps before attaching them to a fixture' : 'Showcase cap requires its folded clothing support');
    this.name = 'CapPlacementError';
  }
}

/** Place an unattached cap by its transformed bounds, without flattening its shape. */
export function placeCapOnSupport(cap: THREE.Group, support: CapSupport): void {
  if (cap.parent) throw new CapPlacementError('attached-cap');
  cap.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(cap);
  const size = bounds.getSize(new THREE.Vector3());
  const fit = Math.min(1, (support.width ?? size.x) / size.x, (support.depth ?? size.z) / size.z);
  cap.scale.multiplyScalar(fit);
  cap.updateMatrixWorld(true);
  bounds.setFromObject(cap);
  const center = bounds.getCenter(new THREE.Vector3());
  cap.position.add(new THREE.Vector3(support.x - center.x, support.top + .001 - bounds.min.y, support.z - center.z));
}
