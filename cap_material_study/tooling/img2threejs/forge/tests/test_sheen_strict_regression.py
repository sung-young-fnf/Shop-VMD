"""Valid sheen must survive both production entry points; no-op sheen must fail."""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

FORGE = Path(__file__).resolve().parents[1]
FIXTURE = Path(__file__).parent / "fixtures" / "sheen-cap.json"


class SheenStrictRegressionTests(unittest.TestCase):
    def test_valid_sheen_passes_strict_validator_and_generator(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "factory.ts"
            for script, arguments in (
                ("stage2_spec/validate_sculpt_spec.py", ["--strict-quality", "--json"]),
                ("stage3_build/generate_threejs_factory.py", ["--out", str(output)]),
            ):
                with self.subTest(script=script):
                    result = subprocess.run(
                        [sys.executable, str(FORGE / script), str(FIXTURE), *arguments],
                        capture_output=True, text=True, check=False,
                    )
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertTrue(output.exists())

    def test_noop_sheen_still_blocks_both_entry_points(self) -> None:
        for tint in (None, "#000000"):
            with self.subTest(tint=tint), tempfile.TemporaryDirectory() as directory:
                spec = json.loads(FIXTURE.read_text(encoding="utf-8"))
                material = spec["materials"][0]
                if tint is None:
                    material.pop("sheenColor", None)
                else:
                    material["sheenColor"] = tint
                path = Path(directory) / "invalid.json"
                path.write_text(json.dumps(spec), encoding="utf-8")
                output = Path(directory) / "factory.ts"
                for script, arguments in (
                    ("stage2_spec/validate_sculpt_spec.py", ["--strict-quality"]),
                    ("stage3_build/generate_threejs_factory.py", ["--out", str(output)]),
                ):
                    result = subprocess.run(
                        [sys.executable, str(FORGE / script), str(path), *arguments],
                        capture_output=True, text=True, check=False,
                    )
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("sheenColor", result.stdout + result.stderr)
                self.assertFalse(output.exists())
