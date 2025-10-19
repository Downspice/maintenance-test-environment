import { z } from "zod";

export const InvoiceSchema = z
  .object({
    invoice_number: z.string().min(1, "Invoice number is required"),
    date: z.date({
      required_error: "Date is required",
    }),
    dueDate: z.date({
      required_error: "Due date is required",
    }),
    customer: z.string().min(1, "Customer is required"),

    billing: z.string().optional(),
    shipping: z.string().optional(),

    // Notes Tab
    invoiceNotes: z.string().optional(),
    internalNotes: z.string().optional(),

    // Miscellaneous
    terms: z.string().optional(),
    poNumber: z.string().optional(),
    location: z.string().optional(),

    // Totals Section
    discount_type: z.enum(["none", "percent", "amount"]),
    discount_percent: z.string().optional(), // Conditionally required
    discount_amount: z.string().optional(), // Conditionally required

    tax1: z.string().optional(),
    tax2: z.string().optional(),
    total: z.string().optional(),
    payments: z.string().optional(),
    balanceDue: z.string().optional(),

    // New status field added
    status: z.enum(["Paid in Full", "Outstanding"]),

    // Dynamic rows
    items: z
      .array(
        z.object({
          quantity: z.union([z.number(), z.string()]),
          item_name: z.string(),
          description: z.string().optional(),
          unit_cost: z.union([z.number(), z.string()]),
          amount: z.union([z.number(), z.string()]),
        })
      )
      .optional(),

    paymentsData: z
      .array(
        z.object({
          id: z.string().or(z.number()),
          date_received: z.date(),
          amount: z.union([z.string(), z.number()]),
          payment_type: z.string(),
          check_number: z.string().optional(),
          name_on_card: z.string().optional(),
          transaction_notes: z.string().optional(),
          date: z.any().optional(), 
          paymentMethod: z.any().optional(),
          chequeNumber: z.any().optional(),
          name: z.any().optional(),
          transaction: z.any().optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.discount_type === "percent") {
        return !!data.discount_percent;
      }
      if (data.discount_type === "amount") {
        return !!data.discount_amount;
      }
      return true;
    },
    {
      message: "Discount value is required",
      path: ["discount_percent"], // Or dynamic logic here
    }
  );

export type InvoiceInterface = z.infer<typeof InvoiceSchema>;

export interface InvoiceTableInterface {
  id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  customer_id: string
  term_id: string
  po_number: string
  location_id: string
  customer_billing: string
  customer_shipping: string
  currency: string
  is_discount: boolean
  discount_type: string
  discount: string
  discount_amount: string
  tax_one: string
  tax_one_amount: string
  tax_two: string
  tax_two_amount: string
  shipping: string
  total: string
  payments: string
  balance_due: string
  invoice_notes: any
  internal_notes: any
  status: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
  customer: Customer
  term: Term
  location: Location
}

export interface Customer {
  id: string
  company_name: string
  contact: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_one: string
  phone_two: any
  fax: any
  email: string
  website: any
  term_id: string
  term_days: number
  discount_id: string
  discount_percent: string
  currency: string
  billing_rate: string
  type_id: string
  location_id: string
  notes: any
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

export interface Location {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}
