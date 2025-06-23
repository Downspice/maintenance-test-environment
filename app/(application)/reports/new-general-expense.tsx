"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Camera, LucideTrash2, Save } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
  assigneeOptions,
  expenseOptions,
} from "@/lib/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import {
  conditionOptionsList,
  equipmentOptionsList,
  locationOptionsList,
} from "@/lib/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorityOptions } from "../work-orders/forms/newWorkOrderFormSheet";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { costCenterOptions } from "@/components/forms/actualForms/work-order-form";

interface triggerVariant {
  variant?: "icon" | "default";
}
export default function RepairRequestForm({ variant }: triggerVariant) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      status: "Active",
      renewalInterval: 1,
      primaryMeter: 0,
      secondaryMeter: 0,
      purchasePrice: 0,
      salvagePrice: 0,
      depreciationLifeMonths: 0,
      warrantyDescription: "Primary",
      secondaryWarrantyDescription: "Secondary",
      mviInterval: 1,
      ownership: "Owned",
      fuelVolumeUnits: "Gallons",
      annualOperatingBudget: 0,
      hasMeter: false,
    },
  });

  function onSubmit(data: EquipmentFormValues) {
    console.log("Form submitted with VALUES:", data);
    toast("Project created successfully!", {
      duration: 10000,
    });

    setOpen(false);
    form.reset();
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
        <div className="flex flex-col">
          <div className="grid grid-cols-2 space-x-3">
            <div className="col-span-1 flex flex-col">
              <ComboboxFieldWrapper
                control={form.control}
                name="equipment"
                label="Equipment"
                options={equipmentOptionsList}
              />
              <ComboboxFieldWrapper
                control={form.control}
                name="inspectedBy"
                label="Inspected By"
                options={assigneeOptions}
              />
              <DatePickerWrapper
                control={form.control}
                name="dueDate"
                label="Date"
              />
              <InputWrapper
                control={form.control}
                name={"hours"}
                label={"Hours"}
                value={""}
                type="number"
              />

              <ComboboxFieldWrapper
                control={form.control}
                name="expense"
                label="Expense"
                options={expenseOptions}
              />
              <ComboboxFieldWrapper
                control={form.control}
                name="costCenter"
                label="Cost Center"
                options={costCenterOptions}
              />
              <InputWrapper
                control={form.control}
                name={"cost"}
                label={"Cost"}
                value={""}
                type="number"
              />
              <InputWrapper
                control={form.control}
                name={"extendedCost"}
                label={"Extended Cost"}
                value={""}
                type="number"
              />
              <TextareaWrapper
                control={form.control}
                name={"extendedCost"}
                label={"Extended Cost"}
                value={""}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 my-4 w-full"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Equipment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
