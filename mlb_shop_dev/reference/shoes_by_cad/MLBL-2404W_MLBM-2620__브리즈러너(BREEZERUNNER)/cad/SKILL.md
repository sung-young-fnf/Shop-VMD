# 브리즈 러너 (BREEZE RUNNER) — MLBL-2404W / MLBM-2620

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2404W_MLBM-2620` |
| 라스트 (LAST NO.) | `MLBL-2404W` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2620` |
| style_code | `M26NRNWR1` (1개) |
| TYPE1 (라스트 카테고리) | RUNNER |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-290 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서+비례치수 |
| 확보 뷰 | 측면 · 아웃솔 몰드 렌더(저면) · 텅 몰딩 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 1 / 5 |
| 성수점 재고 합 (2026-09-06) | 88 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ARNWR16N` | 브리즈 러너 | 26FW / 2ND | 26F | 5 | 07BLL, 43BRS, 50BGS, 50BKS, 50CRS |  | MLBL-2404W | MLBM-2620 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ARNWR16N` | 24mm;5mm;7mm;12mm;90mm;60mm;70mm;2mm;42mm | 측면;아웃솔 몰드 렌더(저면);텅 몰딩;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ARNWR16N</code> 브리즈 러너 — 26FW 2ND · HUALI(STATEWAY) · JAEGON YOO · 2025.10.29</summary>

- TONGUE BASE SKIN SUEDE/CREAM TOP SAME AS LINING/L.CREAM MESH [ROSIA/FUJIAN]JSH085/L.CREAM, TONGUE MOLDING NORMAL TYPE 3, LOGO 3D PRINTING 3M SILVER 24mm
- SHOE LACE [ROSIA/JIN YUAN]JY171 7mm/CREAM
- WEBBING [KISUNG]WOVEN TAPE JSH085/L.CREAM
- HOT MELT FILM+3D PRINTING LOGO TRANSPARENT/L.CREAM LOGO 3M SILVER
- HOT MELT FILM+2D PRINTING TRANSPARENT/L.CREAM 2D PRINTING CREAM(SAME AS 26FW CURVE RUNNER NS)
- LINING SAME AS ATHFLOW V2/L.CREAM
- SUB-SHOE LACE [NATURAL ECHO]NEL27Q3W1002/CREAM
- WEBBING SAME AS WINNER CHUNKY WIDTH 12mm 3D PRINTING LOGO 3M SILVER
- ENGINEERED MESH [HUAFENG]HF SD 17700 P-CDP EM EPM5 L.CREAM+CREAM
- 2 TONE CUTTING H/F LOGO OUTLINE(2mm) 14-4102 BASE 11-0602 HEIGHT 42mm
- HEAT TRANSFER CHARCOAL
- MIDSOLE S-CMEVA 014 39C HR 5CM/CREAM
- OUTSOLE SPU/CREAM
- EVA CUP INSOLE [ROSIA]RUNNING INSOLE OPTION F HEAVY MERY MESH/CREAM SUBLIMATION W3+BLACK

참고 컷/스와치: 아웃솔 몰드 3D 렌더(레드);텅 몰딩 실물컷;슈레이스/웨빙 스와치;샘플 제품컷

</details>

### 모델링 노트
- 저면/아웃솔/풋베드 뷰 확보 → 트레드·풋베드 로고 참조 가능.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 부위 폭·높이 콜아웃(파란선)이 다수 있는 사양서 — 패널 비례를 이 값에 맞출 것.
- `3ARNWR16N`: 브리즈 러너(BREEZE RUNNER, 50CRS) 26FW 2ND. 라스트 MLBL-2404W(페이스트리 2404 의 W 변형) / 아웃솔 MLBM-2620 신규(SPU). 비례치수 60/70/90mm. 아웃솔 몰드 렌더로 트레드 참조 가능. 2 TONE CUTTING H/F LOGO SAME ON BOTH SIDES 42mm. WEBBING SAME AS WINNER CHUNKY

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ARNWR16N` | SILVER C; CHARCOAL 19-3910 TPG; L.CREAM 11-4202 TPG; CREAM 11-4300 TPG | 07BLL, 43BRS, 50BGS, 50BKS, 50CRS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ARNWR16N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ARNWR16N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ARNWR16N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26N3ARNWR16N50BKS/thnail/3C46992A6B3C4E728B6E06F39EDA0BB6.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
