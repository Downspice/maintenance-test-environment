"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import { cn } from "@/lib/utils";

interface InputWrapperProps {
  control: Control<any>;
  label: string;
  name: string;
  type: string;
  className?: string;
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  warning?: string;
  direction?: "horizontal" | "vertical"; // NEW
}

export default function InputWrapper({
  control,
  name,
  label,
  type,
  className,
  placeholder,
  disabled = false,
  required = false,
  warning,
  direction = "horizontal", // default
}: InputWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "w-full",
            direction === "horizontal"
              ? "flex items-center gap-4"
              : "flex flex-col"
          )}
        >
          <FormLabel
            className={cn(
              direction === "horizontal" ? "w-[10rem] text-right" : "mb-1"
            )}
          >
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FormLabel>

          <div className="flex-1 flex flex-col">
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                className={className}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
            {warning && (
              <span className="text-xs text-amber-500 mt-1">{warning}</span>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
