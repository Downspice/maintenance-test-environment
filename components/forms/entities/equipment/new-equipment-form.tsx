"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LucideTrash2, Save, Plus } from "lucide-react";

// Form wrappers
import InputWrapper from "@/components/forms/fields/InputWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import CustomFieldsWrapper from "@/components/forms/fields/CustomFieldsWrapper";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import CheckboxWrapper from "@/components/forms/fields/CheckboxWrapper";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Fieldset from "@/components/customUI/fieldset";
import { toast } from "sonner";
import { cn } from "@/lib/shared/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer } from "@/components/ui/drawer";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { ColumnDef } from "@tanstack/react-table";
// Schema and options imports
import { periodOptionList } from "@/lib/schemas/equipment-schema";
import { equipmentCheckboxOptions } from "@/lib/shared/option-list";
import {
  useGetCostCenters,
  useGetInventoryCategories,
} from "@/services/setups/inventory";
import { useGetVendorOptions } from "@/services/setups/vendor";
import {
  useAddEquipment,
  useGetEquipmentColors,
  useGetEquipmentMakes,
  useGetEquipmentModels,
  useGetEquipmentOwnerships,
  useGetEquipmentStatuses,
  useGetEquipmentTypes,
  useGetExpenseTypes,
  useGetEquipments,
} from "@/services/setups/equipments";
import { useGetEmployees } from "@/services/setups/employee";
import { convertToOptionList } from "@/lib/shared/utils";
import { GenericObject } from "@/types/types";
import { format } from "date-fns";

interface TriggerVariant {
  variant?: "icon" | "default" | "primary";
}

// New schema matching your provided structure
export const equipmentSchema = z.object({
  unit_number: z.string().min(1, "Unit # is required"),
  make_id: z.string().optional(),
  model_id: z.string().optional(),
  year: z.string().optional(),
  serial_number: z.string().optional(),
  tag_number: z.string().optional(),
  type_id: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  status_id: z.string().min(1, "Status is required"),
  employee_id: z.string().optional(),
  cost_center_id: z.string().optional(),
  parent_id: z.string().optional(),
  is_sync: z.boolean().default(false),

  // Specifications
  color_id: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  gross_weight: z.coerce.number().optional(),
  notes: z.string().optional(),

  // Custom fields
  main_others: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),
  specification_others: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),

  // Warranty
  warranty: z
    .array(
      z.object({
        type: z.string(),
        name: z.string(),
        date: z.coerce.string().optional(),
        meter: z.coerce.number().optional(),
      })
    )
    .optional(),
  warranty_others: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),

  // Purchase
  purchase: z
    .object({
      vendor_id: z.string().optional(),
      date: z.coerce.string().optional(),
      price: z.coerce.number().optional(),
      notes: z.string().optional(),
      depreciation_start_value: z.coerce.number().optional(),
      salvage_value: z.coerce.number().optional(),
      term: z.coerce.number().optional(),
      depreciation: z.coerce.number().optional(),
      current_value: z.coerce.number().optional(),
      ownership_id: z.string().optional(),
      in_service_date: z.coerce.string().optional(),
      out_of_service_date: z.coerce.string().optional(),
      transferred_date: z.coerce.string().optional(),
      sold_date: z.coerce.string().optional(),
      sold_to: z.string().optional(),
      ownership_notes: z.string().optional(),
    })
    .optional(),

  purchase_others: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),

  // Expenses
  expenses: z
    .array(
      z.object({
        expense_type_id: z.string(),
        last_date: z.coerce.string().optional(),
        next_date: z.coerce.string().optional(),
        interval: z.coerce.number().optional(),
        period: z.string().optional(),
        quantity: z.coerce.number().optional(),
        cost: z.coerce.number().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),

  // Additional fields for UI
  attachments: z.any().optional(),
  tracker: z.array(z.string()).optional(),
  budget: z.coerce.number().optional(),
});

export type EquipmentFormInput = z.input<typeof equipmentSchema>;
export type EquipmentFormValues = z.output<typeof equipmentSchema>;

