# 바운서 레인부츠 (BOUNCER RAINBOOTS) — MLBL-2420 / MLBM-2420

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `MLBL-2420_MLBM-2420` |
| 라스트 (LAST NO.) | `MLBL-2420` |
| 아웃솔 (OUTSOLE NO.) | `MLBM-2420` |
| style_code | `M25SSQR02`, `M24SSQRNB` (2개) |
| TYPE1 (라스트 카테고리) | SUMMER SHOES |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-260 (KG SIZE_RANGE 합집합) |
| 도면 유형 | A_사양서 |
| 확보 뷰 | 측면 · 풋베드디자인(저면) |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 2 / 3 |
| 성수점 재고 합 (2026-09-06) | 44 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ASQR0253` | 바운서 레인부츠 숏 | 25SS / 1st | 25S | 2 | 50BKS, 50CRS |  | MLBL-2420 | MLBM-2420 |
| `3ASQRNB53` | 바운서 레인부츠 | 24SS / 1차 | 25S | 1 | 50BKS |  | MLBL-2420 | MLBM-2420 |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ASQR0253` | 15mm;36mm;RAISED 2mm;RAISED 0.5;1.5mm;0.3mm | 측면;풋베드디자인(저면) |
| `3ASQRNB53` | 9mm;1.5mm;0.3mm | 측면;풋베드디자인(저면) |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ASQR0253</code> 바운서 레인부츠 숏 — 25SS 1st · - · SEJEONG PARK · 2024.08.01</summary>

- IP(사출) CREAM
- LOGO PLASTIC.CO 36mm RAISED 2mm
- MLB RAISED 0.5
- 풋베드 로고 1.5mm폭 0.3mm 음각

참고 컷/스와치: HUNTER/CROCS 참고 제품컷;로고 실물컷(UMBRO 참고);풋베드 실물컷

</details>

<details><summary><code>3ASQRNB53</code> 바운서 레인부츠 — 24SS 1차 · Raising · 임보라 · 2023.08.18</summary>

- IP(사출) BLACK
- 로고(리퀴드러버) BLACK
- 풋베드 로고 1.5mm폭 0.3mm 음각

참고 컷/스와치: 풋베드 실물컷

</details>

### 모델링 노트
- 저면/아웃솔/풋베드 뷰 확보 → 트레드·풋베드 로고 참조 가능.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- `3ASQR0253`: 숏 레인부츠. 3ASQRNB53 바운서 레인부츠와 라스트·아웃솔 동일(MLBL-2420/MLBM-2420) → 다른 style_code 지만 형태 병합. OUTSOLE/TEXTURE SAME AS 24SS BOUNCER RAINBOOTS. UPPER HEIGHT SAME AS HUNTER SAMPLE. 컬러는 CROCS 샘플 크림
- `3ASQRNB53`: 24SS 바운서 레인부츠. 구형 헤더(NAME/SAMPLE NO 칸 없음). 컬러 50BKS. 3ASQR0253 숏 레인부츠와 라스트·아웃솔 동일

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ASQR0253` | CREAM(SAME COLOR AS CROCS SAMPLE) | 50BKS, 50CRS |
| `3ASQRNB53` | W3; BLACK | 50BKS |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ASQR0253`, `3ASQRNB53` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ASQR0253` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASQR0253.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25S3ASQR025350BKS/thnail/8305EE148C544F95A11CA6DA071A3AA8.png/dims/resize/200x200
- `3ASQRNB53` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ASQRNB53.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M25S3ASQRNB5350BKS/thnail/7E18A86BB96547799FB86FBA8898DE2D.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
