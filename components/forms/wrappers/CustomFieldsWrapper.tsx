"use client"
import { useEffect } from "react"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Control, FieldArrayWithId, UseFieldArrayReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"

interface CustomField {
  name: string
  id: string
}

interface CustomFieldsWrapperProps {
  control: Control<any>
  name: string
  label: string
  fieldsCount?: number
  disabled?: boolean
}

export default function CustomFieldsWrapper({
  control,
  name,
  label,
  fieldsCount = 2,
  disabled = false,
}: CustomFieldsWrapperProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  }) as UseFieldArrayReturn<any, string, "id"> & {
    fields: FieldArrayWithId<any, string, "id">[]
  }

  useEffect(() => {
    const currentLength = fields.length
    if (currentLength < fieldsCount) {
      const fieldsToAdd = Array(fieldsCount - currentLength).fill({ name: "", value: "" })
      append(fieldsToAdd)
    } else if (currentLength > fieldsCount) {
      // Remove excess fields
      for (let i = currentLength - 1; i >= fieldsCount; i--) {
        remove(i)
      }
    }
  }, [fieldsCount, fields.length]) // Depend on fieldsCount to react to prop changes

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </h3>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-start">
            <FormField
              control={control}
              name={`${name}.${index}.name`}
              render={({ field: formField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Field Name" disabled={disabled} {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${name}.${index}.value`}
              render={({ field: formField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Value" disabled={disabled} {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
