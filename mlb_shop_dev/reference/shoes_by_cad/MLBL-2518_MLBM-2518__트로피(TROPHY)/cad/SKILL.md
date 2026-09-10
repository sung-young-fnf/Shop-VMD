# 트로피 (TROPHY) — MLBL-2518 / MLBM-2518

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2518_MLBM-2518` |
| 라스트 (LAST NO.) | `MLBL-2518` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2518` |
| style_code | `M25NSXT01`, `M26NCVTL1` (2개) |
| TYPE1 (라스트 카테고리) | SNEAKERS |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 225-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅라벨 · 인솔 · 힐/쿼터 로고 실물 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 4 / 11 |
| 성수점 재고 합 (2026-09-06) | 182 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASXT015N` | 트로피 빈티지 SD | 25FW / 2nd | 25F | 4 | 50BGL, 50BGS, 50GRL, 50PKS |  | MLBL-2518 | MLBM-2518 |
| `3ASXT025N` | 트로피 빈티지 LT | 25FW / 2nd | 25F | 1 | 50IVS |  | MLBL-2518 | MLBM-2518 |
| `3ASXT035N` | 트로피 빈티지 NB | 25FW / 2nd | 25F | 1 | 50BKS |  | MLBL-2518 | MLBM-2518 |
| `3ACVTL16N` | 트로피 라이트 | 26FW / SPOT | 26F | 5 | 07SIS, 50BGS, 50BKS, 50BRS, 50IVS |  | MLBL-2518 | MLBM-2518 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASXT015N` | 8mm;5mm;1.2mm | 측면;텅라벨;인솔 |
| `3ASXT025N` | 8mm;5mm | 측면;텅라벨;인솔 |
| `3ASXT035N` | 8mm;5mm;1.2mm | 측면;텅라벨;인솔 |
| `3ACVTL16N` | 8mm;5mm;1.4mm;1.2mm;40mm | 측면;텅라벨;힐/쿼터 로고 실물;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASXT015N</code> 트로피 빈티지 SD — 25FW 2nd · SI · TAEHEON KIM · 2024.10.31</summary>

- TONGUE LABEL(8mm) SUEDE LEATHER+HF DEBOSS(FACE) BEIGE (STITCHING LINE HF DEBOSS)
- MICRO FIBER SYNTHETIC RP:[TAESUNG]SOPIA/1.2mm BEIGE
- ROUND SHOE LACE [KISUNG]5mm 2COLOR BASE D.BEIGE DOT BEIGE
- WEBBING CORDURA/BEIGE WIDTH Specify later
- SUEDE LEATHER BEIGE
- COLLAR LINING/TONGUE LINING HEAVY MERRY MESH D.BEIGE
- 2D PRINTING HF DEBOSS(FACE) D.BEIGE SHINY PRINTING
- OUTSOLE RB(RUBBER)/D.BEIGE
- MIDSOLE CMEVA/D.BEIGE
- SOCKLINER HEAVY MERRY MESH/D.BEIGE 2COLOR PRINTING BLACK/WHITE
- SUB LACE BASE SKY BLUE(13-4308TPG) DOT BEIGE

참고 컷/스와치: 신발끈 실물컷

</details>

<details><summary><code>3ASXT025N</code> 트로피 빈티지 LT — 25FW 2nd · SI · TAEHEON KIM · 2024.11.01</summary>

- TONGUE LABEL(8mm) RECYCLE LEATHER+HF DEBOSS(FACE) IVORY, HF DEBOSS L.GREY SHINY PRINTING
- RECYCLE LEATHER IVORY
- 재생가죽 IVORY
- ROUND SHOE LACE [KISUNG]5mm 2COLOR BASE IVORY DOT L.GREY
- WEBBING CORDURA/IVORY
- COLLAR/TONGUE LINING HEAVY MERRY MESH IVORY
- 2D PRINTING HF DEBOSS(FACE) IVORY/L.GREY
- OUTSOLE RB(RUBBER)/GUM
- MIDSOLE CMEVA/CREAM
- SOCKLINER HEAVY MERRY MESH/L.GREY 2COLOR PRINTING BLACK/WHITE
- SUB LACE REFER TO SAMPLE

참고 컷/스와치: 신발끈 실물컷

</details>

<details><summary><code>3ASXT035N</code> 트로피 빈티지 NB — 25FW 2nd · SI · TAEHEON KIM · 2024.11.01</summary>

