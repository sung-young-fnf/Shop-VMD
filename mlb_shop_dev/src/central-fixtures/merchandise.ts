import * as THREE from "three";
import { createHeadwear as createCap } from "../products/caps/assortment";
import { createFoldedGarment, createGarment } from "../products/clothes";
import { clothingAt } from "../clothing-placement";
import { placeCapOnSupport } from "../products/caps/placement";

export function garments(count: number, length: number, bay: string): THREE.Group {
	const group = new THREE.Group();
	group.userData["referenceMerchandise"] = true;
	for (let index = 0; index < count; index++) {
		const placementId = `${bay}/${index}`;
		const garment = createGarment(clothingAt(placementId));
		garment.userData["clothingPlacementId"] = placementId;
		garment.rotation.y = Math.PI / 2;
		garment.position.x = (index / Math.max(1, count - 1) - 0.5) * length;
		group.add(garment);
	}
	return group;
}

export function foldedProducts(bay: string): THREE.Group {
	const group = new THREE.Group();
	group.userData["referenceMerchandise"] = true;
	for (const [index, x, z] of [
		[0, -0.27, -0.37],
		[1, 0.27, -0.36],
		[2, -0.27, 0.3],
		[3, 0.27, 0.3],
	] as const) {
		const placementId = `${bay}/${index}`;
		const folded = createFoldedGarment(clothingAt(placementId));
		folded.userData["clothingPlacementId"] = placementId;
		folded.position.set(x, 0, z);
		const cap = createCap(index);
		placeCapOnSupport(cap, { x, top: new THREE.Box3().setFromObject(folded).max.y, z });
		group.add(folded, cap);
	}
	return group;
}
