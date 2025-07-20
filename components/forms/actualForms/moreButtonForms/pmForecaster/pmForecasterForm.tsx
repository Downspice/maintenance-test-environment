"use client";
import Fieldset from "@/components/customUI/fieldset";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { equipmentOptionsList } from "@/lib/option-list";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckboxWrapper from "@/components/forms/wrappers/CheckboxWrapper";
import { MaintenanceTypesOptionList } from "@/lib/work-orders-data";

const PmForecasterSchema = z.object({
   intervals: z.string().optional(),
  showMaintenance: z.string().optional(),
  dueRangeOn: z.boolean().optional(),
  dueRangeStart: z.date().optional(),
  dueRangeEnd: z.date().optional(),
  ignoreMaintenance: z.boolean().optional(),
  servicesToCheck: z.string().optional(),
  selectedServices: z.array(z.string()).optional(),
  displayReport: z.string().optional(),
  printWorkOrder: z.boolean().optional(),
});

export const EmployeeCheckboxOptions = [
  { id: "lubrication", label: "Lubrication" },
  { id: "inspection", label: "Inspection" },
  { id: "calibration", label: "Calibration" },
  { id: "testing", label: "Testing" },
];

type PmForecasterFormValues = z.infer<typeof PmForecasterSchema>;

const intervalOptionsList = [
  { value: "Date and unit intervals", label: "Date and unit intervals" },
  { value: "Date intervals", label: "Date intervals" },
  { value: "Unit intervals", label: "Unit intervals" },
];

const showMaintenanceOptionsList = [
  { value: "Show required and Warning", label: "Date and unit intervals" },
  { value: "Show required", label: "Show required" },
  { value: "Show required (Soon Due)", label: "Show required (Soon Due)" },
];

const servicesToCheck = [
  { value: "All Maintenance services", label: "All Maintenance services" },
  {
    value: "Select Maintenance Service(s)",
    label: "Select Maintenance Service(s)",
  },
];

const maintenanceReportDisplay = [
  {
    value: "Print maintenance detailed report",
    label: "Print maintenance detailed report",
  },
  {
    value: "Print maintenance overview report",
    label: "Print maintenance overview report",
  },
  {
    value: "Automatically generate work orders based on maintenance due",
    label: "Automatically generate work orders based on maintenance due",
  },
];

export default function PmForecasterForm() {
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<PmForecasterFormValues>({
    resolver: zodResolver(PmForecasterSchema),
    defaultValues: {},
  });
  const servicesRadioValue = form.watch("servicesToCheck");
  const intervalsValue = form.watch("intervals");
  const displayReportValue = form.watch("displayReport");
  useEffect(() => {
    if (servicesRadioValue === "Select Maintenance Service(s)") {
      setShowDialog(true);
    } else if (servicesRadioValue === "All Maintenance services") {
      form.setValue("selectedServices", []);
      setShowDialog(false); // optional: close dialog if open
    }
  }, [servicesRadioValue, form]);

  useEffect(() => {
    if (intervalsValue === "Unit intervals") {
      form.setValue("dueRangeOn", false);
      form.setValue("dueRangeStart", undefined);
      form.setValue("dueRangeEnd", undefined);
    }
  }, [intervalsValue, form]);

  useEffect(() => {
    if (
      displayReportValue ===
      "Automatically generate work orders based on maintenance due"
    ) {
      form.setValue("printWorkOrder", true);
    } else {
      form.setValue("printWorkOrder", false);
    }
  }, [displayReportValue, form]);

  const selectedServices = form.watch("selectedServices") || [];

  function onSubmit(data: PmForecasterFormValues) {
    console.log("Form submitted with VALUES:", data);

    toast("Equipment created successfully!", {
      duration: 10000,
    });
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
        className="space-y-1"
      >
        <Fieldset
          legend="Equiment Filtering"
          content={
            <>
              <ComboboxFieldWrapper
                control={form.control}
                name="AddPartsId"
                label="Perform Maintenance check on"
                options={equipmentOptionsList}
                required={true}
                searchPlaceholder="Search AddParts..."
              />
            </>
          }
        />
        <Fieldset
          legend="Intervals to be checked"
          content={
            <>
              <RadioGroupWrapper
                control={form.control}
                name="intervals"
                label=""
                options={intervalOptionsList}
              />
            </>
          }
        />
        <Fieldset
          legend="Show Maintenance"
          content={
            <div className="space-y-1">
              <RadioGroupWrapper
                control={form.control}
                name="showMaintenance"
                label=""
                options={showMaintenanceOptionsList}
              />
              <div className="grid grid-cols-2 space-x-2">
                <div className="col-span-1 flex flex-end">
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="dueRangeOn"
                    label="Show due within Date Range"
                    disabled={intervalsValue === "Unit intervals"}
                  />
                </div>
                <div className="col-span-1 flex space-x-2  flex flex-end">
                  <DatePickerWrapper
                    control={form.control}
                    name="dueRangeStart"
                    label=" "
                    disabled={intervalsValue === "Unit intervals"}
                  />
                  through
                  <DatePickerWrapper
                    control={form.control}
                    name="dueRangeEnd"
                    label=" "
                    disabled={intervalsValue === "Unit intervals"}
                  />
                </div>
              </div>
              <SingleCheckboxWrapper
                control={form.control}
                name="ignoreMaintenance"
                label="Ignore Maintenance already assigned to work order"
              />

              <div className="grid grid-cols-2 space-x-2">
                <Fieldset
                  className="col-span-1"
                  legend="Maintenance services to check"
                  content={
                    <>
                      <RadioGroupWrapper
                        control={form.control}
                        name="servicesToCheck"
                        label=""
                        options={servicesToCheck}
                      />

                      {selectedServices.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground font-medium">
                            Selected Services:
                          </p>
                          <ul className="list-disc list-inside text-sm">
                            {selectedServices.map((val, i) => {
                              const label =
                                EmployeeCheckboxOptions.find(
                                  (opt) => opt.value === val
                                )?.label ?? val;
                              return <li key={i}>{label}</li>;
                            })}
                          </ul>
                        </div>
                      )}

                      <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Select Maintenance Services
                            </DialogTitle>
                          </DialogHeader>
                          <CheckboxWrapper
                            control={form.control}
                            name="selectedServices"
                            label=""
                            options={EmployeeCheckboxOptions}
                          />
                          <div className="flex justify-end">
                            <Button onClick={() => setShowDialog(false)}>
                              Done
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  }
                />

                <Fieldset
                  className=" col-span-1"
                  legend="Maintenance types to check"
                  content={
                    <>
                      <CheckboxWrapper
                        control={form.control}
                        name="selectedServices"
                        label=""
                        options={MaintenanceTypesOptionList}
                      />
                    </>
                  }
                />
              </div>
              <Fieldset
                className=" "
                legend="Please choose how you would like your maintenance check results displayed"
                content={
                  <div className="space-y-1">
                    <RadioGroupWrapper
                      control={form.control}
                      name="displayReport"
                      label=""
                      options={maintenanceReportDisplay}
                    />
                    <SingleCheckboxWrapper
                      control={form.control}
                      name="printWorkOrder"
                      label="Print/Preview work orders"
                      disabled={
                        displayReportValue !==
                        "Automatically generate work orders based on maintenance due"
                      }
                    />
                  </div>
                }
              />
            </div>
          }
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
