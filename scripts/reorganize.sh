#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Phase 1: Remove dead files ==="
rm -f combobox-form.tsx combobox-input.tsx form-modal.tsx form-with-wrapper.tsx
rm -f components/modals.tsx
rm -f components/forms/actualForms/new-ship-to-form.tsx
rm -f lib/manage-pm-schedule-schema.ts
rm -f services/vendorService.ts
rm -f "app/(application)/equipment/components/table/equipmentDatatable copy.tsx"
rm -f "app/(application)/equipment/components/new-equipment-form copy.tsx"

echo "=== Phase 2: Reorganize lib/ ==="
mkdir -p lib/domains/{customer,employee,inventory,invoice,purchase-order,work-order,vendor,location}
mkdir -p lib/{api,providers,schemas,shared}

# Domain data
git mv lib/Customer/customer-data.ts lib/domains/customer/customer-data.ts 2>/dev/null || mv lib/Customer/customer-data.ts lib/domains/customer/customer-data.ts
git mv lib/Employee/employee-data.ts lib/domains/employee/employee-data.ts 2>/dev/null || mv lib/Employee/employee-data.ts lib/domains/employee/employee-data.ts
git mv lib/Inventory/inventory-data.ts lib/domains/inventory/inventory-data.ts 2>/dev/null || mv lib/Inventory/inventory-data.ts lib/domains/inventory/inventory-data.ts
git mv lib/inventory-data.ts lib/domains/inventory/mock-data.ts 2>/dev/null || mv lib/inventory-data.ts lib/domains/inventory/mock-data.ts
git mv lib/Invoice/invoice-data.ts lib/domains/invoice/invoice-data.ts 2>/dev/null || mv lib/Invoice/invoice-data.ts lib/domains/invoice/invoice-data.ts
git mv lib/Invoice/invoices-page-data.ts lib/domains/invoice/invoices-page-data.ts 2>/dev/null || mv lib/Invoice/invoices-page-data.ts lib/domains/invoice/invoices-page-data.ts
git mv lib/PurchaseOrder/purchaseOrder-data.ts lib/domains/purchase-order/purchaseOrder-data.ts 2>/dev/null || mv lib/PurchaseOrder/purchaseOrder-data.ts lib/domains/purchase-order/purchaseOrder-data.ts
git mv lib/WorkOrder/workOrder-data.ts lib/domains/work-order/workOrder-data.ts 2>/dev/null || mv lib/WorkOrder/workOrder-data.ts lib/domains/work-order/workOrder-data.ts
git mv lib/work-orders-data.ts lib/domains/work-order/mock-data.ts 2>/dev/null || mv lib/work-orders-data.ts lib/domains/work-order/mock-data.ts
git mv lib/vendor-data.ts lib/domains/vendor/vendor-data.ts 2>/dev/null || mv lib/vendor-data.ts lib/domains/vendor/vendor-data.ts
git mv lib/locationView-data.ts lib/domains/location/location-data.ts 2>/dev/null || mv lib/locationView-data.ts lib/domains/location/location-data.ts

rmdir lib/Customer lib/Employee lib/Inventory lib/Invoice lib/PurchaseOrder lib/WorkOrder 2>/dev/null || true

# API
git mv lib/axios.ts lib/api/axios.ts 2>/dev/null || mv lib/axios.ts lib/api/axios.ts
git mv lib/QueryProvider.tsx lib/api/query-provider.tsx 2>/dev/null || mv lib/QueryProvider.tsx lib/api/query-provider.tsx

# Providers
git mv lib/dialog-provider.tsx lib/providers/dialog-provider.tsx 2>/dev/null || mv lib/dialog-provider.tsx lib/providers/dialog-provider.tsx
git mv lib/sheet-providers.tsx lib/providers/sheet-providers.tsx 2>/dev/null || mv lib/sheet-providers.tsx lib/providers/sheet-providers.tsx
git mv lib/theme-provider.tsx lib/providers/theme-provider.tsx 2>/dev/null || mv lib/theme-provider.tsx lib/providers/theme-provider.tsx
git mv lib/providers.tsx lib/providers/app-providers.tsx 2>/dev/null || mv lib/providers.tsx lib/providers/app-providers.tsx

