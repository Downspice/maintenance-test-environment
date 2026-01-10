"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventoryMovement, partOptions } from "@/lib/inventory-data";
import Fieldset from "@/components/customUI/fieldset";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import PartSubstitutionTable from "@/app/(application)/inventory/component/inventory.partSubstitutionTable";
import AlternateUpcCodesTable from "@/app/(application)/inventory/component/inventory.alternateUpcCodesTable";
import { useEffect, useState } from "react";
import WarehouseTabs from "@/app/(application)/inventory/component/inventory.warehouse";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import CustomFieldsWrapper from "@/components/forms/wrappers/CustomFieldsWrapper";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";
import {
  useGetCostCenters,
  useGetInventory,
  useGetInventoryCategories,
  useGetInventoryManufacturers,
  useGetInventoryUnitTypes,
  useGetMarkupTypes,
  useGetWarehouses,
  useUpdateInventory,
} from "@/services/setups/inventory";
import { useGetVendors } from "@/services/setups/vendor";
import { GenericObject } from "@/types/types";
import { InventorySchema } from "@/components/forms/actualForms/new-inventory-form";

export default function EditInventory({
  children,
  pageId,
}: {
  children: React.ReactNode;
  pageId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { data: inventoryData, isLoading } = useGetInventory<any>(pageId);
  const { data: equipmentManufacturerOptions } =
    useGetInventoryManufacturers<GenericObject[]>();
  const { data: unitOptions } = useGetInventoryUnitTypes<GenericObject[]>();
  const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
  const { data: warehouseOptions } = useGetWarehouses<GenericObject[]>();
  const { data: vendorOptions } = useGetVendors<GenericObject[]>();
  const { data: markupTypeOptions } = useGetMarkupTypes<GenericObject[]>();
  const { data: categoryOptions } =
    useGetInventoryCategories<GenericObject[]>();
  const { mutateAsync: updateInventory } = useUpdateInventory();

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

  // Populate form when data is loaded
  useEffect(() => {
    if (inventoryData) {
      const data = inventoryData;

      // Transform custom fields from 'others' array
      const customFields =
        data.others?.map((item: any) => ({
          key: item.name,
          id: item.value,
        })) || [];
      console.log(data.others)

      // Transform inventory trackings
      const trackings =
        data.inventory_trackings?.map((track: any) => ({
          warehouse: track.warehouse_id,
          aisle: track.aisle || "",
          row: track.row || "",
          bin: track.bin || "",
          vendor: track.vendor_id || "",
          costCenter: track.cost_center_id || "",
          quantity: parseFloat(track.quantity) || 0,
          reorderPoint: parseFloat(track.reorder_point) || 0,
          reorderQty: parseFloat(track.reorder_quantity) || 0,
          maxQty: parseFloat(track.max_quantity) || 0,
          leadTime: parseFloat(track.lead_time) || 0,
          movementType: track.tracking_type_name as "FIFO" | "LIFO",
        })) || [];

      // Extract warehouse IDs for tabs
      const warehouseIds =
        data.inventory_trackings?.map((track: any) => track.warehouse_id) || [];
      setWarehouses(warehouseIds);

      // Transform inventory substitutions
      const substitutions =
        data.inventory_substitutions?.map((sub: any) => ({
          part_number: sub.part_number,
          name: sub.name,
          manufacturer_id: sub.manufacturer_id || "",
          description: sub.description || "",
        })) || [];

      // Transform UPC codes
      const upcCodesData =
        data.upc_codes?.map((upc: any) => ({
          manufacturer_id: upc.manufacturer_id,
          vendor_id: upc.vendor_id || "",
          upc: upc.upc,
        })) || [];

      // Determine markup type
      let markupType: any = "none";
      if (data.markup_type_id) {
        markupType = data.markup_type_id;
      }

      // Set all form values
      inventoryForm.reset({
        part_number: data.part_number || "",
        name: data.name || "",
        description: data.description || "",
        manufacturer: data.manufacturer_id || "",
        category: data.category_id || "",
        unit_cost: data.unit_cost || "",
        unit_of_measure: data.unit_of_measure || "",
        upc: data.upc || "n/a",
        others: customFields,
        enable_tracking: data.enable_tracking || false,
        inventory_trackings: trackings,
        markUp: markupType,
        percent_markup: parseFloat(data.markup_value) || undefined,
        markup_id: parseFloat(data.markup_value) || undefined,
        markup_price: parseFloat(data.markup_value) || undefined,
        days: data.days || 0,
        primary: data.primary || 0,
        secondary: data.secondary || 0,
        notes: data.notes || "",
        inventory_substitutions: substitutions,
        upc_codes: upcCodesData,
      });
    }
  }, [inventoryData, inventoryForm]);

  async function handleSubmit(data: z.infer<typeof InventorySchema>) {
    console.log("Form submitted:", data);

    const backendData = {
      ...data,
      inventory_substitutions: data.inventory_substitutions || [],
      upc_codes: data.upc_codes || [],
    };

    console.log("Backend payload:", backendData);
    const response = await updateInventory({
      id: pageId,
      ...backendData,
    });
    if (response) {
      toast.success(response.message || "Inventory updated successfully");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>{inventoryData.name}</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
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
                    <TabsTrigger value="Identification">
                      Identification
                    </TabsTrigger>
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
                  <TabsContent
                    value="Advanced"
                    className="grid grid-cols-2 gap-x-1"
                  >
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
                              options={[
                                ...(markupTypeOptions || []),
                                { id: "none", name: "none" },
                              ]}
                              required
                            />
                            {inventoryForm.watch("markUp") ===
                              "1a6f57d9-e764-406e-9366-601e1fe4a1fd" && (
                                <InputWrapper
                                  control={inventoryForm.control}
                                  name="percent_markup"
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
                      <Tabs
                        defaultValue="Part Substitutions"
                        className="w-full"
                      >
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
                              inventoryForm.setValue(
                                "inventory_substitutions",
                                rows
                              )
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
                    <GitPullRequestArrow className="mr-2" /> Update Inventory
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
