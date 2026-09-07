# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
# How to run: imported by gate.py; uv run gate.py --workspace PATH --gate spec
from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import TypeAlias

Json: TypeAlias = None | bool | int | float | str | list["Json"] | dict[str, "Json"]


@dataclass(frozen=True, slots=True)
class EvidenceError(ValueError):
    reason: str

    def __str__(self) -> str:
        return self.reason


@dataclass(frozen=True, slots=True)
class Field:
    value: Json
    label: str

    def item(self, key: str) -> Field:
        if not isinstance(self.value, dict) or key not in self.value:
            raise EvidenceError(f"missing field {self.label}.{key}")
        return Field(self.value[key], f"{self.label}.{key}")

    def rows(self) -> tuple[Field, ...]:
        if not isinstance(self.value, list) or not self.value:
            raise EvidenceError(f"{self.label} must be a nonempty array")
        return tuple(Field(value, f"{self.label}[{index}]") for index, value in enumerate(self.value))

    def text(self) -> str:
        if not isinstance(self.value, str) or not self.value.strip():
            raise EvidenceError(f"{self.label} must be a nonempty string")
        return self.value

    def number(self) -> float:
        if isinstance(self.value, bool) or not isinstance(self.value, (int, float)):
            raise EvidenceError(f"{self.label} must be numeric")
        if not math.isfinite(self.value) or self.value <= 0:
            raise EvidenceError(f"{self.label} must be finite and positive")
        return float(self.value)

    def integer(self) -> int:
        value = self.number()
        if not value.is_integer():
            raise EvidenceError(f"{self.label} must be an integer")
        return int(value)

    def texts(self) -> tuple[str, ...]:
        return tuple(row.text() for row in self.rows())


def read_document(path: Path) -> Field:
    return Field(json.loads(path.read_text(encoding="utf-8")), path.name)


def contained_file(workspace: Path, relative: str) -> Path:
    path = (workspace / relative).resolve()
    if Path(relative).is_absolute() or not path.is_relative_to(workspace):
        raise EvidenceError(f"evidence path escapes workspace: {relative}")
    if not path.is_file():
        raise EvidenceError(f"missing evidence file: {relative}")
    return path


def hashed_file(workspace: Path, row: Field) -> Path:
    relative = row.item("path").text()
    path = contained_file(workspace, relative)
    expected = row.item("sha256").text()
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if expected != actual:
        raise EvidenceError(f"stale evidence hash: {relative}")
    return path


def required_sources(workspace: Path) -> set[str]:
    sources = {path.relative_to(workspace).as_posix() for path in (workspace / "src").rglob("*") if path.is_file()}
    if not sources:
        raise EvidenceError("missing procedural source files under src")
    sources.update(("house-spec.json", "index.html", "package.json"))
    sources.update(name for name in ("package-lock.json", "bun.lock", "bun.lockb", "pnpm-lock.yaml") if (workspace / name).exists())
    return sources
