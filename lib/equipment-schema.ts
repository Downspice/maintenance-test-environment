import { z } from "zod"

export const equipmentSchema = z.object({
  // Identification
  name: z.string().min(1, "Unit # is required"),
  serialNumber: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  equipmentType: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  license: z.string().optional(),
  renewalDate: z.date().optional(),
  renewalInterval: z.number().min(1).default(1),
  stateProv: z.string().optional(),

  // Meters
  hasMeter: z.boolean().default(false),
  primaryMeterUnits: z.string().optional(),
  primaryMeter: z.number().min(0).default(0),
  secondaryMeterUnits: z.string().optional(),
  secondaryMeter: z.number().min(0).default(0),

  // Assignment
  status: z.string().default("Active"),
  soldDate: z.date().optional(),
  soldTo: z.string().optional(),
  soldPrice: z.number().min(0).default(0),
  soldPrimaryMeter: z.number().min(0).optional(),
  soldSecondaryMeter: z.number().min(0).optional(),
  assigneeIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  maintenanceTemplateId: z.string().optional(),
  inspectionTemplateIds: z.array(z.string()).optional(),
  parentId: z.string().optional(),

  // Purchase
  purchaseDate: z.date().optional(),
  vendorId: z.string().optional(),
  purchasePrice: z.number().min(0).default(0),
  purchasePrimaryMeter: z.number().min(0).optional(),
  purchaseSecondaryMeter: z.number().min(0).optional(),
  salvagePrice: z.number().min(0).default(0),
  depreciationLifeMonths: z.number().min(0).default(0),

  // Warranties
  warrantyDescription: z.string().default("Primary"),
  warrantyExpirationDate: z.date().optional(),
  warrantyExpirationMeter: z.number().min(0).optional(),
  secondaryWarrantyDescription: z.string().default("Secondary"),
  secondaryWarrantyExpirationDate: z.date().optional(),
  secondaryWarrantyExpirationMeter: z.number().min(0).optional(),

  // Additional Details
  mviDate: z.date().optional(),
  mviInterval: z.number().min(1).default(1),
  ownership: z.string().default("Owned"),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  weight: z.string().optional(),
  grossWeight: z.string().optional(),
  grossWeightRating: z.string().optional(),
  fuelCapacity: z.number().min(0).optional(),
  fuelVolumeUnits: z.string().default("Gallons"),
  fuelType: z.string().optional(),
  annualOperatingBudget: z.number().min(0).default(0),
  notes: z.string().optional(),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>

// Mock data for dropdowns
export const makeOptions = [
  { value: "ford", label: "Ford" },
  { value: "chevrolet", label: "Chevrolet" },
  { value: "caterpillar", label: "Caterpillar" },
  { value: "john-deere", label: "John Deere" },
  { value: "freightliner", label: "Freightliner" },
]

export const modelOptions = [
  { value: "f-150", label: "F-150" },
  { value: "silverado", label: "Silverado" },
  { value: "320d", label: "320D" },
  { value: "cascadia", label: "Cascadia" },
]

export const equipmentTypeOptions = [
  { value: "truck", label: "Truck" },
  { value: "excavator", label: "Excavator" },
  { value: "generator", label: "Generator" },
  { value: "trailer", label: "Trailer" },
]

export const countryOptions = [
  { value: "ghana", label: "Ghana" },
  { value: "india", label: "India" },
  { value: "saudi", label: "Saudi Arabia" },
  { value: "togo", label: "Togo" },
]

export const colorOptions = [
  { value: "white", label: "White" },
  { value: "black", label: "Black" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
]

export const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Sold", label: "Sold" },
  { value: "Maintenance", label: "Maintenance" },
]

export const employeeTypeOptions = [
  { value: "Active", label: "Driver" },
  { value: "Inactive", label: "Manager" },
  { value: "Sold", label: "Supervisor" },
  { value: "Maintenance", label: "Technician" },
]

export const meterUnitsOptions = [
  { value: "None", label: "None" },
  { value: "Miles", label: "Miles" },
  { value: "Kilometers", label: "Kilometers" },
  { value: "Hours", label: "Hours" },
]

export const assigneeOptions = [
  { value: "user-1", label: "John Smith", group: "Employees" },
  { value: "user-2", label: "Jane Doe", group: "Employees" },
  { value: "vendor-1", label: "ABC Company", group: "Vendors" },
]

export const accidentOptions = [
  { value: "user-1", label: "Car crash" },
  { value: "user-2", label: "Over Heating" },
  { value: "vendor-1", label: "Stolen" },
]
export const expenseOptions = [
  { value: "130878", label: "Expense" },
  { value: "130879", label: "Insurance Payment" },
  { value: "130870", label: "Lease Payment" },
  { value: "130873", label: "Loan Payment" },
]

export const periodOptionList = [
  { value: "week", label: "week" },
  { value: "month", label: "month" },
  { value: "year", label: "year" },
]
export const categoryOptions = [
  { value: "130878", label: "Location #1 | Fleet Equipment" },
  { value: "130879", label: "Location #2 | Construction Equipment" },
]

export const vendorOptions = [
  { value: "vendor-1", label: "ABC Equipment Co." },
  { value: "vendor-2", label: "XYZ Motors" },
]

export const ownershipOptions = [
  { value: "Owned", label: "Owned" },
  { value: "Leased", label: "Leased" },
  { value: "Rented", label: "Rented" },
]

export const fuelUnitsOptions = [
  { value: "Gallons", label: "Gallons" },
  { value: "Liters", label: "Liters" },
  { value: "None", label: "None" },
]

export const fuelTypeOptions = [
  { value: "diesel", label: "Diesel" },
  { value: "gasoline", label: "Gasoline" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
]

export const shipViaOptions = [
  { value: "Ground", label: "Ground" },
  { value: "Air", label: "Air" },
  { value: "UPS", label: "UPS" },
  { value: "UPSA", label: "UPSA" },
]

export const warehouseOptions = [
  { value: "house1", label: "Warehouse 1" },
  { value: "house2", label: "Warehouse Abeka" },
  { value: "electric", label: "Warehouse Ashaiman" },
  { value: "hybrid", label: "Warehouse Kokomlemle" },
]

export const substituteOptions = [
  { "label": "10101 light bulb", "value": "3652869" },
  { "label": "15 PH2500", "value": "3652870" },
  { "label": "17B45 Blade", "value": "3652871" },
  { "label": "2837 Pump Gasket", "value": "3652872" },
  { "label": "329857 Drive Belt", "value": "3652873" },
  { "label": "404040 V Belt", "value": "3652874" },
  { "label": "543-2 Oil", "value": "3652875" },
  { "label": "987 washer fluid", "value": "3652876" },
  { "label": "B48592 Quick Connect", "value": "3652877" },
  { "label": "BG-3381 Ball Valve", "value": "3652878" },
  { "label": "BK-152F2 Bearings", "value": "3652879" },
  { "label": "DB-685 Air Filter", "value": "3652880" },
  { "label": "FRD110 Caution Tape", "value": "3652881" },
  { "label": "HA-127WH Headlight Assembly", "value": "3652882" },
  { "label": "N4588829A General Purpose Toggle Switch", "value": "3652883" },
  { "label": "PR19026445 Air Filter", "value": "3652884" },
  { "label": "SM-7109 Check Valve", "value": "3652885" }
]

