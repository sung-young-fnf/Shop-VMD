import "./styles.css";
import "./walk.css";
import { createUI } from "./ui";
const host = document.querySelector("#app");
if (!(host instanceof HTMLElement))
	throw new TypeError("Application root unavailable");
const ui = createUI(host);
try {
	const { startRuntime } = await import("./runtime");
	await startRuntime(ui);
} catch (error) {
	if (error instanceof Error)
		ui.fail(
			"3D 공간을 불러오지 못했습니다. 아래 원본 도면을 확인해 주세요.",
		);
	else throw error;
}
