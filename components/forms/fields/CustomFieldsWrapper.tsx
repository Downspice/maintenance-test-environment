"use client";

import type { Control, FieldValues } from "react-hook-form";
import CustomFieldRow from "./CustomFieldRow";
import { cn } from "@/lib/shared/utils";

interface CustomFieldsWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues> | Control<any>;
  name: string;
  label?: string;
  maxFields?: number;
  disabled?: boolean;
  className?: string;
}

export default function CustomFieldsWrapper<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  maxFields = 2,
  disabled = false,
  className,
}: CustomFieldsWrapperProps<TFieldValues>) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {Array.from({ length: maxFields }).map((_, index) => (
        <CustomFieldRow
          key={index}
          control={control as unknown as Control<FieldValues>}
          nameField={`${name}.${index}.name`}
          valueField={`${name}.${index}.value`}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
