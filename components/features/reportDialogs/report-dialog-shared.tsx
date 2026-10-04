"use client";

import { z } from "zod";
import type { Control } from "react-hook-form";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import FormSubheader from "@/components/forms/ui/formSubheader";
import { dateIntervalOptionsList } from "@/lib/shared/option-list";
import { equipmentActiveDropdown } from "@/app/(application)/equipment/page";
import type { GenericObject } from "@/types/types";

export type ReportDialogFormProps = {
  formId?: string;
  hideSubmitButton?: boolean;
};

export const equipmentDateRangeReportSchema = z
  .object({
    AddPartsId: z.string().min(1, "Equipment is required"),
    dateInterval: z.string().min(1, "Select a date interval"),
    start: z.date().optional(),
    end: z.date().optional(),
    sortingOne: z.string().optional(),
    sortingOneDirection: z.string().optional(),
    sortingTwo: z.string().optional(),
    sortingTwoDirection: z.string().optional(),
    sortingThree: z.string().optional(),
    sortingThreeDirection: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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

export type EquipmentDateRangeReportValues = z.infer<
  typeof equipmentDateRangeReportSchema
>;

export const inventoryListingReportSchema = z.object({
  sortingOne: z.string().optional(),
  sortingOneDirection: z.string().optional(),
  sortingTwo: z.string().optional(),
  sortingTwoDirection: z.string().optional(),
  sortingThree: z.string().optional(),
  sortingThreeDirection: z.string().optional(),
});

export type InventoryListingReportValues = z.infer<
  typeof inventoryListingReportSchema
>;

const SORT_DIRECTION_OPTIONS = [
  { name: "Ascending", id: "asc" },
  { name: "Descending", id: "desc" },
];

const DEFAULT_SORT_FIELD_OPTIONS: GenericObject[] = [
  { id: "name", name: "Name" },
  { id: "date", name: "Date" },
  { id: "cost", name: "Cost" },
];

const REPORT_SORTING_LEVELS = [
  {
    sortKey: "sortingOne" as const,
    directionKey: "sortingOneDirection" as const,
    label: "Primary",
  },
  {
    sortKey: "sortingTwo" as const,
    directionKey: "sortingTwoDirection" as const,
    label: "Secondary",
  },
  {
    sortKey: "sortingThree" as const,
    directionKey: "sortingThreeDirection" as const,
    label: "Tertiary",
  },
];

const reportSortingGridClassName = "grid grid-cols-2 gap-3";

export function ReportSortingFields({
  control,
  sortingOptions = DEFAULT_SORT_FIELD_OPTIONS,
}: {
  control: Control<any>;
  sortingOptions?: GenericObject[];
}) {
  return (
    <div className="flex flex-col gap-1 pt-2">
      <FormSubheader header="Sort order" />
      <div className={reportSortingGridClassName}>
        {REPORT_SORTING_LEVELS.map(({ sortKey, directionKey, label }) => (
          <div
            key={sortKey}
            className="flex flex-col gap-1 rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-3"
          >
            <ComboboxFieldWrapper
              control={control}
              name={sortKey}
              label={`${label} sort`}
              options={sortingOptions}
              placeholder="Select field"
              emptyText="No sort fields available."
            />
            <RadioGroupWrapper
              control={control}
              name={directionKey}
              label="Direction"
              orientation="horizontal"
              options={SORT_DIRECTION_OPTIONS}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EquipmentDateRangeReportFields({
  control,
  watchDateInterval,
  equipmentLabel = "Equipment",
}: {
  control: Control<EquipmentDateRangeReportValues>;
  watchDateInterval: string;
  equipmentLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <FormSubheader header="Filters" />
      <ComboboxFieldWrapper
        control={control}
        name="AddPartsId"
        label={equipmentLabel}
        options={equipmentActiveDropdown}
        required
      />
      <ComboboxFieldWrapper
        control={control}
        name="dateInterval"
        label="Date interval"
        options={[...dateIntervalOptionsList, { name: "Custom", id: "custom" }]}
        required
      />
      {watchDateInterval === "custom" && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
          <DatePickerWrapper
            control={control}
            name="start"
            label="Start date"
            required
          />
          <DatePickerWrapper
            control={control}
            name="end"
            label="End date"
            required
          />
        </div>
      )}
    </div>
  );
}
