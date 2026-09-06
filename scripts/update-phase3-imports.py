#!/usr/bin/env python3
"""Update imports after phase 3 reorganization."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REPLACEMENTS = [
    ("../views/EquipmentProfile", "@/components/features/equipment/equipment-profile"),
    ("@/app/(application)/equipment/components/views/EquipmentProfile", "@/components/features/equipment/equipment-profile"),
    ("inventory.partSubstitutionTable", "part-substitution-table"),
    ("inventory.alternateUpcCodesTable", "alternate-upc-codes-table"),
    ("inventory.warehouse", "warehouse-tabs"),
]


def should_process(path: Path) -> bool:
    parts = path.parts
    return (
        path.suffix in {".ts", ".tsx"}
        and "node_modules" not in parts
        and ".next" not in parts
    )


def main() -> None:
    changed = 0
    for path in ROOT.rglob("*"):
        if not path.is_file() or not should_process(path):
            continue
        original = path.read_text(encoding="utf-8")
        updated = original
        for old, new in REPLACEMENTS:
            updated = updated.replace(old, new)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
            print(f"updated: {path.relative_to(ROOT)}")
    print(f"\nDone. Updated {changed} files.")


if __name__ == "__main__":
    main()
