"use client";

import { useState } from "react";
import { useWatch, type Control, type FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/shared/utils";

interface CustomFieldRowProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  nameField: string;
  valueField: string;
  defaultLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomFieldRow({
  control,
  nameField,
  valueField,
  defaultLabel = "(Custom)",
  placeholder = "",
  disabled = false,
}: CustomFieldRowProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const labelValue = useWatch({
    control,
    name: nameField,
  });

  const displayLabel =
    typeof labelValue === "string" && labelValue.trim() !== ""
      ? labelValue
      : defaultLabel;

  return (
    <div className="w-full flex items-center gap-4">
      {/* Label section (left column, w-[10rem]) */}
      <div className="w-[10rem] flex items-center justify-end shrink-0">
        {isEditingLabel ? (
          <FormField
            control={control}
            name={nameField}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                autoFocus
                placeholder="Label name"
                disabled={disabled}
                className="h-9 text-right text-sm"
                onBlur={() => setIsEditingLabel(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setIsEditingLabel(false);
                  }
                  if (e.key === "Escape") {
                    setIsEditingLabel(false);
                  }
                }}
              />
            )}
          />
        ) : (
          <button
            type="button"
            onClick={() => !disabled && setIsEditingLabel(true)}
            disabled={disabled}
            className={cn(
              "group inline-flex items-center justify-end gap-1.5 text-sm font-medium transition-colors text-right select-none py-1 px-1.5 rounded hover:bg-muted/50",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
              labelValue && labelValue.trim() !== ""
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            )}
            title="Click to edit custom label"
          >
            <span>{displayLabel}</span>
            {!disabled && (
              <Pencil className="size-3 opacity-0 group-hover:opacity-60 transition-opacity text-muted-foreground shrink-0" />
            )}
          </button>
        )}
      </div>

      {/* Value section (right column, flex-1) */}
      <div className="flex-1 flex flex-col">
        <FormField
          control={control}
          name={valueField}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={
                    placeholder ||
                    (labelValue && labelValue.trim() !== ""
                      ? `Enter ${labelValue.toLowerCase()}`
                      : "")
                  }
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
