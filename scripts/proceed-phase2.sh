#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Move work-order forms ==="
mkdir -p components/forms/entities/work-order
mv app/\(application\)/work-orders/forms/* components/forms/entities/work-order/
rmdir app/\(application\)/work-orders/forms
mv components/forms/entities/work-order/newWorkOrderFormSheet.tsx \
   components/forms/entities/work-order/new-work-order-form-sheet.tsx

echo "=== Rename route table files ==="
mv "app/(application)/equipment/components/table/equipmentDatatable.tsx" \
   "app/(application)/equipment/components/table/equipment-data-table.tsx"
mv "app/(application)/customer/table/customerDataTable.tsx" \
   "app/(application)/customer/table/customer-data-table.tsx"
mv "app/(application)/employees/components/employeeDataTable.tsx" \
   "app/(application)/employees/components/employee-data-table.tsx"
mv "app/(application)/work-orders/components/table/workOrderTable.tsx" \
   "app/(application)/work-orders/components/table/work-order-data-table.tsx"
mv "app/(application)/inventory/table/inventoryTable.tsx" \
   "app/(application)/inventory/table/inventory-data-table.tsx"
mv "app/(application)/invoices/table/invoicesDataTable.tsx" \
   "app/(application)/invoices/table/invoices-data-table.tsx"
mv "app/(application)/purchase-orders/table/purchaseOrderTable.tsx" \
   "app/(application)/purchase-orders/table/purchase-order-data-table.tsx"
mv "app/(application)/vendors/components/vendorTable.tsx" \
   "app/(application)/vendors/components/vendor-data-table.tsx"
mv "app/(application)/invoices/views/payments-received-dataTable.tsx" \
   "app/(application)/invoices/views/payments-received-data-table.tsx"

echo "=== Rename page-level / dashboard table files ==="
mv "app/(application)/equipment/components/equipment.page.dataTable.tsx" \
   "app/(application)/equipment/components/equipment-page-data-table.tsx" 2>/dev/null || true
mv "app/(application)/inventory/components/inventory.datatable.tsx" \
   "app/(application)/inventory/components/inventory-page-data-table.tsx" 2>/dev/null || true
mv "app/(application)/vendors/components/vendors.page.datatable.tsx" \
   "app/(application)/vendors/components/vendors-page-data-table.tsx" 2>/dev/null || true
mv "app/(application)/purchase-orders/components/purchase.order.page.dataTable.tsx" \
   "app/(application)/purchase-orders/components/purchase-order-page-data-table.tsx" 2>/dev/null || true
mv "app/(application)/dashboard/components/data-table/equipment/equipment.dataTable.tsx" \
   "app/(application)/dashboard/components/data-table/equipment/equipment-data-table.tsx"
mv "app/(application)/dashboard/components/data-table/inventory/inventory.dataTable.tsx" \
   "app/(application)/dashboard/components/data-table/inventory/inventory-data-table.tsx"
mv "app/(application)/dashboard/components/data-table/employees/employeesdue.datatable.tsx" \
   "app/(application)/dashboard/components/data-table/employees/employees-data-table.tsx"

echo "=== Done file moves ==="
