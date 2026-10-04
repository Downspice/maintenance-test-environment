"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ReportSortingFields,
  inventoryListingReportSchema,
  type InventoryListingReportValues,
  type ReportDialogFormProps,
} from "./report-dialog-shared";

/** @deprecated Use inventoryListingReportSchema */
export const InventoryReportSchema = inventoryListingReportSchema;

export default function InventoryReportGeneration({
  formId = "inventory-listing-report-form",
  hideSubmitButton,
}: ReportDialogFormProps = {}) {
  const form = useForm<InventoryListingReportValues>({
    resolver: zodResolver(inventoryListingReportSchema),
    defaultValues: {
      sortingOneDirection: "asc",
      sortingTwoDirection: "asc",
      sortingThreeDirection: "asc",
    },
  });

  const onSubmit = (data: InventoryListingReportValues) => {
    console.log("✅ Form submitted", data);
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1"
      >
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
