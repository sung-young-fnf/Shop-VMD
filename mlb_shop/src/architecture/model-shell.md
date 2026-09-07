# Architecture source ledger

World units are meters. p018 image X-right and Y-down map to world X-right and Z-positive. World finished floor is Y0. Source dimensions remain millimeters below.

## Inspected sources

- `../../reference/drawing_captures/02_spatial/p018_layout_dimensioned.png`: 19190 × 15935 perimeter, 3100 slab height, 2700 beam soffit. Capture mapping uses approximately65.3 pixels/meter with perimeter top-left at(384,201); inferred positions retain this uncertainty.
- `../../reference/drawing_captures/02_spatial/p035_fitting_room_1.png`: each room clear1800 ×1665,2520 wall height;800 ×2300 door with220 head panel. FR2 is mirrored per p036 analysis.
- `../../reference/drawing_captures/01_facade/p008_facade_elevation.png`:15935 primary frontage,17035 upper projection,9700 height;3200/200/3100/200/2300/700 vertical assembly.
- `../../reference/drawing_captures/01_facade/p009_fins_plan.png`:612 nominal module pitch,26 modules,200 ×20 fins with100 setback to mesh;26 modules do not imply26 fins.
- `../../reference/drawing_captures/01_facade/p011_steel_elevation.png`:3 second-floor window groups and4 third-floor groups behind screen;100 ×100 steel uprights and100 ×200 beams.
- `../../reference/drawing_captures/01_facade/p017_entry_handle.png`: paired150 ×300 semicircles,80 central gap,8 thickness,1100 center height; carved baseball stitches.
- `../../reference/drawing_captures/01_facade/p101_logo_elevation.png`:1170 ×340 MLB shaped lettering on1400 support; contour must be geometry rather than system-font text.
- `../../reference/drawing_captures/01_facade/p012_banner_frame.png`:6000 ×5550 frame,40 ×60 galvanized perimeter,40 ×40 stiffeners and300 fixing pitch. Visible artwork is6000 ×5500.
- `../../reference/drawing_captures/01_facade/p014_facade_corner.png`: existing brick/window depth, fin-end returns and offset side banner.
- `../../reference/성수(2025)_보고서_최종_대지+2.jpg`: finished dark desaturated blue-charcoal entry panels and slim perimeter light; fine metallic mesh, brick backdrop. Photo illumination does not define albedo.
- `../../reference/drawing_captures/06_upper_boh/p105_2f_storage_plan.png`:18730 ×15555 layout,106 bays with variable orientation and aisle widths.
- `../../reference/drawing_captures/06_upper_boh/p106_rack_elevation_detail.png`:1200 ×450 ×1800 racks; shelf levels derived from110/515/30/520/30/515/80 stack.
- `../../reference/drawing_captures/06_upper_boh/p104_3f_hvac_plan.png`:18730 ×15600 third floor, independent partitions and VOID, different stair/WC arrangement.

## Coordination bounds

- Front entry center=(0,0,8.70), inferred from p018 capture. Clear door span Z7.70..9.70; full6000 assembly Z5.70..11.70.
- Core front face Z2.25; stairs X2.27..4.70; WC X4.70..8.05; back service X8.05..11.75.
- Lift X16.35..18.96,Z0.23..2.75. Detailed lift mechanism/door engineering unknown.
- Clear fitting X17.16..18.96, FR1Z12.13..13.795, FR2Z13.935..15.600. Accessories owned by central-fixtures. Doors face -X and mirror about shared partition.
- Right interior wall X18.96, bottom interior wall Z15.70. Cap run front of core atZ2.42.

## Explicit approximations

Upper floor elevations are aligned to facade bands Y3.4 andY6.7; no section confirms slab thickness. Stair risers, railing construction, wall thickness and non-front masonry are editable approximations. Upper floors are operational/storage/office only. Rack sharing follows a30-run hypothesis to represent106 bays/424 shelves/272 posts; joints are unconfirmed. No retail merchandise is invented upstairs. Actual color, roughness, glass transmission and brick variation are rendering parameters.

