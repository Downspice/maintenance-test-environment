"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  inventoryMovement,
  partOptions,
} from "@/lib/domains/inventory/mock-data";
import Fieldset from "@/components/customUI/fieldset";
import PartSubstitutionTable from "@/app/(application)/inventory/components/part-substitution-table";
import AlternateUpcCodesTable from "@/app/(application)/inventory/components/alternate-upc-codes-table";
import { InventorySchema } from "@/lib/domains/inventory/inventory-data";
import { useState } from "react";
import WarehouseTabs from "@/app/(application)/inventory/components/warehouse-tabs";
import InputWrapper from "../../fields/InputWrapper";
import { ComboboxFieldWrapper } from "../../fields/ComboboxWrapper";
import FileUploadWrapper from "../../fields/FileUploadWrapper";
import SelectWrapper from "../../fields/SelectWrapper";
import SingleCheckboxWrapper from "../../fields/SingleCheckboxWrapper";
import CustomFieldsWrapper from "../../fields/CustomFieldsWrapper";
import {
  useGetCostCenters,
  useGetInventoryCategories,
  useGetInventoryManufacturers,
  useGetInventoryUnitTypes,
  useGetMarkupTypes,
} from "@/services/setups/inventory";
import { useGetVendorOptions } from "@/services/setups/vendor";

interface NewPartProps {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
}

export default function NewPart({
  formId = "new-part-form",
  hideSubmitButton,
  onSuccess,
}: NewPartProps = {}) {
  const { data: equipmentManufacturerOptions } = useGetInventoryManufacturers();
  const { data: unitOptions } = useGetInventoryUnitTypes();
  const { data: costCenterOptions } = useGetCostCenters();
  const { data: vendorOptions } = useGetVendorOptions();
  const { data: markupTypeOptions } = useGetMarkupTypes();

  const inventoryForm = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {},
  });
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const enableTrackingWatch = inventoryForm.watch("enableTracking");
  const partSubs = inventoryForm.watch("inventory_substitutions") || [];
  const { data: categoryOptions } = useGetInventoryCategories();

  async function handleSubmit(data: z.infer<typeof InventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Part created successfully!");
    onSuccess?.();
  }
  return (
    <div>
      <Form {...inventoryForm}>
        <form
          id={formId}
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
                  value={""}
                />
                <InputWrapper
                  control={inventoryForm.control}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  value={""}
                />
                <InputWrapper
                  control={inventoryForm.control}
                  name="description"
                  label="Description"
                  type="text"
                  required
                  value={""}
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
                      name="unit_cost"
                      label="Unit Cost (Base)"
                      type="text"
                      required
                      value={""}
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
                  value={""}
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
              <WarehouseTabs
                warehouses={warehouses}
                setWarehouses={setWarehouses}
                options={[
                  { name: "Warehouse A", id: "warehouseA" },
                  { name: "Warehouse B", id: "warehouseB" },
                  { name: "Warehouse C", id: "warehouseC" },
                ]}
                control={inventoryForm.control}
                enableTrackingWatch={
                  enableTrackingWatch ? enableTrackingWatch : false
                }
                vendorOptions={vendorOptions}
                costCenterOptions={costCenterOptions}
                inventoryMovement={inventoryMovement}
              />
            </TabsContent>
            <TabsContent value="Advanced" className="grid grid-cols-2 gap-x-1">
              <div className="col-span-1">
                <Fieldset
                  className="h-full"
                  legend="Markup (invoices)"
                  content={
                    <>
                      <SelectWrapper
                        control={inventoryForm.control}
                        name={`markUp`}
                        label="Markup Type"
                        options={markupTypeOptions}
                        required
                      />
                      {inventoryForm.watch("markUp") === "percent" && (
                        <InputWrapper
                          control={inventoryForm.control}
                          name="percentMarkup"
                          label="% Markup"
                          type="number"
                          required
                          value=""
                        />
                      )}
                      {inventoryForm.watch("markUp") === "value" && (
                        <InputWrapper
                          control={inventoryForm.control}
                          name="markupValue"
                          label="Markup Value"
                          type="number"
                          required
                          value=""
                        />
                      )}
                      {inventoryForm.watch("markUp") === "manual" && (
                        <InputWrapper
                          control={inventoryForm.control}
                          name="markupPrice"
                          label="Markup Price"
                          type="number"
                          required
                          value=""
                        />
                      )}
                    </>
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
                        value={""}
                        required
                      />
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`primary`}
                        label="Primary"
                        type="number"
                        value={""}
                        required
                      />
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`secondary`}
                        label="Secondary"
                        type="number"
                        value={""}
                        required
                      />
                      <InputWrapper
                        control={inventoryForm.control}
                        name={`notes`}
                        label="Notes"
                        type="text"
                        required
                        value={""}
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
                  <TabsContent
                    value="Part Substitutions"
                    className="mt-4 min-w-0"
                  >
                    <PartSubstitutionTable
                      parts={partOptions}
                      value={partSubs}
                      onChange={(rows) =>
                        inventoryForm.setValue("inventory_substitutions", rows)
                      }
                    />
                  </TabsContent>
                  <TabsContent value="Alternate UPC Codes">
                    {/* A table that has button to add a new row and the headers are manufacturer, vendor, upc .When a new row is added the manufacturer and vendor becomes a select , and the ups becomes an input fields. */}
                    <AlternateUpcCodesTable
                      manufacturers={equipmentManufacturerOptions}
                      vendors={vendorOptions}
                      value={inventoryForm.watch("upc_codes") || []}
                      onChange={(val) =>
                        inventoryForm.setValue("upc_codes", val)
                      }
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
                  value={""}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.quantity`}
                  label="Quantity"
                  type="number"
                  value={""}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.lowStockLevel`}
                  label="Low Stock Level"
                  type="number"
                  value={""}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.reorderQuantity`}
                  label="Reorder Quantity"
                  type="number"
                  value={""}
                />
                <InputWrapper
                  control={control}
                  name={`warehouses.${index}.maximumQuantity`}
                  label="Maximum Quantity"
                  type="number"
                  value={""}
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
                  value={""}
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.vendor_number`}
                  label="Vendor#"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={control}
                  name={`vendors.${index}.barcode`}
                  label="Barcode"
                  type="text"
                  value={""}
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

          {!hideSubmitButton && (
            <div className="flex justify-between gap-x-4 my-8 w-full">
              <Button type="submit" className="w-full">
                <GitPullRequestArrow className="mr-2" /> Save Part
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
