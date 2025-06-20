"use client"
import { Check, ChevronsUpDown, X } from "lucide-react"
import type { Control } from "react-hook-form"
import { useState, useMemo } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxFieldProps {
  control: Control<any>
  name: string
  label: string
  options: ComboboxOption[]
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  warning?: string
  emptyText?: string
  searchPlaceholder?: string
}

export function ComboboxFieldWrapper({
  control,
  name,
  label,
  options,
  className,
  placeholder,
  disabled = false,
  required = false,
  warning,
  emptyText = "No option found.",
  searchPlaceholder = "Search...",
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase()),
    )
  }, [options, search])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleSelect = (selectedLabel: string) => {
          const option = options.find((opt) => opt.value === selectedLabel)
          if (option) {
            field.onChange(option.value)
            setOpen(false)
            setSearch("")
          }
        }

        return (
          <>
            <FormItem className="w-full">
              <FormLabel>
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </FormLabel>
              <Popover
                open={open}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen)
                  if (!newOpen) {
                    setSearch("")
                  }
                }}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={disabled}
                      className={cn("w-full justify-between", !field.value && "text-muted-foreground", className)}
                    >
                      {field.value
                        ? options.find((option) => option.value === field.value)?.label
                        : placeholder || `Select ${label.toLowerCase()}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} autoFocus />
                    <CommandList>
                      <CommandEmpty>{emptyText}</CommandEmpty>
                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => handleSelect(option.value)}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", option.value === field.value ? "opacity-100" : "opacity-0")}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
            {warning && <span className="font-light">{warning}</span>}
          </>
        )
      }}
    />
  )
}

interface MultiComboboxFieldProps {
  control: Control<any>
  name: string
  label: string
  options: ComboboxOption[]
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  warning?: string
  emptyText?: string
  searchPlaceholder?: string
  minSelections?: number
  maxSelections?: number
}

export function MultiComboboxWrapper({
  control,
  name,
  label,
  options,
  className,
  placeholder,
  disabled = false,
  required = false,
  warning,
  emptyText = "No option found.",
  searchPlaceholder = "Search...",
  minSelections,
  maxSelections,
}: MultiComboboxFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase()),
    )
  }, [options, search])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = field.value || []
        const selectedOptions = options.filter((option) => selectedValues.includes(option.value))

        const handleSelect = (selectedValue: string) => {
          const currentValues = field.value || []

          if (currentValues.includes(selectedValue)) {
            // Remove if already selected
            const newValues = currentValues.filter((value: string) => value !== selectedValue)
            field.onChange(newValues)
          } else {
            // Add if not selected and under max limit
            if (maxSelections && currentValues.length >= maxSelections) {
              return
            }
            const newValues = [...currentValues, selectedValue]
            field.onChange(newValues)
          }
        }

        const handleRemove = (optionValue: string) => {
          const currentValues = field.value || []
          const newValues = currentValues.filter((value: string) => value !== optionValue)
          field.onChange(newValues)
        }

        const getValidationMessage = () => {
          const count = selectedValues.length
          if (minSelections && count < minSelections) {
            return `Please select at least ${minSelections} option${minSelections > 1 ? "s" : ""}.`
          }
          if (maxSelections && count > maxSelections) {
            return `Please select no more than ${maxSelections} option${maxSelections > 1 ? "s" : ""}.`
          }
          return null
        }

        return (
          <>
            <FormItem className="w-full">
              <FormLabel>
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </FormLabel>

              {/* Selected items display */}
              {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                  {selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary" className="text-xs">
                      {option.label}
                      <button
                        type="button"
                        onClick={() => handleRemove(option.value)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Popover
                open={open}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen)
                  if (!newOpen) {
                    setSearch("")
                  }
                }}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={disabled}
                      className={cn(
                        "w-full justify-between",
                        selectedValues.length === 0 && "text-muted-foreground",
                        className,
                      )}
                    >
                      {selectedValues.length > 0
                        ? `${selectedValues.length} selected`
                        : placeholder || `Select ${label.toLowerCase()}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} autoFocus />
                    <CommandList>
                      <CommandEmpty>{emptyText}</CommandEmpty>
                      <CommandGroup>
                        {filteredOptions.map((option) => {
                          const isSelected = selectedValues.includes(option.value)
                          const isDisabled = !isSelected && maxSelections && selectedValues.length >= maxSelections

                          return (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => handleSelect(option.value)}
                              className={cn(isDisabled && "opacity-50 cursor-not-allowed")}
                            >
                              <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                              {option.label}
                              {isDisabled && <span className="ml-auto text-xs text-muted-foreground">Max reached</span>}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selection count and limits info */}
              {(minSelections || maxSelections) && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{selectedValues.length} selected</span>
                  <span>
                    {minSelections && `Min: ${minSelections}`}
                    {minSelections && maxSelections && " • "}
                    {maxSelections && `Max: ${maxSelections}`}
                  </span>
                </div>
              )}

              {/* Custom validation message */}
              {getValidationMessage() && (
                <p className="text-sm font-medium text-destructive">{getValidationMessage()}</p>
              )}

              <FormMessage />
            </FormItem>
            {warning && <span className="font-light">{warning}</span>}
          </>
        )
      }}
    />
  )
}
