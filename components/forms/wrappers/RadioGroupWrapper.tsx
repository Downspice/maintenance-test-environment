"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Control } from "react-hook-form"

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupWrapperProps {
  control: Control<any>
  name: string
  label: string
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
        <FormItem className="space-y-3">
          <FormLabel>
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={className}
              disabled={disabled}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                    {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
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
