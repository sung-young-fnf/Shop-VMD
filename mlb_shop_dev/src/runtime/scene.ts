import * as THREE from "three";
import { awaitProductTextures } from "../products/loading";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createArchitecture } from "../architecture";
import { createWallFixtures } from "../wall-fixtures";
import { createCentralFixtures } from "../central-fixtures";
import { createLighting } from "../lighting";
export async function createScene(host: HTMLElement) {
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: false,
		powerPreference: "high-performance",
	});
	renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;
	host.append(renderer.domElement);
	renderer.setSize(host.clientWidth, host.clientHeight);
	renderer.domElement.setAttribute(
		"aria-label",
		"MLB 성수점 3D 매장. 드래그로 회전하고 집기를 클릭하세요.",
	);
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xe8e7e3);
	const start = performance.now();
	function renderReflection() {
		const environment = new THREE.PMREMGenerator(renderer);
		const roomEnvironment = new RoomEnvironment();
		try {
			const target = environment.fromScene(roomEnvironment, 0.04);
			scene.environment = target.texture;
			return target;
		} finally {
			roomEnvironment.dispose();
			environment.dispose();
		}
	}
	let reflectionTarget = renderReflection();
	const reflection = {
		refresh() {
			reflectionTarget.dispose();
			reflectionTarget = renderReflection();
		},
		dispose() { reflectionTarget.dispose(); },
	};
	scene.environmentIntensity = 0.55;
	const startup: Record<string, number> = {
		environment: performance.now() - start,
	};
	const model = new THREE.Group();
	for (const [name, factory] of [
		["architecture", createArchitecture],
		["wallFixtures", createWallFixtures],
		["centralFixtures", createCentralFixtures],
	] as const) {
		await new Promise<void>((resolve) => setTimeout(resolve, 0));
		const began = performance.now();
		model.add(factory());
		startup[name] = performance.now() - began;
	}
	const textureStart = performance.now();
	await awaitProductTextures();
	startup["productTextures"] = performance.now() - textureStart;
	scene.add(model);
	const light = createLighting();
	model.add(light.group);
	scene.add(...light.lights);
	const ground = new THREE.Mesh(
		new THREE.PlaneGeometry(200, 200),
		new THREE.MeshStandardMaterial({ color: 0xe8e7e3, roughness: 1 }),
	);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -0.42;
	ground.receiveShadow = true;
	scene.add(ground);
	return { renderer, scene, model, light, ground, reflection, startup };
}
