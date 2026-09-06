#!/usr/bin/env python3
"""Update import paths after codebase reorganization."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Order matters: longer / more specific patterns first.
REPLACEMENTS = [
    # Broken typo import
    ("@/lib/purcahse-order-data", "@/lib/domains/purchase-order/purchaseOrder-data"),
    # lib domains
    ("@/lib/Customer/customer-data", "@/lib/domains/customer/customer-data"),
    ("@/lib/Employee/employee-data", "@/lib/domains/employee/employee-data"),
    ("@/lib/Inventory/inventory-data", "@/lib/domains/inventory/inventory-data"),
    ("@/lib/inventory-data", "@/lib/domains/inventory/mock-data"),
    ("@/lib/Invoice/invoice-data", "@/lib/domains/invoice/invoice-data"),
    ("@/lib/Invoice/invoices-page-data", "@/lib/domains/invoice/invoices-page-data"),
    ("@/lib/PurchaseOrder/purchaseOrder-data", "@/lib/domains/purchase-order/purchaseOrder-data"),
    ("@/lib/WorkOrder/workOrder-data", "@/lib/domains/work-order/workOrder-data"),
    ("@/lib/work-orders-data", "@/lib/domains/work-order/mock-data"),
    ("@/lib/vendor-data", "@/lib/domains/vendor/vendor-data"),
    ("@/lib/locationView-data", "@/lib/domains/location/location-data"),
    # lib api & providers (specific before generic)
    ("@/lib/QueryProvider", "@/lib/api/query-provider"),
    ("@/lib/axios", "@/lib/api/axios"),
    ("@/lib/dialog-provider", "@/lib/providers/dialog-provider"),
    ("@/lib/sheet-providers", "@/lib/providers/sheet-providers"),
    ('from "@/lib/providers"', 'from "@/lib/providers/app-providers"'),
    ("@/lib/theme-provider", "@/lib/providers/theme-provider"),
    # lib schemas
    ("@/lib/equipment-schema", "@/lib/schemas/equipment-schema"),
    ("@/lib/part-kits-schema", "@/lib/schemas/part-kits-schema"),
    # lib shared
    ("@/lib/confirm-dialog", "@/lib/shared/confirm-dialog"),
    ("@/lib/data-table", "@/lib/shared/data-table"),
    ("@/lib/option-list", "@/lib/shared/option-list"),
    ("@/lib/menu-list", "@/lib/shared/menu-list"),
    ("@/lib/pdf-utils", "@/lib/shared/pdf-utils"),
    ("@/lib/composition", "@/lib/shared/composition"),
    ("@/lib/application", "@/lib/shared/application"),
    ("@/lib/parsers", "@/lib/shared/parsers"),
    ("@/lib/format", "@/lib/shared/format"),
    ("@/lib/utils", "@/lib/shared/utils"),
    # components forms (specific subpaths before generic)
    ("@/components/forms/actualForms/setupForms/", "@/components/forms/setup/"),
    ("@/components/forms/actualForms/moreButtonForms/", "@/components/forms/actions/more/"),
    ("@/components/forms/actualForms/quickActions/", "@/components/forms/actions/quick/"),
    ("@/components/forms/actualForms/", "@/components/forms/entities/"),
    ("@/components/forms/wrappers/", "@/components/forms/fields/"),
    ("../forms/actualForms/setupForms/", "../forms/setup/"),
    ("../forms/actualForms/moreButtonForms/", "../forms/actions/more/"),
    ("../forms/actualForms/quickActions/", "../forms/actions/quick/"),
    ("../forms/actualForms/", "../forms/entities/"),
    ("../forms/wrappers/", "../forms/fields/"),
    ("../../forms/actualForms/setupForms/", "../../forms/setup/"),
    ("../../forms/actualForms/moreButtonForms/", "../../forms/actions/more/"),
    ("../../forms/actualForms/quickActions/", "../../forms/actions/quick/"),
    ("../../forms/actualForms/", "../../forms/entities/"),
    ("../../forms/wrappers/", "../../forms/fields/"),
    ("../actualForms/setupForms/", "../setup/"),
    ("../actualForms/moreButtonForms/", "../actions/more/"),
    ("../actualForms/quickActions/", "../actions/quick/"),
    ("../actualForms/", "../entities/"),
    # components features & layout
    ("@/components/views/", "@/components/features/"),
    ("@/components/admin-panel/", "@/components/layout/admin-panel/"),
    ("@/components/app-sidebar", "@/components/layout/app-sidebar"),
    ("@/components/shell", "@/components/layout/shell"),
    ("@/components/nav-main", "@/components/layout/nav-main"),
    ("@/components/nav-user", "@/components/layout/nav-user"),
    ("@/components/team-switcher", "@/components/layout/team-switcher"),
    ("@/components/mode-toggle", "@/components/layout/mode-toggle"),
    ("@/components/input-wrapper", "@/components/forms/fields/InputWrapper"),
    # layout admin-panel relative imports
    ('from "../views/', 'from "../../features/'),
    ('from "../ui/', 'from "../../ui/'),
    ('from "../admin-panel/', 'from "./'),
    # charts typo
    ("@/components/charts/donughtChart", "@/components/charts/donut-chart"),
    ("donughtChart", "donut-chart"),
    ("shippingVieew", "shipping-view"),
    ("recievePurchaseOrder", "receive-purchase-order"),
    ("josbsite-data", "jobsite-data"),
    ("managePMSheduleTemplate", "manage-pm-schedule-template"),
    ("edit-shipping-form copy", "edit-shipping-form"),
]


def should_process(path: Path) -> bool:
    parts = path.parts
    if "node_modules" in parts or ".next" in parts or ".git" in parts:
        return False
    return path.suffix in {".ts", ".tsx"}


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
