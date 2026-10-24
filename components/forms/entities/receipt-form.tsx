"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Plus, Building, User } from "lucide-react";
import MultiSelectWrapper from "../fields/MultiSelectWrapper";
import DatePickerWrapper from "../fields/DatePickerWrapper";
import SelectWrapper from "../fields/SelectWrapper";
import TextareaWrapper from "../fields/TextareaWrapper";
import InputWrapper from "../fields/InputWrapper";
import CheckboxWrapper from "../fields/CheckboxWrapper";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";
import { useGetVendors } from "@/services/setups/vendor";
// Define the form schema with Zod
export const workOrderSchema = z.object({
  partId: z.string({
    required_error: "Equipment is required",
  }),
  created_on: z.date({
    required_error: "Date is required",
  }),
  quantity_received: z.coerce.number().optional(),
  unit_cost: z.coerce.number().optional(),
  tax_rate_one: z.coerce.number().optional(),
  tax_rate_two: z.coerce.number().optional(),
  invoice_number: z.string().optional(),
  vendor_id: z.string().optional(),
  description: z.string().optional(),
});

// Equipment options
const equipmentOptions = [{ id: "1311827", name: "AC-001-07 Class 8" }];

// Priority options
const priorityOptions = [
  { id: "LOW", name: "LOW" },
  { id: "NORMAL", name: "NORMAL" },
  { id: "HIGH", name: "HIGH" },
  { id: "URGENT", name: "URGENT" },
];

// Work order type options
const workOrderTypeOptions = [
  { id: "preventive", name: "Preventive Maintenance" },
  { id: "corrective", name: "Corrective Maintenance" },
  { id: "inspection", name: "Inspection" },
  { id: "other", name: "Other" },
];

// Task options
const taskOptions = [
  {
    id: "25417067",
    name: "Oil Leaking",
    description: "Repair - due 6 Days ago",
  },
];

export default function ReceiptForm() {
  const [customFields, setCustomFields] = useState<
    { name: string; id: string }[]
  >([]);
  const { data: vendorOptions } = useGetVendors();

  const receiptForm = useForm<z.infer<typeof workOrderSchema>>({
    resolver: zodResolver(workOrderSchema),
    // defaultValues: {
    //   equipmentId: "1311827",
    //   priority: "NORMAL",
    //   taskIds: ["25417067"],
    //   customFields: [],
    // },
  });

  async function handleSubmit(data: z.infer<typeof workOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", id: "" }]);
  };

  return (
    <div>
      <Form {...receiptForm}>
        <form onSubmit={receiptForm.handleSubmit((data) => handleSubmit(data))}>
          <div className="work-order-form-wrapper">
            <div className="pt-2">
              <ComboboxFieldWrapper
                control={receiptForm.control}
                name="equipmentId"
                label="Equipment"
                options={equipmentOptions}
                required={true}
                searchPlaceholder="Search equipment..."
              />
            </div>

            <div className="disable-fields-without-equipment pt-4">
              <div id="fields">
                <div className="pt-4">
                  <MultiSelectWrapper
                    control={receiptForm.control}
                    name="assigneeIds"
                    label="Assignee"
                    options={vendorOptions}
                    placeholder="Select assignees"
                    searchPlaceholder="Search assignees..."
                  />
                  <div className="quick-add-links flex justify-end space-x-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />{" "}
                      <Building className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />{" "}
                      <User className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <DatePickerWrapper
                    control={receiptForm.control}
                    name="scheduledOn"
                    label="Scheduled"
                  />

                  <DatePickerWrapper
                    control={receiptForm.control}
                    name="dueOn"
                    label="Due"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <SelectWrapper
                    control={receiptForm.control}
                    name="priority"
                    label="Priority"
                    options={priorityOptions}
                    required={true}
                  />

                  <SelectWrapper
                    control={receiptForm.control}
                    name="workOrderType"
                    label="Type"
                    options={workOrderTypeOptions}
                  />
                </div>

                <div className="pt-4">
                  <TextareaWrapper
                    control={receiptForm.control}
                    name="initialNotes"
                    label="Initial Notes"
                    value={""}
                    rows={4}
                  />
                </div>

                <div className="pt-6">
                  <h2
                    className="form-section text-xl font-semibold"
                    id="custom-fields"
                  >
                    Custom Fields
                  </h2>
                  <div className="pt-2" id="custom-field-section">
                    {customFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                        <InputWrapper
                          control={receiptForm.control}
                          type="text"
                          name={`customFields.${index}.name`}
                          label="Field Name"
                          value={field.name}
                        />
                        <InputWrapper
                          control={receiptForm.control}
                          type="text"
                          name={`customFields.${index}.value`}
                          label="Field Value"
                          value={field.value}
                        />
                      </div>
                    ))}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomField}
                        className="text-[#1A79FF] border-[#1A79FF]"
                      >
                        <Plus className="mr-2 h-4 w-4" /> New Custom Field
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div id="task-selection-table" className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                <CheckboxWrapper
                  control={receiptForm.control}
                  name="taskIds"
                  label="Select Tasks"
                  options={taskOptions}
                />
                <div className="repair-section pt-2">
                  <div className="add-task-link">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-[#1A79FF] border-[#1A79FF]"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                  </div>
                </div>
              </div>

              <div className="info-box bg-blue-50 border border-blue-100 rounded-md p-4 flex mt-6">
                <div className="info-icon text-blue-500 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="info-text text-sm text-blue-800">
                  You may enter parts, labor, and other details after creating
                  the Work Order.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-4 mt-8 w-full">
            <Button className="  w-full">
              <GitPullRequestArrow className="mr-2" /> Create Work Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
