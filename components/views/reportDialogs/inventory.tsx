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

export const InventoryReportSchema = z.object({
  sortingOne: z.string().optional(),
  sortingOneDirection: z.string().optional(),
  sortingTwo: z.string().optional(),
  sortingTwoDirection: z.string().optional(),
  sortingThree: z.string().optional(),
  sortingThreeDirection: z.string().optional(),
});

type InventoryReportFormValues = z.infer<typeof InventoryReportSchema>;

export default function InventoryReportGeneration() {
  const form = useForm<InventoryReportFormValues>({
    resolver: zodResolver(InventoryReportSchema),
    defaultValues: {},
  });

  const onSubmit = (data: InventoryReportFormValues) => {
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
