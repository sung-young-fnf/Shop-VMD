# Forest House

도면과 외관 이미지로 구성한 절차적 Three.js 주택 탐색 페이지입니다. [Ciudad Jardín](https://ciudad-jardin.vercel.app/)의 공간 탐색과 디오라마 화면 구성을 주택에 맞게 적용했습니다.

## 실행

```powershell
cd C:\Users\AC1143\Project\Project\shop_vmd\test_house
pnpm install
pnpm dev
```

개발 화면: http://127.0.0.1:5173

```powershell
pnpm build
pnpm preview
```

프로덕션 미리보기: http://127.0.0.1:4173

## 조작

- 드래그: 회전. Shift 또는 오른쪽 드래그: 이동. 휠·핀치: 확대/축소.
- 외관 / 실내 / 평면: 건물 보기 전환. 실내·평면에서는 바닥을 눌러 방 선택.
- 좌측 공간 목록: 방 선택과 카메라 이동. 모바일에서는 하단 가로 목록.
- 달: 낮/밤. 층 아이콘: 지붕 분해. 원형 화살표: 초기 시점.
- 키보드 1/2/3: 보기 전환, R: 초기화, N: 낮/밤, Escape: 참고 이미지 닫기.

원본 이미지는 `test_house_reference`에 보존했습니다. 평면도의 위치와 치수를 우선하고, 외관 사진은 재료·지붕·포치 참고로 사용했습니다. 4개 입면도는 120×80px이므로 세부 치수 근거가 아닙니다. 가구, 조경, 숨겨진 구조와 일부 지붕 접합은 추정이며 시공용 CAD가 아닙니다.

## 공식 img2 하네스

설치된 공식 하네스: `C:/Users/AC1143/.img2/harness`, 버전 0.2.3. 현재 PC의 npm Git 패키지 제한 때문에 공식 저장소를 clone한 뒤 해당 installer를 Node로 실행했습니다. Windows/Git Bash용 `img2` 실행 파일은 `C:/Users/AC1143/.local/bin`에 있습니다.

`house`는 이번 프로젝트에서 만든 **로컬 플러그인**이며 upstream 공식 주택 플러그인이 아닙니다. 원본 `img2` 하네스와 `img2threejs` 핵심 스킬은 수정하지 않습니다. 플러그인 소스는 `C:/Users/AC1143/skills-src/plugin-house`, 등록은 공식 `img2 add --link`를 사용합니다.

```powershell
img2 list
img2 doctor --json
img2 sync --check
img2 capabilities --from-kind floor-plan-images --to-kind procedural-threejs-house --plugin house --json
pnpm qa
python C:/Users/AC1143/.img2/harness/img2_core/gate_runner.py --plugin-dir C:/Users/AC1143/skills-src/plugin-house --workspace .
```

`pnpm qa`는 실행 중인 프로덕션 미리보기가 필요합니다. `HOUSE_QA_URL`로 주소를, `HOUSE_CHROME_PATH`로 브라우저 경로를 지정할 수 있습니다. 기본 브라우저 경로는 이 PC의 설치 경로입니다.

실제 하네스 상태는 `.img2/state.json`, 게이트 증거는 `.img2/artifacts/house`에 있습니다. `house-spec`는 원본 해시·치수·방·구조를 확인하고, `house-browser`는 최신 소스/스크린샷 해시·브라우저 동작·지오메트리 예산을 확인합니다. 픽셀 유사성이나 시공 정확도를 자동으로 인증하지는 않습니다.

초기에 생성한 `.img2threejs` 문서는 하네스 연결 전의 작업 기록입니다. 현재 진행 상태의 기준은 공식 `.img2` 상태와 게이트입니다. `forge --profile house`는 등록하지 않았으며 generic ObjectSculptSpec 통과를 주장하지 않습니다.

## 파일

- `house-spec.json`: 근거·측정·추정·품질 기준
- `src/house`: 주택, 개구부, 지붕, 가구 절차적 모델
- `src/scene.ts`: 렌더러와 카메라, 선택·보기 제어
- `src/interface.ts`, `src/style.css`: 실제 DOM 인터페이스와 토큰
- `evidence/reference-site`: 참고 사이트 관찰·스크린샷
- `evidence/qa`: 브라우저 시나리오·뷰포트 캡처
- `evidence/harness`: 설치와 플러그인 검증 기록
