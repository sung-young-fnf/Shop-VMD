import * as THREE from "three";

export type Point = readonly [number, number, number];
export type FixtureInfo = {
	readonly fixtureId: string;
	readonly zoneId: "headwear" | "footwear" | "apparel" | "custom" | "entrance";
	readonly label: string;
	readonly sourcePages: readonly number[];
	readonly productCode: string;
};
export const materials = {
	metal: new THREE.MeshStandardMaterial({
		color: "#747870",
		metalness: 0.65,
		roughness: 0.42,
	}),
	wood: new THREE.MeshStandardMaterial({ color: "#bca57b", roughness: 0.75 }),
	blue: new THREE.MeshStandardMaterial({
		color: "#536b95",
		metalness: 0.35,
		roughness: 0.3,
	}),
	mirror: new THREE.MeshStandardMaterial({
		color: "#b4c1c7",
		metalness: 1,
		roughness: 0.08,
	}),
	bronze: new THREE.MeshStandardMaterial({
		color: "#777268",
		metalness: 0.75,
		roughness: 0.32,
	}),
	acrylic: new THREE.MeshPhysicalMaterial({
		color: "#7492bf",
		roughness: 0.23,
		metalness: 0,
		transparent: true,
		opacity: 0.48,
		depthWrite: false,
	}),
	grayAcrylic: new THREE.MeshPhysicalMaterial({
		color: "#a9b1b3",
		roughness: 0.16,
		metalness: 0,
		transparent: true,
		opacity: 0.32,
		depthWrite: false,
	}),
	light: new THREE.MeshStandardMaterial({
		color: "#f2f0dd",
		emissive: "#fff4de",
		emissiveIntensity: 1.5,
		roughness: 0.6,
	}),
	blueLight: new THREE.MeshStandardMaterial({
		color: "#a0b9de",
		emissive: "#9ab4ef",
		emissiveIntensity: 0.65,
		roughness: 0.35,
	}),
	dark: new THREE.MeshStandardMaterial({
		color: "#303834",
		roughness: 0.7,
		metalness: 0.5,
	}),
} as const;
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export function box(
	size: Point,
	material: THREE.Material,
	point: Point,
): THREE.Mesh {
	const mesh = new THREE.Mesh(boxGeometry, material);
	mesh.scale.set(...size);
	mesh.position.set(...point);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh;
}
export function fixture(
	info: FixtureInfo,
	position: Point,
	angle = 0,
): THREE.Group {
	const group = new THREE.Group();
	group.name = info.fixtureId;
	group.userData = {
		...info,
		placementEvidence:
			"p018 calibrated placement; illustrative merchandise, not exact SKU",
	};
	group.position.set(...position);
	group.rotation.y = angle;
	return group;
}
