import { z } from "zod";

export const NotesSchema = z.object({
  notes: z.string().min(1, "Note is required"),
  createdAt: z.string(), // ISO string
  createdBy: z.string(),
});
export type NotesInterface = z.infer<typeof NotesSchema>;

export const AddLaborSchema = z
  .object({
    laborType: z.string().min(1, "Labor type is required"),
    technicianName: z.string().min(1, "Technician is required"),
    workPerformed: z.string().min(1, "Work performed is required"),
    costCenter: z.string().min(1, "Cost center is required"),
    laborRate: z.coerce.number().nonnegative("Labor rate must be ≥ 0"),
    hours: z.coerce.number().nonnegative("Hours must be ≥ 0"),
    totalCost: z.coerce.number().nonnegative("Total cost must be ≥ 0"),
    usage: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    totalCost: parseFloat((data.laborRate * data.hours).toFixed(2)),
  }));

export type AddLaborFormValues = z.infer<typeof AddLaborSchema>;

export const PartSchema = z.object({
  partNumber: z.string(),
  partName: z.string().optional(),
  name: z.string(),
  quantityUsed: z.coerce.number().nonnegative(),
  unitCost: z.coerce.number().nonnegative(),
  totalCost: z.coerce.number().nonnegative(),
});

export const AddMaintenanceInWorkOrderSchema = z.object({
  usage: z.enum(["Preventive", "Repair", "Other"], {
    required_error: "Maintenance type is required",
  }),
  complete: z.boolean().optional(),
  task: z.string().min(1, { message: "Task is required" }),
  taskType: z.string().min(1, { message: "Task Type is required" }),
  partsCost: z
    .string()
    .min(1, { message: "Parts Cost is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Parts Cost must be a valid number",
    }),
  laborCost: z.coerce
    .string()
    .min(1, { message: "Labor Cost is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Labor Cost must be a valid number",
    }),
  total: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Total must be a valid number",
    }),
  labor: AddLaborSchema,
  parts: z.array(PartSchema).optional(),
});

