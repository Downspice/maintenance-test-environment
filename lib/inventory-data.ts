export interface InventoryDataInterface {
  id: number;
  part_number: string;
  name: string;
  category: string | null;
  manufacturers: string;
  supplier_part_numbers: string;
  quantity: number;
  order_quantity: number;
  quantity_sort: number;
  unit_cost: number;
  bin: string | null;
  vendor_links: string[] | null;
  vendor_names: string[];
  status: string;
  description: string | null;
  unit_type: string | null;
  reorder_quantity: number;
  pending_quantity: number;
  maximum_quantity: number;
  markup_rate: number;
  fuel_type: string | null;
  low_stock_level: number;
  barcodes: string;
  substitute_for_part_numbers: string;
  custom_fields: Record<string, any>;
  warehouse_name: string;
  tracking_enabled: string;
  url: string;
  purchase_order?: string;
}


export const InventoryData:InventoryDataInterface[]=[
  {
    "id": 4248679,
    "part_number": "404040",
    purchase_order: "po 5605",
    "name": "V Belt",
    "category": null,
    "manufacturers": "",
    "supplier_part_numbers": "",
    "quantity": 0,
    "order_quantity": 4,
    "quantity_sort": 0,
    "unit_cost": 45.0,
    "bin": null,
    "vendor_links": null,
    "vendor_names": [],
    "status": "Ordered",
    "description": null,
    "unit_type": null,
    "reorder_quantity": 4,
    "pending_quantity": 4,
    "maximum_quantity": 0,
    "markup_rate": 0,
    "fuel_type": null,
    "low_stock_level": 1,
    "barcodes": "",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #1",
    "tracking_enabled": "Yes",
    "url": "/inventories/4248679"
  },
  {
    "id": 4248680,
    "part_number": "505050",
    "name": "Oil Filter",
    "category": "Filters",
    "manufacturers": "FilterCo",
    "supplier_part_numbers": "FILT-5050",
    "quantity": 12,
    "order_quantity": 0,
    "quantity_sort": 12,
    "unit_cost": 8.5,
    "bin": "A1-2",
    "vendor_links": ["https://vendor.example.com/filterco"],
    "vendor_names": ["FilterCo"],
    "status": "In Stock",
    "description": "Standard engine oil filter",
    "unit_type": "Each",
    "reorder_quantity": 10,
    "pending_quantity": 0,
    "maximum_quantity": 50,
    "markup_rate": 0.2,
    "fuel_type": null,
    "low_stock_level": 5,
    "barcodes": "123456789012",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #2",
    "tracking_enabled": "No",
    "url": "/inventories/4248680"
  },
  {
    "id": 4248681,
    "part_number": "606060",
    "name": "Hydraulic Hose",
    "category": "Hoses",
    "manufacturers": "HydroTech",
    "supplier_part_numbers": "HHOSE-6060",
    "quantity": 5,
    "order_quantity": 2,
    "quantity_sort": 5,
    "unit_cost": 120.0,
    "bin": "B2-4",
    "vendor_links": [],
    "vendor_names": ["HydroTech"],
    "status": "PO Pending",
    "description": "High-pressure hydraulic hose",
    "unit_type": "Meter",
    "reorder_quantity": 10,
    "pending_quantity": 2,
    "maximum_quantity": 20,
    "markup_rate": 0.15,
    "fuel_type": null,
    "low_stock_level": 3,
    "barcodes": "",
    "substitute_for_part_numbers": "606061",
    "custom_fields": {},
    "warehouse_name": "Warehouse #1",
    "tracking_enabled": "Yes",
    purchase_order: "po 56405",

    "url": "/inventories/4248681"
  },
  {
    "id": 4248682,
    "part_number": "707070",
    "name": "Spark Plug",
    "category": "Ignition",
    "manufacturers": "SparkMax",
    "supplier_part_numbers": "SP-7070",
    "quantity": 30,
    "order_quantity": 0,
    "quantity_sort": 30,
    "unit_cost": 3.75,
    "bin": "C3-1",
    "vendor_links": ["https://sparkmax.example.com"],
    "vendor_names": ["SparkMax"],
    "status": "In Stock",
    "description": "High-performance spark plug",
    "unit_type": "Each",
    "reorder_quantity": 25,
    "pending_quantity": 0,
    "maximum_quantity": 100,
    "markup_rate": 0.25,
    "fuel_type": null,
    "low_stock_level": 10,
    "barcodes": "987654321098",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #3",
    "tracking_enabled": "No",
    "url": "/inventories/4248682"
  },
  {
    "id": 4248683,
    "part_number": "808080",
    "name": "Brake Pad",
    "category": "Brakes",
    "manufacturers": "StopRight",
    "supplier_part_numbers": "BP-8080",
    "quantity": 15,
    "order_quantity": 5,
    "quantity_sort": 15,
    "unit_cost": 34.95,
    "bin": "D1-3",
    "vendor_links": [],
    "vendor_names": ["StopRight"],
    "status": "Ordered",
    "description": "Front brake pad set",
    "unit_type": "Set",
    "reorder_quantity": 10,
    "pending_quantity": 5,
    "maximum_quantity": 60,
    "markup_rate": 0.3,
    "fuel_type": null,
    "low_stock_level": 5,
    "barcodes": "",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #2",
    "tracking_enabled": "Yes",
    "url": "/inventories/4248683"
  },
  {
    "id": 4248684,
    "part_number": "909090",
    "name": "Coolant",
    "category": "Fluids",
    "manufacturers": "CoolFlow",
    "supplier_part_numbers": "COOL-9090",
    "quantity": 80,
    purchase_order: "po 560445",

    "order_quantity": 0,
    "quantity_sort": 80,
    "unit_cost": 12.0,
    "bin": "E2-5",
    "vendor_links": ["https://coolflow.example.com"],
    "vendor_names": ["CoolFlow"],
    "status": "In Stock",
    "description": "Engine coolant 5L",
    "unit_type": "Bottle",
    "reorder_quantity": 50,
    "pending_quantity": 0,
    "maximum_quantity": 200,
    "markup_rate": 0.18,
    "fuel_type": null,
    "low_stock_level": 20,
    "barcodes": "",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #4",
    "tracking_enabled": "No",
    "url": "/inventories/4248684"
  },
  {
    "id": 4248685,
    "part_number": "101010",
    "name": "Air Filter",
    "category": "Filters",
    "manufacturers": "AirPure",
    "supplier_part_numbers": "AF-1010",
    "quantity": 25,
    "order_quantity": 0,
    "quantity_sort": 25,
    "unit_cost": 15.75,
    "bin": "F1-1",
    "vendor_links": ["https://airpure.example.com"],
    "vendor_names": ["AirPure"],
    "status": "In Stock",
    "description": "Cabin air filter",
    "unit_type": "Each",
    "reorder_quantity": 20,
    "pending_quantity": 0,
    "maximum_quantity": 100,
    "markup_rate": 0.12,
    "fuel_type": null,
    "low_stock_level": 10,
    "barcodes": "555666777888",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #1",
    "tracking_enabled": "Yes",
    "url": "/inventories/4248685"
  },
  {
    "id": 4248686,
    "part_number": "111111",
    "name": "Coolant Hose",
    "category": "Hoses",
    "manufacturers": "CoolLink",
    "supplier_part_numbers": "CH-1111",
    "quantity": 8,
    "order_quantity": 3,
    "quantity_sort": 8,
    "unit_cost": 22.5,
    "bin": "B3-2",
    "vendor_links": [],
    "vendor_names": ["CoolLink"],
    "status": "PO Pending",
    "description": "Rubber coolant hose",
    "unit_type": "Each",
    "reorder_quantity": 12,
    "pending_quantity": 3,
    "maximum_quantity": 30,
    "markup_rate": 0.2,
    "fuel_type": null,
    "low_stock_level": 4,
    "barcodes": "",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #3",
    "tracking_enabled": "Yes",
    "url": "/inventories/4248686"
  },
  {
    "id": 4248687,
    "part_number": "121212",
    "name": "Fuel Pump",
    "category": "Fuel System",
    "manufacturers": "FuelFlow",
    "supplier_part_numbers": "FP-1212",
    "quantity": 3,
    "order_quantity": 1,
    "quantity_sort": 3,
    "unit_cost": 150.0,
    "bin": "G1-4",
    "vendor_links": ["https://fuelflow.example.com"],
    "vendor_names": ["FuelFlow"],
    "status": "Ordered",
    "description": "Electric fuel pump",
    "unit_type": "Each",
    "reorder_quantity": 2,
    "pending_quantity": 1,
    "maximum_quantity": 10,
    "markup_rate": 0.22,
    "fuel_type": "Gasoline",
    "low_stock_level": 2,
    "barcodes": "",
    "substitute_for_part_numbers": "",
    "custom_fields": {},
    "warehouse_name": "Warehouse #4",
    "tracking_enabled": "Yes",
    "url": "/inventories/4248687"
  }
]

