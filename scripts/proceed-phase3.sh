#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

EQUIP_VIEWS="app/(application)/equipment/components/views"
FEAT_EQUIP="components/features/equipment"

echo "=== Move equipment views to features/equipment ==="
mkdir -p "$FEAT_EQUIP/profile-tables"

mv "$EQUIP_VIEWS/EquipmentProfile.tsx" "$FEAT_EQUIP/equipment-profile.tsx"
mv "$EQUIP_VIEWS/EditEquipment.tsx" "$FEAT_EQUIP/edit-equipment.tsx"
mv "$EQUIP_VIEWS/equipmentRenewal.tsx" "$FEAT_EQUIP/equipment-renewal.tsx"
mv "$EQUIP_VIEWS/summary.tsx" "$FEAT_EQUIP/summary.tsx"
mv "$EQUIP_VIEWS/profileTables/Maintenance.tsx" "$FEAT_EQUIP/profile-tables/maintenance.tsx"

rmdir "$EQUIP_VIEWS/profileTables" 2>/dev/null || true
rmdir "$EQUIP_VIEWS" 2>/dev/null || true

echo "=== Rename inventory table components ==="
mv "app/(application)/inventory/components/inventory.partSubstitutionTable.tsx" \
   "app/(application)/inventory/components/part-substitution-table.tsx"
mv "app/(application)/inventory/components/inventory.alternateUpcCodesTable.tsx" \
   "app/(application)/inventory/components/alternate-upc-codes-table.tsx"
mv "app/(application)/inventory/components/inventory.warehouse.tsx" \
   "app/(application)/inventory/components/warehouse-tabs.tsx"

echo "=== Remove stale duplicate views folder ==="
rm -rf components/views components/forms/actualForms 2>/dev/null || true

echo "=== Done ==="
