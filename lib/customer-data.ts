export interface CustomerInterface {
  id: string;
  name: string;
  type:
    | "Dealer"
    | "All Vendors"
    | "Dealer"
    | "Fuel"
    | "Insurance"
    | "Loan/Lease"
    | "Maintenance"
    | "Rentals"
    | "Wholesale";
  contact: string;
  address1: string;
  address2?: string;
  city: string;
  state_prov: string;
  postal_code: string;
  country: string;
  phone1: string;
  phone2?: string;
  fax?: string;
  email: string;
  website?: string;
  term: string;
  billing_rate: number;
  discount_percent: number;
  discount_value: number;
  location_notes?: string;
}

export const CustomerData: CustomerInterface[] = [
  {
    id: "VND-001",
    name: "Global Supplies Ltd.",
    type: "Dealer",
    contact: "Alice Johnson",
    address1: "123 Main St",
    address2: "Suite 400",
    city: "New York",
    state_prov: "NY",
    postal_code: "10001",
    country: "USA",
    phone1: "+1-212-555-0100",
    phone2: "+1-212-555-0199",
    fax: "+1-212-555-0188",
    email: "alice@globalsupplies.com",
    website: "https://globalsupplies.com",
    term: "Net 30",
    billing_rate: 150.0,
    discount_percent: 10.0,
    discount_value: 15.0,
    location_notes: "Warehouse pickup available",
  },
  {
    id: "VND-002",
    name: "Tech Distributors Inc.",
    type: "All Vendors",
    contact: "Michael Tan",
    address1: "45 Silicon Ave",
    address2: "",
    city: "San Francisco",
    state_prov: "CA",
    postal_code: "94107",
    country: "USA",
    phone1: "+1-415-555-1122",
    phone2: "",
    fax: "+1-415-555-1199",
    email: "m.tan@techdist.com",
    website: "https://techdist.com",
    term: "Net 15",
    billing_rate: 200.0,
    discount_percent: 5.0,
    discount_value: 10.0,
    location_notes: "No weekend deliveries",
  },
  {
    id: "VND-003",
    name: "EcoTrade Partners",
    type: "Dealer",
    contact: "Samantha Green",
    address1: "78 Greenway Blvd",
    address2: "",
    city: "Portland",
    state_prov: "OR",
    postal_code: "97201",
    country: "USA",
    phone1: "+1-503-555-2233",
    phone2: "+1-503-555-3344",
    fax: "",
    email: "sgreen@ecotrade.com",
    website: "https://ecotrade.com",
    term: "Net 45",
    billing_rate: 100.0,
    discount_percent: 7.5,
    discount_value: 7.5,
    location_notes: "",
  },
  {
    id: "VND-004",
    name: "Urban Vendor Solutions",
    type: "All Vendors",
    contact: "David Lee",
    address1: "901 Vendor St",
    address2: "Floor 2",
    city: "Chicago",
    state_prov: "IL",
    postal_code: "60616",
    country: "USA",
    phone1: "+1-312-555-7788",
    phone2: "",
    fax: "+1-312-555-7700",
    email: "dlee@urbanvendors.com",
    website: "",
    term: "Net 60",
    billing_rate: 125.0,
    discount_percent: 12.5,
    discount_value: 20.0,
    location_notes: "Frequent traffic delays",
  },
  {
    id: "VND-005",
    name: "Atlas Industrial Co.",
    type: "Dealer",
    contact: "Karen Osei",
    address1: "17 Industrial Park Rd",
    address2: "",
    city: "Accra",
    state_prov: "Greater Accra",
    postal_code: "GA100",
    country: "Ghana",
    phone1: "+233-302-555-900",
    phone2: "+233-302-555-901",
    fax: "",
    email: "kosei@atlasgh.com",
    website: "https://atlasgh.com",
    term: "Net 30",
    billing_rate: 80.0,
    discount_percent: 15.0,
    discount_value: 12.0,
    location_notes: "Contact before visiting",
  },
];
