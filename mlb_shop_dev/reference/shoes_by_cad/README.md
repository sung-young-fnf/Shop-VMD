# shoes_by_cad — 매장 신발 사진을 CAD 형태별로 분류

원본 `reference/shoes/`(91 스타일) + `reference/shoes-detail/`(다각도 갤러리) 를 복사해 CAD 형태 36개 폴더로 나눴다. 원본은 그대로 있다.
매핑: `CAD/form_index.csv` (PART_CD → 라스트_아웃솔 형태). 생성: `python3 scripts/organize_shoes_by_cad.py`

```
{형태ID}__{형태명}/
  README.md          스타일 목록
  cad/               도면 JPG + SKILL.md
  {PRDT_CD}.png      사진 1장인 스타일
  {PRDT_CD}/         사진 2장 이상 (대표컷 + gallery-N 앞뒤·디테일)
```

| 폴더 | 형태명 | 스타일 | 사진 | 다각도 폴더 |
|---|---|---:|---:|---|
| [`MLBL-1901_MLBM-1901__빅볼청키A원형(19SS)`](MLBL-1901_MLBM-1901__빅볼청키A원형(19SS)/README.md) | 빅볼청키 A 원형 (19SS) | 1 | 1 |  |
| [`MLBL-2102-2M_MLBM-2202__청키라이너미드(CHUNKYLINERMID)`](MLBL-2102-2M_MLBM-2202__청키라이너미드(CHUNKYLINERMID)/README.md) | 청키라이너 미드 (CHUNKY LINER MID) | 2 | 2 |  |
| [`MLBL-2102-2_MLBM-2202__청키라이너베이직(CHUNKYLINER-2202솔)`](MLBL-2102-2_MLBM-2202__청키라이너베이직(CHUNKYLINER-2202솔)/README.md) | 청키라이너 베이직 (CHUNKY LINER · 2202 솔) | 4 | 4 |  |
| [`MLBL-2102-2_MLBM-2413__청키라이너포켓-모노그램(2413솔)`](MLBL-2102-2_MLBM-2413__청키라이너포켓-모노그램(2413솔)/README.md) | 청키라이너 포켓·모노그램 (2413 솔) | 5 | 5 |  |
| [`MLBL-2102-2_MLBM-2607__커브라이너(CURVELINER)`](MLBL-2102-2_MLBM-2607__커브라이너(CURVELINER)/README.md) | 커브 라이너 (CURVE LINER) | 2 | 2 |  |
| [`MLBL-2109_MLBM-2402__빅볼청키리커버리뮬`](MLBL-2109_MLBM-2402__빅볼청키리커버리뮬/README.md) | 빅볼청키 리커버리 뮬 | 1 | 1 |  |
| [`MLBL-2202_MLBM-2202__청키라이너엠보-마스크(2202라스트)`](MLBL-2202_MLBM-2202__청키라이너엠보-마스크(2202라스트)/README.md) | 청키라이너 엠보·마스크 (2202 라스트) | 4 | 4 |  |
| [`MLBL-2317-1_MLBM-2317__클러비(CLUBLINER)`](MLBL-2317-1_MLBM-2317__클러비(CLUBLINER)/README.md) | 클러비 (CLUB LINER) | 2 | 2 |  |
| [`MLBL-2317-1_MLBM-2621__베이스로우(BASELOW)`](MLBL-2317-1_MLBM-2621__베이스로우(BASELOW)/README.md) | 베이스 로우 (BASE LOW) | 2 | 2 |  |
| [`MLBL-2318_MLBM-2423__에이스러너-에이스러너메리제인`](MLBL-2318_MLBM-2423__에이스러너-에이스러너메리제인/README.md) | 에이스러너 · 에이스러너 메리제인 | 2 | 2 |  |
| [`MLBL-2318_MLBM-2502__카고청키(CARGOCHUNKY)`](MLBL-2318_MLBM-2502__카고청키(CARGOCHUNKY)/README.md) | 카고 청키 (CARGO CHUNKY) | 2 | 2 |  |
| [`MLBL-2318_MLBM-2519__트랙러너(TRACKRUNNER)`](MLBL-2318_MLBM-2519__트랙러너(TRACKRUNNER)/README.md) | 트랙 러너 (TRACK RUNNER) | 3 | 3 |  |
| [`MLBL-2404W_MLBM-2620__브리즈러너(BREEZERUNNER)`](MLBL-2404W_MLBM-2620__브리즈러너(BREEZERUNNER)/README.md) | 브리즈 러너 (BREEZE RUNNER) | 1 | 1 |  |
| [`MLBL-2404_MLBM-2521__페이스트리러너-페이스트리마스크(PASTRYCHUNKY)`](MLBL-2404_MLBM-2521__페이스트리러너-페이스트리마스크(PASTRYCHUNKY)/README.md) | 페이스트리 러너 · 페이스트리 마스크 (PASTRY CHUNKY) | 5 | 5 |  |
| [`MLBL-2404_MLBM-2616__커비러너(CURVYRUNNER)`](MLBL-2404_MLBM-2616__커비러너(CURVYRUNNER)/README.md) | 커비 러너 (CURVY RUNNER) | 1 | 1 |  |
| [`MLBL-2404_NEW-M25NSHCC1__챔프청키(CHAMP)`](MLBL-2404_NEW-M25NSHCC1__챔프청키(CHAMP)/README.md) | 챔프 청키 (CHAMP) | 2 | 2 |  |
| [`MLBL-2415_MLBM-2415__빅볼청키(BIGBALLCHUNKY-25SS~)`](MLBL-2415_MLBM-2415__빅볼청키(BIGBALLCHUNKY-25SS~)/README.md) | 빅볼청키 (BIGBALL CHUNKY · 25SS~) | 5 | 5 |  |
| [`MLBL-2415_MLBM-2419__빅볼청키커브커브러너24FW`](MLBL-2415_MLBM-2419__빅볼청키커브커브러너24FW/README.md) | 빅볼청키 커브 / 커브 러너 24FW | 2 | 2 |  |
| [`MLBL-2415_MLBM-2506__커브러너(CURVERUNNER-25FW~)`](MLBL-2415_MLBM-2506__커브러너(CURVERUNNER-25FW~)/README.md) | 커브 러너 (CURVE RUNNER · 25FW~) | 4 | 4 |  |
| [`MLBL-2415_MLBM-2506-1__커브러너GTX`](MLBL-2415_MLBM-2506-1__커브러너GTX/README.md) | 커브 러너 GTX | 1 | 1 |  |
| [`MLBL-2420_MLBM-2420__바운서레인부츠(BOUNCERRAINBOOTS)`](MLBL-2420_MLBM-2420__바운서레인부츠(BOUNCERRAINBOOTS)/README.md) | 바운서 레인부츠 (BOUNCER RAINBOOTS) | 2 | 2 |  |
| [`MLBL-2421_MLBM-2421__청키필드샌들`](MLBL-2421_MLBM-2421__청키필드샌들/README.md) | 청키 필드 샌들 | 1 | 1 |  |
| [`MLBL-2514_MLBM-2514__스키퍼슬라이드(EASYSLIDE)`](MLBL-2514_MLBM-2514__스키퍼슬라이드(EASYSLIDE)/README.md) | 스키퍼 슬라이드 (EASY SLIDE) | 2 | 2 |  |
| [`MLBL-2517_MLBM-2517H__위너청키(WINNERCHUNKY)`](MLBL-2517_MLBM-2517H__위너청키(WINNERCHUNKY)/README.md) | 위너 청키 (WINNER CHUNKY) | 6 | 6 |  |
| [`MLBL-2517_MLBM-2520__커브러너라이트-스피드`](MLBL-2517_MLBM-2520__커브러너라이트-스피드/README.md) | 커브 러너 라이트 · 스피드 | 3 | 3 |  |
| [`MLBL-2517_NEW-M26NSHMC1__모션청키(MOTIONCHUNKY)`](MLBL-2517_NEW-M26NSHMC1__모션청키(MOTIONCHUNKY)/README.md) | 모션 청키 (MOTION CHUNKY) | 1 | 1 |  |
| [`MLBL-2518_MLBM-2518__트로피(TROPHY)`](MLBL-2518_MLBM-2518__트로피(TROPHY)/README.md) | 트로피 (TROPHY) | 4 | 4 |  |
| [`MLBL-2518_MLBM-2529__치즈(CHEESE)`](MLBL-2518_MLBM-2529__치즈(CHEESE)/README.md) | 치즈 (CHEESE) | 1 | 1 |  |
| [`MLBL-2518_MLBM-2530__슬릭(SLEEK)패밀리`](MLBL-2518_MLBM-2530__슬릭(SLEEK)패밀리/README.md) | 슬릭 (SLEEK) 패밀리 | 10 | 19 | M26N3ACVSP46N |
| [`MLBL-2518_MLBM-2617__루키라이너(ROOKIELINER)`](MLBL-2518_MLBM-2617__루키라이너(ROOKIELINER)/README.md) | 루키 라이너 (ROOKIE LINER) | 1 | 1 |  |
| [`MLBL-2518_NEW-M26SRNER0__이지런(EASYRUN)`](MLBL-2518_NEW-M26SRNER0__이지런(EASYRUN)/README.md) | 이지 런 (EASY RUN) | 1 | 1 |  |
| [`MLBL-2522_MLBM-2522__범프청키(BUMPCHUNKY)`](MLBL-2522_MLBM-2522__범프청키(BUMPCHUNKY)/README.md) | 범프 청키 (BUMP CHUNKY) | 2 | 2 |  |
| [`MLBL-2529_MLBM-2529__러니(RUNNY)`](MLBL-2529_MLBM-2529__러니(RUNNY)/README.md) | 러니 (RUNNY) | 3 | 3 |  |
| [`_NEW_미채번__M25SLPS02_스키퍼플립플랍__스키퍼플립플랍`](_NEW_미채번__M25SLPS02_스키퍼플립플랍__스키퍼플립플랍/README.md) | 스키퍼 플립플랍 | 1 | 1 |  |
| [`_NEW_미채번__M26SLPPE1_페퍼슬라이드__페퍼슬라이드`](_NEW_미채번__M26SLPPE1_페퍼슬라이드__페퍼슬라이드/README.md) | 페퍼 슬라이드 | 1 | 1 |  |
| [`_미확인__M22NSXCA1_청키라이너원형__청키라이너원형(22FW)`](_미확인__M22NSXCA1_청키라이너원형__청키라이너원형(22FW)/README.md) | 청키라이너 원형 (22FW) | 1 | 1 |  |
