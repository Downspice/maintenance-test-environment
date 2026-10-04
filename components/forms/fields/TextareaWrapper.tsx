"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { Control } from "react-hook-form"

import { cn, isFieldEmpty } from "@/lib/shared/utils"

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
  direction?: "horizontal" | "vertical"
  /** When true (typically with no label), textarea grows to fill the parent flex column */
  fillSpace?: boolean
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
  direction = "horizontal",
  fillSpace = false,
}: TextareaWrapperProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isMissingRequired = required && isFieldEmpty(field.value);

        return (
          <FormItem
            className={cn(
              "w-full",
              fillSpace &&
                (direction === "horizontal" && label
                  ? "flex min-h-0 flex-1 flex-row items-stretch gap-4"
                  : "flex min-h-0 flex-1 flex-col"),
              !fillSpace &&
                (direction === "horizontal" && label
                  ? "flex items-start gap-4"
                  : "flex flex-col")
            )}
          >
            {label ? (
              <FormLabel
                className={cn(
                  direction === "horizontal"
                    ? "w-[10rem] flex items-start justify-end text-right shrink-0 pt-2"
                    : "mb-1",
                  isMissingRequired && "text-red-500"
                )}
              >
                {label}
              </FormLabel>
            ) : null}
            <div
              className={cn(
                "flex w-full flex-col",
                fillSpace ? "min-h-0 flex-1" : "flex-1"
              )}
            >
              <FormControl>
                <Textarea
                  placeholder={
                    placeholder !== undefined
                      ? placeholder
                      : label
                        ? `Enter ${label.toLowerCase()}`
                        : ""
                  }
                  className={cn(
                    fillSpace &&
                      "h-full min-h-[8rem] max-h-full w-full flex-1 resize-none",
                    className
                  )}
                  rows={fillSpace ? undefined : rows}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
