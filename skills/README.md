# SHOP_VMD 공용 Three.js 스킬

이 폴더를 프로젝트와 함께 공유하면 됩니다. 기본 진입점은 [shop-vmd-threejs/SKILL.md](shop-vmd-threejs/SKILL.md)입니다. 개인 계정의 절대 경로, 실행 중인 로컬 서버, 기존 QA 통과 결과에 의존하지 않습니다.

| 스킬 | 용도 | 상태 |
|---|---|---|
| [cap-photo-realism](cap-photo-realism/SKILL.md) | 모자 전용 곡면 틀 + 실제 상품 사진 재질, 중복 디테일 방지, 단품/매장 분리 검증 | 네이비 NY 단품 검증에서 통합; 매장 안정성은 별도 게이트 |
| [shop-drawing-analysis](shop-drawing-analysis/SKILL.md) | 매장 PDF 전수 분석, 공간·집기 사양, 구역별 확대 캡처와 제작 위임 | MLB 성수점 106페이지 도면 분석에서 정리한 공용 지침 |
| [shop-vmd-threejs](shop-vmd-threejs/SKILL.md) | 매장 도면·사진 분석, 공간·집기 재구성, 탐색 UI, VMD 검증 | 이번 주택 구현의 교훈을 매장용으로 확장한 공용 지침 |
| [threejs-house-experience](threejs-house-experience/SKILL.md) | 도면 기반 공간 재구성, 카메라·절개·재질·성능 검토 | 이번에 작성·고도화한 주택용 스킬 보존본 |
| [img2-house](img2-house/SKILL.md) | 공식 img2 하네스의 사양·브라우저 증거 검증 | 실제 실행 코드·manifest·7개 테스트 포함, 주택 전용 |

## 사용 예

```text
skills/shop-vmd-threejs/SKILL.md를 읽고 진행해.
매장 도면과 사진은 references/store-a에 있어.
도면 기준으로 공간과 집기를 만들고, 존·집기 선택과 평면 보기를 구현해.
관찰한 정보와 추정한 정보를 구분하고 실제 브라우저에서 검증해.
```

문서 경로를 명시하면 다른 코딩 에이전트에서도 사용할 수 있습니다. `skills/` 폴더에 파일이 있다는 것만으로 에이전트의 자동 검색이나 img2 플러그인 등록까지 완료되는 것은 아닙니다. 자동 검색은 사용하는 에이전트의 스킬 등록 방식으로 설정합니다.

## 포함 범위와 출처

- `threejs-house-experience`와 `img2-house`는 이번 작업에서 직접 만든 스킬입니다. 기존 개인 설치본은 변경하지 않고 프로젝트에 복사했습니다.
- `shop-vmd-threejs`는 그 지침을 매장으로 일반화합니다. 집기·상품·동선 검증 항목은 앞으로 매장 작업에 적용할 기준이며, 주택 데모에서 이미 검증됐다는 뜻은 아닙니다.
- 공식 `img2threejs`와 `img2` 하네스, OMO frontend/debugging/visual-qa 등은 외부 도구입니다. 이번에 새로 만든 스킬이 아니므로 원본 전체를 다시 배포하지 않습니다.
- `_img2_local.py`, 설치 레지스트리, 개인 설정, `node_modules`, 과거 통과 상태는 공유본에서 제외했습니다.
- 주택 데모와 실제 증거는 [test_house](../test_house/README.md), [검토 기록](../test_house/evidence/qa/REVIEW.md)에 있습니다. 스킬만 별도로 복사해도 이 데모는 실행 필수 의존성이 아닙니다.

## 검증 플러그인 사용

공식 하네스 설치와 프로젝트 경로 기반 실행은 [하네스 지침](shop-vmd-threejs/references/harness.md)을 따릅니다. `img2-house`는 `house-spec.json`과 주택용 동작 계약을 검사합니다. 매장 전용 `store` 플러그인이 구현·등록된 것으로 취급하지 마세요.

공유 플러그인 테스트는 하네스가 설치된 환경에서 다음처럼 실행합니다.

```text
uv run --no-project python -m unittest discover -s skills/img2-house/tests -v
```

매장별 좌표·집기 수·브랜드 색상·성능 예산은 스킬이 아니라 해당 프로젝트 사양에 둡니다. 다음 작업에서 개선한 공용 지침은 이 폴더에 반영하고, 검증되지 않은 내용은 제안 상태로 표시합니다.
