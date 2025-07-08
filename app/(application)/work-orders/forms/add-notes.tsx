"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { ComboboxOption } from "@/components/forms/wrappers/ComboboxWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";

export default function AddNotes() {
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
    defaultValues: {},
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
        <Button variant="secondary">Add Notes</Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Add Notes</SheetTitle>
          <SheetDescription>
            Fill out the form below to Add Notes.
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
                  <TextareaWrapper
                    control={form.control}
                    name="notes"
                    label="NOTES"
                    value={""}
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
                      Create Note
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
