"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

const meterOptions = [{ label: "Hour", value: "hour" },{ label: "Miles", value: "Miles" }];

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

  const { control, handleSubmit, reset } = form;

  // Watch meter toggles to enable/disable the select
  const trackByMeterPrimary = useWatch({ control, name: "trackByMeterPrimary" });
  const trackByMeterSecondary = useWatch({ control, name: "trackByMeterSecondary" });

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
  }, [initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <InputWrapper control={control} name="name" label="Schedule Name" /> 

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
          

          <div className="flex justify-end pt-2">
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
