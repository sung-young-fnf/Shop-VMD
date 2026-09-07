import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { createCamera } from "../runtime/camera";

export function createWalkCamera(
	camera: ReturnType<typeof createCamera>,
	model: THREE.Group,
) {
	const orbit = camera.camera.clone();
	const controls = new OrbitControls(orbit, camera.canvas);
	controls.enabled = false;
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.minDistance = 2.3;
	controls.maxDistance = 6;
	controls.maxPolarAngle = Math.PI * 0.49;
	const ray = new THREE.Raycaster();
	const offset = new THREE.Vector3();
	const eye = new THREE.Vector3();
	const target = new THREE.Vector3();
	const forward = new THREE.Vector3();
	const originalFov = camera.camera.fov;
	let dirty = true;
	let firstPerson = false;
	return {
		enter(position: THREE.Vector3) {
			camera.pause(true);
			camera.camera.fov = 60;
			controls.target.copy(position).add(new THREE.Vector3(0, 0.94, 0));
			orbit.position
				.copy(controls.target)
				.add(new THREE.Vector3(-2, 1.35, 1.4));
			controls.update();
			controls.enabled = true;
			dirty = true;
		},
		exit() {
			controls.enabled = false;
			camera.pause(false);
			camera.camera.fov = originalFov;
		},
		translate(delta: THREE.Vector3) {
			orbit.position.add(delta);
			controls.target.add(delta);
			dirty = true;
		},
		update() {
			const changed = controls.update();
			if (!changed && !dirty) return false;
			offset.copy(orbit.position).sub(controls.target);
			const distance = offset.length();
			ray.set(controls.target, offset.clone().normalize());
			ray.near = 0.02;
			ray.far = distance;
			const hit = ray.intersectObject(model, true).find((intersection) => {
				let visible = intersection.object.visible;
				intersection.object.traverseAncestors((parent) => {
					if (!parent.visible) visible = false;
				});
				return visible;
			});
			firstPerson = Boolean(hit && hit.distance < 1.35);
			if (firstPerson) {
				eye.copy(controls.target).add(new THREE.Vector3(0, 0.7, 0));
				orbit.getWorldDirection(forward);
				forward.y = 0;
				forward.normalize();
				target.copy(eye).add(forward);
			} else {
				eye
					.copy(controls.target)
					.add(
						offset.setLength(
							hit ? Math.max(0.2, hit.distance - 0.16) : distance,
						),
					);
				target.copy(controls.target);
			}
			camera.snap(eye, target);
			dirty = false;
			return true;
		},
		get firstPerson() {
			return firstPerson;
		},
		dispose() {
			controls.dispose();
		},
	};
}
