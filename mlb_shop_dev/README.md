# MLB 성수 DEV · 상품 레퍼런스 개발본

앞으로의 개발 작업은 이 `mlb_shop_dev`에서 진행합니다. 운영본 `../mlb_shop`과 4174 서버는 유지합니다. 개발 미리보기는 4175, 실시간 개발 서버는 5175입니다. 복사·검증 기록은 아래 Development copy 절과 `evidence/isolation/`을 참고하세요.

## 개발본 안내

운영본 `mlb_shop`은 포트 4174에서 유지하고, 이 개발본은 미리보기 포트 4175와 실시간 개발 포트 5175를 사용합니다. 이후 수정도 `mlb_shop_dev`에서 진행하며 운영본에 자동 반영하지 않습니다.

제공된 상품 사진을 기존 진열에 적용했습니다. 풋웨어는 CAD와 동일 제품의 다각도 사진을 확인한 **12종으로 98개 진열**을 교체했습니다. 매장에서 풋웨어를 선택한 뒤 **신발과 원본 자세히 보기**를 누르면 제품별 회전·사진·CAD 비교 화면이 열립니다. [풋웨어 제작·검증 기록](evidence/shoe-cad-refresh/README.md)에 출처와 표현 한계를 정리했습니다. 앞코 전용 사진, 고정 좌표 뒤축 투영, 갑피·밑창 윤곽 분리 및 사진 배경 경계 보정은 [앞코·뒤축 개선 기록](evidence/shoe-cad-refinement/README.md)에 있습니다. 상품 선택과 진열 수량은 실제 재고를 뜻하지 않습니다.

현재 개발본의 검증과 한계는 [상품 개발본 검증 기록](evidence/PRODUCTS_VERIFICATION.md)을 확인하세요. 함께 복사된 기존 `evidence/browser`, `evidence/harness`, `evidence/walk` 등의 기록은 운영본의 과거 작업 이력이며, 새 상품 개발본의 검증 결과를 대신하지 않습니다.

제공된106페이지 준공도면과 VMD 보고서를 바탕으로 구성한 별도 Three.js 매장 탐색 앱입니다. 형상은 코드로 생성되며, 원본 도면·사진은 출처 패널과 WebGL 실패 시 참고 자료로 사용합니다.

## 실행

이미지 기반 모델 제작용 `img2threejs` 스킬과 `img2` 관리 도구가 설치되어 있습니다. 실행 명령과 설치 위치는 [개발 도구 안내](tooling/README.md)를 참고하세요.

