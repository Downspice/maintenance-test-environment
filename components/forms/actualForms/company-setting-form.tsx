"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Plus } from "lucide-react";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import {
  categoryOptions,
  countryOptions,
  statusOptions,
} from "@/lib/equipment-schema";
import SelectWrapper from "../wrappers/SelectWrapper";
import SwitchWrapper from "../wrappers/SwitchWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { monthOptionList, vendorTypeOptions } from "@/lib/option-list";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import SingleCheckboxWrapper from "../wrappers/SingleCheckboxWrapper";
import CheckboxWrapper from "../wrappers/CheckboxWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function CompanySettings() {
  const [customFields, setCustomFields] = useState<
    { name: string; value: string }[]
  >([]);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  return (
    <div>
      <Form {...vendorForm}>
        <form onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}>
          <Tabs defaultValue="Program Setting" className="w-full">
            <TabsList>
              <TabsTrigger value="Company Info">Company Info</TabsTrigger>
              <TabsTrigger value="Program Setting">Program Setting</TabsTrigger>
              <TabsTrigger value="Backups">Backups</TabsTrigger>
            </TabsList>
            <TabsContent value="Company Info">
              <div className="flex flex-col gap-1">
                <InputWrapper
                  control={vendorForm.control}
                  name="name"
                  label="Company"
                  type="text"
                  required
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="address1"
                  label="Address 1"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="address2"
                  label="Address 2"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="city"
                  label="City"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="state"
                  label="State"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="zip"
                  label="Zip"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="phone"
                  label="Phone"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="fax"
                  label="Fax"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="website"
                  label="Website"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="email"
                  label="Email"
                  type="email"
                  value={undefined}
                />
                <ComboboxFieldWrapper
                  control={vendorForm.control}
                  name="fiscal"
                  label="Fiscal"
                  options={monthOptionList}
                />
                <TextareaWrapper
                  control={vendorForm.control}
                  name="notes"
                  label="Notes"
                  rows={4}
                  value={undefined}
                />
              </div>
            </TabsContent>
            <TabsContent value="Program Setting">
              <div className="flex flex-col gap-1">
                <Fieldset
                  legend="WO Numbering"
                  content={
                    <>
                      <InputWrapper
                        control={vendorForm.control}
                        name="startingValue"
                        label="Starting Value"
                        type="number"
                        value={undefined}
                      />
                    </>
                  }
                />

                <Fieldset
                  legend="PO Numbering"
                  content={
                    <>
                      <InputWrapper
                        control={vendorForm.control}
                        name="startingValuePO"
                        label="Starting Value"
                        type="number"
                        value={undefined}
                      />
                    </>
                  }
                />

                <Fieldset
                  legend="Invoice Number"
                  content={
                    <>
                      <InputWrapper
                        control={vendorForm.control}
                        name="startingValueInvoice"
                        label="Starting Value"
                        type="number"
                        value={undefined}
                      />
                    </>
                  }
                />
                <Fieldset
                  legend="Repairs"
                  content={
                    <>
                      <InputWrapper
                        control={vendorForm.control}
                        name="repairsNotifydays"
                        label="Advance Notify Days"
                        type="number"
                        value={undefined}
                      />
                    </>
                  }
                />
                <Fieldset
                  legend="Linked Services"
                  content={
                    <>
                      <SingleCheckboxWrapper
                        control={vendorForm.control}
                        name="pushOrPull"
                        label="Push/Pull linked service intervals"
                      />
                    </>
                  }
                />

                <Fieldset
                  legend="Inspections"
                  content={
                    <>
                      <CheckboxWrapper
                        control={vendorForm.control}
                        name="pushOrPull"
                        label=" "
                        options={[
                          { id: "Hide", label: "Hide 'All OK'Option" },
                          {
                            id: "warn",
                            label:
                              "Warn user of inccompleted steps before saving",
                          },
                        ]}
                      />
                    </>
                  }
                />
                <Fieldset
                  legend="Inspections"
                  content={
                    <div className="grid grid-cols-2 gap-x-2">
                      <div className="col-span-1 flex flex-col">
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="poudf1"
                          label="PO UDF 1"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="poudf2"
                          label="PO UDF 2"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoices1"
                          label="Invoices UDF 1"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoicesTAX1"
                          label=" Invoices UDF 2"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax1"
                          label="WO UDF 1"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax1"
                          label="WO UDF 2"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="parts1"
                          label="PARTS UDF 1"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="parts2"
                          label="PARTS UDF 2"
                          type="text"
                          value={undefined}
                        />
                      </div>
                      <div className="col-span-1 flex flex-col">
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax1"
                          label="PO TAX 1 Name"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax2"
                          label="PO TAX 2 Name"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoicesTAX2"
                          label="Invoices Tax 1"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoices2"
                          label="Invoices Tax 2"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="woTaxName1"
                          label="WO TAX Name 1"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="woTaxName1"
                          label="WO TAX Name 2"
                          type="text"
                          value={undefined}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="woCost"
                          label="WO UDF Cost"
                          type="number"
                          value={undefined}
                        />
                      </div>
                    </div>
                  }
                />
              </div>
            </TabsContent>
            <TabsContent value="Backups">
              BAck ups
            </TabsContent>
          </Tabs>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
