import { stripTypeScriptTypes } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import * as THREE from "three";

const directory = dirname(fileURLToPath(import.meta.url));
const compile = (file) => {
	const source = readFileSync(file, "utf8")
		.replace(
			/from ["'](\.\/[^"']+)["']/g,
			(_, value) => `from '${compile(resolve(dirname(file), `${value}.ts`))}'`,
		)
		.replace(
			/from ["'](three[^"']*)["']/g,
			(_, value) => `from '${import.meta.resolve(value)}'`,
		);
	return `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString("base64")}`;
};
const { createWallFixtures } = await import(
	compile(resolve(directory, "index.ts"))
);
const group = createWallFixtures();
const fixtures = [];
let meshes = 0;
let triangles = 0;
group.traverse((object) => {
	if (object.userData.fixtureId) fixtures.push(object);
	if (object.isMesh) {
		meshes++;
		triangles +=
			(object.geometry.index?.count ??
				object.geometry.attributes.position.count) / 3;
	}
});
assert.equal(fixtures.filter((object) => /^ca-/.test(object.name)).length, 8);
assert.equal(fixtures.filter((object) => /^sh-/.test(object.name)).length, 5);
assert.equal(
	fixtures.filter((object) => /^w03-cyl-/.test(object.name)).length,
	2,
);
assert.equal(fixtures.filter((object) => /^w04-/.test(object.name)).length, 5);
assert.equal(
	new Set(fixtures.map((object) => object.name)).size,
	fixtures.length,
);
const bounds = new THREE.Box3().setFromObject(group);
assert.ok(
	[...bounds.min.toArray(), ...bounds.max.toArray()].every(Number.isFinite),
);
assert.ok(bounds.min.y >= -0.001);
assert.ok(bounds.max.x <= 18.96 && bounds.max.z <= 15.7);
console.log(
	JSON.stringify(
		{ fixtures: fixtures.length, meshes, triangles, bounds },
		null,
		2,
	),
);
