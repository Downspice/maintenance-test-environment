"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import type { Control } from "react-hook-form"
import { cn, isFieldEmpty } from "@/lib/shared/utils"

interface SliderWrapperProps {
  control: Control<any>
  name: string
  label?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  required?: boolean
  showValue?: boolean
}

export default function SliderWrapper({
  control,
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  required = false,
  showValue = true,
}: SliderWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isMissingRequired = required && isFieldEmpty(field.value);

        return (
          <FormItem>
            <div className="flex justify-between">
              <FormLabel className={cn(isMissingRequired && "text-red-500")}>
                {label}
              </FormLabel>
              {showValue && <span className="text-sm text-muted-foreground">{field.value}</span>}
            </div>
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={step}
              defaultValue={[field.value]}
              onValueChange={(vals) => field.onChange(vals[0])}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        );
      }}
    />
  )
}
