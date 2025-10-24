"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { equipmentActiveDropdown } from "@/app/(application)/equipment/page";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { dateIntervalOptionsList } from "@/lib/option-list";
import { z } from "zod";

export const HistorySchema = z.object({
  AddPartsId: z.string().min(1, "AddParts is required"),
  dateInterval: z.string().min(1, "Select a date interval"),
  start: z.date().optional(),
  end: z.date().optional(),
  sortingOne: z.string().optional(),
  sortingOneDirection: z.string().optional(),
  sortingTwo: z.string().optional(),
  sortingTwoDirection: z.string().optional(),
  sortingThree: z.string().optional(),
  sortingThreeDirection: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.dateInterval === "custom") {
    if (!data.start) {
      ctx.addIssue({
        path: ["start"],
        code: z.ZodIssueCode.custom,
        message: "Start date is required for custom interval",
      });
    }
    if (!data.end) {
      ctx.addIssue({
        path: ["end"],
        code: z.ZodIssueCode.custom,
        message: "End date is required for custom interval",
      });
    }
  }
});

type HistoryFormValues = z.infer<typeof HistorySchema>;

export default function HistoryReportGeneration() {
  const form = useForm<HistoryFormValues>({
    resolver: zodResolver(HistorySchema),
    defaultValues: {
      dateInterval: "",
    },
  });

  const watchDateInterval = form.watch("dateInterval");

  const onSubmit = (data: HistoryFormValues) => {
    console.log("✅ Form submitted", data);
  };

  const onError = (errors: any) => {
    console.error("❌ Form errors", errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <ComboboxFieldWrapper
          control={form.control}
          name="AddPartsId"
          label="Add Parts"
          options={equipmentActiveDropdown}
          required
        />

        <ComboboxFieldWrapper
          control={form.control}
          name="dateInterval"
          label="Date Interval"
          options={[
            ...dateIntervalOptionsList,
            { name: "Custom", id: "custom" },
          ]}
        />

        {watchDateInterval === "custom" && (
          <>
            <DatePickerWrapper
              control={form.control}
              name="start"
              label="Start Date"
            />
            <DatePickerWrapper
              control={form.control}
              name="end"
              label="End Date"
            />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index}>
              <ComboboxFieldWrapper
                control={form.control}
                name={`sorting${index}` as const}
                label={`Sorting ${index}`}
                options={[]}
              />
              <RadioGroupWrapper
                control={form.control}
                name={`sorting${index}Direction` as const}
                label=""
                options={[
                  { name: "Ascending", id: "asc" },
                  { name: "Descending", id: "desc" },
                ]}
              />
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full">
          Generate Report
        </Button>
      </form>
    </Form>
  );
}
