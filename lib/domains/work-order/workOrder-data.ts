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
  maintenance_id: z.string().optional(),
});

export const AddPartUsedSchema = z.object({
  part_id: z.string().min(1, { message: "Part is required" }),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  vendor_id: z.string().optional().nullable(),
  cost_center_id: z.string().optional().nullable(),
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity must be greater than 0" }),
  unit_cost: z.coerce
    .number()
    .nonnegative({ message: "Unit cost must be a valid number" }),
  extended_cost: z.coerce
    .number()
    .nonnegative({ message: "Extended cost must be a valid number" }),
  is_warranty_replaced: z.boolean().optional(),
  po_id: z.string().optional().nullable(),
  is_part_under_warranty: z.boolean().optional(),
  days: z.coerce.number().optional().nullable(),
  hours: z.coerce.number().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  maintenance_id: z.string().optional().nullable(),
});

export type AddPartUsedInterface = z.infer<typeof AddPartUsedSchema>;

export const AddLaborUsedSchema = z.object({
  performed_by: z.enum(["Employee", "Vendor"], {
    required_error: "Performed by is required",
  }),
  technician_id: z.string().min(1, { message: "Technician is required" }),
  work_performed: z.string().optional().nullable(),
  cost_center_id: z.string().optional().nullable(),
  labor_rate: z.coerce
    .number()
    .nonnegative({ message: "Labor rate must be a valid number" }),
  is_under_warranty: z.boolean().optional(),
  hours: z.coerce
    .number()
    .positive({ message: "Hours must be greater than 0" }),
  total_cost: z.coerce
    .number()
    .nonnegative({ message: "Total cost must be a valid number" }),
  maintenance_id: z.string().optional().nullable(),
});

export type AddLaborUsedInterface = z.infer<typeof AddLaborUsedSchema>;

// Add Note Schema for unit notes
export const AddNoteSchema = z.object({
  note: z.string().min(1, { message: "Note is required" }),
  created_by: z.string().optional(),
  date: z.string().optional(),
});

export type AddNoteInterface = z.infer<typeof AddNoteSchema>;

export const AddMaintenanceInWorkOrderSchema = z.object({
  id: z.string().optional().nullable(),
  category: z.enum(["Preventive", "Repair", "Other"], {
    required_error: "Category is required",
  }),
  complete: z.boolean().optional(),
  task: z.string().optional().nullable(),
  task_id: z.string().optional().nullable(),
  type_id: z.string().optional().nullable(),
  other_task_name: z.string().optional().nullable(),
  other_type_name: z.string().optional().nullable(),
  parts_cost: z.coerce
    .number()
    .nonnegative({ message: "Parts Cost must be a valid number" }),
  labor_cost: z.coerce
    .number()
    .nonnegative({ message: "Labor Cost must be a valid number" }),
  total: z.coerce
    .number()
    .nonnegative({ message: "Total must be a valid number" }),
  notes: z.string().optional().nullable(),
  labor: z.array(AddLaborUsedSchema).optional(),
  parts: z.array(AddPartUsedSchema).optional(),
});

export const WorkOrderSchema = z.object({
  maintenance: z.array(AddMaintenanceInWorkOrderSchema).optional(),
  parts: z.array(AddPartUsedSchema).optional(),
  labor: z.array(AddLaborUsedSchema).optional(),
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
  wo_number: z.coerce.number().min(1, "Work order number is required"),
  priority_id: z.string().min(1, "Priority is required"),
  scheduled_date: z.date().optional(),
  due_date: z.date().optional(),
  started_date: z.date().optional(),
  completed_date: z.date().optional(),
  type_id: z.string().optional().nullable(),
  cost_center_id: z.string().optional().nullable(),
  po_id: z.string().optional().nullable(),
  invoice_number: z.string().optional().nullable(),
  status_id: z.string().optional().nullable(),
  others: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        value: z.string(),
      })
    )
    .optional()
    .nullable(),
  assignees: z
    .array(
      z.object({
        id: z.string().optional(),
        assignee_type: z.enum(["Employee", "Vendor"]),
        assignee_id: z.string(),
      })
    )
    .optional()
    .nullable(),
  assignee_ids: z.array(z.string()).optional().nullable(),
  hours: z.coerce.number().optional().nullable(),
  equipment_id: z.string().optional().nullable(),
  maintenance: z.array(AddMaintenanceInWorkOrderSchema).optional().nullable(),
  parts: z.array(AddPartUsedSchema).optional().nullable(),
  labor: z.array(AddLaborUsedSchema).optional().nullable(),
  notes: z.array(NotesSchema).optional().nullable(),
  units: z.array(z.any()).optional().nullable(),
  currency: z.string().optional().nullable(),
  subtotal: z.coerce.number().min(0).optional().nullable(),
  is_discount: z.boolean().optional().nullable(),
  discount_type: z.string().optional().nullable(), // kept as string based on request, or enum if preferred
  discount_amount: z.coerce.number().min(0).optional().nullable(),
  tax_one: z.coerce.number().min(0).optional().nullable(),
  tax_one_amount: z.coerce.number().min(0).optional().nullable(),
  tax_two: z.coerce.number().min(0).optional().nullable(),
  tax_two_amount: z.coerce.number().min(0).optional().nullable(),
  total: z.coerce.number().optional().nullable(),
  is_calculated: z.boolean().optional().nullable(),
});

export type CreateWorkOrderInterface = z.infer<typeof CreateWorkOrderSchema>;
