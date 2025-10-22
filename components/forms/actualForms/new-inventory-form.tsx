"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import SelectWrapper from "../wrappers/SelectWrapper";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventoryMovement, partOptions } from "@/lib/inventory-data";
import SingleCheckboxWrapper from "../wrappers/SingleCheckboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import FileUploadWrapper from "../wrappers/FileUploadWrapper";
import PartSubstitutionTable from "@/app/(application)/inventory/component/inventory.partSubstitutionTable";
import AlternateUpcCodesTable from "@/app/(application)/inventory/component/inventory.alternateUpcCodesTable";
import { useState } from "react";
import WarehouseTabs from "@/app/(application)/inventory/component/inventory.warehouse";
import {
  useAddInventory,
  useGetCostCenters,
  useGetInventoryCategories,
  useGetInventoryManufacturers,
  useGetInventoryUnitTypes,
  useGetMarkupTypes,
  useGetWarehouses,
} from "@/services/setups/inventory";
import { useGetVendors } from "@/services/setups/vendor";
import { GenericObject } from "@/types/types";

// Updated schema to match backend structure
export const InventorySchema = z.object({
  id:z.string().optional(),
  part_number: z.string().min(1, "Part Number is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  unit_cost: z.string().min(1, "Unit cost is required"),
  unit_of_measure: z.string().optional(),
  upc: z.string().min(1, "UPC is required"),
  others: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),

  enable_tracking: z.boolean().optional(),
  inventory_trackings: z
    .array(
      z.object({
        warehouse: z.string(),
        aisle: z.string().optional(),
        row: z.string().optional(),
        bin: z.string().optional(),
        vendor: z.string().optional(),
        costCenter: z.string().optional(),
        quantity: z.coerce.number().optional(),
        reorderPoint: z.coerce.number().optional(),
        reorderQty: z.coerce.number().optional(),
        maxQty: z.coerce.number().optional(),
        leadTime: z.coerce.number().optional(),
        movementType: z.enum(["FIFO", "LIFO"]),
      })
    )
    .optional(),

  markUp: z.enum([
    "none",
    "1a6f57d9-e764-406e-9366-601e1fe4a1fd",
    "1034cc78-6c2d-46cc-8f7f-210d08061d37",
    "218ba36b-3919-4bf7-91d5-fb0ca90fab12",
  ]),
  percentMarkup: z.coerce.number().optional(),
  markupValue: z.coerce.number().optional(),
  markupPrice: z.coerce.number().optional(),

  days: z.coerce.number().optional(),
  primary: z.coerce.number().optional(),
  secondary: z.coerce.number().optional(),
  notes: z.string().optional(),

  // Fixed: Match backend structure with manufacturer_id
  inventory_substitutions: z
    .array(
      z.object({
        part_number: z.string().min(1, "Part# is required"),
        name: z.string(),
        manufacturer_id: z.string(), // Changed from 'manufacturer' to 'manufacturer_id'
        description: z.string(),
      })
    )
    .optional(),

  // Fixed: Use IDs instead of objects
  upc_codes: z
    .array(
      z.object({
        manufacturer_id: z.string().min(1, "Manufacturer is required"), // This is manufacturer ID
        vendor_id: z.string().min(1, "Vendor is required"), // This is vendor ID
        upc: z.string().min(1, "UPC is required"),
      })
    )
    .optional(),

  Photos: z.any().optional(),
  Attachments: z.any().optional(),
});

export default function NewInventory() {
  const { data: equipmentManufacturerOptions } =
    useGetInventoryManufacturers<GenericObject[]>();
  const { data: unitOptions } = useGetInventoryUnitTypes<GenericObject[]>();
  const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
  const { data: warehouseOptions } = useGetWarehouses<GenericObject[]>();
  const { data: vendorOptions } = useGetVendors<GenericObject[]>();
  const { data: markupTypeOptions } = useGetMarkupTypes<GenericObject[]>();
  const { data: categoryOptions } =
    useGetInventoryCategories<GenericObject[]>();
  const { mutateAsync: createInventory } = useAddInventory();

  const inventoryForm = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      markUp: "none",
      inventory_substitutions: [],
      upc_codes: [],
    },
  });

  const [warehouses, setWarehouses] = useState<string[]>([]);
  const enableTrackingWatch = inventoryForm.watch("enable_tracking");
  const partSubs = inventoryForm.watch("inventory_substitutions") || [];
  const upcCodes = inventoryForm.watch("upc_codes") || [];

  async function handleSubmit(data: z.infer<typeof InventorySchema>) {
    console.log("Form submitted:", data);

    // Transform data for backend if needed
    const backendData = {
      ...data,
      // Ensure arrays are present even if empty
      inventory_substitutions: data.inventory_substitutions || [],
      upc_codes: data.upc_codes || [],
    };

    console.log("Backend payload:", backendData);
    const response = createInventory(backendData);
    if (response) {
      toast.success(response.message);
    }
  }

  return (
    <div>
      <Form {...inventoryForm}>
        <form
          onSubmit={inventoryForm.handleSubmit(
            (data) => handleSubmit(data),
            (errors) => {
              console.log(errors);
              const firstErrorField = Object.values(errors)[0];
              const message = firstErrorField?.message;

              if (message) {
                toast.error(message);
              } else {
                toast.error("Please check the form for errors.");
              }
            }
          )}
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
                  name="part_number"
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
                  options={equipmentManufacturerOptions ?? []}
                />
                <ComboboxFieldWrapper
                  control={inventoryForm.control}
                  name="category"
                  label="Category"
                  options={categoryOptions ?? []}
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
                      name="unit_of_measure"
                      label="Unit of Measure"
                      options={unitOptions ?? []}
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
                  name="others"
                  label="Custom Fields"
                  maxFields={2}
                />
              </div>
              <SingleCheckboxWrapper
                control={inventoryForm.control}
                name="enable_tracking"
                label="Enable inventory tracking"
              />
              <WarehouseTabs
                warehouses={warehouses}
                setWarehouses={setWarehouses}
                options={warehouseOptions ?? []}
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
                        options={[...markupTypeOptions,{id:"none",name:"none"}]}
                        required
                      />
                      {inventoryForm.watch("markUp") ===
                        "1a6f57d9-e764-406e-9366-601e1fe4a1fd" && (
                        <InputWrapper
                          control={inventoryForm.control}
                          name="percentMarkup"
                          label="% Markup"
                          type="number"
                          required
                          value=""
                        />
                      )}
                      {inventoryForm.watch("markUp") ===
                        "1034cc78-6c2d-46cc-8f7f-210d08061d37" && (
                        <InputWrapper
                          control={inventoryForm.control}
                          name="markup_value"
                          label="Markup Value"
                          type="number"
                          required
                          value=""
                        />
                      )}
                      {inventoryForm.watch("markUp") ===
                        "218ba36b-3919-4bf7-91d5-fb0ca90fab12" && (
                        <InputWrapper
                          control={inventoryForm.control}
                          name="markup_price"
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
                  <TabsContent value="Part Substitutions">
                    <PartSubstitutionTable
                      parts={partOptions ?? []}
                      value={partSubs}
                      onChange={(rows) =>
                        inventoryForm.setValue("inventory_substitutions", rows)
                      }
                    />
                  </TabsContent>
                  <TabsContent value="Alternate UPC Codes">
                    <AlternateUpcCodesTable
                      manufacturers={equipmentManufacturerOptions ?? []}
                      vendors={vendorOptions ?? []}
                      value={upcCodes}
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
          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button type="submit" className="w-full">
              <GitPullRequestArrow className="mr-2" /> Create Inventory
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
