"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { costCenterOptions } from "@/components/forms/actualForms/work-order-form";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import { performedOptionList } from "@/lib/work-orders-data";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { z } from "zod";
import { vendorOptions } from "@/lib/equipment-schema";
import { AddLaborFormValues ,AddLaborSchema} from "@/lib/WorkOrder/workOrder-data";



type AddLaborProps = {
  onSave: (cost: Partial<AddLaborFormValues>) => void;
  initialValues?: Partial<AddLaborFormValues>;
};

export default function AddLabor({ onSave, initialValues }: AddLaborProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddLaborFormValues>({
    resolver: zodResolver(AddLaborSchema),
    defaultValues: {
      laborRate: initialValues?.laborRate ?? 0,
      hours: initialValues?.hours ?? 0,
      totalCost: initialValues?.totalCost ?? 0,
      usage: "Active",
      ...initialValues,
    },
  });

  const laborRate = form.watch("laborRate");
  const hours = form.watch("hours");

  useEffect(() => {
    const rate = parseFloat(laborRate) || 0;
    const hrs = parseFloat(hours) || 0;
    const total = rate * hrs;
    form.setValue("totalCost", total);
  }, [laborRate, hours, form]);

  function onSubmit(data: AddLaborFormValues) {
    const calculatedCost = Number(data.laborRate) * Number(data.hours);
    form.setValue("totalCost", calculatedCost);
    onSave(data); // send cost back to AddMaintenance
    toast.success("Labor saved.");
    setOpen(false);
    //form.reset();
  }

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
            <RadioGroupWrapper
              control={form.control}
              name="laborType"
              label="Performed by"
              options={performedOptionList}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="technicianName"
              label="Technician"
              options={vendorOptions}
            />
            <TextareaWrapper
              control={form.control}
              name="workPerformed"
              label="Work Performed"
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
              name="laborRate"
              label="Last Rate"
              type="number"
              value={""}
            />
            <InputWrapper
              control={form.control}
              name="hours"
              label="Hours"
              type="text"
              value={""}
            />
            <InputWrapper
              className="col-span-1"
              control={form.control}
              name="totalCost"
              label="Total Cost"
              type="number"
              value={""}
              disabled
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit, onError)}
            disabled={isSubmitting}
            className="min-w-32 my-4 w-full"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                 Add Labor
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
