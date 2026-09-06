"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Fieldset from "@/components/customUI/fieldset";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import CheckboxWrapper from "@/components/forms/fields/CheckboxWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";

const equipmentOptionsList = [
  { name: "Drill Press", id: "drill-press" },
  { name: "Air Compressor", id: "air-compressor" },
];

const EmployeeCheckboxOptions = [
  { id: "lubrication", name: "Lubrication" },
  { id: "inspection", name: "Inspection" },
  { id: "calibration", name: "Calibration" },
  { id: "testing", name: "Testing" },
];

const workOrderCategoriesList = [
  { name: "Blank work order", id: "Blank work order" },
  {
    name: "Include due and soon due tasks",
    id: "Include due and soon due tasks",
  },
  { name: "Include due tasks only", id: "Include due tasks only" },
];

const includeCategoriesList = [
  { name: "All maintenance", id: "All maintenance" },
  {
    name: "Preventive maintenance only",
    id: "Preventive maintenance only",
  },
  { name: "Repairs only", id: "Repairs only" },
];

const dateMeterList = [
  { name: "All", id: "All" },
  { name: "Date Only", id: "Date Only" },
  { name: "Meter Only", id: "Meter Only" },
];

export const GenerateOptionSchema = z.object({
  equipment: z.string().optional(),
  workOrderCategories: z.string().optional(),
  singleWorkOrder: z.boolean().optional(),
  include: z.string().optional(),
  dateMeter: z.string().optional(),
  additionalTasks: z.boolean().optional(),
  closeWorkOrders: z.boolean().optional(),
  dueRangeOn: z.boolean().optional(),
  dueRangeStart: z.date().optional(),
  dueRangeEnd: z.date().optional(),
  selectedTasks: z.array(z.string()).optional(),
});

export type GenerateOptionItemInterface = z.infer<typeof GenerateOptionSchema>;

export default function GenerateOptionTab() {
  const form = useForm<GenerateOptionItemInterface>({
    resolver: zodResolver(GenerateOptionSchema),
    defaultValues: {
      selectedTasks: [],
    },
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  const workOrderCategory = form.watch("workOrderCategories");
  const dueRangeOn = form.watch("dueRangeOn");
  const selectedTasks = form.watch("selectedTasks") ?? [];
  const additionalTasks = form.watch("additionalTasks");

  useEffect(() => {
    if (workOrderCategory === "Blank work order") {
      form.setValue("include", undefined);
      form.setValue("dateMeter", undefined);
      form.setValue("dueRangeOn", false);
      form.setValue("dueRangeStart", undefined);
      form.setValue("dueRangeEnd", undefined);
    }
  }, [workOrderCategory, form]);

  useEffect(() => {
    if (additionalTasks) {
      setShowTaskDialog(true);
    }
  }, [additionalTasks]);

  function onSubmit(data: GenerateOptionItemInterface) {
    console.log("Form submitted with VALUES:", data);
    toast.success("Work orders generated successfully!");
    form.reset();
    setShowAdvanced(false);
  }

  function onError(errors: any) {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          equipment: "Equipment",
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
        className="space-y-4"
      >
        <ComboboxFieldWrapper
          control={form.control}
          name="equipment"
          label="Generate work orders for"
          options={equipmentOptionsList}
        />

        <RadioGroupWrapper
          control={form.control}
          name="workOrderCategories"
          label="Work Order Type"
          options={workOrderCategoriesList}
        />

        <SingleCheckboxWrapper
          control={form.control}
          name="singleWorkOrder"
          label="Single Work Order"
        />

        <Button
          type="button"
          className="min-w-32 w-full"
          onClick={() => {
            const toggle = !showAdvanced;
            setShowAdvanced(toggle);

            if (!toggle) {
              form.setValue("additionalTasks", false);
              form.setValue("closeWorkOrders", false);
              form.setValue("dueRangeOn", false);
              form.setValue("dueRangeStart", undefined);
              form.setValue("dueRangeEnd", undefined);
              form.setValue("include", undefined);
              form.setValue("dateMeter", undefined);
              form.setValue("selectedTasks", []);
            }
          }}
        >
          {showAdvanced ? "Hide Advanced" : "Advanced"}
        </Button>

        {showAdvanced && (
          <>
            <Fieldset
              legend="Advanced Options"
              content={
                <>
                  {(workOrderCategory === "Include due tasks only" ||
                    workOrderCategory === "Include due and soon due tasks") && (
                    <SingleCheckboxWrapper
                      control={form.control}
                      name="closeWorkOrders"
                      label="Automatically close work orders"
                    />
                  )}

                  <SingleCheckboxWrapper
                    control={form.control}
                    name="additionalTasks"
                    label="Additional task"
                    onCheckedChange={(checked: boolean) => {
                      form.setValue("additionalTasks", checked);
                      if (!checked) {
                        form.setValue("selectedTasks", []);
                      }
                    }}
                  />

                  {selectedTasks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto">
                      {selectedTasks.map((task) => (
                        <span
                          key={task}
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              }
            />

            {workOrderCategory !== "Blank work order" && (
              <>
                <Fieldset
                  legend="Include"
                  content={
                    <RadioGroupWrapper
                      control={form.control}
                      name="include"
                      label=" "
                      options={includeCategoriesList}
                    />
                  }
                />

                <Fieldset
                  legend="Date or Meter Interval"
                  content={
                    <>
                      <RadioGroupWrapper
                        control={form.control}
                        name="dateMeter"
                        label=" "
                        options={dateMeterList}
                      />
                      <div className="mt-2 space-y-2">
                        <SingleCheckboxWrapper
                          control={form.control}
                          name="dueRangeOn"
                          label="Specify Due Range"
                          onCheckedChange={(checked) => {
                            form.setValue("dueRangeOn", checked);
                            if (!checked) {
                              form.setValue("dueRangeStart", undefined);
                              form.setValue("dueRangeEnd", undefined);
                            }
                          }}
                        />

                        <div className="flex items-center space-x-2">
                          <DatePickerWrapper
                            control={form.control}
                            name="dueRangeStart"
                            label="From"
                            disabled={!dueRangeOn}
                          />
                          <span>to</span>
                          <DatePickerWrapper
                            control={form.control}
                            name="dueRangeEnd"
                            label="To"
                            disabled={!dueRangeOn}
                          />
                        </div>
                      </div>
                    </>
                  }
                />
              </>
            )}
          </>
        )}

        <Button type="submit" className="w-full">
          Generate
        </Button>
      </form>

      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Additional Tasks</DialogTitle>
          </DialogHeader>

          <CheckboxWrapper
            label=""
            control={form.control}
            name="selectedTasks"
            options={EmployeeCheckboxOptions.map((t) => ({
              name: t.label,
              id: t.id,
            }))}
          />

          <DialogFooter>
            <Button type="button" onClick={() => setShowTaskDialog(false)}>
              OK
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowTaskDialog(false);
                form.setValue("selectedTasks", []);
                form.setValue("additionalTasks", false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
