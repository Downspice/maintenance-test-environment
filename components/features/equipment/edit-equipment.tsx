"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LucideTrash2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import { Input } from "@/components/ui/input";
import CheckboxWrapper from "@/components/forms/fields/CheckboxWrapper";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import z from "zod";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import MultiSelectWrapper from "@/components/forms/fields/MultiSelectWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import CustomFieldsWrapper from "@/components/forms/fields/CustomFieldsWrapper";
import {
  equipmentCheckboxOptions,
  pmScheduleOptionList,
} from "@/lib/shared/option-list";
import { toast } from "sonner";
import {
  assigneeOptions,
  categoryOptions,
  expenseOptions,
  periodOptionList,
} from "@/lib/schemas/equipment-schema";
import {
  useGetVendorOptions,
} from "@/services/setups/vendor";
import { useGetEquipmentColors, useGetEquipmentMakes, useGetEquipmentModels, useGetEquipmentOwnerships, useGetEquipmentStatuses, useGetEquipmentTypes } from "@/services/setups/equipments";

export const equipmentSchema = z.object({
  // Identification
  name: z.string().min(1, "Unit # is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  year: z.coerce.number().optional(),
  equipmentType: z.string().optional(),

  // Assignment
  status: z.string(),
  soldDate: z.string().optional(),
  soldTo: z.string().optional(),
  soldPrice: z.coerce.number().optional(),
  assigneeIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  parentId: z.string().optional(),

  // Meter Configurations
  pmSchedule: z.string().optional(),
  primaryMeterUnit: z.string().optional(),
  primary: z.coerce.number().optional(),
  secondaryMeterUnit: z.string().optional(),
  secondary: z.coerce.number().optional(),

  // Custom Fields
  btu: z.string().optional(),
  inputVolts: z.string().optional(),
  installDate: z.string().optional(),
  others: z.any().optional(),

  // Specifications
  color: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  grossWeight: z.coerce.number().optional(),
  customSpecifications: z.any().optional(),

  // Warranty
  warrantyDescription: z.string().optional(),
  warrantyExpirationDate: z.string().optional(),
  primaryWarrantyMeter: z.coerce.number().optional(),
  secondaryWarrantyDescription: z.string().optional(),
  secondaryWarrantyExpirationDate: z.string().optional(),
  secondaryWarrantyMeter: z.coerce.number().optional(),
  CustomSecondary: z.any().optional(),

  // Purchase
  vendor: z.string().optional(),
  purchaseDate: z.string().optional(),
  meter: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  purchaseOrderothers: z.any().optional(),
  note: z.string().optional(),

  // Depreciation
  depreciationLifeMonths: z.coerce.number().optional(),
  startingPrice: z.coerce.number().optional(),
  salvagePrice: z.coerce.number().optional(),

  // Ownership/Status
  ownership: z.string().optional(),
  customerName: z.string().optional(),
  inService: z.string().optional(),
  outService: z.string().optional(),
  transferred: z.string().optional(),
  notes: z.string().optional(),

  // Settings
  tracker: z.array(z.string()).optional(),
  budget: z.coerce.number().optional(),
  enableMeter1: z.boolean().optional(),
  average1: z.coerce.number().optional(),
  lastMaintenanceCheck1: z.string().optional(),
  enableMeter2: z.boolean().optional(),
  average2: z.coerce.number().optional(),

  // Attachments & Images
  Attachments: z.any().optional(),

  // Notes
  generalNotes: z.string().optional(),

  // Editable Table Data
  expenses: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        lastDate: z.string().optional(),
        nextDate: z.string().optional(),
        period: z.string().optional(),
        interval: z.coerce.number().optional(),
        cost: z.coerce.number().optional(),
        quantity: z.coerce.number().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
  notifications: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().optional(),
        maintenance: z.boolean().optional(),
        renewals: z.boolean().optional(),
        workOrders: z.boolean().optional(),
      })
    )
    .optional(),
});

