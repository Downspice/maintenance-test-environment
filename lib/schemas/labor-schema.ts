// lib/schemas/labor-schema.ts
import { z } from "zod";

export const laborAssociationSchema = z.object({
  type: z.enum(["preventive", "repair"]),
  equipment: z.string().min(1, "Equipment is required"),
  service: z.string().min(1, "Service is required"),
  method: z.enum(["assignLabourer", "fixedCost"]),
  labourerType: z.enum(["employee", "vendor"]).optional(),
  labourer: z.string().optional(),
  rate: z.coerce.number().min(0).optional(),
  hours: z.coerce.number().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
}).refine((data) => {
  if (data.method === "fixedCost") return !!data.cost;
  if (data.method === "assignLabourer") return !!data.labourer && !!data.rate && !!data.hours;
  return false;
}, {
  message: "Please fill required fields based on selected method",
  path: ["method"],
});

export type LaborAssociationFormValues = z.infer<typeof laborAssociationSchema>;


export const partAssociationSchema = z.object({
  equipment: z.string().nonempty("Equipment is required"),
  type: z.enum(["preventive", "repair"]),
  service: z.string().nonempty("Service is required"),
  method: z.enum(["assignedPart", "fixedCost"]),
  partNumber: z.string().optional(),
  warehouse: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "Quantity must be greater than 0",
    }),
  cost: z
    .number({ invalid_type_error: "Cost must be a number" })
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "Cost must be greater than 0",
    }),
  instructionService: z.string().optional(),
  instructionFiles: z.any().optional(), // You can validate files separately if needed
});

export type PartAssociationFormValues = z.infer<typeof partAssociationSchema>;
