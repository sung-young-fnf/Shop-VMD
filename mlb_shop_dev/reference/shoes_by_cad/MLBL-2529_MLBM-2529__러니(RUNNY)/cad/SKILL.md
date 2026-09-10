# 러니 (RUNNY) — MLBL-2529 / MLBM-2529

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2529_MLBM-2529` |
| 라스트 (LAST NO.) | `MLBL-2529` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2529` |
| style_code | `M26NSXC01`, `M26NSXRM1` (2개) |
| TYPE1 (라스트 카테고리) | SNEAKERS |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 225-280 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서+치수 |
| 확보 뷰 | 측면 · RIGHT SIDE(메디얼) · 텅라벨(치수) · 힐탭 상세 · 인솔 · MEDIAL VIEW · 인솔(치수) |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 3 / 9 |
| 성수점 재고 합 (2026-09-06) | 123 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASXC016N` | 러니 | 26SS / CFM | 26S | 3 | 50BKS, 50SIS, 50WHS |  | MLBL-2529 | MLBM-2529 |
| `3ASXC026N` | 러니 새틴 | 26SS / CFM | 26S | 3 | 07LDS, 50BLS, 50PKS |  | MLBL-2529 | MLBM-2529 |
| `3ASXRN16N` | 러니 메리제인 | 26SS / 2ND | 26S | 3 | 07BLL, 50PKS, 50SIS |  | MLBL-2529 | MLBM-2529 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASXC016N` | 10mm;27mm;42mm;35mm;12mm;25mm;70mm;45mm;15mm;50mm;7mm;23mm;30mm;17mm;3mm;1.5mm;0.8mm;42mm;5mm | 측면;RIGHT SIDE(메디얼);텅라벨(치수);힐탭 상세;인솔 |
| `3ASXC026N` | 10mm;27mm;42mm;45mm;10mm;5mm;7mm;80mm;15mm;3mm;1.5mm;42mm | 측면;RIGHT SIDE(메디얼);텅라벨(치수);인솔 |
| `3ASXRN16N` | 45mm;10mm;12mm;120mm;17mm;70mm;12mm;1.5mm;7mm;3mm;35mm;30mm;5mm | 측면;MEDIAL VIEW;인솔(치수) |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASXC016N</code> 러니 — 26SS CFM · HUALI · JAEGON YOO · 2025.09.12</summary>

- TONGUE 10/27/42/35/12mm 2 TONE 2D PRINTING+OUTLINE DEBOSS BG W3 LOGO CHAMPAGNE, LINING HEAVY MERY MESH BG L.GREY
- GLOSSY METAL LOGO EYLET(SAME AS SAMPLE)/SILVER
- MICROFIEBER SYNTHETIC RP:[ROSIA]NATURAL ECHO:C-02/W3, /L.GREY
- SYNTHETIC SUEDE [ROSIA]NTR003/L.GREY
- SKIN SUEDE 0.8mm/L.GREY
- SHOE LACE WAXED 5mm/L.GREY
- LINING SAME AS 25SS CHEESE
- 3D PRINTING CHAMPAGNE 30mm
- RUBBER SHEET RB 1.5mm/W3
- ZIG ZAG STITCHING GREY 3mm(SAME AS 26SS SLEEK POWDER)
- OUTSOLE RB/W3
- MIDSOLE EVA/GREY
- METAL CHARM [ROSIA]31840#/SILVER
- SYNTHETIC CUTTING H/F WELDING [NATURAL ECHO]C-02/BLACK HEIGHT 42mm
- OPENCELL ARCH INSOLE(MOLDING) 5mm ORTHOLITE+HEAVY MERY MESH W3 SUBLIMATION BLACK
- SUB SHOELACE [KISUNG]FNKS 037 BASE W3 POINT L.GREY

참고 컷/스와치: 아일렛 실물컷;RIGHT SIDE 제품컷

</details>

<details><summary><code>3ASXC026N</code> 러니 새틴 — 26SS CFM · HUALI · JAEGON YOO · 2025.09.12</summary>

