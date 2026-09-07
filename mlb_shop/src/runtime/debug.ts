import * as THREE from "three";
import type { View, ZoneId } from "./catalog";
import type { productEvidence } from "../products/evidence";
export type DebugState = {
	readonly products: ReturnType<typeof productEvidence>;
	readonly navigation: { readonly mode: string; readonly position: readonly number[]; readonly heading: number; readonly moving: boolean; readonly collisionMeshes: number };
	readonly startup: Readonly<Record<string, number>>;
	readonly view: View;
	readonly zone: ZoneId | null;
	readonly fixture: string | null;
	readonly night: boolean;
	readonly ceiling: boolean;
	readonly cutaway: boolean;
	readonly sceneReady: boolean;
	readonly cameraSettled: boolean;
	readonly camera: readonly number[];
	readonly target: readonly number[];
	readonly sceneBounds: {
		readonly min: readonly number[];
		readonly max: readonly number[];
	};
	readonly architectureCounts: Readonly<Record<string, number>>;
	readonly stats: {
		readonly calls: number;
		readonly triangles: number;
		readonly geometries: number;
		readonly textures: number;
	};
	readonly visibleGroups: readonly {
		readonly name: string;
		readonly layer: string;
		readonly visible: boolean;
	}[];
	readonly fixtures: readonly {
		readonly id: string;
		readonly zone: string;
		readonly x: number;
		readonly y: number;
		readonly visible: boolean;
		readonly worldBounds: {
			readonly min: readonly number[];
			readonly max: readonly number[];
		};
		readonly sourcePages: readonly number[];
		readonly productCode: string | null;
	}[];
};
declare global {
	interface Window {
		readonly __MLB_DEBUG__: DebugState;
	}
}
export function projectedFixtures(
	fixtures: readonly THREE.Object3D[],
	camera: THREE.Camera,
	canvas: HTMLCanvasElement,
) {
	return fixtures.map((object) => {
		const bounds = new THREE.Box3().setFromObject(object);
		const point = bounds.getCenter(new THREE.Vector3()).project(camera);
		let visible = object.visible;
		let zone: unknown = object.userData["zoneId"];
		object.traverseAncestors((parent) => {
			if (!parent.visible) visible = false;
			if (typeof zone !== "string") zone = parent.userData["zoneId"];
		});
		const pages: unknown = object.userData["sourcePages"];
		return {
			id: String(object.userData["fixtureId"]),
			zone: typeof zone === "string" ? zone : "",
			x: ((point.x + 1) * canvas.clientWidth) / 2,
			y: ((1 - point.y) * canvas.clientHeight) / 2,
			visible: visible && point.z >= -1 && point.z < 1,
			worldBounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
			sourcePages: Array.isArray(pages)
				? pages.filter(
						(page: unknown): page is number => typeof page === "number",
					)
				: [],
			productCode:
				typeof object.userData["productCode"] === "string"
					? object.userData["productCode"]
					: null,
		};
	});
}
export function architectureCounts(model: THREE.Object3D) {
	const counts: Record<string, number> = {};
	model.traverse((object) => {
		const kind: unknown = object.userData["countKind"];
		if (typeof kind === "string")
			counts[kind] =
				(counts[kind] ?? 0) +
				(object instanceof THREE.InstancedMesh ? object.count : 1);
	});
	return counts;
}
