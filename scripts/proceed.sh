#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Normalize route folders ==="
mv "app/(application)/inventory/component" "app/(application)/inventory/components"
mv "app/(application)/inventory/view" "app/(application)/inventory/views"
mv "app/(application)/inventory/form" "app/(application)/inventory/forms"
mv "app/(application)/invoices/view" "app/(application)/invoices/views"
mv "app/(application)/vendors/view" "app/(application)/vendors/views"
mv "app/(application)/work-orders/view" "app/(application)/work-orders/views"
mv "app/(application)/purchase-orders/component" "app/(application)/purchase-orders/components" 2>/dev/null || true
mv "app/(application)/calendars/component" "app/(application)/calendars/components"

echo "=== Move equipment forms ==="
mkdir -p components/forms/entities/equipment
mv app/\(application\)/equipment/components/forms/* components/forms/entities/equipment/
rmdir app/\(application\)/equipment/components/forms

echo "=== Remove stale duplicate folders ==="
rm -rf components/views components/forms/actualForms

echo "=== Done file moves ==="
