# 검증 사례: 3ACVSP46N / 50BKS

아래 값은 다른 신발의 기본값이나 통과 조건이 아니다. 해당 저장소가 없어도 SKILL.md와 다른 참조 문서만으로 사용할 수 있다.

원래 저장소: `C:/Users/AC1143/Project/Project/shop_vmd`.
이하 경로는 이 저장소 기준의 과거 기록이다. 현재 서버 실행 여부와 파일 해시는 새 작업에서 확인한다.

- 기존 절차: `shoe_photo_realism.md`.
- CAD: `mlb_shop_dev/reference/shoes/cad/3ACVSP46N.jpg`.
- 구현: `mlb_shop_dev/shoe_cad_viewer`.
- 모델 진입점: 위 프로젝트의 `src/assembly.ts` / `createShoe()`.
- 자료: `public/assets/source/provenance.json`, `public/assets/cad/cad-spec.json`, `evidence/cad/cad-analysis.md`.
- 인계: `evidence/HANDOFF.md`, `evidence/completion-audit.md`.
- 검수: `evidence/qa/final-6/manifest.json`, `evidence/reviews/delivery-functional.md`, `evidence/reviews/delivery-visual.md`.
- 감독 기록: `evidence/team/team-62812ba1/artifacts/`.

CAD는 737×512 래스터 사양서였다. 기존 크림 LA와 색상이 달라 공식 상품 자료에서 같은 스타일의 블랙 NY50BKS 원본 9장(각 2000×2667)을 확보했다. 매크로가 충분해 AI 업스케일은 하지 않았다. 엄밀한 정면, 제거된 인솔과 완전히 가려진 내부 사진은 없었으며 추정 범위를 공개했다. 새 작업에서는 이 스킬의 사진 확보 게이트에 따라 필요한 미확보 면의 추정 허용 여부를 먼저 해결한다.

240mm는 샘플 사이즈이며 밑창 길이가 아니다. 스웨이드 1.2mm, 아이렛 표기 8mm, 자수 높이 48mm, 라벨 폭 36mm, 지그재그 도식 3mm는 각각 대상과 모호함을 구분했다. 하단 한 쌍의 작은 인솔 윤곽은 비대칭 내부 평면을 안내하는 데 사용했다.

사진의 납작한 직조 끈과 MLB 인솔 프린트는 CAD ROUND 끈/작은 복합 인쇄 지시와 달랐다. 실제 생산 상품 외관을 목표로 사진을 우선하고 충돌을 기록했다.

반복 수정에서 확인한 점:

- 좌우 구멍 높이 차이는 공통 사진 등록에서 해결했다. 윗면만 낮추면 높은 안쪽 벽이 생겼다.
- 실제 끈은 아래 가로줄 하나와 인접 줄 사이 X자 5쌍이었다. 같은 줄 U자 6개 가정은 가림과 고리 관계를 틀리게 만들었다. 총 11줄은 이 신발만의 사례다.
- 회색 안감 띠는 곡면 단면·법선·조직 크기·연속 UV·기록된 밝기 보정을 함께 수정했다.
- 갑피의 작은 갈색 조각은 고무가 공유 경계 틈으로 보인 것으로 픽셀 중심 raycast로 구분했다.

당시 승인된 소스/에셋 해시:
`367335fe482009c76eb48946fece5dfee8f7a8b2ad55f81a7b5841b5d37e063d`.
114개 캡처, 57개 상태, 9개 사진 비교, 62개 검사, 144개 런타임 텍스처 기록으로 기능·시각 검수가 통과했다. 사진 기반 재구성의 검증이며 스캔 정확도·측정 PBR·향후 변경본의 통과가 아니다. 당시 포트 5190도 새 작업에 강제하지 않는다.
