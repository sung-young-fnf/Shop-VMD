import * as THREE from "three";
import { box, materials } from "./primitives";
import { cap, shoe } from "./merchandise";
import { expandedPanel } from "./surfaces";
import { placeCapOnSupport } from "../products/caps/placement";

export function detailCapCabinet(
	group: THREE.Group,
	width: number,
	index: number,
): void {
	const back = expandedPanel(width, 2.16);
	back.position.set(0, 1.395, -0.183);
	group.add(back);
	for (const x of [-width / 6, width / 6])
		group.add(
			box([0.005, 2.155, 0.2], materials.grayAcrylic, [x, 1.39, 0.082]),
		);
	for (let level = 0; level < 6; level++) {
		const y = 0.325 + level * 0.358;
		for (let column = 0; column < 3; column++) {
			const product = cap((index - 1) * 18 + level * 3 + column);
			placeCapOnSupport(product, { x: ((column - 1) * width) / 3, top: y, z: .005, width: width / 3 - .025, depth: .35 });
			group.add(product);
		}
		group.add(
			box([width - 0.03, 0.008, 0.012], materials.light, [0, y + 0.325, 0.153]),
		);
	}
	group.add(
		box([width - 0.04, 0.015, 0.012], materials.dark, [0, 0.067, 0.187]),
	);
	group.userData["merchandise"] = {
		kind: "same-SKU photographic headwear assortment",
		count: 18,
		support: "six shelves × three columns; distinct admitted SKUs before repetition; inferred hidden construction",
	};
}

export function detailShoeCabinet(
	group: THREE.Group,
	width: number,
	index: number,
): void {
	const back = expandedPanel(width, 2.16);
	back.position.set(0, 1.395, -0.183);
	group.add(back);
	for (let level = 0; level < 6; level++) {
		for (let column = 0; column < 2; column++) {
			const slot = (index - 1) * 12 + level * 2 + column;
			const product = shoe(slot);
			product.userData["footwearSlot"] = slot;
			product.position.set(
				(column - 0.5) * width * 0.53,
				0.325 + level * 0.358,
				0.02,
			);
			group.add(product);
		}
		group.add(
			box([width - 0.03, 0.008, 0.012], materials.light, [
				0,
				0.65 + level * 0.358,
				0.153,
			]),
		);
	}
	if (index >= 2 && index <= 4) {
		const mirror = box(
			[width - 0.05, Math.hypot(0.25, 0.15), 0.008],
			materials.mirror,
			[0, 0.175, 0.119],
		);
		mirror.rotation.x = -Math.atan2(0.15, 0.25);
		group.add(mirror);
		group.userData["drawerCode"] = "ML-W-02_DR(MR)(1110)";
	} else group.userData["drawerCode"] = "ML-W-02_DR(1110)";
	group.add(
		box([width - 0.04, 0.015, 0.012], materials.dark, [0, 0.045, 0.187]),
	);
	group.userData["merchandise"] = {
		kind: "CAD-assisted same-product photographic footwear assortment",
		count: 12,
		support: "six shelves; verified product identities; display arrangement and dimensions are illustrative",
	};
}

export function detailLuminousCabinet(group: THREE.Group, width: number): void {
	for (let level = 0; level < 4; level++)
		group.add(
			box([width - 0.03, 0.012, 0.32], materials.metal, [
				0,
				0.45 + level * 0.54,
				0,
			]),
		);
	group.add(
		box([width - 0.025, 0.24, 0.004], materials.blueLight, [0, 0.3, 0.196]),
	);
	for (const y of [0.2, 2.26]) {
		for (let slot = 0; slot < 3; slot++)
			group.add(
				box([width * 0.22, 0.004, 0.004], materials.light, [
					0,
					y + slot * 0.014,
					0.2,
				]),
			);
	}
	group.userData["use"] =
		"W02 display-capable luminous acrylic door; merchandise arrangement illustrative";
}

export function detailSideCabinet(group: THREE.Group, cabinetIndex = 0): void {
	const back = expandedPanel(1.477, 2.16);
	back.position.set(0, 1.395, -0.238);
	group.add(back);
	for (let level = 0; level < 6; level++) {
		for (let column = 0; column < 3; column++) {
			const slot = 60 + cabinetIndex * 18 + level * 3 + column;
			const product = shoe(slot);
			product.userData["footwearSlot"] = slot;
			product.position.set((column - 1) * 0.45, 0.325 + level * 0.358, 0);
			group.add(product);
		}
		group.add(
			box([1.447, 0.008, 0.012], materials.light, [
				0,
				0.65 + level * 0.358,
				0.22,
			]),
		);
	}
	const mirror = box(
		[1.433, Math.hypot(0.25, 0.15), 0.008],
		materials.mirror,
		[0, 0.175, 0.189],
	);
	mirror.rotation.x = -Math.atan2(0.15, 0.25);
	group.add(mirror);
}
