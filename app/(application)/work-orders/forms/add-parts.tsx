"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

// Form wrappers

// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
} from "@/lib/equipment-schema";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ComboboxFieldWrapper,
  ComboboxOption,
} from "@/components/forms/wrappers/ComboboxWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import { PurchaseOrderOptions } from "@/lib/purcahse-order-data";
import { costCenterOptions } from "@/components/forms/actualForms/work-order-form";
import { equipmentOptionsList } from "@/lib/option-list";
import Fieldset from "@/components/customUI/fieldset";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";

export default function AddParts() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    identification: true,
    assignment: false,
    purchase: false,
    additionalDetails: false,
  });

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      usage: "Active",
    },
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const watchPartUnderWarranty = form.watch("PartUnderWarranty");

  function onSubmit(data: EquipmentFormValues) {
    console.log("Form submitted with VALUES:", data);

    const getLabel = (options: ComboboxOption[], value: string) =>
      options.find((option) => option.value === value)?.label || value;

    const getLabels = (options: ComboboxOption[], values: string[]) =>
      values.map(
        (value) =>
          options.find((option) => option.value === value)?.label || value
      );

    toast("Project created successfully!", {
      duration: 10000,
    });

    setOpen(false);
    form.reset();
  }

  function onError(errors: any) {
    // Get all error messages
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          unit: "Project Name",
        };

        return `${fieldLabels[field] || field}: ${error.message}`;
      }
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Add Parts</Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Add Part</SheetTitle>
          <SheetDescription>
            Fill out the form below to Add Part.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div>
                <div className="flex flex-col space-y-0.5">
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="equipmentId"
                    label="Equipment"
                    options={equipmentOptionsList}
                    required={true}
                    searchPlaceholder="Search equipment..."
                  />
                  <InputWrapper
                    control={form.control}
                    name="name"
                    label="Name"
                    type="text"
                    value={""}
                  />
                  <InputWrapper
                    control={form.control}
                    name="description"
                    label="Description"
                    type="text"
                    value={""}
                  />
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="costCenter"
                    label="Cost Center"
                    options={costCenterOptions}
                  />
                  <InputWrapper
                    control={form.control}
                    name="quantityUsed"
                    label="Quantity Used"
                    type="text"
                    value={""}
                  />
                  <InputWrapper
                    className="col-span-1"
                    control={form.control}
                    name="unitCost"
                    label="Unit Cost"
                    type="number"
                    value={""}
                  />
                  <div className="grid grid-cols-2">
                    <div className="col-span-1">
                      <InputWrapper
                        className="col-span-1"
                        control={form.control}
                        name="extendCost"
                        label="Extend Cost"
                        type="number"
                        value={""}
                      />
                    </div>
                    <div className="col-span-1 flex items-align-baseline">
                      <SingleCheckboxWrapper
                        control={form.control}
                        name="warranty"
                        label="Replace Under Warranty"
                      />
                    </div>
                  </div>

                  <ComboboxFieldWrapper
                    control={form.control}
                    name="po"
                    label="PO#"
                    options={PurchaseOrderOptions}
                  />
                  <Fieldset
                    legend="Warranty"
                    content={
                      <div className="grid grid-cols-7 ">
                        <div className="col-span-7">
                          <SingleCheckboxWrapper
                            control={form.control}
                            name="PartUnderWarranty"
                            label="Part under warranty"
                          />
                        </div>
                        <div className="col-span-3">
                          <InputWrapper
                            control={form.control}
                            name={`days`}
                            label="Days"
                            type="number"
                            value={""}
                            disabled={!watchPartUnderWarranty}
                            required
                          />
                          <InputWrapper
                            control={form.control}
                            name={`hours`}
                            label="Hours"
                            type="number"
                            value={""}
                            disabled={!watchPartUnderWarranty}
                            required
                          />
                        </div>
                        <div className="col-span-1 font-bold flex items-center justify-center">
                          --OR--
                        </div>
                        <div className="col-span-3">
                          <DatePickerWrapper
                            control={form.control}
                            disabled={!watchPartUnderWarranty}
                            name="expires"
                            label="Expires"
                          />
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-32 my-4 w-full"
                >
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Equipment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
