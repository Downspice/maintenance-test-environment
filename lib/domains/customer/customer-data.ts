import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().optional(),

  // Billing Info
  company_name: z.string({ required_error: "Name is required" }),
  contact: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string({ required_error: "State is required" }),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  location_id: z.string({ required_error: "Location is required" }),
  type_id: z.string({ required_error: "Type is required" }),

  // Contact Info
  phone_one: z.string({ required_error: "Phone 1 is required" }),
  phone_two: z.string().optional(),
  fax: z.string().optional(),
  website: z.string().optional(),
  email: z.string().optional(),

  // Payment Info
  term_id: z.string({ required_error: "Term is required" }),
  term_days: z.coerce.number().optional(),
  discount_type: z.string().optional(),
  discount_percent: z.string().optional(),
  discount_amount: z.string().optional(),
  billing_rate: z.coerce.number().optional(),

  // Shipping Tab
  shipping: z.object({
    company_name: z.string().optional(),
    contact: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    phone_one: z.string().optional(),
    fax: z.string().optional(),
    email: z.string().optional(),
  }),

  // Same as billing flag
  is_same: z.boolean().optional(),

  // Notes & Attachments
  notes: z.string().optional(),
  Attachments: z.array(z.instanceof(File)).optional(),
}).refine((data) => {
  // If is_same is false or undefined, shipping company_name, contact, and phone_one are required
  if (!data.is_same) {
    if (!data.shipping.company_name || data.shipping.company_name.trim() === "") {
      return false;
    }
    if (!data.shipping.contact || data.shipping.contact.trim() === "") {
      return false;
    }
    if (!data.shipping.phone_one || data.shipping.phone_one.trim() === "") {
      return false;
    }
  }
  return true;
}, {
  message: "Name, Contact, and Phone are required when 'Same as billing' is not checked",
  path: ["shipping", "company_name"],
});

export type CustomerInterface = z.infer<typeof customerSchema>;

export interface CustomerTableDataInterface {
  id: string
  company_name: string
  contact: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_one: string
  phone_two: string
  fax: any
  email: string
  website: any
  term_id: string
  term_days: number
  discount_id: any
  discount_percent: string
  currency: string
  billing_rate: string
  type_id: string
  location_id: string
  notes: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
  is_active: boolean
  customer_shipping: any
  customer_attachments: any[]
  term: Term
  discount: any
  type: Type
  location: Location
}

export interface Term {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Type {
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
