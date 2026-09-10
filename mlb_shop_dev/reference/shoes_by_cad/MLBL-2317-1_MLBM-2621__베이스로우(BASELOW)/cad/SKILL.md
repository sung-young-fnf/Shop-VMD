# 베이스 로우 (BASE LOW) — MLBL-2317-1 / MLBM-2621

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2317-1_MLBM-2621` |
| 라스트 (LAST NO.) | `MLBL-2317-1` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2621` |
| style_code | `M26NCVWL1`, `M26NCVWL2` (2개) |
| TYPE1 (라스트 카테고리) | SNEAKERS |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-280 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · Inner side view · 텅라벨 · 인솔(치수) |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 6 |
| 성수점 재고 합 (2026-09-06) | 89 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ACVWL16N` | 베이스 로우 SD | 26SS / 1st | 26F | 4 | 07BLL, 43BRS, 50BGS, 50BKS |  | MLBL-2317-1 | MLBM-2621 |
| `3ACVWL26N` | 베이스 로우 LT | 26FW / 2st | 26F | 2 | 07CRS, 50BKS |  | MLBL-2317-1 | MLBM-2621 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ACVWL16N` | 10mm;0.8mm;40x11mm | 측면;Inner side view;텅라벨;인솔(치수) |
| `3ACVWL26N` | 10mm;0.8mm;1.2mm;0.2mm;40x11mm | 측면;Inner side view;텅라벨;인솔(치수) |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ACVWL16N</code> 베이스 로우 SD — 26SS 1st · KINGLIKE · BORA LIM · 2025.10.30</summary>

- POLY SHOE LACE(Density 15) WIDTH 10mm/W2
- MICRO FABRIC ROSIA OPTION B/MG.SAND
- GLOSSY HF DEBOSSED/MG.SAND
- MICROFIBER SYNTHETIC AR100/W2
- LINING PU 0.8mm(ref.alo)/W2
- MIDSOLE 035 52C PU/W2
- OUTSOLE RB(RUBBER)/L.BROWN
- EMBROIDERY(ref.CLUBBIE) SIZE TBD/W2
- DECORATIVE STITCHING LINE
- SOCKLINER 1 PIECE OPTION WITH GREEN ORTHOLITE FOAM HEAVY MERRY MESH/W2 HEAT SEAL LOGO PRINTING BLACK, LOGO SIZE 40x11mm

참고 컷/스와치: 힐 샘플 제품컷

</details>

<details><summary><code>3ACVWL26N</code> 베이스 로우 LT — 26FW 2st · KINGLIKE · BORA LIM · 2025.12.04</summary>

- POLY SHOE LACE(Density 15) WIDTH 10mm/CREAM
- MICROFIBER SYNTHETIC NATURAL ECHO C-02/CREAM
- MICROFIBER SYNTHETIC VELBOA/CREAM
- MICROFIBER SYNTHETIC AR100/W2
- GLOSSY HF DEBOSSED/L.BROWN
- LINING PU 0.8mm(ref.alo)/W2
- MIDSOLE 035 52C PU/W2
- OUTSOLE RB(RUBBER)/L.BROWN
- 1.2mm NATURAL ECHO C-02+0.2mm CUTTING HF/L.BROWN(LA 로고)
- DECORATIVE STITCHING LINE
- SOCKLINER 1 PIECE GREEN ORTHOLITE HEAVY MERRY MESH/W2 HEAT SEAL LOGO BLACK 40x11mm

참고 컷/스와치: original Cortez 샘플 제품컷;힐 샘플 제품컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- MEDIAL(내측) 뷰 확보 → 내측 로고·패널 배치 확정 가능. 외측과 다른 부분을 표에서 확인.
- 라스트 `MLBL-2317-1` 은 다른 형태 1개와 공유 — `MLBL-2317-1_MLBM-2317`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ACVWL16N`: 베이스 로우 SD 26SS. 라스트 MLBL-2317-1 = 클러비 라스트 공유 / 아웃솔 MLBM-2621 신규(코르테즈형 로우 프로파일). Inner side view 있음. 3ACVWL26N 과 동일 도면
- `3ACVWL26N`: 베이스 로우 LT 26FW. 3ACVWL16N 과 동일 라스트·아웃솔·도면. 컬러 "Refer to the original Cortez sample" — 나이키 코르테즈 참조

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ACVWL16N` | 15-1116TPG MG.SAND; 16-0940TPG L.BROWN; W2 WHITE(WHS) | 07BLL, 43BRS, 50BGS, 50BKS |
| `3ACVWL26N` | 16-1315TPG L.BROWN; CREAM(Refer to original Cortez sample); 16-0940TPG BROWN; W2 WHITE(WHS) | 07CRS, 50BKS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ACVWL16N`, `3ACVWL26N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ACVWL16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ACVWL16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ACVWL16N50BKS/thnail/4CED5AE5B82E47388FEC41418F55BAC0.png/dims/resize/200x200
- `3ACVWL26N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ACVWL26N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ACVWL26N07CRS/thnail/2959EB5725AE446BA1CF687A89D40A32.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
