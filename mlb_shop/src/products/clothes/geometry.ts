import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import type { GarmentReference } from "./catalog";

const imageWidth = 899;
const imageHeight = 1200;
const scale = 0.00084;
const sourceTop = 240;

export function garmentGeometry(reference: GarmentReference) {
	const points = reference.outline.map(
		([x, y]) =>
			new THREE.Vector2(
				(x - imageWidth / 2) * scale,
				-0.115 - (y - sourceTop) * scale,
			),
	);
	const shape = new THREE.Shape(points);
	const shell = new THREE.ExtrudeGeometry(shape, {
		depth: 0.022,
		bevelEnabled: true,
		bevelSegments: 2,
		bevelSize: 0.0015,
		bevelThickness: 0.0015,
		steps: 1,
	});
	shell.translate(0, 0, -0.012);
	const initial = new THREE.ShapeGeometry(shape).toNonIndexed();
	const vertices: number[] = [];
	const uvs: number[] = [];
	const addTriangle = (
		triangle: readonly THREE.Vector2[],
		depth: number,
	): void => {
		const [a, b, c] = triangle;
		if (!a || !b || !c) return;
		if (depth > 0) {
			const ab = a.clone().add(b).multiplyScalar(0.5);
			const bc = b.clone().add(c).multiplyScalar(0.5);
			const ca = c.clone().add(a).multiplyScalar(0.5);
			for (const next of [
				[a, ab, ca],
				[ab, b, bc],
				[ca, bc, c],
				[ab, bc, ca],
			])
				addTriangle(next, depth - 1);
			return;
		}
		for (const point of triangle) {
			let edgeDistance = 1;
			for (let edge = 0; edge < points.length; edge++) {
				const start = points[edge];
				const end = points[(edge + 1) % points.length];
				if (!start || !end) continue;
				const vector = end.clone().sub(start);
				const t = THREE.MathUtils.clamp(
					point.clone().sub(start).dot(vector) / vector.lengthSq(),
					0,
					1,
				);
				edgeDistance = Math.min(
					edgeDistance,
					point.distanceTo(start.clone().addScaledVector(vector, t)),
				);
			}
			const volume = Math.min(edgeDistance * 0.5, 0.012);
			const drape = 0.8 + 0.2 * Math.cos(point.x * 60 + point.y * 5);
			vertices.push(point.x, point.y, 0.012 + volume * drape);
			uvs.push(
				(point.x / scale + imageWidth / 2) / imageWidth,
				1 - (sourceTop + (-point.y - 0.115) / scale) / imageHeight,
			);
		}
	};
	const positions = initial.getAttribute("position");
	for (let index = 0; index < positions.count; index += 3) {
		addTriangle(
			[0, 1, 2].map(
				(offset) =>
					new THREE.Vector2(
						positions.getX(index + offset),
						positions.getY(index + offset),
					),
			),
			3,
		);
	}
	initial.dispose();
	const face = new THREE.BufferGeometry();
	face.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
	face.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
	const smoothFace = mergeVertices(face, 0.000001);
	face.dispose();
	smoothFace.computeVertexNormals();
	return { shell, face: smoothFace };
}

export const foldedShell = new THREE.BoxGeometry(0.34, 0.035, 0.3, 8, 1, 8);
const foldedPositions = foldedShell.getAttribute("position");
for (let index = 0; index < foldedPositions.count; index++) {
	const x = foldedPositions.getX(index);
	const z = foldedPositions.getZ(index);
	const lift =
		Math.max(0, 1 - (x / 0.17) ** 2) * Math.max(0, 1 - (z / 0.15) ** 2) * 0.004;
	foldedPositions.setY(index, foldedPositions.getY(index) + 0.0175 + lift);
}
foldedShell.computeVertexNormals();

export const foldedFace = new THREE.PlaneGeometry(0.325, 0.285, 12, 12);
foldedFace.rotateX(-Math.PI / 2);
const foldedFacePositions = foldedFace.getAttribute("position");
const foldedUV = foldedFace.getAttribute("uv");
for (let index = 0; index < foldedFacePositions.count; index++) {
	const x = foldedFacePositions.getX(index);
	const z = foldedFacePositions.getZ(index);
	const lift =
		Math.max(0, 1 - (x / 0.17) ** 2) * Math.max(0, 1 - (z / 0.15) ** 2) * 0.004;
	foldedFacePositions.setY(index, 0.0355 + lift);
	foldedUV.setXY(
		index,
		0.285 + foldedUV.getX(index) * 0.43,
		0.43 + foldedUV.getY(index) * 0.29,
	);
}
foldedFace.computeVertexNormals();
