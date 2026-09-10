# 페이스트리 러너 · 페이스트리 마스크 (PASTRY CHUNKY) — MLBL-2404 / MLBM-2521

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2404_MLBM-2521` |
| 라스트 (LAST NO.) | `MLBL-2404` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2521` |
| style_code | `M25NRNP01`, `M26SSDPA1`, `M26SSDPA3` (3개) |
| TYPE1 (라스트 카테고리) | RUNNER / SUMMER SHOES |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 텅라벨 · 신발끈 상세 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 5 / 6 |
| 성수점 재고 합 (2026-09-06) | 57 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNP015N` | 페이스트리 러너 SD | 25FW / 2nd | 25F | 2 | 07BGL, 50OWS |  | MLBL-2404 | MLBM-2521(NEW) |
| `3ARNP025N` | 페이스트리 러너 빈티지 | 25FW / 2nd | 25F | 1 | 50WHS | 50WHS | MLBL-2404 | MLBM-2521(NEW) |
| `3ARNP035N` | 페이스트리 러너 NB | 25FW / 2nd | 25F | 1 | 50BKS | 50BLL | MLBL-2404 | MLBM-2521(NEW) |
| `3ASDPA163` | 페이스트리 러너 마스크 | 26SS / 1st | 26S | 1 | 50CRL |  | MLBL-2404 | MLBM-2521 |
| `3ASDPA363` | 페이스트리 러너 마스크 메탈 | 26SS / 1st | 26S | 1 | 50SIS |  | MLBL-2404 | MLBM-2521 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNP015N` | 20mm;10mm;8mm;1mm;1.2mm;0.5mm | 측면;텅라벨;신발끈 상세 |
| `3ARNP025N` | 20mm;10mm;8mm;1mm;1.2mm;0.5mm | 측면;텅라벨;신발끈 상세 |
| `3ARNP035N` | 20mm;10mm;8mm;1mm;1.2mm;0.5mm | 측면;텅라벨;신발끈 상세 |
| `3ASDPA163` | 8mm;20mm;5mm | 측면;인솔 |
| `3ASDPA363` | 8mm;20mm;5mm | 측면;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNP015N</code> 페이스트리 러너 SD — 25FW 2nd · 에스아이무역 · 김종훈 · 2024.10.31</summary>

