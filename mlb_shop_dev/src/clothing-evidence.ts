import * as THREE from "three";

export function clothingEvidence(object: THREE.Object3D) {
	const placementId: unknown = object.userData["clothingPlacementId"];
	if (typeof placementId !== "string") return null;
	const maps: HTMLImageElement[] = [];
	let meshCount = 0;
	let visible = object.visible;
	object.traverseAncestors((parent) => { visible &&= parent.visible; });
	object.traverse((child) => {
		if (!(child instanceof THREE.Mesh)) return;
		meshCount++;
		for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
			if (!(material instanceof THREE.MeshBasicMaterial || material instanceof THREE.MeshStandardMaterial)) continue;
			const image: unknown = material.map?.image;
			if (image instanceof HTMLImageElement) maps.push(image);
		}
	});
	const front: unknown = object.userData["frontImage"];
	const rear: unknown = object.userData["rearImage"];
	const frontMap = typeof front === "string" ? maps.find((image) => image.src.endsWith(front)) : undefined;
	const rearMap = typeof rear === "string" ? maps.find((image) => image.src.endsWith(rear)) : undefined;
	return {
		placementId,
		productId: String(object.userData["productId"]),
		kind: object.name.startsWith("reference-folded-") ? "folded" : "hanging",
		position: object.getWorldPosition(new THREE.Vector3()).toArray(),
		meshCount,
		visible,
		front: frontMap?.src ?? null,
		rear: rearMap?.src ?? null,
		frontReady: Boolean(frontMap?.complete && frontMap.naturalWidth > 0),
		rearReady: Boolean(rearMap?.complete && rearMap.naturalWidth > 0),
	};
}