export  const equipmentManufacturerOptions = [
  { label: "Caterpillar", value: "caterpillar" },
  { label: "Cummins", value: "cummins" },
  { label: "Schneider Electric", value: "schneider-electric" },
  { label: "Siemens", value: "siemens" },
  { label: "General Electric (GE)", value: "ge" },
  { label: "Mikano", value: "mikano" },
  { label: "ABB", value: "abb" },
  { label: "LG", value: "lg" },
  { label: "Samsung", value: "samsung" },
  { label: "Huawei", value: "huawei" }
];

export const unitOptions = [
  { label: "Each", value: "each" },
  { label: "Gallon", value: "gallon" },
  { label: "Pair", value: "pair" },
  { label: "Pint", value: "pint" },
  { label: "Quart", value: "quart" },
  { label: "Set", value: "set" },
  { label: "Tube", value: "tube" }
];

export const inventoryMovement = [
  { label: "LIFO", value: "LIFO" },
  { label: "FIFO", value: "FIFO" },
]


export interface EquipmentPartInterface {
  partNumber: string;
  name: string;
  manufacturer: string;
  description: string;
}
export const partOptions=[
  {
    "partNumber": "PRT-00123",
    "name": "Compressor Valve Kit",
    "manufacturer": "Siemens",
    "description": "High-pressure valve kit suitable for industrial air compressors. Compatible with models X100-X300."
  },
  {
    "partNumber": "PRT-00456",
    "name": "Hydraulic Filter",
    "manufacturer": "Caterpillar",
    "description": "OEM replacement hydraulic oil filter for heavy-duty equipment."
  },
  {
    "partNumber": "PRT-00789",
    "name": "Circuit Breaker 3P",
    "manufacturer": "Schneider Electric",
    "description": "3-pole thermal magnetic breaker, 400V, 32A, with overload protection."
  },
  {
    "partNumber": "PRT-00987",
    "name": "Voltage Regulator",
    "manufacturer": "ABB",
    "description": "Compact automatic voltage regulator for small generators, 220V input."
  },
  {
    "partNumber": "PRT-00234",
    "name": "Air Filter Element",
    "manufacturer": "Cummins",
    "description": "Heavy-duty air intake filter for diesel generators, model AFE-500."
  },
  {
    "partNumber": "PRT-00567",
    "name": "Cooling Fan Assembly",
    "manufacturer": "GE",
    "description": "Industrial-grade axial cooling fan assembly for transformers."
  },
  {
    "partNumber": "PRT-00876",
    "name": "Solar Inverter Board",
    "manufacturer": "Huawei",
    "description": "Replacement board for 5kW solar inverters. Compatible with FusionSolar series."
  },
  {
    "partNumber": "PRT-00321",
    "name": "Oil Pressure Sensor",
    "manufacturer": "Mikano",
    "description": "Sensor for monitoring engine oil pressure, 0-100 PSI range."
  },
  {
    "partNumber": "PRT-00654",
    "name": "Contactor Relay",
    "manufacturer": "LG",
    "description": "AC contactor relay, 3-phase, 24V coil, suitable for HVAC systems."
  },
  {
    "partNumber": "PRT-00911",
    "name": "Terminal Block",
    "manufacturer": "Phoenix Contact",
    "description": "Modular terminal block for control panel wiring, 16A rated."
  }
]
