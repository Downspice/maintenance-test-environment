"use client";

import type { Control } from "react-hook-form";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import { MultiComboboxWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { assigneeOptions } from "@/lib/schemas/equipment-schema";
import type { WarehouseFormValues } from "@/lib/schemas/warehouse-schema";

const statusOptions = [
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

export function WarehouseSetupFormFields({
  control,
}: {
  control: Control<WarehouseFormValues>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <InputWrapper
        control={control}
        name="name"
        label="Warehouse name"
        type="text"
      />
      <InputWrapper
        control={control}
        name="location"
        label="Location"
        type="text"
      />
      <SelectWrapper
        control={control}
        name="status"
        label="Status"
        options={statusOptions}
      />
      <MultiComboboxWrapper
        control={control}
        name="notificationUserIds"
        label="Email notification users"
        options={assigneeOptions}
      />
    </div>
  );
}
