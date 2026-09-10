# 범프 청키 (BUMP CHUNKY) — MLBL-2522 / MLBM-2522

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2522_MLBM-2522` |
| 라스트 (LAST NO.) | `MLBL-2522` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2522` |
| style_code | `M25NSHB02`, `M26NSHBCK` (2개) |
| TYPE1 (라스트 카테고리) | OUTDOOR |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 6 |
| 성수점 재고 합 (2026-09-06) | 31 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASHB025N` | 범프 청키 | 25FW / 2nd | 25F | 4 | 07PKL, 07WHS, 50BKS, 50MTS |  | MLBL-2522 | MLBM-2522 |
| `3ASHBCK6N` | 범프 청키 GTX | 26SS / 1st | 26S | 2 | 50BKS, 50CGL |  | MLBL-2522 | MLBM-2522 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASHB025N` | 2mm;8mm;10mm;15mm;0.3T;0.8T | 측면;인솔 |
| `3ASHBCK6N` | 2mm;8mm;10mm;15mm;0.3T;0.8T | 측면;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASHB025N</code> 범프 청키 — 25FW 2nd · 삼덕 · 김종훈 · 2024.10.31</summary>

- MESH DAEYOUNG DYI 22-567 1200 RIP WOVEN P-EPM5(*SAME AS 1st SAMPLE*)
- CORD 2mm Base WHITE 2nd GREY
- CORD LOCK(25SS GROUND CHUNKY 동일)/WHITE
- ELASTIC BAND 8mm/WHITE
- CORD END(25SS GROUND CHUNKY 동일)/WHITE
- WEBBING 10mm Base WHITE 2nd 3M REFLECTIVE
- WEBBING FNKS-126/15mm Base WHITE 2nd GREY
- EYELET DAESUNG SE-20/WHITE
- POLYESTER FABRIC(25SS WILDBALL GLOVE 동일)/WHITE
- LINING DAEYOUNG DYI KILI MESH P EPM 5/GREY
- MICROFIBER SYNTHETIC AR-172/WHITE
- TURN AND STITCH
- NO-SEW HOT MELT FILM 0.3T, 0.8T/WHITE
- NO-SEW REINFORCEMENT
- CUTTING HF WELDING Logo GREY Outline WHITE RP:AD-707R
- MIDSOLE WHITE
- OUTSOLE WHITE
- PRINTING GREY
- OPEN-CELL PU INSOLE DYI KILI MESH P EPM 5/GREY LOGO WHITE

참고 컷/스와치: 메쉬 스와치(DYT22-567 1200 RIP WOVEN);코드 실물컷;TURN AND STITCH 구조 실물컷

</details>

<details><summary><code>3ASHBCK6N</code> 범프 청키 GTX — 26SS 1st · 삼덕통상 · JONGHOON KIM · 2025.01.13</summary>

- CORD 2mm Base D.GREY 2nd 3M REFLECTIVE
- CORD LOCK(25FW BUMP CHUNKY 동일)/D.GREY
- ELASTIC BAND 8mm/D.GREY
- CORD END(25FW BUMP CHUNKY 동일)/D.GREY
- WEBBING 10mm Base D.GREY 2nd 3M REFLECTIVE
- WEBBING FNKS-126/15mm Base L.CHARCOAL GREY 2nd D.GREY
- EYELET DAESUNG SE-20 MATTE/L.CHARCOAL GREY
- POLYESTER FABRIC(25SS WILDBALL GLOVE 동일)/L.CHARCOAL GREY
- LINING MERRY MESH/D.GREY, /L.CHARCOAL GREY
- MICROFIBER SYNTHETIC AR-270DM/L.CHARCOAL GREY
- HF DEBOSS+PRINT GLOSSY/L.CHARCOAL GREY
- NO-SEW HOT MELT FILM 0.3T, 0.8T TRANSPARENT/L.CHARCOAL GREY
- NO-SEW REINFORCEMENT
- MONOMESH/L.CHARCOAL GREY
- GORE-TEX WOVEN LABEL
- CUTTING HF WELDING Logo D.GREY Outline WHITE
- TURN AND STITCH
- PRINT D.GREY
- MIDSOLE D.GREY
- RUBBER D.GREY
- OPEN-CELL PU INSOLE MERRY MESH/L.CHARCOAL GREY LOGO D.GREY

참고 컷/스와치: 타사(NB) 립메쉬 참고 제품컷

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- `3ASHB025N`: 범프 청키. 3ASHBCK6N 범프 청키 GTX 와 라스트·아웃솔 동일(MLBL-2522/MLBM-2522) → 다른 style_code 지만 형태 병합. Cord Lock/Cord End 25SS Ground Chunky 동일, Polyester Fabric 25SS Wildball Glove 동일
- `3ASHBCK6N`: 범프 청키 GTX. *GORE-TEX BOOTY*. *Refer to the rip mesh & Transparent no-sew film*. 3ASHB025N 범프 청키와 동일 라스트·아웃솔·구조, 소재/컬러 변경(GORE-TEX 우븐라벨 추가)

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASHB025N` | 16-4402 TPG GREY(GRS); W3 WHITE(WHS) | 07PKL, 07WHS, 50BKS, 50MTS |
| `3ASHBCK6N` | 18-4006 TPG D.GREY(GRD); 14-4202 TPG L.CHARCOAL GREY(CGL); W3 WHITE(WHS) | 50BKS, 50CGL |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASHB025N`, `3ASHBCK6N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASHB025N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHB025N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHB025N50MTS/thnail/005EDD6281944B84B5716913D559D397.png/dims/resize/200x200
- `3ASHBCK6N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHBCK6N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ASHBCK6N50BKS/thnail/3F68A3B6043B4322A48D0313C3747B34.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
