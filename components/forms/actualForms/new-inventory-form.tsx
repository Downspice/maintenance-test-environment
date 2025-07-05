"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Trash2 } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import SelectWrapper from "../wrappers/SelectWrapper";
import { categoryOptions, vendorOptions } from "@/lib/equipment-schema";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  equipmentManufacturerOptions,
  unitOptions,
  inventoryMovement,
  markupTypeOptions,
  partOptions as data,
  EquipmentPartInterface,
  partOptions,
} from "@/lib/inventory-data";
import SingleCheckboxWrapper from "../wrappers/SingleCheckboxWrapper";
import { costCenterOptions } from "./work-order-form";
import Fieldset from "@/components/customUI/fieldset";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadWrapper from "../wrappers/FileUploadWrapper";

// Define the form schema with Zod
export const inventorySchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),

  Photos: z.string().optional(),
  vendors: z
    .array(
      z.object({
        vendor: z.string().optional(),
        manufacturer: z.string().optional(),
        vendorNumber: z.string().optional(),
        barcode: z.string().optional(),
        warehouses: z.array(z.string()).optional(),
      })
    )
    .optional(),

  warehouses: z
    .array(
      z.object({
        warehouse: z.string().optional(),
        bin: z.string().optional(),
        quantity: z.coerce.number().optional(),
        lowStockLevel: z.coerce.number().optional(),
        reorderQuantity: z.coerce.number().optional(),
        maximumQuantity: z.coerce.number().optional(),
      })
    )
    .optional(),
});

// Equipment options
const equipmentOptions = [{ value: "1311827", label: "AC-001-07 Class 8" }];

