import TabbedMenuEditor from "@/components/views/ChoiceView";

export default function ChoiceList() {
  return (
    <>
      <h4>Choice List</h4>
      <TabbedMenuEditor tabs={tabData} contents={contentData} />
    </>
  );
}

const tabData = [
  { id: "accidentTypes", name: "Accident Types" },
  {
    id: "assignment",
    name: "Assignment",
    subs: [
      { id: "destinations", name: "Destinations" },
      { id: "types", name: "Types" },
    ],
  },
  { id: "costCentres", name: "Cost Centres" },
  {
    id: "employees",
    name: "Employees",
    subs: [
      { id: "categories", name: "Categories" },
      { id: "renewals", name: "Renewals" },
      { id: "status", name: "Status" },
      { id: "types", name: "Types" },
    ],
  },
  {
    id: "equipments",
    name: "Equipments",
    subs: [
      { id: "colors", name: "Colors" },
      { id: "masks", name: "Masks" },
      { id: "meterTypes", name: "Meter Types" },
      { id: "models", name: "Models" },
      { id: "renewals", name: "Renewals" },
      { id: "status", name: "Status" },
      { id: "types", name: "Types" },
    ],
  },
  {
    id: "fluids",
    name: "Fluids",
    subs: [
      { id: "types", name: "Types" },
      { id: "unitTypes", name: "Unit Types" },
    ],
  },
  { id: "generalExpenseTypes", name: "General Expense Types" },
  {
    id: "inventory",
    name: "Inventory",
    subs: [
      { id: "categories", name: "Categories" },
      { id: "manufacturers", name: "Manufacturers" },
      { id: "unitTypes", name: "Unit Types" },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    subs: [
      { id: "repairTypes", name: "Repair Types" },
      { id: "repairs", name: "Repairs" },
      { id: "taskTypes", name: "Task Types" },
    ],
  },
  {
    id: "purchaseOrders",
    name: "Purchase Orders",
    subs: [
      { id: "shippingMethods", name: "Shipping Methods" },
      { id: "terms", name: "Terms" },
    ],
  },
  { id: "vendorTypes", name: "Vendor Types" },
  {
    id: "workOrders",
    name: "Work Orders",
    subs: [
      { id: "customStatus", name: "Custom Status" },
      { id: "types", name: "Types" },
    ],
  },
];

const contentData = {
  accidentTypes: [
    { value: "rear-end", label: "Rear-End Collision" },
    { value: "side-swipe", label: "Side Swipe" },
  ],
  "assignment:destinations": [
    { value: "warehouse", label: "Warehouse" },
    { value: "field", label: "Field Site" },
  ],
  "assignment:types": [
    { value: "delivery", label: "Delivery" },
    { value: "pickup", label: "Pickup" },
  ],
  costCentres: [
    { value: "logistics", label: "Logistics" },
    { value: "operations", label: "Operations" },
  ],
  "employees:categories": [
    { value: "full-time", label: "Full-Time" },
    { value: "contractor", label: "Contractor" },
  ],
  "employees:renewals": [
    { value: "cert-renewal", label: "Certificate Renewal" },
  ],
  "employees:status": [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  "employees:types": [
    { value: "driver", label: "Driver" },
    { value: "technician", label: "Technician" },
  ],
  "equipments:colors": [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
  ],
  "equipments:masks": [{ value: "standard", label: "Standard Mask" }],
  "equipments:meterTypes": [
    { value: "digital", label: "Digital" },
    { value: "analog", label: "Analog" },
  ],
  "equipments:models": [
    { value: "honda-x", label: "Honda X" },
    { value: "cat-d5", label: "Caterpillar D5" },
  ],
  "equipments:renewals": [{ value: "inspection", label: "Annual Inspection" }],
  "equipments:status": [
    { value: "available", label: "Available" },
    { value: "in-service", label: "In Service" },
  ],
  "equipments:types": [
    { value: "vehicle", label: "Vehicle" },
    { value: "tool", label: "Tool" },
  ],
  "fluids:types": [
    { value: "engine-oil", label: "Engine Oil" },
    { value: "brake-fluid", label: "Brake Fluid" },
  ],
  "fluids:unitTypes": [
    { value: "litre", label: "Litre" },
    { value: "gallon", label: "Gallon" },
  ],
  generalExpenseTypes: [
    { value: "travel", label: "Travel" },
    { value: "fuel", label: "Fuel" },
  ],
  "inventory:categories": [
    { value: "spare-parts", label: "Spare Parts" },
    { value: "tools", label: "Tools" },
  ],
  "inventory:manufacturers": [
    { value: "bosch", label: "Bosch" },
    { value: "dewalt", label: "DeWalt" },
  ],
  "inventory:unitTypes": [
    { value: "piece", label: "Piece" },
    { value: "box", label: "Box" },
  ],
  "maintenance:repairTypes": [
    { value: "electrical", label: "Electrical Repair" },
    { value: "mechanical", label: "Mechanical Repair" },
  ],
  "maintenance:repairs": [{ value: "fix-headlight", label: "Fix Headlight" }],
  "maintenance:taskTypes": [
    { value: "routine", label: "Routine Task" },
    { value: "emergency", label: "Emergency Task" },
  ],
  "purchaseOrders:shippingMethods": [
    { value: "air", label: "Air Freight" },
    { value: "sea", label: "Sea Freight" },
  ],
  "purchaseOrders:terms": [
    { value: "net-30", label: "Net 30 Days" },
    { value: "cod", label: "Cash on Delivery" },
  ],
  vendorTypes: [
    { value: "local", label: "Local Vendor" },
    { value: "international", label: "International Vendor" },
  ],
  "workOrders:customStatus": [
    { value: "awaiting", label: "Awaiting Approval" },
    { value: "completed", label: "Completed" },
  ],
  "workOrders:types": [
    { value: "preventive", label: "Preventive" },
    { value: "corrective", label: "Corrective" },
  ],
};
