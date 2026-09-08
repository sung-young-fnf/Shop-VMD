# NY cap reference viewer

Run `pnpm install` then `pnpm dev`. Local URL: http://127.0.0.1:5187 . Build with `pnpm build`.

New independent project; operating application and development application are untouched. Source references are read-only in `../mlb_shop_dev/reference/caps-detail/M21N3ACP7701N`.

The model uses six curved crown panels, a curved two-sided visor with stitch rows, rear opening and adjustable strap, metal clasp, eyelets and interior tapes. Twill color is derived from gallery-7; NY alpha embroidery from gallery-5; rear badge from gallery-6. Source provenance and hashes are under evidence/. Interior MLB tape typography is reconstructed. Actual dimensions, tiny irregularities and physical material properties are inferred, not measured. Base-color assets contain photographic lighting; they are not recovered PBR sets.

Browser QA: `node scripts/capture.mjs` captures all view buttons, drag, zoom, reference loading and375/768/1280 widths. Browser console results: evidence/browser-check.json. The original failed initialization was caused by floating-point cosine below zero at the dome boundary before a fractional power; the boundary is clamped and this same browser scenario now completes.