- TONGUE LABEL(8mm) MICRO FIBER SYNTHETIC+HF DEBOSS(FACE) RP:[TAESUNG]SOPIA/1.2mm BLACK, HF DEBOSS CHARCOAL
- MICRO FIBER SYNTHETIC RP:[ROSIA]NUBUCK A/1.2mm CHARCOAL, BLACK
- RP:[TAESUNG]SOPIA/1.2mm BLACK
- WOVEN [RONGTONG]RT-HT-S2411 CHARCOAL(OUTSOLE COLOR MATCH)
- ROUND SHOE LACE [KISUNG]5mm 2COLOR BASE BLACK DOT CHARCOAL
- WEBBING CORDURA/BLACK
- HF DEBOSS(LINE)
- COLLAR/TONGUE LINING HEAVY MERRY MESH BLACK
- 2D PRINTING HF DEBOSS(FACE) BLACK/CHARCOAL SHINY PRINTING
- OUTSOLE RB(RUBBER)/CHARCOAL
- MIDSOLE CMEVA/BLACK
- SOCKLINER HEAVY MERRY MESH/BLACK 2COLOR PRINTING WHITE/BLACK
- SUB LACE BASE PINK(11-1408TPG) DOT BLACK

참고 컷/스와치: 신발끈 실물컷

</details>

<details><summary><code>3ACVTL16N</code> 트로피 라이트 — 26FW SPOT · - · TAEHEON KIM · 2025.12.05</summary>

- TONGUE LABEL(8mm) 1.SUEDE [ROSIA]NTR-003 SUEDE/IVORY 2.HF DEBOSS(FACE)/IVORY (STITCHING LINE HF DEBOSS)
- OUTSOLE RB(RUBBER)/SAND
- MIDSOLE CMEVA/WHITE
- ROUND SHOE LACE [KISUNG]5mm 2COLOR BASE IVORY DOT GREY
- SUB LACE BASE BLACK DOT WHITE
- COLLAR/TONGUE LINING HEAVY MERRY MESH IVORY
- 2D PRINTING(SHINY) HF DEBOSS(FACE) IVORY
- UPPER 1.SUEDE [ROSIA]NTR-003 SUEDE/1.4mm IVORY 2.MESH [SHINHEUNG]PAG SW MESH IVORY 3.MICROFIBER SYNTHETIC [TAESUNG]PEARL UM/1.2mm IVORY
- WEBBING CORDURA/IVORY
- HEEL LOGO TPU CUTTING HF WELDING TOP IVORY BASE IVORY
- QUARTER LOGO SUEDE CUTTING HF WELDING BASE TPU/IVORY TOP [ROSIA]NTR-003 GREY HEIGHT 40mm
- SOCKLINER HEAVY MERRY MESH/IVORY 2COLOR PRINTING BLACK/WHITE

참고 컷/스와치: 힐 로고 실물컷;쿼터 로고 실물컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2518` 은 다른 형태 4개와 공유 — `MLBL-2518_MLBM-2530`, `MLBL-2518_MLBM-2617`, `MLBL-2518_MLBM-2529`, `MLBL-2518_NEW-M26SRNER0`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASXT015N`: 트로피(SD, 스웨이드) 25FW. 라스트 MLBL-2518(슬릭 패밀리 공통) / 아웃솔 MLBM-2518(트로피 전용 러그솔). 3ASXT025N·3ASXT035N 과 동일 도면
- `3ASXT025N`: 트로피 LT(리사이클 레더) 25FW. 3ASXT015N 과 동일 도면·라스트·아웃솔. 아웃솔 GUM
- `3ASXT035N`: 트로피 NB(누벅) 25FW 블랙. 3ASXT015N 과 동일 도면·라스트·아웃솔
- `3ACVTL16N`: 트로피 로우(도면 NAME=TROPHY LOW, KG 상품명 "트로피 라이트") 26FW SPOT. 라스트/아웃솔 2518/2518 — 25FW 트로피와 동일 형태. 아웃솔 컬러 SAND

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASXT015N` | BEIGE(샘플동일); D.BEIGE 17-1319TPG | 50BGL, 50BGS, 50GRL, 50PKS |
| `3ASXT025N` | GUM; CREAM W4; L.GREY 13-4104 TPG; IVORY 12-4300 TPG | 50IVS |
| `3ASXT035N` | BLACK; CHARCOAL 19-4104 TPG | 50BKS |
| `3ACVTL16N` | SAND 16-1310TPG; GREY 14-4103TPG; BLACK; IVORY 11-4202TPG | 07SIS, 50BGS, 50BKS, 50BRS, 50IVS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASXT015N`, `3ASXT025N`, `3ASXT035N`, `3ACVTL16N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASXT015N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXT015N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASXT025N50IVS/thnail/B7DDAC8C72524CC49445D1675251F295.jpg/dims/resize/200x200
- `3ASXT025N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXT025N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASXT025N50IVS/thnail/B7DDAC8C72524CC49445D1675251F295.jpg/dims/resize/200x200
- `3ASXT035N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXT035N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASXT025N50IVS/thnail/B7DDAC8C72524CC49445D1675251F295.jpg/dims/resize/200x200
- `3ACVTL16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ACVTL16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ACVTL16N07SIS/thnail/577405CF366241DE8D5737876A80F53B.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
