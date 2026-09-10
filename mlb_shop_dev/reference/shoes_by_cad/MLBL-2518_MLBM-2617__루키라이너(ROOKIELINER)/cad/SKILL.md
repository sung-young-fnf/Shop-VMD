# 루키 라이너 (ROOKIE LINER) — MLBL-2518 / MLBM-2617

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2518_MLBM-2617` |
| 라스트 (LAST NO.) | `MLBL-2518` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2617` |
| style_code | `M26NSXS01` (1개) |
| TYPE1 (라스트 카테고리) | LINER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-290 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅패치 · 텅 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 1 / 3 |
| 성수점 재고 합 (2026-09-06) | 20 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASXS016N` | 루키 라이너 | 26FW / 2nd | 26F | 3 | 07SBL, 43BGS, 50BKS |  | MLBL-2518 | MLBM-2617 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASXS016N` | 1.5mm;1.2mm;1.4mm;40mm | 측면;텅패치;텅;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASXS016N</code> 루키 라이너 — 26FW 2nd · SAMDUCK · 김태현 · 2025.07.31</summary>

- TONGUE PATCH(REFER TO SAMPLE) EMBROIDERY, 2D PRINTING WHITE, HF DEBOSS+2D PRINTING Width 1.5mm WHITE
- TONGUE LINING HEAVY MERRY MESH WHITE
- MICRO VELCRO/LOOP WHITE
- 3D CUTTING H/F WELDING TOP BLACK BASE WHITE
- SHOE LACE(SAME AS CLUBBIE) WHITE
- EYELET [DAESUNG]SE-36 WHITE
- MICRO FIBER SYNTHETIC RP:[MEGA]50475(Pearly color)/1.2mm BLACK
- RP:[NATURAL ECHO]G-01/1.4mm WHITE
- RP:[NATURAL ECHO]G-03/1.2mm WHITE
- SUEDE [ROSIA]NTR-003 SUEDE 1.4mm/BLACK
- COLLAR LINING HEAVY MERRY MESH WHITE
- UNDERLAYER 3m reflective Width 1.5mm WHITE
- PUNCHING 1.5mm
- STITCH COLOR WHITE
- HF DEBOSS+2D PRINTING WHITE
- SUEDE CUTTING H/F WELDING BASE TPU/WHITE TOP [ROSIA]NTR-003 BLACK HEIGHT 40mm
- MIDSOLE WHITE
- OUTSOLE BLACK
- SOCKLINER HEAVY MERRY MESH/WHITE 2COLOR PRINTING BLACK/WHITE
- 1.SUB SHOE LACE [JIN YUAN]JY-1584 BLACK
- 2.SUB SHOE LACE [KISUNG]FNKS028 BASE BLACK

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2518` 은 다른 형태 4개와 공유 — `MLBL-2518_MLBM-2530`, `MLBL-2518_MLBM-2518`, `MLBL-2518_MLBM-2529`, `MLBL-2518_NEW-M26SRNER0`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASXS016N`: 루키 라이너 26FW. TYPE1 은 LINER 지만 라스트가 MLBL-2518(슬릭 파우더 트윌 3ACVSP46N 과 동일) → 청키라이너 계열(2102-2) 아님. 아웃솔 MLBM-2617 신규. 텅패치 자수(NEW YORK Yankees EST.1903)

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASXS016N` | WHITE W3; BLACK | 07SBL, 43BGS, 50BKS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASXS016N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXS016N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXS016N50BKS/thnail/2525814BC63B4A1C92ECD6BE3213875F.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
