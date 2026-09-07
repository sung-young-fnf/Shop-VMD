# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
# How to run: uv run gate.py --workspace PATH --gate spec
import os, sys
root = os.environ.get("IMG2_HOME")
if root: sys.path.insert(0, os.path.join(root, "harness"))
else:
    try: import _img2_local; sys.path.insert(0, _img2_local.CORE)
    except ImportError: sys.exit("img2: core not linked - run `img2 sync`")
from img2_core import require_core_api
require_core_api(1)

import json
import argparse
from pathlib import Path
from typing import Literal, TypedDict

from img2_core import paths, state
from evidence import EvidenceError, read_document
from validation import validate_browser, validate_spec


class Verdict(TypedDict):
    kind: str
    version: int
    gate: str
    plugin: str
    status: Literal["pass", "fail", "error"]
    reasons: list[str]
    evidence: dict[str, str]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace", default=".")
    parser.add_argument("--gate", required=True, choices=("spec", "browser"))
    args = parser.parse_args()
    verdict: Verdict = {"kind": "img2.gate-verdict", "version": 1, "gate": f"house-{args.gate}", "plugin": "house", "status": "pass", "reasons": [], "evidence": {}}
    workspace: Path | None = None
    try:
        workspace = paths.resolve_workspace(args.workspace)
        spec = read_document(workspace / "house-spec.json")
        validate_spec(workspace, spec)
        if args.gate == "browser":
            qa = read_document(workspace / ".img2/artifacts/house/browser-qa.json")
            validate_browser(workspace, (spec, qa))
        verdict["evidence"] = {"spec": "house-spec.json", "scope": "architecture evidence only; not ObjectSculptSpec or visual likeness certification"}
    except EvidenceError as error:
        verdict["status"] = "fail"
        verdict["reasons"] = [str(error)]
    except (OSError, ValueError, RuntimeError) as error:
        verdict["status"] = "error"
        verdict["reasons"] = [str(error)]
    if workspace is not None:
        try:
            artifacts = workspace / ".img2/artifacts/house"
            artifacts.mkdir(parents=True, exist_ok=True)
            path = artifacts / f"{args.gate}-verdict.json"
            path.write_text(json.dumps(verdict, indent=2) + "\n", encoding="utf-8")
            state.update_plugin_state(workspace, "house", lambda subtree: subtree.update({args.gate: {"status": verdict["status"], "artifact": path.relative_to(workspace).as_posix()}}) or subtree)
        except (OSError, ValueError, RuntimeError) as error:
            verdict["status"] = "error"
            verdict["reasons"].append(f"cannot persist gate evidence: {error}")
    print(json.dumps(verdict))
    return {"pass": 0, "fail": 1, "error": 2}[verdict["status"]]


if __name__ == "__main__":
    sys.exit(main())
