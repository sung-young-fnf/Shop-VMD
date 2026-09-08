import type * as THREE from "three";
import { pairedClothesCatalog } from "./products/clothes/catalog";

const bays = [
	["hg-a-0", 8], ["hg-a-1", 8], ["hg-b-0", 8], ["hg-b-1", 8],
	["hg-c-0", 8], ["hg-c-1", 8], ["hg-c-2", 8],
	["hg-d-0", 8], ["hg-d-1", 8], ["hg-d-2", 8],
	["hg-f-0", 20], ["hg-f-1", 20], ["hg-e", 4], ["showcase", 4],
	["w04-standard-01", 7], ["w04-standard-02", 7], ["w04-standard-03", 7],
] as const;

export const clothingSlots = bays.flatMap(([bay, count]) =>
	Array.from({ length: count }, (_, index) => `${bay}/${index}`),
);

export class ClothingAllocationError extends Error {
	constructor(readonly placementId: string) {
		super(`Cannot allocate verified paired clothing to ${placementId}`);
		this.name = "ClothingAllocationError";
	}
}

export function clothingAt(placementId: string): string {
	const slot = clothingSlots.indexOf(placementId);
	if (slot < 0 || pairedClothesCatalog.length === 0) throw new ClothingAllocationError(placementId);
	const reference = pairedClothesCatalog[slot % pairedClothesCatalog.length];
	if (!reference) throw new ClothingAllocationError(placementId);
	return reference.id;
}

export function detachClothing(group: THREE.Group): THREE.Object3D[] {
	const clothing: THREE.Object3D[] = [];
	group.traverse((object) => {
		if (object.name.startsWith("reference-garment-") || object.name.startsWith("reference-folded-")) clothing.push(object);
	});
	for (const object of clothing) {
		group.attach(object);
		group.remove(object);
	}
	return clothing;
}
