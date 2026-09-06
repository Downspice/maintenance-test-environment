#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REPLACEMENTS = [
    ("@/app/(application)/equipment/components/new-equipment-form", "@/components/forms/entities/equipment/new-equipment-form"),
    ("@/app/(application)/equipment/components/update-meters-form", "@/components/forms/entities/equipment/update-meters-form"),
    ("@/app/(application)/equipment/components/update-meter-table", "@/components/features/equipment/update-meter-table"),
    ("./components/new-equipment-form", "@/components/forms/entities/equipment/new-equipment-form"),
    ("./components/update-meters-form", "@/components/forms/entities/equipment/update-meters-form"),
    (
        '@/components/features/equipment/equipment-profile',
        '@/components/features/equipment',
    ),
]

def main():
    changed = 0
    for path in ROOT.rglob("*"):
        if path.suffix not in {".ts", ".tsx"} or "node_modules" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        updated = text
        for old, new in REPLACEMENTS:
            updated = updated.replace(old, new)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            changed += 1
            print(f"updated: {path.relative_to(ROOT)}")
    print(f"Done. {changed} files.")

if __name__ == "__main__":
    main()