Node.js와 pnpm이 필요합니다. 기존 환경의 Bun shim이 실행 불가능하여 Node/pnpm을 사용했습니다. 의존성은 이 폴더에만 설치됩니다.

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
```

개발: http://127.0.0.1:5175 / 프로덕션 미리보기: http://127.0.0.1:4175.

dev·preview 모두 `0.0.0.0`에 바인딩하므로 같은 네트워크의 다른 PC에서도 열립니다. 기동 로그의 `Network` 줄에 표시되는 주소를 사용하세요(예: http://172.20.46.132:4175). 사내망 한정이며 외부 배포는 하지 않았습니다.

## 탐색

디오라마·외관·실내·평면의 네 보기, 아홉 존, 실제 집기 클릭, 회전·확대·이동, 천장 표시, 야간 조명, 초기화와 원본 도면 패널을 제공합니다. 드래그 회전, 우클릭/Shift 드래그 이동, 휠·핀치 확대. 키보드1–4 보기, R 초기화, N 야간, C 천장, Escape 도면 닫기. 모바일 존 목록은 가로로 스크롤됩니다. 모션 감소 설정에서는 카메라가 즉시 이동합니다. 그래픽 연결 실패 시 원본 평면과 재시도가 제공됩니다.

## 좌표와 자료

모델1unit=1m. 원문 치수는mm. p018 좌상단 원점, +X 오른쪽,+Z 아래쪽,+Y 높이. 기준 외곽19.190×15.935m, 주출입구X0/Z약8.70m. [`store-spec.json`](store-spec.json), [`BUILD_CONTRACT.md`](BUILD_CONTRACT.md), [`analysis/MLB_성수점_매장구성_및_Threejs_구현명세.md`](analysis/MLB_성수점_매장구성_및_Threejs_구현명세.md)에 치수·범위·상충 근거가 있습니다. `public/sources`에는 제목란/연락처를 제외한 상세 도면 캡처와 제공된 중앙 존 보고서 이미지를 복사하여 프로덕션에서도 사용합니다.

## 구현 범위와 한계

1F 매장·곡선 아일랜드·모자/신발/의류 집기·캐셔·모꾸존·피팅룸·천장 설비 및 외관,2F 수납,3F 확인된 구획을 재현합니다. 상층을 판매장으로 추정하지 않았습니다. 상품은 실제 SKU·재고 수량을 확정하지 않은 예시 형상입니다. PBR 색상·거칠기·광량은 사진을 참고한 렌더링값이며 실측값이 아닙니다. 거울은 환경 반사이며 실시간 매장 반사 영상은 아닙니다.

잠정 채택값: 캐셔 p0693300×800×1100mm(p0182600×500과 상충),DP-T3 W1000/D800/H800,DP-T2 H920. 바리솔5000K,레일4000K 계통은 구분하며 중앙 바리솔 하단2750와 보2700 간섭은 미확정입니다. 외부 로고3000K/라인4000K는 상충 시트 중 잠정 선택입니다. MT06 중복은 블루금속과 익스팬디드 메쉬 의미로 분리했습니다. 배너 최종 아트는 제공되지 않아 교체 가능한 표면을 둡니다. 숨은 접합부와 상층 구조 높이는 도면으로 확정되지 않은 근사입니다. 시공·발주용CAD가 아닙니다.

## 구조와 검증

`src/architecture`, `src/wall-fixtures`, `src/central-fixtures`가 독립 팩토리이고, `src/runtime`이 카메라·레이어·선택을 통합합니다. `src/lighting`은 광원과 보이는 천장 시스템, `src/ui`와 `src/styles.css`는 [`DESIGN.md`](DESIGN.md)의 탐색 체계를 구현합니다. `window.__MLB_DEBUG__`는 현재 장면에서 계산한 카메라·통계·가시 레이어·집기 위치를 반환하는 읽기 전용 진단 getter입니다. 성공 판정을 조작하는 명령은 없습니다.

검증 기록은 `evidence/browser`와 `evidence/harness`에 있습니다. 중간 blockout/exploratory 기록과 최종 빌드 증거를 구별해야 합니다. `pnpm build`는 strict TypeScript 검사를 포함합니다. 초기 단일Three.js 런타임 chunk는500kB를 넘으며, 해당 경고를 숨기지 않았습니다. 기능/시각 검증과 Lighthouse 성능 측정은 별도 결과로 보고합니다.

`node scripts/app-regressions.mjs`는 실제 Chrome의 첫 프레임 카메라, BFCache 복원 후 조작, 가로 화면의 패널 겹침을 검사합니다. 정적인 매장 그림자는 카메라 이동 중 재사용하고 보기·천장 가시성이 바뀔 때 다시 계산합니다. 따라서 첫 프레임/레이어 전환과 안정된 카메라 프레임의 draw call 수를 구분해야 합니다. PMREM128 실험은 유의한 초기화 비용 개선이 없어256을 유지했습니다. 비교 결과는 `evidence/environment`에 있습니다.

## 방향키와 사람으로 걸어보기

- 일반 탐색: 방향키를 누르고 있으면 현재 시선 기준으로 카메라와 주시점이 함께 이동합니다. 존 목록이나 도면 창을 조작할 때에는 해당 UI의 키 입력을 우선합니다.
- **사람으로 걸어보기**: 약1.85m의 오리지널 방문객 캐릭터로1층을 이동합니다. 방향키/WASD 또는 화면 방향 버튼을 누르세요. 드래그로 시선을 바꾸고 휠로 따라가는 거리를 조절합니다.
- 벽·집기와 바닥 경계를 검사하며 장애물 옆으로는 미끄러지듯 이동합니다. 보행용 근사 충돌이며 정밀 물리/인체 접근성 인증은 아닙니다.2F/3F 계단 이동은 포함하지 않습니다.
- 카메라가 벽에 가려질 때는 안쪽으로 당기며, 너무 가까우면 눈높이1인칭으로 자동 전환합니다. 여유가 생기면3인칭 캐릭터가 다시 보입니다.
- **Esc** 또는 **탐색으로 돌아가기**로 이전 탐색 시점으로 돌아갑니다. 도면 창이 열려 있으면 첫 Esc는 창만 닫습니다. 창 전환·포커스 상실·도면 열기에서는 이동 입력이 해제됩니다.
- 모션 감소 설정은 불필요한 팔다리 진동을 끄되 사용자가 요청한 이동은 유지합니다. 기존 야간·천장·초기화·도면 기능과 회사 IP 공유 설정은 유지했습니다.

에셋: [`public/assets/visitor.glb`](public/assets/visitor.glb), 약100KB, 분리된 관절과`Walk` 애니메이션 포함. 외부 인물 파일을 다운로드하지 않은 오리지널 절차적 모델입니다. 앱은 [`src/walk/visitor.ts`](src/walk/visitor.ts) 팩토리를 직접 사용하며 GLB는 다른 프로젝트에서 재사용하기 위한 내보내기입니다.

```sh
node --test scripts/walk-movement.test.mjs
node scripts/export-visitor.mjs
node scripts/verify-visitor.mjs
node scripts/qa-walk.mjs
```

보행 추가 후 검증 기록은 [`evidence/walk/VERIFICATION.md`](evidence/walk/VERIFICATION.md)에 별도로 남깁니다. 기존 매장 구현의98캡처/성능 결과는 보행 기능을 추가하기 전 버전의 기록이며, 현재 버전의 검증으로 대신하지 않습니다.
# Development copy: reference-backed merchandise

Work in this `mlb_shop_dev` directory. The separate `../mlb_shop` directory is the operating baseline and must not be edited or rebuilt by this development workflow.

Run `pnpm install --frozen-lockfile --package-import-method=copy`, then `pnpm dev` for port 5175; run `pnpm build` and `pnpm preview` for port 4175. Both bind to 0.0.0.0 for company-network access. Port 4174 belongs to the operating site.

The copy includes source, references, documentation, evidence, dist and hidden .img2threejs state. Only regenerable node_modules, .cache and .vite directories were excluded. Source and copied files were byte-compared before edits: 1,759 files, 568,083,924 bytes. See `evidence/isolation/baseline.json` for every original SHA256. Dependency files are independently installed using pnpm copy import mode; no source hardlinks or junctions were created.

Caps, shoes and clothes are reference-backed visual studies using cropped product-only textures. Inferred hidden surfaces remain procedural. Existing bags are still illustrative. Category evidence records admission and approximation limits. Copied evidence described above belongs to the historical operating baseline; current development verification is recorded in [PRODUCTS_VERIFICATION.md](evidence/PRODUCTS_VERIFICATION.md).
