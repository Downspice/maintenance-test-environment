"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ErrorOption,
  FieldArray,
  FieldArrayPath,
  FieldError,
  FieldErrors,
  FieldName,
  FieldValues,
  FormState,
  InternalFieldName,
  ReadFormState,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Plus, Building, User } from "lucide-react";
import MultiSelectWrapper from "../wrappers/MultiSelectWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import SelectWrapper from "../wrappers/SelectWrapper";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import InputWrapper from "../wrappers/InputWrapper";
import CheckboxWrapper from "../wrappers/CheckboxWrapper";
import { toast } from "sonner";
import {
  ComboboxFieldWrapper,
  MultiComboboxWrapper,
} from "../wrappers/ComboboxWrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Fieldset from "@/components/customUI/fieldset";
import {
  PurchaseOrderData,
  PurchaseOrderOptions,
} from "@/lib/purcahse-order-data";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";

// Define the form schema with Zod
export const workOrderSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  assigneeIds: z.array(z.string()).optional(),
  scheduledOn: z.date().optional(),
  dueOn: z.date().optional(),
  priority: z.string({
    required_error: "Priority is required",
  }),
  workOrderType: z.string().optional(),
  initialNotes: z.string().optional(),
  taskIds: z.array(z.string()).min(1, "At least one task must be selected"),
  customFields: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

// Equipment options
const equipmentOptions = [{ value: "1311827", label: "AC-001-07 Class 8" }];

// Assignee options
const assigneeOptions = [
  { value: "User-246964", label: "Joseph Awer", group: "Employees" },
  { value: "Vendor-324052", label: "Cameron, Inc.", group: "Vendors" },
  { value: "Vendor-324053", label: "Davis Plumbing", group: "Vendors" },
  {
    value: "Vendor-324047",
    label: "International Belt Supply",
    group: "Vendors",
  },
  { value: "Vendor-324051", label: "NAPA", group: "Vendors" },
  { value: "Vendor-324048", label: "Neff Electrical Supply", group: "Vendors" },
  { value: "Vendor-324050", label: "Rush Truck Centers", group: "Vendors" },
  { value: "Vendor-324049", label: "The Instrument Group", group: "Vendors" },
];

// Priority options
const priorityOptions = [
  { value: "LOW", label: "LOW" },
  { value: "NORMAL", label: "NORMAL" },
  { value: "HIGH", label: "HIGH" },
  { value: "URGENT", label: "URGENT" },
];

// Work order type options
export const workOrderTypeOptions = [
  { value: "preventive", label: "Preventive Maintenance" },
  { value: "corrective", label: "Corrective Maintenance" },
  { value: "inspection", label: "Inspection" },
  { value: "other", label: "Other" },
];

export const costCenterOptions = [
  { value: "preventive", label: "Preventive Cost Center" },
  { value: "corrective", label: "Corrective Cost Center" },
  { value: "inspection", label: "Inspection Cost Center" },
  { value: "other", label: "Other" },
];
// Task options
const taskOptions = [
  {
    id: "25417067",
    label: "Oil Leaking",
    description: "Repair - due 6 Days ago",
  },
];

export default function NewWorkOrderForm() {
  const [customFields, setCustomFields] = useState<
    { name: string; value: string }[]
  >([]);

  const [open, setOpen] = useState(false);

  const workOrderForm = useForm<z.infer<typeof workOrderSchema>>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      equipmentId: "1311827",
      priority: "NORMAL",
      taskIds: ["25417067"],
      customFields: [],
    },
  });

  async function handleSubmit(data: z.infer<typeof workOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create New Work Order
        </Button>
      </SheetTrigger>
      <SheetContent className="w-5/6 ">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Fill out the form below to set up your new Work Order.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...workOrderForm}>
              <form
                onSubmit={workOrderForm.handleSubmit((data) =>
                  handleSubmit(data)
                )}
              >
                <div className="grid grid-cols-7">
                  <div className="col-span-2">
                    <Fieldset
                      content={
                        <>
                          <InputWrapper
                            control={workOrderForm.control}
                            name="workOrderNumber"
                            label="WO Number"
                            type="text"
                            value={""}
                            required
                          />
                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="priority"
                            label="Priority"
                            options={priorityOptions}
                            required={true}
                          />
                        </>
                      }
                    />

                    <Fieldset
                      legend="Dates"
                      content={
                        <>
                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="scheduledOn"
                            label="Scheduled"
                          />

                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="dueOn"
                            label="Due"
                          />
                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="startedOn"
                            label="Started On"
                          />
                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="completedOn"
                            label="Completed On"
                          />
                        </>
                      }
                    />
                    <Fieldset
                      legend="Assignees"
                      content={
                        <>
                          <MultiComboboxWrapper
                            control={workOrderForm.control}
                            name="assigneeIds"
                            label="Assignee"
                            options={assigneeOptions}
                            placeholder="Select assignees"
                            searchPlaceholder="Search assignees..."
                            maxSelections={2}
                          />
                        </>
                      }
                    />

                    <Fieldset
                      legend="Misc. Details"
                      content={
                        <>
                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="workOrderType"
                            label="Type"
                            options={workOrderTypeOptions}
                          />

                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="costCenter"
                            label="Cost center"
                            options={costCenterOptions}
                          />

                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="po"
                            label="PO#"
                            options={PurchaseOrderOptions}
                          />
                          <InputWrapper
                            control={workOrderForm.control}
                            name="invoice"
                            label="Invoice"
                            value={""}
                            type={"text"}
                          />
                          <CustomFieldsWrapper
                            control={workOrderForm.control}
                            name="custom"
                            label={"Custom Fields"}
                          />
                        </>
                      }
                    />
                  </div>
                  <div className="col-span-5">
                    <div className="flex justify-end space-x-1 border border-b-black/20">
                      <Button>Open</Button>
                      <Button>In Progress</Button>
                      <Button>On Hold</Button>
                      <Button>Complete</Button>
                    </div>
                    <div>
                      <div className="flex flex-row justify-between space-x-2 ">
                        <div className="flex w-fit items-end">
                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="equipment"
                            label="Unit"
                            options={equipmentOptions}
                            required={true}
                          />
                          <Button variant="secondary" size={"icon"}>
                            <Plus />
                          </Button>
                        </div>
                        <div className="flex w-fit">
                          <InputWrapper
                            control={workOrderForm.control}
                            name="hours"
                            label="Hours"
                            value={""}
                            type={"number"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-x-4 my-8 w-full">
                  <Button className=" w-full">
                    <GitPullRequestArrow className="mr-2" /> Create Work Order
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
