# 빅볼청키 커브 / 커브 러너 24FW — MLBL-2415 / MLBM-2419

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2415_MLBM-2419` |
| 라스트 (LAST NO.) | `MLBL-2415` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2419` |
| style_code | `M24NRNSPL`, `M25NRNSPL` (2개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 220-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅 정면 상세 · 인솔 |
| 고해상도 원본 | **있음** 8000×5110 — `M24N3ARNSPL4N` 7p → `hires/` |
| 스타일 수 / 컬러웨이 수 | 2 / 12 |
| 성수점 재고 합 (2026-09-06) | 84 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNSPL4N` | 커브 러너 | 24FW / APP | 24F,25F | 8 | 07BKS, 50BGS, 50CRS, 50GRL, 50GRS, 50PKS, 50SIS, 50WHS | 50PKS | MLBL-2415 | MLBM-2419 |
| `3ARNSPL5N` | 커브 러너 모노그램 | 25SS / 1st | 25S | 4 | 07GRL, 50BGL, 50IVS, 50SAS |  | MLBL-2415 | MLBM-2419 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNSPL4N` | 2mm;10mm;15mm | 측면;텅 정면 상세;인솔 |
| `3ARNSPL5N` | 8mm;2mm;10mm;15mm | 측면;텅 정면 상세;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNSPL4N</code> 커브 러너 — 24FW APP · 화승통상 · 김종훈 · 2024.01.02</summary>

- 극세사신세틱 302#/W3, R8/W2, ALLOY/SILVER
- 핫멜트 필름 L.PINK
- 면눌림 나염 SILVER, W3, L.PINK
- 컷팅고주파 로고 L.PINK 테두리 SILVER
- 재봉선 눌림 2mm
- 신끈 터널
- 폴리평끈 에이 샘플통일 조직 10mm/W2
- 양각 고주파
- 라이닝 네이키드울프 샘플통일 BLACK
- 수지나염 W3
- 웨빙 능직폴리(카오나에오네샘플참조) 15mm/D.GREY
- 펀칭
- TPU 투명/D.PINK(발송 사출 참조)
- 파일론 W3
- 러버 BLACK
- 메쉬 에어샘플참조/W3
- TPU 컷팅고주파 바탕 W3 로고 D.GREY
- 소프트오픈셀인솔 헤비메리메쉬/W3 2도나염 W2/BLACK

참고 컷/스와치: 메쉬/끈/텅 실물컷 3종

</details>

<details><summary><code>3ARNSPL5N</code> 커브 러너 모노그램 — 25SS 1st · 화승ONE · 김종훈 · 2024.02.20</summary>

- 극세사신세틱 302#/W2
- 눌림고주파+나염 W2 유광
- 3M 수지나염 D.MINT
- 웨빙 신끈고리 8mm/W2
- 재봉선 눌림 2mm
- 면눌림고주파 D.MINT
- 폴리평끈 기존통일 10mm/W2
- 양각 고주파
- 라이닝 기존통일/W2
- 3M 수지나염 D.MINT
- 웨빙 능직폴리 15mm/W2
- 극세사신세틱 R8/W2
- 눌림고주파+나염 W2 유광
- 승화나염 GRADATION
- TPU 투명/COBALT BLUE
- 파일론 W2
- 러버 W2
- HUAFENG 메쉬 /W2 컬러 HF MA0315 EPM5 100%RECYCLED POLYESTER 54" 366G/M2
- 3M 컷팅고주파 바탕 COBALT BLUE 로고 W2
- 빅볼청키 오픈셀 인솔 헤비메리메쉬/W2 2도나염 W2/BLACK

참고 컷/스와치: HUAFENG 메쉬 스와치;참조 레퍼런스 제품컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 8000×5110 고해상도 페이지 보유 → 텍스처·스티치 라인·로고 세부는 `hires/` 를 기준으로.
- 라스트 `MLBL-2415` 은 다른 형태 3개와 공유 — `MLBL-2415_MLBM-2415`, `MLBL-2415_MLBM-2506-1`, `MLBL-2415_MLBM-2506`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ARNSPL4N`: 빅볼청키 커브(50PKS) 24FW APP — KG 상품명 "커브 러너". 라스트 MLBL-2415 / 아웃솔 MLBM-2419. 헤더에 SIZE RANGE 230~290 명기(구형 헤더). PDF 8p 보유(표지+컬러웨이 7장 8000x5110). 3ARNSPL5N 모노그램(25SS)과 동일 라스트·아웃솔
- `3ARNSPL5N`: 빅볼청키 커브(모노그램, 07WHS) 25SS — KG 상품명 "커브 러너 모노그램". *샘플제작*. 라스트/아웃솔 MLBL-2415/MLBM-2419 = 24FW 커브 러너(3ARNSPL4N)와 완전 동일. 한글 콜아웃, 그라데이션 승화나염

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNSPL4N` | 16-1723 TPG D.PINK(PKD); W3 WHITE(WHS); PANTONE SILVER C SILVER(SIS); 14-1909 TPG L.PINK(PKL); BLACK(BKS) | 07BKS, 50BGS, 50CRS, 50GRL, 50GRS, 50PKS, 50SIS, 50WHS |
| `3ARNSPL5N` | 17-1500TPG GREY(GRS); GRADATION W2-D.MINT-COBALT BLUE; 15-5209TPG D.MINT(MTD); 19-4041TPG COBALT BLUE(CBS); W2 WHITE(WHS) | 07GRL, 50BGL, 50IVS, 50SAS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNSPL4N`, `3ARNSPL5N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNSPL4N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNSPL4N_IMAGE.jpg · 작업지시서 PDF: https://erp.fnf.co.kr/popupPlmPdfOpen.do?pdfUrl=datapackage/3ARNSPL4N-MainTechPack001-ko_Rev.1.pdf · 제품컷: https://static-dashff.fnf.co.kr/china/detail/M/3ARNCVR5N-50SIS_1.jpg
- `3ARNSPL5N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNSPL5N_IMAGE.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNSPL5N50BGL/thnail/A1F756939C7C4F7DA68C5C56FE97593D.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
