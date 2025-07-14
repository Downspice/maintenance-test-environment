import { z } from "zod";

export const InventorySchema = z.object({
  number: z.string().min(1, "Part Number is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  unitCost: z.string().min(1, "Unit cost is required"),
  unit: z.string().optional(),
  upc: z.string().min(1, "UPC is required"),
  customFields: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),

  enableTracking: z.boolean().optional(),
  warehouses: z
    .array(
      z.object({
        warehouse: z.string(),
        aisle: z.string().optional(),
        row: z.string().optional(),
        bin: z.string().optional(),
        vendor: z.string().optional(),
        costCenter: z.string().optional(),
        quantity: z.number().optional(),
        reorderPoint: z.number().optional(),
        reorderQty: z.number().optional(),
        maxQty: z.number().optional(),
        leadTime: z.number().optional(),
        movementType: z.enum(["FIFO", "LIFO"]),
      })
    )
    .optional(),

  markUp: z.enum(["none", "percent", "value", "manual"]),
  percentMarkup: z.number().optional(),
  markupValue: z.number().optional(),
  markupPrice: z.number().optional(),

  days: z.coerce.number().optional(),
  primary: z.coerce.number().optional(),
  secondary: z.coerce.number().optional(),
  notes: z.string().optional(),

  partSubstitutions: z
    .array(
      z.object({
        partNumber: z.string().min(1, "Part# is required"),
        name: z.string(),
        manufacturer: z.string(),
        description: z.string(),
      })
    )
    .optional(),

  alternateUpcCodes: z
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

  // Optional vendor + warehouse array fields (commented in JSX)
  // vendors: z.array(
  //   z.object({
  //     vendor: z.string().optional(),
  //     manufacturer: z.string().optional(),
  //     vendorNumber: z.string().optional(),
  //     barcode: z.string().optional(),
  //     warehouses: z.array(z.string()).optional(),
  //   })
  // ).optional(),

  // warehouses: z.array(
  //   z.object({
  //     warehouse: z.string().optional(),
  //     bin: z.string().optional(),
  //     quantity: z.coerce.number().optional(),
  //     lowStockLevel: z.coerce.number().optional(),
  //     reorderQuantity: z.coerce.number().optional(),
  //     maximumQuantity: z.coerce.number().optional(),
  //   })
  // ).optional(),
});

export type InventoryInterface = z.infer<typeof InventorySchema>;

export const InventoryData:InventoryInterface[] = [
  {
    number: "PRT-00234",
    name: "Compressor Valve",
    description: "Valve for compressor regulation",
    manufacturer: "GE",
    category: "Compressors",
    unitCost: "320.00",
    unit: "unit",
    upc: "111111111111",
    customFields: [
      { key: "Weight", value: "12kg" },
      { key: "Material", value: "Steel" },
    ],
    enableTracking: true,
    warehouses: [
      {
        warehouse: "Warehouse-A",
        aisle: "A1",
        row: "3",
        bin: "12B",
        vendor: "Universal Supplies",
        costCenter: "Ops",
        quantity: 100,
        reorderPoint: 30,
        reorderQty: 50,
        maxQty: 200,
        leadTime: 7,
        movementType: "FIFO",
      },
      {
        warehouse: "Warehouse-B",
        aisle: "B2",
        row: "4",
        bin: "8C",
        vendor: "MegaVendor Inc.",
        costCenter: "Maintenance",
        quantity: 75,
        reorderPoint: 20,
        reorderQty: 40,
        maxQty: 150,
        leadTime: 10,
        movementType: "LIFO",
      },
    ],
    markUp: "percent",
    percentMarkup: 10,
  },
  {
    number: "PRT-00345",
    name: "Engine Filter",
    description: "Air filter for diesel engines",
    manufacturer: "Bosch",
    category: "Filters",
    unitCost: "45.50",
    unit: "box",
    upc: "222222222222",
    enableTracking: false,
    markUp: "none",
  },
  {
    number: "PRT-00456",
    name: "Pump Kit",
    description: "Pump repair kit including seals",
    manufacturer: "Karcher",
    category: "Pumps",
    unitCost: "89.00",
    unit: "kit",
    upc: "333333333333",
    customFields: [{ key: "Kit Size", value: "Medium" }],
    enableTracking: true,
    warehouses: [
      {
        warehouse: "Warehouse-B",
        aisle: "B2",
        row: "4",
        bin: "8C",
        vendor: "MegaVendor Inc.",
        costCenter: "Maintenance",
        quantity: 75,
        reorderPoint: 20,
        reorderQty: 40,
        maxQty: 150,
        leadTime: 10,
        movementType: "LIFO",
      },
    ],
    markUp: "value",
    markupValue: 12,
  },
  {
    number: "PRT-00567",
    name: "Drive Belt",
    description: "Belt used in high-performance motors",
    manufacturer: "Continental",
    category: "Belts",
    unitCost: "22.00",
    unit: "piece",
    upc: "444444444444",
    enableTracking: false,
    markUp: "manual",
    markupPrice: 30,
  },
  {
    number: "PRT-00678",
    name: "Sensor Module",
    description: "Temperature sensor with housing",
    manufacturer: "Honeywell",
    category: "Sensors",
    unitCost: "55.00",
    unit: "module",
    upc: "555555555555",
    enableTracking: true,
    warehouses: [
      {
        warehouse: "Warehouse-A",
        aisle: "A1",
        row: "3",
        bin: "12B",
        vendor: "Universal Supplies",
        costCenter: "Ops",
        quantity: 100,
        reorderPoint: 30,
        reorderQty: 50,
        maxQty: 200,
        leadTime: 7,
        movementType: "FIFO",
      },
      {
        warehouse: "Warehouse-B",
        aisle: "B2",
        row: "4",
        bin: "8C",
        vendor: "MegaVendor Inc.",
        costCenter: "Maintenance",
        quantity: 75,
        reorderPoint: 20,
        reorderQty: 40,
        maxQty: 150,
        leadTime: 10,
        movementType: "LIFO",
      },
    ],
    markUp: "percent",
    percentMarkup: 8,
  },
  {
    number: "PRT-00789",
    name: "Control Relay",
    description: "Relay for industrial control panels",
    manufacturer: "ABB",
    category: "Relays",
    unitCost: "60.00",
    unit: "pack",
    upc: "666666666666",
    customFields: [{ key: "Voltage", value: "24V" }],
    markUp: "value",
    markupValue: 5,
  },
  {
    number: "PRT-00890",
    name: "LED Indicator",
    description: "Panel-mount green LED indicator",
    manufacturer: "Philips",
    category: "Electronics",
    unitCost: "7.50",
    unit: "unit",
    upc: "777777777777",
    enableTracking: true,
    warehouses: [
      {
        warehouse: "Warehouse-A",
        aisle: "A1",
        row: "3",
        bin: "12B",
        vendor: "Universal Supplies",
        costCenter: "Ops",
        quantity: 100,
        reorderPoint: 30,
        reorderQty: 50,
        maxQty: 200,
        leadTime: 7,
        movementType: "FIFO",
      },
    ],
    markUp: "manual",
    markupPrice: 10.5,
  },
];

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
