import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export function createLighting() {
	const group = new THREE.Group();
	group.name = "ceiling-lighting-systems";
	group.userData["layer"] = "ceiling";
	group.userData["sourcePages"] = [25, 26, 27, 28];
	const metal = new THREE.MeshStandardMaterial({
		color: 0x343637,
		roughness: 0.54,
		metalness: 0.6,
	});
	const membrane = new THREE.MeshStandardMaterial({
		color: 0xf5f7ff,
		emissive: 0xe8efff,
		emissiveIntensity: 1.3,
		roughness: 0.8,
	});
	const railEmitter = new THREE.MeshStandardMaterial({color:0xfff3df,emissive:0xffe6bc,emissiveIntensity:1.15,roughness:.8});
	function box(
		size: readonly [number, number, number],
		position: readonly [number, number, number],
		material: THREE.Material,
	) {
		const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
		mesh.position.set(...position);
		group.add(mesh);
		return mesh;
	}
	const curvedPanel = new THREE.Shape();
	curvedPanel.moveTo(0.95, -2.145);
	curvedPanel.lineTo(-0.25, -2.145);
	curvedPanel.quadraticCurveTo(-0.95, -2.145, -0.95, -1.445);
	curvedPanel.lineTo(-0.95, 1.445);
	curvedPanel.quadraticCurveTo(-0.95, 2.145, -0.25, 2.145);
	curvedPanel.lineTo(0.95, 2.145);
	curvedPanel.closePath();
	const curvedFrame = new THREE.Mesh(
		new THREE.ExtrudeGeometry(curvedPanel, {
			depth: 0.15,
			bevelEnabled: false,
			curveSegments: 16,
		}),
		metal,
	);
	curvedFrame.rotation.x = Math.PI / 2;
	curvedFrame.position.set(4.85, 2.9, 8);
	group.add(curvedFrame);
	const curvedFilm = new THREE.Mesh(
		new THREE.ShapeGeometry(curvedPanel, 16),
		membrane,
	);
	curvedFilm.rotation.x = Math.PI / 2;
	curvedFilm.position.set(4.85, 2.748, 8);
	curvedFilm.scale.set(0.96, 0.98, 1);
	group.add(curvedFilm);
	for (const [x, z, width, depth] of [
		[8.1, 6.45, 2.3, 1.765],
		[11.1, 6.45, 2.465, 1.765],
		[8.1, 9.2, 2.3, 1.765],
		[11.1, 9.2, 2.465, 1.765],
	] as const) {
		box([width + 0.08, 0.15, depth + 0.08], [x, 2.825, z], metal);
		box([width, 0.025, depth], [x, 2.749, z], membrane);
	}
	const counter = new THREE.Mesh(
		new THREE.CylinderGeometry(1.2, 1.2, 0.15, 48),
		metal,
	);
	counter.position.set(13.4, 2.445, 2.7);
	group.add(counter);
	const disk = new THREE.Mesh(new THREE.CircleGeometry(1.16, 48), membrane);
	disk.rotation.x = Math.PI / 2;
	disk.position.set(13.4, 2.369, 2.7);
	group.add(disk);
	for (const z of [12.65, 14.6]) {
		box([1.75, 0.15, 1.65], [18, 2.445, z], metal);
		box([1.67, 0.02, 1.57], [18, 2.368, z], membrane);
	}
	for (const x of [1.3, 2.8, 4.3, 6, 7.6, 9.3, 10.8, 12.7, 14.2, 16, 17.5])
		for (const z of [3.75, 12.7]) box([0.045, 0.045, 2.4], [x, 2.8, z], metal);
	for (let i = 0; i < 56; i++) {
		const x = 1.25 + (i % 14) * 1.23;
		const z = 3.4 + Math.floor(i / 14) * 3.2;
		box([0.27, 0.082, 0.033], [x, 2.735, z], metal);
		box([0.24, 0.012, 0.03], [x, 2.687, z], railEmitter);
	}
	for (let i = 0; i < 19; i++)
		box(
			[0.068, 0.055, 1.15],
			[1.35 + (i % 10) * 1.7, 2.75, i < 10 ? 4.2 : 12.5],
			railEmitter,
		);
	for (const x of [5.5, 13.2])
		for (const z of [3.5, 12.6]) {
			box([0.85, 0.11, 0.85], [x, 2.9, z], metal);
			box(
				[0.58, 0.02, 0.58],
				[x, 2.837, z],
				new THREE.MeshStandardMaterial({ color: 0x777c7a, roughness: 0.9 }),
			);
		}
	for (let i = 0; i < 8; i++) {
		const camera = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 6), metal);
		camera.position.set(2 + (i % 4) * 4.8, 2.66, i < 4 ? 3 : 13);
		group.add(camera);
	}
	for (const x of [2, 16])
		for (const z of [3.3, 8, 13]) box([0.18, 0.16, 0.18], [x, 2.72, z], metal);
	const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
	for (const child of [...group.children]) {
		if (!(child instanceof THREE.Mesh) || Array.isArray(child.material))
			continue;
		child.updateMatrix();
		const geometry = child.geometry.index
			? child.geometry.toNonIndexed()
			: child.geometry.clone();
		geometry.applyMatrix4(child.matrix);
		geometry.deleteAttribute("uv");
		const batch = batches.get(child.material) ?? [];
		batch.push(geometry);
		batches.set(child.material, batch);
		group.remove(child);
		child.geometry.dispose();
	}
	for (const [material, geometries] of batches) {
		const geometry = mergeGeometries(geometries);
		if (geometry) group.add(new THREE.Mesh(geometry, material));
		for (const source of geometries) source.dispose();
	}
	const ambient = new THREE.HemisphereLight(0xf6f7ff, 0x85827c, 2.5);
	const sun = new THREE.DirectionalLight(0xfff7e8, 3.3);
	sun.position.set(-6, 24, 10);
	sun.castShadow = true;
	sun.shadow.mapSize.set(2048, 2048);
	sun.shadow.camera.left = -25;
	sun.shadow.camera.right = 25;
	sun.shadow.camera.top = 25;
	sun.shadow.camera.bottom = -25;
	sun.shadow.normalBias = 0.04;
	const fill = new THREE.DirectionalLight(0xe2ecff, 1.5);
	fill.position.set(22, 14, -8);
	const interior = new THREE.PointLight(0xf4f4ff, 55, 24, 1.5);
	interior.position.set(9, 2.5, 8);
	return {
		group,
		lights: [ambient, sun, fill, interior],
		night(value: boolean) {
			ambient.intensity = value ? 1.3 : 2.5;
			sun.intensity = value ? 0.7 : 3.3;
			fill.intensity = value ? 0.9 : 1.5;
			interior.intensity = value ? 90 : 55;
			membrane.emissiveIntensity = value ? 2 : 1.3;
			railEmitter.emissiveIntensity = value ? 1.7 : 1.15;
		},
	};
}
