import * as THREE from "three";
import type { createCamera } from "../runtime/camera";
import { createWalkUI } from "../ui/walk-ui";
import { createWalkCollision } from "./collision";
import { createMovementInput } from "./input";
import { movementAxis, moveWithCollision } from "./movement";
import { createVisitor } from "./visitor";
import { createWalkCamera } from "./camera-rig";

export function createWalking(context: {
	readonly host: HTMLElement;
	readonly model: THREE.Group;
	readonly scene: THREE.Scene;
	readonly camera: ReturnType<typeof createCamera>;
	readonly changed: (active: boolean) => void;
}) {
	const { camera } = context;
	const input = createMovementInput(camera.canvas);
	const visitor = createVisitor();
	const collision = createWalkCollision(context.model);
	const rig = createWalkCamera(camera, context.model);
	const forward = new THREE.Vector3();
	const right = new THREE.Vector3();
	const displacement = new THREE.Vector3();
	const up = new THREE.Vector3(0, 1, 0);
	let active = false;
	let moving = false;
	let saved: {
		readonly position: THREE.Vector3;
		readonly target: THREE.Vector3;
		readonly aspect: number;
	} | null = null;
	visitor.root.visible = false;
	context.scene.add(visitor.root);
	const ui = createWalkUI(context.host, {
		toggle,
		press: input.press,
		release: input.release,
	});
	function toggle() {
		active = !active;
		input.setWalking(active);
		moving = false;
		visitor.root.visible = active;
		visitor.animate(0, false);
		if (active) {
			saved = {
				position: camera.camera.position.clone(),
				target: camera.controls.target.clone(),
				aspect: camera.camera.aspect,
			};
			visitor.root.position.set(2.4, 0.01, 8.55);
			visitor.root.rotation.y = Math.PI / 2;
			rig.enter(visitor.root.position);
			camera.canvas.focus({ preventScroll: true });
		} else if (saved) {
			rig.exit();
			const scale = Math.max(
				1,
				saved.aspect / (context.host.clientWidth / context.host.clientHeight),
			);
			camera.snap(
				saved.position
					.clone()
					.sub(saved.target)
					.multiplyScalar(scale)
					.add(saved.target),
				saved.target,
			);
			ui.focus();
		}
		camera.viewport(
			context.host.clientWidth,
			context.host.clientHeight,
			active,
		);
		ui.update(active);
		context.changed(active);
	}
	const events = new AbortController();
	function updateRig() {
		const changed = rig.update();
		visitor.root.visible = active && !rig.firstPerson;
		ui.perspective(rig.firstPerson);
		return changed;
	}
	window.addEventListener(
		"keydown",
		(event) => {
			if (
				event.key === "Escape" &&
				active &&
				!document.querySelector("dialog[open]")
			) {
				event.preventDefault();
				toggle();
			}
		},
		{ signal: events.signal },
	);
	return {
		get active() {
			return active;
		},
		stop() {
			if (active) toggle();
		},
		clear: input.clear,
		update(delta: number) {
			const cameraChanged = active && updateRig();
			const axis = movementAxis(input.read());
			const wasMoving = moving;
			moving = axis.x !== 0 || axis.z !== 0;
			if (!moving) {
				if (wasMoving) visitor.animate(0, false);
				return wasMoving || cameraChanged;
			}
			camera.camera.getWorldDirection(forward);
			forward.y = 0;
			if (forward.lengthSq() < 0.001) forward.set(0, 0, -1);
			forward.normalize();
			right.crossVectors(forward, up).normalize();
			const speed = active
				? 1.7
				: Math.min(
						12,
						Math.max(
							2,
							camera.camera.position.distanceTo(camera.controls.target) / 6,
						),
					);
			displacement
				.copy(forward)
				.multiplyScalar(axis.z)
				.addScaledVector(right, axis.x)
				.multiplyScalar(speed * delta);
			if (!active) {
				camera.translate(displacement);
				return true;
			}
			const origin = visitor.root.position;
			const next = moveWithCollision(origin, displacement, collision.canMove);
			displacement.set(next.x - origin.x, 0, next.z - origin.z);
			const distance = displacement.length();
			moving = distance > 0.00001;
			origin.add(displacement);
			if (moving) {
				const yaw = Math.atan2(displacement.x, displacement.z);
				visitor.root.rotation.y +=
					Math.atan2(
						Math.sin(yaw - visitor.root.rotation.y),
						Math.cos(yaw - visitor.root.rotation.y),
					) * Math.min(1, delta * 14);
				rig.translate(displacement);
			}
			visitor.animate(
				distance,
				matchMedia("(prefers-reduced-motion: reduce)").matches,
			);
			return updateRig() || moving || wasMoving || cameraChanged;
		},
		debug() {
			return {
				mode: active ? "walk" : "explore",
				position: visitor.root.position.toArray(),
				heading: visitor.root.rotation.y,
				moving,
				perspective: rig.firstPerson ? "first-person" : "third-person",
				collisionMeshes: collision.meshCount,
			};
		},
		dispose() {
			events.abort();
			input.dispose();
			rig.dispose();
			visitor.dispose();
			ui.dispose();
		},
	};
}
