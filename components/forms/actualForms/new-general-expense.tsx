"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { costCenterOptions } from "@/components/forms/actualForms/work-order-form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { assigneeOptions, expenseOptions } from "@/lib/equipment-schema";
import { equipmentOptionsList } from "@/lib/option-list";
import CheckboxWrapper from "../wrappers/CheckboxWrapper";
import SingleCheckboxWrapper from "../wrappers/SingleCheckboxWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
// Zod schema
export const generalExpenseSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  inspectedBy: z.string().min(1, "Inspected By is required"),
  dueDate: z.string().min(1, "Date is required"),
  hours: z.coerce.number().min(0, "Hours required"),
  expense: z.string().min(1, "Expense is required"),
  costCenter: z.string().min(1, "Cost Center is required"),
  cost: z.coerce.number().min(0, "Cost is required"),
  extendedCost: z.coerce.number().min(0, "Extended Cost is required"),
  specifyPart: z.boolean().optional(),
  part: z.string().optional(),
  quantity: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type GeneralExpenseFormValues = z.infer<typeof generalExpenseSchema>;
const partOptions = [{ label: "Filter", value: "filter" }];

export default function GeneralExpense() {
  const form = useForm<GeneralExpenseFormValues>({
    resolver: zodResolver(generalExpenseSchema),
    defaultValues: {},
  });

  // Use form.watch to track checkbox state
  const specifyPart = form.watch("specifyPart");

  function onSubmit(data: GeneralExpenseFormValues) {
    console.log("Form submitted with VALUES:", data);
    form.reset();
    toast("Project created successfully!", {
      duration: 10000,
    });
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
          <div className="grid grid-cols-1 space-x-3">
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
                name="hours"
                label="Hours"
                type="number"
              />
              <ComboboxFieldWrapper
                control={form.control}
                name="expense"
                label="Expense"
                options={expenseOptions}
              />
              <SingleCheckboxWrapper
                control={form.control}
                name="specifyPart"
                label="Specify part used"
              />
              {specifyPart && (
                <>
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="part"
                    label="Part"
                    options={partOptions}
                  />
                  <InputWrapper
                    control={form.control}
                    name="quantity"
                    label="Quantity"
                    type="number"
                  />
                </>
              )}
              <ComboboxFieldWrapper
                control={form.control}
                name="costCenter"
                label="Cost Center"
                options={costCenterOptions}
              />
              <InputWrapper
                control={form.control}
                name="cost"
                label="Cost"
                type="number"
              />
              <InputWrapper
                control={form.control}
                name="extendedCost"
                label="Extended Cost"
                type="number"
              />

              <TextareaWrapper
                control={form.control}
                name="notes"
                label="Notes"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="min-w-32 my-4 w-full">
            <Save className="mr-2 h-4 w-4" />
            Create Equipment
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function EditGeneralExpense({
  children,
  data,
  onEdit, // optional callback
}: {
  children: React.ReactNode;
  data: GeneralExpenseFormValues;
  onEdit?: (data: GeneralExpenseFormValues) => void; // optional
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<GeneralExpenseFormValues>({
    resolver: zodResolver(generalExpenseSchema),
    defaultValues: data,
  });

  // Use form.watch to track checkbox state
  const specifyPart = data.specifyPart || form.watch("specifyPart");

  function onSubmit(data: GeneralExpenseFormValues) {
    console.log("Form submitted with VALUES:", data);
    form.reset();
    toast("Project created successfully!", {
      duration: 10000,
    });
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-1/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit General Expense</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div className="flex flex-col">
                <div className="grid grid-cols-1 space-x-3">
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
                      name="hours"
                      label="Hours"
                      type="number"
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="expense"
                      label="Expense"
                      options={expenseOptions}
                    />
                    {/* <SingleCheckboxWrapper
                      control={form.control}
                      name="specifyPart"
                      label="Specify part used"
                    /> */}
                    {specifyPart && (
                      <>
                        <ComboboxFieldWrapper
                          control={form.control}
                          name="part"
                          label="Part"
                          options={partOptions}
                        />
                        <InputWrapper
                          control={form.control}
                          name="quantity"
                          label="Quantity"
                          type="number"
                        />
                      </>
                    )}
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="costCenter"
                      label="Cost Center"
                      options={costCenterOptions}
                    />
                    <InputWrapper
                      control={form.control}
                      name="cost"
                      label="Cost"
                      type="number"
                    />
                    <InputWrapper
                      control={form.control}
                      name="extendedCost"
                      label="Extended Cost"
                      type="number"
                    />

                    <TextareaWrapper
                      control={form.control}
                      name="notes"
                      label="Notes"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="min-w-32 my-4 w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Create Equipment
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
