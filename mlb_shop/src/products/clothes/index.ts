import * as THREE from "three";
import { clothesCatalog } from "./catalog";
import {
	foldedFace,
	foldedShell,
	garmentGeometry,
	rearGarmentGeometry,
} from "./geometry";

const loader = new THREE.TextureLoader();
function photoMaterial(texture: THREE.Texture, color: string) {
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		toneMapped: false,
	});
	material.onBeforeCompile = (shader) => {
		shader.uniforms["clothUndercoat"] = { value: new THREE.Color(color) };
		shader.fragmentShader =
			`uniform vec3 clothUndercoat;\n${shader.fragmentShader}`.replace(
				"#include <map_fragment>",
				"vec4 clothPhoto = texture2D(map, vMapUv); diffuseColor.rgb *= mix(clothUndercoat, clothPhoto.rgb, clothPhoto.a);",
			);
	};
	material.customProgramCacheKey = () => "clothing-photo-coverage-v1";
	material.userData["referenceCoverage"] =
		"source photo alpha over inferred opaque cloth";
	return material;
}
function loadProduct(reference: (typeof clothesCatalog)[number]) {
	const texture = loader.load(
		`${import.meta.env.BASE_URL}products/clothes/${reference.frontImage ?? `${reference.id}.png`}`,
	);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	const printed = reference.rearImage
		? photoMaterial(texture, reference.color)
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
		const material = photoMaterial(rearTexture, reference.color);
		material.userData["referenceProduct"] = true;
		material.userData["productId"] = reference.id;
		rear = new THREE.Mesh(
			rearGarmentGeometry(geometry.face, reference.rearProjection),
			material,
		);
		rear.name = "reference-rear-surface";
	}
	const foldedRear = foldedFace.clone();
	foldedRear.scale(1, -1, 1);
	const foldedRearIndex = foldedRear.index;
	if (foldedRearIndex) {
		for (let i = 0; i < foldedRearIndex.count; i += 3) {
			const second = foldedRearIndex.getX(i + 1);
			foldedRearIndex.setX(i + 1, foldedRearIndex.getX(i + 2));
			foldedRearIndex.setX(i + 2, second);
		}
	}
	foldedRear.translate(0, 0.0345, 0);
	const rearUv = foldedRear.getAttribute("uv");
	for (let i = 0; i < rearUv.count; i++) rearUv.setX(i, 1 - rearUv.getX(i));
	return { reference, printed, fabric, geometry, rear, foldedRear };
}
const products = new Map<string, ReturnType<typeof loadProduct>>();
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

function productAt(index: number | string) {
	const reference =
		typeof index === "string"
			? clothesCatalog.find((item) => item.id === index)
			: Number.isInteger(index)
				? clothesCatalog[index]
				: undefined;
	if (!reference) throw new RangeError(`Unknown clothing assignment: ${index}`);
	const cached = products.get(reference.id);
	if (cached) return cached;
	const product = loadProduct(reference);
	products.set(reference.id, product);
	return product;
}

export function createGarment(index: number | string): THREE.Group {
	const product = productAt(index);
	const group = new THREE.Group();
	if (!product) return group;
	group.name = `reference-garment-${product.reference.id}`;
	group.userData["productId"] = product.reference.id;
	group.userData["frontImage"] = product.reference.frontImage;
	group.userData["rearImage"] = product.reference.rearImage;
	group.userData["category"] = product.reference.category;
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

export function createFoldedGarment(index: number | string): THREE.Group {
	const product = productAt(index);
	const group = new THREE.Group();
	if (!product) return group;
	group.name = `reference-folded-${product.reference.id}`;
	group.userData["productId"] = product.reference.id;
	group.userData["frontImage"] = product.reference.frontImage;
	group.userData["rearImage"] = product.reference.rearImage;
	group.userData["category"] = product.reference.category;
	group.userData["representation"] =
		"photo-textured 2.5D; inferred folding and depth";
	group.userData["foldedLayout"] =
		"Inferred folding; actual source torso pixels";
	const body = new THREE.Mesh(foldedShell, product.fabric);
	body.castShadow = true;
	body.receiveShadow = true;
	const front = new THREE.Mesh(foldedFace, product.printed);
	front.name = "reference-visible-surface";
	group.add(body, front);
	if (product.rear) {
		const rear = new THREE.Mesh(product.foldedRear, product.rear.material);
		rear.name = "reference-rear-surface";
		group.add(rear);
	}
	return group;
}
