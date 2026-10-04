"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, type ReactNode } from "react";

const equipmentOptions = [{ name: "Excavator", id: "excavator" }];

const meterTypeOptions = [
  { name: "Primary", id: "primary" },
  { name: "Secondary", id: "secondary" },
];

export const meterReplacementSchema = z.object({
  id: z.string().optional(),
  equipment: z.string().min(1, "Equipment is required"),
  meterType: z.enum(["primary", "secondary"], {
    required_error: "Meter type is required",
  }),
  date: z.string().min(1, "Date is required"),
  currentReading: z.coerce.number().min(0, "Current reading is required"),
  replacement: z.coerce.number().min(0, "Replacement value is required"),
  description: z.string().optional(),
});

export type MeterReplacementFormValues = z.infer<typeof meterReplacementSchema>;

const METER_REPLACEMENT_FORM_ID = "new-meter-replacement-form";

const DRAWER_CLASSNAME =
  "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

export type MeterReplacementFormProps = {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
  defaultValues?: Partial<MeterReplacementFormValues>;
};

export default function NewMeterReplacementForm({
  formId = METER_REPLACEMENT_FORM_ID,
  hideSubmitButton,
  onSuccess,
  defaultValues,
}: MeterReplacementFormProps = {}) {
  const form = useForm<MeterReplacementFormValues>({
    resolver: zodResolver(meterReplacementSchema),
    defaultValues: {
      equipment: "",
      meterType: "primary",
      date: "",
      currentReading: 0,
      replacement: 0,
      description: "",
      ...defaultValues,
    },
  });

  function onSubmit(data: MeterReplacementFormValues) {
    console.log(data);
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1"
      >
        <ComboboxFieldWrapper
          control={form.control}
          name="equipment"
          label="Equipment"
          options={equipmentOptions}
          required
        />
        <RadioGroupWrapper
          control={form.control}
          name="meterType"
          label="Meter type"
          orientation="horizontal"
          options={meterTypeOptions}
        />
        <DatePickerWrapper control={form.control} name="date" label="Date" />
        <InputWrapper
          control={form.control}
          name="currentReading"
          label="Current reading"
          type="number"
        />
        <InputWrapper
          control={form.control}
          name="replacement"
          label="Replacement"
          type="number"
        />
        <TextareaWrapper
          control={form.control}
          name="description"
          label="Description"
        />
        {!hideSubmitButton && (
          <Button type="submit" variant="primary" className="mt-4">
            Save replacement
          </Button>
        )}
      </form>
    </Form>
  );
}

type MeterReplacementDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: string;
  description?: string;
  defaultValues?: Partial<MeterReplacementFormValues>;
};

export function MeterReplacementDrawer({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  trigger,
  title = "Record meter replacement",
  description = "Log a meter swap including readings and date.",
  defaultValues,
}: MeterReplacementDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const onOpenChange = onOpenChangeProp ?? setInternalOpen;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      closeable
      className={DRAWER_CLASSNAME}
      renderActions={
        <Button
          form={METER_REPLACEMENT_FORM_ID}
          type="submit"
          variant="primary"
        >
          Save replacement
        </Button>
      }
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewMeterReplacementForm
          formId={METER_REPLACEMENT_FORM_ID}
          hideSubmitButton
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
        />
      </ScrollArea>
    </Drawer>
  );
}

export function UpdateMeterReplacementForm({
  children,
  data,
}: {
  children: ReactNode;
  data: MeterReplacementFormValues;
}) {
  const [open, setOpen] = useState(false);

  return (
    <MeterReplacementDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title="Edit meter replacement"
      description="Update meter replacement details."
      defaultValues={data}
    />
  );
}
