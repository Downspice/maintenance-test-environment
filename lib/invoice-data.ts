export interface InvoiceInterface {
  invoice_number: string;
  status: "Outstanding" | "Paid in Full";
  issued_date: string; // Format: YYYY-MM-DD
  due_date: string;    // Format: YYYY-MM-DD
  ship_cost: number;
  tax1: number;
  tax2: number;
  customer_name: string;
  notes: string;
  terms: string;
  ponumber: string;
  location: string;
  total: number;
  payment: number;
}

export const InvoiceData:InvoiceInterface[]=[
  {
    "invoice_number": "INV-1001",
    "status": "Outstanding",
    "issued_date": "2025-06-01",
    "due_date": "2025-06-15",
    "ship_cost": 25.50,
    "tax1": 18.75,
    "tax2": 12.30,
    "customer_name": "John Doe",
    "notes": "Urgent delivery required.",
    "terms": "Net 15",
    "ponumber": "PO-3345",
    "location": "New York, NY",
    "total": 356.55,
    "payment": 100.00
  },
  {
    "invoice_number": "INV-1002",
    "status": "Paid in Full",
    "issued_date": "2025-05-20",
    "due_date": "2025-06-03",
    "ship_cost": 15.00,
    "tax1": 10.25,
    "tax2": 7.80,
    "customer_name": "Jane Smith",
    "notes": "Thank you for your business.",
    "terms": "Net 30",
    "ponumber": "PO-4289",
    "location": "Los Angeles, CA",
    "total": 295.30,
    "payment": 295.30
  },
  {
    "invoice_number": "INV-1003",
    "status": "Outstanding",
    "issued_date": "2025-06-10",
    "due_date": "2025-06-25",
    "ship_cost": 30.00,
    "tax1": 20.00,
    "tax2": 15.00,
    "customer_name": "Alpha Corp",
    "notes": "Follow up in a week.",
    "terms": "Net 15",
    "ponumber": "PO-7623",
    "location": "Chicago, IL",
    "total": 410.00,
    "payment": 0.00
  },
  {
    "invoice_number": "INV-1004",
    "status": "Paid in Full",
    "issued_date": "2025-04-05",
    "due_date": "2025-04-20",
    "ship_cost": 22.00,
    "tax1": 14.25,
    "tax2": 10.50,
    "customer_name": "Beta LLC",
    "notes": "Early payment received.",
    "terms": "Net 30",
    "ponumber": "PO-1147",
    "location": "Seattle, WA",
    "total": 325.45,
    "payment": 325.45
  },
  {
    "invoice_number": "INV-1005",
    "status": "Outstanding",
    "issued_date": "2025-06-18",
    "due_date": "2025-07-02",
    "ship_cost": 18.00,
    "tax1": 13.50,
    "tax2": 9.75,
    "customer_name": "Gamma Enterprises",
    "notes": "Pending approval from finance.",
    "terms": "Net 15",
    "ponumber": "PO-9812",
    "location": "Houston, TX",
    "total": 289.80,
    "payment": 0.00
  },
  {
    "invoice_number": "INV-1006",
    "status": "Paid in Full",
    "issued_date": "2025-03-15",
    "due_date": "2025-03-30",
    "ship_cost": 20.00,
    "tax1": 11.25,
    "tax2": 8.75,
    "customer_name": "Delta Inc.",
    "notes": "Handled by account manager.",
    "terms": "Net 30",
    "ponumber": "PO-5566",
    "location": "Denver, CO",
    "total": 312.50,
    "payment": 312.50
  },
  {
    "invoice_number": "INV-1007",
    "status": "Outstanding",
    "issued_date": "2025-06-12",
    "due_date": "2025-06-26",
    "ship_cost": 16.50,
    "tax1": 10.60,
    "tax2": 6.40,
    "customer_name": "Omega Traders",
    "notes": "Customer requested breakdown.",
    "terms": "Net 15",
    "ponumber": "PO-3348",
    "location": "Phoenix, AZ",
    "total": 270.50,
    "payment": 50.00
  },
  {
    "invoice_number": "INV-1008",
    "status": "Paid in Full",
    "issued_date": "2025-05-10",
    "due_date": "2025-05-25",
    "ship_cost": 14.00,
    "tax1": 9.80,
    "tax2": 7.20,
    "customer_name": "Sigma Group",
    "notes": "Paid via bank transfer.",
    "terms": "Net 15",
    "ponumber": "PO-9910",
    "location": "Miami, FL",
    "total": 298.00,
    "payment": 298.00
  },
  {
    "invoice_number": "INV-1009",
    "status": "Outstanding",
    "issued_date": "2025-06-05",
    "due_date": "2025-06-19",
    "ship_cost": 12.50,
    "tax1": 7.00,
    "tax2": 5.50,
    "customer_name": "Zeta Solutions",
    "notes": "Awaiting product delivery confirmation.",
    "terms": "Net 15",
    "ponumber": "PO-2244",
    "location": "Atlanta, GA",
    "total": 260.25,
    "payment": 150.00
  },
  {
    "invoice_number": "INV-1010",
    "status": "Paid in Full",
    "issued_date": "2025-04-25",
    "due_date": "2025-05-10",
    "ship_cost": 17.75,
    "tax1": 12.00,
    "tax2": 9.25,
    "customer_name": "Theta Inc.",
    "notes": "Completed successfully.",
    "terms": "Net 15",
    "ponumber": "PO-7777",
    "location": "San Francisco, CA",
    "total": 342.00,
    "payment": 342.00
  }
]
