import * as THREE from "three";
import type { FloorPoint } from "./movement";

export function createWalkCollision(model: THREE.Object3D) {
	model.updateMatrixWorld(true);
	const meshes: { readonly mesh: THREE.Mesh; readonly bounds: THREE.Box3 }[] =
		[];
	model.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) return;
		const bounds = new THREE.Box3().setFromObject(object);
		if (bounds.min.y < 1.75 && bounds.max.y > 0.16)
			meshes.push({ mesh: object, bounds });
	});
	const ray = new THREE.Raycaster();
	const direction = new THREE.Vector3();
	const origin = new THREE.Vector3();
	const radius = 0.24;
	function canMove(from: FloorPoint, to: FloorPoint) {
		if (to.x < 0.5 || to.x > 18.65 || to.z < 2.6 || to.z > 15.4) return false;
		direction.set(to.x - from.x, 0, to.z - from.z);
		const distance = direction.length();
		if (distance < 1e-7) return true;
		direction.divideScalar(distance);
		const candidates = meshes.filter(
			({ bounds }) =>
				bounds.max.x >= Math.min(from.x, to.x) - radius &&
				bounds.min.x <= Math.max(from.x, to.x) + radius &&
				bounds.max.z >= Math.min(from.z, to.z) - radius &&
				bounds.min.z <= Math.max(from.z, to.z) + radius,
		);
		ray.near = 0;
		ray.far = distance + radius;
		for (const height of [0.25, 0.9, 1.55])
			for (const side of [-0.18, 0, 0.18]) {
				origin.set(
					from.x + direction.z * side,
					height,
					from.z - direction.x * side,
				);
				ray.set(origin, direction);
				for (const { mesh } of candidates)
					if (ray.intersectObject(mesh, false).length) return false;
			}
		return true;
	}
	return { canMove, meshCount: meshes.length };
}