export default function NewInventory() {
  const inventoryForm = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { vendors: [{}], warehouses: [{}] },
  });
  const { control } = inventoryForm;
  const enableTrackingWatch = inventoryForm.watch("enableTracking");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendors",
  });

  const columns = [
    {
      accessorKey: "partNumber",
      header: "Part #",
      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Select
          value={row.original.partNumber}
          onValueChange={(e) => {
            updateRow(rowIndex, "partNumber", e);
          }}
        >
          <SelectTrigger className=" ">
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            {partOptions.map((item) => (
              <SelectItem value={item.partNumber} key={item.partNumber}>
                {item.partNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => {
        const name = partOptions?.filter(
          (item) => item.partNumber == row.original.partNumber
        );
        console.log("row.partNumber", row.original);
        return (
          <Input
            disabled
            value={name[0]?.name}
            onChange={(e) => updateRow(rowIndex, "name", e.target.value)}
          />
        );
      },
    },
    {
      accessorKey: "manufacturer",
      header: "Manufacturer",
      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => {
        const data = partOptions?.filter(
          (item) => item.partNumber == row.original.partNumber
        );
        console.log("row.partNumber", row.original);
        return (
          <Input
            disabled
            value={data[0]?.manufacturer}
            onChange={(e) =>
              updateRow(rowIndex, "manufacturer", e.target.value)
            }
          />
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",

      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => {
        const data = partOptions?.filter(
          (item) => item.partNumber == row.original.partNumber
        );
        console.log("row.partNumber", row.original);
        return (
          <Input
            disabled
            value={data[0]?.description}
            onChange={(e) => updateRow(rowIndex, "description", e.target.value)}
          />
        );
      },
    },
    {
      accessorKey: "action",
      header: "",
      // enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => {
        console.log("row.partNumber", row.original);
        const handleDelete = (row: any) => {
          console.log("Delete row:", row.original);
          if (
            confirm(
              `Are you sure you want to delete ${row.original.partNumber}?`
            )
          ) {
            alert(`Deleted ${row.original.partNumber}`);
            // Here you would typically call your delete API
          }
        };
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const AlternateUPCCodesColumns = [
    {
      accessorKey: "manufacturerAlt",
      header: "Manufacturer",
      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Select
          value={row.original.manufacturer}
          onValueChange={(e) => {
            updateRow(rowIndex, "manufacturerAlt", e);
          }}
        >
          <SelectTrigger className=" ">
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            {equipmentManufacturerOptions.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => (
        <Select
          value={row.original.manufacturer}
          onValueChange={(e) => {
            updateRow(rowIndex, "vendor", e);
          }}
        >
          <SelectTrigger className=" ">
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            {vendorOptions.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "upc",
      header: "UPC",
      enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => {
        const data = partOptions?.filter(
          (item) => item.partNumber == row.original.partNumber
        );
        console.log("row.partNumber", row.original);
        return (
          <Input
            value={data[0]?.manufacturer}
            onChange={(e) => updateRow(rowIndex, "upc", e.target.value)}
          />
        );
      },
    },
    {
      accessorKey: "action",
      header: "",
      // enableSorting: true,
      cell: ({ row, updateRow, rowIndex }: any) => {
        console.log("row.partNumber", row.original);
        const handleDelete = (row: any) => {
          console.log("Delete row:", row.original);
          if (
            confirm(
              `Are you sure you want to delete ${row.original.manufacturer}?`
            )
          ) {
            alert(`Deleted ${row.original.manufacturer}`);
            // Here you would typically call your delete API
          }
        };
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const {
    fields: warehouseFields,
    append: appendWarehouse,
    remove: removeWarehouse,
  } = useFieldArray({
    control,
    name: "warehouses",
  });

  async function handleSubmit(data: z.infer<typeof inventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }
  return (
    <div>
      <Form {...inventoryForm}>
        <form
          onSubmit={inventoryForm.handleSubmit((data) => handleSubmit(data))}
          className="flex flex-col gap-2"
        >
          <Tabs defaultValue="Identification">
            <TabsList>
              <TabsTrigger value="Identification">Identification</TabsTrigger>
              <TabsTrigger value="Advanced">Advanced</TabsTrigger>
              <TabsTrigger value="Photos">Photos</TabsTrigger>
              <TabsTrigger value="Attachments">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="Identification" className="space-y-2">
              <div className="work-order-form-wrapper flex flex-col gap-0.5">
                <InputWrapper
                  control={inventoryForm.control}
                  name="number"
                  label="Part Number"
                  type="text"
                  required
                  value={undefined}
                />
                <InputWrapper
                  control={inventoryForm.control}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  value={undefined}
                />
                <InputWrapper
                  control={inventoryForm.control}
                  name="description"
                  label="Description"
                  type="text"
                  required
                  value={undefined}
                />
                <ComboboxFieldWrapper
                  control={inventoryForm.control}
                  name="manufacturer"
                  label="Manufacturer"
                  options={equipmentManufacturerOptions}
                />

                <ComboboxFieldWrapper
                  control={inventoryForm.control}
                  name="category"
                  label="Category"
                  options={categoryOptions}
                />
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="col-span-1">
                    <InputWrapper
                      control={inventoryForm.control}
                      name="unitCost"
                      label="Unit Cost (Base)"
                      type="text"
                      required
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={inventoryForm.control}
                      name="unit"
                      label="Unit of Measure"
                      options={unitOptions}
                    />
                  </div>
                </div>
                <InputWrapper
                  control={inventoryForm.control}
                  name="upc"
                  label="UPC"
                  type="text"
                  required
                  value={undefined}
                />
                <CustomFieldsWrapper
                  control={inventoryForm.control}
                  name="customFields"
                  label="Custom Fields"
                  maxFields={2}
                />
              </div>
              <SingleCheckboxWrapper
                control={inventoryForm.control}
                name="enableTracking"
                label="Enable inventory tracking"
              />
              <Tabs defaultValue="Identification">
                <TabsList>
                  <TabsTrigger value="Identification">
                    Warehouse 
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="Identification">
                  <div className="flex flex-row gap-x-3">
                    <InputWrapper
                      control={inventoryForm.control}
                      name="aisle"
                      label="Aisle"
                      type="text"
                      required
                      value={undefined}
                    />
                    <InputWrapper
                      control={inventoryForm.control}
                      name="row"
                      label="Row"
                      type="text"
                      required
                      value={undefined}
                    />
                    <InputWrapper
                      control={inventoryForm.control}
                      name="bin"
                      label="Bin"
                      type="text"
                      required
                      value={undefined}
                    />
                  </div>
                  <ComboboxFieldWrapper
                    control={inventoryForm.control}
                    name="vendor"
                    label="Vendor"
                    options={vendorOptions}
                  />
                  <ComboboxFieldWrapper
                    control={inventoryForm.control}
                    name="costCenter"
                    label="Cost Center"
                    options={costCenterOptions}
                  />
                  {enableTrackingWatch === true && (
                    <div className="grid grid-cols-3">
                      <div className="col-span-1">
                        <InputWrapper
                          control={inventoryForm.control}
                          name="quantity"
                          label="Quantity"
                          type="number"
                          required
                          value={0}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button disabled>Adjust</Button>
                      </div>
                      <div className="col-span-1"></div>

                      <div className="col-span-1">
                        <InputWrapper
                          control={inventoryForm.control}
                          name="reorderPoint"
                          label="Reorder Point"
                          type="number"
                          required
                          value={undefined}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={inventoryForm.control}
                          name="reorderQty"
                          label="Reorder Qty"
                          type="number"
                          required
                          value={undefined}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={inventoryForm.control}
                          name="maxQty"
                          label="Max Qty"
                          type="number"
                          required
                          value={undefined}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={inventoryForm.control}
                          name="leadTime"
                          label="Lead Time "
                          type="number"
                          required
                          value={undefined}
                        />
                      </div>
                      <div className="col-span-1">
                        <SelectWrapper
                          control={inventoryForm.control}
                          name={`movementType`}
                          label="Type"
                          options={inventoryMovement}
                          required
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="Advanced" className="grid grid-cols-2 gap-x-1">
              <div className="col-span-1">
                <Fieldset
                  className="h-full"
                  legend="Markup (invoices)"
                  content={
                    <SelectWrapper
                      control={inventoryForm.control}
                      name={`markUp`}
                      label="Markup Type"
                      options={markupTypeOptions}
                      required
                    />
                  }
                />
              </div>
              <div className="col-span-1">
                <Fieldset
                  legend="Warranty"
                  content={
                    <>
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`days`}
                        label="Days"
                        type="number"
                        value={undefined}
                        required
                      />
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`primary`}
                        label="Primary"
                        type="number"
                        value={undefined}
                        required
                      />
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`secondary`}
                        label="Secondary"
                        type="number"
                        value={undefined}
                        required
                      />
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`notes`}
                        label="Notes"
                        type="text"
                        required
                        value={undefined}
                      />
                    </>
                  }
                />
              </div>
              <div className="col-span-2">
                <Tabs defaultValue="Part Substitutions" className="w-full">
                  <TabsList>
                    <TabsTrigger value="Part Substitutions">
                      Part Substitutions
                    </TabsTrigger>
                    <TabsTrigger value="Alternate UPC Codes">
                      Alternate UPC Codes
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="Part Substitutions">
                    <EditableDataTable
                      data={[]}
                      defaultRow={{
                        partNumber: " ",
                        name: " ",
                        manufacturer: " ",
                        description: " ",
                      }}
                      columns={columns}
                      onDataChange={(newData) => {
                        console.log("Updated Data:", newData);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="Alternate UPC Codes">
                    <EditableDataTable
                      data={[]}
                      defaultRow={{
                        manufacturerAlt: " ",
                        vendor: " ",
                        upc: " ",
                      }}
                      columns={AlternateUPCCodesColumns}
                      onDataChange={(newData) => {
                        console.log("Updated Data:", newData);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            <TabsContent value="Photos" className="space-y-2">
              <FileUploadWrapper
                control={inventoryForm.control}
                name="Photos"
                label="Photos"
              />
            </TabsContent>
            <TabsContent value="Attachments" className="space-y-2">
              <FileUploadWrapper
                control={inventoryForm.control}
                name="Attachments"
                label="Attachments"
              />
            </TabsContent>
          </Tabs>

          {/* <div className="flex flex-col gap-6">
            {warehouseFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md relative">
                <SelectWrapper
                  control={control}
                  name={`warehouses.${index}.warehouse`}
                  label="Warehouse"
                  options={warehouseOptions}
                  required
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.bin`}
                  label="Bin"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.quantity`}
                  label="Quantity"
                  type="number"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.lowStockLevel`}
                  label="Low Stock Level"
                  type="number"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.reorderQuantity`}
                  label="Reorder Quantity"
                  type="number"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.maximumQuantity`}
                  label="Maximum Quantity"
                  type="number"
                  value={undefined}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeWarehouse(index)}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" onClick={() => appendWarehouse({})}>
              + Add Warehouse Entry
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md relative">
                <SelectWrapper
                  control={control}
                  name={`vendors.${index}.vendor`}
                  label="Vendors"
                  options={vendorOptions}
                  required
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.manufacturer`}
                  label="Manufacturer"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.vendorNumber`}
                  label="Vendor#"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.barcode`}
                  label="Barcode"
                  type="text"
                  value={undefined}
                />
                <MultiSelectWrapper
                  control={control}
                  name={`vendors.${index}.warehouses`}
                  label="Warehouses"
                  options={warehouseOptions}
                  placeholder="Select Warehouse"
                  searchPlaceholder="Search Warehouse..."
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" onClick={() => append({})}>
              + Add Vendor Info
            </Button>
          </div> */}

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Create Inspection
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
