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

interface InputWrapperProps {
  control: Control<any>;
  name: string;
  label: string;
  type: string;
  className?: string;
  value: any;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  warning?: string;
}

export default function InputWrapper({
  control,
  name,
  label,
  type,
  className,
  value,
  placeholder,
  disabled = false,
  required = false,
  warning,
}: InputWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <FormItem className="w-full">
            <FormLabel>
              {required && <span className="text-red-500 mr-1">*</span>}
              {label}
            </FormLabel>
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
          </FormItem>
          <span className="font-light">{warning}</span>
        </>
      )}
    />
  );
}