interface EditEquipmentProps {
  children: React.ReactNode;
  data: any;
  onSuccess?: () => void;
}

export default function EditEquipment({
  children,
  data,
  onSuccess,
}: EditEquipmentProps) {
  const { data: ownershipOptions } = useGetEquipmentOwnerships();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: vendorOptions } = useGetVendorOptions();
  const { data: makeOptionsList } = useGetEquipmentMakes();
  const { data: carModelOptionsList } = useGetEquipmentModels();
  const { data: equipmentTypeOptions } = useGetEquipmentTypes();
  const { data: colorOptions } = useGetEquipmentColors();
  const { data: statusOptions } = useGetEquipmentStatuses();
  

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: data,
  });
    function onSubmit(data: EquipmentFormValues) {
      console.log("Form submitted with VALUES:", data);
  
      toast.success("Equipment updated successfully!");
  
      setOpen(false);
      onSuccess?.();
      form.reset();
    }
    const watchHasMeter = form.watch("hasMeter");
  
    const watchStatus = form.watch("status");
    const watchPrimary = form.watch("primaryMeterUnit");
    const watchSecondary = form.watch("secondaryMeterUnit");
  
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
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={`Edit Equipment${data?.name ? ` - ${data.name}` : ""}`}
      description="Update the equipment details below."
      closeable={true}
      renderActions={
        <Button form="edit-equipment-form" type="submit" variant="primary">
          Save Equipment
        </Button>
      }
      className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <div>
          <Form {...form}>
            <form
              id="edit-equipment-form"
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
                  <Tabs defaultValue="main" className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
                      <TabsTrigger value="main">Main</TabsTrigger>
                      <TabsTrigger value="specifications">
                        Specifications
                      </TabsTrigger>
                      <TabsTrigger value="warranty">Warranty/Misc</TabsTrigger>
                      <TabsTrigger value="purchase">Purchase</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="attachments">Attachments</TabsTrigger>
                      <TabsTrigger value="notifications">
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                      <TabsContent value="attachments">
                        <FileUploadWrapper
                          multiple={true}
                          control={form.control}
                          name={"Attachments"}
                          label={"Attachments"}
                        />
                      </TabsContent>

                      <TabsContent value="expenses">
                        <div className="flex ">
                          <div className="text-lg font-semibold text-gray-700">
                            Automatic Expense Logging
                          </div>
                        </div>
                        <EditableDataTable
                          data={data.expenses || []}
                          columns={columns}
                          defaultRow={{ id: Date.now() }}
                          onDataChange={(newData) => {
                            console.log("Updated Data:", newData);
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="notifications">
                        <div className="flex ">
                          <div className="text-lg font-semibold text-gray-700">
                            Email Notifications
                          </div>
                        </div>
                        <EditableDataTable
                          data={data.notifications || []}
                          columns={emailColumns}
                          defaultRow={{ id: Date.now() }}
                          onDataChange={(newData) => {
                            console.log("Updated Data:", newData);
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="images">
                        <FileUploadWrapper
                          multiple={true}
                          control={form.control}
                          name={"Attachments"}
                          label={"Attachments"}
                        />
                      </TabsContent>
                      <TabsContent value="settings" className="space-y-2">
                        <Fieldset
                          legend="Track the following details of this equipment"
                          content={
                            <CheckboxWrapper
                              control={form.control}
                              name={"tracker"}
                              label={""}
                              options={equipmentCheckboxOptions}
                            />
                          }
                        />
                        <Fieldset
                          legend="Budget"
                          content={
                            <div className="grid grid-cols-2 space-x-2">
                              <div className="col-span-1 space-y-2">
                                <InputWrapper
                                  control={form.control}
                                  name={"budget"}
                                  label={"Budget"}
                                  value={""}
                                  type="number"
                                />
                              </div>
                            </div>
                          }
                        />
                        <Fieldset
                          legend="Virtual Mileage/Km/Hours Configurations for meter"
                          content={
                            <div className="grid grid-cols-2 space-x-2">
                              <div className="col-span-1 space-y-2">
                                <SingleCheckboxWrapper
                                  control={form.control}
                                  name="enableMeter1"
                                  label="Enable virtual Mi/Km/Hr calcs for Meter1"
                                />
                                <InputWrapper
                                  control={form.control}
                                  name="average1"
                                  label="Average daily Mi/Km/Hrs"
                                  type="number"
                                  value={""}
                                />
                                <DatePickerWrapper
                                  control={form.control}
                                  name="lastMaintenanceCheck1"
                                  label="Last Maintenance check"
                                />
                              </div>
                              <div className="col-span-1 space-y-2">
                                <SingleCheckboxWrapper
                                  control={form.control}
                                  name="enableMeter2"
                                  label="Enable virtual Mi/Km/Hr calcs for Meter 2"
                                />
                                <InputWrapper
                                  control={form.control}
                                  name="average2"
                                  label="Average daily Mi/Km/Hrs"
                                  type="number"
                                  value={""}
                                />
                              </div>
                            </div>
                          }
                        />
                      </TabsContent>
                      <TabsContent value="notes" className="space-y-2">
                        <TextareaWrapper
                          control={form.control}
                          name="generalNotes"
                          placeholder={""}
                          value={""}
                        />
                      </TabsContent>
                      <TabsContent value="main">
                        <div className="grid grid-cols-2 space-x-2">
                          <div className="col-span-1 space-y-2">
                            <Fieldset
                              legend="Identification"
                              content={
                                <>
                                  <div className="flex flex-col space-y-0.5">
                                    <InputWrapper
                                      control={form.control}
                                      name="name"
                                      label="Unit #"
                                      type="text"
                                      required
                                      value={""}
                                    />
                                    <ComboboxFieldWrapper
                                      control={form.control}
                                      name="make"
                                      label="Make"
                                      options={makeOptionsList}
                                    />
                                    <ComboboxFieldWrapper
                                      control={form.control}
                                      name="model"
                                      label="Model"
                                      options={carModelOptionsList}
                                    />
                                    <InputWrapper
                                      control={form.control}
                                      name="serial_number"
                                      label="Serial #"
                                      type="text"
                                      value={""}
                                    />
                                    <InputWrapper
                                      control={form.control}
                                      name="year"
                                      label="Year"
                                      type="number"
                                      value={""}
                                    />
                                    <ComboboxFieldWrapper
                                      control={form.control}
                                      name="equipmentType"
                                      label="Types"
                                      options={equipmentTypeOptions}
                                    />
                                  </div>
                                </>
                              }
                            />

                            <Fieldset
                              legend="Assignment"
                              content={
                                <CardContent className="space-y-4">
                                  <SelectWrapper
                                    control={form.control}
                                    name="status"
                                    label="Status"
                                    options={statusOptions}
                                    required
                                  />

                                  {watchStatus === "Sold" && (
                                    <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DatePickerWrapper
                                          control={form.control}
                                          name="soldDate"
                                          label="Date Sold"
                                        />
                                        <InputWrapper
                                          control={form.control}
                                          name="soldTo"
                                          label="Buyer"
                                          type="text"
                                          value={""}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                          Price Sold
                                        </label>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">$</span>
                                          <InputWrapper
                                            control={form.control}
                                            name="soldPrice"
                                            label=""
                                            type="number"
                                            value={""}
                                            className="flex-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <MultiSelectWrapper
                                    control={form.control}
                                    name="assigneeIds"
                                    label="Assignees"
                                    options={assigneeOptions}
                                  />

                                  <SelectWrapper
                                    control={form.control}
                                    name="categoryId"
                                    label="Location / Category"
                                    options={categoryOptions}
                                  />

                                  <InputWrapper
                                    control={form.control}
                                    name="parentId"
                                    label="Parent Equipment"
                                    type="text"
                                    placeholder="Enter Equipment Parent"
                                    value={""}
                                  />
                                </CardContent>
                              }
                            />
                          </div>
                          <div className="col-span-1 space-y-2                                                                                                                                                                                                                                                                                                                                                                            ">
                            <Fieldset
                              legend="Meter Configurations"
                              content={
                                <>
                                  <div className="flex justify-between items-center ">
                                    <ComboboxFieldWrapper
                                      label="Select PM Schedule"
                                      control={form.control}
                                      options={pmScheduleOptionList}
                                      name="pmSchedule"
                                    />
                                  </div>
                                  <div className="text-sm">
                                    Selecting an existing PM schedule template
                                    can save data entry time. Or you may add
                                    individualPM services after equipment is
                                    saved.
                                  </div>
                                </>
                              }
                            />
                            {/* <Fieldset
                              legend="Meter Configurations"
                              content={
                                <>
                                  <div className="flex">
                                    <ComboboxFieldWrapper
                                      label="Primary"
                                      control={form.control}
                                      options={meterUnitsOptions}
                                      name="primaryMeterUnit"
                                    />

                                    {watchPrimary && (
                                      <InputWrapper
                                        control={form.control}
                                        name="primary"
                                        label=""
                                        type="number"
                                        placeholder="0"
                                        value={""}
                                      />
                                    )}
                                  </div>

                                  <div className="flex">
                                    {" "}
                                    <ComboboxFieldWrapper
                                      label="secondary"
                                      control={form.control}
                                      options={meterUnitsOptions}
                                      name="secondaryMeterUnit"
                                    />
                                    {watchSecondary && (
                                      <InputWrapper
                                        control={form.control}
                                        name="secondary"
                                        label=""
                                        type="number"
                                        placeholder="0"
                                        value={""}
                                      />
                                    )}
                                  </div>
                                </>
                              }
                            /> */}
                            <Fieldset
                              legend="Custom Fields"
                              content={
                                <>
                                  <InputWrapper
                                    control={form.control}
                                    name="btu"
                                    label="BTU"
                                    type="text"
                                    value={""}
                                    className="flex-1"
                                  />
                                  <InputWrapper
                                    control={form.control}
                                    name="inputVolts"
                                    label="Input Volts"
                                    type="text"
                                    value={""}
                                    className="flex-1"
                                  />
                                  <DatePickerWrapper
                                    control={form.control}
                                    name="installDate"
                                    label="Install Date"
                                  />
                                  <CustomFieldsWrapper
                                    control={form.control}
                                     name="others"
                                    label={"Custom"}
                                  />
                                </>
                              }
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="specifications" className="space-y-2">
                        <Fieldset
                          legend="Physical Attributes"
                          content={
                            <div className="grid grid-cols-2">
                              <div className="col-span-1">
                                <ComboboxFieldWrapper
                                  label="Color"
                                  control={form.control}
                                  options={colorOptions}
                                  name="color"
                                />
                              </div>
                              <div className="col-span-1"></div>
                              <div className="col-span-1">
                                <InputWrapper
                                  label="Length"
                                  control={form.control}
                                  name="length"
                                  type="text"
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1"></div>
                              <div className="col-span-1">
                                <InputWrapper
                                  label="Width"
                                  control={form.control}
                                  name="width"
                                  type="text"
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1"></div>
                              <div className="col-span-1">
                                <InputWrapper
                                  label="Height"
                                  control={form.control}
                                  name="height"
                                  type="text"
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1"></div>

                              <div className="col-span-1">
                                <InputWrapper
                                  label="Gross Weight"
                                  control={form.control}
                                  name="grossWeight"
                                  type="number"
                                  value={"0"}
                                />
                              </div>
                              <div className="col-span-1"></div>
                            </div>
                          }
                        />

                        <Fieldset
                          legend="Custom Fields"
                          content={
                            <>
                              <CustomFieldsWrapper
                                label="customField"
                                control={form.control}
                                name={"customSpecifications"}
                              />
                            </>
                          }
                        />
                      </TabsContent>
                      <TabsContent
                        value="warranty"
                        className="space-x-2 space-y-2 grid grid-cols-2 "
                      >
                        <div className=" col-span-1 gap-4">
                          <Fieldset
                            className="col-span-1"
                            legend="Primary Warranty"
                            content={
                              <div className="space-y-2">
                                <InputWrapper
                                  control={form.control}
                                  name="warrantyDescription"
                                  label="Primary Warranty"
                                  type="text"
                                  value={""}
                                />
                                <DatePickerWrapper
                                  control={form.control}
                                  name="warrantyExpirationDate"
                                  label="Expiration Date"
                                />
                                <InputWrapper
                                  control={form.control}
                                  name="primaryWarrantyMeter"
                                  label="Meter"
                                  type="number"
                                  value={""}
                                />
                              </div>
                            }
                          />
                        </div>
                        <div className="col-span-1 gap-4">
                          <Fieldset
                            className="col-span-1"
                            legend="Secondary Warranty"
                            content={
                              <div className="space-y-2">
                                <InputWrapper
                                  control={form.control}
                                  name="secondaryWarrantyDescription"
                                  label="Secondary Warranty"
                                  type="text"
                                  value={""}
                                />
                                <DatePickerWrapper
                                  control={form.control}
                                  name="secondaryWarrantyExpirationDate"
                                  label="Expiration Date"
                                />
                                <InputWrapper
                                  control={form.control}
                                  name="secondaryWarrantyMeter"
                                  label="Meter"
                                  type="number"
                                  value={""}
                                />
                              </div>
                            }
                          />
                        </div>

                        <div className="col-span-2 gap-4">
                          <Fieldset
                            className="col-span-2"
                            legend="Custom Fields"
                            content={
                              <div className="space-y-2">
                                <CustomFieldsWrapper
                                  control={form.control}
                                  name="CustomSecondary"
                                  label="Custom Fields "
                                />
                              </div>
                            }
                          />
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="purchase"
                        className="space-x-2 space-y-2 grid grid-cols-2 "
                      >
                        <Fieldset
                          className="col-span-1"
                          legend="Purchase Details"
                          content={
                            <>
                              <ComboboxFieldWrapper
                                label="Dealer"
                                control={form.control}
                                options={vendorOptions}
                                name="vendor"
                              />
                              <DatePickerWrapper
                                control={form.control}
                                name="purchaseDate"
                                label="Purchase Date"
                              />
                              <InputWrapper
                                control={form.control}
                                name="meter"
                                label={"Meter"}
                                type="number"
                                value={""}
                                className=""
                              />
                              <InputWrapper
                                control={form.control}
                                name="price"
                                label={"Price"}
                                type="number"
                                value={""}
                                className=""
                              />
                              <CustomFieldsWrapper
                                name="purchaseOrderCustom"
                                label="Custom Field"
                                control={form.control}
                              />

                              <InputWrapper
                                control={form.control}
                                name="note"
                                label={"Notes"}
                                type="text"
                                value={""}
                                className=""
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
                                control={form.control}
                                name="depreciationLifeMonths"
                                label="Term (Months)"
                                type="number"
                                value={""}
                                className="flex-1"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm">$</span>
                                <InputWrapper
                                  control={form.control}
                                  name="startingPrice"
                                  label="Starting Value"
                                  type="number"
                                  value={""}
                                  className="flex-1"
                                />
                              </div>
                              <div className="flex items-center gap-2 pb-2">
                                <span className="text-sm">$</span>
                                <InputWrapper
                                  control={form.control}
                                  name="salvagePrice"
                                  label="Salvage Value"
                                  type="number"
                                  value={""}
                                  className="flex-1"
                                />
                              </div>
                              <div className="border-t flex flex-col">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Depreciation (Monthly)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">$</span>
                                    <Input
                                      type="number"
                                      value={""}
                                      className="flex-1"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Current Value
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">$</span>
                                    <Input
                                      type="number"
                                      value={""}
                                      className="flex-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          }
                        />

                        <div className="col-span-2 space-x-2">
                          <Fieldset
                            legend="Ownership/Status"
                            content={
                              <div className="grid grid-cols-2 space-x-2">
                                <div className="col-span-1">
                                  <ComboboxFieldWrapper
                                    control={form.control}
                                    name="ownership"
                                    label="Ownership"
                                    options={ownershipOptions}
                                  />
                                  {form.watch("ownership") === "Customer" && (
                                    <ComboboxFieldWrapper
                                      control={form.control}
                                      name="customerName"
                                      label="Customer"
                                      options={assigneeOptions}
                                    />
                                  )}
                                  <DatePickerWrapper
                                    control={form.control}
                                    name="inService"
                                    label="In service"
                                  />
                                  <DatePickerWrapper
                                    control={form.control}
                                    name="outService"
                                    label="Out of Service"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <DatePickerWrapper
                                    control={form.control}
                                    name="transferred"
                                    label="Transferred Date"
                                  />
                                  <DatePickerWrapper
                                    control={form.control}
                                    name="soldDate"
                                    label="Date sold"
                                  />
                                  <InputWrapper
                                    control={form.control}
                                    name="soldTo"
                                    label="Sold To"
                                    type="text"
                                    value={""}
                                    className="flex-1"
                                  />
                                  <InputWrapper
                                    control={form.control}
                                    name="notes"
                                    label="Notes"
                                    type="text"
                                    value={""}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            }
                          />
                        </div>
                      </TabsContent>
                  </Tabs>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </Drawer>
  );
}

type emailTableType = {
  id: string;
  name: string;
  email: string;
  maintenance: boolean;
  renewals: boolean;
  workOrders: boolean;
};

export const emailColumns: ColumnDef<emailTableType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Select
        value={row.original.name}
        onValueChange={(e) => updateRow(rowIndex, "name", e)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {vendorOptions.map((item) => (
            <SelectItem value={item.id} key={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.email}
        onChange={(e) => updateRow(rowIndex, "email", e.target.name)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "maintenance",
    header: "Maintenance",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Checkbox
        value={row.original.maintenance}
        onChange={(e) => updateRow(rowIndex, "maintenance", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "renewals",
    header: "Renewals",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Checkbox
        value={row.original.renewals}
        onChange={(e) => updateRow(rowIndex, "renewals", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "workOrders",
    header: "WorkOrders",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Checkbox
        value={row.original.workOrders}
        onChange={(e) => updateRow(rowIndex, "renewals", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => alert(`Delete ${person.notes}`)}
          >
            <LucideTrash2 className="text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

type expenseTableType = {
  id: string;
  name: number;
  lastDate: string;
  nextDate: string;
  period: string;
  interval: number;
  cost: number;
  quantity: number;
  notes: string;
};

export const columns: ColumnDef<expenseTableType>[] = [
  {
    accessorKey: "name",
    header: "Expense",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Select
        value={row.original.name}
        onValueChange={(e) => updateRow(rowIndex, "name", e)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {expenseOptions.map((item) => (
            <SelectItem value={item.id} key={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "lastDate",
    header: "Last Date",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.name}
        onChange={(e) => updateRow(rowIndex, "lastDate", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "nextDate",
    header: "Next Date",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.name}
        onChange={(e) => updateRow(rowIndex, "nextDate", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Select
        value={row.original.name}
        onValueChange={(e) => updateRow(rowIndex, "period", e)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="" />
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
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.name}
        onChange={(e) => updateRow(rowIndex, "quantity", e)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.cost}
        onChange={(e) => updateRow(rowIndex, "cost", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "notes",
    header: "Note",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.notes}
        onChange={(e) => updateRow(rowIndex, "note", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => alert(`Delete ${person.notes}`)}
          >
            <LucideTrash2 className="text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
