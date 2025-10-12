import { z } from "zod";

export const InvoiceSchema = z
  .object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
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

export const InvoiceData: InvoiceInterface[] = [
  {
    invoiceNumber: "INV-001",
    status: "Outstanding",
    date: "2025-07-01 ",
    dueDate: "2025-07-15 ",
    customer: "John Doe",
    billing: "123 Elm St, Springfield",
    shipping: "456 Maple Ave",
    invoiceNotes: "Handle with care.",
    internalNotes: "Top customer.",
    terms: "Net 14",
    poNumber: "PO-1001",
    location: "HQ",
    discount_type: "percent",
    discount_percent: "5",
    discount_amount: undefined,
    tax1: "5",
    tax2: "0",
    total: "210.00",
    payments: "100.00",
    balanceDue: "110.00",
    items: [
      {
        quantity: 2,
        item_name: "Air Filter",
        description: "High efficiency",
        unit_cost: 50,
        amount: 100,
      },
      {
        quantity: 1,
        item_name: "Labor",
        description: "Maintenance work",
        unit_cost: 100,
        amount: 100,
      },
    ],
    paymentsData: [
      {
        id: 1,
        date_received: "2025-07-02 ",
        amount: "100",
        payment_type: "Credit Card",
        name_on_card: "John Doe",
        transaction_notes: "Partial payment",
      },
    ],
  },
  {
    invoiceNumber: "INV-002",
    status: "Outstanding",
    date: "2025-07-02 ",
    dueDate: "2025-07-17 ",
    customer: "Jane Smith",
    billing: "789 Pine St, Portland",
    shipping: "789 Pine St, Portland",
    invoiceNotes: "",
    internalNotes: "",
    terms: "Due on receipt",
    poNumber: "PO-1002",
    location: "Branch A",
    discount_type: "amount",
    discount_percent: undefined,
    discount_amount: "20",
    tax1: "8",
    tax2: "2",
    total: "300.00",
    payments: "0.00",
    balanceDue: "280.00",
    items: [
      {
        quantity: 3,
        item_name: "Brake Pads",
        unit_cost: 60,
        amount: 180,
      },
      {
        quantity: 1,
        item_name: "Inspection",
        unit_cost: 100,
        amount: 100,
      },
    ],
    paymentsData: [],
  },
  {
    invoiceNumber: "INV-003",
    status: "Outstanding",
    date: "2025-07-03 ",
    dueDate: "2025-07-18 ",
    customer: "Kwame Osei",
    billing: "Coconut Grove, Accra",
    shipping: "Same",
    invoiceNotes: "Local delivery only",
    internalNotes: "GHS only",
    terms: "Net 7",
    poNumber: "PO-1003",
    location: "Ghana Office",
    discount_type: "none",
    discount_percent: undefined,
    discount_amount: undefined,
    tax1: "0",
    tax2: "0",
    total: "150.00",
    payments: "150.00",
    balanceDue: "0.00",
    items: [
      {
        quantity: 1,
        item_name: "Tire Replacement",
        unit_cost: 150,
        amount: 150,
      },
    ],
    paymentsData: [
      {
        id: "kw-1",
        date_received: "2025-07-03 ",
        amount: 150,
        payment_type: "Cash",
        transaction_notes: "Full paid",
      },
    ],
  },
  {
    invoiceNumber: "INV-004",
    status: "Outstanding",
    date: "2025-07-04 ",
    dueDate: "2025-07-19 ",
    customer: "Carlos Garcia",
    billing: "55 Market Road, Austin",
    shipping: "",
    invoiceNotes: "",
    internalNotes: "",
    terms: "Net 30",
    poNumber: "PO-1004",
    location: "Texas Depot",
    discount_type: "percent",
    discount_percent: "10",
    discount_amount: undefined,
    tax1: "6",
    tax2: "0",
    total: "180.00",
    payments: "50.00",
    balanceDue: "130.00",
    items: [
      {
        quantity: 2,
        item_name: "Battery",
        unit_cost: 90,
        amount: 180,
      },
    ],
    paymentsData: [
      {
        id: 4,
        date_received: "2025-07-04 ",
        amount: 50,
        payment_type: "Mobile Money",
        transaction_notes: "Initial payment",
      },
    ],
  },
  {
    invoiceNumber: "INV-005",
    status: "Outstanding",
    date: "2025-07-05 ",
    dueDate: "2025-07-20 ",
    customer: "Linh Nguyen",
    billing: "14 Palm Street, San Diego",
    shipping: "14 Palm Street, San Diego",
    invoiceNotes: "Urgent",
    internalNotes: "",
    terms: "Net 14",
    poNumber: "PO-1005",
    location: "West Coast HQ",
    discount_type: "none",
    discount_percent: undefined,
    discount_amount: undefined,
    tax1: "5",
    tax2: "2",
    total: "275.00",
    payments: "275.00",
    balanceDue: "0.00",
    items: [
      {
        quantity: 1,
        item_name: "Engine Flush",
        unit_cost: 150,
        amount: 150,
      },
      {
        quantity: 1,
        item_name: "Transmission Oil",
        unit_cost: 125,
        amount: 125,
      },
    ],
    paymentsData: [
      {
        id: 5,
        date_received: "2025-07-06 ",
        amount: 275,
        payment_type: "Bank Transfer",
        name_on_card: "Linh Nguyen",
        transaction_notes: "",
      },
    ],
  },

  // Add 5 more
  {
    invoiceNumber: "INV-006",
    status: "Outstanding",
    date: "2025-07-06 ",
    dueDate: "2025-07-21 ",
    customer: "Rebecca Adams",
    billing: "89 Bay Lane, Boston",
    shipping: "Same",
    invoiceNotes: "",
    internalNotes: "First-time client",
    terms: "Net 30",
    poNumber: "PO-1006",
    location: "East Hub",
    discount_type: "amount",
    discount_amount: "15",
    discount_percent: undefined,
    tax1: "3",
    tax2: "0",
    total: "115.00",
    payments: "0",
    balanceDue: "100.00",
    items: [
      {
        quantity: 1,
        item_name: "Coolant Flush",
        unit_cost: 115,
        amount: 115,
      },
    ],
    paymentsData: [],
  },
  {
    invoiceNumber: "INV-007",
    status: "Outstanding",
    date: "2025-07-07 ",
    dueDate: "2025-07-22 ",
    customer: "Daniel Kim",
    billing: "104 Cherry Dr, Seattle",
    shipping: "Same",
    invoiceNotes: "Handle with care",
    internalNotes: "",
    terms: "Net 10",
    poNumber: "PO-1007",
    location: "Northwest Hub",
    discount_type: "none",
    discount_amount: undefined,
    discount_percent: undefined,
    tax1: "4",
    tax2: "1",
    total: "320.00",
    payments: "150.00",
    balanceDue: "170.00",
    items: [
      {
        quantity: 2,
        item_name: "Headlight Bulb",
        unit_cost: 80,
        amount: 160,
      },
      {
        quantity: 2,
        item_name: "Tail Light Bulb",
        unit_cost: 80,
        amount: 160,
      },
    ],
    paymentsData: [
      {
        id: 7,
        date_received: "2025-07-08 ",
        amount: 150,
        payment_type: "Credit Card",
        name_on_card: "Daniel Kim",
      },
    ],
  },
  {
    invoiceNumber: "INV-008",
    status: "Outstanding",
    date: "2025-07-08 ",
    dueDate: "2025-07-23 ",
    customer: "Ama Mensah",
    billing: "23 Peace Road, Kumasi",
    shipping: "Same",
    invoiceNotes: "Fast delivery",
    internalNotes: "",
    terms: "Net 7",
    poNumber: "PO-1008",
    location: "Ghana Branch",
    discount_type: "percent",
    discount_percent: "7",
    discount_amount: undefined,
    tax1: "6",
    tax2: "0",
    total: "200.00",
    payments: "0.00",
    balanceDue: "200.00",
    items: [
      {
        quantity: 2,
        item_name: "Mirror Replacement",
        unit_cost: 100,
        amount: 200,
      },
    ],
    paymentsData: [],
  },
  {
    invoiceNumber: "INV-009",
    status: "Outstanding",
    date: "2025-07-09 ",
    dueDate: "2025-07-24 ",
    customer: "Laura Brown",
    billing: "612 Sunset Blvd, LA",
    shipping: "Same",
    invoiceNotes: "",
    internalNotes: "",
    terms: "Net 15",
    poNumber: "PO-1009",
    location: "West Coast HQ",
    discount_type: "none",
    discount_amount: undefined,
    discount_percent: undefined,
    tax1: "9",
    tax2: "1",
    total: "480.00",
    payments: "0.00",
    balanceDue: "480.00",
    items: [
      {
        quantity: 4,
        item_name: "AC Repair",
        unit_cost: 120,
        amount: 480,
      },
    ],
    paymentsData: [],
  },
  {
    invoiceNumber: "INV-010",
    status: "Outstanding",
    date: "2025-07-10 ",
    dueDate: "2025-07-25 ",
    customer: "Chinedu Okoro",
    billing: "99 Industrial Estate, Lagos",
    shipping: "Same",
    invoiceNotes: "Late fee if past due",
    internalNotes: "Flagged",
    terms: "Net 14",
    poNumber: "PO-1010",
    location: "Nigeria Office",
    discount_type: "amount",
    discount_amount: "10",
    discount_percent: undefined,
    tax1: "5",
    tax2: "0",
    total: "140.00",
    payments: "140.00",
    balanceDue: "0.00",
    items: [
      {
        quantity: 1,
        item_name: "Spark Plug Set",
        unit_cost: 150,
        amount: 150,
      },
    ],
    paymentsData: [
      {
        id: "ok-10",
        date_received: "2025-07-11 ",
        amount: 140,
        payment_type: "POS",
        name_on_card: "Okoro C.",
      },
    ],
  },
];
