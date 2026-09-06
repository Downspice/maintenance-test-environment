import z from "zod";

export const VendorSchema = z.object({
  vendor_number: z.string(),
  name: z.string(),
  type: z.enum([
    "All Vendors",
    "Dealer",
    "Fuel",
    "Insurance",
    "Loan/Lease",
    "Maintenance",
    "Rentals",
    "Wholesale",
  ]),
  contact: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  state_prov: z.string(),
  province: z.string().optional(),
  postal_code: z.string(),
  country: z.string(),
  phone_one: z.string(),
  phone_two: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email(),
  website: z.string().url().optional(),
  term: z.string(),
  billing_rate: z.coerce.number(),
  location: z.string(),
  notes: z.string().optional(),
})

// Type inference (optional)
export type VendorInterface = z.infer<typeof VendorSchema>

export interface VendorTableInterface  {
  id: string
  name: string
  vendor_number: string
  contact: any
  address: string
  city: string
  state: string
  postal_code: string
  country: any
  location_id: string
  status_id: string
  type_id: string
  term_id: string
  billing_rate: string
  notes: any
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
  location: Location
  status: Status
  type: Type
  term: Term
  attachments: any[]
  vendor_contact: VendorContact
}

export interface Location {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface Status {
  id: string
  name: string
  is_active: boolean
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

export interface Term {
  id: string
  name: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}

export interface VendorContact {
  id: string
  vendor_id: string
  phone_one: string
  phone_two: any
  fax: any
  email: string
  website: any
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}


export const VendorData = [
  {
    vendor_number: "VND001",
    name: "DealerCo Supplies",
    type: "Dealer",
    contact: "John Smith",
    address1: "101 Industrial Rd",
    address2: "",
    city: "Los Angeles",
    state_prov: "CA",
    province: "",
    postal_code: "90001",
    country: "USA",
    phone_one: "+1-310-555-1234",
    phone_two: "+1-310-555-5678",
    fax: "+1-310-555-9999",
    email: "johnsmith@dealerco.com",
    website: "https://dealerco.com",
    term: "Net 30",
    billing_rate: 75.0,
    location: "Warehouse A",
    notes: "Preferred electrical parts supplier",
  },
  {
    vendor_number: "VND002",
    name: "SupplyMax Ltd",
    type: "All Vendors",
    contact: "Sarah Johnson",
    address1: "22 Supply St",
    address2: "Suite 5",
    city: "Chicago",
    state_prov: "IL",
    province: "",
    postal_code: "60601",
    country: "USA",
    phone_one: "+1-312-555-4321",
    phone_two: "",
    fax: "+1-312-555-1234",
    email: "s.johnson@supplymax.com",
    website: "",
    term: "Net 45",
    billing_rate: 62.5,
    location: "Main Branch",
    notes: "",
  },
  {
    vendor_number: "VND003",
    name: "AfricaTech Distributors",
    type: "Dealer",
    contact: "Kwame Ofori",
    address1: "12 Lapaz Road",
    address2: "",
    city: "Accra",
    state_prov: "",
    province: "Greater Accra",
    postal_code: "GA-107",
    country: "Ghana",
    phone_one: "+233-20-123-4567",
    phone_two: "+233-24-456-7890",
    fax: "",
    email: "info@africatech.com",
    website: "https://africatech.com",
    term: "COD",
    billing_rate: 50.0,
    location: "Africa Depot",
    notes: "Regional tech supplier",
  },
  {
    vendor_number: "VND004",
    name: "CentralParts Inc.",
    type: "All Vendors",
    contact: "Emily Brown",
    address1: "400 Central Blvd",
    address2: "Floor 3",
    city: "New York",
    state_prov: "NY",
    province: "",
    postal_code: "10001",
    country: "USA",
    phone_one: "+1-212-555-7890",
    phone_two: "",
    fax: "",
    email: "emily.b@centralparts.com",
    website: "",
    term: "Net 60",
    billing_rate: 80.0,
    location: "East Coast Hub",
    notes: "Long-term vendor",
  },
  {
    vendor_number: "VND005",
    name: "KumasiTools Co.",
    type: "Dealer",
    contact: "Kofi Mensah",
    address1: "88 Kumasi Ring Rd",
    address2: "",
    city: "Kumasi",
    state_prov: "",
    province: "Ashanti",
    postal_code: "AK-011",
    country: "Ghana",
    phone_one: "+233-26-654-3210",
    phone_two: "",
    fax: "",
    email: "mensahk@kumasitools.com",
    website: "https://kumasitools.com",
    term: "Prepaid",
    billing_rate: 55.0,
    location: "Ghana Office",
    notes: "",
  },
  {
    vendor_number: "VND006",
    name: "VN Supplies",
    type: "All Vendors",
    contact: "Liam Nguyen",
    address1: "77 Mekong Ave",
    address2: "Block B",
    city: "Ho Chi Minh",
    state_prov: "",
    province: "HCMC",
    postal_code: "70000",
    country: "Vietnam",
    phone_one: "+84-28-9999-8888",
    phone_two: "",
    fax: "+84-28-9999-7777",
    email: "liam@vn-supplies.vn",
    website: "https://vn-supplies.vn",
    term: "Net 30",
    billing_rate: 48.0,
    location: "Asia Hub",
    notes: "",
  },
  {
    vendor_number: "VND007",
    name: "NigeriaTools Ltd",
    type: "Dealer",
    contact: "Ahmed Ali",
    address1: "19 Industrial Zone",
    address2: "",
    city: "Lagos",
    state_prov: "",
    province: "Lagos State",
    postal_code: "101001",
    country: "Nigeria",
    phone_one: "+234-803-444-5555",
    phone_two: "",
    fax: "",
    email: "ahmed@nigeriatools.com",
    website: "https://nigeriatools.com",
    term: "Net 15",
    billing_rate: 58.5,
    location: "Lagos Branch",
    notes: "Steel and machinery parts",
  },
  {
    vendor_number: "VND008",
    name: "UK Parts Co.",
    type: "All Vendors",
    contact: "Olivia Green",
    address1: "700 Elm Park",
    address2: "Warehouse 2",
    city: "London",
    state_prov: "",
    province: "England",
    postal_code: "SW1A 1AA",
    country: "UK",
    phone_one: "+44-20-7946-0123",
    phone_two: "",
    fax: "",
    email: "olivia.green@ukparts.co.uk",
    website: "",
    term: "Net 30",
    billing_rate: 69.0,
    location: "UK Depot",
    notes: "Reliable UK vendor",
  },
  {
    vendor_number: "VND009",
    name: "ITParts SRL",
    type: "Dealer",
    contact: "Marco Rossi",
    address1: "Via Roma 21",
    address2: "",
    city: "Milan",
    state_prov: "MI",
    province: "",
    postal_code: "20100",
    country: "Italy",
    phone_one: "+39-02-1234-5678",
    phone_two: "",
    fax: "",
    email: "m.rossi@itparts.it",
    website: "https://itparts.it",
    term: "Net 30",
    billing_rate: 63.0,
    location: "EU Hub",
    notes: "Fast delivery",
  },
  {
    vendor_number: "VND010",
    name: "NipponTech",
    type: "All Vendors",
    contact: "Yuki Tanaka",
    address1: "5-10 Shibuya",
    address2: "",
    city: "Tokyo",
    state_prov: "",
    province: "Tokyo Prefecture",
    postal_code: "150-0002",
    country: "Japan",
    phone_one: "+81-3-1234-5678",
    phone_two: "+81-3-8765-4321",
    fax: "+81-3-0000-0000",
    email: "yuki@nippontech.jp",
    website: "https://nippontech.jp",
    term: "Net 60",
    billing_rate: 72.0,
    location: "Japan Office",
    notes: "Electronics specialist",
  },
];
