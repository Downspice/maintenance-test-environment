"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
 import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";

const advancedSchema = z.object({
  estimatedLaborTime: z.coerce.number().optional(),

  includePMServiceEmail: z.boolean().optional(),

  linkedPMService: z.boolean().optional(),
  linkedServiceOption: z.string().optional(),

  terminateOnDate: z.boolean().optional(),
  terminateDate: z.date().optional(),

  terminateAtMeter: z.boolean().optional(),
  meterReading: z.coerce.number().optional(),

  ignorePMInDateRange: z.boolean().optional(),
  ignoreStartDate: z.date().optional(),
  ignoreEndDate: z.date().optional(),
});

type AdvancedForm = z.infer<typeof advancedSchema>;

const pmOptions = [
  { label: "Quarterly Maintenance", value: "quarterly" },
  { label: "Annual Checkup", value: "annual" },
];

export default function ManagePMAdvancedTab() {
  const form = useForm<AdvancedForm>({
    resolver: zodResolver(advancedSchema),
    defaultValues: {
      includePMServiceEmail: false,
      linkedPMService: false,
      terminateOnDate: false,
      terminateAtMeter: false,
      ignorePMInDateRange: false,
    },
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const linkedPM = watch("linkedPMService");
  const terminateOnDate = watch("terminateOnDate");
  const terminateAtMeter = watch("terminateAtMeter");
  const ignorePMInRange = watch("ignorePMInDateRange");

  const onSubmit = (data: AdvancedForm) => {
    console.log("Advanced settings:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
      <InputWrapper
        control={control}
        name="estimatedLaborTime"
        label="Estimated Labor Time (hours)"
        type="number"
      />

      <SingleCheckboxWrapper
        control={control}
        name="includePMServiceEmail"
        label="Include PM Service with Email Notifications"
      />

      <SingleCheckboxWrapper
        control={control}
        name="linkedPMService"
        label="Linked PM Service"
      />

      {linkedPM && (
        <ComboboxFieldWrapper
          control={control}
          name="linkedServiceOption"
          label="Select Linked PM Service"
          options={pmOptions}
          placeholder="Choose service"
          searchPlaceholder="Search service"
          emptyText="No PM services found"
        />
      )}

      <SingleCheckboxWrapper
        control={control}
        name="terminateOnDate"
        label="Terminate Tracking on Date"
      />

      {terminateOnDate && (
        <DatePickerWrapper control={control} name="terminateDate" label="Terminate Date" />
      )}

      <SingleCheckboxWrapper
        control={control}
        name="terminateAtMeter"
        label="Terminate Tracking at (meters)"
      />

      {terminateAtMeter && (
        <InputWrapper
          control={control}
          name="meterReading"
          label="Meter Reading"
          type="number"
        />
      )}

      <SingleCheckboxWrapper
        control={control}
        name="ignorePMInDateRange"
        label="PM Service will be Ignored During the Following Date Period"
      />

      {ignorePMInRange && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerWrapper
            control={control}
            name="ignoreStartDate"
            label="Start Date"
          />
          <DatePickerWrapper
            control={control}
            name="ignoreEndDate"
            label="End Date"
          />
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
}
