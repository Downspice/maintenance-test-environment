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
} from "@/lib/equipment-schema";
import SelectWrapper from "../wrappers/SelectWrapper";
import {
  inventoryAdjustmentType,
} from "@/lib/option-list";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetWarehouses } from "@/services/setups/inventory";
import { useGetVendors } from "@/services/setups/vendor";

// Define the form schema with Zod
export const AdjustInventorySchema = z.object({ 
  adjustmentType: z.string().min(1, "Adjustment Type is required"),
  partNumber: z.string().min(1, "Part Number is required"),
  name: z.string().min(1, "Name is required"),
  dateAdded: z.coerce.date(),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  tax1: z.coerce.number().optional(),
  tax2: z.coerce.number().optional(),
  unit_cost: z.coerce.number().optional(),
  extendedCost: z.coerce.number().optional(),
  warehouse: z.string().min(1, "Warehouse is required"),
  invoice_number: z.string().optional(), // assuming Invoice # is alphanumeric
  vendor: z.string().optional(),
  reason: z.string().optional(),
});

export type AdjustInventoryInterface =z.infer<typeof AdjustInventorySchema>
 export default function AdjustInventoryForm({
   
   data,
 }: { 
   data: AdjustInventoryInterface;
 }) { 

    const { data: warehouseOptions } = useGetWarehouses();
    const { data: vendorOptions } = useGetVendors();
    
  
  const AdjustInventoryForm = useForm<z.infer<typeof AdjustInventorySchema>>({
    resolver: zodResolver(AdjustInventorySchema),
    defaultValues: {...data},
  });

  async function handleSubmit(data: z.infer<typeof AdjustInventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Work Order submitted successfully!");
  }

  return (
   
    <div className="w-full">
      <Form {...AdjustInventoryForm}>
        <form
          onSubmit={AdjustInventoryForm.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <div className="flex flex-col">
            <SelectWrapper
              control={AdjustInventoryForm.control}
              name="adjustmentType"
              label="Type"
              options={inventoryAdjustmentType}
            />
            <ComboboxFieldWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="partNumber"
              label="Part #"
              options={substituteOptions}
            />

            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="name"
              label="Name"
              type="text"
              value={""}
            />
            <DatePickerWrapper
              control={AdjustInventoryForm.control}
              name="dateAdded"
              label="Date"
            />
            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="quantity"
              label="Quantity"
              type="number"
              value={""}
            />
            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="tax1"
              label="Tax 1"
              type="number"
              value={""}
            />
            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="tax2"
              label="Tax 2"
              type="number"
              value={""}
            />
            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="unit_cost"
              label="Unit Cost"
              type="number"
              value={""}
            />
            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="extendedCost"
              label="Extended Cost"
              type="number"
              value={""}
            />
            <SelectWrapper
              control={AdjustInventoryForm.control}
              name="warehouse"
              label="Warehouse"
              options={warehouseOptions}
            />
            <InputWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="invoiceNUmber"
              label="Invoice #"
              type="number"
              value={""}
            />
            <ComboboxFieldWrapper
              className="col-span-1"
              control={AdjustInventoryForm.control}
              name="vendor"
              label="Vendor"
              options={vendorOptions}
            />
            <TextareaWrapper
              control={AdjustInventoryForm.control}
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
    </div> )
}
