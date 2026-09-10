# 커브 러너 (CURVE RUNNER · 25FW~) — MLBL-2415 / MLBM-2506

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2415_MLBM-2506` |
| 라스트 (LAST NO.) | `MLBL-2415` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2506` |
| style_code | `M25NRNSPE`, `M26NRNCL1`, `M24NRNSP2`, `M24NRNSPL` (4개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 225-290 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅 정면 상세 · 인솔 · MEDIAL · 레이스메쉬 스와치 · 로고 실물 · 서브 레이스 실물 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 4 / 8 |
| 성수점 재고 합 (2026-09-06) | 95 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNSPE5N` | 커브 러너 에나멜 | 25FW / SPOT | 25F | 2 | 50BRS, 50SID | 50GRD | MLBL-2415 | MLBM-2506 |
| `3ARNCL16N` | 커브러너 레이스 | 26FW / 2nd | 26F | 2 | 09BKS, 50WHS | 50WHS | MLBL-2415 | MLBM-2506 |
| `3ARNCR16N` | 커브러너 GD | 26SS / 2nd | 26S | 2 | 07GRL, 50WID | 07SIS | MLBL-2415 | MLBM-2506 |
| `3ARNCR26N` | 커브러너 | 26SS / 2nd | 26S | 2 | 50OWS, 50SIL | 50OWS | MLBL-2415 | MLBM-2506 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNSPE5N` | 2mm;15mm | 측면;텅 정면 상세;인솔 |
| `3ARNCL16N` | 30mm | 측면;MEDIAL;레이스메쉬 스와치;로고 실물 |
| `3ARNCR16N` | 2mm;15mm | 측면;텅 정면 상세;서브 레이스 실물 |
| `3ARNCR26N` | 2mm;15mm | 측면;텅 정면 상세;서브 레이스 실물 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNSPE5N</code> 커브 러너 에나멜 — 25FW SPOT · 삼덕통상 · JONGHOON KIM · 2024.12.24</summary>

- TONGUE HF DEBOSS 2mm
- CUTTING HF WELDING LOGO BLACK OUTLINE SILVER
- HOTMELT FILM CHARCOAL
- SHOE LACE HOLDER
- HF DEBOSS+PRINT DEBOSS PRINT CHARCOAL
- MICROFIBER SYNTHETIC 302#/SILVER
- R8/SILVER
- HF DEBOSS+PRINT OUTLINE BLACK BG CHARCOAL
- MESH SAME AS 24FW CURVE RUNNER/BLACK
- SHOELACE SAME AS 24FW CURVE RUNNER/GREY
- LINING SAME AS 24FW CURVE RUNNER/GREY
- HF EMBOSS
- 3D PRINT SILVER
- WEBBING SAME AS 24FW CURVE RUNNER 15mm/GREY
- HOTMELT FILM CHARCOAL
- TPU INSERT OPACITY 50% GRADATION GREY→L.GREY
- MIDSOLE CHARCOAL
- OUTSOLE CHARCOAL
- CUTTING HF WELDING LOGO BLACK/3M REFLECTIVE OUTLINE SILVER
- MICROFIBER SYNTHETIC+PRINT ENAMEL/BLACK PRINT GREY(REFER TO THE SAMPLE)
- PU OPEN-CELL SOCKLINER MERRY MESH BG BLACK LOGO W2/BLACK

</details>

<details><summary><code>3ARNCL16N</code> 커브러너 레이스 — 26FW 2nd · SAMDUCK · 김종훈 · 2025.11.05</summary>

- SHOELACE [NATURAL ECHO]XC027/W2
- LACE MESH ML-541/W2 (For mesh use [ROSIA] LACE MESH ML-541)
- HF DEOBSS+PRINT W2
- MICROFIBER SYNTHETIC [ROSIA]R240357/W2
- HF DEBOSS
- MICROFIBER SYNTHETIC [ROSIA]FOIL SYNTHETIC NO.B/S1846#1/SILVER
- LINING MERRY MESH/W2
- 3D PRINTING SILVER(Yankees 30mm)
- LACE(DETACHABLE) [NATURAL ECHO] LACE Code XC071/W2
- TPU CAP TRANSPARENT PEARL
- MIDSOLE W2
- OUTSOLE L.GREY
- NO-SEW HOTMELT W2
- HF WELDING(B 로고) OUTLINE W2 BODY SILVER(SAME QUALITY AS MEDIAL HF WELDING)
- MEDIAL HF WELDING SILVER
- PU OPEN-CELL SOCKLINER MERRY MESH/W2 PRINT BLACK,WHITE

참고 컷/스와치: 레이스 메쉬 스와치(ML-541);Yankees 스크립트 3D 프린팅 스와치;B 로고 HF WELDING 실물컷

</details>

<details><summary><code>3ARNCR16N</code> 커브러너 GD — 26SS 2nd · 삼덕통상 · JONGHOON KIM · 2025.04.22</summary>

- TONGUE HF DEBOSS 2mm
- CUTTING HF WELDING LOGO L.PINK OUTLINE W2
- HOTMELT FILM SILVER
- SHOE LACE HOLDER
- HF DEBOSS+PRINT DEBOSS PRINT L.PINK
- MICROFIBER SYNTHETIC 302#/L.GREY
- R8/L.GREY
- MESH.A(BIG) SAME AS 1st SAMPLE/W3
- MESH.B(SMALL) SAME AS 1st SAMPLE/W3
- SHOELACE SAME AS 24FW CURVE RUNNER/W3
- SUB-SHOELACE [ROSIA]LACES 2570/W3
- LINING MERRY MESH/W3
- HF EMBOSS
- 3D PRINT SILVER
- WEBBING SAME AS 24FW CURVE RUNNER 15mm/GREY
- HF DEBOSS+PRINT GRADATION L.PINK→W2
- HOTMELT FILM SILVER
- TPU INSERT GRADATION L.PINK→W2
- MIDSOLE W2
- OUTSOLE GREY
- CUTTING HF WELDING LOGO L.PINK/3M REFLECTIVE OUTLINE W3
- PU OPEN-CELL SOCKLINER MERRY MESH BG L.GREY LOGO W2/BLACK

참고 컷/스와치: 서브 슈레이스 실물컷;레이스 결속 참조 제품컷

</details>

<details><summary><code>3ARNCR26N</code> 커브러너 — 26SS 2nd · 삼덕통상 · JONGHOON KIM · 2025.04.22</summary>

- TONGUE HF DEBOSS 2mm
- CUTTING HF WELDING LOGO SILVER OUTLINE WHITE
- HOTMELT FILM W2
- SHOE LACE HOLDER
- HF DEBOSS+PRINT DEBOSS PRINT SILVER
- MICROFIBER SYNTHETIC ROSIA MICROFIBER SWATCH F 5593-2/W2
- MESH REFER TO THE SAMPLE(CORDURA)/W2
- SHOELACE SAME AS 24FW CURVE RUNNER/W3
- SUB-SHOELACE [ROSIA]LACES 2570/W2
- LINING MERRY MESH/W2
- HF EMBOSS
- 3D PRINT SILVER
- WEBBING SAME AS 24FW CURVE RUNNER 15mm/W2
- HF DEBOSS
- HOTMELT FILM W2
- TPU INSERT SILVER
- MIDSOLE W2
- OUTSOLE L.BEIGE
- CUTTING HF WELDING LOGO SILVER/3M REFLECTIVE OUTLINE D.GREY
- PU OPEN-CELL SOCKLINER MERRY MESH BG WHITE LOGO W2/BLACK

참고 컷/스와치: 서브 슈레이스 실물컷;레이스 결속 참조 제품컷(put the lace at the top)

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- MEDIAL(내측) 뷰 확보 → 내측 로고·패널 배치 확정 가능. 외측과 다른 부분을 표에서 확인.
- 라스트 `MLBL-2415` 은 다른 형태 3개와 공유 — `MLBL-2415_MLBM-2419`, `MLBL-2415_MLBM-2415`, `MLBL-2415_MLBM-2506-1`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ARNSPE5N`: 커브 러너 에나멜(50GRD) 25FW SPOT — 26SS 커브 러너(3ARNCR26N)와 동일 도면·라스트·아웃솔(2415/2506)의 선행판. 메쉬/슈레이스/라이닝/웨빙 SAME AS 24FW CURVE RUNNER. 컬러 대부분 REFER TO THE SAMPLE
- `3ARNCL16N`: 커브 러너 페미닌(50WHS) 26FW — KG 상품명 "커브러너 레이스". 라스트/아웃솔 2415/2506 = 26SS 커브 러너 동일. 레이스(프릴) 디태처블, TPU CAP TRANSPARENT PEARL
- `3ARNCR16N`: 커브 러너 GD(07SIS, LA 로고, 핑크 그라데이션) 26SS. 3ARNCR26N 과 동일 도면·라스트·아웃솔. MESH.A(BIG)/MESH.B(SMALL) SAME AS 1st SAMPLE
- `3ARNCR26N`: 커브 러너 26SS(50OWS). 라스트 MLBL-2415 / 아웃솔 MLBM-2506 — 24FW 커브 러너(2415/2419)에서 아웃솔 변경, 25FW SPOT 에나멜(3ARNSPE5N)·26SS GD(3ARNCR16N)·26FW 페미닌(3ARNCL16N)과 동일 조합. 텅 정면 뷰 있음

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNSPE5N` | REFER TO THE SAMPLE D.GREY(GRD); CHARCOAL(CGS); BLACK(BKS); GREY(GRS); L.GREY(GRL); PANTONE SILVER C SILVER(SIS) | 50BRS, 50SID |
| `3ARNCL16N` | 12-4306TPG L.GREY(GRL); PANTONE SILVER C SILVER(SIS); W2 WHITE(WHS) | 09BKS, 50WHS |
| `3ARNCR16N` | 14-1506TPG L.PINK(PKL); 18-4105TPG GREY(GRS); SAME AS 1st SAMPLE L.GREY(GRL); PANTONE SILVER C SILVER(SIS); W2 WHITE(WHS); W3 WHITE(WHS) | 07GRL, 50WID |
| `3ARNCR26N` | 19-3907TPG D.GREY(GRD); 12-0605TPG L.BEIGE(BGL); W2 WHITE(WHS); PANTONE SILVER C SILVER(SIS) | 50OWS, 50SIL |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNCL16N`, `3ARNCR16N`, `3ARNCR26N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNSPE5N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNSPE5N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNSPE5N50SID/thnail/34F44C04804E419BA7EC738094508A3A.png/dims/resize/200x200
- `3ARNCL16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNCL16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ARNCL16N50WHS/thnail/3C01FD065D1D4821958C52FCAAC1A715.png/dims/resize/200x200
- `3ARNCR16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNCR16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ARNCR16N07GRL/thnail/825BB9FB41F044189ED9314754A4247A.png/dims/resize/200x200
- `3ARNCR26N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNCR26N.jpg · 제품컷: https://static-dashff.fnf.co.kr/china/detail/M/3ARNCVR5N-50SIS_1.jpg
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
