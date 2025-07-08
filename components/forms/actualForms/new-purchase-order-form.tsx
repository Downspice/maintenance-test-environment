"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react"; 
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import SelectWrapper from "../wrappers/SelectWrapper";
import InputWrapper from "../wrappers/InputWrapper";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
// Define the form schema with Zod
export const PurchaseOrderSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),

  notes: z.string().optional(),
});

const warehouseList = [
  { label: "Warehouse #3", value: "all" },
  { label: "Warehouse #1", value: "40307" },
  { label: "Warehouse #2", value: "40308" },
];

const vendorList = [
  { label: "Vendor 1", value: "5604" },
  { label: "Martin Shop", value: "40307" },
  { label: "Joseph Shop", value: "40308" },
];

const BuyerList = [
  { label: "Joe", value: "5604" },
  { label: "Yaw", value: "40307" },
  { label: "Sarfo", value: "40308" },
];

export const termsList = [
  { label: "Loan", value: "5604" },
  { label: "Full Payment", value: "40307" },
  { label: "Part Payment", value: "40308" },
];

const shippingModeList = [
  { label: "Air", value: "air" },
  { label: "Courier", value: "courier" },
  { label: "Expedited", value: "expedited" },
  { label: "Ground", value: "ground" },
  { label: "Next Day", value: "next_day" },
  { label: "Sea Freight", value: "sea_freight" },
  { label: "None", value: "none" },
];
export default function NewPurchaseOrderForm() {
  const purchaseOrderForm = useForm<z.infer<typeof PurchaseOrderSchema>>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof PurchaseOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  } 

  return (
    <div>
      <Form {...purchaseOrderForm}>
        <form
          onSubmit={purchaseOrderForm.handleSubmit((data) =>
            handleSubmit(data)
          )}
        > 
            <div className="flex flex-col gap-2 ">
              <SelectWrapper
                control={purchaseOrderForm.control}
                name="warehouse"
                label="Warehouse"
                required
                options={warehouseList}
              />

              <SelectWrapper
                control={purchaseOrderForm.control}
                name="vendor"
                label="Vendor"
                options={vendorList}
              />

              <DatePickerWrapper
                control={purchaseOrderForm.control}
                required
                name="dateOpened"
                label="Date Opened"
              />

              <DatePickerWrapper
                control={purchaseOrderForm.control}
                required
                name="dateRequired"
                label="Date Required"
              />

              <SelectWrapper
                control={purchaseOrderForm.control}
                name="buyer"
                label="Buyer"
                options={BuyerList}
              />

              <SelectWrapper
                control={purchaseOrderForm.control}
                name="terms"
                label="Terms"
                options={termsList}
              />

              <SelectWrapper
                control={purchaseOrderForm.control}
                name="shipped"
                label="Shipped Via"
                options={shippingModeList}
              />

              <InputWrapper
                control={purchaseOrderForm.control}
                name="invoice"
                label="Invoice"
                type="text"
                placeholder="Invoice number goes here"
                value={""}
              />

              <InputWrapper
                control={purchaseOrderForm.control}
                name="workOrderNumber"
                label="Work Order Number"
                type="number"
                placeholder=" Work Order Number goes here"
                value={""}
                warning="Enter work order numbers only. Do not enter any prefix characters."
              />

              <TextareaWrapper
                control={purchaseOrderForm.control}
                name="notes"
                label="Notes"
                value={""}
                rows={4}
              />

              <CustomFieldsWrapper
                control={purchaseOrderForm.control}
                name="customFields"
                label="Custom Fields"
                maxFields={10}
              />
            </div>
          

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Create Purchase Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
