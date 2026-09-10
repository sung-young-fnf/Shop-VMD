# 커브 러너 라이트 · 스피드 — MLBL-2517 / MLBM-2520

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2517_MLBM-2520` |
| 라스트 (LAST NO.) | `RBK-6068_1L`, `MLBL-2517` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2520` |
| style_code | `M25NRNC05` (1개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 웨빙 상세 · 서브 레이스 상세 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 3 / 6 |
| 성수점 재고 합 (2026-09-06) | 102 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNC045N` | 커브 러너 SPEED SD | 25FW / 2nd | 25F | 1 | 50PPL |  | RBK-6068_1L(벤더 라스트 번호) | MLBM-2520(NEW) |
| `3ARNC055N` | 커브 러너 SPEED NB | 25FW / 2nd | 25F | 3 | 07GRS, 07PKL, 50SIS |  | RBK-6068_1L(벤더 라스트 번호) | MLBM-2520(NEW) |
| `3ARNCS16N` | 커브러너 스피드 | 26SS / 2nd | 26S | 2 | 50BKS, 50WHS |  | MLBL-2517 | MLBM-2520 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

### 귀속 사유 (도면 표기와 형태 ID 가 다른 스타일)
- `3ARNC045N` — 25FW 라스트 칸 RBK-6068_1L(벤더 번호). 같은 style_code(M25NRNC05) 의 26SS 3ARNCS16N 이 MLBL-2517/MLBM-2520 → 귀속. RBK-6068 ≒ MLBL-2517 추정(위너 청키 6068 사례와 일치)
- `3ARNC055N` — 3ARNC045N 과 동일 사유

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNC045N` | 6mm;4mm→2mm;15mm;0.5mm | 측면;웨빙 상세 |
| `3ARNC055N` | 6mm;4mm→2mm;15mm;0.5mm | 측면;웨빙 상세 |
| `3ARNCS16N` | 6mm;15mm;0.5mm | 측면;웨빙 상세;서브 레이스 상세 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNC045N</code> 커브 러너 SPEED SD — 25FW 2nd · 에스아이 · 김종훈 · 2024.11.05</summary>

- OVAL LACE 6mm/L.GREY
- MICROFIBER SYNTHETIC UMT/L.GREY, +HF DEBOSSED LOGO+PRINT
- MICROFIBER SYNTHETIC TAESUNG SOFIA/L.PURPLE +PRINT L.GREY
- MICROFIBER SYNTHETIC ROSIA MICROFIBER NUBUCK/L.GREY
- MICROFIBER SYNTHETIC R8/L.PURPLE +HF DEBOSSED PRINT +HOLE 0.5mm
- HF DEBOSS PRINT WHITE
- HF DEBOSS(SAME AS CURVE RUNNER)
- MESH L.GREY
- LINING DAEYOUNG DYI MORBID MESH P EPM5/L.GREY
- WEBBING STANDARD 15mm TWILL BASE L.GREY STRIPE L.PURPLE(13-3803TPG)
- 3D PRINT 3M REFLECTIVE
- TPU INSERT BODY GREY LOGO WHITE OPACITY 20%
- HF WELDING LOGO L.PURPLE OUTLINE WHITE
- MIDSOLE W2
- OUTSOLE L.PURPLE

참고 컷/스와치: 오발 레이스 실물컷;웨빙 실물컷

</details>

<details><summary><code>3ARNC055N</code> 커브 러너 SPEED NB — 25FW 2nd · 에스아이 · 김종훈 · 2024.11.05</summary>

- OVAL LACE 6mm/BLACK
- MICROFIBER SYNTHETIC ROSIA MICROFIBER R240355/D.GREY, +HF DEBOSSED LOGO+PRINT 18-5102TPG
- MICROFIBER SYNTHETIC TAESUNG FNL/SILVER +PRINT 18-5102TPG
- ROSIA MICROFIBER NUBUCK/G4 +HF DEBOSSED PRINT D.GREY, PRINT 18-5102TPG
- UMT/SILVER +HF DEBOSSED PRINT
- HF DEBOSS PRINT 18-5102TPG
- MESH GREY
- LINING DAEYOUNG DYI MORBID MESH P EPM5/BLACK
- WEBBING STANDARD 15mm TWILL BASE BLACK STRIPE 3M REFLECTIVE
- 3D PRINT 3M REFLECTIVE
- TPU INSERT BODY BLACK LOGO GREY OPACITY 20%
- HF WELDING LOGO BLACK OUTLINE GREY
- MIDSOLE CREAM
- OUTSOLE BLACK

참고 컷/스와치: 오발 레이스 실물컷;웨빙 실물컷

</details>

<details><summary><code>3ARNCS16N</code> 커브러너 스피드 — 26SS 2nd · 에스아이 · JONGHOON KIM · 2025.04.23</summary>

- MESH A [New Hot Mesh] HY0218(140cm/54") W2
- MESH B W2
- SHOE LACE 6mm/KISUNG FNKS 205/W2
- MICROFIBER SYNTHETIC ROSIA ZHENGE NEW MATERIAL[NEW DELHI MICROFIBER] YXL2038-2 (+HF DEBOSSED LOGO+PRINT SILVER, +HOLE 0.5mm)
- MICROFIBER SYNTHETIC NATURAL ECHO C-02/W2 +PRINT SILVER, +HF DEBOSSED PRINT
- MICROFIBER SYNTHETIC UMT/W2 +HF DEBOSSED PRINT
- HF DEBOSS PRINT SILVER
- HF DEBOSS
- LINING DAEYOUNG DYI MORBID MESH P EPM5/W2
- WEBBING 15mm KISUNG FNKS 136/BASE W2 STRIPE SILVER
- 3D PRINT 3M REFLECTIVE/W2
- TPU INSERT BODY SILVER LOGO SILVER(SAME QUALITY AS 25FW)
- HF WELDING LOGO W2 OUTLINE SILVER RP:JS-594R
- SUB-SHOELACE 6mm/KISUNG FNKS 205/SILVER
- MIDSOLE W2
- OUTSOLE W2

참고 컷/스와치: 메쉬 A/B 스와치;New Delhi microfiber 스와치;서브 레이스 실물컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2517` 은 다른 형태 2개와 공유 — `MLBL-2517_NEW-M26NSHMC1`, `MLBL-2517_MLBM-2517H`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ARNC045N`: 커브 러너 라이트(SPEED SD, 50PPL) 25FW. 라스트 RBK-6068_1L(벤더 채번) / 아웃솔 MLBM-2520 신규. *For all mesh use same mesh as 1st sample but thinner backing sponge 4mm→2mm* / *REMOVE THE WRINKLE ON THE VAMP*. TPU INSERT OPACITY 20% MATTE(TINY SAND BLAST). 3ARNC055N 과 동일 도면
- `3ARNC055N`: 커브 러너 라이트(SPEED NB, 50SIS) 25FW. 3ARNC045N 과 동일 도면·라스트·아웃솔
- `3ARNCS16N`: 커브 러너 스피드 26SS. 라스트 MLBL-2517(위너 청키 라스트) + 아웃솔 MLBM-2520(커브 러너 라이트 아웃솔) — 25FW 라이트(RBK-6068_1L/2520)의 후속. MLBL-2517 ≒ 6068 사내채번 추정 근거. *SAME AS THE 1st SAMPLE*. MESH DETAIL AT pg.2(PDF 별지)

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNC045N` | 12-0602 TPG L.GREY(GRL); P2 L.PURPLE(PPL); 14-4103 TPG GREY(GRS); W2 WHITE(WHS) | 50PPL |
| `3ARNC055N` | 19-3907 TPG D.GREY(GRD); 14-4103 TPG GREY(GRS); BLACK(BKS); PANTONE SILVER C SILVER(SIS); W4 CREAM(CRS) | 07GRS, 07PKL, 50SIS |
| `3ARNCS16N` | W2 WHITE(WHS); PANTONE SILVER C SILVER(SIS) | 50BKS, 50WHS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 일부 스타일의 라스트/아웃솔이 도면상 **미채번(NEW)·벤더번호·미기재** — 위 "귀속 사유" 참조.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNC045N`, `3ARNC055N`, `3ARNCS16N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNC045N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNC045N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNC055N50SIS/thnail/BC0A13B60AFB471AA766600BD46EBFE5.png/dims/resize/200x200
- `3ARNC055N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNC055N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNC055N50SIS/thnail/BC0A13B60AFB471AA766600BD46EBFE5.png/dims/resize/200x200
- `3ARNCS16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNCS16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNC055N50SIS/thnail/BC0A13B60AFB471AA766600BD46EBFE5.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
