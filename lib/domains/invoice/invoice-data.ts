export interface InvoiceTableInterface {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer_id: string;
  term_id: string;
  po_number: string;
  location_id: string;
  customer_billing: string;
  customer_shipping: string;
  currency: string;
  is_discount: boolean;
  discount_type: string;
  discount: string;
  discount_amount: string;
  tax_one: string;
  tax_one_amount: string;
  tax_two: string;
  tax_two_amount: string;
  shipping: string;
  total: string;
  payments: string;
  balance_due: string;
  invoice_notes: any;
  internal_notes: any;
  status: string;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
  customer: Customer;
  term: Term;
  location: Location;
}

export interface Customer {
  id: string;
  company_name: string;
  contact: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_one: string;
  phone_two: any;
  fax: any;
  email: string;
  website: any;
  term_id: string;
  term_days: number;
  discount_id: string;
  discount_percent: string;
  currency: string;
  billing_rate: string;
  type_id: string;
  location_id: string;
  notes: any;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
}

export interface Term {
  id: string;
  name: string;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
}
