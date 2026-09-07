# MLB shop development workflow

- Use `mlb_shop_dev` for future development work by default.
- `mlb_shop` is the operating application. Treat its source, build output, reference files and active server as read-only unless the user explicitly requests promotion or operating changes.
- Development live editing uses port 5175; development built preview uses port 4175. Port 4174 belongs to the operating application. Check listeners before starting a server; never automatically stop or replace an existing server.
- Keep the applications independent. Do not share source through hardlinks, symlinks or directory junctions. Install development dependencies within `mlb_shop_dev`.
- Preserve original references and provenance. New crops, models and evidence belong in the development copy; do not overwrite source images.
- Do not automatically promote, deploy, copy development changes onto the operating application, or rebuild its dist directory. Promotion requires an explicit user request.
- The original copy hashes and repeatable preservation check are in `mlb_shop_dev/evidence/isolation/` and `mlb_shop_dev/scripts/check-isolation.mjs`.
