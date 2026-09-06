// "use client";

// import { useState } from "react";
// import { RegisterOptions, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { CardContent } from "@/components/ui/card";
// import { Save } from "lucide-react";

// // Form wrappers
// import InputWrapper from "@/components/forms/wrappers/InputWrapper";
// import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
// import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
// import MultiSelectWrapper from "@/components/forms/wrappers/MultiSelectWrapper";
// import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// import CustomFieldsWrapper from "@/components/forms/wrappers/CustomFieldsWrapper";

// // Schema and types
// import {
//   equipmentSchema,
//   type EquipmentFormValues,
//   meterUnitsOptions,
//   assigneeOptions,
// } from "@/lib/equipment-schema";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Fieldset from "@/components/customUI/fieldset";
// import {
//   equipmentCheckboxOptions,
// } from "@/lib/option-list";
// import { toast } from "sonner";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   ComboboxFieldWrapper,
//   ComboboxOption,
// } from "@/components/forms/wrappers/ComboboxWrapper";
// import { Input } from "@/components/ui/input";
// import CheckboxWrapper from "@/components/forms/wrappers/CheckboxWrapper";
// import { useGetInventoryCategories } from "@/services/setups/inventory";
// import { useGetVendors } from "@/services/setups/vendor";
// import { useGetEquipmentColors, useGetEquipmentMakes, useGetEquipmentModels, useGetEquipmentOwnerships, useGetEquipmentStatuses, useGetEquipmentTypes } from "@/services/setups/equipments";

// interface triggerVariant {
//   variant?: "icon" | "default";
// }
// export default function RepairRequestFormButton({ variant }: triggerVariant) {
//   document.body.style.pointerEvents = "auto";
//   const { data: vendorOptions } = useGetVendors();
//   const { data: makeOptionsList } = useGetEquipmentMakes();
//   const { data: carModelOptionsList } = useGetEquipmentModels();
//   const { data: ownershipOptions } = useGetEquipmentOwnerships();
//   const { data: equipmentTypeOptions } = useGetEquipmentTypes();
//   const { data: colorOptions } = useGetEquipmentColors();
//   const { data: statusOptions } = useGetEquipmentStatuses();
    


  
//   const [open, setOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [openSections, setOpenSections] = useState({
//     identification: true,
//     assignment: false,
//     purchase: false,
//     additionalDetails: false,
//   });
//   const { data: categoryOptions } = useGetInventoryCategories();

//   const form = useForm<EquipmentFormValues>({
//     resolver: zodResolver(equipmentSchema),
//     defaultValues: {
//       status: "Active",
//       renewalInterval: 1,
//       primaryMeter: 0,
//       secondaryMeter: 0,
//       purchasePrice: 0,
//       salvagePrice: 0,
//       depreciationLifeMonths: 0,
//       warrantyDescription: "Primary",
//       secondaryWarrantyDescription: "Secondary",
//       mviInterval: 1,
//       ownership: "Owned",
//       fuelVolumeUnits: "Gallons",
//       annualOperatingBudget: 0,
//       hasMeter: false,
//     },
//   });

//   const toggleSection = (section: keyof typeof openSections) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const watchHasMeter = form.watch("hasMeter");
//   const watchStatus = form.watch("status");
//   const watchPrimary = form.watch("primaryMeterUnit");
//   const watchSecondary = form.watch("secondaryMeterUnit");

//   function onSubmit(data: EquipmentFormValues) {
//     console.log("Form submitted with VALUES:", data);

//     const getLabel = (options: ComboboxOption[], id: string) =>
//       options.find((option) => option.value === value)?.label || value;

//     const getLabels = (options: ComboboxOption[], values: string[]) =>
//       values.map(
//         (value) =>
//           options.find((option) => option.value === value)?.label || value
//       );

//     toast("Project created successfully!", {
//       duration: 10000,
//     });

//     setOpen(false);
//     form.reset();
//   }

//   function onError(errors: any) {
//     // Get all error messages
//     const errorMessages = Object.entries(errors).map(
//       ([field, error]: [string, any]) => {
//         const fieldLabels: Record<string, string> = {
//           unit: "Project Name",
//         };

//         return `${fieldLabels[field] || field}: ${error.message}`;
//       }
//     );

//     toast.error("Please fix the following errors:", {
//       description: (
//         <div className="mt-2">
//           <ul className="list-disc list-inside space-y-1 text-sm">
//             {errorMessages.map((message, index) => (
//               <li key={index}>{message}</li>
//             ))}
//           </ul>
//         </div>
//       ),
//       duration: 8000,
//     });
//   }

