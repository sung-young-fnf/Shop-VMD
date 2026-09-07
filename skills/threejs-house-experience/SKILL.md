---
name: threejs-house-experience
description: Reconstruct an interactive procedural Three.js house from floor plans and exterior references. Use for multi-view residential architecture, roof cutaways, selectable rooms, and architectural web experiences; not CAD certification or single-object reconstruction.
---

# Three.js house experience

Use measured architecture to create a navigable website. Keep reconstruction data separate from rendering and interface code. When `img2threejs` is available, use its image analysis, local spec search, topology vocabulary and material guidance. A multi-reference building uses the architectural assembly route below, not a fabricated passing `ObjectSculptSpec`.

When the official `img2` harness is installed, query `img2 capabilities --from-kind floor-plan-images --to-kind procedural-threejs-house --json`. If a house provider is returned, read its installed `SKILL.md` and evidence contract, then use its gateRunner argv and state API. The local `house` plugin developed with this skill is not an upstream official plugin and does not register `forge --profile house`. Do not modify the base skill to bypass its generic gates.

Read [references/reconstruction.md](references/reconstruction.md) before authoring the house spec. Read [references/experience.md](references/experience.md) before the application shell and again during browser QA.

## Deliverables

- Source manifest and `house-spec.json`: measured coordinate transform, room and opening inventory, components, confidence, reference conflicts, material recipes, quality contract.
- Procedural `createHouseModel()` factory with named groups, an independently switchable roof, selectable rooms, and reversible section/exploded states.
- A real Three.js browser scene with usable camera controls, accessible room navigation, source comparison, and an explicit loading/failure state.
- The installed provider's `.img2` state and artifact reports linking actual stage evidence; screenshots and a browser QA report. If no provider exists, use a project evidence ledger and explicitly report that no harness gates ran. Label source limitations without suggesting this is a construction document.

## Architecture stage gates

Advance in this order and retain evidence before modifying the next stage:

1. Intake: view every source; record dimensions and role, assess readability. An exterior scene can supply a building reference when the target building is unambiguous and supported by a plan. Do not reject it merely for containing trees.
2. Specification: calibrate plan pixels against at least two readable dimension annotations, resolve orientation, and map room adjacencies. List inferred heights, roof intersections and concealed surfaces. Identity targets are subject-specific.
3. Structure: render footprint, principal roof masses and porch from front/rear/left/right plus overhead. Confirm reference chirality, scale and roof axes before detailing. Every screenshot must identify the current source revision.
4. Detail/material: add measured openings, gable infill, posts, roof seams, chimney, trim and furniture. Compare fixed reference-like views; reject geometry concealed by solid wall panels or a large roof slab.
5. Experience: test roof-off, room selection, reset, exploded assembly, theme, plan comparison, keyboard and touch. On section views show the floors and interior assemblies, not merely the top of opaque rooms.
6. Verification: typecheck/build, browser console, finite geometry and bounds, semantic part coverage, four orbit directions, desktop/tablet/mobile and reduced-motion captures. Independent visual review for substantial UI work. Every claimed behavior needs observable evidence.

The state is an index, not evidence. Record `pending`, `active`, `passed` or `blocked` per stage with source files and capture paths; never mark a pending stage passed because a later screenshot looks plausible. Correct one defect group at a time (coordinate/camera, structure, detail, material, interaction), recapture affected views, and record the result. If the same reference ambiguity survives two geometric attempts, preserve the better supported shape, identify the ambiguity, and request more input only if it blocks the requested fidelity.

## What transfers from an inspiration site

Inspect the live site in a browser. Record observed camera, interaction and compositional behavior independently of its brand and proprietary assets. A request for a house experience “like” a city demo usually transfers spatial navigation and atmosphere; it does not imply copying its city model or claiming the new house is a pixel-identical clone. Preserve whatever exact matching the user explicitly requests.

## Evolve from evidence

Update these references with a reproducible failure, the geometry or interaction cause, and the verified repair. Keep project-specific coordinates and arbitrary aesthetic choices in the project spec. Do not turn a local limitation into a universal ban, reduce object-pipeline gates, or call an unregistered profile installed.
