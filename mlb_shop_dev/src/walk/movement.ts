export type FloorPoint = { readonly x: number; readonly z: number };

export function movementAxis(keys: ReadonlySet<string>): FloorPoint {
	const x =
		Number(keys.has("ArrowRight") || keys.has("KeyD")) -
		Number(keys.has("ArrowLeft") || keys.has("KeyA"));
	const z =
		Number(keys.has("ArrowUp") || keys.has("KeyW")) -
		Number(keys.has("ArrowDown") || keys.has("KeyS"));
	const length = Math.hypot(x, z) || 1;
	return { x: x / length, z: z / length };
}

export function moveWithCollision(
	start: FloorPoint,
	delta: FloorPoint,
	canMove: (from: FloorPoint, to: FloorPoint) => boolean,
): FloorPoint {
	const steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.z) / 0.06));
	let current = start;
	for (let step = 0; step < steps; step++) {
		const nextX = { x: current.x + delta.x / steps, z: current.z };
		if (canMove(current, nextX)) current = nextX;
		const nextZ = { x: current.x, z: current.z + delta.z / steps };
		if (canMove(current, nextZ)) current = nextZ;
	}
	return current;
}
