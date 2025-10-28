import { z } from "zod"

export const equipmentSchema = z.object({
  // Identification
  name: z.string().min(1, "Unit # is required"),
  serial_number: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().optional(),
  equipmentType: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  license: z.string().optional(),
  renewalDate: z.date().optional(),
  renewalInterval: z.coerce.number().min(1).default(1),
  stateProv: z.string().optional(),

  // Meters
  hasMeter: z.boolean().default(false),
  primaryMeterUnits: z.string().optional(),
  primaryMeter: z.coerce.number().min(0).default(0),
  secondaryMeterUnits: z.string().optional(),
  secondaryMeter: z.coerce.number().min(0).default(0),

  // Assignment
  status: z.string().default("Active"),
  soldDate: z.date().optional(),
  soldTo: z.string().optional(),
  soldPrice: z.coerce.number().min(0).default(0),
  soldPrimaryMeter: z.coerce.number().min(0).optional(),
  soldSecondaryMeter: z.coerce.number().min(0).optional(),
  assigneeIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  maintenanceTemplateId: z.string().optional(),
  inspectionTemplateIds: z.array(z.string()).optional(),
  parentId: z.string().optional(),

  // Purchase
  purchaseDate: z.date().optional(),
  vendorId: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).default(0),
  purchasePrimaryMeter: z.coerce.number().min(0).optional(),
  purchaseSecondaryMeter: z.coerce.number().min(0).optional(),
  salvagePrice: z.coerce.number().min(0).default(0),
  depreciationLifeMonths: z.coerce.number().min(0).default(0),

  // Warranties
  warrantyDescription: z.string().default("Primary"),
  warrantyExpirationDate: z.date().optional(),
  warrantyExpirationMeter: z.coerce.number().min(0).optional(),
  secondaryWarrantyDescription: z.string().default("Secondary"),
  secondaryWarrantyExpirationDate: z.date().optional(),
  secondaryWarrantyExpirationMeter: z.coerce.number().min(0).optional(),

  // Additional Details
  mviDate: z.date().optional(),
  mviInterval: z.coerce.number().min(1).default(1),
  ownership: z.string().default("Owned"),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  weight: z.string().optional(),
  grossWeight: z.string().optional(),
  grossWeightRating: z.string().optional(),
  fuelCapacity: z.coerce.number().min(0).optional(),
  fuelVolumeUnits: z.string().default("Gallons"),
  fuelType: z.string().optional(),
  annualOperatingBudget: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>

export const assigneeOptions = [
  { id: "user-1", name: "John Smith", group: "Employees" },
  { id: "user-2", name: "Jane Doe", group: "Employees" },
  { id: "vendor-1", name: "ABC Company", group: "Vendors" },
]

export const accidentOptions = [
  { id: "user-1", name: "Car crash" },
  { id: "user-2", name: "Over Heating" },
  { id: "vendor-1", name: "Stolen" },
]
export const expenseOptions = [
  { id: "130878", name: "Expense" },
  { id: "130879", name: "Insurance Payment" },
  { id: "130870", name: "Lease Payment" },
  { id: "130873", name: "Loan Payment" },
]

export const periodOptionList = [
  { id: "week", name: "week" },
  { id: "month", name: "month" },
  { id: "year", name: "year" },
]
export const categoryOptions = [
  { id: "130878", name: "Location #1 | Fleet Equipment" },
  { id: "130879", name: "Location #2 | Construction Equipment" },
]

export const vendorOptions = [
  { id: "vendor-1", name: "ABC Equipment Co." },
  { id: "vendor-2", name: "XYZ Motors" },
]

export const ownershipOptions = [
  { id: "Owned", name: "Owned" },
  { id: "Leased", name: "Leased" },
  { id: "Rented", name: "Rented" },
  { id: "Customer", name: "Customer" },
]

export const fuelUnitsOptions = [
  { id: "Gallons", name: "Gallons" },
  { id: "Liters", name: "Liters" },
  { id: "None", name: "None" },
]

export const fuelTypeOptions = [
  { id: "diesel", name: "Diesel" },
  { id: "gasoline", name: "Gasoline" },
  { id: "electric", name: "Electric" },
  { id: "hybrid", name: "Hybrid" },
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

