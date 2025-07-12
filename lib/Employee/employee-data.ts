import { z } from "zod";

export const EmployeeSchema = z.object({
  // Name
  id: z.string().optional(),
  first: z.string(),
  last: z.string(),
  middle: z.string().optional(),

  // Address
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  state: z.string(), 
  postalCode: z.string(),

  // Contact
  home: z.number().or(z.string()).optional(),
  altPhone: z.number().or(z.string()).optional(),
  cell: z.number().or(z.string()).optional(),
  email: z.string().email(),

  // Notes
  notes: z.string().optional(),

  // Custom fields
  customFields: z.any().optional(),

  // Details
  status: z.string(),
  date: z.string().or(z.date()), // start date
  leaveDate: z.string().or(z.date()).optional(),
  dob: z.string().or(z.date()),

  ssn: z.string().optional(),
  type: z.string(),

  laborRate: z.number().optional(),
  billingRate: z.number(),

  location: z.string(),
  category: z.string(),

  // Driver's license
  driverNumber: z.string(),
  driverClass: z.string(),

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

// export interface EmployeeInterface {
//   employeeId: number; // ✅ New field
//   last_name: string;
//   first_name: string;
//   middle_name?: string;
//   address1: string;
//   address2?: string;
//   city: string;
//   state_prov: string;
//   postal_code: string;
//   location: string;
//   image: string;
//   name: string;
//   type: "Manager" | "Technician" | "Supervisor" | "Driver";
//   drivers_license_number: string;
//   contact: string;
//   notes?: string;
//   ssn: string;
//   dl_state: string;
//   dl_class: string;
//   drivers_license_notes?: string;
//   hire_date: string;
//   leave_date?: string;
//   dob: string;
//   category: string;
//   rate: number;
//   custom_value?: string;
//   status: "Active" | "Inactive" | "Retired" | "Terminated" | "Vacation";
//   billing_rate: number;
//   renewals: RenewalInterface[];
// }

export const EmployeeData: EmployeeInterface[] = [
  {
    id: "emp-1001",
    last: "Doe",
    first: "John",
    middle: "A",
    street1: "123 Elm Street",
    street2: "Apt 5B",
    city: "Springfield",
    state: "IL",
    postalCode: "62704",
    location: "HQ",
    type: "Manager",
    driverNumber: "D1234567",
    contact: "+1-555-123-4567",
    notes: "Promoted in 2023",
    ssn: "123-45-6789",
    driverClass: "C",
    email: "john.doe@example.com",
    dob: "1985-03-22",
    date: "2015-06-01",
    leaveDate: null,
    billingRate: 60.0,
    laborRate: 45.5,
    category: "Full-time",
    status: "Active",
    customFields: "N/A",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1002",
    last: "Smith",
    first: "Jane",
    middle: "",
    street1: "456 Oak Avenue",
    street2: "",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    location: "West Office",
    type: "Technician",
    driverNumber: "S7654321",
    contact: "+1-555-987-6543",
    notes: "",
    ssn: "987-65-4321",
    driverClass: "B",
    email: "jane.smith@example.com",
    dob: "1990-07-10",
    date: "2018-09-15",
    leaveDate: null,
    billingRate: 40.0,
    laborRate: 30.0,
    category: "Part-time",
    status: "Active",
    customFields: "",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1003",
    last: "Osei",
    first: "Kwame",
    middle: "N",
    street1: "789 Coconut Grove",
    street2: "",
    city: "Accra",
    state: "Greater Accra",
    postalCode: "GA-100",
    location: "Ghana Branch",
    type: "Driver",
    driverNumber: "GH987654",
    contact: "+233-20-123-4567",
    notes: "Local deliveries only",
    ssn: "GH-123456789",
    driverClass: "A",
    email: "kwame.osei@example.com",
    dob: "1988-11-05",
    date: "2020-01-10",
    leaveDate: null,
    billingRate: 30.0,
    laborRate: 20.0,
    category: "Contract",
    status: "Vacation",
    customFields: "On-call",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1004",
    last: "Nguyen",
    first: "Linh",
    middle: "T",
    street1: "14 Palm Street",
    street2: "",
    city: "San Diego",
    state: "CA",
    postalCode: "92103",
    location: "West Coast HQ",
    type: "Supervisor",
    driverNumber: "C4567890",
    contact: "+1-858-555-2345",
    notes: "Bilingual support",
    ssn: "111-22-3333",
    driverClass: "C",
    email: "linh.nguyen@example.com",
    dob: "1992-12-04",
    date: "2019-02-12",
    leaveDate: null,
    billingRate: 50.0,
    laborRate: 38.5,
    category: "Full-time",
    status: "Active",
    customFields: "",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1006",
    last: "Garcia",
    first: "Carlos",
    middle: "E",
    street1: "55 Market Road",
    street2: "Unit 2B",
    city: "Austin",
    state: "TX",
    postalCode: "73301",
    location: "Texas Depot",
    type: "Technician",
    driverNumber: "TX7766543",
    contact: "+1-512-555-7788",
    notes: "",
    ssn: "222-33-4444",
    driverClass: "B",
    email: "carlos.garcia@example.com",
    dob: "1994-03-18",
    date: "2023-07-01",
    leaveDate: null,
    billingRate: 25.0,
    laborRate: 18.0,
    category: "Intern",
    status: "Active",
    customFields: "",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1009",
    last: "Adams",
    first: "Rebecca",
    middle: "L",
    street1: "89 Bay Lane",
    street2: "",
    city: "Boston",
    state: "MA",
    postalCode: "02108",
    location: "East Hub",
    type: "Manager",
    driverNumber: "MA334455",
    contact: "+1-617-555-0011",
    notes: "Recently promoted",
    ssn: "333-44-5555",
    driverClass: "C",
    email: "rebecca.adams@example.com",
    dob: "1980-08-01",
    date: "2014-11-15",
    leaveDate: null,
    billingRate: 70.0,
    laborRate: 55.0,
    category: "Full-time",
    status: "Active",
    customFields: "Top performer",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1041",
    last: "Kim",
    first: "Daniel",
    middle: "",
    street1: "104 Cherry Dr",
    street2: "",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    location: "Northwest Hub",
    type: "Driver",
    driverNumber: "WA909988",
    contact: "+1-206-555-6677",
    notes: "On probation",
    ssn: "444-55-6666",
    driverClass: "A",
    email: "daniel.kim@example.com",
    dob: "1991-06-11",
    date: "2022-04-03",
    leaveDate: null,
    billingRate: 33.0,
    laborRate: 25.0,
    category: "Contract",
    status: "Active",
    customFields: "Temp",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1023",
    last: "Mensah",
    first: "Ama",
    middle: "",
    street1: "23 Peace Road",
    street2: "",
    city: "Kumasi",
    state: "Ashanti",
    postalCode: "AK-000",
    location: "Ghana Branch",
    type: "Supervisor",
    driverNumber: "GH445566",
    contact: "+233-24-456-7890",
    notes: "Excellent record",
    ssn: "GH-456789012",
    driverClass: "B",
    email: "ama.mensah@example.com",
    dob: "1987-02-14",
    date: "2016-10-22",
    leaveDate: null,
    billingRate: 47.0,
    laborRate: 35.0,
    category: "Full-time",
    status: "Active",
    customFields: "Leadership program",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-1111",
    last: "Brown",
    first: "Laura",
    middle: "J",
    street1: "612 Sunset Blvd",
    street2: "",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    location: "West Coast HQ",
    type: "Technician",
    driverNumber: "CA775533",
    contact: "+1-310-555-0033",
    notes: "Retired in 2024",
    ssn: "555-66-7777",
    driverClass: "C",
    email: "laura.brown@example.com",
    dob: "1965-01-05",
    date: "2005-07-19",
    leaveDate: "2024-12-31",
    billingRate: 0.0,
    laborRate: 40.0,
    category: "Retired",
    status: "Retired",
    customFields: "",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
  {
    id: "emp-12301",
    last: "Okoro",
    first: "Chinedu",
    middle: "",
    street1: "99 Industrial Estate",
    street2: "",
    city: "Lagos",
    state: "Lagos",
    postalCode: "101001",
    location: "Nigeria Office",
    type: "Driver",
    driverNumber: "NG778899",
    contact: "+234-802-345-6789",
    notes: "Terminated after review",
    ssn: "NG-890123456",
    driverClass: "A",
    email: "chinedu.okoro@example.com",
    dob: "1989-09-09",
    date: "2019-03-01",
    leaveDate: "2024-05-15",
    billingRate: 0.0,
    laborRate: 22.0,
    category: "Full-time",
    status: "Terminated",
    customFields: "Probation history",
    Photos: [],
    Attachments: [],
    tracker: [],
  },
];
