"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Trash2 } from "lucide-react";
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
import {
  InventoryByIdInterface,
  InventoryInterface,
  InventorySchema,
} from "@/lib/Inventory/inventory-data";
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
} from "@/services/setups/inventory";
import { useGetVendors } from "@/services/setups/vendor";

export default function EditInventory({
  children,
  pageId,
}: {
  children: React.ReactNode;
  pageId: string;
}) {
  const { data, isLoading } = useGetInventory<InventoryByIdInterface>(pageId);
  const { data: equipmentManufacturerOptions } = useGetInventoryManufacturers();
  const { data: unitOptions } = useGetInventoryUnitTypes();
  const { data: categoryOptions } = useGetInventoryCategories();
  const { data: warehouseOptions } = useGetWarehouses();
  const { data: costCenterOptions } = useGetCostCenters();
  const { data: vendorOptions } = useGetVendors();
  const { data: markupTypeOptions } = useGetMarkupTypes();

  const [open, setOpen] = useState(false);
  const inventoryForm = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
  });

  const [warehouses, setWarehouses] = useState<string[]>();

  useEffect(() => {
    if (!data) return;

    // Map inventory_trackings to warehouses format
    const mappedWarehouses =
      data.inventory_trackings?.map((tracking: any) => ({
        warehouse_id: tracking.warehouse_id,
        aisle: tracking.aisle || "",
        row: tracking.row || "",
        bin: tracking.bin || "",
        vendor_id: tracking.vendor_id,
        cost_center_id: tracking.cost_center_id,
        quantity: tracking.quantity || "0",
        reorder_point: tracking.recorder_point || "",
        reorder_quantity: tracking.recorder_quantity || "",
        max_quantity: tracking.max_quantity || "0",
        lead_time: tracking.lead_time || "0",
        tracking_type_id: tracking.tracking_type_id,
      })) || [];

    // Map part substitutions
    const mappedPartSubs =
      data.inventory_substitutions?.map((sub: any) => ({
        id: sub.id,
        part_number: sub.part_number,
        name: sub.name,
        manufacturer_id: sub.manufacturer_id,
        description: sub.description,
      })) || [];

    // Map alternate UPC codes
    const mappedUpcCodes =
      data.upc_codes?.map((upc: any) => ({
        id: upc.id,
        manufacturer_id: upc.manufacturer_id,
        vendor_id: upc.vendor_id,
        upc: upc.upc,
      })) || [];

    // Get warehouse IDs for tabs
    const warehouseTabs = mappedWarehouses.map((w: any) => w.warehouse_id);

    inventoryForm.reset({
      ...data,
      manufacturer: data?.manufacturer?.id,
      category: data?.category?.id,
      unit_of_measure: data?.unit_of_measure,
      warehouses: mappedWarehouses,
      inventory_substitutions: mappedPartSubs,
      upc_codes: mappedUpcCodes,
      is_enabled: data?.is_enabled || false,
      markUp:
        data?.markup_type?.name?.toLowerCase() === "percent"
          ? "percent"
          : data?.markup_type?.name?.toLowerCase() === "value"
          ? "value"
          : "manual",
      percentMarkup:
        data?.markup_type?.name?.toLowerCase() === "percent"
          ? data?.markup_value
          : "",
      markupValue:
        data?.markup_type?.name?.toLowerCase() === "value"
          ? data?.markup_value
          : "",
      markupPrice:
        data?.markup_type?.name?.toLowerCase() === "manual"
          ? data?.markup_value
          : "",
      days: data?.days || 0,
      primary: data?.primary || 0,
      secondary: data?.secondary || 0,
      notes: data?.notes || "",
      others:
        data?.others?.map((o: any) => ({
          name: o.name,
          value: o.value,
        })) || [],
    });

    setWarehouses(warehouseTabs);
  }, [data, inventoryForm]);

  const enableTrackingWatch = inventoryForm.watch("is_enabled");

  async function handleSubmit(data: z.infer<typeof InventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("inventory  submitted successfully!");
  }
  if (isLoading) {
    <>We are gathering data</>;
  }
  if (data) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-3/4 ">
          <SheetHeader>
            <SheetTitle>
              <div className="flex justify-between">
                <div>{data.name}</div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
            <div>
              <Form {...inventoryForm}>
                <form
                  onSubmit={inventoryForm.handleSubmit((data) =>
                    handleSubmit(data)
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
                              name="unit_of_measure"
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
                          name="others"
                          label="Custom Fields"
                          maxFields={2}
                        />
                      </div>
                      <SingleCheckboxWrapper
                        control={inventoryForm.control}
                        name="is_enabled"
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
                            {/* A table that has button to add a new row and the headers are part#, name, manufacturer, description. */}
                            <PartSubstitutionTable
                              parts={partOptions}
                              value={data.inventory_substitutions ?? []}
                              onChange={(rows) =>
                                inventoryForm.setValue(
                                  "inventory_substitutions",
                                  rows
                                )
                              }
                            />
                          </TabsContent>
                          <TabsContent value="Alternate UPC Codes">
                            {/* A table that has button to add a new row and the headers are manufacturer, vendor, upc .When a new row is added the manufacturer and vendor becomes a select , and the ups becomes an input fields. */}
                            <AlternateUpcCodesTable
                              manufacturers={equipmentManufacturerOptions}
                              vendors={vendorOptions}
                              value={data.upc_codes ?? []}
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
                    <Button className=" w-full">
                      <GitPullRequestArrow className="mr-2" /> Edit Inventory
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
}
