 import { z } from "zod";

 export const NotesSchema = z.object({
  notes: z.string().min(1, "Note is required"),
  createdAt: z.string(),     // ISO string
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
  name: z.string(),
  quantityUsed: z.coerce.number().nonnegative(),
  unitCost: z.coerce.number().nonnegative(),
  totalCost: z.coerce.number().nonnegative(),
});

export const AddMaintenanceInWorkOrderSchema = z.object({
  usage: z.enum(["Preventive", "Repair", "Other"], {
    required_error: "Maintenance type is required",
  }),

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
   
});

export type AddMaintenanceInWorkOrderInterface = z.infer<
  typeof AddMaintenanceInWorkOrderSchema
>;

export type Part = z.infer<typeof PartSchema>;
