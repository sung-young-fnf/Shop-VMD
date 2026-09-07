import * as THREE from "three";
import { clothesCatalog } from "../../src/products/clothes/catalog.ts";
import {
	foldedFace,
	foldedShell,
	garmentGeometry,
} from "../../src/products/clothes/geometry.ts";

const results = clothesCatalog.map((reference) => {
	const geometry = garmentGeometry(reference);
	const group = new THREE.Group();
	group.add(new THREE.Mesh(geometry.shell), new THREE.Mesh(geometry.face));
	const bounds = new THREE.Box3().setFromObject(group);
	const size = bounds.getSize(new THREE.Vector3());
	const uv = geometry.face.getAttribute("uv");
	const normal = geometry.face.getAttribute("normal");
	let forwardNormals = true;
	let validUV = true;
	const position = geometry.face.getAttribute("position");
	const normalsAtPosition = new Map<string, THREE.Vector3>();
	let continuousNormals = true;
	for (let index = 0; index < uv.count; index++) {
		const key = [
			position.getX(index),
			position.getY(index),
			position.getZ(index),
		]
			.map((value) => value.toFixed(6))
			.join(",");
		const vertexNormal = new THREE.Vector3().fromBufferAttribute(normal, index);
		const previous = normalsAtPosition.get(key);
		if (previous)
			continuousNormals &&= previous.distanceTo(vertexNormal) < 0.000001;
		normalsAtPosition.set(key, vertexNormal);
		validUV &&=
			uv.getX(index) >= 0 &&
			uv.getX(index) <= 1 &&
			uv.getY(index) >= 0 &&
			uv.getY(index) <= 1;
		forwardNormals &&= normal.getZ(index) > 0;
	}
	const pass =
		size.x <= 0.68 &&
		bounds.min.y >= -0.75 &&
		bounds.max.y < 0 &&
		size.z >= 0.03 &&
		validUV &&
		forwardNormals &&
		continuousNormals;
	if (!pass) process.exitCode = 1;
	return {
		id: reference.id,
		pass,
		size: size.toArray(),
		minY: bounds.min.y,
		triangles: (geometry.face.index?.count ?? position.count) / 3,
		validUV,
		forwardNormals,
		continuousNormals,
	};
});
const folded = new THREE.Group();
folded.add(new THREE.Mesh(foldedShell), new THREE.Mesh(foldedFace));
const foldedBounds = new THREE.Box3().setFromObject(folded);
const foldedSize = foldedBounds.getSize(new THREE.Vector3());
const foldedPass =
	Math.abs(foldedBounds.min.y) < 0.000001 &&
	foldedSize.x < 0.341 &&
	foldedSize.z < 0.301 &&
	foldedSize.y < 0.045;
if (!foldedPass) process.exitCode = 1;
console.log(
	JSON.stringify(
		{
			garments: results,
			folded: {
				pass: foldedPass,
				size: foldedSize.toArray(),
				minY: foldedBounds.min.y,
			},
		},
		null,
		2,
	),
);
