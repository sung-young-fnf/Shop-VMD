# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
# How to run: imported by gate.py; uv run gate.py --workspace PATH --gate browser
from __future__ import annotations

from pathlib import Path
import struct

from evidence import EvidenceError, Field, hashed_file, required_sources


def validate_spec(workspace: Path, spec: Field) -> None:
    if spec.item("version").integer() != 1 or spec.item("units").text() != "metres":
        raise EvidenceError("house spec requires version 1 and metre units")
    coordinates = spec.item("coordinates")
    if coordinates.item("up").text() != "+Y" or coordinates.item("front").text() != "+Z":
        raise EvidenceError("house coordinates require Y-up and +Z front")
    coordinates.item("planTransform").text()
    roles: set[str] = set()
    for row in spec.item("sourceManifest").rows():
        hashed_file(workspace, row)
        row.item("width").integer()
        row.item("height").integer()
        roles.add(row.item("role").text())
    if not {"plan", "exterior"}.issubset(roles):
        raise EvidenceError("sourceManifest needs plan and exterior evidence roles")
    axes: set[str] = set()
    for row in spec.item("calibration").rows():
        axes.add(row.item("axis").text())
        row.item("annotation").text()
        measured = row.item("pixels").number() / row.item("metres").number()
        declared = row.item("pixelsPerMetre").number()
        if abs(measured / declared - 1) > 0.02:
            raise EvidenceError("calibration ratio differs from declared scale by more than 2%")
    if not {"x", "z"}.issubset(axes):
        raise EvidenceError("calibration needs both x and z axes")
    room_ids: list[str] = []
    for room in spec.item("rooms").rows():
        room_ids.append(room.item("id").text())
        dimensions = room.item("dimensionsMetres").rows()
        if len(dimensions) != 2:
            raise EvidenceError("room dimensionsMetres needs width and depth")
        for dimension in dimensions:
            dimension.number()
        room.item("sourceDimension").text()
        if room.item("confidence").text() not in {"measured", "inferred"}:
            raise EvidenceError("room confidence must distinguish measured from inferred")
    if len(set(room_ids)) != len(room_ids):
        raise EvidenceError("duplicate room IDs")
    assemblies = spec.item("expectedAssemblies").texts()
    if len(assemblies) < 3 or len(assemblies) != len(set(assemblies)):
        raise EvidenceError("expectedAssemblies requires at least three unique group names")
    quality = spec.item("qualityContract")
    quality.item("critical").texts()
    quality.item("verification").texts()
    quality.item("approximation").text()
    quality.item("targetTriangles").integer()
    quality.item("targetDrawCalls").integer()


def validate_browser(workspace: Path, documents: tuple[Field, Field]) -> None:
    spec, qa = documents
    if qa.item("kind").text() != "house.browser-qa" or qa.item("version").integer() != 1:
        raise EvidenceError("browser evidence requires house.browser-qa version 1")
    hashes = qa.item("sourceHashes")
    if not isinstance(hashes.value, dict):
        raise EvidenceError("sourceHashes must be a path-to-SHA256 object")
    missing = required_sources(workspace) - hashes.value.keys()
    if missing:
        raise EvidenceError(f"QA source coverage missing: {', '.join(sorted(missing))}")
    for name in hashes.value:
        digest = hashes.item(name).text()
        hashed_file(workspace, Field({"path": name, "sha256": digest}, "sourceHashes"))
    views: set[str] = set()
    capture_paths: set[Path] = set()
    for capture in qa.item("captures").rows():
        view = capture.item("view").text()
        path = hashed_file(workspace, capture)
        if view in views or path in capture_paths:
            raise EvidenceError("each capture needs a distinct view and PNG path")
        views.add(view)
        capture_paths.add(path)
        with path.open("rb") as stream:
            header = stream.read(24)
        if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
            raise EvidenceError(f"capture is not a PNG: {path.name}")
        if min(struct.unpack(">II", header[16:24])) < 240:
            raise EvidenceError(f"capture too small for review: {path.name}")
    missing_views = {"front", "rear", "left", "right", "overhead", "mobile"} - views
    if missing_views:
        raise EvidenceError(f"missing capture views: {', '.join(sorted(missing_views))}")
    checks = qa.item("checks")
    for name in ("webgl", "consoleClean", "finiteGeometry", "positiveBounds", "roofCutaway", "roofExplode", "roomPicking", "reset", "night", "keyboard"):
        if checks.item(name).value is not True:
            raise EvidenceError(f"browser check did not pass: {name}")
    geometry = qa.item("geometry")
    for actual, limit in (("triangles", "targetTriangles"), ("drawCalls", "targetDrawCalls")):
        if geometry.item(actual).integer() > spec.item("qualityContract").item(limit).integer():
            raise EvidenceError(f"rendered {actual} exceeds spec budget")
    expected_rooms = {row.item("id").text() for row in spec.item("rooms").rows()}
    if not expected_rooms.issubset(geometry.item("roomIds").texts()):
        raise EvidenceError("rendered room IDs do not cover the house spec")
    if not set(spec.item("expectedAssemblies").texts()).issubset(geometry.item("assemblies").texts()):
        raise EvidenceError("rendered semantic assemblies do not cover the house spec")
