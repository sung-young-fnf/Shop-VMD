# 트랙 러너 (TRACK RUNNER) — MLBL-2318 / MLBM-2519

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2318_MLBM-2519` |
| 라스트 (LAST NO.) | `MLBL-2318` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2519` |
| style_code | `M25NRNR02` (1개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅라벨 · 신발끈 상세 · 로고 단면 · 인솔 · 텅라벨(베라) |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 3 / 5 |
| 성수점 재고 합 (2026-09-06) | 74 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNR025N` | 트로피 러너 SD | 25FW / 2nd | 25F | 3 | 50BGS, 50BRS, 50KAM |  | MLBL-2318 | MLBM-2519 |
| `3ARNR045N` | 트로피 러너 NB | 25FW / 2nd | 25F | 1 | 50IVS |  | MLBL-2318 | MLBM-2519 |
| `3ARNR055N` | 트로피 러너 | 25FW / 2nd | 25F | 1 | 50SIS | 50CGS | MLBL-2318 | MLBM-2519 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNR025N` | 8mm;1.2mm | 측면;텅라벨;신발끈 상세;로고 단면;인솔 |
| `3ARNR045N` | 8mm;1.2mm | 측면;텅라벨;신발끈 상세;로고 단면;인솔 |
| `3ARNR055N` | 8mm;1.2mm;4mm | 측면;텅라벨(베라);신발끈 상세;로고 단면;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNR025N</code> 트로피 러너 SD — 25FW 2nd · SAMDUCK · TAEHEON KIM · 2024.11.01</summary>

- TONGUE TPU HOTMELT [LEE BOU INTERNATIONAL]AKA126A BASE KHAKI TOP(RP:AR-219SM) GREY
- FACE TEXTILE A MESH
- LINING [DAEYOUNG]DYI INTERLOCK/BLACK
- WEBBING Width 8mm/KHAKI
- MICRO FIBER SYNTHETIC RP:[TAESUNG]SOPIA/1.2mm KHAKI
- RP:[TAESUNG]PEARL UM/1.2mm D.KHAKI
- 2D PRINTING(2COLOR) BASE GREY LOGO KHAKI
- A MESH [ROSIA]/N-C1056 KHAKI
- 2D PRINTING HF DEBOSS(FACE) GREY
- ROUND SHOE LACE [DAEYOUNG]DYS20-34 BASE BLACK DOT D.KHAKI
- WEBBING CORDURA/Width 8mm KHAKI
- COLLAR LINING [DAEYOUNG]DYI INTERLOCK
- TPU HOTMELT AKA126A
- HF DEBOSS(LINE)
- B MESH KHAKI
- MIDSOLE CMEVA/BLACK
- TPU SHEET KHAKI
- RUBBER BLACK
- TPR(PVC FREE) KHAKI
- CUTTING H/F WELDING BLACK(SHINY PRINTING) RP:BASE AR-219SM EDGE X
- OUTSOLE BLACK
- SOCKLINER PUNCHING EVA HEAVY MERRY MESH/BLACK 2COLOR PRINTING BLACK/WHITE

참고 컷/스와치: 라운드 슈레이스 실물컷;NY 로고 실물컷(CROSS SECTION)

</details>

<details><summary><code>3ARNR045N</code> 트로피 러너 NB — 25FW 2nd · SAMDUCK · TAEHEON KIM · 2024.11.01</summary>

- TONGUE TPU HOTMELT AKA126A BASE GREY TOP(RP:AR-219SM) CREAM
- LINING DYI INTERLOCK/CREAM
- WEBBING Width 8mm/GREY
- MICRO FIBER SYNTHETIC RP:[ROSIA]NUBUCK A/1.2mm GREY, CREAM
- RP:[TAESUNG]PEARL UM/1.2mm CREAM, GREY
- 2D PRINTING(2COLOR) BASE CREAM LOGO WHITE
- A MESH [ROSIA]/N-C1056 WHITE
- 2D PRINTING HF DEBOSS(FACE) CREAM
- ROUND SHOE LACE DYS20-34 BASE WHITE DOT GREY
- WEBBING CORDURA 8mm CREAM
- COLLAR LINING DYI INTERLOCK WHITE
- TPU HOTMELT AKA126A BASE GREY TOP CREAM
- HF DEBOSS(LINE)
- B MESH WHITE
- MIDSOLE CMEVA/Refer to Sample(D)
- MIDSOLE PAINTONG CREAM
- TPU SHEET GREY
- RUBBER GREY
- TPR(PVC FREE)
- CUTTING H/F WELDING CHARCOAL(SHINY PRINTING) RP:BASE AR-219SM EDGE X
- OUTSOLE CHARCOAL
- SOCKLINER PUNCHING EVA HEAVY MERRY MESH/WHITE 2COLOR PRINTING BLACK/WHITE

참고 컷/스와치: 라운드 슈레이스 실물컷;NY 로고 실물컷

</details>

<details><summary><code>3ARNR055N</code> 트로피 러너 — 25FW 2nd · 삼덕통상 · 김태현 · 2024.11.01</summary>

- 베라 TPU핫멜트 [LEE BOU INTERNATIONAL]AKA126A 바탕 SILVER 로고(RP:AR-219SM) CHARCOAL
- 표지 A메쉬/감피통일
- 이지 [대영]DYI INTERLOCK/GREY
- 직조 폭8mm(감피통일)/GREY
- 극세사신세틱 RP:[대성합피]R-8/1.2mm SILVER
- RP:FNL/1.2mm SILVER(청키라이너라이트 50SIS 소재동일)
- 2도나염 BASE GREY LOGO CHARCOAL
- A메쉬 로시아/N-C1056 CHARCOAL
- 나염 GREY
- 슈레이스 [대유통상]DYS20-34/통근(4mm) 바탕 GREY 도트 CHARCOAL
- 직조 CORDURA 폭8mm GREY
- 극세사신세틱 1.2mm/AR-219SM GREY
- 라이닝 DYI INTERLOCK GREY
- TPU핫멜트 AKA126A
- 테눌림고주파
- 면눌림나염고주파
- 미드솔 채색 GREY
- 아웃솔 CHARCOAL
- B메쉬 GREY
- 미드솔 촘촘한새시 GREY
- 라바 GREY
- TPU시트 SILVER
- TPR(PVC FREE)
- 컷팅고주파 CHARCOAL(유광) RP:BASE AR-219SM EDGE X
- 펀칭EVA인솔 헤비메리메쉬/GREY 2도나염 BLACK/WHITE

참고 컷/스와치: 슈레이스 실물컷;NY 로고 실물컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2318` 은 다른 형태 2개와 공유 — `MLBL-2318_MLBM-2502`, `MLBL-2318_MLBM-2423`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ARNR025N`: 트랙 러너(SD, 50KAM 카키) 25FW — KG 상품명 "트로피 러너 SD". 라스트 MLBL-2318(에이스러너·카고 청키 공유) / 아웃솔 MLBM-2519 신규. 3ARNR045N·055N 과 동일 도면
- `3ARNR045N`: 트랙 러너(NB, 50IVS) 25FW — KG 상품명 "트로피 러너 NB". 3ARNR025N 과 동일 도면·라스트·아웃솔. 컬러칩 A~E 가 샘플 참조(부위별 지정)
- `3ARNR055N`: 트랙 러너 신세틱(메탈) 버전(50CGS) 25FW — KG 상품명 "트로피 러너". 3ARNR025N 과 동일 도면·라스트·아웃솔. 한글 콜아웃. 실버 FNL 소재는 청키라이너라이트 50SIS 동일

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNR025N` | GREY 16-6206 TPG; BLACK; D.KHAKI 19-0419 TPG; KHAKI 17-0115 TPG | 50BGS, 50BRS, 50KAM |
| `3ARNR045N` | CHARCOAL(E 아웃솔); Midsole color(D 미드솔); CREAM(C 갑피); GREY(B 갑피); WHITE(A 메쉬) — Refer to sample | 50IVS |
| `3ARNR055N` | CHARCOAL(E 참조샘플 아웃솔); 미드솔(D); GREY(C 라이닝); SILVER(B 갑피); CHARCOAL(A 메쉬) | 50SIS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNR025N`, `3ARNR045N`, `3ARNR055N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNR025N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNR025N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNR055N50SIS/thnail/4EEA364958F54A49B0990291E41CBB4D.png/dims/resize/200x200
- `3ARNR045N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNR045N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNR055N50SIS/thnail/4EEA364958F54A49B0990291E41CBB4D.png/dims/resize/200x200
- `3ARNR055N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNR055N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNR055N50SIS/thnail/4EEA364958F54A49B0990291E41CBB4D.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
