"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { Control } from "react-hook-form"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateFieldProps {
  control: Control<any>
  label: string
  name: string
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  warning?: string
  disablePast?: boolean
  disableFuture?: boolean
  fromDate?: Date
  toDate?: Date
  direction?: "horizontal" | "vertical" // NEW
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
  direction = "horizontal", // default
}: DateFieldProps) {
  const [open, setOpen] = useState(false)

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
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      className
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
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
            {warning && (
              <span className="mt-1 block font-light text-sm text-muted-foreground">
                {warning}
              </span>
            )}
          </div>
        </FormItem>
      )}
    />
  )
}
