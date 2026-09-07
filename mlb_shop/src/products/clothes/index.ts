import * as THREE from "three";
import { clothesCatalog } from "./catalog";
import { foldedFace, foldedShell, garmentGeometry } from "./geometry";

const loader = new THREE.TextureLoader();
const products = clothesCatalog.map((reference) => {
	const texture = loader.load(
		`${import.meta.env.BASE_URL}products/clothes/${reference.id}.png`,
	);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	const printed = new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 0.92,
		metalness: 0,
		alphaTest: 0.4,
	});
	const fabric = new THREE.MeshStandardMaterial({
		color: reference.color,
		roughness: 0.92,
		metalness: 0,
	});
	for (const material of [printed, fabric]) {
		material.userData["merchandiseFabric"] = true;
		material.userData["referenceProduct"] = true;
		material.userData["productId"] = reference.id;
	}
	return { reference, printed, fabric, geometry: garmentGeometry(reference) };
});
const hangerMaterial = new THREE.MeshStandardMaterial({
	color: "#a3a5a5",
	roughness: 0.28,
	metalness: 0.8,
});
hangerMaterial.userData["referenceProduct"] = true;
const hangerPath = new THREE.CatmullRomCurve3([
	new THREE.Vector3(-0.175, -0.19, -0.004),
	new THREE.Vector3(-0.08, -0.151, -0.004),
	new THREE.Vector3(0, -0.123, -0.004),
	new THREE.Vector3(0.08, -0.151, -0.004),
	new THREE.Vector3(0.175, -0.19, -0.004),
]);
const hangerGeometry = new THREE.TubeGeometry(hangerPath, 12, 0.003, 5, false);
const hookGeometry = new THREE.TubeGeometry(
	new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -0.123, -0.004),
		new THREE.Vector3(0, -0.045, -0.004),
		new THREE.Vector3(0.016, -0.018, -0.004),
		new THREE.Vector3(0, 0, -0.004),
		new THREE.Vector3(-0.018, -0.02, -0.004),
	]),
	12,
	0.003,
	5,
	false,
);

function productAt(index: number) {
	return (
		products[
			((Math.trunc(index) % products.length) + products.length) %
				products.length
		] ?? products[0]
	);
}

export function createGarment(index: number): THREE.Group {
	const product = productAt(index);
	const group = new THREE.Group();
	if (!product) return group;
	group.name = `reference-garment-${product.reference.id}`;
	group.userData["productId"] = product.reference.id;
	group.userData["referenceView"] = product.reference.view;
	group.userData["hiddenSurface"] =
		"Inferred plain matching cloth; single reference view";
	const body = new THREE.Mesh(product.geometry.shell, product.fabric);
	body.name = "cloth-volume";
	const print = new THREE.Mesh(product.geometry.face, product.printed);
	print.name = "reference-visible-surface";
	body.castShadow = true;
	body.receiveShadow = true;
	print.receiveShadow = true;
	group.add(
		body,
		print,
		new THREE.Mesh(hangerGeometry, hangerMaterial),
		new THREE.Mesh(hookGeometry, hangerMaterial),
	);
	return group;
}

export function createFoldedGarment(index: number): THREE.Group {
	const product = productAt(index);
	const group = new THREE.Group();
	if (!product) return group;
	group.name = `reference-folded-${product.reference.id}`;
	group.userData["productId"] = product.reference.id;
	group.userData["foldedLayout"] =
		"Inferred folding; actual source torso pixels";
	const body = new THREE.Mesh(foldedShell, product.fabric);
	body.castShadow = true;
	body.receiveShadow = true;
	group.add(body, new THREE.Mesh(foldedFace, product.printed));
	return group;
}
