# Multi-reference reconstruction

## Source roles and uncertainty

View all images at native resolution. A 120 × 80 elevation thumbnail cannot support window mullion measurements just because its filename says “front”. Prefer readable dimensioned plans for footprint and adjacency; elevation drawings for visible heights; exterior photography for materials and recognizable features. Filename directions can conflict with the drawing. Establish front by the entrance/porch and the plan, then record how image labels map to it.

Record one row per image: path, image size, role, visible features, hidden information and confidence. Distinguish measured values, visual estimates and invented furnishings. Do not use exterior pixels as a façade texture when they also contain trees, perspective, shadows and windows from another surface. Use procedural solid materials or reference crops only when perspective and baked lighting can be removed appropriately.

Record native image size separately from the vision tool's resized display. This project's plan was 2550px wide on disk but displayed at 2048px; measurements taken in displayed coordinates require an explicit display-to-native transform before calibration. The same image path does not imply the same pixel coordinate system.

## Plan coordinates

Use meters and Y-up. For a plan with image coordinates `(u,v)`, write one transform, for example `x=(u-u0)/pixelsPerMeter`, `z=(v-v0)/pixelsPerMeter`. In this convention front is +Z when the plan's front is at the bottom. Preserve `y` solely for height. Convert feet/inches exactly: `(feet + inches/12) * 0.3048`.

Calibrate both horizontal and vertical dimensions. Account for whether an annotation describes clear room size or outer walls. Cross-check a long dimension, garage depth and porch width; do not average contradictory images into an arbitrary footprint. Store the plan annotation and resulting meter value together. Project plan hotspots and Three.js room centers from the same room inventory.

## Geometry ownership

Group by physical assembly: foundation, occupied shell, garage, porch, main roof, porch roof, chimney, interior walls, room floors, furniture. Give each independent assembly a stable name. Repeated siding battens, mullions and seams share geometry/material; use instancing when repetition dominates draw calls.

For a pitched roof, define a ridge axis, eave height, ridge height, half-span and overhang. Build finite slabs aligned along the slope with consistent outward normals. Fill exposed gable triangles separately. Porch roofs intersect the main eave below the principal pitch; a single giant sloping slab can hide the house and destroy the silhouette.

At wraparound corners, overlapping rectangular porch sheets create crossing fascia and z-fighting. Use front/side/rear polygons with shared corner elevations and mitred boundaries; place fascia only along exposed edges. Check rear gable infill from a rear camera, since a front-only review cannot reveal an open triangular hole.

Walls with openings must be split into piers, sills and lintels or extruded from profiles with holes. A window painted onto a solid wall fails interior inspection. Attach frames to the opening plane; subdivide glazing behind mullions. Inspect lintel and sill from both sides. A double-sided material is not a repair for inverted mesh winding.

Roof-off must remove gable infill and any ceiling that hides rooms. A section view may lower exterior/interior wall height, but preserve original transforms and restore them exactly when returning outside. Furniture lives inside the measured room footprint, including chair clearances. Hidden-room furniture is interpretation unless sourced.

## Comparison and geometry checks

Use a reference-matched camera for visual identity, plus four orbit directions and overhead for actual structure. A pleasing front frame says nothing about a reversed garage, missing rear wall or floating column. Record numerical coordinate checks separately from visual confidence; never infer dimensional accuracy from screenshot similarity.

Validate finite vertex coordinates, positive finite geometry bounds, expected part names, visible roof group changes, floor and furniture coverage per required room, and repeat/reset invariants. Intersection sampling is limited evidence, not a watertightness certificate. Preserve source hashes with captures so later edits invalidate stale approval.

Batch static meshes by material only within groups that share visibility and movement. Preserve roof/upper-wall toggles, selectable room floors and semantic assembly names. On the example house, this reduced the observed renderer call count from roughly 1617 to 463 while retaining the same visible details. Those counts include the scene's render passes and are not universal budgets.
