# Cream LA sneaker reference viewer

Run `pnpm install` then `pnpm dev`. Local viewer: http://127.0.0.1:5188 . `pnpm build` runs strict TypeScript checking and the Vite production build.

Independent folder, separate from the cap viewer and operating/development applications. Original shoe photos in `../mlb_shop_dev/reference/shoes-detail/M26N3ACVSP46N` are read only; source provenance and hashes are in evidence/.

Actual source photographs supply canvas/suede color texture, complete curved side-panel photo projection including LA embroidery, the DODGERS heel print and outsole atlas. Color patches have adjusted repetition/contrast and contain photographic lighting. Geometry, lacing, seams, collar, rubber heel and pentagonal tread are reconstructed in code. Tongue typography and the insole MLB mark are approximate redraws. The outsole combines actual photographic color with varied source-aligned relief; tread is not a measured scan. This is an inferred single-shoe model, not measured geometry, recovered PBR, manufactured stitching accuracy, or a rigged/export-certified asset.

`node scripts/assets.mjs` and `node scripts/photo-surfaces.mjs` reproduce derived assets for this SKU. Its source paths and crop coordinates are SKU-specific. `node scripts/capture.mjs` captures all seven model modes, pointer drag, wheel zoom, reset and 375/768/1280 responsiveness, and checks all nine reference images and browser errors.

The rear rubber is one continuous curved wall; its five rear-facing tread marks are photographic. Separate three-dimensional relief is on the outsole. Rear and side photography blend around the heel to avoid a straight atlas boundary.
