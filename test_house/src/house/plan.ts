export type Room = {
  readonly id: string;
  readonly name: string;
  readonly english: string;
  readonly area: number;
  readonly description: string;
  readonly center: readonly [number, number, number];
  readonly size: readonly [number, number];
};

export const dimensions = { floor: 0.42, eave: 3.7, ridge: 7.15, front: 5, back: -4.85, left: -12.8, right: 12.85 } as const;

export const roomFocusOffsets: Readonly<Record<string, readonly [number, number, number]>> = {
  flex: [3.4, 10.5, -4],
};

export const rooms: readonly Room[] = [
  { id: 'living', name: '거실 · 다이닝', english: 'GREAT ROOM', area: 50.1, description: '높은 박공지붕 아래 벽난로와 다이닝이 이어지는 집의 중심. 전면 프렌치 도어는 깊은 포치로 열립니다.', center: [-8.6, 0.46, 1.9], size: [8.4, 6.2] },
  { id: 'kitchen', name: '주방', english: 'KITCHEN', area: 17.5, description: '길게 놓인 아일랜드와 팜하우스 싱크. 거실과 마주하는 열린 주방입니다.', center: [-2.9, 0.46, 1.9], size: [2.95, 6.2] },
  { id: 'primary', name: '마스터 침실', english: 'PRIMARY SUITE', area: 19.2, description: '집의 조용한 동쪽 끝. 전용 욕실과 드레스룸이 연결됩니다.', center: [3.2, 0.46, 2.6], size: [4.2, 4.8] },
  { id: 'bedroom2', name: '침실 02', english: 'BEDROOM TWO', area: 12.5, description: '후면 정원을 바라보는 침실. 중앙 복도를 통해 공용 공간과 연결됩니다.', center: [-3.3, 0.46, -3.1], size: [3.8, 3.5] },
  { id: 'bedroom3', name: '침실 03', english: 'GARDEN ROOM', area: 12.3, description: '후면으로 돌출된 독립적인 방. 두 방향의 창으로 숲의 빛을 받아들입니다.', center: [-4.65, 0.46, -6.65], size: [3.6, 3.7] },
  { id: 'flex', name: '플렉스 룸', english: 'FLEX ROOM', area: 12.1, description: '서재 또는 게스트룸으로 쓰이는 유연한 공간. 측면 포치를 바라봅니다.', center: [-10.5, 0.46, -3.1], size: [4.5, 3.5] },
  { id: 'garage', name: '차고', english: 'GARAGE', area: 69.7, description: '정면의 두 출입구와 측면의 높은 문. 수납실과 머드룸을 통해 집으로 들어옵니다.', center: [9.1, 0.46, 0.05], size: [7.5, 9.85] },
  { id: 'porch', name: '랩어라운드 포치', english: 'WRAPAROUND PORCH', area: 92, description: '전면에서 측면과 후면까지 이어지는 12피트 깊이의 포치. 실내와 정원 사이에 머무는 공간입니다.', center: [-9.15, 0.46, 6.9], size: [14.7, 3.65] },
];
