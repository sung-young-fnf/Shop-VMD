# 이미지 → Three.js 개발 도구

2026-09-10에 공식 README의 설치 방식을 따라 설치했습니다.

- [img2threejs](https://github.com/img2threejs/img2threejs): Codex 스킬 `~/.codex/skills/img2threejs`에 설치 (SKILL.md 버전 2.0.0). 다음 대화 턴부터 스킬로 사용할 수 있습니다.
- [img2](https://github.com/img2threejs/img2): 버전 0.2.3, 커밋 `7aa41b37ee24dde844390bb05eca76b709e91599`. 프로젝트 체크아웃은 `tooling/img2`, 공식 설치의 관리 데이터와 별도 체크아웃은 `~/.img2`에 있습니다. 런처는 `/opt/homebrew/bin/img2`입니다.
- Python 3.12.14를 Homebrew로 설치했습니다. 기본 시스템 Python 3.9 대신 개발용 래퍼가 3.10 이상을 선택합니다.
- 공식 img2 설치 과정에서 Claude 설정에 `~/.img2` 접근 경로가 추가되었습니다.

`mlb_shop_dev`에서 실행:

```sh
pnpm run img2 --version --json
pnpm run img2 doctor --json
pnpm run img2 list
pnpm run img2 sync --check
pnpm run img2threejs stage1_intake/probe_image.py reference/shoes/M25N3ASXE015N.png
pnpm run img2threejs next.py --state .img2threejs/state.json
```

`pnpm run img2threejs <forge 내 스크립트 경로> <인자...>`는 개발 폴더를 작업 디렉터리로 사용합니다. 다른 환경에서는 `IMG2_PYTHON`, `IMG2THREEJS_SKILL_ROOT`로 실행기와 스킬 위치를 지정할 수 있습니다.

새 모델 작업은 `img2threejs로 이 상품 사진을 Three.js 모델로 만들어줘`처럼 이미지 경로와 함께 요청합니다. 기존 작업 상태를 이어갈 때는 먼저 `next.py` 결과를 확인합니다. 모델·크롭·검증 결과는 개발 폴더에 기록합니다.

img2는 플러그인 관리 도구이며 추가 도메인 플러그인은 아직 설치하지 않았습니다. 이번 설치는 모델 생성이나 매장 상품 교체를 수행하지 않습니다. 앱 런타임 의존성 추가는 필요하지 않습니다.

검증: `img2 doctor` 오류/경고 0, `sync --check` 통과, 상품 PNG 입력 분석 통과, `pnpm run check` 통과. 운영본 해시 검사는 `evidence/isolation/baseline.json`이 없어 실행하지 못했습니다.

## 재설치

`tooling/img2`는 외부 저장소의 체크아웃(자체 `.git` 포함)이라 이 레포에는 커밋하지 않는다. 새 환경에서는 같은 커밋으로 다시 받는다.

```sh
git clone --depth 1 https://github.com/img2threejs/img2.git mlb_shop_dev/tooling/img2
git -C mlb_shop_dev/tooling/img2 fetch --depth 1 origin 7aa41b37ee24dde844390bb05eca76b709e91599
git -C mlb_shop_dev/tooling/img2 checkout 7aa41b37ee24dde844390bb05eca76b709e91599
```
