# 치즈 (CHEESE) — MLBL-2518 / MLBM-2529

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2518_MLBM-2529` |
| 라스트 (LAST NO.) | `MLBL-2518` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2529` |
| style_code | `M26NSXEE1` (1개) |
| TYPE1 (라스트 카테고리) | SNEAKERS |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-280 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서+치수 |
| 확보 뷰 | 측면 · 텅라벨(치수) · 힐탭 상세(치수) · 토/힐 부위 상세 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 1 / 2 |
| 성수점 재고 합 (2026-09-06) | 37 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASXEE16N` | 치즈 | 26SS / 1ST | 26S | 2 | 50BKS, 50WHS |  | MLBL-2518 | MLBM-2529 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASXEE16N` | 10mm;27mm;42mm;35mm;12mm;42mm;5mm;0.8mm;47mm;18mm;100mm;16mm;80mm;10mm;70mm;12mm;20mm;25mm;35mm;12mm;1.5mm;45mm | 측면;텅라벨(치수);힐탭 상세(치수);토/힐 부위 상세;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASXEE16N</code> 치즈 — 26SS 1ST · KING LIKE · JAEGON YOO · 2025.04.29</summary>

- TONGUE 10/27/42/35/12mm 2 TONE 2D PRINTING BG W3 LOGO GREY, LINING HEAVY MERY MESH BG W4
- 2 TONE 2D PRINTING WIDE 42mm/GREY
- LACE LOOP PIG SUEDE/L.GREY
- SHOE LACE WAXED 5mm/GREY(PATCH LOGO COLOR MATCHING)
- MICROFIEBER SYNTHETIC RP:[ROSIA]NATURAL ECHO:C-02/W4
- SKIN SUEDE 0.8mm/L.GREY
- PIG SUEDE/L.GREY
- 2D PRINTING/GREY 47mm/18mm
- RUBBER SHEET RB 1.5mm/L.BEIGE
- OUTSOLE RB/L.BEIGE
- MIDSOLE EVA/GREY
- FAKE STICHING SYNTHETIC COLOR MATCHING
- MICROFIEBER SYNTHETIC BOTTOM PIG SUEDE/L.GREY TOP PIG SUEDE+STITCHING/GREY HEIGHT 45mm
- DIE-CUT SOCKLINER HEAVY MERRY MESH/W4 2 COLOR PRINTING BLACK/W3

참고 컷/스와치: 타사(오니츠카타이거형) 레퍼런스 제품컷;로고 자수 실물컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 부위 폭·높이 콜아웃(파란선)이 다수 있는 사양서 — 패널 비례를 이 값에 맞출 것.
- 라스트 `MLBL-2518` 은 다른 형태 4개와 공유 — `MLBL-2518_MLBM-2530`, `MLBL-2518_MLBM-2617`, `MLBL-2518_MLBM-2518`, `MLBL-2518_NEW-M26SRNER0`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASXEE16N`: 치즈(CHEESE) 26SS. 라스트 MLBL-2518 / 아웃솔 MLBM-2529(러니 아웃솔) — 슬릭 라스트에 러니 톱니솔 조합. 치수 콜아웃 최다(파란선 폭·높이 20개+). *REFER TO THE SHAPE OF THE CAD LOGO IMAGE*

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASXEE16N` | W3; W4; L.BEIGE; GREY; L.GREY (COLOR MATCHING) | 50BKS, 50WHS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASXEE16N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASXEE16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXEE16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXEE16N50WHS/thnail/FA03371A12E9458684D0017022CB3586.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