# Schemas
git mv lib/equipment-schema.ts lib/schemas/equipment-schema.ts 2>/dev/null || mv lib/equipment-schema.ts lib/schemas/equipment-schema.ts
git mv lib/part-kits-schema.ts lib/schemas/part-kits-schema.ts 2>/dev/null || mv lib/part-kits-schema.ts lib/schemas/part-kits-schema.ts
git mv lib/schemas/labor-schema.ts lib/schemas/labor-schema.ts 2>/dev/null || true

# Shared utilities
for f in utils format parsers data-table pdf-utils composition id application menu-list option-list confirm-dialog; do
  git mv "lib/${f}.ts" "lib/shared/${f}.ts" 2>/dev/null || mv "lib/${f}.ts" "lib/shared/${f}.ts" 2>/dev/null || true
  git mv "lib/${f}.tsx" "lib/shared/${f}.tsx" 2>/dev/null || mv "lib/${f}.tsx" "lib/shared/${f}.tsx" 2>/dev/null || true
done

echo "=== Phase 3: Reorganize components/ ==="
mkdir -p components/{layout,features,forms/{entities,fields,setup,actions/{more,quick},sheets,ui}}

# Forms: move subfolders first
git mv components/forms/wrappers/* components/forms/fields/ 2>/dev/null || mv components/forms/wrappers/* components/forms/fields/
rmdir components/forms/wrappers 2>/dev/null || true

git mv components/forms/actualForms/setupForms/* components/forms/setup/ 2>/dev/null || mv components/forms/actualForms/setupForms/* components/forms/setup/
rmdir components/forms/actualForms/setupForms 2>/dev/null || true

git mv components/forms/actualForms/moreButtonForms/* components/forms/actions/more/ 2>/dev/null || mv components/forms/actualForms/moreButtonForms/* components/forms/actions/more/
rmdir components/forms/actualForms/moreButtonForms 2>/dev/null || true

git mv components/forms/actualForms/quickActions/* components/forms/actions/quick/ 2>/dev/null || mv components/forms/actualForms/quickActions/* components/forms/actions/quick/
rmdir components/forms/actualForms/quickActions 2>/dev/null || true

git mv components/forms/actualForms/*.tsx components/forms/entities/ 2>/dev/null || mv components/forms/actualForms/*.tsx components/forms/entities/
rmdir components/forms/actualForms 2>/dev/null || true

git mv components/forms/ui/* components/forms/ui/ 2>/dev/null || true

# Features (was views)
git mv components/views components/features 2>/dev/null || mv components/views components/features

# Layout
git mv components/admin-panel components/layout/admin-panel 2>/dev/null || mv components/admin-panel components/layout/admin-panel
for f in app-sidebar shell nav-main nav-projects nav-user team-switcher mode-toggle; do
  git mv "components/${f}.tsx" "components/layout/${f}.tsx" 2>/dev/null || mv "components/${f}.tsx" "components/layout/${f}.tsx" 2>/dev/null || true
done

# Move duplicate input-wrapper into fields (keep InputWrapper as canonical)
rm -f components/input-wrapper.tsx

echo "=== Phase 4: Fix typo filenames ==="
git mv components/charts/donughtChart.tsx components/charts/donut-chart.tsx 2>/dev/null || mv components/charts/donughtChart.tsx components/charts/donut-chart.tsx
git mv components/features/shipping/shippingVieew.tsx components/features/shipping/shipping-view.tsx 2>/dev/null || mv components/features/shipping/shippingVieew.tsx components/features/shipping/shipping-view.tsx
git mv "components/features/shipping/edit-shipping-form copy.tsx" components/features/shipping/edit-shipping-form.tsx 2>/dev/null || mv "components/features/shipping/edit-shipping-form copy.tsx" components/features/shipping/edit-shipping-form.tsx
git mv components/forms/actions/quick/recievePurchaseOrder.tsx components/forms/actions/quick/receive-purchase-order.tsx 2>/dev/null || mv components/forms/actions/quick/recievePurchaseOrder.tsx components/forms/actions/quick/receive-purchase-order.tsx
git mv components/forms/actions/more/jobsiteassignment/josbsite-data.ts components/forms/actions/more/jobsiteassignment/jobsite-data.ts 2>/dev/null || mv components/forms/actions/more/jobsiteassignment/josbsite-data.ts components/forms/actions/more/jobsiteassignment/jobsite-data.ts

if [ -d components/features/managePMSheduleTemplate ]; then
  git mv components/features/managePMSheduleTemplate components/features/manage-pm-schedule-template 2>/dev/null || mv components/features/managePMSheduleTemplate components/features/manage-pm-schedule-template
fi

echo "=== Done moving files ==="