The source ledger below distinguishes the initial blockout from the completed module check.

## Blockout validation

`pnpm exec tsc --noEmit` passed. `node src/architecture/verify.mjs` constructs the real factory and measured57 mesh nodes/1776 triangles. Bounds X[-0.50,19.19],Y[-0.22,9.70],Z[-0.55,16.485]; the550mm front screen end projections intentionally extend beyond the first-floor perimeter. Native Node24 type stripping drives local TypeScript modules for this check. Initial upper/facade/cutaway groups are hidden. Manager browser comparison is still pending.

## Rack run interpretation for next detail pass

Native p105 crop uses approximately56.8 px/m. Thirty runs follow visible groups: left edge9 bays; twelve upper aisle runs(11×3+1×4)=37 bays; nine lower aisle runs(9×4)=36 bays; two lower-right runs(2×5)=10 bays; bottom horizontal runs7+1=8 bays; four core-side runs1+2+1+2=6 bays. Total106. Four shelves per bay gives424. Two posts per run end/bay boundary gives2×(106+30)=272. This is a geometric interpretation that agrees with the quantity note, not a verified connection detail.

## Detailed module handoff

- `index.ts`: first-floor slab, rounded PT04 floor region, perimeter/core/stairs/lift/columns, separate ceiling slab and beam group. Track is11550 ×5950 withR1500 corners, area≈66.79m², top offset6mm. Slab soffit3100 and beam soffit2700 are separate from upper facade levels. Beam axes follow mapped columns; the p025 barrisol2750/beam2700 conflict is retained in metadata.
- `entry.ts`: actual glazing openings,6000 entry subdivision, two hinge-pivot glass leaves,150 ×300 ×8 paired baseball handles and stitches, shape-based MLB letters with holes, window frames and auxiliary door.
- `facade.ts`: 26 screen modules/27 fins per story; three second-floor and four third-floor true window openings; independently layered fine belt-mesh alpha surface, masonry, end returns, bands, side/rear walls, roof and6000 ×5550 banner frame. The blank p012 IMAGE sheet is not artwork: the banner is a clearly replaceable neutral surface. Exact campaign art remains unavailable.
- `fitting.ts`: two mirrored wood door/head assemblies, ventilation slots, blue handles, hinges and occupancy indicators; room wall boundaries coordinated with central accessories.
- `upper.ts`: 106 actual bay toe rails,424 shelf instances,272 post instances, two steel lockers and source-derived 2F partitions. Distinct3F partitions and a true slab VOID. Floor parents carry `upperFloor`2/3; app hides3F above rack selection. Upper source material/height details remain approximate.
- `primitives.ts`: shared semantic materials, physical world-scaled masonry UVs, finite box and repeated-box builders. Repetition stays inside each visibility group.

Final own-scope checks: `pnpm exec tsc --noEmit` exit0; `node src/architecture/verify.mjs` exit0. Real factory contains231 mesh nodes and15787 triangles including all hidden floors. Actual metadata-derived counts are fittingRooms2, storageRackBays106, storageShelves424, storagePosts272, lockers2. A downward ray in the3F VOID intersects no3F geometry. All root bounds are finite. Six TypeScript modules remain below100 nonblank source lines each.

Real Chrome1440 ×1000 current-source captures were generated with `capture.mjs` and personally inspected: `evidence/diorama.png`, `evidence/exterior.png`, `evidence/interior.png`, `evidence/fitting.png`, `evidence/upper.png`. Interior shows the slab/beams; fitting exposes both rooms; upper selection exposes the rack floor rather than the3F slab. Total integrated render statistics vary as peers finish fixtures; the last upper capture reported909 calls/387449 triangles for the whole app, not this module alone. No browser page error was emitted. Manager owns final integrated visual approval and responsive verification.

Review: module responsibilities are explicit, no external untyped input is parsed here, no type assertions/non-null assertions were used, no logging system introduced, and batch helper parameters form a reusable geometry value. New tests exercise observable geometry/count/visibility boundaries rather than copied prose. Stair rise/connection, exact finishes, and unopened upper room details remain approximations as stated above.
