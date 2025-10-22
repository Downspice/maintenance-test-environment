"use client"

import { cn } from "@/lib/utils"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Control } from "react-hook-form"
import { GenericObject } from "@/types/types"

interface SelectWrapperProps {
  control: Control<any>
  name: string
  label: string
  options: GenericObject[]
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  direction?: "horizontal" | "vertical" // <- NEW
}

export default function SelectWrapper({
  control,
  name,
  label,
  options,
  className,
  placeholder,
  disabled = false,
  required = false,
  direction = "horizontal", // default horizontal
}: SelectWrapperProps) {
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

          <div className="flex-1 w-full">
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger className={cn("w-full", className)}>
                  <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
