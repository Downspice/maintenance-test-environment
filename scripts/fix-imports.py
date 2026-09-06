#!/usr/bin/env python3
"""Fix incorrect relative imports from bulk update."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FIXES = [
    # Route-local views were wrongly mapped to components/features
    ("app/(application)/customer/table/customerDataTable.tsx", "../../features/edit-customer", "../views/edit-customer"),
    ("app/(application)/equipment/components/table/equipmentDatatable.tsx", "../../features/EquipmentProfile", "../views/EquipmentProfile"),
    ("app/(application)/purchase-orders/table/purchaseOrderTable.tsx", "../../features/edit-purchaseOrder", "../views/edit-purchaseOrder"),
    ("app/(application)/purchase-orders/table/purchaseOrderTable.tsx", "../../features/receive-purchase", "../views/receive-purchase"),
    ("app/(application)/employees/components/employeeDataTable.tsx", "../../features/editEmployeeSheet", "../views/editEmployeeSheet"),
]

GLOBAL_REPLACEMENTS = [
    # Top-level feature toolbar files: ui lives at ../ui
    ("components/features/", 'from "../../ui/', 'from "../ui/'),
    # Form action quick imports: fields folder
    ("../../wrappers/", "../../fields/"),
    ("../wrappers/", "../fields/"),
]


def main() -> None:
    changed = 0

    for rel_path, old, new in FIXES:
        path = ROOT / rel_path
        if not path.exists():
            print(f"skip missing: {rel_path}")
            continue
        text = path.read_text(encoding="utf-8")
        if old in text:
            path.write_text(text.replace(old, new), encoding="utf-8")
            changed += 1
            print(f"fixed route view: {rel_path}")

    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in {".ts", ".tsx"}:
            continue
        rel = str(path.relative_to(ROOT))
        if "node_modules" in rel or ".next" in rel:
            continue

        original = path.read_text(encoding="utf-8")
        updated = original

        if rel.startswith("components/features/") and "/features/" not in rel[len("components/features/"):]:
            # Only top-level feature files (not features/shipping/ etc.)
            if rel.count("/") == 2:  # components/features/file.tsx
                updated = updated.replace('from "../../ui/', 'from "../ui/')

        updated = updated.replace("../../wrappers/", "../../fields/")
        updated = updated.replace("../wrappers/", "../fields/")

        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"\nDone. Fixed {changed} files.")
