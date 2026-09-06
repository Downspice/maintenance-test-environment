
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
 
export const invoicePaymentMethodOptionsList = [
  { name: "Cheque", id: "Cheque" },
  { name: "Credit Card", id: "Credit Card" },
  { name: "Electronic Transfer", id: "Electronic Transfer" },
  { name: "Other", id: "Other" },
];
