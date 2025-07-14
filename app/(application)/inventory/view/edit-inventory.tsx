"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { categoryOptions, vendorOptions } from "@/lib/equipment-schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  equipmentManufacturerOptions,
  unitOptions,
  inventoryMovement,
  markupTypeOptions,
  partOptions,
} from "@/lib/inventory-data";
import Fieldset from "@/components/customUI/fieldset";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import PartSubstitutionTable from "@/app/(application)/inventory/component/inventory.partSubstitutionTable";
import AlternateUpcCodesTable from "@/app/(application)/inventory/component/inventory.alternateUpcCodesTable";
import {
  InventoryInterface,
  InventorySchema,
} from "@/lib/Inventory/inventory-data";
import { useState } from "react";
import WarehouseTabs from "@/app/(application)/inventory/component/inventory.warehouse";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import CustomFieldsWrapper from "@/components/forms/wrappers/CustomFieldsWrapper";
import { costCenterOptions } from "@/components/forms/actualForms/work-order-form";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";

export default function EditInventory({
  children,
  data,
}: {
  children: React.ReactNode;
  data: InventoryInterface;
}) {
  const [open, setOpen] = useState(false);
  const inventoryForm = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: { ...data, warehouses: data?.warehouses || [] },
  });
  const enableTrackingWatch = inventoryForm.watch("enableTracking");
  const partSubs = inventoryForm.watch("partSubstitutions") || [];
  const warehouseTabs =
    inventoryForm.watch("warehouses")?.map((w) => w.warehouse) || [];
  const [warehouses, setWarehouses] = useState<string[]>(warehouseTabs);

  async function handleSubmit(data: z.infer<typeof InventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("inventory  submitted successfully!");
  }
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
                            name="unitCost"
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
                        { label: "Warehouse A", value: "warehouseA" },
                        { label: "Warehouse B", value: "warehouseB" },
                        { label: "Warehouse C", value: "warehouseC" },
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
                            value={partSubs}
                            onChange={(rows) =>
                              inventoryForm.setValue("partSubstitutions", rows)
                            }
                          />
                        </TabsContent>
                        <TabsContent value="Alternate UPC Codes">
                          {/* A table that has button to add a new row and the headers are manufacturer, vendor, upc .When a new row is added the manufacturer and vendor becomes a select , and the ups becomes an input fields. */}
                          <AlternateUpcCodesTable
                            manufacturers={equipmentManufacturerOptions}
                            vendors={vendorOptions}
                            value={
                              inventoryForm.watch("alternateUpcCodes") || []
                            }
                            onChange={(val) =>
                              inventoryForm.setValue("alternateUpcCodes", val)
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
                    <GitPullRequestArrow className="mr-2" /> Create Inspection
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
