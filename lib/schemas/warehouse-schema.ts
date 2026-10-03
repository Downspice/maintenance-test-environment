import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  location: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  notificationUserIds: z.array(z.string()).optional(),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

export type WarehouseRecord = WarehouseFormValues & { id: string };