- TONGUE 2 TONE 2D PRINTING+OUTLINE DEBOSS BG W3 LOGO SILVER, LINING MULTI SPAN BG BLUE
- SHOE LACE TUNNEL
- GLOSSY METAL LOGO EYELET/SILVER
- LINING MULTI SPAN(SAME AS 26SS SLEEK POWDER)/BLUE
- SHOE CHARM [ROSIA]0515(8)
- SATIN [ROSIA]L1317-1 No.27/BLUE
- SHOE LACE WAXED 5mm/W3
- MICROFIEBER SYNTHETIC [MEGA]50475 0.8mm/W3
- 3D PRINTING SILVER
- RUBBER SHEET RB 1.5mm/W3
- ZIG ZAG STITCHING W3 3mm
- OUTSOLE RB/W3
- MIDSOLE EVA/BLUE
- METAL CHARM [ROSIA]31840#/SILVER
- EMBROIDERY LOGO(SAME AS 26SS CLUBBIE) W3 HEIGHT 42mm
- SPARE SHOE LACE ROSIA LACES CODE 2570 0.2/PAIR/100CM WHITE
- OPENCELL ARCH INSOLE 5mm ORTHOLITE+HEAVY MERY MESH W3 SUBLIMATION BLUE

참고 컷/스와치: 새틴 스와치(L1317-1 No.27);슈참 실물컷;아일렛 실물컷;RIGHT SIDE 제품컷

</details>

<details><summary><code>3ASXRN16N</code> 러니 메리제인 — 26SS 2ND · HUALI · JAEGON YOO · 2025.11.05</summary>

- METAL OVAL RING [DAESUNG]NR-85
- GLOSSY METAL EYELET [DAESUNG]SE_296/SILVER
- LINING MULTI SPAN(SAME AS 26SS POWDER SATIN)/GREY
- MICROFIEBER SYNTHETIC [MEGA]50475 0.8mm/W3
- SATIN [ROSIA]L09003/SILVER(L1317-1 NO.46 COLOR MATCHING), /BLUE
- RUBBER SHEET RB 1.5mm/W3
- VELCRO [ROSIA]VELCRO OPTION S(SAME AS 26SS FLARE MARY JANE)
- ZIG ZAG STITCHING SYNTHETIC COLOR MATCHING 3mm(SAME AS 26SS RUNNY)
- MIDSOLE EVA 7mm/GREY
- OUTSOLE RB/W3
- EMBROIDERY LOGO W3 HEIGHT 35mm(SAME AS 26SS CLUBBIE)
- OPENCELL ARCH INSOLE(MOLDING) 5mm ORTHOLITE+HEAVY MERY MESH/GREY SUBLIMATION W2 30mm

참고 컷/스와치: 새틴 스와치 2종;아일렛 실물컷;샘플 제품컷(WRINKLE CORRECTION NEEDED)

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- MEDIAL(내측) 뷰 확보 → 내측 로고·패널 배치 확정 가능. 외측과 다른 부분을 표에서 확인.
- 부위 폭·높이 콜아웃(파란선)이 다수 있는 사양서 — 패널 비례를 이 값에 맞출 것.
- `3ASXC016N`: 러니(RUNNY) 26SS CFM. 라스트 MLBL-2529 / 아웃솔 MLBM-2529 (러니 전용, 톱니 아웃솔). 치수 콜아웃 다수(폭·높이 파란선). ZIG ZAG STITCHING SAME AS 26SS SLEEK POWDER. 3ASXC026N 러니 새틴과 동일 도면
- `3ASXC026N`: 러니 새틴(RUNNY ST) 26SS CFM. 3ASXC016N 과 동일 라스트·아웃솔·도면, 새틴 소재+슈참
- `3ASXRN16N`: 러니 메리제인 ST 26SS. 라스트/아웃솔 2529/2529 = 러니와 동일 형태, 2줄 스트랩 메리제인 갑피. *WRINKLE CORRECTION NEEDED*. VELCRO SAME AS 26SS FLARE MARY JANE

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASXC016N` | W3; GREY 14-4107 TPG; BLACK; L.GREY 12-4300 TPG; CHAMPHAGNE PANTONE 10358C | 50BKS, 50SIS, 50WHS |
| `3ASXC026N` | SILVER C; W3; BLUE [ROSIA]L1317-1 NO.027; BLUE 14-4214 TPG | 07LDS, 50BLS, 50PKS |
| `3ASXRN16N` | W2; GREY 13-4305 TPG; W3; SILVER(COLOR MATCHING) | 07BLL, 50PKS, 50SIS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASXC016N`, `3ASXC026N`, `3ASXRN16N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASXC016N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXC016N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXC016N50WHS/thnail/8000BAADA61740D8BD1022433EA93B41.png/dims/resize/200x200
- `3ASXC026N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXC026N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXC016N50WHS/thnail/8000BAADA61740D8BD1022433EA93B41.png/dims/resize/200x200
- `3ASXRN16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXRN16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXRN16N50SIS/thnail/C7F82911D580414894801045EB2BF6BD.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
