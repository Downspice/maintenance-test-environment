"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import {
  substituteOptions,
  vendorOptions,
  warehouseOptions,
} from "@/lib/equipment-schema";
import SelectWrapper from "../wrappers/SelectWrapper";
import {
  inventoryAdjustmentType,
} from "@/lib/option-list";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function AdjustInventoryForm() {
  const [customFields, setCustomFields] = useState<
    { name: string; value: string }[]
  >([]);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...vendorForm}>
        <form
          onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <div className="flex flex-col">
            <SelectWrapper
              control={vendorForm.control}
              name="adjustmentType"
              label="Type"
              options={inventoryAdjustmentType}
            />
            <ComboboxFieldWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="partNumber"
              label="Part #"
              options={substituteOptions}
            />

            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="name"
              label="Name"
              type="text"
              value={""}
            />
            <DatePickerWrapper
              control={vendorForm.control}
              name="dateAdded"
              label="Date"
            />
            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="quantity"
              label="Quantity"
              type="number"
              value={""}
            />
            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="tax1"
              label="Tax 1"
              type="number"
              value={undefined}
            />
            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="tax2"
              label="Tax 2"
              type="number"
              value={undefined}
            />
            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="unitCost"
              label="Unit Cost"
              type="number"
              value={undefined}
            />
            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="extendedCost"
              label="Extended Cost"
              type="number"
              value={undefined}
            />
            <SelectWrapper
              control={vendorForm.control}
              name="warehouse"
              label="Warehouse"
              options={warehouseOptions}
            />
            <InputWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="invoiceNUmber"
              label="Invoice #"
              type="number"
              value={undefined}
            />
            <ComboboxFieldWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="vendor"
              label="Vendor"
              options={vendorOptions}
            />
            <TextareaWrapper
              control={vendorForm.control}
              name="reason"
              label="Reason"
              placeholder={""}
              value={""}
            />
          </div>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