export const WorkOrderSchema = z.object({
  maintenance: z.array(AddMaintenanceInWorkOrderSchema).optional(),
  parts: z.array(PartSchema).optional(),
  labor: z.array(AddLaborSchema).optional(),
  notes: z.array(NotesSchema).optional(),
  workOrderNumber: z.string().min(1, "WO Number is required"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
  scheduledOn: z.date().optional(),
  dueOn: z.date().optional(),
  startedOn: z.date().optional(),
  completedOn: z.date().optional(),
  assigneeIds: z.array(z.string()).optional(),
  status: z.string(),
  workOrderType: z
    .enum(["preventive", "corrective", "inspection", "other"])
    .optional(),
  costCenter: z
    .enum(["preventive", "corrective", "inspection", "other"])
    .optional(),
  po: z.string().optional(),
  invoice: z.string().optional(),
  equipment: z.string().min(1, "Equipment is required"),
  hours: z.union([z.string(), z.number()]).optional(),
  workOrderTotal: z.coerce.number(),
  // If you're using dynamic fields
});
export type AddMaintenanceInWorkOrderInterface = z.infer<
  typeof AddMaintenanceInWorkOrderSchema
>;

export type Part = z.infer<typeof PartSchema>;

export const mockWorkOrders: z.infer<typeof WorkOrderSchema>[] = [
  {
    workOrderNumber: "WO-0001",
    status: "Open",
    workOrderTotal: 400,
    priority: "HIGH",
    scheduledOn: new Date("2025-07-20"),
    dueOn: new Date("2025-07-22"),
    startedOn: new Date("2025-07-21"),
    completedOn: undefined,
    assigneeIds: ["User-246964"],
    workOrderType: "preventive",
    costCenter: "preventive",
    po: "P-00123",
    invoice: "INV-88321",
    equipment: "1311827",
    hours: 5,
    maintenance: [
      {
        task: "Inspect filters",
        laborCost: "45.00",
        partsCost: "30.00",
        total: "75.00",
        complete: false,
        partsUsed: [],
      },
    ],
    parts: [
      {
        partNumber: "PRT-1001",
        name: "Air Filter",
        quantityUsed: 2,
        unitCost: 15.0,
        totalCost: 30.0,
      },
    ],
    labor: [
      {
        technicianName: "User-246964",
        hours: 1.5,
        laborRate: 30,
        totalCost: 45.0,
        laborType: "",
        workPerformed: "",
        costCenter: "",
      },
    ],
    notes: [
      {
        createdBy: "User-246964",
        notes: "Needs to be checked weekly.",
        createdAt: new Date("2025-07-20T10:30:00").toDateString(),
      },
    ],
    custom: {
      field1: "Custom value",
      field2: 123,
    },
  },
  {
    workOrderNumber: "WO-0002",
    status: "Open",
    priority: "NORMAL",
    workOrderTotal: 300,
    scheduledOn: new Date("2025-07-18"),
    dueOn: new Date("2025-07-19"),
    startedOn: new Date("2025-07-18"),
    completedOn: new Date("2025-07-19"),
    assigneeIds: ["Vendor-324051"],
    workOrderType: "corrective",
    costCenter: "corrective",
    po: "P-00124",
    invoice: "INV-88219",
    equipment: "1311827",
    hours: 3.5,
    maintenance: [
      {
        task: "Replace brake pads",
        laborCost: "60.00",
        partsCost: "80.00",
        total: "140.00",
        complete: true,
        partsUsed: [],
      },
    ],
    parts: [
      {
        partNumber: "PRT-2002",
        partName: "Brake Pad Set",
        quantityUsed: 1,
        unitCost: 80,
        totalCost: 80,
        name: "",
      },
    ],
    labor: [
      {
        technicianName: "Vendor-324051",
        hours: 2,
        laborRate: 30,
        totalCost: 60,
        laborType: "",
        workPerformed: "",
        costCenter: "",
      },
    ],
    notes: [],
    custom: {},
  },
  {
    workOrderNumber: "WO-0003",
    status: "Open",
    priority: "LOW",
    workOrderTotal: 440,
    scheduledOn: new Date("2025-07-25"),
    dueOn: new Date("2025-07-30"),
    startedOn: undefined,
    completedOn: undefined,
    assigneeIds: ["User-246964", "Vendor-324052"],
    workOrderType: "inspection",
    costCenter: "inspection",
    po: "P-00128",
    invoice: "",
    equipment: "1311827",
    hours: 2,
    maintenance: [],
    parts: [],
    labor: [],
    notes: [
      {
        createdBy: "User-246964",
        notes: "Schedule before next inspection round.",
        createdAt: new Date("2025-07-15T09:00:00"),
      },
    ],
    custom: {
      followUpRequired: true,
    },
  },
  {
    workOrderNumber: "WO-0004",
    status: "Open",
    priority: "URGENT",
    workOrderTotal: 300,
    scheduledOn: new Date("2025-07-15"),
    dueOn: new Date("2025-07-15"),
    startedOn: new Date("2025-07-15"),
    completedOn: new Date("2025-07-15"),
    assigneeIds: ["Vendor-324050"],
    workOrderType: "corrective",
    costCenter: "corrective",
    po: "P-001234",
    invoice: "INV-88777",
    equipment: "1311827",
    hours: 1.5,
    maintenance: [
      {
        task: "Fix coolant leak",
        laborCost: "90.00",
        partsCost: "40.00",
        total: "130.00",
        complete: true,
        partsUsed: [],
      },
    ],
    parts: [
      {
        partNumber: "PRT-3011",
        name: "Coolant Hose",
        quantityUsed: 1,
        unitCost: 40,
        totalCost: 40,
      },
    ],
    labor: [
      {
        technicianName: "Vendor-324050",
        hours: 3,
        laborRate: 30,
        totalCost: 90,
        laborType: "",
        workPerformed: "",
        costCenter: "",
      },
    ],
    notes: [
      {
        createdBy: "Vendor-324050",
        notes: "Leak was near radiator.",
        createdAt: new Date("2025-07-15T15:00:00"),
      },
    ],
    custom: {},
  },
  {
    workOrderNumber: "WO-0005",
    status: "Open",
    priority: "NORMAL",
    workOrderTotal: 410,
    scheduledOn: new Date("2025-07-28"),
    dueOn: new Date("2025-07-29"),
    startedOn: undefined,
    completedOn: undefined,
    assigneeIds: ["User-246964"],
    workOrderType: "other",
    costCenter: "other",
    po: "P-00123",
    invoice: "INV-88999",
    equipment: "1311827",
    hours: 4,
    maintenance: [
      {
        task: "Tighten electrical connections",
        laborCost: "50.00",
        partsCost: "0.00",
        total: "50.00",
        complete: false,
        partsUsed: [],
      },
    ],
    parts: [],
    labor: [
      {
        technicianName: "User-246964",
        hours: 2,
        laborRate: 25,
        totalCost: 50,
        laborType: "",
        workPerformed: "",
        costCenter: "",
      },
    ],
    notes: [],
    custom: {},
  },
];
export type WorkOrderInterface = z.infer<typeof WorkOrderSchema>;
