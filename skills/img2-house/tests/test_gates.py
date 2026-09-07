# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
# How to run: uv run --no-project python -m unittest discover -s tests -v
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import struct
import subprocess
import sys
import tempfile
import unittest


class HouseGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory(prefix="img2-house-test-")
        self.addCleanup(self.temp.cleanup)
        self.ws = Path(self.temp.name)
        self.plugin = Path(__file__).resolve().parent.parent
        self.harness = Path(os.environ.get("IMG2_HOME", str(Path.home() / ".img2"))) / "harness"
        (self.ws / "src").mkdir()
        for name in ("house.jpg", "plan.jpg", "src/main.ts", "index.html", "package.json"):
            (self.ws / name).write_text("fixture", encoding="utf-8")
        self.spec = {
            "version": 1, "units": "metres",
            "coordinates": {"up": "+Y", "front": "+Z", "planTransform": "x=u/68,z=v/68"},
            "sourceManifest": [
                {"path": name, "width": 1000, "height": 800, "role": role, "sha256": self.digest(name)}
                for name, role in (("plan.jpg", "plan"), ("house.jpg", "exterior"))
            ],
            "calibration": [{"axis": axis, "annotation": "10m", "metres": 10, "pixels": 680, "pixelsPerMetre": 68} for axis in ("x", "z")],
            "rooms": [{"id": "living", "dimensionsMetres": [4, 6], "sourceDimension": "13ft x 20ft", "confidence": "measured"}],
            "expectedAssemblies": ["foundation", "roof", "interior"],
            "qualityContract": {"critical": ["gable"], "verification": ["roof-off"], "approximation": "furniture inferred", "targetTriangles": 500, "targetDrawCalls": 100},
        }
        self.write_spec()
        self.artifacts = self.ws / ".img2/artifacts/house"
        self.artifacts.mkdir(parents=True)
        captures = []
        for view in ("front", "rear", "left", "right", "overhead", "mobile"):
            name = f"{view}.png"
            (self.ws / name).write_bytes(b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", 800, 600) + b"\x08\x02\x00\x00\x00")
            captures.append({"view": view, "path": name, "sha256": self.digest(name)})
        self.qa = {
            "kind": "house.browser-qa", "version": 1,
            "sourceHashes": {name: self.digest(name) for name in ("src/main.ts", "index.html", "package.json", "house-spec.json")},
            "captures": captures,
            "checks": {name: True for name in ("webgl", "consoleClean", "finiteGeometry", "positiveBounds", "roofCutaway", "roofExplode", "roomPicking", "reset", "night", "keyboard")},
            "geometry": {"triangles": 200, "drawCalls": 30, "roomIds": ["living"], "assemblies": ["foundation", "roof", "interior"]},
        }
        self.write_qa()

    def digest(self, name: str) -> str:
        return hashlib.sha256((self.ws / name).read_bytes()).hexdigest()

    def write_spec(self) -> None:
        (self.ws / "house-spec.json").write_text(json.dumps(self.spec), encoding="utf-8")

    def write_qa(self) -> None:
        (self.artifacts / "browser-qa.json").write_text(json.dumps(self.qa), encoding="utf-8")

    def run_gates(self) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(self.harness / "img2_core/gate_runner.py"), "--plugin-dir", str(self.plugin), "--workspace", str(self.ws)],
            capture_output=True, text=True, timeout=30,
        )

    def test_pass_when_current_complete_evidence(self) -> None:
        # Given: the measured fixture and current complete browser evidence.
        # When: the real harness runs both gates.
        run = self.run_gates()
        # Then: both gates pass and ownership stays in the house subtree.
        self.assertEqual(run.returncode, 0, run.stdout + run.stderr)
        self.assertEqual([row["status"] for row in json.loads(run.stdout)["results"]], ["pass", "pass"])
        saved = json.loads((self.ws / ".img2/state.json").read_text())
        self.assertEqual(set(saved["plugins"]), {"house"})

    def test_blocks_when_qa_missing(self) -> None:
        # Given: no browser evidence was collected.
        (self.artifacts / "browser-qa.json").unlink()
        # When: the real runner evaluates gates.
        run = self.run_gates()
        # Then: missing data cannot pass.
        self.assertEqual(run.returncode, 1, run.stdout)
        self.assertEqual(json.loads(run.stdout)["results"][1]["status"], "error")

    def test_blocks_when_source_changed(self) -> None:
        # Given: code changed after capture.
        (self.ws / "src/main.ts").write_text("modified model", encoding="utf-8")
        # When: the runner checks evidence freshness.
        run = self.run_gates()
        # Then: stale evidence fails.
        self.assertEqual(run.returncode, 1)
        self.assertIn("stale", run.stdout)

    def test_blocks_when_source_added(self) -> None:
        # Given: a new source was not part of the captured build.
        (self.ws / "src/new.ts").write_text("new scene", encoding="utf-8")
        # When: the runner checks source coverage.
        run = self.run_gates()
        # Then: an omitted source blocks approval.
        self.assertEqual(run.returncode, 1)
        self.assertIn("src/new.ts", run.stdout)

    def test_stops_browser_when_dimension_invalid(self) -> None:
        # Given: a measured room has impossible width.
        self.spec["rooms"] = [{"id": "living", "dimensionsMetres": [-1, 6], "sourceDimension": "13ft x 20ft", "confidence": "measured"}]
        self.write_spec()
        # When: the spec gate runs.
        run = self.run_gates()
        # Then: the browser gate is skipped, not claimed passing.
        self.assertEqual(run.returncode, 1)
        self.assertEqual([row["status"] for row in json.loads(run.stdout)["results"]], ["fail", "skipped"])

    def test_blocks_when_interaction_failed(self) -> None:
        # Given: picking failed in the actual QA result.
        self.qa["checks"] = {name: name != "roomPicking" for name in ("webgl", "consoleClean", "finiteGeometry", "positiveBounds", "roofCutaway", "roofExplode", "roomPicking", "reset", "night", "keyboard")}
        self.write_qa()
        # When: the real runner evaluates browser evidence.
        run = self.run_gates()
        # Then: that failure blocks the workflow.
        self.assertEqual(run.returncode, 1)
        self.assertIn("roomPicking", run.stdout)

    def test_blocks_when_capture_changed(self) -> None:
        # Given: capture bytes no longer match the approved evidence.
        (self.ws / "front.png").write_bytes(b"changed")
        # When: the real runner checks the captures.
        run = self.run_gates()
        # Then: stale images fail as well as stale code.
        self.assertEqual(run.returncode, 1)
        self.assertIn("front.png", run.stdout)


if __name__ == "__main__":
    unittest.main()
