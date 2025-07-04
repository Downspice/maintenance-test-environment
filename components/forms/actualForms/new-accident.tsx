"use client";

import { useState } from "react";
import {
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
  assigneeOptions,
  accidentOptions,
} from "@/lib/equipment-schema";
import {
  equipmentOptionsList,
} from "@/lib/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { costCenterOptions } from "@/components/forms/actualForms/work-order-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface triggerVariant {
  variant?: "icon" | "default";
}
export default function NewAccident({ variant }: triggerVariant) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  function onSubmit(data: EquipmentFormValues) {
    console.log("Form submitted with VALUES:", data);
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col">
          <div className="grid grid-cols-2 space-x-3">
            <Tabs defaultValue="Accident">
              <TabsList>
                <TabsTrigger value="Accident">Accident</TabsTrigger>
                <TabsTrigger value="Location">Location</TabsTrigger>
                <TabsTrigger value="Police">Police</TabsTrigger>
                <TabsTrigger value="Notes">Notes</TabsTrigger>
                <TabsTrigger value="Photos">Photos</TabsTrigger>
              </TabsList>
              <TabsContent value="Accident" className="space-y-2">
                <ComboboxFieldWrapper
                  control={form.control}
                  name="Equipment"
                  label="Equipment"
                  options={equipmentOptionsList}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="driver"
                  label="Driver"
                  options={assigneeOptions}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="accident"
                  label="Accident Type"
                  options={accidentOptions}
                />

                <ComboboxFieldWrapper
                  control={form.control}
                  name="customer"
                  label="Customer"
                  options={assigneeOptions}
                />

                <DatePickerWrapper
                  control={form.control}
                  name="accidentDate"
                  label="Date"
                />

                <DatePickerWrapper
                  control={form.control}
                  name="accidentTime"
                  label="Time"
                />
                <InputWrapper
                  control={form.control}
                  name="outHours"
                  label="Hours"
                  placeholder="Enter Hours"
                  type={""}
                  value={undefined}
                />

                <InputWrapper
                  control={form.control}
                  name="claim"
                  label="Claim#"
                  placeholder=" "
                  type={""}
                  value={undefined}
                />

                <InputWrapper
                  control={form.control}
                  name="unit"
                  label="Units Involved"
                  placeholder=" "
                  type={"number"}
                  value={undefined}
                />
                <InputWrapper
                  control={form.control}
                  name="injuriesNumber"
                  label="Injuries "
                  placeholder=" "
                  type={"number"}
                  value={undefined}
                />
                <InputWrapper
                  control={form.control}
                  name="otherCost"
                  label="Other Cost"
                  placeholder=" "
                  type={"number"}
                  value={undefined}
                />

                <ComboboxFieldWrapper
                  control={form.control}
                  name="costCenter"
                  label="Cost Center"
                  options={costCenterOptions}
                />

                <InputWrapper
                  control={form.control}
                  name="damageCost"
                  label="Damage Cost"
                  placeholder=" "
                  type={"number"}
                  value={undefined}
                />
              </TabsContent>
              <TabsContent value="Location" className="space-y-2">
                <InputWrapper
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="state"
                  label="State/Province"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="postal"
                  label="Postal Code"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="county"
                  label="County"
                  placeholder=" "
                  type={""}
                  value={""}
                />
              </TabsContent>
              <TabsContent value="Police" className="space-y-2">
                <InputWrapper
                  control={form.control}
                  name="policeDepartment"
                  label="Department"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="officer"
                  label="Officer"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="report"
                  label="Report #"
                  placeholder=" "
                  type={""}
                  value={""}
                />
                <InputWrapper
                  control={form.control}
                  name="phone"
                  label="Phone #"
                  placeholder=" "
                  type={""}
                  value={""}
                />
              </TabsContent>
              <TabsContent value="Notes" className="space-y-2">
                <TextareaWrapper
                  control={form.control}
                  name="accidentNotes"
                  label=" "
                  value={" "}
                />
              </TabsContent>
            </Tabs>
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
  );
}
