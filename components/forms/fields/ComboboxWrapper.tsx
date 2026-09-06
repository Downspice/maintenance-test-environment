"use client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import type { Control } from "react-hook-form";
import { useState, useMemo } from "react";

import { cn } from "@/lib/shared/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { GenericObject } from "@/types/types";

interface BaseFieldProps {
  control: Control<any>;
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  warning?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  direction?: "horizontal" | "vertical";
  showLabel?: boolean;
}

interface ComboboxFieldProps extends BaseFieldProps {
  options: GenericObject[];
}

export function ComboboxFieldWrapper({
  control,
  name,
  label,
  options = [],
  className,
  placeholder,
  disabled = false,
  required = false,
  warning,
  emptyText = "No option found.",
  searchPlaceholder = "Search...",
  direction = "horizontal",
  showLabel = true,
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(
      (option) =>
        option.name?.toLowerCase().includes(search.toLowerCase()) ||
        option.id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleSelect = (id: string) => {
          const option = options.find((opt) => opt.id === id);
          if (option) {
            field.onChange(option.id);
            setOpen(false);
            setSearch("");
          }
        };

        return (
          <FormItem
            className={cn(
              "w-full",
              direction === "horizontal"
                ? "flex items-center gap-4"
                : "flex flex-col"
            )}
          >
            {showLabel && (
              <FormLabel
                className={cn(
                  direction === "horizontal" ? "w-[10rem] text-right" : "mb-1"
                )}
              >
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </FormLabel>
            )}

            <div className="flex-1 flex flex-col">
              <Popover
                open={open}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen);
                  if (!newOpen) setSearch("");
                }}
                modal
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
                        !field.value && "text-muted-foreground",
                        className
                      )}
                    >
                      {field.value
                        ? options.find((o) => o.id === field.value)?.name
                        : placeholder || `Select ${label.toLowerCase()}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder={searchPlaceholder}
                      value={search}
                      onValueChange={setSearch}
                      autoFocus
                    />
                    <CommandList>
                      <CommandEmpty>{emptyText}</CommandEmpty>
                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.name}
                            onSelect={() => handleSelect(option.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                option.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
              {warning && (
                <span className="text-xs text-amber-500 mt-1">{warning}</span>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
}

interface MultiComboboxFieldProps extends BaseFieldProps {
  options: GenericObject[];
  minSelections?: number;
  maxSelections?: number;
}

export function MultiComboboxWrapper({
  control,
  name,
  label,
  options = [],
  className,
  placeholder,
  disabled = false,
  required = false,
  warning,
  emptyText = "No option found.",
  searchPlaceholder = "Search...",
  minSelections,
  maxSelections,
  direction = "horizontal",
  showLabel = true,
}: MultiComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(
      (option) =>
        option.name?.toLowerCase().includes(search.toLowerCase()) ||
        option.id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = field.value || [];
        const selectedOptions = options.filter((o) =>
          selectedValues.includes(o.id)
        );

        const handleSelect = (id: string) => {
          const current = field.value || [];
          if (current.includes(id)) {
            field.onChange(current.filter((v: string) => v !== id));
          } else {
            if (maxSelections && current.length >= maxSelections) return;
            field.onChange([...current, id]);
          }
        };

        const handleRemove = (id: string) => {
          field.onChange((field.value || []).filter((v: string) => v !== id));
        };

        const getValidationMessage = () => {
          const count = selectedValues.length;
          if (minSelections && count < minSelections)
            return `Please select at least ${minSelections} option${minSelections > 1 ? "s" : ""
              }.`;
          if (maxSelections && count > maxSelections)
            return `Please select no more than ${maxSelections} option${maxSelections > 1 ? "s" : ""
              }.`;
          return null;
        };

        return (
          <FormItem
            className={cn(
              "w-full",
              direction === "horizontal"
                ? "flex items-center gap-4"
                : "flex flex-col"
            )}
          >
            {showLabel && (
              <FormLabel
                className={cn(
                  direction === "horizontal" ? "w-[10rem] text-right" : "mb-1"
                )}
              >
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </FormLabel>
            )}

            <div className="flex-1 flex flex-col">
              {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                  {selectedOptions.map((option) => (
                    <Badge
                      key={option.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {option.name}
                      <button
                        type="button"
                        onClick={() => handleRemove(option.id)}
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
                  setOpen(newOpen);
                  if (!newOpen) setSearch("");
                }}
                modal
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
                        className
                      )}
                    >
                      {selectedValues.length > 0
                        ? `${selectedValues.length} selected`
                        : placeholder || `Select ${label.toLowerCase()}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder={searchPlaceholder}
                      value={search}
                      onValueChange={setSearch}
                      autoFocus
                    />
                    <CommandList>
                      <CommandEmpty>{emptyText}</CommandEmpty>
                      <CommandGroup>
                        {filteredOptions.map((option) => {
                          const isSelected = selectedValues.includes(
                            option.id
                          );
                          const isDisabled =
                            !isSelected &&
                            maxSelections &&
                            selectedValues.length >= maxSelections;
                          return (
                            <CommandItem
                              key={option.id}
                              value={option.name}
                              onSelect={() => handleSelect(option.id)}
                              className={cn(
                                isDisabled && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {option.name}
                              {isDisabled && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  Max reached
                                </span>
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {(minSelections || maxSelections) && (
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{selectedValues.length} selected</span>
                  <span>
                    {minSelections && `Min: ${minSelections}`}
                    {minSelections && maxSelections && " • "}
                    {maxSelections && `Max: ${maxSelections}`}
                  </span>
                </div>
              )}

              {getValidationMessage() && (
                <p className="text-sm font-medium text-destructive">
                  {getValidationMessage()}
                </p>
              )}
              <FormMessage />
              {warning && (
                <span className="text-xs text-amber-500 mt-1">{warning}</span>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
}
