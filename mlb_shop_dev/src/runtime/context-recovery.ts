export function bindContextRecovery(
	canvas: HTMLCanvasElement,
	onLost: () => void,
	onRestored: () => void,
) {
	const events = new AbortController();
	let available = true;
	canvas.addEventListener("webglcontextlost", (event) => {
		event.preventDefault();
		available = false;
		onLost();
	}, { signal: events.signal });
	canvas.addEventListener("webglcontextrestored", () => {
		onRestored();
		available = true;
	}, { signal: events.signal });
	return {
		get available() { return available; },
		dispose() { events.abort(); },
	};
}
