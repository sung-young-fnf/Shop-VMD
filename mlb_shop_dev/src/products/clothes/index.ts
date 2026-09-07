import * as THREE from "three";
import { clothesCatalog } from "./catalog";
import { foldedFace, foldedShell, garmentGeometry } from "./geometry";

const loader = new THREE.TextureLoader();
const products = clothesCatalog.map((reference) => {
	const texture = loader.load(
		`${import.meta.env.BASE_URL}products/clothes/${reference.frontImage ?? `${reference.id}.png`}`,
	);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	const printed = reference.rearImage
		? new THREE.MeshBasicMaterial({
				map: texture,
				alphaTest: 0.4,
				toneMapped: false,
			})
		: new THREE.MeshStandardMaterial({
				map: texture,
				roughness: 0.92,
				metalness: 0,
				alphaTest: 0.4,
			});
	const fabric = reference.rearImage
		? new THREE.MeshBasicMaterial({
				color: reference.color,
				toneMapped: false,
			})
		: new THREE.MeshStandardMaterial({
				color: reference.color,
				roughness: 0.92,
				metalness: 0,
			});
	for (const material of [printed, fabric]) {
		material.userData["merchandiseFabric"] = true;
		material.userData["referenceProduct"] = true;
		material.userData["productId"] = reference.id;
	}
	const geometry = garmentGeometry(reference);
	let rear: THREE.Mesh | null = null;
	if (reference.rearImage) {
		const rearTexture = loader.load(
			`${import.meta.env.BASE_URL}products/clothes/${reference.rearImage}`,
		);
		rearTexture.colorSpace = THREE.SRGBColorSpace;
		rearTexture.anisotropy = 4;
		const material = new THREE.MeshBasicMaterial({
			map: rearTexture,
			alphaTest: 0.4,
			toneMapped: false,
		});
		material.userData["referenceProduct"] = true;
		material.userData["productId"] = reference.id;
		rear = new THREE.Mesh(geometry.face.clone().rotateY(Math.PI), material);
		rear.name = "reference-rear-surface";
	}
	return { reference, printed, fabric, geometry, rear };
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
	group.userData["hiddenSurface"] = product.rear
		? "Front and rear photographs; seam thickness and hanging depth inferred"
		: "Inferred plain matching cloth; single reference view";
	if (product.rear) {
		group.userData["representation"] =
			"photo-textured 2.5D; captured lighting, not relightable PBR";
		group.add(product.rear.clone());
	}
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