export interface ActualEquipmentFormProps {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
}

export function ActualEquipmentForm({
  formId = "new-equipment-form",
  hideSubmitButton,
  onSuccess,
}: ActualEquipmentFormProps = {}) {
  const { mutateAsync, isPending: isSubmitting } = useAddEquipment();
  const { data: vendorOptions } = useGetVendorOptions<GenericObject[]>();
  const { data: categoryOptions } =
    useGetInventoryCategories<GenericObject[]>();
  const { data: makeOptionsList } = useGetEquipmentMakes<GenericObject[]>();
  const { data: carModelOptionsList } =
    useGetEquipmentModels<GenericObject[]>();
  const { data: ownershipOptions } =
    useGetEquipmentOwnerships<GenericObject[]>();
  const { data: equipmentTypeOptions } =
    useGetEquipmentTypes<GenericObject[]>();
  const { data: colorOptions } = useGetEquipmentColors<GenericObject[]>();
  const { data: statusOptions } = useGetEquipmentStatuses<GenericObject[]>();
  const { data: expenseOptions } = useGetExpenseTypes<GenericObject[]>();
  const { data: assigneeOptions } = useGetEmployees<GenericObject[]>();
  const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
  const { data: allEquipments } = useGetEquipments<GenericObject[]>();

  const expenseColumns: ColumnDef<ExpenseTableType>[] = [
    {
      accessorKey: "expense_type_id",
      header: "Expense Type",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Select
          value={row.original.expense_type_id}
          onValueChange={(e) => {
            console.log(e);
            updateRow(rowIndex, "expense_type_id", e);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {expenseOptions?.map((item) => (
              <SelectItem value={item.id ?? ""} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "last_date",
      header: "Last Date",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <DatePicker
          value={
            row.original.last_date
              ? new Date(row.original.last_date)
              : undefined
          }
          onChange={(date) =>
            updateRow(rowIndex, "last_date", date ? date.toISOString() : "")
          }
        />
      ),
    },
    {
      accessorKey: "next_date",
      header: "Next Date",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <DatePicker
          value={
            row.original.next_date
              ? new Date(row.original.next_date)
              : undefined
          }
          onChange={(date) =>
            updateRow(rowIndex, "next_date", date ? date.toISOString() : "")
          }
        />
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Select
          value={row.original.period}
          onValueChange={(e) => updateRow(rowIndex, "period", e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {periodOptionList.map((item) => (
              <SelectItem value={item.id} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "interval",
      header: "Interval",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Input
          type="number"
          value={row.original.interval}
          onChange={(e) =>
            updateRow(rowIndex, "interval", parseFloat(e.target.value))
          }
        />
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Input
          type="number"
          value={row.original.quantity}
          onChange={(e) =>
            updateRow(rowIndex, "quantity", parseFloat(e.target.value))
          }
        />
      ),
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Input
          type="number"
          value={row.original.cost}
          onChange={(e) =>
            updateRow(rowIndex, "cost", parseFloat(e.target.value))
          }
        />
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Input
          value={row.original.notes}
          onChange={(e) => updateRow(rowIndex, "notes", e.target.value)}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row, deleteRow, rowIndex }: any) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => deleteRow(rowIndex)}
          >
            <LucideTrash2 className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const form = useForm<EquipmentFormInput, unknown, EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      status_id: "active",
      is_sync: false,
      warranty: [],
      expenses: [],
      main_others: [],
      specification_others: [],
      warranty_others: [],
      purchase_others: [],
      purchase: {
        depreciation_start_value: 0,
        salvage_value: 0,
        term: 0,
        price: 0,
        depreciation: 0,
        current_value: 0,
        ownership_id: "owned",
      },
    },
  });

  const formControl = form.control as any;

  const watchStatus = form.watch("status_id");
  const watchOwnership = form.watch("purchase.ownership_id");

  async function onSubmit(data: EquipmentFormValues) {
    const formatDate = (date: any) => {
      if (!date) return undefined;
      return format(new Date(date), "yyyy-MM-dd");
    };

    const payload = {
      ...data,
      purchase: data.purchase
        ? {
            ...data.purchase,
            date: formatDate(data.purchase.date),
            in_service_date: formatDate(data.purchase.in_service_date),
            out_of_service_date: formatDate(data.purchase.out_of_service_date),
            transferred_date: formatDate(data.purchase.transferred_date),
            sold_date: formatDate(data.purchase.sold_date),
          }
        : undefined,
      expenses: data.expenses?.map((exp) => ({
        ...exp,
        last_date: formatDate(exp.last_date),
        next_date: formatDate(exp.next_date),
      })),
      warranty: data.warranty?.map((war) => ({
        ...war,
        date: formatDate(war.date),
      })),
    };

    console.log("Form submitted with VALUES:", payload);

    const res = await mutateAsync(payload);
    if (res) {
      toast.success(res?.message || "Equipment created successfully!");
      onSuccess?.();
    }

    form.reset();
  }

  function onError(errors: any) {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => `${field}: ${error.message}`
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
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn(
          hideSubmitButton ? "flex h-full min-h-0 flex-1 flex-col" : "space-y-6"
        )}
      >
        <Tabs
          defaultValue="main"
          className={cn(
            "w-full",
            hideSubmitButton && "flex min-h-0 flex-1 flex-col"
          )}
        >
          <TabsList className="mb-4 flex h-auto shrink-0 flex-wrap gap-1">
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="warranty">Warranty</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Main Tab */}
          <TabsContent value="main">
            <div className="grid grid-cols-2 space-x-2">
              <div className="col-span-1 space-y-2">
                <Fieldset
                  legend="Identification"
                  content={
                    <>
                      <InputWrapper
                        control={formControl}
                        name="unit_number"
                        label="Unit #"
                        type="text"
                        required
                        value=""
                      />
                      <ComboboxFieldWrapper
                        control={formControl}
                        name="make_id"
                        label="Make"
                        options={makeOptionsList??[]}
                      />
                      <ComboboxFieldWrapper
                        control={formControl}
                        name="model_id"
                        label="Model"
                        options={carModelOptionsList??[]}
                      />
                      <InputWrapper
                        control={formControl}
                        name="serial_number"
                        label="Serial #"
                        type="text"
                        value=""
                      />
                      <InputWrapper
                        control={formControl}
                        name="year"
                        label="Year"
                        type="text"
                        value=""
                      />
                      <InputWrapper
                        control={formControl}
                        name="tag_number"
                        label="Tag #"
                        type="text"
                        value=""
                      />
                      <ComboboxFieldWrapper
                        control={formControl}
                        name="type_id"
                        label="Equipment Type"
                        options={equipmentTypeOptions??[]}
                      />
                      <TextareaWrapper
                        control={formControl}
                        name="description"
                        label="Description"
                        placeholder=""
                        value=""
                      />
                    </>
                  }
                />

                <Fieldset
                  legend="Assignment"
                  content={
                    <div className="space-y-1">
                      <SelectWrapper
                        control={formControl}
                        name="status_id"
                        label="Status"
                        options={statusOptions??[]}
                        required
                      />

                      <SelectWrapper
                        control={formControl}
                        name="employee_id"
                        label="Assignee"
                        options={
                          assigneeOptions
                            ? convertToOptionList(
                                assigneeOptions,
                                "id",
                                "first_name"
                              )
                            : []
                        }
                      />

                      <SelectWrapper
                        control={formControl}
                        name="location"
                        label="Location"
                        options={categoryOptions??[]}
                      />

                      <ComboboxFieldWrapper
                        control={formControl}
                        name="costCenter"
                        label="Cost Center"
                        options={costCenterOptions??[]}
                      />

                      <ComboboxFieldWrapper
                        control={formControl}
                        name="parent_id"
                        label="Parent Equipment"
                        options={
                          allEquipments
                            ? convertToOptionList(
                                allEquipments,
                                "id",
                                "unit_number"
                              )
                            : []
                        }
                      />

                      <SingleCheckboxWrapper
                        control={formControl}
                        name="is_sync"
                        label="Sync with external system"
                      />
                    </div>
                  }
                />
              </div>

              <div className="col-span-1 space-y-2">
                <Fieldset
                  legend="Custom Fields"
                  content={
                    <CustomFieldsWrapper
                      control={formControl}
                      name="main_others"
                      label="Custom Fields"
                    />
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications" className="space-y-1">
            <Fieldset
              legend="Physical Attributes"
              content={
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="col-span-1">
                    <ComboboxFieldWrapper
                      label="Color"
                      control={formControl}
                      options={colorOptions??[]}
                      name="color_id"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      label="Length"
                      control={formControl}
                      name="length"
                      type="text"
                      value=""
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      label="Width"
                      control={formControl}
                      name="width"
                      type="text"
                      value=""
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      label="Height"
                      control={formControl}
                      name="height"
                      type="text"
                      value=""
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      label="Gross Weight"
                      control={formControl}
                      name="gross_weight"
                      type="number"
                      value="0"
                    />
                  </div>
                </div>
              }
            />

            <Fieldset
              legend="Custom Specifications"
              content={
                <CustomFieldsWrapper
                  control={formControl}
                  name="specification_others"
                  label="Custom Fields"
                />
              }
            />
          </TabsContent>

          {/* Warranty Tab */}
          <TabsContent value="warranty" className="space-y-2">
            <Fieldset
              legend="Warranty Information"
              content={
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add warranty entries below
                  </p>
                  {/* Here you would map over form.watch("warranty") and render warranty entries */}
                </div>
              }
            />

            <Fieldset
              legend="Custom Warranty Fields"
              content={
                <CustomFieldsWrapper
                  control={formControl}
                  name="warranty_others"
                  label="Custom Fields"
                />
              }
            />
          </TabsContent>

          {/* Purchase Tab */}
          <TabsContent
            value="purchase"
            className="space-y-2 grid grid-cols-2 gap-4"
          >
            <Fieldset
              className="col-span-1"
              legend="Purchase Details"
              content={
                <>
                  <ComboboxFieldWrapper
                    label="Vendor"
                    control={formControl}
                    options={vendorOptions??[]}
                    name="purchase.vendor_id"
                  />
                  <DatePickerWrapper
                    control={formControl}
                    name="purchase.date"
                    label="Purchase Date"
                  />
                  <InputWrapper
                    control={formControl}
                    name="purchase.price"
                    label="Purchase Price"
                    type="number"
                    value=""
                  />
                  <TextareaWrapper
                    control={formControl}
                    name="purchase.notes"
                    label="Notes"
                    placeholder=""
                    value=""
                  />
                </>
              }
            />

            <Fieldset
              className="col-span-1"
              legend="Depreciation"
              content={
                <>
                  <InputWrapper
                    control={formControl}
                    name="purchase.term"
                    label="Term (Months)"
                    type="number"
                    value=""
                  />
                  <InputWrapper
                    control={formControl}
                    name="purchase.depreciation_start_value"
                    label="Starting Value"
                    type="number"
                    value=""
                  />
                  <InputWrapper
                    control={formControl}
                    name="purchase.salvage_value"
                    label="Salvage Value"
                    type="number"
                    value=""
                  />
                  <InputWrapper
                    control={formControl}
                    name="purchase.depreciation"
                    label="Monthly Depreciation"
                    type="number"
                    value=""
                  />
                  <InputWrapper
                    control={formControl}
                    name="purchase.current_value"
                    label="Current Value"
                    type="number"
                    value=""
                  />
                </>
              }
            />

            <div className="col-span-2">
              <Fieldset
                legend="Ownership/Status"
                content={
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <ComboboxFieldWrapper
                        control={formControl}
                        name="purchase.ownership_id"
                        label="Ownership"
                        options={ownershipOptions??[]}
                      />
                      <DatePickerWrapper
                        control={formControl}
                        name="purchase.in_service_date"
                        label="In Service Date"
                      />
                      <DatePickerWrapper
                        control={formControl}
                        name="purchase.out_of_service_date"
                        label="Out of Service Date"
                      />
                    </div>
                    <div className="col-span-1">
                      <DatePickerWrapper
                        control={formControl}
                        name="purchase.transferred_date"
                        label="Transferred Date"
                      />
                      <DatePickerWrapper
                        control={formControl}
                        name="purchase.sold_date"
                        label="Sold Date"
                      />
                      <InputWrapper
                        control={formControl}
                        name="purchase.sold_to"
                        label="Sold To"
                        type="text"
                        value=""
                      />
                      <TextareaWrapper
                        control={formControl}
                        name="purchase.ownership_notes"
                        label="Ownership Notes"
                        placeholder=""
                        value=""
                      />
                    </div>
                  </div>
                }
              />
            </div>

            <div className="col-span-2">
              <Fieldset
                legend="Custom Purchase Fields"
                content={
                  <CustomFieldsWrapper
                    control={formControl}
                    name="purchase_others"
                    label="Custom Fields"
                  />
                }
              />
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <div className="text-lg font-semibold text-gray-700 mb-4">
              Automatic Expense Logging
            </div>
            <EditableDataTable
              data={form.watch("expenses") || []}
              columns={expenseColumns}
              defaultRow={{
                id: Date.now().toString(),
                expense_type_id: "",
                last_date: "",
                next_date: "",
                period: "",
                interval: 0,
                quantity: 0,
                cost: 0,
                notes: "",
              }}
              onDataChange={(newData) => {
                form.setValue("expenses", newData);
              }}
            />
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments">
            <FileUploadWrapper
              multiple={true}
              control={formControl}
              name="attachments"
              label="Attachments"
            />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent
            value="notes"
            className={cn(
              "mt-0 data-[state=inactive]:hidden",
              hideSubmitButton
                ? "flex min-h-0 flex-1 flex-col overflow-hidden"
                : "space-y-2"
            )}
          >
            <TextareaWrapper
              control={formControl}
              name="notes"
              label={hideSubmitButton ? undefined : "General Notes"}
              placeholder="Enter any additional notes..."
              fillSpace={hideSubmitButton}
              direction={hideSubmitButton ? "vertical" : "horizontal"}
              value=""
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-2">
            <Fieldset
              legend="Track the following details"
              content={
                <CheckboxWrapper
                  control={formControl}
                  name="tracker"
                  label=""
                  options={equipmentCheckboxOptions}
                />
              }
            />
            <Fieldset
              legend="Budget"
              content={
                <InputWrapper
                  control={formControl}
                  name="budget"
                  label="Annual Operating Budget"
                  value=""
                  type="number"
                />
              }
            />
          </TabsContent>
        </Tabs>

        {!hideSubmitButton && (
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
        )}
      </form>
    </Form>
  );
}

export default function EquipmentForm({ variant }: TriggerVariant) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant={variant === "icon" ? "ghost" : "primary"}
          size={variant === "icon" ? "icon" : "md"}
          className={variant === "icon" ? "size-6 p-0" : undefined}
        >
          {variant === "icon" ? (
            <Plus className="size-4" />
          ) : (
            <>
              <Plus className="size-4 mr-2" />
              Create Equipment
            </>
          )}
        </Button>
      }
      title="Create Equipment"
      description="Fill out the form below to create a new Equipment."
      closeable={true}
      renderActions={
        <Button form="new-equipment-form" type="submit" variant="primary">
          Save Equipment
        </Button>
      }
      className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <ActualEquipmentForm
          formId="new-equipment-form"
          hideSubmitButton
          onSuccess={() => setOpen(false)}
        />
      </ScrollArea>
    </Drawer>
  );
}

// Expense table columns
type ExpenseTableType = {
  id: string;
  expense_type_id: string;
  last_date: string;
  next_date: string;
  period: string;
  interval: number;
  quantity: number;
  cost: number;
  notes: string;
};
