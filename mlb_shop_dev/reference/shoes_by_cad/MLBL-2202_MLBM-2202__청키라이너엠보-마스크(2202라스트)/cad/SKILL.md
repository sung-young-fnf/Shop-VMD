# 청키라이너 엠보·마스크 (2202 라스트) — MLBL-2202 / MLBM-2202

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2202_MLBM-2202` |
| 라스트 (LAST NO.) | `MLBL-2202` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2202` |
| style_code | `M25NSXE01`, `M26SSDCL1`, `M25NSXM07` (3개) |
| TYPE1 (라스트 카테고리) | LINER / SUMMER SHOES |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 225-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅라벨(베라) · 인솔 · 웨빙상세 · 아웃솔저면(소) |
| 고해상도 원본 | **있음** 8000×5110 — `M26N3ASXM036N` 2p → `hires/` |
| 스타일 수 / 컬러웨이 수 | 4 / 8 |
| 성수점 재고 합 (2026-09-06) | 64 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASXE015N` | 청키라이너 엠보 모노그램 쿠퍼스 타운 | 25SS / SPOT | 25S | 3 | 50BKS, 50CRS, 50WHS |  | MLBL-2202 | MLBM-2202 |
| `3ASDCL163` | 청키라이너 마스크 | 26SS / TEST SAMPLE | 26S | 1 | 50WHS |  | MLBL-2202 | MLBL-2202(표기 그대로, MLBM 오기 추정) |
| `3ASDCL263` | 청키라이너 마스크 | 26SS / TEST SAMPLE | 26S | 1 | 50SAS |  | MLBL-2202 | MLBL-2202(표기 그대로, MLBM 오기 추정) |
| `3ASXM036N` | 청키라이너 엠보 모노그램 | 26SS / 1st | 26S | 3 | 50BGS, 50GRS, 50IVS |  | MLBL-2202 | MLBM-2202 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASXE015N` | 12mm;11mm;3mm;2mm | 측면;텅라벨(베라);인솔 |
| `3ASDCL163` | 60mm;90mm;49mm;14mm;50mm;25mm;5mm | 측면;웨빙상세;아웃솔저면(소) |
| `3ASDCL263` | 60mm;90mm;49mm;14mm;50mm;25mm;5mm | 측면;웨빙상세;아웃솔저면(소) |
| `3ASXM036N` | 1.2T;11mm;3mm;12mm;1.0mm;2mm | 측면;텅라벨(베라);인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASXE015N</code> 청키라이너 엠보 모노그램 쿠퍼스 타운 — 25SS SPOT · - · 김종훈 · 2024.04.17</summary>

- 베라 수지나염 L.GREY
- 극세사신세틱 #302/W3
- 눌림고주파
- 극세사신세틱+모노그램 고주파 눌림 #302/W3
- 베라장식(베라 감피와 아치에 물려 후 제봉)
- 아일렛 금속 11mm 폭 3mm SE-356/W3
- 라이닝 헤비메리메쉬/W3
- 폴리평끈 12mm/W3
- TPU 파이핑 2mm 3M/W3
- 신세틱 컷팅고주파 RP #302 테두리 L.GREY 로고 W3
- 미드솔 W3
- 아웃솔 W3
- 라이너 오픈셀 인솔 헤비메리메쉬/W3 승화전사 L.GREY

참고 컷/스와치: 신세틱 컷팅고주파 예시 실물컷

</details>

<details><summary><code>3ASDCL163</code> 청키라이너 마스크 — 26SS TEST SAMPLE · 삼덕통상 · JAEGON YOO · 2025.04.23</summary>

- MICROFIBER SYNTHETIC RP:[NATURAL ECHO]C-02/W3
- PVC EYELET(청키라이너 미드 동일)
- POLY FLAT SHOELACE(청키라이너 동일)/W4
- POLY BIAS TAPE(빅볼청키 마스크 동일)
- WEBBING(청키라이너 베이직 동일) BASE L.GREY LOGO W3
- LINING CDP SPAN 5mm/W3
- MESH [ROSIA]HY11681/W3
- SUB SHOELACE [DAEKYUNG]DK564/2TONE W3+GREY
- MIDSOLE W3
- OUTSOLE TPR/CLEAR(25SS 청키라이너 데님 모노그램 SL 50GRS 동일)/GREY
- SOCKLINER SOFT OPENCELL
- FACE TEXTILE HEAVY MERRY MESH/GREY
- HEAT TRANSFER PRINTING BLACK

</details>

<details><summary><code>3ASDCL263</code> 청키라이너 마스크 — 26SS TEST SAMPLE · 삼덕통상 · JAEGON YOO · 2025.04.23</summary>

