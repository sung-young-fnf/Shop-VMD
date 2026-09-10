# 클러비 (CLUB LINER) — MLBL-2317-1 / MLBM-2317

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2317-1_MLBM-2317` |
| 라스트 (LAST NO.) | `MLBL-2317-1` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2317` |
| style_code | `M26NSXCB1` (1개) |
| TYPE1 (라스트 카테고리) | SNEAKERS |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 225-280 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · MEDIAL VIEW · 텅라벨(치수) · 로고 실측 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 8 |
| 성수점 재고 합 (2026-09-06) | 126 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASXCB16N` | 클러비 | 26SS / 2nd | 26S | 2 | 50BKS, 50WHS |  | MLBL-2317-1 | MLBM-2317 |
| `3ASXCB26N` | 클러비 SD | 26SS / 2nd | 26S | 6 | 07BLS, 07GNS, 43BGS, 50PKS, 50RDS, 50YES |  | MLBL-2317-1 | MLBM-2317 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASXCB16N` | 42mm;29mm;35mm;25mm;40mm;8mm;1mm;0.8mm;1.0mm | 측면;MEDIAL VIEW;텅라벨(치수);로고 실측;인솔 |
| `3ASXCB26N` | 42mm;29mm;35mm;25mm;40mm;8mm;1mm;0.8mm;1.0mm | 측면;MEDIAL VIEW;텅라벨(치수);로고 실측;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASXCB16N</code> 클러비 — 26SS 2nd · 에스아이 · 김종훈 · 2025.06.26</summary>

- TONGUE PRINTING BG CREAM LOGO RED, LABEL 42x29mm
- PIG SUEDE RED
- SHOELACE 8mm POLYESTER/FLAT RED
- SUB-SHOELACE 8mm POLYESTER/FLAT CREAM
- HF DEBOSS MEDIAL QUARTER REAL-SIZE 35mm
- HF DEBOSS WIDTH 25mm
- LINING 0.8 PU/CREAM
- MICROFIBER SYNTHETIC [NATURAL ECHO]C02/CREAM
- OUTSOLE BROWN
- ORNAMENT STITCH
- PUNCHING DIAMETER 1mm
- EMBROIDERY CREAM 40mm
- UNDERLAY MICROFIBER SYNTHETIC 1.0mm AR-100/CREAM
- PU DIE-CUT SOCKLINER MERRY MESH/CREAM PRINT RED,WHITE(CHANGE IN GRAPHIC SAME AS 23FW SQUEEZE)

</details>

<details><summary><code>3ASXCB26N</code> 클러비 SD — 26SS 2nd · 에스아이 · 김종훈 · 2025.06.26</summary>

- TONGUE PRINTING BG CREAM LOGO RED, LABEL 42x29mm(REMOVE THE MONOGRAM DEBOSS)
- PIG SUEDE RED
- SHOELACE 8mm POLYESTER/FLAT RED
- SUB-SHOELACE 8mm POLYESTER/FLAT CREAM
- HF DEBOSS MEDIAL QUARTER REAL-SIZE 35mm
- HF DEBOSS WIDTH 25mm
- LINING 0.8 PU/CREAM
- MICROFIBER SYNTHETIC [NATURAL ECHO]C02/CREAM
- OUTSOLE BROWN
- ORNAMENT STITCH
- PUNCHING DIAMETER 1mm
- EMBROIDERY CREAM 40mm
- UNDERLAY MICROFIBER SYNTHETIC 1.0mm AR-100/CREAM
- PU DIE-CUT SOCKLINER MERRY MESH/CREAM PRINT RED,WHITE

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- MEDIAL(내측) 뷰 확보 → 내측 로고·패널 배치 확정 가능. 외측과 다른 부분을 표에서 확인.
- 라스트 `MLBL-2317-1` 은 다른 형태 1개와 공유 — `MLBL-2317-1_MLBM-2621`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASXCB16N`: 클러비(CLUB LINER) 26SS 레드. 3ASXCB26N 클러비 SD 와 동일 라스트·아웃솔(2317-1/2317). *TONGUE: REMOVE THE MONOGRAM DEBOSS*. HF DEBOSS MEDIAL QUARTER REAL-SIZE GRAPHIC 35mm. 베이스 로우(3ACVWL)와 라스트 공유
- `3ASXCB26N`: 클러비 SD(CLUB LINER, 50RDS) 26SS 2nd. 라스트 MLBL-2317-1 / 아웃솔 MLBM-2317. 3ASXCB16N 클러비의 PO_IMG 와 완전히 동일한 이미지(PLM 동일 도면 배정). 베이스 로우(3ACVWL)와 라스트 공유

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASXCB16N` | 18-1019TPG BROWN(BRS); 19-1757TPG RED(RDS); 11-4301TPG CREAM(CRS) | 50BKS, 50WHS |
| `3ASXCB26N` | 18-1019TPG BROWN(BRS); 19-1757TPG RED(RDS); 11-4301TPG CREAM(CRS) | 07BLS, 07GNS, 43BGS, 50PKS, 50RDS, 50YES |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASXCB16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXCB16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXCB16N50WHS/thnail/55B0493E905F49F197626CC8FB0B2485.png/dims/resize/200x200
- `3ASXCB26N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXCB26N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXCB16N50WHS/thnail/55B0493E905F49F197626CC8FB0B2485.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
