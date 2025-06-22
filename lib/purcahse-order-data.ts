export interface  PurchaseOrderInterface {
  sequential_id: number;
  prefix_title: string;
  purchase_order_title: string;
  created_on: string;
  required_on: string | null;
  vendor_name: string | null;
  warehouse_name: string;
  status: string;
  invoice_number: string | null;
  buyer_name: string;
  work_order_sequential_id: number | null;
  work_order_prefix_title: string;
  terms: string | null;
  ship_via: string | null;
  subtotal: number;
  freight_cost: number;
  total_cost: number;
  id: number;
  url: string;
};
export const PurchaseOrderOptions=[
  {
    value:"1",
    label:"PO 4004"
  },
  {
    value:"3",
    label:"PO 5004"
  },
  {
    value:"1",
    label:"PO 2004"
  },
]
export const PurchaseOrderData:PurchaseOrderInterface[]=[
  {
    "sequential_id": 1000,
    "prefix_title": "1000",
    "purchase_order_title": "1000",
    "created_on": "2025-06-11",
    "required_on": "2025-06-11",
    "vendor_name": "Davis Plumbing",
    "warehouse_name": "Warehouse #2",
    "status": "Requisition",
    "invoice_number": null,
    "buyer_name": "David Cooke",
    "work_order_sequential_id": null,
    "work_order_prefix_title": "",
    "terms": "Wire X-Fer",
    "ship_via": "Expedited",
    "subtotal": 1290.00,
    "freight_cost": 0.00,
    "total_cost": 1377.08,
    "id": 700802,
    "url": "/purchase_orders/1000"
  },
  {
    "sequential_id": 1001,
    "prefix_title": "1001",
    "purchase_order_title": "1001",
    "created_on": "2025-06-11",
    "required_on": null,
    "vendor_name": null,
    "warehouse_name": "Warehouse #1",
    "status": "Requisition",
    "invoice_number": null,
    "buyer_name": "",
    "work_order_sequential_id": null,
    "work_order_prefix_title": "",
    "terms": null,
    "ship_via": null,
    "subtotal": 180.00,
    "freight_cost": 0.00,
    "total_cost": 180.00,
    "id": 700803,
    "url": "/purchase_orders/1001"
  },
  {
    "sequential_id": 1002,
    "prefix_title": "1002",
    "purchase_order_title": "1002",
    "created_on": "2025-06-10",
    "required_on": "2025-06-15",
    "vendor_name": "Ace Supplies",
    "warehouse_name": "Warehouse #2",
    "status": "Ordered",
    "invoice_number": "INV-345",
    "buyer_name": "Linda Ray",
    "work_order_sequential_id": 523,
    "work_order_prefix_title": "WO-523",
    "terms": "Net 30",
    "ship_via": "Ground",
    "subtotal": 750.00,
    "freight_cost": 25.00,
    "total_cost": 775.00,
    "id": 700804,
    "url": "/purchase_orders/1002"
  },
  {
    "sequential_id": 1003,
    "prefix_title": "1003",
    "purchase_order_title": "1003",
    "created_on": "2025-06-10",
    "required_on": "2025-06-12",
    "vendor_name": "BuildRight Ltd.",
    "warehouse_name": "Warehouse #3",
    "status": "Approval",
    "invoice_number": null,
    "buyer_name": "Michael Scott",
    "work_order_sequential_id": 524,
    "work_order_prefix_title": "WO-524",
    "terms": "Due on Receipt",
    "ship_via": "Air",
    "subtotal": 520.00,
    "freight_cost": 30.00,
    "total_cost": 550.00,
    "id": 700805,
    "url": "/purchase_orders/1003"
  },
  {
    "sequential_id": 1004,
    "prefix_title": "1004",
    "purchase_order_title": "1004",
    "created_on": "2025-06-09",
    "required_on": null,
    "vendor_name": "Westwood Electrical",
    "warehouse_name": "Warehouse #1",
    "status": "Open",
    "invoice_number": "INV-678",
    "buyer_name": "Sarah Lang",
    "work_order_sequential_id": null,
    "work_order_prefix_title": "",
    "terms": "Net 15",
    "ship_via": "Courier",
    "subtotal": 1020.00,
    "freight_cost": 40.00,
    "total_cost": 1060.00,
    "id": 700806,
    "url": "/purchase_orders/1004"
  },
  {
    "sequential_id": 1005,
    "prefix_title": "1005",
    "purchase_order_title": "1005",
    "created_on": "2025-06-08",
    "required_on": "2025-06-14",
    "vendor_name": "GreenTech Parts",
    "warehouse_name": "Warehouse #4",
    "status": "Closed",
    "invoice_number": "INV-893",
    "buyer_name": "Kevin Malone",
    "work_order_sequential_id": 525,
    "work_order_prefix_title": "WO-525",
    "terms": "Prepaid",
    "ship_via": "Truck",
    "subtotal": 1340.00,
    "freight_cost": 50.00,
    "total_cost": 1390.00,
    "id": 700807,
    "url": "/purchase_orders/1005"
  },
  {
    "sequential_id": 1006,
    "prefix_title": "1006",
    "purchase_order_title": "1006",
    "created_on": "2025-06-08",
    "required_on": "2025-06-18",
    "vendor_name": "TechSource",
    "warehouse_name": "Warehouse #2",
    "status": "Received",
    "invoice_number": null,
    "buyer_name": "Pam Beesly",
    "work_order_sequential_id": null,
    "work_order_prefix_title": "",
    "terms": "COD",
    "ship_via": "Express",
    "subtotal": 920.00,
    "freight_cost": 20.00,
    "total_cost": 940.00,
    "id": 700808,
    "url": "/purchase_orders/1006"
  }
]

