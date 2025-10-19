"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

// Form wrappers

// Schema and types
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import { invoiceOptionsList } from "@/lib/Invoice/invoices-page-data";
import { Part, PartSchema } from "@/lib/WorkOrder/workOrder-data";
import { equipmentOptionsList } from "@/lib/option-list";
import { useGetCostCenters } from "@/services/setups/inventory";

export default function AddPart({
  initialValues,
  onSave,
}: {
  initialValues?: Part | null;
  onSave: (data: Part) => void;
}) {
    const { data: costCenterOptions } = useGetCostCenters();
  
  const form = useForm<Part>({
    resolver: zodResolver(PartSchema),
    defaultValues: {
      partNumber: "",
      name: "",
      quantityUsed: 1,
      unit_cost: 0,
    },
  });

  // Load data when editing
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Calculate total cost on quantity/unit_cost change
  const watchQty = form.watch("quantityUsed");
  const watchCost = form.watch("unit_cost");

  useEffect(() => {
    const total = +(watchQty * watchCost).toFixed(2);
    form.setValue("totalCost", total);
  }, [watchQty, watchCost, form]);

  function onSubmit(data: Part) {
    onSave({
      ...data,
      totalCost: +(data.quantityUsed * data.unit_cost).toFixed(2),
    });
  }

  // const watchQuantity = form.watch("quantityUsed");
  // const watchCost = form.watch("unit_cost");

  // useEffect(() => {
  //   const total = watchQuantity * watchCost;
  //   form.setValue("totalCost", total);
  // }, [watchQuantity, watchCost, form]);

  const watchPartUnderWarranty = form.watch("PartUnderWarranty");

  // function onSubmit(data: Part) {
  //   console.log("Form submitted with VALUES:", data);

  //   toast("Project created successfully!", {
  //     duration: 10000,
  //   });

  //   form.reset();
  // }

  function onError(errors: any) {
    // Get all error messages
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          unit: "Project Name",
        };

        return `${fieldLabels[field] || field}: ${error.message}`;
      }
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div>
          <div className="flex flex-col space-y-0.5">
            <ComboboxFieldWrapper
              control={form.control}
              name="AddPartsId"
              label="AddParts"
              options={equipmentOptionsList}
              required={true}
              searchPlaceholder="Search AddParts..."
            />
            <InputWrapper
              control={form.control}
              name="name"
              label="Name"
              type="text"
              value={""}
            />
            <InputWrapper
              control={form.control}
              name="description"
              label="Description"
              type="text"
              value={""}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="costCenter"
              label="Cost Center"
              options={costCenterOptions}
            />
            <InputWrapper
              control={form.control}
              name="quantityUsed"
              label="Quantity Used"
              type="number"
            />
            <InputWrapper
              className="col-span-1"
              control={form.control}
              name="unit_cost"
              label="Unit Cost"
              type="number"
            />
            <div className="grid grid-cols-2">
              <div className="col-span-1">
                <InputWrapper
                  className="col-span-1"
                  control={form.control}
                  name="extendCost"
                  label="Extend Cost"
                  type="number"
                  value={""}
                />
              </div>
              <div className="col-span-1 flex items-align-baseline">
                <SingleCheckboxWrapper
                  control={form.control}
                  name="warranty"
                  label="Replace Under Warranty"
                />
              </div>
            </div>

            <ComboboxFieldWrapper
              control={form.control}
              name="po"
              label="PO#"
              options={invoiceOptionsList}
            />
            <Fieldset
              legend="Warranty"
              content={
                <div className="grid grid-cols-7 ">
                  <div className="col-span-7">
                    <SingleCheckboxWrapper
                      control={form.control}
                      name="PartUnderWarranty"
                      label="Part under warranty"
                    />
                  </div>
                  <div className="col-span-3">
                    <InputWrapper
                      control={form.control}
                      name={`days`}
                      label="Days"
                      type="number"
                      value={""}
                      disabled={!watchPartUnderWarranty}
                      required
                    />
                    <InputWrapper
                      control={form.control}
                      name={`hours`}
                      label="Hours"
                      type="number"
                      value={""}
                      disabled={!watchPartUnderWarranty}
                      required
                    />
                  </div>
                  <div className="col-span-1 font-bold flex items-center justify-center">
                    --OR--
                  </div>
                  <div className="col-span-3">
                    <DatePickerWrapper
                      control={form.control}
                      disabled={!watchPartUnderWarranty}
                      name="expires"
                      label="Expires"
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit, onError)}
            className="min-w-32 my-4 w-full"
          >
            <>
              <Save className="mr-2 h-4 w-4" />
              Create AddParts
            </>
          </Button>
        </div>
      </form>
    </Form>
  );
}
