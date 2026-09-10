# 페퍼 슬라이드 — NEW / NEW

> MLB 신발 CAD 도면 판독 기반 3D 제작용 형태(틀) 문서. 같은 라스트·아웃솔을 쓰는 스타일을 한 형태로 묶고, 색·소재만 다른 파생은 컬러웨이 표로 처리한다.
> 도면에 적힌 값만 기재했다. 없는 값은 "미확보"다. 추정은 **(추정)** 으로 표시.

## 형태 식별
| 항목 | 값 |
|---|---|
| 형태 ID | `_NEW_미채번/M26SLPPE1_페퍼슬라이드` |
| 라스트 (LAST NO.) | `NEW` |
| 아웃솔 (OUTSOLE NO.) | `NEW` |
| style_code | `M26SLPPE1` (1개) |
| TYPE1 (라스트 카테고리) | SUMMER SHOES |
| 기준 사이즈 | 240mm (도면 SIZE 칸) |
| 사이즈 전개 | 230-250 (KG SIZE_RANGE 합집합) |
| 도면 유형 | B_실루엣 |
| 확보 뷰 | 측면 · 풋베드 로고 |
| 고해상도 원본 | 없음 (PO_IMG 725~749×512 만) |
| 스타일 수 / 컬러웨이 수 | 1 / 3 |
| 성수점 재고 합 (2026-09-06) | 30 |

## 이 형태를 쓰는 스타일 · 컬러웨이
| PART_CD | 상품명 (KG) | 도면 NAME/시즌/차수 | 시즌 | 컬러 수 | 컬러 코드 (KG) | 도면 헤더 컬러 | 라스트 표기 원문 | 아웃솔 표기 원문 |
|---|---|---|---|---:|---|---|---|---|
| `3ALPPE163` | 페퍼 슬라이드 | 25SS / 1ST | 26S | 3 | 50BKS, 50CRS, 50PKM | 50CRS | NEW | NEW |

> **색만 다른 파생은 이 표로 처리한다.** 형상 재작업 없이 머티리얼만 교체. 도면 1장은 헤더 컬러 1개 기준으로 그려져 있고, 나머지 컬러는 KG 컬러 코드로만 확인된다.

### 귀속 사유 (도면 표기와 형태 ID 가 다른 스타일)
- `3ALPPE163` — 라스트/아웃솔 NEW(미채번). 3D 참고용 실물 샘플 2컷 첨부

## 3D 형상 정보

### 확보된 치수 (도면 콜아웃)
| PART_CD | 치수 콜아웃 | 뷰 |
|---|---|---|
| `3ALPPE163` | RAISED2.0;RAISED1.0;1.0mm;48mm | 측면;풋베드 로고 |

치수는 240mm 기준 스팟 치수(로고 높이·웨빙 폭·펀칭 지름·두께 등)다. **부위 전체 치수·사이즈별 그레이딩 표는 어느 소스에도 없다.**

### 파트 구성 · 자재 (도면 콜아웃 기준 — BOM 데이터 없음, 여기가 원천)
<details><summary><code>3ALPPE163</code> 페퍼 슬라이드 — 25SS 1ST · FULLXIN · PARK.SEJEONG · 2025.04.22</summary>

- EVA/IMEVA 사출 단일(추정)
- LOGO RAISED 2.0mm HEIGHT 48mm
- TEXTURE SPLIT LINE
- MLB RAISED 1.0mm
- 1.0mm 라인

참고 컷/스와치: 프로파일 참고용 샘플 실물컷;전체적인 실루엣 참고용 샘플 실물컷;크림 컬러 레퍼런스(Crocs 부츠)

</details>

### 모델링 노트
- 저면/아웃솔/풋베드 뷰 확보 → 트레드·풋베드 로고 참조 가능.
- 정면 뷰 없음 → **토박스 폭·힐컵 폭은 추정 구간**. 라스트 카테고리(TYPE1) 로 볼륨 계열을 잡고 제품컷으로 보정.
- 내측 뷰 없음 → 내측은 외측 미러 + 도면 주석("Please applied the main logo to the medial as well" 등) 로 처리.
- **Type B 기하 도면** — R값·두께·러그 치수가 있다. 이 수치를 우선하고 실루엣은 도면 라인 트레이스.
- `3ALPPE163`: 페퍼 슬라이드(50CRS) 25SS 1ST. 라스트/아웃솔 NEW(미채번). 3D 참고용 실물 샘플 2컷 첨부. 풋베드 로고 SAME AS EVA SLIDE. 컬러 CREAM REFER TO SAMPLE

## 컬러웨이 적용 규칙
| PART_CD | 도면 컬러칩 (팬톤/코드) | KG 컬러 코드 (전개) |
|---|---|---|
| `3ALPPE163` | CREAM(REFER TO SAMPLE) | 50BKS, 50CRS, 50PKM |

- 도면 컬러칩은 **도면에 그려진 1개 컬러웨이**의 것이다. 다른 컬러 코드는 `get_kr_products_color_images`(자사몰 컷) 로 확인해 머티리얼만 교체.
- `W2`/`W3`/`W4` 는 F&F 사내 화이트 계열 코드(화이트→크림 방향). `REFER TO SAMPLE` 은 실물 샘플 기준이라 도면에 값이 없다.

## 미확보 / 주의
- 사이즈별 실측 그레이딩 표: **없음** (전 소스 공통). 기준 240mm 스팟 치수만 있음.
- BOM 데이터: **없음** (신발 전체 `get_kr_product_boms` 자재행 0). 자재는 위 도면 콜아웃이 유일한 원천.
- 일부 스타일의 라스트/아웃솔이 도면상 **미채번(NEW)·벤더번호·미기재** — 위 "귀속 사유" 참조.
- 도면에 외부/실물 참고 컷이 붙어 있는 스타일: `3ALPPE163` — 디자인 의도 파악용이며 치수 근거는 아니다.
- 도면에는 자재 품번·협력사·담당자 실명·원가 관련 정보가 있다. **외부 공유·커밋 전 취급 확인 필수.**

## 출처
- `3ALPPE163` 도면: https://s3.ap-northeast-2.amazonaws.com/static-plm.fnf.co.kr/style/3ALPPE163.jpg · 제품컷: https://static-resource-mall.fnf.co.kr/mlb-korea/images/goods/ec/M26S3ALPPE16350CRS/thnail/9D1DE02E344D44D1AF3CC430CC4B351C.png/dims/resize/200x200
- 데이터: dcs-ai KG `get_shop_product_stock`(fnf-legacy-api, SHOP_ID=540, end_dt=2026-09-06), `get_kr_products_plans`(fnf-daisy-api)
- 판독 마스터: `../../cad_index.csv` · 그룹핑: `../../form_groups.csv`, `../../form_index.csv` · 생성 스크립트: `../../build_by_form.py`
