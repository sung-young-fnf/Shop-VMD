import * as THREE from "three";

export function createVisitor() {
	const root = new THREE.Group();
	root.name = "Original visitor · articulated walking asset";
	const materials = {
		jacket: new THREE.MeshStandardMaterial({
			color: "#244fc7",
			roughness: 0.85,
		}),
		dark: new THREE.MeshStandardMaterial({ color: "#202329", roughness: 0.95 }),
		ivory: new THREE.MeshStandardMaterial({ color: "#faf9f5", roughness: 0.8 }),
		skin: new THREE.MeshStandardMaterial({ color: "#c58d68", roughness: 0.9 }),
		hair: new THREE.MeshStandardMaterial({ color: "#302924", roughness: 1 }),
	};
	const body = new THREE.Group();
	root.add(body);
	function mesh(
		geometry: THREE.BufferGeometry,
		material: THREE.Material,
		position: readonly [number, number, number],
	) {
		const result = new THREE.Mesh(geometry, material);
		result.position.set(...position);
		result.castShadow = true;
		result.receiveShadow = true;
		return result;
	}
	function joint(
		name: string,
		position: readonly [number, number, number],
		parent = body,
	) {
		const result = new THREE.Group();
		result.name = name;
		result.position.set(...position);
		parent.add(result);
		return result;
	}
	body.add(
		mesh(
			new THREE.CylinderGeometry(0.23, 0.18, 0.49, 12),
			materials.jacket,
			[0, 1.24, 0],
		),
	);
	body.add(
		mesh(
			new THREE.BoxGeometry(0.18, 0.4, 0.025),
			materials.ivory,
			[0, 1.24, 0.18],
		),
	);
	body.add(
		mesh(new THREE.BoxGeometry(0.33, 0.18, 0.24), materials.dark, [0, 0.96, 0]),
	);
	body.add(
		mesh(
			new THREE.CylinderGeometry(0.065, 0.07, 0.12, 10),
			materials.skin,
			[0, 1.53, 0],
		),
	);
	const head = mesh(
		new THREE.SphereGeometry(0.145, 16, 12),
		materials.skin,
		[0, 1.67, 0],
	);
	head.scale.set(0.86, 1, 0.9);
	body.add(head);
	body.add(
		mesh(
			new THREE.SphereGeometry(0.149, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
			materials.dark,
			[0, 1.7, 0],
		),
	);
	body.add(
		mesh(
			new THREE.BoxGeometry(0.26, 0.018, 0.16),
			materials.dark,
			[0, 1.71, 0.13],
		),
	);
	for (const x of [-0.048, 0.048])
		body.add(
			mesh(new THREE.SphereGeometry(0.012, 6, 6), materials.hair, [
				x,
				1.68,
				0.119,
			]),
		);
	body.add(
		mesh(
			new THREE.SphereGeometry(0.025, 8, 6),
			materials.skin,
			[0, 1.64, 0.13],
		),
	);
	const limbs = [-1, 1].map((side) => {
		const shoulder = joint(`shoulder-${side}`, [side * 0.245, 1.43, 0]);
		shoulder.add(
			mesh(
				new THREE.CapsuleGeometry(0.073, 0.23, 4, 8),
				materials.jacket,
				[0, -0.14, 0],
			),
		);
		const elbow = joint(`elbow-${side}`, [0, -0.29, 0], shoulder);
		elbow.add(
			mesh(
				new THREE.CapsuleGeometry(0.059, 0.2, 4, 8),
				materials.jacket,
				[0, -0.12, 0],
			),
		);
		elbow.add(
			mesh(
				new THREE.SphereGeometry(0.06, 10, 8),
				materials.skin,
				[0, -0.27, 0],
			),
		);
		const hip = joint(`hip-${side}`, [side * 0.105, 0.91, 0]);
		hip.add(
			mesh(
				new THREE.CapsuleGeometry(0.085, 0.27, 4, 8),
				materials.dark,
				[0, -0.19, 0],
			),
		);
		const knee = joint(`knee-${side}`, [0, -0.4, 0], hip);
		knee.add(
			mesh(
				new THREE.CapsuleGeometry(0.07, 0.27, 4, 8),
				materials.dark,
				[0, -0.18, 0],
			),
		);
		knee.add(
			mesh(
				new THREE.BoxGeometry(0.16, 0.11, 0.28),
				materials.ivory,
				[0, -0.45, 0.055],
			),
		);
		knee.add(
			mesh(
				new THREE.BoxGeometry(0.17, 0.025, 0.29),
				materials.dark,
				[0, -0.4975, 0.055],
			),
		);
		return { shoulder, elbow, hip, knee, side };
	});
	let phase = 0;
	return {
		root,
		animate(distance: number, reduced: boolean) {
			phase += distance * 7;
			const amplitude = distance > 0 && !reduced ? 1 : 0;
			for (const limb of limbs) {
				const swing = Math.sin(phase) * limb.side * amplitude;
				limb.hip.rotation.x = swing * 0.48;
				limb.knee.rotation.x = Math.max(0, -swing) * 0.65;
				limb.shoulder.rotation.x = -swing * 0.38;
				limb.elbow.rotation.x = -0.15 - Math.max(0, swing) * 0.2;
			}
			body.position.y = Math.abs(Math.sin(phase)) * 0.025 * amplitude;
		},
		dispose() {
			root.traverse((object) => {
				if (object instanceof THREE.Mesh) object.geometry.dispose();
			});
			for (const material of Object.values(materials)) material.dispose();
		},
	};
}
