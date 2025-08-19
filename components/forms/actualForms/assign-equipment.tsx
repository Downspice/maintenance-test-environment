"use client";

import { useState } from "react";
import {
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LucideTrash2, Save } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
  assigneeOptions,
} from "@/lib/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import {
  destinationOptionsList,
  equipmentOptionsList,
  jobSiteOptionsList,
  rateDurationOptions,
  stateProvinceOptions,
  vendorTypeOptions,
} from "@/lib/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { Input } from "@/components/ui/input";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadioGroupWrapper, {
  RadioOption,
} from "@/components/forms/wrappers/RadioGroupWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";

interface triggerVariant {
  variant?: "icon" | "default";
}
export default function EquipmentAssignment({ variant }: triggerVariant) {
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
            <Tabs defaultValue="Assignment">
              <TabsList>
                <TabsTrigger value="Assignment">Assignment</TabsTrigger>
                <TabsTrigger value="Expenses">Expenses</TabsTrigger>
                <TabsTrigger value="Notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="Assignment" className="space-y-2">
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
                  content={
                    <>
                      <div className="flex items-end">
                        <span>OUT</span>
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
                          placeholder="Enter Hours"
                          type={""}
                          value={""}
                        />
                      </div>
                      <div className="flex ">
                        <span>{"INT  "}</span>
                        <DatePickerWrapper
                          control={form.control}
                          name="inDate"
                          label=" "
                        />
                        <DatePickerWrapper
                          control={form.control}
                          name="inTime"
                          label=" "
                        />
                        <InputWrapper
                          control={form.control}
                          name="inHours"
                          label=" "
                          placeholder="Enter Hours"
                          type={""}
                          value={""}
                        />
                      </div>
                      <div className="flex justify-between ">
                        <div className="text-primary">
                          Assigned Period : 4 week(s)
                        </div>
                        <div className="">
                          <SingleCheckboxWrapper
                            control={form.control}
                            name={"excludeWeeekend"}
                            label={"Exclude Weekends"}
                          />
                        </div>
                      </div>
                    </>
                  }
                />
                <Fieldset
                  legend="Optional Details"
                  content={
                    <div className="grid grid-cols-2">
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
                        name="type"
                        label="Type"
                        options={vendorTypeOptions}
                      />

                      <ComboboxFieldWrapper
                        className="cols-span-1"
                        control={form.control}
                        name="state"
                        label="State/Province"
                        options={stateProvinceOptions}
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
              <TabsContent value="Expenses" className="space-y-2">
                <EditableDataTable
                  data={people}
                  columns={columns}
                  defaultRow={{ id: "", description: "", cost: "" }}
                  onDataChange={(newData) => {
                    console.log("Updated Data:", newData);
                  }}
                />
              </TabsContent>
              <TabsContent value="Notes" className="space-y-2">
                <TextareaWrapper
                  control={form.control}
                  name={"notes"}
                  label={"Notes"}
                  value={""}
                />
              </TabsContent>
            </Tabs>
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
                Save
              </>
            )}
          </Button>
        </div>
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
  {
    label: "Job site",
    value: "Attachments",
    description: " ",
  },
  {
    label: "Employee",
    value: "Attachments",
    description: " ",
  },
  {
    label: "Customer",
    value: "Attachments",
    description: " ",
  },
];
