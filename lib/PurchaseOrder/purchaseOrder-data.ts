import z from "zod";

export const PurchaseOrderItemSchema = z.object({
  itemType: z.string().min(1, "Item type is required"),
  partNumber: z.string().min(1, "Part number is required"),
  warehouse: z.string().optional(),
  warranty: z.string().optional(),
  orderQuantity: z.coerce.number().min(1, "Order quantity is required"),
  receivedQuantity: z.coerce.number().optional(),
  newReceivedQuantity: z.coerce.number().optional(),
  unit_cost: z.coerce.number().min(0, "Unit cost is required"),
  extendedCost: z.coerce.number().min(0, "Extended cost is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
});
export type PurchaseOrderItemInterface = z.infer<
  typeof PurchaseOrderItemSchema
>;
export const PurchaseOrderSchema = z.object({
  equipmentId: z.string({ required_error: "Equipment is required" }),
  date: z.date().optional(),
  dueDate: z.date().optional(),
  closedDate: z.date().optional(),
  status: z.enum(["Requisition", "Ordered", "Partial", "Closed"]),
  notes: z.string().optional(),
  items: z.array(PurchaseOrderItemSchema),

  purchaseOrderNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  orderNumber: z.string().optional(),
  woNumber: z.string().optional(),
  customer: z.string().optional(),
  vendor: z.string().optional(),
  billing: z.string().optional(),
  shipVia: z.string().optional(),
  shipping: z.string().optional(),

  terms: z.string().optional(),
  location: z.string().optional(),

  subTotal: z.string().optional(),

  discount_type: z.enum(["none", "percent", "amount"]).optional(),
  discount_percent: z.string().optional(),
  discount_amount: z.string().optional(),

  tax1: z.string().optional(),
  tax2: z.string().optional(),
  Credit: z.string().optional(),
  freight: z.string().optional(),
  totalCost: z.string().optional(),

  // Items (handled separately in local state, not validated here)
  // Notes and Attachments
  Notes: z.string().optional(),
  Attachments: z.array(z.any()).optional(),

  // Tax toggles
  primaryTaxRate: z.boolean().optional(),
  secondaryTaxRate: z.boolean().optional(),
  discount: z.boolean().optional(),
});
export type PurchaseOrderInterface = z.infer<typeof PurchaseOrderSchema>;


export const purchaseOrderItems = [
  {
    itemType: "Part",
    partNumber: "PN-001",
    warehouse: "Main Warehouse",
    warranty: "12 months",
    orderQuantity: 5,
    receivedQuantity: 0,
    unit_cost: 100,
    extendedCost: 500,
    notes: "Urgent replacement part",
  },
  {
    itemType: "Service",
    partNumber: "SRV-002",
    warehouse: "Service Bay",
    warranty: "6 months",
    orderQuantity: 2,
    receivedQuantity: 0,
    unit_cost: 150,
    extendedCost: 300,
    notes: "Includes installation",
  },
];

export type PurchaseOrderStatusType =
  | "Requisition"
  | "Ordered"
  | "Partial"
  | "Closed";

export interface PurchaseOrderTableInterface {
  id: string
  po_number: string
  issued_date: string
  due_date: string
  buyer_id: string
  status_id: string
  closed_date: any
  vendor: string
  shipping: string
  term_id: string
  ship_via_id: string
  invoice_number: string
  order_number: string
  wo_number: string
  location_id: string
  currency: string
  subtotal: string
  is_discount: boolean
  discount_type: string
  discount: string
  discount_amount: string
  tax_one: string
  tax_one_amount: string
  tax_two: string
  tax_two_amount: string
  credit: string
  freight: string
  total_cost: string
  notes: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
  status: Status
  items: PurchaseOrderItem[]
  others: Other[]
  location: Location
  buyer: Buyer
  term: Term
  ship_via: ShipVia
}

export interface Status {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  item_type_id: string
  item: string
  notes: string
  cost: string
  amount: string
  quantity: number
  extended_cost: string
  warehouse_id: string
  tax_one: boolean
  tax_two: boolean
  discount: boolean
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Other {
  id: string
  purchase_order_id: string
  name: string
  value: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Buyer {
  id: string
  last_name: string
  first_name: string
  middle_name: string
  address_one: string
  address_two: any
  city: string
  state: string
  postal_code: string
  home_contact: string
  alt_phone: string
  cell: string
  email: string
  status_id: string
  hire_date: string
  leave_date: string
  dob: string
  ssn: string
  type_id: string
  labor_rate: string
  billing_rate: string
  currency: string
  location_id: string
  category_id: string
  driver_license_number: string
  driver_license_class: any
  driver_license_state: string
  notes: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Term {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface ShipVia {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}
