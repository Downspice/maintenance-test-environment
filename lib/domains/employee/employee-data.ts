import { z } from "zod";

export const EmployeeSchema = z.object({
  // Name
  id: z.string().optional(),
  first: z.string().min(1, "First name is required"),
  last: z.string().min(1, "Last name is required"),
  middle: z.string().optional(),

  // Address
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),

  // Contact
  home: z.coerce.number().or(z.string()).optional(),
  altPhone: z.coerce.number().or(z.string()).optional(),
  cell: z.coerce.number().or(z.string()).optional(),
  email: z.string().email("Please enter a valid email address"),

  // Notes
  notes: z.string().optional(),

  // Custom fields
  customFields: z.any().optional(),

  // Details
  status: z.string().min(1, "Status is required"),
  date: z.string().or(z.date()), // start date
  leaveDate: z.string().or(z.date()).optional(),
  dob: z.string().or(z.date()),

  ssn: z.string().optional(),
  type: z.string().min(1, "Employee type is required"),

  labor_rate: z.coerce.number().optional(),
  billing_rate: z.coerce.number().min(0, "Billing rate must be 0 or greater"),

  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),

  // Driver's license
  driverNumber: z.string().min(1, "Driver's license number is required"),
  driverClass: z.string().min(1, "Driver's license class is required"),

  // Notifications (checkboxes)
  tracker: z.array(z.string()).optional(),

  // Files
  Photos: z.any().optional(),
  Attachments: z.any().optional(),
});

export type EmployeeInterface = z.infer<typeof EmployeeSchema>;

export interface RenewalInterface {
  name: string;
  date_issued: string; // ISO date string
  expired_date: string; // ISO date string
  notes?: string;
}

export interface EmployeeTableInterface {
  id: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  address_one: string;
  address_two: any;
  city: string;
  state: string;
  postal_code: string;
  home_contact: string;
  alt_phone: string;
  cell: string;
  email: string;
  status_id: string;
  hire_date: string;
  leave_date: string;
  dob: string;
  ssn: string;
  type_id: string;
  labor_rate: string;
  billing_rate: string;
  currency: string;
  location_id: string;
  category_id: string;
  driver_license_number: string;
  driver_license_class: any;
  driver_license_state: string;
  notes: string;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
  type: Type;
  status: Status;
  location: Location;
  category: Category;
}

export interface Type {
  id: string;
  name: string;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
}

export interface Status {
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

export interface Category {
  id: string;
  name: string;
  created_by: any;
  updated_by: any;
  created_at: string;
  updated_at: string;
}