//   const [isOpen, setIsOpen] = useState(false);
//   const toggleSheet = () => setIsOpen(!isOpen);

//   return (
//     <Sheet open={isOpen} onOpenChange={setIsOpen}>
//       <>
//         <div onClick={toggleSheet}>Repair Request</div>
//       </>
//       <SheetContent className="w-3/4 ">
//         <SheetHeader>
//           <SheetTitle>Create New Repair Request</SheetTitle>
//           <SheetDescription>
//             Fill out the form below to set up your new Repair Request.
//           </SheetDescription>
//         </SheetHeader>

//         <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit, onError)}
//               className="space-y-6"
//             >
//               <div className="flex">
//                 <Tabs
//                   defaultValue="main"
//                   orientation="vertical"
//                   className="w-full"
//                 >
//                   <div className="flex-1">
//                     <TabsContent value="settings" className="space-y-2">
//                       <Fieldset
//                         legend="Track the following details of this equipment"
//                         content={
//                           <CheckboxWrapper
//                             control={form.control}
//                             name={"tracker"}
//                             label={""}
//                             options={equipmentCheckboxOptions}
//                           />
//                         }
//                       />
//                       <Fieldset
//                         legend="Budget"
//                         content={
//                           <div className="grid grid-cols-2 space-x-2">
//                             <div className="col-span-1 space-y-2">
//                               <InputWrapper
//                                 control={form.control}
//                                 name={"budget"}
//                                 label={"Budget"}
//                                 value={""}
//                                 type="number"
//                               />
//                             </div>
//                           </div>
//                         }
//                       />
//                     </TabsContent>
//                     <TabsContent value="notes" className="space-y-2">
//                       <TextareaWrapper
//                         control={form.control}
//                         name="generalNotes"
//                         placeholder={""}
//                         value={""}
//                       />
//                     </TabsContent>
//                     <TabsContent value="main">
//                       <div className="grid grid-cols-2 space-x-2">
//                         <div className="col-span-1 space-y-2">
//                           <Fieldset
//                             legend="Identification"
//                             content={
//                               <>
//                                 <div className="flex flex-col space-y-0.5">
//                                   <InputWrapper
//                                     control={form.control}
//                                     name="name"
//                                     label="Unit #"
//                                     type="text"
//                                     required
//                                     value={""}
//                                   />
//                                   <ComboboxFieldWrapper
//                                     control={form.control}
//                                     name="make"
//                                     label="Make"
//                                     options={makeOptionsList}
//                                   />
//                                   <ComboboxFieldWrapper
//                                     control={form.control}
//                                     name="model"
//                                     label="Model"
//                                     options={carModelOptionsList}
//                                   />
//                                   <InputWrapper
//                                     control={form.control}
//                                     name="serial_number"
//                                     label="Serial #"
//                                     type="text"
//                                     value={""}
//                                   />
//                                   <InputWrapper
//                                     control={form.control}
//                                     name="year"
//                                     label="Year"
//                                     type="number"
//                                     value={""}
//                                   />
//                                   <ComboboxFieldWrapper
//                                     control={form.control}
//                                     name="equipmentType"
//                                     label="Types"
//                                     options={equipmentTypeOptions}
//                                   />
//                                 </div>

//                                 {/* <SingleCheckboxWrapper
//                                   control={form.control}
//                                   name="hasMeter"
//                                   label="Equipment has a meter (e.g. miles, kilometers, or hours)"
//                                 />

//                                 {watchHasMeter && (
//                                   <div className="space-y-4 p-4 border rounded-md bg-muted/30">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                       <SelectWrapper
//                                         control={form.control}
//                                         name="primaryMeterUnits"
//                                         label="Primary Meter"
//                                         options={meterUnitsOptions}
//                                       />
//                                       <InputWrapper
//                                         control={form.control}
//                                         name="primaryMeter"
//                                         label="Current Reading"
//                                         type="number"
//                                         value={""}
//                                       />
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                       <SelectWrapper
//                                         control={form.control}
//                                         name="secondaryMeterUnits"
//                                         label="Secondary Meter"
//                                         options={meterUnitsOptions}
//                                       />
//                                       <InputWrapper
//                                         control={form.control}
//                                         name="secondaryMeter"
//                                         label="Current Reading"
//                                         type="number"
//                                         value={""}
//                                       />
//                                     </div>
//                                   </div>
//                                 )} */}
//                               </>
//                             }
//                           />

