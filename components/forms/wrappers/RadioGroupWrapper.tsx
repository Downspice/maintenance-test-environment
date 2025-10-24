"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Control } from "react-hook-form"

export interface RadioOption {
  id: string
  name: string
  description?: string
}

interface RadioGroupWrapperProps {
  control: Control<any>
  name: string
  name: string
  options: RadioOption[]
  className?: string
  disabled?: boolean
  required?: boolean
}

export default function RadioGroupWrapper({
  control,
  name,
  label,
  options,
  className,
  disabled = false,
  required = false,
}: RadioGroupWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3 flex flex-row">
          <FormLabel>
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className={className}
              disabled={disabled}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex flex-row items-center gap-3 space-y-0">
                  <RadioGroupItem value={option.value} disabled={disabled} />
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    )}
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
