
export const maintenanceItems:maintenanceItemsInterface[] = [
  {
    quantity: 5,
    item_name: "Air Filter",
    description: "Replacement air filters for HVAC system",
    unit_cost: 15.0,
    amount: 75.0,
  },
  {
    quantity: 2,
    item_name: "Fluorescent Light Tubes",
    description: "T8 4-foot light tubes for office lighting",
    unit_cost: 8.5,
    amount: 17.0,
  },
  {
    quantity: 1,
    item_name: "Thermostat",
    description: "Digital programmable thermostat",
    unit_cost: 65.0,
    amount: 65.0,
  },
  {
    quantity: 10,
    item_name: "HVAC Screws",
    description: "Set of screws for securing HVAC panels",
    unit_cost: 0.5,
    amount: 5.0,
  },
  {
    quantity: 3,
    item_name: "Pipe Insulation",
    description: "Foam insulation for copper pipes",
    unit_cost: 12.0,
    amount: 36.0,
  },
];

export interface maintenanceItemsInterface {
  quantity: number;
  item_name: string;
  description: string;
  unit_cost: number;
  amount: number;
}

export const payments = [
  {
    id: "PMT001",
    date_received: "2025-06-15",
    amount: 250.0,
    payment_type: "credit card",
    check_number: null,
    name_on_card: "Alice Johnson",
    transaction_notes: "Monthly maintenance fee - June",
  },
  {
    id: "PMT002",
    date_received: "2025-06-18",
    amount: 500.0,
    payment_type: "cheque",
    check_number: "CHK987654",
    name_on_card: null,
    transaction_notes: "Quarterly payment",
  },
  {
    id: "PMT003",
    date_received: "2025-06-20",
    amount: 125.0,
    payment_type: "electronic",
    check_number: null,
    name_on_card: null,
    transaction_notes: "Online payment via bank transfer",
  },
  {
    id: "PMT004",
    date_received: "2025-07-01",
    amount: 300.0,
    payment_type: "credit card",
    check_number: null,
    name_on_card: "Michael Smith",
    transaction_notes: "Maintenance for July",
  },
  {
    id: "PMT005",
    date_received: "2025-07-03",
    amount: 200.0,
    payment_type: "cheque",
    check_number: "CHK123456",
    name_on_card: null,
    transaction_notes: "Partial payment",
  },
];

export const discount_typesOptions = [
  { id: "percent", name: "Percentage" },
  { id: "amount", name: "Amount" },
];

export const paymentReceived: PaymentReceivedInterface[] = [
  {
    dateReceived: "2025-07-01",
    invoice_number: "INV-1023",
    category: "Product Sales",
    customer: "Jane Doe",
    methodOfPayment: "Credit Card",
    chequeNumber: null,
    cardNumber: "411111******1111",
    name: "Jane Doe",
    expMonth: "07",
    expYear: "2027",
    transactionNumber: "TXN-789456",
    otherPaymentMethod: null,
    amount: null,
  },
  {
    dateReceived: "2025-07-02",
    invoice_number: "INV-1024",
    category: "Consulting Services",
    customer: "John Smith",
    methodOfPayment: "Cheque",
    chequeNumber: "CHQ-2033",
    cardNumber: null,
    name: "John Smith",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789457",
    otherPaymentMethod: null,
    amount: null,
  },
  {
    dateReceived: "2025-07-03",
    invoice_number: "INV-1025",
    category: "Subscription",
    customer: "Acme Corp",
    methodOfPayment: "Other",
    chequeNumber: null,
    cardNumber: null,
    name: "Finance Dept",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789458",
    otherPaymentMethod: "Mobile Money",
    amount: 120.5,
  },
  {
    dateReceived: "2025-07-04",
    invoice_number: "INV-1026",
    category: "Maintenance",
    customer: "Sarah Connor",
    methodOfPayment: "Credit Card",
    chequeNumber: null,
    cardNumber: "550000******0004",
    name: "Sarah Connor",
    expMonth: "11",
    expYear: "2026",
    transactionNumber: "TXN-789459",
    otherPaymentMethod: null,
    amount: null,
  },
  {
    dateReceived: "2025-07-05",
    invoice_number: "INV-1027",
    category: "Installation",
    customer: "Mike Tyson",
    methodOfPayment: "Cheque",
    chequeNumber: "CHQ-2034",
    cardNumber: null,
    name: "Mike Tyson",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789460",
    otherPaymentMethod: null,
    amount: null,
  },
  {
    dateReceived: "2025-07-06",
    invoice_number: "INV-1028",
    category: "Product Sales",
    customer: "Emily Stone",
    methodOfPayment: "Other",
    chequeNumber: null,
    cardNumber: null,
    name: "Emily Stone",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789461",
    otherPaymentMethod: "Cash",
    amount: 75.0,
  },
  {
    dateReceived: "2025-07-07",
    invoice_number: "INV-1029",
    category: "Consulting Services",
    customer: "Tech Solutions Ltd.",
    methodOfPayment: "Credit Card",
    chequeNumber: null,
    cardNumber: "340000******7890",
    name: "Bill Manager",
    expMonth: "05",
    expYear: "2028",
    transactionNumber: "TXN-789462",
    otherPaymentMethod: null,
    amount: null,
  },
  {
    dateReceived: "2025-07-08",
    invoice_number: "INV-1030",
    category: "Subscription",
    customer: "StartUp Hub",
    methodOfPayment: "Other",
    chequeNumber: null,
    cardNumber: null,
    name: "Account Admin",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789463",
    otherPaymentMethod: "Bank Transfer",
    amount: 200.0,
  },
  {
    dateReceived: "2025-07-09",
    invoice_number: "INV-1031",
    category: "Support",
    customer: "Robert Green",
    methodOfPayment: "Cheque",
    chequeNumber: "CHQ-2035",
    cardNumber: null,
    name: "Robert Green",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789464",
    otherPaymentMethod: null,
    amount: null,
  },
  {
    dateReceived: "2025-07-10",
    invoice_number: "INV-1032",
    category: "Product Sales",
    customer: "Lisa Monroe",
    methodOfPayment: "Other",
    chequeNumber: null,
    cardNumber: null,
    name: "Lisa Monroe",
    expMonth: null,
    expYear: null,
    transactionNumber: "TXN-789465",
    otherPaymentMethod: "Mobile Money",
    amount: 99.99,
  },
];

export interface PaymentReceivedInterface {
  dateReceived: string;
  invoice_number: string;
  category: string;
  customer: string;
  methodOfPayment: "Credit Card" | "Cheque" | "Other";
  chequeNumber: string | null;
  cardNumber: string | null;
  name: string;
  expMonth: string | null;
  expYear: string | null;
  transactionNumber: string;
  otherPaymentMethod: string | null;
  amount: number | null;
}

export const invoiceOptionsList = [
  { name: "INV-1023", id: "INV-1023" },
  { name: "INV-1024", id: "INV-1024" },
  { name: "INV-1025", id: "INV-1025" },
  { name: "INV-1026", id: "INV-1026" },
  { name: "INV-1027", id: "INV-1027" },
  { name: "INV-1028", id: "INV-1028" },
  { name: "INV-1029", id: "INV-1029" },
  { name: "INV-1030", id: "INV-1030" },
  { name: "INV-1031", id: "INV-1031" },
  { name: "INV-1032", id: "INV-1032" },
];

export const invoicePaymentMethodOptionsList = [
  { name: "Cheque", id: "Cheque" },
  { name: "Credit Card", id: "Credit Card" },
  { name: "Electronic Transfer", id: "Electronic Transfer" },
  { name: "Other", id: "Other" },
];
