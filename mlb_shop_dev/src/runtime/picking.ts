import * as THREE from "three";
import { zones } from "./catalog";
import type { ZoneId } from "./catalog";
export function bindPicking(
	scene: {
		readonly canvas: HTMLCanvasElement;
		readonly camera: THREE.Camera;
		readonly model: THREE.Object3D;
	},
	select: (zone: ZoneId, object?: THREE.Object3D) => void,
) {
	const raycaster = new THREE.Raycaster();
	const down = new THREE.Vector2();
	scene.canvas.addEventListener("pointerdown", (event) =>
		down.set(event.clientX, event.clientY),
	);
	scene.canvas.addEventListener("pointerup", (event) => {
		if (
			event.button !== 0 ||
			down.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 6
		)
			return;
		const rect = scene.canvas.getBoundingClientRect();
		raycaster.setFromCamera(
			new THREE.Vector2(
				((event.clientX - rect.left) / rect.width) * 2 - 1,
				(-(event.clientY - rect.top) / rect.height) * 2 + 1,
			),
			scene.camera,
		);
		for (const hit of raycaster.intersectObject(scene.model, true)) {
			let visible = hit.object.visible;
			hit.object.traverseAncestors((parent) => {
				if (!parent.visible) visible = false;
			});
			if (!visible) continue;
			let object: THREE.Object3D | null = hit.object;
			while (object) {
				const zone = zones.find(
					(item) => item.id === object?.userData["zoneId"],
				);
				if (zone) {
					select(
						zone.id,
						typeof object.userData["fixtureId"] === "string"
							? object
							: undefined,
					);
					return;
				}
				object = object.parent;
			}
		}
	});
}
