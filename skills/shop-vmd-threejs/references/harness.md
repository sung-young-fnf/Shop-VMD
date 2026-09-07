# img2 하네스 연결과 공유

공식 하네스는 [img2threejs/img2](https://github.com/img2threejs/img2)다. 플러그인 설치·등록·capability 조회·상태·게이트 실행을 맡으며 매장 모델을 자동 제공하는 것은 아니다. 이 저장소에 포함된 `img2-house`는 이번 작업의 로컬 주택 플러그인이다.

## 경로 규칙

`WORKSPACE`는 구현할 매장 프로젝트, `SKILL_DIR`은 현재 스킬 폴더, `PLUGIN_DIR`은 실제 플러그인 폴더, `IMG2_HOME`은 설치된 하네스 루트다. 한 사람의 사용자명이나 Python/Chrome 설치 경로를 공유 명령에 넣지 않는다. 머신별 `_img2_local.py`는 설치 도구가 생성하게 하고 배포하지 않는다.

## 설치와 검색

공식 설치 명령:

```text
npx github:img2threejs/img2 install
img2 --version --json
img2 list
img2 doctor --json
img2 sync --check
```

npm의 Git 패키지 실행이 제한된 환경에서는 제한을 임의로 해제하지 않는다. 직접 Git clone이 허용된 환경이라면 공식 저장소를 별도 폴더에 받은 뒤 그 checkout의 `node bin/img2.mjs install --from <checkout>`을 사용할 수 있다. 외부 코드를 실행하기 전 해당 버전의 설치 동작을 확인한다. Windows에서 launcher가 만들어지지 않으면 설치된 `bin/img2.mjs`를 Node로 직접 실행한다.

포함된 주택 플러그인을 새 환경에 등록하려면 checkout 루트에서 다음과 같이 절대 경로를 계산한다.

```powershell
$sharedHousePlugin = (Resolve-Path './skills/img2-house').Path
img2 add --link $sharedHousePlugin
img2 doctor --json
img2 sync --check
```

```bash
shared_house_plugin="$(pwd)/skills/img2-house"
img2 add --link "$shared_house_plugin"
img2 doctor --json
img2 sync --check
```

기존 `house` 등록이 있으면 자동으로 `--force`를 붙이지 않는다. 현재 등록된 경로와 공유본을 비교하고, 사용자가 요청한 설치·교체 범위에서만 전환한다. 이 문서를 공유하는 작업 자체는 전역 등록을 교체하라는 뜻이 아니다.

## 실제 기능에 맞는 provider 사용

```text
img2 capabilities --from-kind floor-plan-images --to-kind procedural-threejs-house --plugin house --json
```

위 edge는 **주택**이다. 매장 전용 provider를 찾으려면 설치된 목록과 해당 manifest가 선언한 실제 edge를 사용한다. provider가 없는데 새 이름을 입력한 뒤 설치돼 있다고 가정하지 않는다. capability의 `gateRunner.argv`를 인자 배열로 실행하고, agent 단계의 설명을 shell 명령으로 실행하지 않는다.

하네스가 반환한 설치 위치로 gate runner를 실행한다. 예를 들어 `IMG2_HOME`과 `PLUGIN_DIR`, `WORKSPACE`를 현재 환경에서 확인했다면:

```bash
python "$IMG2_HOME/harness/img2_core/gate_runner.py" --plugin-dir "$PLUGIN_DIR" --workspace "$WORKSPACE"
```

하네스 설치가 없거나 필요한 provider가 없으면 문서 기반 매장 작업은 진행할 수 있지만, 실행하지 않은 하네스 게이트를 통과했다고 기록하지 않는다.

## 포함된 house 플러그인의 정확한 경계

`house-spec.json`, plan/exterior 역할, `rooms`, roofCutaway/roofExplode/roomPicking/night 등의 주택 전용 계약을 검사한다. 자세한 항목은 [플러그인 증거 계약](../../img2-house/reference/evidence.md)에 있다. 집기 수량, 통로, 상품 접촉, 외관 없는 실내 매장, `store-spec.json`은 자동으로 지원하지 않는다. `forge --profile house`도 등록하지 않는다.

따라서 기존 프로그램에서 room을 zone으로 이름만 바꾸거나, 없는 지붕 기능을 true로 채워 매장 QA를 통과시키지 않는다. 기존 계약과 맞는 주택 예제는 그대로 실행하고, 매장용 자동 검증은 별도 플러그인 또는 명시적인 schema 확장 작업으로 구현한다.

## 매장용 플러그인을 실제로 개발할 때

설치한 하네스의 `docs/PLUGIN_CONTRACT.md`를 기준으로 manifest, 단계, gate, 상태 소유권을 정의한다. 개발 범위에 포함됐을 때만 구현·등록하며 이 문서만으로 설치가 이뤄진 것으로 간주하지 않는다.

- 필요한 참조 역할을 매장 모드에 맞춘다. 실내 자료만 있는 매장에 외관을 강제하지 않는다.
- zone/fixture/placement ID, 단위·보정·경계, 요구된 진열·동선 기준을 검사한다.
- 구현한 보기와 선택·초기화·모바일·실패 처리만 필수 동작 계약으로 삼는다.
- 없는 증거, 거짓 동작 결과, 오래된 소스/캡처, 추가·변경된 파일이 통과하지 않아야 한다.
- 자신의 `.img2` 상태 subtree만 하네스 API로 갱신하고, 출력은 workspace의 plugin artifact 영역에 둔다.
- 실제 gate runner를 통한 pass/fail/missing/stale 테스트와 `doctor`, `sync --check`를 실행한다.
- generic ObjectSculptSpec이나 다른 플러그인의 필수 게이트를 우회하거나 완화하지 않는다.

주택 플러그인에 들어 있는 테스트는 실행기·증거 계약 회귀 검사용이다. 합성 fixture가 시각적 재현을 검증하는 것은 아니며, 실제 매장 이미지와 브라우저 시나리오가 별도로 필요하다.
