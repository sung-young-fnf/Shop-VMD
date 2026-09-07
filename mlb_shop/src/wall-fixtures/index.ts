import * as THREE from "three";
import { createCabinetWalls } from "./cabinets";
import { createApparelWalls } from "./apparel";
import { applyWoodGrain, batchFixture } from "./surfaces";

export function createWallFixtures(): THREE.Group {
	const root = new THREE.Group();
	root.name = "wall-fixtures";
	applyWoodGrain();
	root.add(createCabinetWalls(), createApparelWalls());
	root.traverse((object) => {
		if (
			object instanceof THREE.Group &&
			typeof object.userData["fixtureId"] === "string"
		)
			batchFixture(object);
	});
	return root;
}
