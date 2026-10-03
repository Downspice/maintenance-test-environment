"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import TextareaWrapper from "../fields/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../fields/InputWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { monthOptionList } from "@/lib/shared/option-list";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import SingleCheckboxWrapper from "../fields/SingleCheckboxWrapper";
import CheckboxWrapper from "../fields/CheckboxWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function CompanySettings({
  formId = "company-settings-form",
  hideSubmitButton,
  onSuccess,
}: {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
}) {
  const [customFields, setCustomFields] = useState<
    { name: string; id: string }[]
  >([]);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Settings saved successfully!");
    onSuccess?.();
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", id: "" }]);
  };

  return (
    <div>
      <Form {...vendorForm}>
        <form id={formId} onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}>
          <Tabs defaultValue="Company Info" className="w-full">
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
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="address1"
                  label="Address 1"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="address2"
                  label="Address 2"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="city"
                  label="City"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="state"
                  label="State"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="zip"
                  label="Zip"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="phone"
                  label="Phone"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="fax"
                  label="Fax"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="website"
                  label="Website"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="email"
                  label="Email"
                  type="email"
                  value={""}
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
                  value={""}
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
                        value={""}
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
                        value={""}
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
                        value={""}
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
                        value={""}
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
                        name="pushOrPullInspections"
                        label=" "
                        options={[
                          { id: "Hide", name: "Hide 'All OK'Option" },
                          {
                            id: "warn",
                            name:
                              "Warn user of incomplete steps before saving",
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
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="poudf2"
                          label="PO UDF 2"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoices1"
                          label="Invoices UDF 1"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoicesTAX1"
                          label=" Invoices UDF 2"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax1"
                          label="WO UDF 1"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax1"
                          label="WO UDF 2"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="parts1"
                          label="PARTS UDF 1"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="parts2"
                          label="PARTS UDF 2"
                          type="text"
                          value={""}
                        />
                      </div>
                      <div className="col-span-1 flex flex-col">
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax1"
                          label="PO TAX 1 Name"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="tax2"
                          label="PO TAX 2 Name"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoicesTAX2"
                          label="Invoices Tax 1"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="invoices2"
                          label="Invoices Tax 2"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="woTaxName1"
                          label="WO TAX Name 1"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="woTaxName1"
                          label="WO TAX Name 2"
                          type="text"
                          value={""}
                        />
                        <InputWrapper
                          className="col-span-1"
                          control={vendorForm.control}
                          name="woCost"
                          label="WO UDF Cost"
                          type="number"
                          value={""}
                        />
                      </div>
                    </div>
                  }
                />
              </div>
            </TabsContent>
            <TabsContent value="Backups">
              Not Applicable as it is a web application
            </TabsContent>
          </Tabs>

          {!hideSubmitButton && (
            <div className="flex justify-between gap-x-4 my-8 w-full">
              <Button className=" w-full">
                <GitPullRequestArrow className="mr-2" /> Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
