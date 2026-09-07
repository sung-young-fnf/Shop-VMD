import { sources, viewLabels, views, zones } from "../runtime/catalog";
import type { View, ZoneId } from "../runtime/catalog";

export type Actions = {
	readonly view: (view: View) => void;
	readonly zone: (zone: ZoneId) => void;
	readonly night: () => void;
	readonly ceiling: () => void;
	readonly reset: () => void;
	readonly zoom: (factor: number) => void;
};
export function createUI(host: HTMLElement) {
	host.innerHTML = `<main id="viewer" aria-label="MLB 성수점 3D 공간"><div id="scene"></div><header class="masthead"><div class="brand">MLB<span>SEONGSU</span></div><p>DEV · 상품 레퍼런스</p></header><div class="environment"><button id="night" aria-pressed="false">야간</button><button id="ceiling" aria-pressed="false">천장</button><button id="reference">도면 보기 ↗</button></div><nav class="destinations panel" aria-label="매장 존"><div class="panel-title"><span class="eyebrow">EXPLORE THE STORE</span><h1>공간을 살펴보세요</h1></div><div class="zone-list"></div><p class="archive-note">도면 기반 재구성<br>1F 매장 · 2F 창고 · 3F 지원</p></nav><section class="selection panel" aria-live="polite"><span class="eyebrow" id="selection-sub">SPATIAL ARCHIVE / 01</span><h2 id="selection-title">성수의 새로운 시선</h2><p id="selection-note">매장을 회전하고, 집기를 선택해 자세히 살펴보세요.</p><span id="selection-source">도면 106페이지 · 상품 사진 기반 개발본</span></section><div class="bottom"><p class="gesture">드래그 회전 · 우클릭 이동 · 스크롤 확대</p><div class="toolbar panel"><div class="view-list" role="group" aria-label="카메라 보기"></div><span class="divider"></span><button id="zoom-in" aria-label="확대">+</button><button id="zoom-out" aria-label="축소">−</button><button id="reset" aria-label="초기화">↺</button></div></div><div class="compass" aria-hidden="true"><span>PLAN</span><b>↑ Z</b><small>1 UNIT = 1 M</small></div><div id="scene-status" role="status">공간을 구성하고 있습니다…</div></main><dialog aria-label="원본 도면과 참고 자료"><div class="dialog-head"><div><span class="eyebrow">SOURCE ARCHIVE</span><h2>도면과 실제 공간</h2></div><button id="close-reference" aria-label="도면 닫기">닫기 ×</button></div><div class="source-tabs"></div><img id="source-image" width="1500" height="1100" alt="MLB 성수점 원본 도면"><p id="source-note"></p><p class="source-caveat">치수는 원문 mm 기준입니다. 집기 DP-T3·DP-T2, 캐셔 크기와 일부 색온도는 도면 간 상충으로 상세도 값을 잠정 적용했습니다. 상품은 제공된 사진을 참고한 개발 모델이며 실제 진열 재고를 의미하지 않습니다.</p></dialog>`;
	function element<T extends HTMLElement>(
		selector: string,
		constructor: { new (): T },
	): T {
		const result = host.querySelector(selector);
		if (result instanceof constructor) return result;
		throw new TypeError(`Required element ${selector}`);
	}
	const scene = element("#scene", HTMLDivElement);
	element('.gesture', HTMLParagraphElement).textContent = '방향키 이동 · 드래그 회전 · 휠 확대';
	const dialog = element("dialog", HTMLDialogElement);
	const zoneList = element(".zone-list", HTMLDivElement);
	const viewList = element(".view-list", HTMLDivElement);
	const zoneButtons = new Map<ZoneId, HTMLButtonElement>();
	const viewButtons = new Map<View, HTMLButtonElement>();
	const reference = element("#reference", HTMLButtonElement);
	const sourceImage = element("#source-image", HTMLImageElement);
	const tabs = element(".source-tabs", HTMLDivElement);
	sources.forEach((source) => {
		const button = document.createElement("button");
		button.textContent = source.label;
		button.onclick = () => {
			sourceImage.src = source.image;
			sourceImage.alt = source.note;
			element("#source-note", HTMLParagraphElement).textContent = source.note;
			tabs
				.querySelectorAll("button")
				.forEach((item) =>
					item.setAttribute("aria-pressed", String(item === button)),
				);
		};
		tabs.append(button);
	});
	reference.onclick = () => {
		if(!sourceImage.hasAttribute("src")) tabs.querySelector("button")?.click();
		dialog.showModal();
	};
	element("#close-reference", HTMLButtonElement).onclick = () => dialog.close();
	dialog.addEventListener("close", () => reference.focus());
	return {
		scene,
		viewer: element('#viewer', HTMLElement),
		bind(actions: Actions) {
			zones.forEach((zone, index) => {
				const button = document.createElement("button");
				button.className = "zone";
				button.innerHTML = `<span class="ordinal">${String(index + 1).padStart(2, "0")}</span><span>${zone.label}<small>${zone.sub}</small></span><span class="zone-arrow">↗</span>`;
				button.onclick = () => actions.zone(zone.id);
				button.setAttribute("aria-pressed", "false");
				zoneButtons.set(zone.id, button);
				zoneList.append(button);
			});
			views.forEach((view) => {
				const button = document.createElement("button");
				button.textContent = viewLabels[view];
				button.onclick = () => actions.view(view);
				button.setAttribute("aria-pressed", String(view === "diorama"));
				viewButtons.set(view, button);
				viewList.append(button);
			});
			element("#night", HTMLButtonElement).onclick = actions.night;
			element("#ceiling", HTMLButtonElement).onclick = actions.ceiling;
			element("#reset", HTMLButtonElement).onclick = actions.reset;
			element("#zoom-in", HTMLButtonElement).onclick = () => actions.zoom(0.8);
			element("#zoom-out", HTMLButtonElement).onclick = () =>
				actions.zoom(1.25);
			window.addEventListener("keydown", (event) => {
				if (dialog.open || event.target instanceof HTMLInputElement) return;
				const view = views[Number(event.key) - 1];
				if (view) actions.view(view);
				if (event.key.toLowerCase() === "r") actions.reset();
				if (event.key.toLowerCase() === "n") actions.night();
				if (event.key.toLowerCase() === "c") actions.ceiling();
			});
		},
		update(
			state: {
				readonly view: View;
				readonly zone: ZoneId | null;
				readonly night: boolean;
				readonly ceiling: boolean;
			},
			fixture?: { readonly label: string; readonly pages: readonly number[] },
		) {
			viewButtons.forEach((button, view) =>
				button.setAttribute("aria-pressed", String(view === state.view)),
			);
			zoneButtons.forEach((button, zone) =>
				button.setAttribute("aria-pressed", String(zone === state.zone)),
			);
			element("#night", HTMLButtonElement).setAttribute(
				"aria-pressed",
				String(state.night),
			);
			element("#ceiling", HTMLButtonElement).setAttribute(
				"aria-pressed",
				String(state.ceiling),
			);
			document.body.classList.toggle("night", state.night);
			const zone = zones.find((item) => item.id === state.zone);
			element("#selection-title", HTMLHeadingElement).textContent =
				fixture?.label ?? zone?.label ?? "성수의 새로운 시선";
			element("#selection-sub", HTMLSpanElement).textContent =
				zone?.sub ?? `SPATIAL ARCHIVE / ${viewLabels[state.view]}`;
			element("#selection-note", HTMLParagraphElement).textContent =
				zone?.note ?? "매장을 회전하고, 집기를 선택해 자세히 살펴보세요.";
			element("#selection-source", HTMLSpanElement).textContent = zone
				? `SOURCE / p.${fixture?.pages.length ? fixture.pages.join(" / ") : zone.pages}`
				: "도면 106페이지 기반 · 상품은 예시 모델";
		},
		ready() {
			host.classList.remove("unavailable");
			element("#scene-status", HTMLDivElement).hidden = true;
		},
		fail(message: string) {
			const status = element("#scene-status", HTMLDivElement);
			status.hidden = false;
			status.className = "fallback panel";
			status.replaceChildren();
			const title = document.createElement("h2");
			title.textContent = "3D 화면을 열 수 없어요";
			const copy = document.createElement("p");
			copy.textContent = message;
			const img = document.createElement("img");
			img.src = "/sources/plan.png";
			img.alt = "MLB 성수점 1층 원본 평면도";
			const retry = document.createElement("button");
			retry.textContent = "다시 시도";
			retry.onclick = () => location.reload();
			status.append(title, copy, img, retry);
			host.classList.add("unavailable");
		},
	};
}
