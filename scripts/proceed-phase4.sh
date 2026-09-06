#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Move remaining equipment components ==="
mv "app/(application)/equipment/components/new-equipment-form.tsx" \
   "components/forms/entities/equipment/new-equipment-form.tsx"
mv "app/(application)/equipment/components/update-meters-form.tsx" \
   "components/forms/entities/equipment/update-meters-form.tsx"
mv "app/(application)/equipment/components/update-meter-table.tsx" \
   "components/features/equipment/update-meter-table.tsx"
rm -f "app/(application)/equipment/components/form-sheet.tsx"

# Remove duplicate EquipmentProfile if exists
rm -f "app/(application)/equipment/components/views/EquipmentProfile.tsx" 2>/dev/null || true
rmdir "app/(application)/equipment/components/views" 2>/dev/null || true

echo "=== Done ==="
