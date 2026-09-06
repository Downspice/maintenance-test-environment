#!/usr/bin/env python3
"""Update imports after phase 2 reorganization."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REPLACEMENTS = [
    # Work-order forms moved
    ("@/app/(application)/work-orders/forms/", "@/components/forms/entities/work-order/"),
    ("../../../app/(application)/work-orders/forms/", "@/components/forms/entities/work-order/"),
    ("../../forms/change-priority", "@/components/forms/entities/work-order/change-priority"),
    ("../../forms/change-assignee", "@/components/forms/entities/work-order/change-assignee"),
    ("../../forms/change-cost-center", "@/components/forms/entities/work-order/change-cost-center"),
    ("../../forms/change-status", "@/components/forms/entities/work-order/change-status"),
    ("../forms/add-parts", "@/components/forms/entities/work-order/add-parts"),
    ("../forms/add-labor", "@/components/forms/entities/work-order/add-labor"),
    ("../forms/add-notes", "@/components/forms/entities/work-order/add-notes"),
    ("./newWorkOrderFormSheet", "./new-work-order-form-sheet"),
    ("newWorkOrderFormSheet", "new-work-order-form-sheet"),
    # Meter replacement tab extracted
    (
        '@/app/(application)/equipment/components/views/EquipmentProfile',
        '@/components/features/equipment/meter-replacement-tab',
    ),
    ("MeterReplacementTab } from", "MeterReplacementTab } from"),
    # Table renames - imports
    ("./table/equipmentDatatable", "./table/equipment-data-table"),
    ("./table/customerDataTable", "./table/customer-data-table"),
    ("./components/employeeDataTable", "./components/employee-data-table"),
    ("./components/table/workOrderTable", "./components/table/work-order-data-table"),
    ("./table/inventoryTable", "./table/inventory-data-table"),
    ("./table/invoicesDataTable", "./table/invoices-data-table"),
    ("./table/purchaseOrderTable", "./table/purchase-order-data-table"),
    ("./components/vendorTable", "./components/vendor-data-table"),
    ("./view/payments-received-dataTable", "./views/payments-received-data-table"),
    ("./components/data-table/equipment/equipment.dataTable", "./components/data-table/equipment/equipment-data-table"),
    ("./components/data-table/inventory/inventory.dataTable", "./components/data-table/inventory/inventory-data-table"),
    ("./components/data-table/employees/employeesdue.datatable", "./components/data-table/employees/employees-data-table"),
    ("equipment.page.dataTable", "equipment-page-data-table"),
    ("inventory.datatable", "inventory-page-data-table"),
    ("vendors.page.datatable", "vendors-page-data-table"),
    ("purchase.order.page.dataTable", "purchase-order-page-data-table"),
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
