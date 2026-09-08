import * as THREE from "three";
import { detachClothing } from "../clothing-placement";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { materials } from "./primitives";

const pixels = new Uint8Array(64 * 32 * 4);
for (let y = 0; y < 32; y++) {
	for (let x = 0; x < 64; x++) {
		const distance = Math.min(
			Math.abs(((x / 2 + y) % 32) - 16),
			Math.abs(((x / 2 - y + 64) % 32) - 16),
		);
		const value = distance < 1.6 ? 255 : 0;
		const index = (y * 64 + x) * 4;
		pixels.set([value, value, value, 255], index);
	}
}
const meshAlpha = new THREE.DataTexture(pixels, 64, 32);
meshAlpha.wrapS = THREE.RepeatWrapping;
meshAlpha.wrapT = THREE.RepeatWrapping;
meshAlpha.magFilter = THREE.LinearFilter;
meshAlpha.needsUpdate = true;
const meshMaterial = new THREE.MeshStandardMaterial({
	color: "#727a73",
	alphaMap: meshAlpha,
	alphaTest: 0.48,
	side: THREE.DoubleSide,
	metalness: 0.65,
	roughness: 0.58,
});
const merchandiseMaterial = new THREE.MeshStandardMaterial({
	vertexColors: true,
	roughness: 0.85,
});
const perforatedMaterials = [materials.metal, materials.blue].map(
	(base, variant) => {
		const alpha = new Uint8Array(32 * 32 * 4);
		for (let y = 0; y < 32; y++) {
			for (let x = 0; x < 32; x++) {
				const dx = (x - 16) / (variant === 0 ? 13 : 11);
				const dy = (y - 16) / (variant === 0 ? 8 : 11);
				const value = dx * dx + dy * dy < 1 ? 0 : 255;
				alpha.set([value, value, value, 255], (y * 32 + x) * 4);
			}
		}
		const texture = new THREE.DataTexture(alpha, 32, 32);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.needsUpdate = true;
		const material = base.clone();
		material.alphaMap = texture;
		material.alphaTest = 0.5;
		material.side = THREE.DoubleSide;
		return material;
	},
);

export function perforatedPanel(
	width: number,
	height: number,
	variant: number,
): THREE.Mesh {
	const geometry = new THREE.PlaneGeometry(width, height);
	const uv = geometry.getAttribute("uv");
	for (let index = 0; index < uv.count; index++)
		uv.setXY(
			index,
			(uv.getX(index) * width) / 0.04,
			(uv.getY(index) * height) / 0.03,
		);
	return new THREE.Mesh(
		geometry,
		perforatedMaterials[variant] ?? materials.blue,
	);
}

export function expandedPanel(width: number, height: number): THREE.Mesh {
	const geometry = new THREE.PlaneGeometry(width, height);
	const uv = geometry.getAttribute("uv");
	for (let index = 0; index < uv.count; index++)
		uv.setXY(
			index,
			(uv.getX(index) * width) / 0.05,
			(uv.getY(index) * height) / 0.025,
		);
	return new THREE.Mesh(geometry, meshMaterial);
}

export function applyWoodGrain(): void {
	if (materials.wood.map) return;
	const grain = new Uint8Array(64 * 256 * 4);
	for (let y = 0; y < 256; y++) {
		for (let x = 0; x < 64; x++) {
			const line = Math.sin(x * 1.9 + Math.sin(y * 0.045) * 0.7) * 9;
			const speckle = Math.sin(x * 78.23 + y * 19.11) * 4;
			const value = 228 + line + speckle;
			grain.set([value, value - 5, value - 14, 255], (y * 64 + x) * 4);
		}
	}
	const texture = new THREE.DataTexture(grain, 64, 256);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.needsUpdate = true;
	materials.wood.map = texture;
	materials.wood.needsUpdate = true;
}

export function batchFixture(group: THREE.Group): void {
	const clothing = detachClothing(group);
	group.updateMatrixWorld(true);
	const inverse = group.matrixWorld.clone().invert();
	const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
	const multiMaterial: THREE.Mesh[] = [];
	const productIds: string[] = [];
	group.traverse((object) => {
		const productId: unknown = object.userData["productId"];
		if (typeof productId === "string") productIds.push(productId);
		if (!(object instanceof THREE.Mesh)) return;
		if (Array.isArray(object.material)) {
			const geometry = object.geometry.clone();
			geometry.applyMatrix4(
				new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld),
			);
			const mesh = new THREE.Mesh(geometry, object.material);
			mesh.name = object.name;
			mesh.castShadow = object.castShadow;
			mesh.receiveShadow = object.receiveShadow;
			multiMaterial.push(mesh);
			return;
		}
		const geometry = object.geometry.index
			? object.geometry.toNonIndexed()
			: object.geometry.clone();
		geometry.applyMatrix4(
			new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld),
		);
		const material =
			object.material instanceof THREE.MeshStandardMaterial &&
			object.material.userData["merchandiseFabric"] === true &&
			object.material.userData["referenceProduct"] !== true
				? merchandiseMaterial
				: object.material;
		if (
			material === merchandiseMaterial &&
			object.material instanceof THREE.MeshStandardMaterial
		) {
			const colors = new Float32Array(
				geometry.getAttribute("position").count * 3,
			);
			for (let index = 0; index < colors.length; index += 3)
				object.material.color.toArray(colors, index);
			geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		}
		const batch = batches.get(material) ?? [];
		batch.push(geometry);
		batches.set(material, batch);
	});
	group.userData["batchedProductIds"] = productIds;
	group.clear();
	for (const product of clothing) group.add(product);
	for (const mesh of multiMaterial) group.add(mesh);
	for (const [material, geometries] of batches) {
		const merged = mergeGeometries(geometries, false);
		if (merged) {
			const mesh = new THREE.Mesh(merged, material);
			mesh.castShadow = !material.transparent;
			mesh.receiveShadow = true;
			group.add(mesh);
		}
		for (const geometry of geometries) geometry.dispose();
	}
}
