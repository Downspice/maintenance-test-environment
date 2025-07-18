import { z } from "zod";

export const PartSchema = z.object({
  id: z.string(),
  partNumber: z.string().min(1, "Part number is required"),
  name: z.string().min(1, "Name is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantityUsed: z.number().min(1, "Quantity must be at least 1"),
  onHandQuantity: z.number().nonnegative(),
});

export const PartKitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Part kit name is required"),
  notes: z.string().optional(),
  parts: z.array(PartSchema),
});

export const PartKitsSchema = z.object({
  partKits: z.array(PartKitSchema),
});

// Types
export type PartType = z.infer<typeof PartSchema>;
export type PartKitType = z.infer<typeof PartKitSchema>;
export type PartKitsSubmission = z.infer<typeof PartKitsSchema>;