- MICROFIBER SYNTHETIC RP:[ROSIA]YXL2038-29/BEIGE
- PVC EYELET/W4
- POLY FLAT SHOELACE/W4
- POLY BIAS TAPE
- WEBBING BASE L.BROWN LOGO W3
- LINING CDP SPAN 5mm/W4
- MESH [ROSIA]HY11681/W4
- SUB SHOELACE DK564 W3+W4
- MIDSOLE W4
- OUTSOLE TPR/CLEAR/BEIGE
- SOCKLINER SOFT OPENCELL
- FACE TEXTILE HEAVY MERRY MESH/W4
- HEAT TRANSFER PRINTING BLACK

참고 컷/스와치: 자재 스와치(YXL2038-29)

</details>

<details><summary><code>3ASXM036N</code> 청키라이너 엠보 모노그램 — 26SS 1st · 삼덕통상 · 김종훈 · 2025.02.18</summary>

- 베라 3D PRINT W3
- MICROFIBER SYNTHETIC TAESUNG ULTRA MICROFIBER 1.2T AR64/L.GREY (+PRINTING MONOGRAM)
- 1.2T R302/W3 (+HF DEBOSS MONOGRAM)
- HF DEBOSS
- TONGUE LABEL SEWN IN BETWEEN UPPER AND LINING
- EYELET METAL 11mm WIDTH 3mm SE-356/L.GREY
- POLYESTER FLAT SHOELACE 12mm/W3
- LINING MERRY MESH/W3
- UNDERLAYER MICROFIBER AR-100(1.0mm) WIDTH 2mm 3M/W3
- PAINTING L.GREY
- 2-TONE HOTSKIN LOGO D.GREY OUTLINE W3
- MIDSOLE W3
- OUTSOLE TPR CLEAR SOLE/L.GREY
- PU OPENCELL INSOLE MERRY MESH/W3 SUBLIMATION PRINT L.GREY

</details>

### 모델링 노트
- 저면/아웃솔/풋베드 뷰 확보 → 트레드·풋베드 로고 참조 가능.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 8000×5110 고해상도 페이지 보유 → 텍스처·스티치 라인·로고 세부는 `hires/` 를 기준으로.
- `3ASXE015N`: 청키라이너 엠보 모노그램(쿠퍼스타운 25SS SPOT). 헤더 LAST 가 MLBL-2202 로, 같은 계열 3ASXE035N(MLBL-2102-2/MLBM-2413)과 다름 → 같은 상품명이지만 라스트·아웃솔 상이. *신세틱 컷팅고주파 주변 눌림 모노그램 삭제*
- `3ASDCL163`: 청키라이너 계열 파생(REFER TO CHUNKY LINER / BIGBALL CHUNKY MASK OPENING). 아웃솔 TPR CLEAR. 3ASDCL263 과 동일 도면
- `3ASDCL263`: 3ASDCL163 과 동일 도면·동일 라스트, 컬러웨이(베이지/L.BROWN)만 다름
- `3ASXM036N`: 청키라이너 엠보 모노그램 26SS. 라스트 MLBL-2202 / 아웃솔 MLBM-2202 (3ASXE015N SPOT 과 동일 조합). OUTSOLE TPR CLEAR SOLE. PDF 보유(고해상도 2p)

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASXE015N` | 14-4104TPG L.GREY(GRL); W3 WHITE(WHS) | 50BKS, 50CRS, 50WHS |
| `3ASDCL163` | GREY(CLEAR) 13-4104 TPG; GREY; W3; BLACK | 50WHS |
| `3ASDCL263` | BEIGE(CLEAR) 13-1105 TPG; BEIGE YXL2038-29; W4; L.BROWN 16-0205 TPG; BLACK | 50SAS |
| `3ASXM036N` | W3 WHITE(WHS); 16-4402TPG GREY(GRS); 14-4107TPG L.GREY(GRL); 19-3907TPG D.GREY(GRD) | 50BGS, 50GRS, 50IVS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASXE015N`, `3ASDCL263` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASXE015N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXE015N_IMAGE.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASXE015N50WHS/thnail/19E3AD7CEAF54825BD60FBDF24C136C1.png/dims/resize/200x200
- `3ASDCL163` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASDCL163.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26S3ASDCL16350WHS/thnail/6B71316E53A54297A122315938FC4F84.png/dims/resize/200x200
- `3ASDCL263` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASDCL263.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26S3ASDCL16350WHS/thnail/6B71316E53A54297A122315938FC4F84.png/dims/resize/200x200
- `3ASXM036N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASXM036N.jpg · 작업지시서 PDF: https://erp.fnf.co.kr/popupPlmPdfOpen.do?pdfUrl=datapackage/3ASXM036N-MainTechPack001-ko_Rev.1.pdf · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASXM036N50BGS/thnail/61BAEB31A4D744899A6C550737A6D645.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
