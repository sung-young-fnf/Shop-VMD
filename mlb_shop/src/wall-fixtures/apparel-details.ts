import * as THREE from "three";
import { box, materials } from "./primitives";
import { bag, cap, garment } from "./merchandise";

export function slopedLight(width: number): THREE.Group {
	const group = new THREE.Group();
	const housing = box([width, 0.035, 0.35], materials.metal, [0, 2.25, 0.15]);
	housing.rotation.x = (Math.PI * 31) / 180;
	const lens = box(
		[width - 0.025, 0.006, 0.32],
		materials.light,
		[0, 2.229, 0.153],
	);
	lens.rotation.x = housing.rotation.x;
	group.add(housing, lens);
	for (const x of [-width / 2 + 0.035, width / 2 - 0.035])
		group.add(box([0.018, 0.12, 0.3], materials.metal, [x, 2.27, 0.14]));
	return group;
}

export function detailGarmentBay(group: THREE.Group): void {
	for (const x of [-0.63, 0.63]) {
		group.add(box([0.005, 1.6, 0.2], materials.acrylic, [x, 1.2, 0.12]));
		group.add(
			box([0.02, 1.4, 0.022], materials.dark, [
				x + (x < 0 ? 0.04 : -0.04),
				1.15,
				0.025,
			]),
		);
		group.add(box([0.022, 0.025, 0.3], materials.metal, [x * 0.9, 1.6, 0.15]));
	}
	for (let index = 0; index < 7; index++) {
		const product = garment(index);
		product.position.set(-0.47 + index * 0.155, 1.6125, 0.3);
		product.rotation.y = Math.PI / 2.6;
		group.add(product);
	}
	group.userData["merchandise"] = {
		kind: "illustrative garments",
		count: 7,
		support: "suspended from Ø25 rail",
		exactSku: false,
	};
}

export function grating(width: number, height: number): THREE.Group {
	const group = new THREE.Group();
	for (let x = -width / 2; x <= width / 2; x += 0.05)
		group.add(box([0.003, height, 0.05], materials.metal, [x, 0, 0]));
	for (let y = -height / 2; y <= height / 2; y += 0.05)
		group.add(box([width, 0.003, 0.05], materials.metal, [0, y, 0]));
	for (const y of [-height / 2, height / 2])
		group.add(box([width, 0.008, 0.06], materials.metal, [0, y, 0]));
	return group;
}

export function detailGratingBay(group: THREE.Group): void {
	for (const y of [0.95, 1.45]) {
		const lattice = grating(1.183, 0.372);
		lattice.position.set(0, y, 0.062);
		group.add(lattice);
		for (const x of [-0.37, 0.1])
			group.add(box([0.21, 0.262, 0.01], materials.metal, [x, y, 0.108]));
		for (let index = 0; index < 10; index++) {
			const depth = index < 5 ? 0.06 : 0.12;
			group.add(
				box([0.008, 0.008, depth], materials.mirror, [
					-0.52 + index * 0.112,
					y - 0.04,
					0.115 + depth / 2,
				]),
			);
			group.add(
				box([0.008, 0.025, 0.008], materials.mirror, [
					-0.52 + index * 0.112,
					y - 0.03,
					0.115 + depth,
				]),
			);
		}
	}
	const shelf = grating(1.183, 0.343);
	shelf.rotation.x = Math.PI / 2;
	shelf.position.set(0, 0.56, 0.18);
	group.add(shelf);
	for (const x of [-0.32, 0.31]) {
		group.add(box([0.4, 0.025, 0.25], materials.wood, [x, 0.605, 0.18]));
		const product = bag(x < 0 ? 1 : 0);
		product.scale.setScalar(0.55);
		product.position.set(x, 0.6175, 0.18);
		group.add(product);
	}
}

export function perforatedWood(): THREE.Mesh {
	const shape = new THREE.Shape();
	shape.moveTo(-1, -0.7);
	shape.lineTo(1, -0.7);
	shape.lineTo(1, 0.7);
	shape.lineTo(-1, 0.7);
	shape.closePath();
	for (let x = -0.87; x < 0.94; x += 0.06) {
		for (let y = -0.64; y <= 0.5; y += 0.06) {
			const hole = new THREE.Path();
			hole.absarc(x, y, 0.004, 0, Math.PI * 2, true);
			shape.holes.push(hole);
		}
	}
	const mesh = new THREE.Mesh(
		new THREE.ExtrudeGeometry(shape, {
			depth: 0.03,
			bevelEnabled: false,
			curveSegments: 3,
		}),
		materials.wood,
	);
	mesh.position.set(0, 1.15, -0.015);
	return mesh;
}

export function detailPegboard(group: THREE.Group): void {
	for (let row = 0; row < 3; row++) {
		const y = 0.8 + row * 0.3;
		group.add(box([0.8, 0.03, 0.25], materials.wood, [-0.48, y, 0.14]));
		for (const x of [-0.81, -0.15])
			group.add(box([0.012, 0.1, 0.2], materials.metal, [x, y - 0.05, 0.105]));
		for (let column = 0; column < 3; column++) {
			const product = cap(row + column);
			product.position.set(-0.75 + column * 0.27, y + 0.015, 0.15);
			group.add(product);
		}
	}
	group.add(box([1.94, 0.2, 0.032], materials.metal, [0, 2.02, 0.014]));
}

export function detailBagShelves(group: THREE.Group, width: number): void {
	for (const [index, y] of [0.395, 0.825, 1.255].entries()) {
		const count = width > 1.5 ? 5 : 3;
		for (let column = 0; column < count; column++) {
			const product = bag(index + column);
			product.position.set((column - (count - 1) / 2) * 0.35, y, 0);
			group.add(product);
		}
		group.add(
			box([width - 0.025, 0.012, 0.012], materials.light, [
				0,
				y + (index === 2 ? 0.697 : 0.398),
				0.192,
			]),
		);
	}
	group.userData["merchandise"] = {
		kind: "illustrative bag proxies",
		exactSku: false,
		support: "wood shelf top",
	};
}

export function detailAccessories(group: THREE.Group): void {
	group.add(box([1.24, 1.52, 0.02], materials.metal, [0, 1.175, -0.2]));
	for (let row = 0; row < 4; row++) {
		const y = 0.72 + row * 0.27;
		group.add(box([1.16, 0.025, 0.015], materials.metal, [0, y, -0.145]));
		for (let column = 0; column < 3; column++) {
			const x = (column - 1) * 0.32;
			group.add(box([0.008, 0.008, 0.22], materials.mirror, [x, y, -0.025]));
			group.add(box([0.12, 0.18, 0.025], materials.wood, [x, y - 0.11, 0.07]));
			group.add(
				box([0.09, 0.025, 0.004], materials.blueLight, [x, y - 0.04, 0.085]),
			);
		}
	}
}
