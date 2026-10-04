"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  EquipmentDateRangeReportFields,
  ReportSortingFields,
  equipmentDateRangeReportSchema,
  type EquipmentDateRangeReportValues,
  type ReportDialogFormProps,
} from "./report-dialog-shared";

/** @deprecated Use equipmentDateRangeReportSchema */
export const FuelSchema = equipmentDateRangeReportSchema;

export default function FuelReportGeneration({
  formId = "fuel-report-form",
  hideSubmitButton,
}: ReportDialogFormProps = {}) {
  const form = useForm<EquipmentDateRangeReportValues>({
    resolver: zodResolver(equipmentDateRangeReportSchema),
    defaultValues: {
      dateInterval: "",
      sortingOneDirection: "asc",
      sortingTwoDirection: "asc",
      sortingThreeDirection: "asc",
    },
  });

  const watchDateInterval = form.watch("dateInterval");

  const onSubmit = (data: EquipmentDateRangeReportValues) => {
    console.log("✅ Form submitted", data);
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1"
      >
        <EquipmentDateRangeReportFields
          control={form.control}
          watchDateInterval={watchDateInterval}
        />
        <ReportSortingFields control={form.control} />
        {!hideSubmitButton && (
          <Button type="submit" className="mt-4 w-full">
            Generate report
          </Button>
        )}
      </form>
    </Form>
  );
}
