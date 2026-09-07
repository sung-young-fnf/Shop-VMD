import * as THREE from "three";
import { box, fixture, materials } from "./primitives";
import {
	detailCapCabinet,
	detailShoeCabinet,
	detailLuminousCabinet,
	detailSideCabinet,
} from "./cabinet-details";
import { shoe } from "./merchandise";

export function createCabinetWalls(): THREE.Group {
	const root = new THREE.Group();
	const capRun = [
		"acr",
		"cap",
		"cap",
		"mirror",
		"cap",
		"cap",
		"cap",
		"cap",
		"mirror",
		"cap",
		"cap",
		"acr",
	] as const;
	let edge = 1.93;
	let caps = 0;
	for (const [index, kind] of capRun.entries()) {
		const width = kind === "cap" ? 0.95 : 0.47;
		const id =
			kind === "cap"
				? `ca-${String(++caps).padStart(2, "0")}`
				: `a-${kind}-${index}`;
		const group = fixture(
			{
				fixtureId: id,
				zoneId: "headwear",
				label: kind === "cap" ? `모자장 ${caps}` : "모자벽 발광·거울장",
				sourcePages: [18, 29, 45, 46, 51, 52],
				productCode: `ML-W-02_${kind === "cap" ? "CA" : kind === "acr" ? "ACR(470)" : "MR(470)"}`,
			},
			[edge + 0.023 + width / 2, 0, 2.5],
		);
		group.add(
			box([0.023, 2.5, 0.4], materials.metal, [-width / 2 - 0.0115, 1.25, 0]),
		);
		if (index === capRun.length - 1)
			group.add(
				box([0.023, 2.5, 0.4], materials.metal, [width / 2 + 0.0115, 1.25, 0]),
			);
		group.add(box([width, 0.023, 0.4], materials.metal, [0, 2.4885, 0]));
		if (kind === "cap") {
			group.add(box([width - 0.01, 0.3, 0.36], materials.wood, [0, 0.15, 0]));
			for (let shelf = 0; shelf < 6; shelf++)
				group.add(
					box([width, 0.025, 0.36], materials.metal, [
						0,
						0.3125 + shelf * 0.358,
						0.005,
					]),
				);
			detailCapCabinet(group, width, caps);
		} else
			group.add(
				box(
					[width, 2.454, 0.018],
					kind === "acr" ? materials.blue : materials.mirror,
					[0, 1.25, 0.185],
				),
			);
		if (kind === "acr") detailLuminousCabinet(group, width);
		root.add(group);
		edge += width + 0.023;
	}
	const shoeRun = [
		"mirror",
		"shoe",
		"acr",
		"shoe",
		"shoe",
		"shoe",
		"acr",
		"shoe",
		"mirror",
	] as const;
	let shoeEdge = 3.75;
	let shoes = 0;
	for (const [index, kind] of shoeRun.entries()) {
		const width = kind === "shoe" ? 1.12 : 0.4425;
		const id =
			kind === "shoe"
				? `sh-${String(++shoes).padStart(2, "0")}`
				: `b-${kind}-${index}`;
		const group = fixture(
			{
				fixtureId: id,
				zoneId: "footwear",
				label: kind === "shoe" ? `신발장 ${shoes}` : "신발벽 발광·거울장",
				sourcePages: [18, 32, 44, 47, 48, 49, 50],
				productCode: `ML-W-02_${kind === "shoe" ? "SH" : kind === "acr" ? "ACR(442.5)" : "MR(442.5)"}`,
			},
			[18.73, 0, shoeEdge + 0.023 + width / 2],
			-Math.PI / 2,
		);
		group.add(
			box([0.023, 2.5, 0.4], materials.metal, [-width / 2 - 0.0115, 1.25, 0]),
		);
		if (index === shoeRun.length - 1)
			group.add(
				box([0.023, 2.5, 0.4], materials.metal, [width / 2 + 0.0115, 1.25, 0]),
			);
		group.add(box([width, 0.023, 0.4], materials.metal, [0, 2.4885, 0]));
		if (kind === "shoe") {
			const mirrorDrawer = shoes >= 2 && shoes <= 4;
			group.add(
				box([width - 0.01, 0.3, mirrorDrawer ? 0.21 : 0.36], materials.wood, [
					0,
					0.15,
					mirrorDrawer ? -0.065 : 0,
				]),
			);
			for (let shelf = 0; shelf < 6; shelf++)
				group.add(
					box([width, 0.025, 0.36], materials.metal, [
						0,
						0.3125 + shelf * 0.358,
						0.005,
					]),
				);
			detailShoeCabinet(group, width, shoes);
		} else
			group.add(
				box(
					[width, 2.454, 0.018],
					kind === "acr" ? materials.blue : materials.mirror,
					[0, 1.25, 0.185],
				),
			);
		if (kind === "acr") detailLuminousCabinet(group, width);
		root.add(group);
		shoeEdge += width + 0.023;
	}
	for (const [index, z] of [3.5, 11.83].entries()) {
		const side = fixture(
			{
				fixtureId: `w03-sh-0${index + 1}`,
				zoneId: "footwear",
				label: "측면 신발장",
				sourcePages: [18, 32, 53],
				productCode: "ML-W-03_SH",
			},
			[17.9685, 0, z],
			index === 0 ? 0 : Math.PI,
		);
		side.add(box([1.523, 0.3, 0.34], materials.wood, [0, 0.15, -0.09]));
		for (let shelf = 0; shelf < 7; shelf++)
			side.add(
				box([1.523, 0.025, 0.48], materials.metal, [
					0,
					0.3125 + shelf * 0.358,
					0,
				]),
			);
		for (const x of [-0.75, 0.75])
			side.add(box([0.023, 2.5, 0.5], materials.metal, [x, 1.25, 0]));
		detailSideCabinet(side);
		root.add(side);
		const end = fixture(
			{
				fixtureId: `w03-cyl-0${index + 1}`,
				zoneId: "footwear",
				label: "반원 실린더 진열",
				sourcePages: [18, 32, 54],
				productCode: "ML-W-03_CYL",
			},
			[17.207, 0, z],
			-Math.PI / 2,
		);
		const half = new THREE.Mesh(
			new THREE.CylinderGeometry(
				0.5,
				0.5,
				1,
				32,
				1,
				false,
				-Math.PI / 2,
				Math.PI,
			),
			materials.metal,
		);
		half.position.y = 0.5;
		end.add(
			half,
			box([1, 1, 0.015], materials.metal, [0, 0.5, 0]),
			box([0.454, 1.477, 0.008], materials.acrylic, [
				index === 0 ? 0.25 : -0.25,
				1.7385,
				0,
			]),
		);
		end.add(box([0.023, 1.5, 0.03], materials.metal, [0, 1.75, 0]));
		const product = shoe(index);
		product.position.set(0, 1, 0.25);
		end.add(
			product,
			box([0.055, 0.008, 0.055], materials.light, [0, 2.47, 0.27]),
		);
		const canopy = half.clone();
		canopy.scale.y = 0.025;
		canopy.position.y = 2.4875;
		end.add(canopy);
		root.add(end);
	}
	return root;
}
