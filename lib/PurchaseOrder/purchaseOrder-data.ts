import { z } from "zod";

// Purchase Order Item Schema
export const PurchaseOrderItemSchema = z.object({
  item_type_id: z.string({
    required_error: "Item type is required",
    invalid_type_error: "Item type must be a valid selection"
  }).min(1, "Please select an item type"),
  
  item: z.string({
    required_error: "Item/Part number is required",
    invalid_type_error: "Item must be a text value"
  }).min(1, "Item/Part number cannot be empty"),
  
  warehouse_id: z.string({
    required_error: "Warehouse is required",
    invalid_type_error: "Warehouse must be a valid selection"
  }).min(1, "Please select a warehouse"),
  
  quantity: z.coerce.number({
    required_error: "Order quantity is required",
    invalid_type_error: "Quantity must be a number"
  }).min(1, "Quantity must be at least 1"),
  
  cost: z.coerce.number({
    required_error: "Unit cost is required",
    invalid_type_error: "Cost must be a number"
  }).min(0, "Unit cost cannot be negative"),
  
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number"
  }).min(0, "Amount cannot be negative"),
  
  extended_cost: z.coerce.number({
    required_error: "Extended cost is required",
    invalid_type_error: "Extended cost must be a number"
  }).min(0, "Extended cost cannot be negative"),
  
  notes: z.string().optional().default(""),
  
  tax_one: z.coerce.number().min(0).max(1).optional().default(0),
  tax_two: z.coerce.number().min(0).max(1).optional().default(0),
  discount: z.coerce.number().min(0).max(1).optional().default(0),
});

// Custom Field Schema for dynamic fields
export const CustomFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  value: z.string().min(1, "Field value is required")
});

// Attachment Schema
export const AttachmentSchema = z.object({
  file: z.any({
    required_error: "File is required",
  }),
  name: z.string().min(1, "File name is required"),
  description: z.string().optional().default("")
});

// Main Purchase Order Schema
export const PurchaseOrderSchema = z.object({
  id:z.string().optional(),
  po_number: z.string({
    required_error: "Purchase order number is required",
    invalid_type_error: "PO number must be text"
  }).min(1, "PO number cannot be empty"),
  
  issued_date: z.date({
    required_error: "Issue date is required",
    invalid_type_error: "Please select a valid issue date"
  }),
  
  due_date: z.date({
    required_error: "Due date is required",
    invalid_type_error: "Please select a valid due date"
  }),
  
  buyer_id: z.string({
    required_error: "Buyer is required",
    invalid_type_error: "Buyer must be selected"
  }).min(1, "Please select a buyer"),
  
  status_id: z.string({
    required_error: "Status is required",
    invalid_type_error: "Status must be selected"
  }).min(1, "Please select a status"),
  
  closed_date: z.date().optional().nullable(),
  
  vendor: z.string({
    required_error: "Vendor is required",
    invalid_type_error: "Vendor must be text"
  }).min(1, "Vendor name cannot be empty"),
  
  shipping: z.string({
    required_error: "Shipping address is required",
    invalid_type_error: "Shipping address must be text"
  }).min(1, "Shipping address cannot be empty"),
  
  term_id: z.string({
    required_error: "Payment terms are required",
    invalid_type_error: "Terms must be selected"
  }).min(1, "Please select payment terms"),
  
  ship_via_id: z.string({
    required_error: "Ship via is required",
    invalid_type_error: "Ship via must be selected"
  }).min(1, "Please select shipping method"),
  
  invoice_number: z.string().optional().default(""),
  
  order_number: z.string().optional().default(""),
  
  wo_number: z.string().optional().default(""),
  
  location_id: z.string({
    required_error: "Location is required",
    invalid_type_error: "Location must be selected"
  }).min(1, "Please select a location"),
  
  subtotal: z.coerce.number({
    required_error: "Subtotal is required",
    invalid_type_error: "Subtotal must be a number"
  }).min(0, "Subtotal cannot be negative"),
  
  is_discount: z.coerce.number().min(0).max(1).default(0),
  
  discount_type: z.string( {
    required_error: "Please select a discount type",
    invalid_type_error: "Discount type must be either 'Fixed' or 'Percent'"
  }).optional(),
  
  discount: z.coerce.number().min(0, "Discount cannot be negative").optional().default(0),
  
  discount_amount: z.coerce.number().min(0, "Discount amount cannot be negative").optional().default(0),
  
  tax_one: z.coerce.number().min(0, "Tax 1 cannot be negative").default(0),
  
  tax_one_amount: z.coerce.number().min(0, "Tax 1 amount cannot be negative").default(0),
  
  tax_two: z.coerce.number().min(0, "Tax 2 cannot be negative").default(0),
  
  tax_two_amount: z.coerce.number().min(0, "Tax 2 amount cannot be negative").default(0),
  
  credit: z.coerce.number().min(0, "Credit cannot be negative").default(0),
  
  freight: z.coerce.number().min(0, "Freight cannot be negative").default(0),
  
  total_cost: z.coerce.number({
    required_error: "Total cost is required",
    invalid_type_error: "Total cost must be a number"
  }).min(0, "Total cost cannot be negative"),
  
  notes: z.string().optional().default(""),
  
  others: z.array(CustomFieldSchema).optional().default([]),
  
  items: z.array(PurchaseOrderItemSchema)
    .min(1, "At least one item is required")
    .refine(
      (items) => items.length > 0,
      { message: "Please add at least one item to the purchase order" }
    ),
  
  attachments: z.array(AttachmentSchema).optional().default([])
});

// TypeScript types
export type PurchaseOrderItemType = z.infer<typeof PurchaseOrderItemSchema>;
export type PurchaseOrderType = z.infer<typeof PurchaseOrderSchema>;
export type CustomFieldType = z.infer<typeof CustomFieldSchema>;
export type AttachmentType = z.infer<typeof AttachmentSchema>;

// Status type for UI
export type PurchaseOrderStatusType = "Requisition" | "Ordered" | "Partial" | "Closed";

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
