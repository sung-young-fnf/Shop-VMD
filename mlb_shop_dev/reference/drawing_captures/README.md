# MLB 성수점 · 제작 위임용 도면 캡처

원본 PDF를 직접 렌더링한 증거 이미지다. AI가 다시 그린 도면이나 Three.js 완성 이미지가 아니다. 기존 PDF와 보고서 JPG는 수정하지 않았다.

## 먼저 열 파일

1. [매장 구성·구현 총괄 문서](../../analysis/MLB_성수점_매장구성_및_Threejs_구현명세.md).
2. [1층 전체 평면 p018](pages/page-018.png), [외관 정면 p008](pages/page-008.png), [실내 A면 p029](pages/page-029.png), [실내 B면 p032](pages/page-032.png), [실내 C면 p033](pages/page-033.png), [정문 내측 D면 p034](pages/page-034.png).
3. [106페이지 제목·담당·전체 캡처 색인](../../analysis/PAGE_INDEX.md).

## 폴더별 위임

| 제작 범위 | 먼저 읽을 문서 | 확대 캡처 폴더/목록 | 필수 전체 페이지 |
|---|---|---|---|
| 외관·정문·배너·간판 | [외관 분석](../../analysis/parts/01_facade.md) | [01_facade/manifest.json](01_facade/manifest.json) | p008–017, p101–102 |
| 1층 골조·벽·구역·피팅룸 | [공간 분석](../../analysis/parts/02_spatial.md) | [02_spatial/manifest.json](02_spatial/manifest.json) | p018–022, p029–036 |
| 재료·천장·조명·설비 | [재료·설비 분석](../../analysis/parts/03_materials.md) | [03_materials/manifest.json](03_materials/manifest.json) | p001–007, p023–028 |
| 신발·모자·의류 벽면 집기 | [벽면 집기 분석](../../analysis/parts/04_wall_fixtures.md) | [04_wall_fixtures/manifest.json](04_wall_fixtures/manifest.json) | p037–058, p083–095, p099–100 |
| 중앙 곡선 집기·카운터·모꾸존·피팅 부품 | [중앙·서비스 분석](../../analysis/parts/05_central_service.md) | [05_central_service/manifest.json](05_central_service/manifest.json) | p059–082, p096–098 |
| 2·3층 부속 공간·창고 | [상층부 분석](../../analysis/parts/06_upper_boh.md) | [06_upper_boh/manifest.json](06_upper_boh/manifest.json) | p103–106 |

`pages/`에는 106페이지 전체 캡처, `overview/`에는 16페이지씩 묶은 개요 이미지 7장, 구역별 폴더에는 확대 캡처151개가 있다. 전체 페이지는 1.5배(약 1787×1263px), 담당별 확대 캡처는 2~4배로 PDF에서 다시 렌더링했다. 치수 판독에는 확대 캡처 또는 원본 PDF를 사용한다.

각 담당 문서 안의 캡처 목록은 파일별 용도를 설명한다. `manifest.json`은 이미지 파일명, PDF 페이지(1부터), PDF 좌상단 기준 크롭 좌표(pt), 렌더 배율과 부품 코드를 담는다. [pages_manifest.json](pages_manifest.json)은 원본 해시와 전체 페이지 렌더 메타데이터다.

## 위임 메시지 예

```text
analysis/MLB_성수점_매장구성_및_Threejs_구현명세.md와 담당 파트 문서를 읽어.
reference/drawing_captures에서 p018 전체 평면과 담당 manifest의 확대 캡처를 함께 확인해.
전체 좌표계는 총괄 구현 명세와 일치시키고, 담당 집기만 제작해.
상세도 수량을 완제품 수량과 중복 합산하지 마.
CONFLICT 항목의 미확정 치수는 임의로 확정하지 말고 채택한 가정을 보고해.
구현 결과에서 사용한 원본 PDF 페이지와 캡처 파일을 추적할 수 있게 남겨.
```

캡처에는 원본의 표제란·업체 연락처가 포함될 수 있다. 프로젝트 내부 분석·제작 인계용이며, 웹에 공개할 때는 원본 권리와 개인정보를 별도로 확인해야 한다. 공사 가림막(p015–016), 철거도(p020), 임시 행사 메모(p018)는 최종 매장에 자동 포함하지 않는다.
