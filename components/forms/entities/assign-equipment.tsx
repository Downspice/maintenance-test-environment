"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LucideTrash2, Save } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
// Form wrappers
import InputWrapper from "@/components/forms/fields/InputWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
  assigneeOptions,
} from "@/lib/schemas/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import {
  equipmentOptionsList,
  jobSiteOptionsList,
  rateDurationOptions,
  vendorTypeOptions,
} from "@/lib/shared/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { Input } from "@/components/ui/input";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadioGroupWrapper, {
  RadioOption,
} from "@/components/forms/fields/RadioGroupWrapper";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import {
  useGetLocations,
} from "@/services/setups/lookups";

interface triggerVariant {
  variant?: "icon" | "default";
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
}
export default function EquipmentAssignment({
  variant,
  formId = "assign-equipment-form",
  hideSubmitButton,
  onSuccess,
}: triggerVariant) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: destinationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();
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
    onSuccess?.();
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
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex min-w-0 flex-col gap-1"
      >
        <Tabs defaultValue="Assignment" className="w-full min-w-0">
          <TabsList>
            <TabsTrigger value="Assignment">Assignment</TabsTrigger>
            <TabsTrigger value="Expenses">Expenses</TabsTrigger>
            <TabsTrigger value="Notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="Assignment" className="mt-4 flex min-w-0 flex-col gap-1">
                <ComboboxFieldWrapper
                  control={form.control}
                  name="inspectedBy"
                  label="Inspected By"
                  options={equipmentOptionsList}
                />
                <RadioGroupWrapper
                  control={form.control}
                  name="usage"
                  label="Usage"
                  options={usageOptions}
                  orientation="horizontal"
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="job"
                  label="Job"
                  options={jobSiteOptionsList}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="employee"
                  label="Employee"
                  options={assigneeOptions}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="employee"
                  label="Employee"
                  options={assigneeOptions}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="customer"
                  label="Customer"
                  options={assigneeOptions}
                />

                <Fieldset
                  legend="Duration"
                  className="rounded-2xl border-0 bg-bg-weak-50/40 p-4 ring-1 ring-inset ring-stroke-soft-200"
                  content={
                    <div className="flex flex-col gap-4">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-label-sm font-medium text-text-sub-600">
                          OUT
                        </span>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-3">
                          <DatePickerWrapper
                            control={form.control}
                            name="outDate"
                            label="Date"
                          />
                          <DatePickerWrapper
                            control={form.control}
                            name="outTime"
                            label="Time"
                          />
                          <InputWrapper
                            control={form.control}
                            name="outHours"
                            label="Hours"
                            placeholder="Enter hours"
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-label-sm font-medium text-text-sub-600">
                          IN
                        </span>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-3">
                          <DatePickerWrapper
                            control={form.control}
                            name="inDate"
                            label="Date"
                          />
                          <DatePickerWrapper
                            control={form.control}
                            name="inTime"
                            label="Time"
                          />
                          <InputWrapper
                            control={form.control}
                            name="inHours"
                            label="Hours"
                            placeholder="Enter hours"
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-paragraph-sm text-primary-base">
                          Assigned period: 4 week(s)
                        </div>
                        <SingleCheckboxWrapper
                          control={form.control}
                          name="excludeWeeekend"
                          label="Exclude weekends"
                        />
                      </div>
                    </div>
                  }
                />
                <Fieldset
                  legend="Optional Details"
                  className="rounded-2xl border-0 bg-bg-weak-50/40 p-4 ring-1 ring-inset ring-stroke-soft-200"
                  content={
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                      <ComboboxFieldWrapper
                        className="cols-span-2"
                        control={form.control}
                        name="destination"
                        label="Destination"
                        options={destinationOptionsList}
                      />
                      <ComboboxFieldWrapper
                        className="cols-span-1"
                        control={form.control}
                        name="type_id"
                        label="Type"
                        options={vendorTypeOptions}
                      />
                      <InputWrapper
                        control={form.control} className="cols-span-1"
                        name="state"
                        label="State/Province"
                        type={"number"}
                        value={"0.00"}
                      />
                      <InputWrapper
                        control={form.control}
                        name="rate"
                        label={"Rate"}
                        type={"number"}
                        value={"0.00"}
                      />
                      <ComboboxFieldWrapper
                        className="cols-span-1"
                        control={form.control}
                        name="state"
                        label="State/Province"
                        options={rateDurationOptions}
                      />
                    </div>
                  }
                />
          </TabsContent>
          <TabsContent value="Expenses" className="mt-4 min-w-0">
            <div className="min-w-0 overflow-x-auto">
              <EditableDataTable
                data={people}
                columns={columns}
                defaultRow={{ id: "", description: "", cost: "" }}
                onDataChange={(newData) => {
                  console.log("Updated Data:", newData);
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="Notes" className="mt-4 flex flex-col gap-1">
            <TextareaWrapper
              control={form.control}
              name="notes"
              label="Notes"
            />
          </TabsContent>
        </Tabs>
        {!hideSubmitButton && (
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
                  Save
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

const people = [{}];

type RepairRequestInterface = {
  id?: number;
  description: string;
  cost: string;
};

export const columns: ColumnDef<RepairRequestInterface>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.name}
        onChange={(e) => updateRow(rowIndex, "description", e)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.name}
        onChange={(e) => updateRow(rowIndex, "cost", e)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => console.log(`Delete ${person.cost}`)}
          >
            <LucideTrash2 className="text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export const usageOptions: RadioOption[] = [
  { name: "Job site", id: "jobSite", description: " " },
  { name: "Employee", id: "employee", description: " " },
  { name: "Customer", id: "customer", description: " " },
];
