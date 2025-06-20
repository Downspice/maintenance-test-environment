"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import ComboboxWrapper from "../wrappers/ComboboxWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import SelectWrapper from "../wrappers/SelectWrapper";
import {
  categoryOptions,
  fuelUnitsOptions,
  substituteOptions,
  vendorOptions,
  warehouseOptions,
} from "@/lib/equipment-schema";
import MultiSelectWrapper from "../wrappers/MultiSelectWrapper";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
// Define the form schema with Zod
export const inventorySchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),

  notes: z.string().optional(),
  vendors: z
    .array(
      z.object({
        vendor: z.string().optional(),
        manufacturer: z.string().optional(),
        vendorNumber: z.string().optional(),
        barcode: z.string().optional(),
        warehouses: z.array(z.string()).optional(),
      })
    )
    .optional(),

  warehouses: z
    .array(
      z.object({
        warehouse: z.string().optional(),
        bin: z.string().optional(),
        quantity: z.coerce.number().optional(),
        lowStockLevel: z.coerce.number().optional(),
        reorderQuantity: z.coerce.number().optional(),
        maximumQuantity: z.coerce.number().optional(),
      })
    )
    .optional(),
});

// Equipment options
const equipmentOptions = [{ value: "1311827", label: "AC-001-07 Class 8" }];

export default function NewInventory() {
  const inventoryForm = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { vendors: [{}], warehouses: [{}] },
  });
  const { control } = inventoryForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendors",
  });

  const {
    fields: warehouseFields,
    append: appendWarehouse,
    remove: removeWarehouse,
  } = useFieldArray({
    control,
    name: "warehouses",
  });

  async function handleSubmit(data: z.infer<typeof inventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }
  return (
    <div>
      <Form {...inventoryForm}>
        <form
          onSubmit={inventoryForm.handleSubmit((data) => handleSubmit(data))}
          className="flex flex-col gap-2"
        >
          <div className="work-order-form-wrapper flex flex-col gap-2">
            <InputWrapper
              control={inventoryForm.control}
              name="number"
              label="Part Number"
              type="text"
              required
              value={undefined}
            />
            <InputWrapper
              control={inventoryForm.control}
              name="name"
              label="Name"
              type="text"
              required
              value={undefined}
            />

            <TextareaWrapper
              control={inventoryForm.control}
              name="notes"
              label="Notes"
              value={undefined}
              rows={4}
            />

            <SelectWrapper
              control={inventoryForm.control}
              name="category"
              label="Category"
              options={categoryOptions}
            />

            <SelectWrapper
              control={inventoryForm.control}
              name="unit"
              label="Unit Type"
              options={fuelUnitsOptions}
            />

            <div className="pt-2">
              <ComboboxWrapper
                control={inventoryForm.control}
                name="equipmentId"
                label="Equipment"
                options={equipmentOptions}
                required={true}
                searchPlaceholder="Search equipment..."
              />
            </div>

            <div className="disable-fields-without-equipment pt-4">
              <div id="fields">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <DatePickerWrapper
                    control={inventoryForm.control}
                    name="date"
                    label="Date"
                  />
                </div>
                <div className="pt-4">
                  <TextareaWrapper
                    control={inventoryForm.control}
                    name="notes"
                    label="Notes"
                    value={undefined}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {warehouseFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md relative">
                <SelectWrapper
                  control={control}
                  name={`warehouses.${index}.warehouse`}
                  label="Warehouse"
                  options={warehouseOptions}
                  required
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.bin`}
                  label="Bin"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.quantity`}
                  label="Quantity"
                  type="number"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.lowStockLevel`}
                  label="Low Stock Level"
                  type="number"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.reorderQuantity`}
                  label="Reorder Quantity"
                  type="number"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.maximumQuantity`}
                  label="Maximum Quantity"
                  type="number"
                  value={undefined}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeWarehouse(index)}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" onClick={() => appendWarehouse({})}>
              + Add Warehouse Entry
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md relative">
                <SelectWrapper
                  control={control}
                  name={`vendors.${index}.vendor`}
                  label="Vendors"
                  options={vendorOptions}
                  required
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.manufacturer`}
                  label="Manufacturer"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.vendorNumber`}
                  label="Vendor#"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.barcode`}
                  label="Barcode"
                  type="text"
                  value={undefined}
                />
                <MultiSelectWrapper
                  control={control}
                  name={`vendors.${index}.warehouses`}
                  label="Warehouses"
                  options={warehouseOptions}
                  placeholder="Select Warehouse"
                  searchPlaceholder="Search Warehouse..."
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" onClick={() => append({})}>
              + Add Vendor Info
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <MultiSelectWrapper
              control={inventoryForm.control}
              name="equipments"
              label="Assignee"
              options={substituteOptions}
              placeholder="Select substitutes"
              searchPlaceholder="Search substitutes..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <CustomFieldsWrapper
              control={inventoryForm.control}
              name="customFields"
              label="Custom Fields"
              maxFields={10}
            />
          </div>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Create Inspection
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
