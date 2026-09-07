import * as THREE from "three";

export function productEvidence(model: THREE.Object3D) {
	const materials = new Set<THREE.MeshStandardMaterial>();
	const instances: string[] = [];
	model.traverse((object) => {
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
				material instanceof THREE.MeshStandardMaterial &&
				material.userData["referenceProduct"] === true
			)
				materials.add(material);
	});
	return {
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
