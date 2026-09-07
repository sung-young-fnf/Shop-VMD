import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { View } from "./catalog";

export function createCamera(canvas: HTMLCanvasElement) {
	const camera = new PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.05, 180);
	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	controls.dampingFactor = 0.1;
	controls.minDistance = 0.5;
	controls.maxDistance = 120;
	controls.maxPolarAngle = Math.PI * 0.49;
	const desiredPosition = new Vector3();
	const desiredTarget = new Vector3();
	let moving = false;
	let paused = false;
	controls.addEventListener("start", () => {
		moving = false;
	});
	function move(position: Vector3, target: Vector3) {
		desiredPosition.copy(position);
		desiredTarget.copy(target);
		moving = true;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			camera.position.copy(position);
			controls.target.copy(target);
			controls.update();
			moving = false;
		}
	}
	function preset(view: View) {
		const mobile = canvas.clientWidth <= 1000;
		const center = new Vector3(9.6, 0.8, 8);
		const presets = {
			diorama: new Vector3(-15.5, 23, 28.5),
			exterior: new Vector3(-26, 14, 26),
			interior: new Vector3(2.2, 1.75, 8.7),
			plan: new Vector3(9.6, 43, 8.01),
		};
		const target =
			view === "interior"
				? new Vector3(13, 1.3, 8.4)
				: view === "exterior"
					? new Vector3(4, 4.7, 8)
					: center;
		const position = presets[view];
		const compactScale = canvas.clientHeight <= 600 && canvas.clientWidth >= 600 ? 1.1 : Math.max(1.35, 900 / canvas.clientWidth);
		if (mobile && view !== "interior")
			position
				.sub(target)
				.multiplyScalar(compactScale)
				.add(target);
		move(position, target);
	}
	preset("diorama");
	camera.position.copy(desiredPosition);
	controls.target.copy(desiredTarget);
	controls.update();
	moving = false;
	return {
		canvas,
		camera,
		controls,
		preset,
		pause(value: boolean) { paused = value; moving = false; controls.enabled = !value; },
		snap(position: Vector3, target: Vector3) {
			moving = false;
			camera.position.copy(position);
			controls.target.copy(target);
			if (paused) camera.lookAt(target);
			else controls.update();
		},
		translate(offset: Vector3) {
			moving = false;
			camera.position.add(offset);
			controls.target.add(offset);
		},
		viewport(width: number, height: number, walking = false) {
			camera.aspect = width / height;
			if (walking) camera.clearViewOffset();
			else camera.setViewOffset(width, height, width > 1000 ? -80 : 0, width <= 1000 && !(height <= 600 && width >= 600) ? 65 : 0, width, height);
			camera.updateProjectionMatrix();
		},
		focus(
			target: Vector3,
			radius: number,
			direction: readonly [number, number, number],
		) {
			const distance =
				Math.max(4, Math.min(radius * 1.8, 22)) *
				(canvas.clientWidth <= 1000
					? Math.max(1.4, 800 / canvas.clientWidth)
					: 1);
			move(
				target.clone().add(new Vector3(...direction).multiplyScalar(distance)),
				target,
			);
		},
		zoom(factor: number) {
			const offset = camera.position
				.clone()
				.sub(controls.target)
				.multiplyScalar(factor);
			offset.clampLength(controls.minDistance, controls.maxDistance);
			move(controls.target.clone().add(offset), controls.target.clone());
		},
		update(delta: number) {
			if (paused) return false;
			if (moving) {
				const alpha = 1 - Math.exp(-6 * delta);
				camera.position.lerp(desiredPosition, alpha);
				controls.target.lerp(desiredTarget, alpha);
				if (
					camera.position.distanceTo(desiredPosition) < 0.012 &&
					controls.target.distanceTo(desiredTarget) < 0.012
				) {
					camera.position.copy(desiredPosition);
					controls.target.copy(desiredTarget);
					moving = false;
				}
			}
			const changed = controls.update();
			return moving || changed;
		},
		get settled() {
			return !moving;
		},
	};
}
