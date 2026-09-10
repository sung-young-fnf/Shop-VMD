# 에이스러너 · 에이스러너 메리제인 — MLBL-2318 / MLBM-2423

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2318_MLBM-2423` |
| 라스트 (LAST NO.) | `MLBL-2318` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2423` |
| style_code | `M25NRNA02`, `M25SSDACE` (2개) |
| TYPE1 (라스트 카테고리) | RUNNER / SUMMER SHOES |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅라벨(베라) · 직조 상세 · 인솔 · 인솔(펀칭 EVA) |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 5 |
| 성수점 재고 합 (2026-09-06) | 27 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNA025N` | 에이스 러너 LA | 25SS / 1st | 25S | 1 | 07WHS | 07WHS | MLBL-2318 | MLBM-2423 |
| `3ASDACE53` | 에이스러너 메리제인 | 25SS / 1ST | 25S | 4 | 50BKS, 50BRS, 50CRS, 50SIS |  | MLBL-2318 | MLBM-2423 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNA025N` | 12mm;1.2mm;1.0mm;6mm;0.5mm | 측면;텅라벨(베라);직조 상세;인솔 |
| `3ASDACE53` | 1.2mm;1.0mm | 측면;인솔(펀칭 EVA) |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNA025N</code> 에이스 러너 LA — 25SS 1st · 삼덕통상 · 김태현 · 2024.02.06</summary>

- 베라 컷팅고주파 RP:스트라이프 2톤 SILVER/IVORY
- 표지 [SINCETECH]D2560F-01/IVORY
- 이지 [PAIHONG VIETNAM]PHWS370/L.GREY
- 직조 폭12mm(필립등) IVORY
- 극세사신세틱 RP:ALLOY/1.2mm(면눌림고주파 IVORY) 전면나염 SILVER
- 극세사신세틱 RP:VINIMI/1.0mm WHITE 나염 SILVER 펀칭 0.5mm
- 레이스 폴리/오발/6mm IVORY
- 테눌림나염고주파 IVORY
- 라이닝 팔라디움/PAIHONG VIETNAM PHWS370/IVORY
- 직조 폭12mm 면 IVORY 스트라이프 SILVER
- 메쉬 리복/SINCETECH D2560F-01/L.GREY
- 나염 SILVER
- 면눌림나염고주파 IVORY
- 펀칭 0.5mm
- 미드솔 IVORY
- 아웃솔 IVORY
- 신끈 기성/FNKS 033 폴리/오발/6mm 면 L.GREY 테두리 WHITE
- 오픈셀인솔 헤비메리메쉬/L.GREY 2도나염 BLACK/WHITE

참고 컷/스와치: 신끈 실물컷(FNKS 033)

</details>

<details><summary><code>3ASDACE53</code> 에이스러너 메리제인 — 25SS 1ST · 삼덕통상 · 김태현 · 2024.06.26</summary>

- 극세사신세틱 RP:ALLOY/1.2mm SILVER
- 극세사신세틱 RP:VINIMI/1.0mm 나염 L.GREY
- 면놀림나염고주파 CHARCOAL
- 2톤 메쉬 대영/DYI SOLAR SW MESH CDP/P-EPM5 BASE L.GREY TOP GREY
- 2도 호스킨 TOP L.GREY BOTTOM CHARCOAL
- CDP 스판메쉬 CHARCOAL
- 웨빙(에이스러너 동일) CHARCOAL
- 미드솔 GREY
- 아웃솔 CHARCOAL
- 펀칭 EVA 오픈셀 인솔 2도나염 BLACK/WHITE

참고 컷/스와치: 2톤 메쉬 스와치

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2318` 은 다른 형태 2개와 공유 — `MLBL-2318_MLBM-2502`, `MLBL-2318_MLBM-2519`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ARNA025N`: 에이스러너(07WHS) 25SS — KG 상품명 "에이스 러너 LA". 라스트 MLBL-2318 / 아웃솔 MLBM-2423 = 에이스러너 메리제인(3ASDACE53)과 완전 동일 → 다른 style_code 지만 형태 병합. 한글 콜아웃
- `3ASDACE53`: 에이스러너 메리제인. 라스트 MLBL-2318 은 카고 청키(3ASHW075N)와 동일 → 형태 병합 후보(아웃솔은 상이 2423 vs NEW). CDP 스판메쉬는 빅볼청키 마스크 참조

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNA025N` | L.GREY 13-4104TPG; SILVER PANTONE 10103 C; IVORY W3; WHITE W3 | 07WHS |
| `3ASDACE53` | CHARCOAL 17-4014 TPG; GREY 14-4202 TPG; SILVER PANTONE SILVER C; L.GREY 13-4104 TPG | 50BKS, 50BRS, 50CRS, 50SIS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNA025N`, `3ASDACE53` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNA025N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNA025N_IMAGE.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNA025N07WHS/thnail/508F2978F33D47468879EFF8BE2716F1.png/dims/resize/200x200
- `3ASDACE53` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASDACE53.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25S3ASDACE5350SIS/thnail/A8EE5108714C48E19B4DA6DE827842F5.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
