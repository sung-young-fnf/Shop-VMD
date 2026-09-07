# MLB Seongsu implementation contract

## Ownership and objective

Build a separate real, interactive procedural Three.js application in `mlb_shop`, based on the completed106-page analysis and original captures. Preserve `analysis`, `reference`, and sibling `test_house`. Main session is the manager; code edits belong to named workers. Nobody reverts peers' edits. Use apply_patch for edits. No deployment/commits requested.

Read `analysis/MLB_성수점_매장구성_및_Threejs_구현명세.md`, relevant `analysis/parts/` reports, and inspect corresponding `reference/drawing_captures` images before geometry. Shared skill: `../skills/shop-vmd-threejs/SKILL.md` and its routed references. Read applicable programming/frontend skills. Node/pnpm are available; Bun shim was previously unusable. Existing test_house package versions are available locally; do not modify that app.

## Stable module interface

- `src/architecture/index.ts` exports `createArchitecture(): THREE.Group`.
- `src/wall-fixtures/index.ts` exports `createWallFixtures(): THREE.Group`.
- `src/central-fixtures/index.ts` exports `createCentralFixtures(): THREE.Group`.
- Each owns its subtree and materials/helpers; no imports from other worker subtrees. Three.js is the shared dependency.
- App owner owns package/config, `src/main.ts`, runtime/UI/styles/lighting, public derived assets, DESIGN.md and README. Coordinate any new top-level directory with manager. App imports the three factory modules.
- Spec owner owns `store-spec.json`, `.img2threejs/`, `evidence/harness/` and applicable sculpt spec. It does not edit geometry/UI.

## Coordinates and selection

World units meters; retain original mm in evidence. p018 top-left main rectangle is (x0,z0); +X goes page right, +Z goes page down, +Y is up. Floor1 X0..19.190, Z0..15.935, finished floor Y0. Main door lies X0, center Z approximately8.70 after calibrated source review (supersedes the initial8.2 estimate). All groups already use these world coordinates; do not recenter factories independently. Ground/site may extend outside.

Use group `userData.zoneId` from these stable IDs: `entrance`, `central`, `headwear`, `footwear`, `apparel`, `checkout`, `custom`, `fitting`, `upper-storage`. Selectable fixture groups also carry unique `userData.fixtureId`, `userData.label` (Korean), `userData.sourcePages` (number array). Metadata on parent is enough; app raycast walks ancestors. Put furniture center in object-local origin then position group; bounds must be finite.

Architectural visibility groups use `userData.layer` = `upper` (all second/third-floor interior/floors), `facade-upper` (upper external facade), `ceiling` (first-floor opaque ceiling + ceiling systems), `cutaway-wall` (opaque first-floor walls obscuring diorama). Visible base slab/core stays independent. App toggles these for exterior/diorama/interior/plan, restoring visibility on every switch. Do not tag children with conflicting visibility states. Initial diorama must expose interiors; exterior must show facade layers. App owns ceiling light system and may use its own ceiling layer.

## Spatial division and provisional dimensions

Architecture owns floor/walls/columns/cores/stairs/lift/fitting-room shells+doors, front glass/baseball handles, upper facade/banners and2F racks/3F known layout. Central worker owns fitting-room interior accessories only. Central group A/B left curved pieces,C/D right, E/F internal suspended displays; counter at upper-right,custom lower-left. Wall worker A=headwear top, B=footwear right, C=apparel bottom. Coordinate precise fitting bounds between architecture/central and do not duplicate walls.

Use p069 counter3300×800×1100mm as a **provisional detailed-model dimension**, keeping p0182600×500 conflict visible in spec/UI source notes. Use DP-T3 W1000/D800/H800 and DP-T2H920 provisionally with conflicts documented. Exterior logo3000K and line lights4000K are changeable provisional choices, not final approval. Material semantics must distinguish duplicate MT06 blue metal vs expanded mesh. Retain actual gray/blue/wood materials, not drawing highlight colors. Do not invent exact SKU: merchandise is labeled illustrative proxy. Banner artwork may use the provided PDF crop only as a replaceable surface graphic, never a whole-photo building substitute. Do not make building geometry from screenshot planes.

## Work phases

Inspect/spec first. Spec owner establishes quality contract and reports applicable img2 gate state before production geometry. Workers may inspect and design module interfaces meanwhile. Build blockout first; report it so manager can capture and compare before detail passes. Preserve real openings, curved islands, mesh/perforation silhouettes, 8 cap/5 shoe cabinet assemblies, fitting rooms2, counter/customization, and upper floor provenance. No placeholder exports in final handoff.

## Experience and acceptance

Full-screen architecture viewer influenced by prior Ciudad Jardin interaction grammar, with MLB-specific charcoal/ivory/cobalt editorial tokens. Diorama/exterior/interior/plan views; nine zone selections; orbit/zoom; ceiling/cutaway; night; reset; reference panel; mobile and keyboard usable. Respect reduced motion. WebGL failure/context loss must show useful reference fallback. Do not claim upper floors are retail.

App supplies read-only browser debug state for QA (view,zone,sceneReady,cameraSettled,renderer stats,visible groups) with typed interface, not a fabricated success flag. Build/typecheck, current desktop/mobile screenshots, real interactions, source-aligned model inspection and independent review are required. Prefer static repeated geometry merged/instanced without losing fixture/visibility IDs. Target reasonable GPU budget; measure actual stats and report exceptions instead of hiding scene to pass.

Report WORKING phases/findings in English to manager and affected peers. Source-specific conflicts and approximations belong in store spec and README. Any shared skill improvement must be evidence-backed and saved under root `skills` with assigned ownership.
