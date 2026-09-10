import * as THREE from "three";
import { clothingEvidence } from "../clothing-evidence";
import { pairedClothesCatalog } from "./clothes/catalog";

export function productEvidence(model: THREE.Object3D) {
	const materials = new Set<
		THREE.MeshStandardMaterial | THREE.MeshBasicMaterial
	>();
	const instances: string[] = [];
	const footwear: { slot: number; sku: string; fixture: string; bounds: unknown }[] = [];
	const clothing: NonNullable<ReturnType<typeof clothingEvidence>>[] = [];
	model.traverse((object) => {
		const shoes: unknown = object.userData["footwearPlacements"];
		if (Array.isArray(shoes)) for (const item of shoes) {
			if (typeof item?.slot === "number" && typeof item?.sku === "string") footwear.push({ slot: item.slot, sku: item.sku, fixture: String(object.userData["fixtureId"] ?? object.name), bounds: item.bounds });
		}
		const placement = clothingEvidence(object);
		if (placement) clothing.push(placement);
		const id: unknown = object.userData["productId"];
		if (typeof id === "string") instances.push(id);
		const batched: unknown = object.userData["batchedProductIds"];
		if (Array.isArray(batched))
			for (const value of batched)
				if (typeof value === "string") instances.push(value);
		if (!(object instanceof THREE.Mesh)) return;
		for (const material of Array.isArray(object.material)
			? object.material
			: [object.material])
			if (
				(material instanceof THREE.MeshStandardMaterial ||
					material instanceof THREE.MeshBasicMaterial) &&
				material.userData["referenceProduct"] === true
			)
				materials.add(material);
	});
	return {
		footwear,
		footwearSummary: { placements: footwear.length, distinctSkus: new Set(footwear.map(item => item.sku)).size },
		clothing,
		clothingSummary: {
			placements: clothing.length,
			distinctSkus: new Set(clothing.map((item) => item.productId)).size,
			repeatedPlacements: clothing.length - new Set(clothing.map((item) => item.productId)).size,
			verifiedPoolCount: pairedClothesCatalog.length,
			pairedPlacements: clothing.filter((item) => item.frontReady && item.rearReady).length,
		},
		instances: instances.length,
		productIds: [...new Set(instances)],
		materials: [...materials].map((material) => {
			const image: unknown = material.map?.image;
			return {
				productId: String(material.userData["productId"] ?? "shared-detail"),
				textured: material.map !== null,
				url:
					image instanceof HTMLImageElement
						? image.currentSrc || image.src
						: null,
				width: image instanceof HTMLImageElement ? image.naturalWidth : null,
				height: image instanceof HTMLImageElement ? image.naturalHeight : null,
				ready:
					material.map === null ||
					(image instanceof HTMLImageElement &&
						image.complete &&
						image.naturalWidth > 0),
			};
		}),
	};
}
