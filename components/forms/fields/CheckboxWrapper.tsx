"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { Control } from "react-hook-form";
import { cn, isFieldEmpty } from "@/lib/shared/utils";

interface CheckboxOption {
  id: string;
  name?: string;
  /** @deprecated Use `name` — kept for legacy option lists */
  label?: string;
  description?: string;
}

interface CheckboxWrapperProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: CheckboxOption[];
  disabled?: boolean;
  required?: boolean;
  /** Vertical list (default) or horizontal row of options */
  orientation?: "vertical" | "horizontal";
}

export default function CheckboxWrapper({
  control,
  name,
  label,
  options,
  disabled = false,
  required = false,
  orientation = "vertical",
}: CheckboxWrapperProps) {
  const showGroupLabel = Boolean(label?.trim());

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isMissingRequired = required && isFieldEmpty(field.value);
        const selected: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        return (
          <FormItem className="flex flex-col gap-1">
            {showGroupLabel ? (
              <FormLabel
                className={cn(
                  "text-label-sm font-medium text-text-sub-600",
                  isMissingRequired && "text-red-500"
                )}
              >
                {label}
              </FormLabel>
            ) : null}
            <div
              className={cn(
                orientation === "horizontal"
                  ? "flex flex-wrap gap-x-6 gap-y-2"
                  : "flex flex-col gap-2"
              )}
            >
              {options.map((option) => {
                const checked = selected.includes(option.id);
                return (
                  <FormItem
                    key={option.id}
                    className="flex flex-row items-start gap-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          const next = isChecked
                            ? [...selected, option.id]
                            : selected.filter((id) => id !== option.id);
                          field.onChange(next);
                        }}
                        disabled={disabled}
                      />
                    </FormControl>
                    <div className="grid gap-0.5 leading-none">
                      <FormLabel className="cursor-pointer font-normal text-text-strong-950">
                        {option.name ?? option.label ?? option.id}
                      </FormLabel>
                      {option.description ? (
                        <p className="text-paragraph-xs text-text-sub-600">
                          {option.description}
                        </p>
                      ) : null}
                    </div>
                  </FormItem>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
