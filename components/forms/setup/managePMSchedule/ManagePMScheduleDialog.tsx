"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import { useEffect } from "react";
import { z } from "zod";
import { FormModal } from "@/components/ui/form-modal";

const meterOptions = [
  { name: "Hour", id: "hour" },
  { name: "Miles", id: "Miles" },
];

export const ManagePMScheduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Schedule name is required"),
  trackByDate: z.boolean().optional(),
  trackByMeterPrimary: z.boolean().optional(),
  meterPrimaryType: z.string().optional(),
  trackByMeterSecondary: z.boolean().optional(),
  meterSecondaryType: z.string().optional(),
});

export type ManagePMScheduleFormValues = z.infer<typeof ManagePMScheduleSchema>;

interface ManagePMScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Partial<ManagePMScheduleFormValues> | null;
  onSave: (data: ManagePMScheduleFormValues) => void;
}

export default function ManagePMScheduleDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ManagePMScheduleDialogProps) {
  const form = useForm<ManagePMScheduleFormValues>({
    resolver: zodResolver(ManagePMScheduleSchema),
    defaultValues: {
      name: "",
      trackByDate: false,
      trackByMeterPrimary: false,
      trackByMeterSecondary: false,
      meterPrimaryType: undefined,
      meterSecondaryType: undefined,
    },
  });

  const { control, reset } = form;

  const trackByMeterPrimary = useWatch({ control, name: "trackByMeterPrimary" });
  const trackByMeterSecondary = useWatch({
    control,
    name: "trackByMeterSecondary",
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        trackByDate: false,
        trackByMeterPrimary: false,
        trackByMeterSecondary: false,
        meterPrimaryType: undefined,
        meterSecondaryType: undefined,
      });
    }
  }, [initialData, reset, open]);

  const isEdit = Boolean(initialData?.id ?? initialData?.name);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit PM schedule template" : "Add PM schedule template"}
      description="Configure how this template tracks due dates and meter readings."
      formId="pm-schedule-template-dialog-form"
      form={form}
      submitLabel={isEdit ? "Save changes" : "Create template"}
      scrollable
      size="md"
      onSubmit={(data) => {
        onSave(data);
        onOpenChange(false);
      }}
    >
      <InputWrapper control={control} name="name" label="Schedule name" />
      <SingleCheckboxWrapper
        control={control}
        name="trackByDate"
        label="Track by date"
      />
      <SingleCheckboxWrapper
        control={control}
        name="trackByMeterPrimary"
        label="Track by meter (primary)"
      />
      <SelectWrapper
        control={control}
        name="meterPrimaryType"
        label="Primary meter type"
        options={meterOptions}
        disabled={!trackByMeterPrimary}
      />
      <SingleCheckboxWrapper
        control={control}
        name="trackByMeterSecondary"
        label="Track by meter (secondary)"
      />
      <SelectWrapper
        control={control}
        name="meterSecondaryType"
        label="Secondary meter type"
        options={meterOptions}
        disabled={!trackByMeterSecondary}
      />
    </FormModal>
  );
}
