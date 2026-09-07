export const views = ["diorama", "exterior", "interior", "plan"] as const;
export type View = (typeof views)[number];
export const viewLabels: Record<View, string> = {
	diorama: "디오라마",
	exterior: "외관",
	interior: "실내",
	plan: "평면",
};
export const zones = [
	{
		id: "entrance",
		label: "입구 · 파사드",
		sub: "ENTRANCE",
		target: [1.5, 1, 8.7],
		pages: "008–017 / 034 / 099–102",
		note: "블루 메탈 게이트와 야구공 손잡이",
	},
	{
		id: "central",
		label: "중앙 디스플레이",
		sub: "CENTER ZONE",
		target: [9, 1, 8],
		pages: "018 / 059–068",
		note: "곡선 아일랜드 A–F · 상품은 예시 모델",
	},
	{
		id: "headwear",
		label: "헤드웨어",
		sub: "HEADWEAR",
		target: [8, 1.2, 3],
		pages: "018 / 029 / 044–054",
		note: "모자 캐비닛 · 금속 선반·목재 하부장·메쉬",
	},
	{
		id: "footwear",
		label: "풋웨어",
		sub: "FOOTWEAR",
		target: [18, 1.2, 7],
		pages: "018 / 032 / 044–054",
		note: "5개 슈즈 캐비닛 · 진열 상품은 예시",
	},
	{
		id: "apparel",
		label: "어패럴",
		sub: "APPAREL",
		target: [9, 1.2, 14.5],
		pages: "033 / 037–043 / 055–058 / 083–095",
		note: "벽면 행거 · 브러시드 스테인리스",
	},
	{
		id: "checkout",
		label: "캐셔",
		sub: "CHECKOUT",
		target: [14, 1, 2],
		pages: "029–031 / 069–074 / 082",
		note: "p069 3300×800×1100mm 적용 · p018 2600×500과 상충",
	},
	{
		id: "custom",
		label: "모자 꾸미기",
		sub: "CUSTOMIZATION",
		target: [2, 1, 14],
		pages: "018 / 024 / 096–098",
		note: "커스터마이징 프레스 2대 · 개별 전원",
	},
	{
		id: "fitting",
		label: "피팅룸",
		sub: "FITTING ROOM",
		target: [18, 1, 13.8],
		pages: "035–036 / 076–081",
		note: "2개 피팅룸 · 목재 도어와 블루 메탈 핸들",
	},
	{
		id: "upper-storage",
		label: "상층 창고 · 지원",
		sub: "STORAGE / SUPPORT",
		target: [9, 4.4, 7],
		pages: "103–106",
		note: "2F 수납·3F 확인된 구획 / 판매층으로 재현하지 않음",
	},
] as const;
export type ZoneId = (typeof zones)[number]["id"];
export const sources = [
	{
		label: "1F 평면",
		image: "/sources/plan.png",
		note: "p018 · 길이 단위 mm / 모델 1 unit = 1m",
	},
	{
		label: "파사드",
		image: "/sources/facade.png",
		note: "p008 · 외관 입면 / 발광 색온도는 시트 간 상충",
	},
	{
		label: "천장 계획",
		image: "/sources/ceiling.png",
		note: "p025 · 바리솔 5000K / 하단2750과 보2700 간섭 미확정",
	},
	{
		label: "실내 사진",
		image: "/sources/interior.jpg",
		note: "제공 VMD OPEN REPORT · 중앙 존 정면",
	},
] as const;
