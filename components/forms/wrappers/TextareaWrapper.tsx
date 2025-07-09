"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { Control } from "react-hook-form"

interface TextareaWrapperProps {
  control: Control<any>
  name: string
  label?: string
  className?: string
  value?: any
  placeholder?: string
  rows?: number
  disabled?: boolean
  required?: boolean
}

export default function TextareaWrapper({
  control,
  name,
  label,
  className,
  value,
  placeholder,
  rows = 4,
  disabled = false,
  required = false,
}: TextareaWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
              className={className}
              rows={rows}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
