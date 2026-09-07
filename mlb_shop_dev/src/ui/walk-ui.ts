export function createWalkUI(
	host: HTMLElement,
	actions: {
		readonly toggle: () => void;
		readonly press: (code: string) => void;
		readonly release: (code: string) => void;
	},
) {
	const toggle = document.createElement("button");
	toggle.id = "walk-toggle";
	toggle.className = "walk-toggle panel";
	toggle.textContent = "사람으로 걸어보기";
	toggle.setAttribute("aria-pressed", "false");
	toggle.onclick = actions.toggle;
	const panel = document.createElement("section");
	panel.id = "walk-controls";
	panel.className = "walk-controls panel";
	panel.setAttribute("aria-label", "1층 보행 조작");
	panel.hidden = true;
	const help = document.createElement("p");
	help.textContent =
		"1층 걸어보기 · 방향키 / WASD 이동 · 드래그 시선 · Esc 종료";
	const pad = document.createElement("div");
	const perspective = document.createElement("p");
	perspective.id = "walk-perspective";
	perspective.textContent = "3인칭 따라가기";
	pad.className = "walk-pad";
	pad.setAttribute("role", "group");
	pad.setAttribute("aria-label", "캐릭터 이동");
	for (const [code, symbol, label] of [
		["ArrowUp", "↑", "앞으로 이동"],
		["ArrowLeft", "←", "왼쪽으로 이동"],
		["ArrowDown", "↓", "뒤로 이동"],
		["ArrowRight", "→", "오른쪽으로 이동"],
	] as const) {
		const button = document.createElement("button");
		button.dataset["direction"] = code;
		button.textContent = symbol;
		button.setAttribute("aria-label", label);
		button.onpointerdown = (event) => {
			event.preventDefault();
			button.setPointerCapture(event.pointerId);
			actions.press(code);
			button.dataset["held"] = "true";
		};
		const release = () => {
			actions.release(code);
			delete button.dataset["held"];
		};
		button.onpointerup = release;
		button.onpointercancel = release;
		button.onlostpointercapture = release;
		button.onkeydown = (event) => {
			if (event.key === " " || event.key === "Enter") {
				event.preventDefault();
				actions.press(code);
			}
		};
		button.onkeyup = release;
		button.onblur = release;
		pad.append(button);
	}
	panel.append(help, pad, perspective);
	host.append(toggle, panel);
	return {
		perspective(firstPerson: boolean) {
			const label = firstPerson
				? "1인칭 · 벽 가까이에서 시야 보호"
				: "3인칭 따라가기";
			if (perspective.textContent !== label) perspective.textContent = label;
		},
		update(active: boolean) {
			host.classList.toggle("walking", active);
			panel.hidden = !active;
			toggle.textContent = active ? "탐색으로 돌아가기" : "사람으로 걸어보기";
			toggle.setAttribute("aria-pressed", String(active));
		},
		focus() {
			toggle.focus({ preventScroll: true });
		},
		dispose() {
			toggle.remove();
			panel.remove();
		},
	};
}
