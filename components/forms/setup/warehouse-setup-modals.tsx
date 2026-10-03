"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormModal } from "@/components/ui/form-modal";
import {
  warehouseSchema,
  type WarehouseFormValues,
  type WarehouseRecord,
} from "@/lib/schemas/warehouse-schema";
import { WarehouseSetupFormFields } from "./warehouse-setup-form-fields";
import {
  useAddWarehouse,
  useUpdateWarehouse,
} from "@/services/setups/inventory";

const defaultValues: WarehouseFormValues = {
  name: "",
  location: "",
  status: "active",
  notificationUserIds: [],
};

type WarehouseFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  warehouse?: WarehouseRecord | null;
  onSuccess?: (warehouse: WarehouseRecord) => void;
};

export function WarehouseFormModal({
  open,
  onOpenChange,
  mode,
  warehouse,
  onSuccess,
}: WarehouseFormModalProps) {
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues,
  });

  const addWarehouse = useAddWarehouse();
  const updateWarehouse = useUpdateWarehouse();

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && warehouse) {
      form.reset({
        name: warehouse.name,
        location: warehouse.location ?? "",
        status: warehouse.status,
        notificationUserIds: warehouse.notificationUserIds ?? [],
      });
    } else {
      form.reset(defaultValues);
    }
  }, [open, mode, warehouse, form]);

  async function handleSubmit(values: WarehouseFormValues) {
    if (mode === "edit" && warehouse) {
      await updateWarehouse.mutateAsync({
        id: warehouse.id,
        ...values,
      });
      onSuccess?.({ id: warehouse.id, ...values });
      toast.success(`Updated "${values.name}"`);
    } else {
      const created = await addWarehouse.mutateAsync(values);
      const id =
        typeof created === "object" &&
        created !== null &&
        "id" in created &&
        created.id != null
          ? String(created.id)
          : `wh-${Date.now()}`;
      onSuccess?.({ id, ...values });
      toast.success(`Created "${values.name}"`);
    }
    onOpenChange(false);
  }

  const formId =
    mode === "edit" && warehouse
      ? `edit-warehouse-${warehouse.id}`
      : "new-warehouse-form";

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "Edit warehouse" : "Create warehouse"}
      description={
        mode === "edit"
          ? "Update warehouse details and default notification contacts."
          : "Add a warehouse for inventory tracking, transfers, and notifications."
      }
      formId={formId}
      form={form}
      onSubmit={handleSubmit}
      submitLabel={mode === "edit" ? "Save changes" : "Create warehouse"}
      size="md"
      scrollable
    >
      <WarehouseSetupFormFields control={form.control} />
    </FormModal>
  );
}
