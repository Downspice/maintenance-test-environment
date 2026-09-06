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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

// Example options (replace with your actual options)
const equipmentOptions = [{ name: "Excavator", id: "excavator" }];

const meterTypeOptions = [
  { name: "Primary", id: "primary" },
  { name: "Secondary", id: "secondary" },
];

// Zod schema
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

type MeterReplacementFormValues = z.infer<typeof meterReplacementSchema>;

export default function NewMeterReplacementForm() {
  const form = useForm<MeterReplacementFormValues>({
    resolver: zodResolver(meterReplacementSchema),
    defaultValues: {
      equipment: "",
      meterType: "primary",
      date: "",
      currentReading: 0,
      replacement: 0,
      description: "",
    },
  });

  function onSubmit(data: MeterReplacementFormValues) {
    // Handle form submission
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ComboboxFieldWrapper
          control={form.control}
          name="equipment"
          label="Equipment"
          options={equipmentOptions}
        />
        <RadioGroupWrapper
          control={form.control}
          name="meterType"
          label="Meter Type"
          options={meterTypeOptions}
        />
        <DatePickerWrapper control={form.control} name="date" label="Date" />
        <InputWrapper
          control={form.control}
          name="currentReading"
          label="Current Reading"
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function UpdateMeterReplacementForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: MeterReplacementFormValues;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<MeterReplacementFormValues>({
    resolver: zodResolver(meterReplacementSchema),
    defaultValues: {
      equipment: "",
      meterType: "primary",
      date: "",
      currentReading: 0,
      replacement: 0,
      description: "",
    },
  });

  function onSubmit(data: MeterReplacementFormValues) {
    // Handle form submission
    console.log(data);
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-1/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Meter Replacement</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              <ComboboxFieldWrapper
                control={form.control}
                name="equipment"
                label="Equipment"
                options={equipmentOptions}
              />
              <RadioGroupWrapper
                control={form.control}
                name="meterType"
                label="Meter Type"
                options={meterTypeOptions}
              />
              <DatePickerWrapper
                control={form.control}
                name="date"
                label="Date"
              />
              <InputWrapper
                control={form.control}
                name="currentReading"
                label="Current Reading"
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