//                           <Fieldset
//                             legend="Assignment"
//                             content={
//                               <CardContent className="space-y-4">
//                                 <SelectWrapper
//                                   control={form.control}
//                                   name="status"
//                                   label="Status"
//                                   options={statusOptions}
//                                   required
//                                 />

//                                 {watchStatus === "Sold" && (
//                                   <div className="space-y-4 p-4 border rounded-md bg-muted/30">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                       <DatePickerWrapper
//                                         control={form.control}
//                                         name="soldDate"
//                                         label="Date Sold"
//                                       />
//                                       <InputWrapper
//                                         control={form.control}
//                                         name="soldTo"
//                                         label="Buyer"
//                                         type="text"
//                                         value={""}
//                                       />
//                                     </div>
//                                     <div className="space-y-2">
//                                       <label className="text-sm font-medium">
//                                         Price Sold
//                                       </label>
//                                       <div className="flex items-center gap-2">
//                                         <span className="text-sm">$</span>
//                                         <InputWrapper
//                                           control={form.control}
//                                           name="soldPrice"
//                                           label=""
//                                           type="number"
//                                           value={""}
//                                           className="flex-1"
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}

//                                 <MultiSelectWrapper
//                                   control={form.control}
//                                   name="assigneeIds"
//                                   label="Assignees"
//                                   options={assigneeOptions}
//                                 />

//                                 <SelectWrapper
//                                   control={form.control}
//                                   name="categoryId"
//                                   label="Location / Category"
//                                   options={categoryOptions}
//                                 />

//                                 <InputWrapper
//                                   control={form.control}
//                                   name="parentId"
//                                   label="Parent Equipment"
//                                   type="text"
//                                   placeholder="Enter Equipment Parent"
//                                   value={""}
//                                 />
//                               </CardContent>
//                             }
//                           />
//                         </div>
//                         <div className="col-span-1 space-y-2                                                                                                                                                                                                                                                                                                                                                                            ">
//                           <Fieldset
//                             legend="Meter Configurations"
//                             content={
//                               <>
//                                 <div className="flex justify-between items-center ">
//                                   <span className="text-xl">No schedule</span>
//                                   <Button>Select...</Button>
//                                 </div>
//                                 <div>
//                                   Selecting an existing PM schedule template can
//                                   save data entry time. Or you may add
//                                   individualPM services after equipment is
//                                   saved.
//                                 </div>
//                               </>
//                             }
//                           />
//                           <Fieldset
//                             legend="Meter Configurations"
//                             content={
//                               <>
//                                 <div className="flex">
//                                   <ComboboxFieldWrapper
//                                     label="Primary"
//                                     control={form.control}
//                                     options={meterUnitsOptions}
//                                     name="primaryMeterUnit"
//                                   />

//                                   {watchPrimary && (
//                                     <InputWrapper
//                                       control={form.control}
//                                       name="primary"
//                                       label=""
//                                       type="number"
//                                       placeholder="0"
//                                       value={""}
//                                     />
//                                   )}
//                                 </div>

