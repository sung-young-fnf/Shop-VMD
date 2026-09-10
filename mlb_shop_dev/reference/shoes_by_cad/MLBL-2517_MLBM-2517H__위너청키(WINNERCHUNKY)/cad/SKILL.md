# 위너 청키 (WINNER CHUNKY) — MLBL-2517 / MLBM-2517H

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2517_MLBM-2517H` |
| 라스트 (LAST NO.) | `MLBL-2517`, `6068` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2517H`, `UNKNOWN` |
| style_code | `M25NSHWD1`, `M26NSHWD2` (2개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 225-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · MEDIAL VIEW · 웨빙 상세컷 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 6 / 14 |
| 성수점 재고 합 (2026-09-06) | 125 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASHW015N` | 위너 청키 NB | FW25 / 2nd | 25F | 2 | 43GRS, 50BKD |  | MLBL-2517 | MLBM-2517 H |
| `3ASHW055N` | 위너 청키 A | FW25 / 2nd | 25F | 1 | 07WHS | 07WHS | MLBL-2517 | MLBM-2517 H |
| `3ASHWD15N` | 위너 청키 | 25SS / 1ST | 25S | 6 | 50BKS, 50BLS, 50GOL, 50GRL, 50IVS, 50PKL |  | 6068(벤더 라스트 번호; MLBL- 미채번) | -(미기재) |
| `3ASHWC26N` | 위너 청키 GD | 26SS / 2ND | 26S | 2 | 07PKS, 43BLS |  | MLBL-2517 | MLBM-2517 H |
| `3ASHWC36N` | 위너 청키 DT | 26SS / 3RD | 26S | 2 | 50GOS, 50WHS | 50WHS | MLBL-2517 | MLBM-2517 H |
| `3ASHWC46N` | 위너 청키 SV | 26SS / 1ST | 26S | 1 | 50SIS | 50SIS | MLBL-2517 | MLBM-2517 H |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

### 귀속 사유 (도면 표기와 형태 ID 가 다른 스타일)
- `3ASHWD15N` — 25SS 도면 라스트 칸 "6068"(벤더 번호), 아웃솔 미기재. 같은 style_code(M25NSHWD1) 의 FW25 5종이 MLBL-2517/MLBM-2517 H → 귀속. 6068 ≒ MLBL-2517 사내채번 추정

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASHW015N` | 미확보 | 측면;MEDIAL VIEW |
| `3ASHW055N` | 미확보 | 측면;MEDIAL VIEW |
| `3ASHWD15N` | 6mm;0.8mm;15mm;0.3mm | 측면 |
| `3ASHWC26N` | 0.3mm | 측면;MEDIAL VIEW;웨빙 상세컷 |
| `3ASHWC36N` | 0.3mm | 측면;MEDIAL VIEW;웨빙 상세컷 |
| `3ASHWC46N` | 0.3mm | 측면;MEDIAL VIEW;웨빙 상세컷 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASHW015N</code> 위너 청키 NB — FW25 2nd · HSC/SI무역 · JAEGON YOO · 2024.11.01</summary>

- 3D HF MOLD LOGO BLACK/GLOSSY PAINTING BLACK
- LACE BASE BLACK 2ND 15-4703 TPG
- HF MICROFIBER NUBUCK BLACK DEBOSS PRINT GLOSSY PAINTING BLACK(NEED SHEEN)
- WEBBING BLACK
- LINING TEXTILE BLACK
- OPEN SW MESH BLACK
- MICROFIBER NUBUCK BLACK LOGO PRINT GLOSSY PAINTING BLACK
- HF DEBOSS+PRINT BLACK(NEED SHEEN)
- HF DEBOSS PRINT GLOSSY PAINTING BLACK
- TPU INSERT BLACK MLB LOGO PRINT 19-3910 TPG
- M/S BLACK
- O/S BLACK

</details>

<details><summary><code>3ASHW055N</code> 위너 청키 A — FW25 2nd · HSC/SI무역 · JAEGON YOO · 2024.11.07</summary>

- 3D HF MOLD LOGO BLACK(BKS)/WHITE(W3)
- LACE BASE WHITE 2ND 13-4303 TPG
- HF SYNTHETIC LEATHER WHITE(W3) DEBOSS PRINT BLACK(BKS)(MATTE FINISH)
- WEBBING WHITE(W3)
- LINING TEXTILE WHITE(W3)
- OPEN SW MESH WHITE(W3)
- SYNTHETIC LEATHER WHITE LOGO PRINT BLACK
- HF DEBOSS+PRINT WHITE(MATTE FINISH)
- HF DEBOSS PRINT BLACK(NEED SHEEN)
- TPU INSERT 13-4303 TPG MLB LOGO PRINT WHITE
- M/S WHITE(W3)
- O/S BLACK(BKS)

</details>

<details><summary><code>3ASHWD15N</code> 위너 청키 — 25SS 1ST · HS ONE · DONGWOO SHIN · 2024.04.18</summary>

- OPEN SW MESH(VAMP/TONGUE/REAR QTR) DYT K25-166 HALIM SW P/C-EPM5 BLACK
- SINGLE LAYER MESH DYT i25-823 POLO MESH P-EPM5 BLACK
- KISUNG 6mm ROUND LACE W/0.8mm YARN BASE BLACK 2ND REFLECTIVE
- HF EMBOSS SYNTHETIC LEATHER SILVER METALLIC(RP:R8) DEBOSS PRINT BLACK
- STANDARD 15mm TWILL WEBBING BLACK
- LINING TEXTILE DUCKSUNG DSC01141 REC MERRY MESH L.GREY
- SYNTHETIC LEATHER BLACK(RP:R8) STITCH&TURN EDGE FINISH
- HF MOLDED PERFS
- CMEVA 43C 015 D.GREY
- RUBBER BLACK
- 3D HF MOLD LOGO SILVER METALLIC/BLACK
- 0.3mm HOTMELT BLACK
- PU GEL D.GREY MLB LOGO PRINT BLACK
- HF WELDED EYELET SILVER METALLIC
- HF DEBOSS+PRINT BLACK

참고 컷/스와치: 자재 스와치 3종(메쉬/라이닝);HF MOLDED PERFS 실물컷;타사(ASICS형) 레퍼런스 제품컷

</details>

<details><summary><code>3ASHWC26N</code> 위너 청키 GD — 26SS 2ND · SI무역 · JAEGON YOO · 2025.04.18</summary>

- 3D HF MOLD LOGO PINK/BASE WHITE(W3)
- LACE BASE PINK 2ND WHITE(W3)
- HF SYNTHETIC LEATHER WHITE(W3) DEBOSS PRINT NEON GREEN
- WEBBING PINK
- LINING TEXTILE WHITE(W3)
- OPEN SW MESH WHITE(W3)
- SYNTHETIC LEATHER WHITE(W3) LOGO PRINT NEON GREEN
- HF DEBOSS+GRADATION PRINTING W3→NEON GREEN, PINK→NEON GREEN, BLACK→WHITE
- SYNTHETIC LEATHER RP:[TAESUNG]ALLOY
- TPU INSERT PINK MLB LOGO PRINT WHITE
- M/S WHITE(W3)
- O/S GREY(REFER TO SAMPLE)
- 0.3mm HOTMELT NEON GREEN

참고 컷/스와치: 실물 샘플컷(TPU 인서트 컬러 수정 지시)

</details>

<details><summary><code>3ASHWC36N</code> 위너 청키 DT — 26SS 3RD · SI무역 · JAEGON YOO · 2025.04.18</summary>

- 3D HF MOLD LOGO BLACK(BKS)/BASE WHITE(W3)
- LACE BASE BLACK(BKS) 2ND WHITE(W3)
- HF SYNTHETIC LEATHER WHITE(W3) DEBOSS PRINT BLACK(BKS)
- WEBBING BLACK(BKS)
- LINING TEXTILE BLACK(BKS)
- OPEN SW MESH WHITE(W3)
- SYNTHETIC LEATHER WHITE(W3) LOGO PRINT BLACK(BKS)
- HF DEBOSS+GRADATION PRINTING BLACK TO WHITE(W3)
- SYNTHETIC LEATHER(GRADATION PRINTING) RP:[TAESUNG]ALLOY /BLACK
- TPU INSERT BLACK(BKS) MLB LOGO PRINT WHITE(W3)
- M/S DIRTY TREATMENT(BKS) WHITE(W3)
- O/S L.GREY
- 0.3mm HOTMELT BLACK(BKS)
- UPPER DIRTY TREATMENT(BKS)

참고 컷/스와치: 실물 샘플컷(그라데이션 적용 위치 지시)

</details>

<details><summary><code>3ASHWC46N</code> 위너 청키 SV — 26SS 1ST · SI무역 · JAEGON YOO · 2025.02.10</summary>

- 3D HF MOLD LOGO L.GREY(GRL)/BASE BLACK(BKS)
- LACE BASE L.GREY(GRL) 2ND GREY(GRS)
- HF SYNTHETIC LEATHER SILVER(SIS) DEBOSS PRINT GREY(GRS)
- WEBBING BLACK(BKS)
- LINING TEXTILE BLACK(BKS)
- OPEN SW MESH SUBLIMATION PRINTING BLACK TO GREY
- SYNTHETIC LEATHER SILVER(SIS) LOGO PRINT GREY(GRS)
- HF DEBOSS+PRINT GREY(GRS)
- HF DEBOSS PRINT GREY(GRS)
- TPU INSERT L.GREY(GRL) MLB LOGO PRINT BLACK(BKS)
- M/S WATER TRANSFER(W3) SILVER
- O/S BLACK(BKS)
- 0.3mm HOTMELT SILVER

참고 컷/스와치: 실물 샘플컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- MEDIAL(내측) 뷰 확보 → 내측 로고·패널 배치 확정 가능. 외측과 다른 부분을 표에서 확인.
- 라스트 `MLBL-2517` 은 다른 형태 2개와 공유 — `MLBL-2517_NEW-M26NSHMC1`, `MLBL-2517_MLBM-2520`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASHW015N`: 위너 청키(NB, 50BKD) FW25. REFERENCE MATERIAL MAP A. 라스트 MLBL-2517 / 아웃솔 MLBM-2517 H — 위너 청키 계열 6종 공통. 모션 청키(헤더 MLBM-2517)·커브 러너 스피드(MLBL-2517)와 라스트 공유
- `3ASHW055N`: 위너 청키 A(07WHS, LA) FW25. REFERENCE MATERIAL MAP B. 3ASHW015N 과 동일 도면·라스트·아웃솔, 신세틱 레더 매트 피니시
- `3ASHWD15N`: 위너 청키 원형(도면 NAME=WILDBALL DRAGON, 25SS 1ST, BLK/SILV). 라스트 칸이 "6068" — 커브 러너 라이트의 RBK-6068_1L 과 같은 벤더 라스트 번호. FW25 위너 청키(MLBL-2517)가 이 라스트의 사내 채번으로 추정(미검증). 아웃솔 미기재
- `3ASHWC26N`: 위너 청키 A(GD, 07PKS) 26SS. *DO NOT APPLY THE DIRTY TREATMENT*. REVISE THE TPU INSERT COLOR — REFER TO THE LOGO COLOR. 그라데이션 프린팅(핑크→네온그린). REFERENCE MATERIAL MAP B
- `3ASHWC36N`: 위너 청키 A DT(50WHS) 26SS 3RD. *APPLY THE DIRTY TREATMENT*(UPPER+M/S BKS). DO NOT APPLY THE GRADATION ON THE DEBOSS PATTERN, ONLY HF DEBOSS PRINT(W3). REFERENCE MATERIAL MAP B
- `3ASHWC46N`: 위너 청키 A SV(50SIS 실버) 26SS 1ST. *THE GRADIENT AREA WILL BE ASSIGNED SEPARATELY ON THE PATTERN GAUGE LATER*. M/S WATER TRANSFER(REFER TO MIDSOLE SAMPLE). REFERENCE MATERIAL MAP A

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASHW015N` | 19-3910 TPG D.GREY(DGS); 15-4703 TPG L.GREY(GRL); BLACK(BKS); GLOSSY PAINTING BLACK(BKS) | 43GRS, 50BKD |
| `3ASHW055N` | W3 WHITE(WHS); 13-4303 TPG L.GREY(GRL); BLACK(BKS) | 07WHS |
| `3ASHWD15N` | BLACK(BKS); 19-3910 TPG D.GREY(DGS); 15-4703 TPG L.GREY(GRL); W2 WHITE(WHS); SILVER MET. SILVER(SIS) | 50BKS, 50BLS, 50GOL, 50GRL, 50IVS, 50PKL |
| `3ASHWC26N` | W3 WHITE(WHS); L.GREY 13-4305 TPG; NEON GREEN(REFER TO SAMPLE); PINK(REFER TO SAMPLE) | 07PKS, 43BLS |
| `3ASHWC36N` | L.GREY 13-4305 TPG; W3 WHITE(WHS); BLACK(BKS) | 50GOS, 50WHS |
| `3ASHWC46N` | SILVER MET SILVER(SIS); 14-4104 TPG L.GREY; 16-3915 TPG GREY; BLACK(BKS) | 50SIS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 일부 스타일의 라스트/아웃솔이 도면상 **미채번(NEW)·벤더번호·미기재** — 위 "귀속 사유" 참조.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASHWD15N`, `3ASHWC26N`, `3ASHWC36N`, `3ASHWC46N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASHW015N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHW015N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHWD15N50BKS/thnail/EE3F1AA4AC474F56B08C389030B7E61E.png/dims/resize/200x200
- `3ASHW055N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHW055N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHWD15N50BKS/thnail/EE3F1AA4AC474F56B08C389030B7E61E.png/dims/resize/200x200
- `3ASHWD15N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHWD15N_IMAGE.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHWD15N50BKS/thnail/EE3F1AA4AC474F56B08C389030B7E61E.png/dims/resize/200x200
- `3ASHWC26N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHWC26N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHWD15N50BKS/thnail/EE3F1AA4AC474F56B08C389030B7E61E.png/dims/resize/200x200
- `3ASHWC36N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHWC36N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASHWC36N50WHS/thnail/B0ABF6E4823344F08AF893115B8FF722.png/dims/resize/200x200
- `3ASHWC46N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHWC46N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASHWC36N50WHS/thnail/B0ABF6E4823344F08AF893115B8FF722.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
