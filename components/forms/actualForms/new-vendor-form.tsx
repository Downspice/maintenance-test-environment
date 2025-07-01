"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import { categoryOptions, statusOptions } from "@/lib/equipment-schema";
import SelectWrapper from "../wrappers/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vendorTypeOptions } from "@/lib/option-list";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import FileUploadWrapper from "../wrappers/FileUploadWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function NewVendor() {
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
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="attachment">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="flex flex-col gap-1">
                <InputWrapper
                  control={vendorForm.control}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="number"
                  label="Vendor #"
                  type="text"
                  value={undefined}
                />

                <InputWrapper
                  control={vendorForm.control}
                  name="contactNumber"
                  label="Contact"
                  type="text"
                  value={undefined}
                />

                <InputWrapper
                  control={vendorForm.control}
                  name="street1"
                  label="Address"
                  type="text"
                  value={undefined}
                />

                <InputWrapper
                  className="pt-0"
                  control={vendorForm.control}
                  name="street2"
                  placeholder=" "
                  label=""
                  type="text"
                  value={undefined}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="city"
                      label="City"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="state"
                      label="State /Province"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="postalCode"
                      label="Postal Code"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="country"
                      label="Country"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1"></div>
                </div>
                <SelectWrapper
                  control={vendorForm.control}
                  name="location"
                  label="Location "
                  required
                  options={categoryOptions}
                />

                <SelectWrapper
                  control={vendorForm.control}
                  name="status"
                  label="Status "
                  required
                  options={statusOptions}
                />

                <SelectWrapper
                  control={vendorForm.control}
                  name="type"
                  label="Type "
                  required
                  options={vendorTypeOptions}
                />
                <SelectWrapper
                  control={vendorForm.control}
                  name="term"
                  label="Term "
                  required
                  options={vendorTypeOptions}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="billingRate"
                  label="Billing Rate"
                  type="number"
                  value={undefined}
                />
                <div className="flex flex-col gap-4">
                  <TextareaWrapper
                    control={vendorForm.control}
                    name="notes"
                    label="Notes"
                    rows={4}
                    value={undefined}
                  />
                </div>
                <CustomFieldsWrapper
                  control={vendorForm.control}
                  name="Custom"
                  label="Custom Fields"
                />
              </div>
            </TabsContent>
            <TabsContent value="contact">
              <div className="flex flex-col gap-1">
                <InputWrapper
                  control={vendorForm.control}
                  name="phone1"
                  label="Phone 1:"
                  type="text"
                  required
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="phone2"
                  label="Phone 2:"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="fax"
                  label="Fax:"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="email"
                  label="Email:"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="website"
                  label="Website:"
                  type="text"
                  value={undefined}
                />
              </div>
            </TabsContent>
            <TabsContent value="attachment">
              <FileUploadWrapper
                multiple={true}
                control={vendorForm.control}
                name={"Attachments"}
                label={"Attachments"}
              />
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
