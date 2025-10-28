"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Settings } from "lucide-react"
import type { Control, FieldArrayWithId, UseFieldArrayReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import { toast } from "@/components/ui/sonner-toast"

interface CustomField {
  name: string
  id: string
}

interface CustomFieldsWrapperProps {
  control: Control<any>
  name: string
  label: string
  maxFields?: number
  disabled?: boolean
}

export default function CustomFieldsWrapper({
  control,
  name,
  label,
  maxFields = 10,
  disabled = false,
}: CustomFieldsWrapperProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  }) as UseFieldArrayReturn<any, string, "id"> & {
    fields: FieldArrayWithId<any, string, "id">[]
  }

  const addCustomField = () => {
    if (fields.length >= maxFields) {
      toast.warning({
        title: "Maximum Fields Reached",
        description: `You can only add up to ${maxFields} custom fields.`,
      })
      return
    }

    append({ name: "", id: "" })

    toast.info({
      title: "Custom Field Added",
      description: "A new custom field has been added to the form.",
    })
  }

  const removeCustomField = (index: number) => {
    remove(index)

    toast.info({
      title: "Custom Field Removed",
      description: "The custom field has been removed from the form.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {label}
          {fields.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({fields.length}/{maxFields})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No custom fields added yet.</p>
            <p className="text-xs">Click &ldquo;Add Custom Field&rdquo; to create your first custom field.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/30">
                <FormField
                  control={control}
                  name={`${name}.${index}.name`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-red-500 mr-1">*</span>
                        Field Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter field name" disabled={disabled} {...formField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`${name}.${index}.value`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>
                          <span className="text-red-500 mr-1">*</span>
                          Field Value
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          disabled={disabled}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter field value" disabled={disabled} {...formField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {fields.length === 0
              ? "Add custom fields to store additional equipment information."
              : `${fields.length} of ${maxFields} custom fields used.`}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addCustomField}
            disabled={disabled || fields.length >= maxFields}
            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Field
          </Button>
        </div>

        {/* {fields.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <div className="text-blue-500 mt-0.5">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Custom Fields Help</p>
                <p className="mt-1">
                  Custom fields allow you to store additional information specific to your equipment. Both field name
                  and value are required. You can add up to {maxFields} custom fields per equipment.
                </p>
              </div>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}
