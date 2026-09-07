import * as THREE from "three";
import { createCap } from "../products/caps";
import { createFoldedGarment, createGarment } from "../products/clothes";

export function garments(count: number, length: number): THREE.Group {
	const group = new THREE.Group();
	group.userData["referenceMerchandise"] = true;
	for (let index = 0; index < count; index++) {
		const garment = createGarment(index);
		garment.rotation.y = Math.PI / 2;
		garment.position.x = (index / Math.max(1, count - 1) - 0.5) * length;
		group.add(garment);
	}
	return group;
}

export function foldedProducts(): THREE.Group {
	const group = new THREE.Group();
	group.userData["referenceMerchandise"] = true;
	for (const [index, x, z] of [
		[0, -0.27, -0.37],
		[1, 0.27, -0.36],
		[2, -0.27, 0.3],
		[3, 0.27, 0.3],
	] as const) {
		const folded = createFoldedGarment(index);
		folded.position.set(x, 0, z);
		const cap = createCap(index);
		cap.position.set(x, 0.045, z);
		group.add(folded, cap);
	}
	return group;
}
