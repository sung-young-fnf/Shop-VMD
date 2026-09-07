import * as THREE from "three";
import { productEvidence } from "../products/evidence";
import { createCamera } from "./camera";
import { zones } from "./catalog";
import type { View, ZoneId } from "./catalog";
import type { createUI } from "../ui";
import { projectedFixtures, architectureCounts } from "./debug";
import type { DebugState } from "./debug";
import { bindPicking } from "./picking";
import { createScene } from "./scene";
import { bindContextRecovery } from "./context-recovery";
import { createWalking } from '../walk';
export async function startRuntime(ui: ReturnType<typeof createUI>) {
	const { renderer, scene, model, light, ground, reflection, startup } =
		await createScene(ui.scene);
	renderer.shadowMap.autoUpdate = false;
	const camera = createCamera(renderer.domElement);
	const layers: THREE.Object3D[] = [];
	const floor3: THREE.Object3D[] = [];
	const fixtures: THREE.Object3D[] = [];
	model.traverse((object) => {
		if (object.userData["upperFloor"] === 3) floor3.push(object);
		if (typeof object.userData["layer"] === "string") layers.push(object);
		if (typeof object.userData["fixtureId"] === "string") fixtures.push(object);
	});
	const state: {
		view: View;
		zone: ZoneId | null;
		fixture: string | null;
		night: boolean;
		ceiling: boolean;
	} = {
		view: "diorama",
		zone: null,
		fixture: null,
		night: false,
		ceiling: false,
	};
	const outline = new THREE.Box3Helper(new THREE.Box3(), 0x244fc7);
	outline.visible = false;
	scene.add(outline);
	let dirty = true;
	let sceneReady = false;
	let browseCeiling = state.ceiling;
	const walk = createWalking({ host: ui.viewer, model, scene, camera, changed(active) {
		if (active) { browseCeiling = state.ceiling; state.ceiling = true; }
		else state.ceiling = browseCeiling;
		visibility(); ui.update(state);
	} });
	function visibility() {
		renderer.shadowMap.needsUpdate = true;
		for (const object of floor3)
			object.visible = state.zone !== "upper-storage";
		for (const object of layers) {
			const layer: unknown = object.userData["layer"];
			object.visible =
				layer === "ceiling"
					? state.ceiling
					: layer === "upper"
						? !walk.active && (state.zone === "upper-storage" || state.view === "exterior")
						: layer === "facade-upper"
								? !walk.active && state.view === "exterior"
							: layer === "cutaway-wall"
								? walk.active || state.view === "exterior" || state.view === "interior"
								: true;
		}
		dirty = true;
	}
	function setView(view: View) {
		walk.stop();
		state.view = view;
		state.zone = null;
		state.fixture = null;
		state.ceiling = view === "interior";
		outline.visible = false;
		visibility();
		camera.preset(view);
		ui.update(state);
	}
	function selectZone(id: ZoneId, object?: THREE.Object3D) {
		walk.stop();
		const zone = zones.find((item) => item.id === id);
		if (!zone) return;
		state.zone = id;
		state.fixture = object ? String(object.userData["fixtureId"]) : null;
		state.view = "diorama";
		state.ceiling = false;
		visibility();
		const bounds = new THREE.Box3();
		if (object) bounds.setFromObject(object);
		else
			for (const fixture of fixtures)
				if (fixture.userData["zoneId"] === id) bounds.expandByObject(fixture);
		const center = bounds.isEmpty()
			? new THREE.Vector3(...zone.target)
			: bounds.getCenter(new THREE.Vector3());
		const size =
			id === "upper-storage"
				? 12
				: bounds.isEmpty()
					? 4
					: Math.min(8, bounds.getSize(new THREE.Vector3()).length() / 2);
		outline.box.copy(bounds);
		outline.visible = !bounds.isEmpty();
		const directions: Record<ZoneId, readonly [number, number, number]> = {
			entrance: [-1, 0.8, 0],
			central: [-1, 0.85, 1],
			headwear: [0, 1, 1],
			footwear: [-1, 1, 0],
			apparel: [0, 1, -1],
			checkout: [-0.5, 1.2, 1],
			custom: [1, 1.3, -1],
			fitting: [-1, 2.8, -0.7],
			"upper-storage": [-1, 1.1, 1],
		};
		camera.focus(center, size, directions[id]);
		const pages: unknown = object?.userData["sourcePages"];
		ui.update(
			state,
			object
				? {
						label: String(object.userData["label"]),
						pages: Array.isArray(pages)
							? pages.filter(
									(page: unknown): page is number => typeof page === "number",
								)
							: [],
					}
				: undefined,
		);
	}
	ui.bind({
		view: setView,
		zone: selectZone,
		night() {
			state.night = !state.night;
			light.night(state.night);
			ground.material.color.set(state.night ? 0x313946 : 0xe8e7e3);
			scene.background = new THREE.Color(state.night ? 0x202731 : 0xe8e7e3);
			ui.update(state);
			dirty = true;
		},
		ceiling() {
			state.ceiling = !state.ceiling;
			visibility();
			ui.update(state);
		},
		reset() {
			state.night = false;
			light.night(false);
			ground.material.color.set(0xe8e7e3);
			scene.background = new THREE.Color(0xe8e7e3);
			setView("diorama");
		},
		zoom: camera.zoom,
	});
	bindPicking(
		{ canvas: renderer.domElement, camera: camera.camera, model },
		(zone, object) => { if (!walk.active) selectZone(zone, object); },
	);
	let previousWidth = 0;
	let previousHeight = 0;
	const resize = new ResizeObserver(() => {
		const width = ui.scene.clientWidth,
			height = ui.scene.clientHeight;
		renderer.setSize(width, height);
		camera.viewport(width, height, walk.active);
		if (!walk.active && (previousWidth !== width || previousHeight !== height)) {
			if (state.zone) selectZone(state.zone);
			else camera.preset(state.view);
		}
		previousWidth = width;
		previousHeight = height;
		dirty = true;
	});
	resize.observe(ui.scene);
	const context = bindContextRecovery(renderer.domElement, () => {
		walk.clear();
		sceneReady = false;
		ui.fail("그래픽 연결이 중단되었습니다. 원본 평면을 확인하거나 다시 시도하세요.");
	}, () => {
		reflection.refresh();
		renderer.shadowMap.needsUpdate = true;
		dirty = true;
	});
	Object.defineProperty(window, "__MLB_DEBUG__", {
		configurable: true,
		get: (): DebugState => ({
			...state,
			products: productEvidence(model),
			navigation: walk.debug(),
			startup,
			sceneBounds: {
				min: new THREE.Box3().setFromObject(model).min.toArray(),
				max: new THREE.Box3().setFromObject(model).max.toArray(),
			},
			architectureCounts: architectureCounts(model),
			cutaway: state.view !== "exterior",
			sceneReady,
			cameraSettled: camera.settled,
			camera: camera.camera.position.toArray(),
			target: camera.controls.target.toArray(),
			stats: {
				calls: renderer.info.render.calls,
				triangles: renderer.info.render.triangles,
				geometries: renderer.info.memory.geometries,
				textures: renderer.info.memory.textures,
			},
			visibleGroups: layers.map((object) => ({
				name: object.name,
				layer: String(object.userData["layer"]),
				visible: object.visible,
			})),
			fixtures: projectedFixtures(fixtures, camera.camera, renderer.domElement),
		}),
	});
	visibility();
	ui.update(state);
	await renderer.compileAsync(scene, camera.camera);
	let previous = performance.now();
	renderer.setAnimationLoop((time) => {
		const delta = Math.min((time - previous) / 1000, 0.05);
		previous = time;
		if (document.hidden || !context.available) return;
		const moved = walk.update(delta);
		const changed = camera.update(delta) || moved;
		if (walk.active && moved) renderer.shadowMap.needsUpdate = true;
		if (changed || dirty || !sceneReady) {
			renderer.render(scene, camera.camera);
			dirty = false;
			if (!sceneReady) {
				sceneReady = true;
				ui.ready();
			}
		}
	});
	window.addEventListener("pageshow", (event) => {
		if(event.persisted){dirty=true;previous=performance.now();}
	});
	window.addEventListener("pagehide", (event) => {
		if(event.persisted) return;
		walk.dispose();
		context.dispose();
		renderer.setAnimationLoop(null);
		resize.disconnect();
		camera.controls.dispose();
		reflection.dispose();
		renderer.dispose();
	});
}
