"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Control } from "react-hook-form";
import { cn, isFieldEmpty } from "@/lib/shared/utils";

export interface RadioOption {
  id: string;
  name: string;
  description?: string;
}

interface RadioGroupWrapperProps {
  control: Control<any>;
  name: string;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  /** Layout of the radio options */
  orientation?: "horizontal" | "vertical";
  /** Row layout for field label + control (matches InputWrapper / Combobox) */
  direction?: "horizontal" | "vertical";
  label?: string;
  onChange?: (value: string) => void;
}

export default function RadioGroupWrapper({
  control,
  name,
  label,
  options,
  className,
  disabled = false,
  required = false,
  orientation = "vertical",
  direction = "horizontal",
  onChange,
}: RadioGroupWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isMissingRequired = required && isFieldEmpty(field.value);

        const showFieldLabel = Boolean(label?.trim());
        const fieldRowHorizontal = showFieldLabel && direction === "horizontal";

        return (
          <FormItem
            className={cn(
              "w-full space-y-0",
              fieldRowHorizontal
                ? "flex items-center gap-4"
                : "flex flex-col gap-1"
            )}
          >
            {showFieldLabel ? (
              <FormLabel
                className={cn(
                  fieldRowHorizontal
                    ? "w-[10rem] flex items-center justify-end text-right shrink-0"
                    : "mb-1",
                  isMissingRequired && "text-red-500"
                )}
              >
                {label}
              </FormLabel>
            ) : null}
            <div className="min-w-0 flex-1 flex flex-col">
              <RadioGroup
                onValueChange={(val) => {
                  field.onChange(val);
                  onChange?.(val);
                }}
                value={field.value}
                className={cn(
                  orientation === "horizontal"
                    ? "flex-row flex-wrap items-center gap-x-6 gap-y-2"
                    : "flex-col",
                  className
                )}
                disabled={disabled}
              >
                {options.map((option) => (
                  <FormItem
                    key={option.id}
                    className="flex flex-row items-center gap-2 space-y-0 !mt-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={option.id} disabled={disabled} />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal text-text-strong-950">
                      {option.name}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
