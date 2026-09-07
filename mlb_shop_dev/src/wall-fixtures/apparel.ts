import * as THREE from "three";
import { box, fixture, materials } from "./primitives";
import {
	slopedLight,
	detailGarmentBay,
	detailGratingBay,
	detailPegboard,
	perforatedWood,
	detailBagShelves,
	detailAccessories,
} from "./apparel-details";
import { perforatedPanel } from "./surfaces";

export function createApparelWalls(): THREE.Group {
	const root = new THREE.Group();
	for (const [index, x] of [1.68, 3.4, 4.95, 6.55, 8.15].entries()) {
		const width = index === 0 ? 2 : 1.36;
		const id =
			index === 0
				? "w04-perforated-01"
				: index === 1
					? "w04-grating-01"
					: `w04-standard-0${index - 1}`;
		const group = fixture(
			{
				fixtureId: id,
				zoneId: index === 0 ? "custom" : "apparel",
				label:
					index === 0
						? "모꾸존 타공 우드벽"
						: index === 1
							? "액세서리 그레이팅벽"
							: "의류 행거벽",
				sourcePages:
					index === 0
						? [18, 33, 88, 89, 90, 91, 95]
						: index === 1
							? [18, 33, 83, 84, 85, 86, 87]
							: [18, 33, 55, 56, 57, 58],
				productCode:
					index === 0
						? "ML-W-04(2000)"
						: index === 1
							? "ML-W-04(타공판)"
							: "ML-W-04_HG",
			},
			[x, 0, index < 2 ? 15.63 : 15.38],
			Math.PI + (index > 1 ? -Math.PI / 18 : 0),
		);
		for (const postX of [-width / 2 + 0.015, width / 2 - 0.015])
			group.add(box([0.03, 2.5, 0.03], materials.bronze, [postX, 1.25, 0]));
		if (index === 0) group.add(perforatedWood());
		else group.add(box([width, 1.4, 0.03], materials.wood, [0, 1.15, 0]));
		group.add(slopedLight(width - 0.06));
		if (index > 1) {
			const rail = new THREE.Mesh(
				new THREE.CylinderGeometry(0.0125, 0.0125, 1.183, 10),
				materials.mirror,
			);
			rail.rotation.z = Math.PI / 2;
			rail.position.set(0, 1.6, 0.3);
			group.add(rail);
		}
		if (index > 1) detailGarmentBay(group);
		if (index === 1) detailGratingBay(group);
		if (index === 0) detailPegboard(group);
		root.add(group);
	}
	const shelfDefinitions = [
		{ id: "w01-sh-01", x: 10.9, z: 15.43, width: 1.95, angle: Math.PI },
		{ id: "w01-sh-02", x: 13.43, z: 15.43, width: 1.95, angle: Math.PI },
		{ id: "w01-shmr-01", x: 9.7, z: 14.1, width: 1.3, angle: Math.PI / 2 },
		{ id: "w01-acc-01", x: 14.7, z: 14.1, width: 1.3, angle: -Math.PI / 2 },
	] as const;
	for (const item of shelfDefinitions) {
		const group = fixture(
			{
				fixtureId: item.id,
				zoneId: "apparel",
				label: "의류 베이 선반·액세서리",
				sourcePages: [18, 33, 41, 42, 43],
				productCode: item.id.includes("acc") ? "ML-W-01_ACC" : "ML-W-01_SH",
			},
			[item.x, 0, item.z],
			item.angle,
		);
		if (item.id === "w01-acc-01") {
			for (const y of [0.3725, 1.9775])
				group.add(box([item.width, 0.045, 0.45], materials.bronze, [0, y, 0]));
			detailAccessories(group);
		} else {
			for (const y of [0.3725, 0.8025, 1.2325, 1.9775])
				group.add(box([item.width, 0.045, 0.45], materials.wood, [0, y, 0]));
			detailBagShelves(group, item.width);
		}
		for (const x of [-item.width / 2, item.width / 2])
			group.add(box([0.03, 1.65, 0.45], materials.bronze, [x, 1.175, 0]));
		root.add(group);
	}
	for (const item of [
		{ id: "w01-mr-01", x: 12.165, z: 15.43, angle: Math.PI, blue: false },
		{ id: "w01-acr-01", x: 14.7, z: 12.96, angle: -Math.PI / 2, blue: true },
		{ id: "w01-acrmr-01", x: 9.7, z: 12.96, angle: Math.PI / 2, blue: true },
	]) {
		const group = fixture(
			{
				fixtureId: item.id,
				zoneId: "apparel",
				label: item.blue ? "블루 발광장 · 진열 없음" : "고정 거울",
				sourcePages: [18, 33, 38, 39, 40],
				productCode: item.blue ? "ML-W-01_ACR" : "ML-W-01_MR",
			},
			[item.x, 0, item.z],
			item.angle,
		);
		group.add(
			box([0.58, 1.65, 0.45], materials.bronze, [0, 1.175, 0]),
			box(
				[0.52, 1.53, 0.008],
				item.blue ? materials.blueLight : materials.mirror,
				[0, 1.175, 0.23],
			),
		);
		if (item.blue) {
			for (const y of [0.52, 1.84]) {
				for (let line = 0; line < 3; line++)
					group.add(
						box([0.14, 0.006, 0.003], materials.light, [
							0,
							y + line * 0.02,
							0.236,
						]),
					);
			}
			group.add(box([0.025, 0.065, 0.015], materials.dark, [0.21, 1.14, 0.24]));
			group.userData["use"] = "lighting-only cabinet: no merchandise";
		}
		if (item.id === "w01-acrmr-01")
			group.add(box([0.52, 1.53, 0.008], materials.mirror, [0, 1.175, -0.23]));
		root.add(group);
	}
	const screen = fixture(
		{
			fixtureId: "w01-fc-01",
			zoneId: "apparel",
			label: "이중 타공 스크린",
			sourcePages: [18, 33, 37],
			productCode: "ML-W-01_FC",
		},
		[14.98, 0, 13.4],
		-Math.PI / 2,
	);
	for (const x of [-1.24, 0, 1.24])
		screen.add(box([0.02, 2.5, 0.04], materials.metal, [x, 1.25, 0]));
	for (const y of [0.01, 2.49])
		screen.add(box([2.5, 0.02, 0.04], materials.metal, [0, y, 0]));
	for (const [index, x] of [-0.625, 0.625].entries()) {
		const panel = perforatedPanel(1.21, 2.46, index);
		panel.position.set(x, 1.25, 0);
		screen.add(panel);
	}
	root.add(screen);
	const board = fixture(
		{
			fixtureId: "w05-board-01",
			zoneId: "entrance",
			label: "입구 전시 보드",
			sourcePages: [18, 34, 99, 100],
			productCode: "ML-W-05-BO",
		},
		[0.35, 0, 10.82],
		Math.PI / 2,
	);
	board.add(box([0.8, 1.6, 0.018], materials.metal, [0, 1.31, 0]));
	for (const x of [-0.285, 0.285]) {
		board.add(box([0.02, 2.3, 0.02], materials.metal, [x, 1.15, -0.04]));
		for (const y of [0.08, 0.62, 1.66, 2.25])
			board.add(box([0.06, 0.06, 0.05], materials.metal, [x, y, -0.075]));
	}
	for (const y of [0.51, 2.1])
		board.add(box([0.8, 0.014, 0.014], materials.mirror, [0, y, 0.015]));
	root.add(board);
	const postPoints = [
		[9.7, 15.43],
		[12.165, 15.43],
		[14.7, 15.43],
		[9.7, 12.5],
		[14.7, 12.5],
	] as const;
	for (const [index, point] of postPoints.entries()) {
		const post = new THREE.Group();
		post.name = `w01-shared-post-${index}`;
		post.userData["zoneId"] = "apparel";
		const x = point[0];
		const z = point[1];
		post.position.set(x, 0, z);
		post.add(box([0.03, 3.1, 0.035], materials.bronze, [0, 1.55, 0]));
		for (const y of [0.015, 3.085])
			post.add(box([0.12, 0.03, 0.12], materials.metal, [0, y, 0]));
		root.add(post);
	}
	return root;
}
