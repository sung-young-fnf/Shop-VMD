---
name: img2-house
description: Build an interactive procedural Three.js house from floor-plan images and exterior references, with img2 harness gates for measured specifications and current browser evidence. Use for architectural cutaways, room picking and roof assemblies.
---

# Architectural image reconstruction

`$SKILL_DIR` is the absolute directory containing this SKILL.md. Run commands from the user's project, with that project as `--workspace`; never use the plugin checkout as the workspace.

Read [reference/reconstruction.md](reference/reconstruction.md) before geometry work and [reference/evidence.md](reference/evidence.md) before writing the spec or collecting QA. Follow the agent steps returned by `img2 capabilities --from-kind floor-plan-images --to-kind procedural-threejs-house --plugin house --json`.

Use the installed img2 harness gate runner after collecting evidence:

```bash
python "$IMG2_HOME/harness/img2_core/gate_runner.py" --plugin-dir "$SKILL_DIR" --workspace "$PWD"
```

If `IMG2_HOME` is unset, use the installed harness path returned by the capability query. Individual gate diagnosis:

```bash
python "$SKILL_DIR/tools/gate.py" --workspace "$PWD" --gate spec
python "$SKILL_DIR/tools/gate.py" --workspace "$PWD" --gate browser
```

This is a local architecture capability. It does not register a base `forge --profile house`, does not consume or certify `ObjectSculptSpec`, and cannot skip or weaken another pipeline's gates. A pass means its named evidence checks passed; numerical dimensions and screenshots do not certify construction accuracy or perceptual fidelity. Keep inferred roof connections, thicknesses and furnishings explicit.

Inputs are `house-spec.json`, actual project source files, and `.img2/artifacts/house/browser-qa.json`. Gate verdict artifacts remain in `.img2/artifacts/house/`; only the `house` subtree is updated through `img2_core.state.update_plugin_state`. Missing, malformed, changed or failing evidence blocks progression. After a source edit, recapture QA; never just replace hashes in an old report.

The plugin uses Python standard library tools and unittest as required by the img2 plugin contract, so execution does not install runtime packages. For local development: `img2 add --link <absolute-plugin-directory>`, `img2 doctor`, `img2 sync --check`, and `python -m unittest discover -s tests`.
