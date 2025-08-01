import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
// Example options (replace with your actual options)
const equipmentOptions = [{ label: "Excavator", value: "excavator" }];
const fluidOptions = [{ label: "Oil", value: "oil" }];
const partOptions = [{ label: "Filter", value: "filter" }];
const fluidUnitsOptions = [{ label: "Liters", value: "liters" }];
const costCentreOptions = [{ label: "Main", value: "main" }];

// Zod schema
export const fluidConsumedSchema = z.object({
  id: z.string().optional(),
  equipment: z.string().min(1, "Equipment is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.coerce.number().min(0, "Hours required"),
  fluid: z.string().min(1, "Fluid is required"),
  part: z.string().min(1, "Part is required"),
  quantity: z.coerce.number().min(0.01, "Quantity required"),
  unitCost: z.coerce.number().min(0, "Unit cost required"),
  fluidUnits: z.string().min(1, "Fluid units required"),
  costCentre: z.string().min(1, "Cost centre required"),
  notes: z.string().optional(),
});

type FluidConsumedFormValues = z.infer<typeof fluidConsumedSchema>;

export default function FluidConsumedForm() {
  const [total, setTotal] = useState(0);

  const form = useForm<FluidConsumedFormValues>({
    resolver: zodResolver(fluidConsumedSchema),
    defaultValues: {
      equipment: "",
      date: "",
      hours: 0,
      fluid: "",
      part: "",
      quantity: 0,
      unitCost: 0,
      fluidUnits: "",
      costCentre: "",
      notes: "",
    },
  });

  // Watch for quantity and unitCost changes to update total
  const watchQuantity = form.watch("quantity");
  const watchUnitCost = form.watch("unitCost");

  // Update total when quantity or unitCost changes
  useState(() => {
    setTotal(Number(watchQuantity) * Number(watchUnitCost));
  }, [watchQuantity, watchUnitCost]);

  function onSubmit(data: FluidConsumedFormValues) {
    // You may want to include total in your submission
    const submission = {
      ...data,
      total: Number(watchQuantity) * Number(watchUnitCost),
    };
    console.log(submission);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <ComboboxFieldWrapper
          control={form.control}
          name="equipment"
          label="Equipment"
          options={equipmentOptions}
        />
        <DatePickerWrapper control={form.control} name="date" label="Date" />
        <InputWrapper
          control={form.control}
          name="hours"
          label="Hours"
          type="number"
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="fluid"
          label="Fluid"
          options={fluidOptions}
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="part"
          label="Part"
          options={partOptions}
        />
        <InputWrapper
          control={form.control}
          name="quantity"
          label="Quantity"
          type="number"
        />
        <InputWrapper
          control={form.control}
          name="unitCost"
          label="Unit Cost"
          type="number"
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="fluidUnits"
          label="Fluid Units"
          options={fluidUnitsOptions}
        />
        <InputWrapper
          control={form.control}
          name="total"
          label="Total"
          value={total}
          disabled
          type={"number"}
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="costCentre"
          label="Cost Centre"
          options={costCentreOptions}
        />
        <TextareaWrapper control={form.control} name="notes" label="Notes" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function EditFluidConsumption({
  children,
  data,
}: {
  children: React.ReactNode;
  data: FluidConsumedFormValues;
}) {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const form = useForm<FluidConsumedFormValues>({
    resolver: zodResolver(fluidConsumedSchema),
    defaultValues: data,
  });

  // Watch for quantity and unitCost changes to update total
  const watchQuantity = form.watch("quantity");
  const watchUnitCost = form.watch("unitCost");

  // Update total when quantity or unitCost changes
  useState(() => {
    setTotal(Number(watchQuantity) * Number(watchUnitCost));
  }, [watchQuantity, watchUnitCost]);

  function onSubmit(data: FluidConsumedFormValues) {
    // You may want to include total in your submission
    const submission = {
      ...data,
      total: Number(watchQuantity) * Number(watchUnitCost),
    };
    console.log(submission);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-1/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Fluid consumption</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-1"
              >
                <ComboboxFieldWrapper
                  control={form.control}
                  name="equipment"
                  label="Equipment"
                  options={equipmentOptions}
                />
                <DatePickerWrapper
                  control={form.control}
                  name="date"
                  label="Date"
                />
                <InputWrapper
                  control={form.control}
                  name="hours"
                  label="Hours"
                  type="number"
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="fluid"
                  label="Fluid"
                  options={fluidOptions}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="part"
                  label="Part"
                  options={partOptions}
                />
                <InputWrapper
                  control={form.control}
                  name="quantity"
                  label="Quantity"
                  type="number"
                />
                <InputWrapper
                  control={form.control}
                  name="unitCost"
                  label="Unit Cost"
                  type="number"
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="fluidUnits"
                  label="Fluid Units"
                  options={fluidUnitsOptions}
                />
                <InputWrapper
                  control={form.control}
                  name="total"
                  label="Total"
                  value={total}
                  disabled
                  type={"number"}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="costCentre"
                  label="Cost Centre"
                  options={costCentreOptions}
                />
                <TextareaWrapper
                  control={form.control}
                  name="notes"
                  label="Notes"
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
