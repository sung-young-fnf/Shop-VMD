# 챔프 청키 (CHAMP) — MLBL-2404 / NEW-M25NSHCC1

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2404_NEW-M25NSHCC1` |
| 라스트 (LAST NO.) | `MLBL-2404` |
| 아웃솔 (OUTSOLE NO.) | `NEW` |
| style_code | `M25NSHCC1` (1개) |
| TYPE1 (라스트 카테고리) | CHUNKY |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-300 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 인솔 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 2 |
| 성수점 재고 합 (2026-09-06) | 15 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASHCC15N` | 챔프 청키 SD | 25FW / 2nd | 25F | 1 | 50BRS |  | MLBM-2404(헤더 표기 그대로; MLBL-2404 오기 추정) | NEW |
| `3ASHCC25N` | 챔프 청키 빈티지 | 25FW / 2nd | 25F | 1 | 07SIS |  | MLBM-2404(헤더 표기 그대로; MLBL-2404 오기 추정) | NEW |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

### 귀속 사유 (도면 표기와 형태 ID 가 다른 스타일)
- `3ASHCC15N` — 아웃솔 미채번 → 라스트 + style_code 로 구분
- `3ASHCC25N` — 아웃솔 미채번 → 라스트 + style_code 로 구분

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASHCC15N` | 5mm;10mm;15mm;1mm;2mm;3mm | 측면;인솔 |
| `3ASHCC25N` | 5mm;10mm;15mm;1mm;2mm;3mm | 측면;인솔 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASHCC15N</code> 챔프 청키 SD — 25FW 2nd · SI무역 · JAYEON KIM · 2024.11.01</summary>

- SHOE LACE DUCKIL DI-23150/5mm
- WEBBING KISUNG FNKS 114/10mm, 114/15mm
- TPR Height 1mm
- HF DEBOSS(glossy printing)
- HF WELDING Height 2mm
- EPOXY/PRINTING Height 3mm
- A.SOPIA SUEDE Bage(TAESUNG B2)
- B.UMT Pear Sorbet
- C.MESH S.W MESH
- LINING Heavy m.mesh
- 2D PRINTING
- EMBOSS
- CMEVA
- RUBBER
- PUNCHED EVA OPENCELL INSOLE

참고 컷/스와치: 실물 제품컷(NY)

</details>

<details><summary><code>3ASHCC25N</code> 챔프 청키 빈티지 — 25FW 2nd · SI무역 · JAYEON KIM · 2024.11.01</summary>

- SHOE LACE DUCKIL DI-23150/5mm Base IVORY Dot GREY
- Eyelet flatted matt/White
- WEBBING KISUNG FNKS 114/10mm, 114/15mm/Glacier Gray
- TPR Height 1mm
- HF DEBOSS White
- Cutted HF WELDING Spellbound
- A.MICRO FIEBER
- B.MESH Glacier Gray
- LINING Heavy m.mesh
- 2D PRINTING Semi-Gloss/Glacier Gray
- CMEVA High-rise
- RUBBER Cannoli Cream
- EPOXY/PRINTING Height 3mm
- PUNCHED EVA OPENCELL INSOLE Base Glacier Gray

참고 컷/스와치: 실물 제품컷(LA)

</details>

### 모델링 노트
- 저면(트레드) 뷰 없음 → **아웃솔 트레드 패턴은 추정 구간**. 제품컷(`PRDT_IMG_URL`)·자사몰 컷으로 보정할 것.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- 라스트 `MLBL-2404` 은 다른 형태 2개와 공유 — `MLBL-2404_MLBM-2521`, `MLBL-2404_MLBM-2616`. **갑피 볼륨(라스트 메쉬)은 재사용하고 솔만 교체**하면 된다.
- `3ASHCC15N`: 챔프 청키 SD. *Please applied the main logo to the medial as well*. HF DEBOSS glossy printing(Like CHUNKY WINNER). 3ASHCC25N 과 동일 도면. LAST NO. 칸이 MLBM- 접두로 적혀 있음(페이스트리 러너 마스크 MLBL-2404 와 동일 번호)
- `3ASHCC25N`: 챔프 청키 빈티지(LA). 3ASHCC15N 과 동일 도면·동일 라스트. DIRTY EFFECT Upper and Sole. A.MICRO FIEBER 소재로 교체

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASHCC15N` | Mulch 19-0910 TPG; Solitary Star 11-0108 TPG; Pear Sorbet 11-0615 TPG; Shifting Sand 14-1210 TPG; Bage TAESUNG B2 | 50BRS |
| `3ASHCC25N` | White W3; Glacier Gray 14-4102 TPG; High-rise 15-4101 TPG; Silver PANTONE 10388 C; Cannoli Cream 11-4302 TPG | 07SIS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 일부 스타일의 라스트/아웃솔이 도면상 **미채번(NEW)·벤더번호·미기재** — 위 "귀속 사유" 참조.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASHCC15N`, `3ASHCC25N` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASHCC15N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHCC15N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHCC25N07SIS/thnail/5471F26621A04A58B382C894EED872E3.png/dims/resize/200x200
- `3ASHCC25N` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASHCC25N.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25N3ASHCC25N07SIS/thnail/5471F26621A04A58B382C894EED872E3.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
