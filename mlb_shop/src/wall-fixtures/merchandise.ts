import * as THREE from "three";
import { box, materials } from "./primitives";

export { createCap as cap } from "../products/caps";
export { createGarment as garment } from "../products/clothes";
export { createShoe as shoe } from "../products/shoes";

const fabrics = [
	"#243048",
	"#ede4cc",
	"#aabec9",
	"#bd939c",
	"#748879",
	"#9b785e",
].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.86 }));
const rounded = new THREE.SphereGeometry(1, 12, 8);
const handleGeometry = new THREE.TorusGeometry(0.078, 0.009, 5, 12, Math.PI);
const soleMaterial = new THREE.MeshStandardMaterial({
	color: "#e8e5da",
	roughness: 0.8,
});
for (const material of [...fabrics, soleMaterial])
	material.userData["merchandiseFabric"] = true;

export function bag(colorIndex: number): THREE.Group {
	const group = new THREE.Group();
	const material = fabrics[colorIndex % fabrics.length] ?? soleMaterial;
	const body = new THREE.Mesh(rounded, material);
	body.scale.set(0.14, 0.115, 0.068);
	body.position.y = 0.115;
	const handle = new THREE.Mesh(handleGeometry, material);
	handle.position.set(0, 0.22, 0);
	group.add(
		body,
		handle,
		box([0.16, 0.072, 0.009], material, [0, 0.105, 0.064]),
		box([0.02, 0.016, 0.006], materials.mirror, [0, 0.151, 0.073]),
	);
	return group;
}
