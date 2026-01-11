import { z } from "zod";

export const InventorySchema = z.object({
  number: z.string().min(1, "Part Number is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  unit_cost: z.string().min(1, "Unit cost is required"),
  unit_of_measure: z.string().optional(),
  upc: z.string().min(1, "UPC is required"),
  customFields: z
    .array(
      z.object({
        key: z.string(),
        id: z.string(),
      })
    )
    .optional(),

  is_enabled: z.boolean().optional(),
  inventory_trackings: z
    .array(
      z.object({
        warehouse: z.string(),
        aisle: z.string().optional(),
        row: z.string().optional(),
        bin: z.string().optional(),
        vendor: z.string().optional(),
        costCenter: z.string().optional(),
        quantity: z.coerce.number().optional(),
        reorderPoint: z.coerce.number().optional(),
        reorderQty: z.coerce.number().optional(),
        maxQty: z.coerce.number().optional(),
        leadTime: z.coerce.number().optional(),
        movementType: z.enum(["FIFO", "LIFO"]),
      })
    )
    .optional(),

  markUp: z.enum(["none", "percent", "value", "manual"]),
  percentMarkup: z.coerce.number().optional(),
  markupid: z.coerce.number().optional(),
  markupPrice: z.coerce.number().optional(),

  days: z.coerce.number().optional(),
  primary: z.coerce.number().optional(),
  secondary: z.coerce.number().optional(),
  notes: z.string().optional(),

  inventory_substitutions: z
    .array(
      z.object({
        partNumber: z.string().min(1, "Part# is required"),
        name: z.string(),
        manufacturer: z.string(),
        description: z.string(),
      })
    )
    .optional(),

  upc_codes: z
    .array(
      z.object({
        manufacturer: z.string().min(1, "Manufacturer is required"),
        vendor: z.string().min(1, "Vendor is required"),
        upc: z.string().min(1, "UPC is required"),
      })
    )
    .optional(),

  Photos: z.any().optional(),
  Attachments: z.any().optional(),


});

export interface InventoryByIdInterface {
  id: string
  part_number: string
  name: string
  description: string
  manufacturer_id: string
  category_id: string
  currency: string
  unit_cost: string
  unit_of_measure: string
  upc: string
  markup_type_id: string
  markup_id: string
  days: number
  primary: number
  secondary: number
  notes: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
  category: Category
  unit_type: UnitType
  manufacturer: Manufacturer
  inventory_trackings: InventoryTracking[]
  others: Other[]
  markup_type: MarkupType
  inventory_substitutions: InventorySubstitution[]
  upc_codes: UpcCode[]
  attachments: any[]
}

export interface Category {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface UnitType {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Manufacturer {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface InventoryTracking {
  id: string
  inventory_id: string
  warehouse_id: string
  is_enabled: boolean
  aisle: string
  row: string
  bin: string
  vendor_id: string
  cost_center_id: string
  quantity: string
  recorder_point: string
  recorder_quantity: string
  max_quantity: string
  lead_time: string
  tracking_type_id: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Other {
  id: string
  inventory_id: string
  name: string
  id: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface MarkupType {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface InventorySubstitution {
  id: string
  inventory_id: string
  part_number: string
  name: string
  manufacturer_id: any
  description: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface UpcCode {
  id: string
  inventory_id: string
  manufacturer_id: string
  vendor_id: string
  upc: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface InventoryInterface {
  id: string
  part_number: string
  name: string
  description: string
  manufacturer_id: string
  category_id: string
  currency: string
  unit_cost: string
  unit_of_measure: string
  upc: string
  markup_type_id: string
  markup_id: string
  days: number
  primary: number
  secondary: number
  notes: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

 

export const StockAdjustmentHistory = [
  {
    date: "2025-07-10",
    qtyRemain: 80,
    qtyReceived: 20,
    unit: "pcs",
    receiptType: "Manual Adjustment",
    vendor: "GlobalTech Supplies",
    warehouse: "Main Warehouse",
    reason: "Inventory recount correction",
  },
  {
    date: "2025-06-28",
    qtyRemain: 120,
    qtyReceived: -15,
    unit: "pcs",
    receiptType: "Damage Removal",
    vendor: "TechSource Ltd.",
    warehouse: "Secondary Warehouse",
    reason: "Damaged items discarded",
  },
];
export const stockColumns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "qtyRemain", header: "Qty Remain" },
  { accessorKey: "qtyReceived", header: "Qty Received" },
  { accessorKey: "unit", header: "Unit" },
  { accessorKey: "receiptType", header: "Receipt Type" },
  { accessorKey: "vendor", header: "Vendor" },
  { accessorKey: "warehouse", header: "Warehouse" },
  { accessorKey: "reason", header: "Reason" },
];

export const UsageHistory = [
  {
    date: "2025-07-09",
    source: "Main Warehouse",
    equipment: "Generator A1",
    used: 5,
    cost: 12.5,
    total: 62.5,
    costCentre: "Operations",
  },
  {
    date: "2025-07-05",
    source: "Secondary Warehouse",
    equipment: "Air Conditioner Unit B",
    used: 2,
    cost: 45,
    total: 90,
    costCentre: "Facilities",
  },
];
export const usageColumns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "source", header: "Source" },
  { accessorKey: "equipment", header: "Equipment" },
  { accessorKey: "used", header: "Used" },
  { accessorKey: "cost", header: "Unit Cost" },
  { accessorKey: "total", header: "Total" },
  { accessorKey: "costCentre", header: "Cost Centre" },
];

export const PurchasesHistory = [
  {
    dateReceived: "2025-07-01",
    quantity: 50,
    vendor: "PartsCo International",
    receivedTo: "Main Warehouse",
    price: 18.75,
  },
  {
    dateReceived: "2025-06-15",
    quantity: 30,
    vendor: "Alpha Vendors",
    receivedTo: "Overflow Storage",
    price: 21.5,
  },
];
export const purchaseColumns = [
  { accessorKey: "dateReceived", header: "Date Received" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "vendor", header: "Vendor" },
  { accessorKey: "receivedTo", header: "Received To" },
  { accessorKey: "price", header: "Price" },
];

export interface InventoryTableInterface{
id: string
  part_number: string
  name: string
  description: string
  manufacturer_id: string
  category_id: string
  currency: string
  unit_cost: string
  unit_of_measure: string
  upc: string
  markup_type_id: string
  markup_id: string
  days: number
  primary: number
  secondary: number
  notes: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
  is_enabled: boolean
  category: Category
  unit_type: UnitType
  manufacturer: Manufacturer
  inventory_trackings: InventoryTracking[]
  others: Other[]
  markup_type: MarkupType
  inventory_substitutions: InventorySubstitution[]
  upc_codes: UpcCode[]
  attachments: any[]
}

export interface Category {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface UnitType {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Manufacturer {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface InventoryTracking {
  id: string
  inventory_id: string
  warehouse_id: string
  is_enabled: boolean
  aisle: string
  row: string
  bin: string
  vendor_id: string
  cost_center_id: string
  quantity: string
  recorder_point: string
  recorder_quantity: string
  max_quantity: string
  lead_time: string
  tracking_type_id: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Other {
  id: string
  inventory_id: string
  name: string
  id: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface MarkupType {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface InventorySubstitution {
  id: string
  inventory_id: string
  part_number: string
  name: string
  manufacturer_id: any
  description: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface UpcCode {
  id: string
  inventory_id: string
  manufacturer_id: string
  vendor_id: string
  upc: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}