//                                 <div className="flex">
//                                   {" "}
//                                   <ComboboxFieldWrapper
//                                     label="secondary"
//                                     control={form.control}
//                                     options={meterUnitsOptions}
//                                     name="secondaryMeterUnit"
//                                   />
//                                   {watchSecondary && (
//                                     <InputWrapper
//                                       control={form.control}
//                                       name="secondary"
//                                       label=""
//                                       type="number"
//                                       placeholder="0"
//                                       value={""}
//                                     />
//                                   )}
//                                 </div>
//                               </>
//                             }
//                           />
//                           <Fieldset
//                             legend="Custom Fields"
//                             content={
//                               <>
//                                 <InputWrapper
//                                   control={form.control}
//                                   name="btu"
//                                   label="BTU"
//                                   type="text"
//                                   value={""}
//                                   className="flex-1"
//                                 />
//                                 <InputWrapper
//                                   control={form.control}
//                                   name="inputVolts"
//                                   label="Input Volts"
//                                   type="text"
//                                   value={""}
//                                   className="flex-1"
//                                 />
//                                 <DatePickerWrapper
//                                   control={form.control}
//                                   name="installDate"
//                                   label="Install Date"
//                                 />
//                                 <CustomFieldsWrapper
//                                   control={form.control}
//                                   name="others"
//                                   label={"Custom"}
//                                 />
//                               </>
//                             }
//                           />
//                         </div>
//                       </div>
//                     </TabsContent>
//                     <TabsContent value="specifications" className="space-y-2">
//                       <Fieldset
//                         legend="Physical Attributes"
//                         content={
//                           <div className="grid grid-cols-2">
//                             <div className="col-span-1">
//                               <ComboboxFieldWrapper
//                                 label="Color"
//                                 control={form.control}
//                                 options={colorOptions}
//                                 name="color"
//                               />
//                             </div>
//                             <div className="col-span-1"></div>
//                             <div className="col-span-1">
//                               <InputWrapper
//                                 label="Length"
//                                 control={form.control}
//                                 name="length"
//                                 type="text"
//                                 value={""}
//                               />
//                             </div>
//                             <div className="col-span-1"></div>
//                             <div className="col-span-1">
//                               <InputWrapper
//                                 label="Width"
//                                 control={form.control}
//                                 name="width"
//                                 type="text"
//                                 value={""}
//                               />
//                             </div>
//                             <div className="col-span-1"></div>
//                             <div className="col-span-1">
//                               <InputWrapper
//                                 label="Height"
//                                 control={form.control}
//                                 name="height"
//                                 type="text"
//                                 value={""}
//                               />
//                             </div>
//                             <div className="col-span-1"></div>

//                             <div className="col-span-1">
//                               <InputWrapper
//                                 label="Gross Weight"
//                                 control={form.control}
//                                 name="grossWeight"
//                                 type="number"
//                                 value={"0"}
//                               />
//                             </div>
//                             <div className="col-span-1"></div>
//                           </div>
//                         }
//                       />

//                       <Fieldset
//                         legend="Custom Fields"
//                         content={
//                           <>
//                             <CustomFieldsWrapper
//                               label="customField"
//                               control={form.control}
//                               name={"customSpecifications"}
//                             />
//                           </>
//                         }
//                       />
//                     </TabsContent>
//                     <TabsContent
//                       value="warranty"
//                       className="space-x-2 space-y-2 grid grid-cols-2 "
//                     >
//                       <div className=" col-span-1 gap-4">
//                         <Fieldset
//                           className="col-span-1"
//                           legend="Primary Warranty"
//                           content={
//                             <div className="space-y-2">
//                               <InputWrapper
//                                 control={form.control}
//                                 name="warrantyDescription"
//                                 label="Primary Warranty"
//                                 type="text"
//                                 value={""}
//                               />
//                               <DatePickerWrapper
//                                 control={form.control}
//                                 name="warrantyExpirationDate"
//                                 label="Expiration Date"
//                               />
//                               <InputWrapper
//                                 control={form.control}
//                                 name="primaryWarrantyMeter"
//                                 label="Meter"
//                                 type="number"
//                                 value={""}
//                               />
//                             </div>
//                           }
//                         />
//                       </div>
//                       <div className="col-span-1 gap-4">
//                         <Fieldset
//                           className="col-span-1"
//                           legend="Secondary Warranty"
//                           content={
//                             <div className="space-y-2">
//                               <InputWrapper
//                                 control={form.control}
//                                 name="secondaryWarrantyDescription"
//                                 label="Secondary Warranty"
//                                 type="text"
//                                 value={""}
//                               />
//                               <DatePickerWrapper
//                                 control={form.control}
//                                 name="secondaryWarrantyExpirationDate"
//                                 label="Expiration Date"
//                               />
//                               <InputWrapper
//                                 control={form.control}
//                                 name="secondaryWarrantyMeter"
//                                 label="Meter"
//                                 type="number"
//                                 value={""}
//                               />
//                             </div>
//                           }
//                         />
//                       </div>

//                       <div className="col-span-2 gap-4">
//                         <Fieldset
//                           className="col-span-2"
//                           legend="Custom Fields"
//                           content={
//                             <div className="space-y-2">
//                               <CustomFieldsWrapper
//                                 control={form.control}
//                                 name="CustomSecondary"
//                                 label="Custom Fields "
//                               />
//                             </div>
//                           }
//                         />
//                       </div>
//                     </TabsContent>

