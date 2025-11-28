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
    labor_rate: z.coerce.number().nonnegative("Labor rate must be ≥ 0"),
    hours: z.coerce.number().nonnegative("Hours must be ≥ 0"),
    totalCost: z.coerce.number().nonnegative("Total cost must be ≥ 0"),
    usage: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    totalCost: parseFloat((data.labor_rate * data.hours).toFixed(2)),
  }));

export type AddLaborFormValues = z.infer<typeof AddLaborSchema>;

export const PartSchema = z.object({
  partNumber: z.string(),
  partName: z.string().optional(),
  name: z.string(),
  quantityUsed: z.coerce.number().nonnegative(),
  unit_cost: z.coerce.number().nonnegative(),
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
  workOrderNumber: z.number().min(1, "WO Number is required"),
  priority: z.string().min(1, "Priority is required"),
  scheduledOn: z.date().optional(),
  dueOn: z.date().optional(),
  startedOn: z.date().optional(),
  completedOn: z.date().optional(),
  assigneeIds: z.array(z.string()).optional(),
  status: z.string().optional(),
  workOrderType: z.string().optional(),
  costCenter: z.string().optional(),
  po: z.string().optional(),
  invoice: z.string().optional(),
  equipment: z.string().min(1, "Equipment is required"),
  hours: z.union([z.string(), z.coerce.number()]).optional(),
  workOrderTotal: z.coerce.number().optional(),
  others: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
});
export type AddMaintenanceInWorkOrderInterface = z.infer<
  typeof AddMaintenanceInWorkOrderSchema
>;

export type Part = z.infer<typeof PartSchema>;

export type WorkOrderInterface = z.infer<typeof WorkOrderSchema>;

export const CreateWorkOrderSchema = z.object({
  wo_number: z.number(),
  priority_id: z.string().min(1, "Priority is required"),
  scheduled_date: z.date().optional(),
  due_date: z.date().optional(),
  started_date: z.date().optional(),
  completed_date: z.date().optional(),
  type_id: z.string().optional(),
  cost_center_id: z.string().optional(),
  po_id: z.string().optional(),
  invoice_number: z.string().optional(),
  status_id: z.string().optional(),
  others: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
  assignee_ids: z.array(z.string()).optional(),
  hours: z.coerce.number().optional(),
  equipment_id: z.string().optional(),
  maintenance: z.array(AddMaintenanceInWorkOrderSchema).optional(),
  parts: z.array(PartSchema).optional(),
  labor: z.array(AddLaborSchema).optional(),
  notes: z.array(NotesSchema).optional(),
  units: z.array(z.any()).optional(),
});

export type CreateWorkOrderInterface = z.infer<typeof CreateWorkOrderSchema>;
