#!/usr/bin/env python3
"""Split @/services/setups/vendor imports across vendor, customer, and lookups."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CUSTOMER_HOOKS = {
    "useGetCustomers",
    "useGetCustomersPaginated",
    "useGetCustomer",
    "useGetCustomerDiscounts",
    "useGetSettings",
    "useAddCustomer",
    "useUpdateCustomer",
    "useDeleteCustomer",
    "usePatchCustomerIsActive",
    "useAddCustomerDiscount",
    "useUpdateCustomerDiscount",
    "useDeleteCustomerDiscount",
    "useAddSetting",
    "useDeleteSetting",
}

LOOKUP_HOOKS = {
    "useGetVendorTypes",
    "useGetLocations",
    "useGetPurchaseOrderTerms",
    "useGetStatusOnes",
    "useAddVendorType",
    "useUpdateVendorType",
    "useDeleteVendorType",
    "useAddLocation",
    "useUpdateLocation",
    "useDeleteLocation",
    "useAddPurchaseOrderTerm",
    "useUpdatePurchaseOrderTerm",
    "useDeletePurchaseOrderTerm",
    "useAddStatusOne",
    "useUpdateStatusOne",
    "useDeleteStatusOne",
}

VENDOR_HOOKS = {
    "useGetVendors",
    "useGetVendorsPaginated",
    "useGetVendorOptions",
    "useGetVendor",
    "useAddVendor",
    "useUpdateVendor",
    "useDeleteVendor",
    "usePatchVendorIsActive",
    "useAddVendorAttachment",
    "useDeleteVendorAttachment",
    "useAddVendorContact",
    "useUpdateVendorContact",
}

IMPORT_RE = re.compile(
    r'import\s+\{([^}]+)\}\s+from\s+["\']@/services/setups/vendor["\'];?',
    re.MULTILINE,
)

PATH_REPLACEMENTS = [
    ("@/app/(application)/inventory/component/", "@/app/(application)/inventory/components/"),
    ("@/app/(application)/inventory/view/", "@/app/(application)/inventory/views/"),
    ("@/app/(application)/inventory/form/", "@/app/(application)/inventory/forms/"),
    ("@/app/(application)/invoices/view/", "@/app/(application)/invoices/views/"),
    ("@/app/(application)/vendors/view/", "@/app/(application)/vendors/views/"),
    ("@/app/(application)/work-orders/view/", "@/app/(application)/work-orders/views/"),
    ("@/app/(application)/purchase-orders/component/", "@/app/(application)/purchase-orders/components/"),
    ("@/app/(application)/calendars/component/", "@/app/(application)/calendars/components/"),
    ("../view/", "../views/"),
    ("../form/", "../forms/"),
    ("./view/", "./views/"),
    ("../../view/", "../../views/"),
    ("../forms/FuelTransactionForm", "@/components/forms/entities/equipment/FuelTransactionForm"),
    ("../forms/AssignEquipment", "@/components/forms/entities/equipment/AssignEquipment"),
    ("../forms/FluidConsumed", "@/components/forms/entities/equipment/FluidConsumed"),
    ("../forms/MeterReplacement", "@/components/forms/entities/equipment/MeterReplacement"),
    ('from "../forms/equipmentPMServiceform"', 'from "@/components/forms/entities/equipment/equipmentPMServiceform"'),
    ('from "../forms/FuelTransactionForm"', 'from "@/components/forms/entities/equipment/FuelTransactionForm"'),
    ('from "../forms/AssignEquipment"', 'from "@/components/forms/entities/equipment/AssignEquipment"'),
    ('from "../forms/FluidConsumed"', 'from "@/components/forms/entities/equipment/FluidConsumed"'),
    ('from "../forms/MeterReplacement"', 'from "@/components/forms/entities/equipment/MeterReplacement"'),
]


def parse_hooks(raw: str) -> list[str]:
    return [part.strip() for part in raw.split(",") if part.strip()]


def build_imports(hooks: list[str]) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {
        "vendor": [],
        "customer": [],
        "lookups": [],
    }
    for hook in hooks:
        if hook in CUSTOMER_HOOKS:
            grouped["customer"].append(hook)
        elif hook in LOOKUP_HOOKS:
            grouped["lookups"].append(hook)
        elif hook in VENDOR_HOOKS:
            grouped["vendor"].append(hook)
        else:
            grouped["vendor"].append(hook)
    return grouped


def format_import(module: str, hooks: list[str]) -> str:
    joined = ",\n  ".join(hooks)
    return f'import {{\n  {joined},\n}} from "@/services/setups/{module}";'


def rewrite_vendor_imports(content: str) -> str:
    def replacer(match: re.Match[str]) -> str:
        hooks = parse_hooks(match.group(1))
        grouped = build_imports(hooks)
        blocks: list[str] = []
        for module in ("lookups", "customer", "vendor"):
            if grouped[module]:
                blocks.append(format_import(module, grouped[module]))
        return "\n".join(blocks)

    return IMPORT_RE.sub(replacer, content)


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
        updated = rewrite_vendor_imports(original)
        for old, new in PATH_REPLACEMENTS:
            updated = updated.replace(old, new)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
            print(f"updated: {path.relative_to(ROOT)}")
    print(f"\nDone. Updated {changed} files.")


if __name__ == "__main__":
    main()