//                     <TabsContent
//                       value="purchase"
//                       className="space-x-2 space-y-2 grid grid-cols-2 "
//                     >
//                       <Fieldset
//                         className="col-span-1"
//                         legend="Purchase Details"
//                         content={
//                           <>
//                             <ComboboxFieldWrapper
//                               label="Dealer"
//                               control={form.control}
//                               options={vendorOptions}
//                               name="vendor"
//                             />
//                             <DatePickerWrapper
//                               control={form.control}
//                               name="purchaseDate"
//                               label="Purchase Date"
//                             />
//                             <InputWrapper
//                               control={form.control}
//                               name="meter"
//                               label={"Meter"}
//                               type="number"
//                               value={""}
//                               className=""
//                             />
//                             <InputWrapper
//                               control={form.control}
//                               name="price"
//                               label={"Price"}
//                               type="number"
//                               value={""}
//                               className=""
//                             />
//                             <CustomFieldsWrapper
//                               name="purchaseOrderCustom"
//                               label="Custom Field"
//                               control={form.control}
//                             />

//                             <InputWrapper
//                               control={form.control}
//                               name="note"
//                               label={"Notes"}
//                               type="text"
//                               value={""}
//                               className=""
//                             />
//                           </>
//                         }
//                       />
//                       <Fieldset
//                         className="col-span-1"
//                         legend="Depreciation"
//                         content={
//                           <>
//                             <InputWrapper
//                               control={form.control}
//                               name="depreciationLifeMonths"
//                               label="Term (Months)"
//                               type="number"
//                               value={""}
//                               className="flex-1"
//                             />
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm">$</span>
//                               <InputWrapper
//                                 control={form.control}
//                                 name="startingPrice"
//                                 label="Starting Value"
//                                 type="number"
//                                 value={""}
//                                 className="flex-1"
//                               />
//                             </div>
//                             <div className="flex items-center gap-2 pb-2">
//                               <span className="text-sm">$</span>
//                               <InputWrapper
//                                 control={form.control}
//                                 name="salvagePrice"
//                                 label="Salvage Value"
//                                 type="number"
//                                 value={""}
//                                 className="flex-1"
//                               />
//                             </div>
//                             <div className="border-t flex flex-col">
//                               <div className="space-y-2">
//                                 <label className="text-sm font-medium">
//                                   Depreciation (Monthly)
//                                 </label>
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-sm">$</span>
//                                   <Input
//                                     type="number"
//                                     value={""}
//                                     className="flex-1"
//                                   />
//                                 </div>
//                               </div>
//                               <div className="space-y-2">
//                                 <label className="text-sm font-medium">
//                                   Current Value
//                                 </label>
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-sm">$</span>
//                                   <Input
//                                     type="number"
//                                     value={""}
//                                     className="flex-1"
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         }
//                       />

//                       <div className="col-span-2 space-x-2">
//                         <Fieldset
//                           legend="Ownership/Status"
//                           content={
//                             <div className="grid grid-cols-2 space-x-2">
//                               <div className="col-span-1">
//                                 <ComboboxFieldWrapper
//                                   control={form.control}
//                                   name="ownership"
//                                   label="Ownership"
//                                   options={ownershipOptions}
//                                 />
//                                 <DatePickerWrapper
//                                   control={form.control}
//                                   name="inService"
//                                   label="In service"
//                                 />
//                                 <DatePickerWrapper
//                                   control={form.control}
//                                   name="outService"
//                                   label="Out of Service"
//                                 />
//                               </div>
//                               <div className="col-span-1">
//                                 <DatePickerWrapper
//                                   control={form.control}
//                                   name="transferred"
//                                   label="Transferred Date"
//                                 />
//                                 <DatePickerWrapper
//                                   control={form.control}
//                                   name="soldDate"
//                                   label="Date sold"
//                                 />
//                                 <InputWrapper
//                                   control={form.control}
//                                   name="soldTo"
//                                   label="Sold To"
//                                   type="text"
//                                   value={""}
//                                   className="flex-1"
//                                 />
//                                 <InputWrapper
//                                   control={form.control}
//                                   name="notes"
//                                   label="Notes"
//                                   type="text"
//                                   value={""}
//                                   className="flex-1"
//                                 />
//                               </div>
//                             </div>
//                           }
//                         />
//                       </div>
//                     </TabsContent>
//                   </div>
//                 </Tabs>
//               </div>
//               <div className="flex justify-end">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="min-w-32 my-4 w-full"
//                 >
//                   {isSubmitting ? (
//                     "Creating..."
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       Save
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </ScrollArea>
//       </SheetContent>
//     </Sheet>
//   );
// }
