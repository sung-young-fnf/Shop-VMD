# Architecture evidence v1

All paths are workspace-relative, contained in that workspace. SHA256 values are lowercase hex of actual file bytes. Never invent successful observations or repair stale QA by merely updating its source hashes.

## house-spec.json

Retain project-specific fields. Required fields:

- `version: 1`, `units: "metres"`, `coordinates: {up:"+Y",front:"+Z",planTransform:nonempty string}`.
- `sourceManifest`: nonempty rows `{path,width,height,role,sha256}` with positive pixel dimensions. Include a `plan` role and an `exterior` role. Hashes bind the exact images inspected.
- `calibration`: at least one row each for axes `x` and `z`: `{axis,annotation,metres,pixels,pixelsPerMetre}`. Positive finite values; `pixels/metres` must agree with declared scale within 2%. Cross-axis scale disagreements remain a visual/spec review responsibility.
- `rooms`: nonempty unique `{id,dimensionsMetres:[width,depth],sourceDimension,confidence}`. Dimensions positive and finite; confidence is `measured` or `inferred`.
- `expectedAssemblies`: at least three unique runtime names for independently addressable architectural groups.
- `qualityContract`: nonempty `critical` and `verification` string lists, explicit `approximation` string, positive integer `targetTriangles` and `targetDrawCalls` limits.

## .img2/artifacts/house/browser-qa.json

```json
{
  "kind": "house.browser-qa",
  "version": 1,
  "sourceHashes": {"src/main.ts": "actual SHA256", "house-spec.json": "actual SHA256"},
  "captures": [{"view":"front","path":"evidence/front.png","sha256":"actual SHA256"}],
  "checks": {"webgl":true,"consoleClean":true,"finiteGeometry":true,"positiveBounds":true,"roofCutaway":true,"roofExplode":true,"roomPicking":true,"reset":true,"night":true,"keyboard":true},
  "geometry": {"triangles":100,"drawCalls":10,"roomIds":["living"],"assemblies":["foundation","envelope","roof"]}
}
```

The example is schematic, not passing evidence. `sourceHashes` must cover every actual file recursively under `src/`, plus `house-spec.json`, `index.html`, `package.json`, and any existing `package-lock.json`, `bun.lock`, `bun.lockb` or `pnpm-lock.yaml`. Extra hash entries are allowed and checked. Source coverage detects additions as well as edits.

`captures` must include `front`, `rear`, `left`, `right`, `overhead`, `mobile`, each in a distinct existing PNG of at least 240px on both axes. Gate verifies the signature, IHDR dimensions and hash; a person must inspect image content. Checks are strict JSON booleans produced by actual observed browser scenarios. `geometry` holds counts from the renderer and names/IDs from scene traversal; required spec rooms and assemblies must be present. Counts must fit spec limits.

This gate consumes the supplied QA report; it cannot independently prove the report was honestly generated or judge image likeness. Preserve detailed test logs beside it, and have visual review inspect captures and the references. The plugin's gate reports are distinct from generic img2threejs sculpt-spec approvals.
