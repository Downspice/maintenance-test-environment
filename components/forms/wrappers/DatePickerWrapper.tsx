"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { Control } from "react-hook-form"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateFieldProps {
  control: Control<any>
  name: string
  label: string
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  warning?: string
  disablePast?: boolean
  disableFuture?: boolean
  fromDate?: Date
  toDate?: Date
}

export default function DatePickerWrapper({
  control,
  name,
  label,
  className,
  placeholder = "Pick a date",
  disabled = false,
  required = false,
  warning,
  disablePast = false,
  disableFuture = false,
  fromDate,
  toDate,
}: DateFieldProps) {
  const [open, setOpen] = useState(false)

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
            <Popover open={open} onOpenChange={setOpen} modal={true}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      className,
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date)
                      setOpen(false)
                    }
                  }}
                  disabled={(date) => {
                    if (disabled) return true

                    const today = new Date()
                    today.setHours(0, 0, 0, 0)

                    if (disablePast && date < today) return true
                    if (disableFuture && date > today) return true
                    if (fromDate && date < fromDate) return true
                    if (toDate && date > toDate) return true
                    return false
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
          {warning && <span className="font-light text-sm text-muted-foreground">{warning}</span>}
        </>
      )}
    />
  )
}
