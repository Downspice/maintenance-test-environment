"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
} from "@/lib/equipment-schema";
import {
  dateFieldTypeOptionsList,
  locationOptionsList,
  reportCategoryTypeOptionsList,
  reportFrequencyTypeOptionsList,
  reportTypeOptionsList,
} from "@/lib/option-list";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface triggerVariant {
  variant?: "icon" | "default";
}
export default function NewScheduledReportForm({ variant }: triggerVariant) {
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
      status: "Active",
      renewalInterval: 1,
      primaryMeter: 0,
      secondaryMeter: 0,
      purchasePrice: 0,
      salvagePrice: 0,
      depreciationLifeMonths: 0,
      warrantyDescription: "Primary",
      secondaryWarrantyDescription: "Secondary",
      mviInterval: 1,
      ownership: "Owned",
      fuelVolumeUnits: "Gallons",
      annualOperatingBudget: 0,
      hasMeter: false,
    },
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const watchHasMeter = form.watch("hasMeter");
  const watchStatus = form.watch("status");
  const watchPrimary = form.watch("primaryMeterUnit");
  const watchSecondary = form.watch("secondaryMeterUnit");

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
        <Button variant={variant}>
          {variant === "icon" ? (
            <Plus />
          ) : (
            <>
              <Plus />
              Create New Scheduled Report
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Create New Scheduled Report</SheetTitle>
          <SheetDescription>
            Fill out the form below to set up your new Equipment project.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div className="flex">
                <ComboboxFieldWrapper
                  control={form.control}
                  name="report"
                  label="Report"
                  options={reportTypeOptionsList}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="frequency"
                  label="Frequency"
                  options={reportFrequencyTypeOptionsList}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="dateField"
                  label="Date Field"
                  options={dateFieldTypeOptionsList}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="location"
                  label="Location Filter"
                  options={locationOptionsList}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="location"
                  label="Location Filter"
                  options={reportCategoryTypeOptionsList}
                />
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