- WEBBING 20mm KISUNG FNKS-114/BEIGE
- MICROFIBER SYNTHETIC TAESUNG SOFIA/CREAM(#D1828ZJ) +HF DEBOSS+PRINT BEIGE
- +TEXTURE HF DEBOSS PRINT ROSIA MICROFIBER NUBUCK/CREAM PRINT BEIGE
- MESH BEIGE(DAEYOUNG DYT V25-411 CROCK SW P-EPM5)
- WEBBING 10mm/CREAM
- 3D PRINT BEIGE
- MICROFIBER SYNTHETIC AR-126/CREAM (+HOLE 0.5mm)
- SHOELACE FLAT POLYESTER 8mm(SAME AS 25SS GLOVE SHOELACE) BASE BEIGE POINT 3M REFLECTIVE
- LINING PAIHONG VIETNAM PHWS 370/BEIGE
- MICROFIBER SYNTHETIC ROSIA MICROFIBER NUBUCK/CREAM +HF DEBOSS
- MICROFIBER SYNTHETIC+CUTTING HF WELDING UMT/CREAM +HOLE 1mm
- MICROFIBER SYNTHETIC+HF DEBOSS UMT/CREAM THICKNESS 1.2mm LINE1(HF DEBOSS) L.CREAM LINE2 BEIGE
- MIDSOLE L.CREAM
- OUTSOLE CREAM

참고 컷/스와치: 메쉬 스와치(DYT V25-411 CROCK SW)

</details>

<details><summary><code>3ARNP025N</code> 페이스트리 러너 빈티지 — 25FW 2nd · 에스아이무역 · 김종훈 · 2024.10.31</summary>

- WEBBING 20mm KISUNG FNKS-114/CHARCOAL GREY
- MICROFIBER SYNTHETIC ROSIA MICROFIBER NUBUCK/W3 +HF DEBOSS+PRINT GREY
- MESH.B +TEXTURE HF DEBOSS W3
- MESH.C W3
- WEBBING 10mm/W3
- 3D PRINT W3
- MESH.A(BONDED W/ SYNTHETIC) W3 +HF DEBOSS
- SHOELACE FLAT POLYESTER 8mm(SAME AS 25SS GLOVE SHOELACE) BASE W3 POINT 3M REFLECTIVE
- LINING PAIHONG VIETNAM PHWS 370/CHARCOAL GREY
- MICROFIBER SYNTHETIC ROSIA MICROFIBER NUBUCK/SILVER +HF DEBOSS
- MESH.A(BONDED W/ SYNTHETIC)+HF DEBOSS W3 +HOLE 1mm
- CUTTING HF WELDING W3
- MICROFIBER SYNTHETIC UMT/W3 THICKNESS 1.2mm +HF DEBOSS COL.1 CHARCOAL GREY COL.2 SILVER
- MESH.B +HOLE 0.5mm
- MIDSOLE W3
- OUTSOLE W3

</details>

<details><summary><code>3ARNP035N</code> 페이스트리 러너 NB — 25FW 2nd · 에스아이무역 · 김종훈 · 2024.10.31</summary>

- WEBBING 20mm KISUNG FNKS-114/NAVY, /D.NAVY
- MICROFIBER SYNTHETIC ROSIA MICROFIBER NUBUCK/NAVY, /L.BLUE, /D.NAVY (+HF DEBOSS+PRINT MINT, +TEXTURE HF DEBOSS PRINT MINT)
- MESH NAVY(DAEYOUNG DYT V25-411 CROCK SW P-EPM5)
- WEBBING 10mm/NAVY
- 3D PRINT MINT
- MICROFIBER SYNTHETIC AR-126/L.BLUE, /D.NAVY (+HOLE 0.5mm)
- SHOELACE FLAT POLYESTER 8mm BASE NAVY POINT 3M REFLECTIVE
- LINING PAIHONG VIETNAM PHWS 370/D.NAVY
- MICROFIBER SYNTHETIC+CUTTING HF WELDING UMT/L.BLUE +HOLE 1mm
- MICROFIBER SYNTHETIC+HF DEBOSS UMT/L.BLUE THICKNESS 1.2mm LINE1 NAVY LINE2 SILVER
- MIDSOLE NAVY
- OUTSOLE D.GREY

참고 컷/스와치: 메쉬 스와치(DYT V25-411 CROCK SW)

</details>

<details><summary><code>3ASDPA163</code> 페이스트리 러너 마스크 — 26SS 1st · SI · 김종훈 · 2025.06.10</summary>

- MICROFIBER SYNTHETIC ROSIA ZHENGE NEW MATERIAL [NEW DELHI MICROFIBER] YXL2038-2/W3 (+HF DEBOSS, +PRINT GREY)
- MICROFIBER SYNTHETIC FNL/W3
- SHOELACE FLAT POLYESTER 8mm BASE W3 POINT 3M REFLECTIVE(26SS PASTRY 동일)
- WEBBING BASIC TWILL 8mm/W3
- WEBBING FNKS-123/20mm W3 POINT GREY
- EYELET SE-34 MATTE/W3
- MESH [ROSIA NATURAL ECO] N-C1056/W3
- LINING MERRY MESH/W3
- MIDSOLE CREAM
- OUTSOLE W3
- 3D PRINTING D.GREY(lateral only)
- PU OPEN-CELL SOCKLINER MERRY MESH/W3 PRINT BLACK,WHITE

참고 컷/스와치: 아일렛/웨빙/메쉬 스와치;자재 스펙표

</details>

<details><summary><code>3ASDPA363</code> 페이스트리 러너 마스크 메탈 — 26SS 1st · SI · 김종훈 · 2025.06.10</summary>

- MICROFIBER SYNTHETIC UM PEARL/SILVER (+HF DEBOSS, +PRINT W2)
- MICROFIBER SYNTHETIC ENAMEL/SILVER
- MICROFIBER SYNTHETIC AR126+ENAMEL COATING/SILVER
- SHOELACE KISUNG COTTON/FLAT 5mm SILVER METAL
- WEBBING BASIC TWILL 8mm/L.GREY
- WEBBING FNKS-123/20mm L.GREY POINT W2
- EYELET SE-34 MATTE/W2
- MESH L.GREY+SILVER
- LINING(샘플 참조)
- MIDSOLE VACUUM TRANSFER SILVER
- OUTSOLE D.GREY
- 3D PRINTING W2
- PU OPEN-CELL SOCKLINER MERRY MESH/L.GREY

참고 컷/스와치: Reference Sample 실물컷;미드솔 실물컷;자재 스펙표

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2404` 은 다른 형태 2개와 공유 — `MLBL-2404_NEW-M25NSHCC1`, `MLBL-2404_MLBM-2616`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ARNP015N`: 페이스트리 청키(SD, 07BGS) 25FW — KG 상품명 "페이스트리 러너 SD". 라스트 MLBL-2404 / 아웃솔 MLBM-2521 = 페이스트리 러너 마스크(3ASDPA163/363)와 완전 동일 → 다른 style_code 지만 형태 병합. *REMOVE HF EMBOSS PRINTING* / *MAKE SURE TO GIVE THE SPACE SO THAT THE PATTERN DOES NOT OVERLAP*. 3ARNP025N·035N 과 동일 도면
- `3ARNP025N`: 페이스트리 청키 빈티지(50WHS) 25FW. *APPLY DIRTY VINTAGE TREATMENT TO BOTH UPPER & SOLE*. 3ARNP015N 과 동일 도면·라스트·아웃솔. MESH A/B/C 는 BONDED W/ SYNTHETIC
- `3ARNP035N`: 페이스트리 청키 NB(50BLL, 네이비/라이트블루/민트) 25FW. 3ARNP015N 과 동일 도면·라스트·아웃솔
- `3ASDPA163`: 페이스트리 러너 마스크. 라스트 MLBL-2404 는 브리즈 러너(MLBL-2404W) 계열 — 페이스트리 러너(M25NRNP01) 라스트와 대조 필요. 3D PRINTING lateral side only. 3ASDPA363 과 동일 도면
- `3ASDPA363`: 페이스트리 러너 마스크 메탈. 3ASDPA163 과 동일 도면·동일 라스트, 메탈(실버) 소재 버전

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNP015N` | 16-0920TPG BEIGE(BGS); W4 CREAM(CRS); 11-0202TPG L.CREAM(CRL) | 07BGL, 50OWS |
| `3ARNP025N` | 15-4703TPG GREY(GRS); PANTONE 10103C SILVER(SIS); 18-0201TPG CHARCOAL GREY(CGS); W3 WHITE(WHS) | 50WHS |
| `3ARNP035N` | PANTONE 10101 C SILVER(SIS); 14-4210TPG L.BLUE(BLL); 19-3918TPG D.NAVY(NYD); 19-3929TPG NAVY(NYS); 12-5410TPG MINT(MTS) | 50BKS |
| `3ASDPA163` | D.GREY(GRD) 19-3906TPG; GREY(GRS) 16-4402TPG; CREAM(CRS) W4; WHITE(WHS) W3 | 50CRL |
| `3ASDPA363` | D.GREY(GRD) 18-4105TPG; L.GREY(GRL) 14-4102TPG; WHITE(WHS) W2; SILVER(SIS) PANTONE SILVER C | 50SIS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNP015N`, `3ARNP035N`, `3ASDPA163`, `3ASDPA363` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNP015N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNP015N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNP035N50BKS/thnail/0FA4634C10E74AB1A7FB6BA2D33F603F.png/dims/resize/200x200
- `3ARNP025N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNP025N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNP035N50BKS/thnail/0FA4634C10E74AB1A7FB6BA2D33F603F.png/dims/resize/200x200
- `3ARNP035N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNP035N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ARNP035N50BKS/thnail/0FA4634C10E74AB1A7FB6BA2D33F603F.png/dims/resize/200x200
- `3ASDPA163` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASDPA163.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26S3ASDPA16350CRL/thnail/BAFEFBF4BDA6488C946DCF7CC3374F10.png/dims/resize/200x200
- `3ASDPA363` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASDPA363.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26S3ASDPA36350SIS/thnail/44E5100213414595B4407C49F65C7E55.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
