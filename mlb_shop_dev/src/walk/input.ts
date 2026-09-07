export function createMovementInput(canvas: HTMLCanvasElement) {
	const keys = new Set<string>();
	const touchKeys = new Set<string>();
	const events = new AbortController();
	const options = { signal: events.signal };
	let walking = false;
	const arrows = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
	const letters = new Set(["KeyW", "KeyA", "KeyS", "KeyD"]);
	function clear() {
		keys.clear();
		touchKeys.clear();
	}
	function blocked(target: EventTarget | null) {
		return (
			Boolean(document.querySelector("dialog[open]")) ||
			(target instanceof HTMLElement &&
				Boolean(
					target.closest(
						'input,textarea,select,[contenteditable="true"],.destinations',
					),
				))
		);
	}
	canvas.tabIndex = 0;
	canvas.addEventListener(
		"pointerdown",
		() => canvas.focus({ preventScroll: true }),
		options,
	);
	window.addEventListener(
		"keydown",
		(event) => {
			if (
				event.altKey ||
				event.ctrlKey ||
				event.metaKey ||
				blocked(event.target)
			)
				return;
			if (!arrows.has(event.code) && !(walking && letters.has(event.code)))
				return;
			event.preventDefault();
			keys.add(event.code);
		},
		options,
	);
	window.addEventListener(
		"keyup",
		(event) => {
			keys.delete(event.code);
		},
		options,
	);
	window.addEventListener("blur", clear, options);
	window.addEventListener("pagehide", clear, options);
	document.addEventListener("visibilitychange", clear, options);
	document.addEventListener(
		"focusin",
		(event) => {
			if (blocked(event.target)) clear();
		},
		options,
	);
	return {
		setWalking(value: boolean) {
			walking = value;
			clear();
		},
		press(code: string) {
			touchKeys.add(code);
		},
		release(code: string) {
			touchKeys.delete(code);
		},
		read(): ReadonlySet<string> {
			if (blocked(document.activeElement) || document.hidden) clear();
			return new Set([...keys, ...touchKeys]);
		},
		clear,
		dispose() {
			clear();
			events.abort();
		},
	};
}
