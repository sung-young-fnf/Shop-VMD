# 카고 청키 (CARGO CHUNKY) — MLBL-2318 / MLBM-2502

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2318_MLBM-2502` |
| 라스트 (LAST NO.) | `MLBL-2318` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2502`, `NEW` |
| style_code | `M25NSHW07` (1개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅라벨(치수) · 인솔 · 텅라벨(베라) |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 8 |
| 성수점 재고 합 (2026-09-06) | 151 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASHC055N` | 카고 청키 SD | 25FW / 2nd | 25F | 4 | 07BGS, 07PKD, 50GRS, 50IVS |  | MLBL-2318 | MLBM-2502 |
| `3ASHW075N` | 카고 청키 | 25SS / 1st | 25S | 4 | 50CGS, 50CRS, 50SIS, 50WHS | 50IVS | MLBL-2318 | NEW |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

### 귀속 사유 (도면 표기와 형태 ID 가 다른 스타일)
- `3ASHW075N` — 25SS 도면은 아웃솔 NEW. 같은 style_code(M25NSHW07) 의 25FW V2 3ASHC055N 이 MLBM-2502 로 채번됨 → 귀속

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASHC055N` | 40mm;12mm;1.2mm | 측면;텅라벨(치수);인솔 |
| `3ASHW075N` | 45mm;12mm;0.5mm;1.2mm | 측면;텅라벨(베라);인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASHC055N</code> 카고 청키 SD — 25FW 2nd · SAMDUCK · TAEHEON KIM · 2024.11.01</summary>

- TONGUE(40mm) CUTTING HF WELDING RP:STRIPE 2 Color GREY/IVORY
- MICROFIBER SYNTHETIC RP:[TAESUNG]SOPIA/1.2mm/WHITE 2D PRINTING IVORY
- TONGUE BASE MESH(SAME AS QUARTER/VAMP)
- LINING [PAIHONG VIETNAM]PHWS370/GREY
- WEBBING WIDTH 12mm BASE WHITE STRIPE WHITE
- SHOE LACE 2 TONE POLY ROUND(SAME AS BIGBALL CHUNKY) BASE WHITE POINT GREY
- MESH DAEYOUNG/DYT 125-388 CUBE SPACER SWP-EPM5 IVORY
- MICROFIBER SYNTHETIC RP:UM-14/1.2mm IVORY, WHITE
- 2D PRINTING HF DEBOSS(FACE) IVORY
- MICROFIBER SYNTHETIC [TAESUNG]SOPIA/1.2mm WHITE(OUTLINE HF DEBOSS)
- LINING PALLADIUM/PAIHONG VIETNAM PHWS370/GREY
- TPU CUTTING HF WELDING(REFER TO CURVE RUNNER) OUTLINE IVORY LOGO BLACK RP:UM-14
- TPU RP:CARBON(CARBONATE) IVORY
- MIDSOLE CMEVA/WHITE
- OUTSOLE TPR/LIGHT GUM
- SOCKLINER SOFT OPENCELL HEAVY MERRY MESH/WHITE PRINTING IVORY

</details>

<details><summary><code>3ASHW075N</code> 카고 청키 — 25SS 1st · 미정 · 김태현 · 2024.02.28</summary>

- 베라 레이스 2도 폴리통끈(갑피 슈레이스 통일) 컷팅고주파 RP:스트라이프 2톤 SILVER/BLACK
- 극세사신세틱 RP:태성-616/1.2mm WHITE 나염 SILVER
- 표지 2톤 메쉬(측포·선포 통일)
- 이지 [PAIHONG VIETNAM]PHWS370/GREY
- 직조 폭12mm(갑피 직조 통일)
- 극세사신세틱 RP:UM-14/1.2mm SILVER
- 직조 폭12mm 면 WHITE 스트라이프 SILVER
- 극세사신세틱 RP:ALLOY/1.2mm WHITE 고주파(돌출 0.5mm)
- 2톤 메쉬(샘플참조) 바탕 SILVER 표지 WHITE
- 레이스 2도폴리통끈(빅볼청키통일) 바탕 WHITE 포인트 BLACK
- 라이닝 팔라디움/PAIHONG VIETNAM PHWS370/GREY
- 나염고주파 돌출 0.5mm/WHITE
- 핫멜트 필름 RP:카본 0.5mm SILVER
- 2도 호스킨 세로 45mm 바탕 SILVER 로고 BLACK
- TPU RP:카본(카보네이트) 바탕 SILVER TPU 투명
- 미드솔 WHITE
- 아웃솔 BLACK
- 소프트 오픈셀인솔 헤비메리메쉬/WHITE 2도나염 BLACK/WHITE

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2318` 은 다른 형태 2개와 공유 — `MLBL-2318_MLBM-2423`, `MLBL-2318_MLBM-2519`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASHC055N`: 카고 청키 V2(SD, 50IVS) 25FW. 라스트 MLBL-2318 / 아웃솔 MLBM-2502 — 25SS 카고 청키(3ASHW075N, 아웃솔 NEW)의 채번 후속. TPU CUTTING HF WELDING(REFER TO CURVE RUNNER). 아웃솔 TPR/LIGHT GUM
- `3ASHW075N`: 와일드볼 카고(50IVS) 25SS 1st — KG 상품명 "카고 청키". *샘플 진행*. 라스트 MLBL-2318(에이스러너·트랙러너 공유) / 아웃솔 NEW → 같은 style_code 의 25FW 카고 청키 V2(3ASHC055N)에서 MLBM-2502 로 채번. 한글 콜아웃

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASHC055N` | GREY 17-0000TPG; BLACK; LIGHT GUM 15-1216TPG; IVORY 12-4300TPG; WHITE W3 | 07BGS, 07PKD, 50GRS, 50IVS |
| `3ASHW075N` | BLACK; L.GREY 14-4203TPG; SILVER PANTONE SILVER C; WHITE W3 | 50CGS, 50CRS, 50SIS, 50WHS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 일부 스타일의 라스트/아웃솔이 도면상 **미채번(NEW)·벤더번호·미기재** — 위 "귀속 사유" 참조.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASHC055N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHC055N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHW075N50CGS/thnail/7F1E24623C02485C83659AADAEEC559A.jpg/dims/resize/200x200
- `3ASHW075N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHW075N_IMAGE.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHW075N50CGS/thnail/7F1E24623C02485C83659AADAEEC559A.jpg/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
