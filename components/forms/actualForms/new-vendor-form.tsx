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
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import FileUploadWrapper from "../wrappers/FileUploadWrapper";
import { useAddVendor, useGetVendorTypes } from "@/services/setups/vendor";

// Define the form schema with Zod
export const vendorSchema = z.object({
  // General Tab
  name: z.string().min(1, { message: "Vendor name is required" }),
  vendor_number: z.string().optional(),
  contactNumber: z.string().optional(),
  street1: z.string().optional(),
  street2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),

  location_id: z.string().min(1, { message: "Location is required" }),
  status_id: z.string().min(1, { message: "Status is required" }),
  type_id: z.string().min(1, { message: "Vendor type is required" }),
  term_id: z.string().min(1, { message: "Payment term is required" }),

  billing_rate: z
    .union([
      z.number({ invalid_type_error: "Billing rate must be a number" }),
      z.string().regex(/^\d+(\.\d{1,2})?$/, {
        message: "Billing rate must be a valid number (up to 2 decimal places)",
      }),
    ])
    .optional()
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),

  notes: z.string().optional(),

  Custom: z.any().optional(), // Can refine later

  // Contact Tab
  phone_1: z.string().min(1, { message: "Primary phone number is required" }).optional(),
  phone_2: z.string().optional(),
  fax: z.string().optional(),

  email: z
    .string()
    .email({ message: "Email must be a valid address" })
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .url({ message: "Website must be a valid URL (https://...)" })
    .optional()
    .or(z.literal("")),

  // Attachment Tab
  Attachments: z
    .array(z.any()) // Optionally validate file structure
    .optional(),
});

export default function NewVendor() {
   const { 
    mutate, 
    isPending, 
    isError, 
    isSuccess, 
    error 
  } =useAddVendor();

    const { 
    data: vendorTypeOptions, 
    isLoading, 
    error: vendorTypesError
  } = useGetVendorTypes<Array<{ id: string, name: string }>>();


  const [customFields, setCustomFields] = useState<
    { name: string; value: string }[]
  >([]);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    mutate(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  return (
    <div>
      <Form {...vendorForm}>
        <form
          onSubmit={vendorForm.handleSubmit(handleSubmit, (errors) => {
            const firstErrorField = Object.values(errors)[0];
            const message = firstErrorField?.message;

            if (message) {
              toast.error(message);
            } else {
              toast.error("Please check the form for errors.");
            }
          })}
        >
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
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="vendor_number"
                  label="Vendor #"
                  type="text"
                />

                <InputWrapper
                  control={vendorForm.control}
                  name="contactNumber"
                  label="Contact"
                  type="text"
                />

                <InputWrapper
                  control={vendorForm.control}
                  name="street1"
                  label="Address"
                  type="text"
                />

                <InputWrapper
                  className="pt-0"
                  control={vendorForm.control}
                  name="street2"
                  placeholder=" "
                  label=""
                  type="text"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="city"
                      label="City"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="state"
                      label="State /Province"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="postal_code"
                      label="Postal Code"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="country"
                      label="Country"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1"></div>
                </div>
                <SelectWrapper
                  control={vendorForm.control}
                  name="location_id"
                  label="Location "
                  required
                  options={categoryOptions}
                />

                <SelectWrapper
                  control={vendorForm.control}
                  name="status_id"
                  label="Status "
                  required
                  options={statusOptions}
                />

                <SelectWrapper
                  control={vendorForm.control}
                  name="type_id"
                  label="Type "
                  required
                  options={vendorTypeOptions}
                />
                <SelectWrapper
                  control={vendorForm.control}
                  name="term_id"
                  label="Term "
                  required
                  options={vendorTypeOptions}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="billing_rate"
                  label="Billing Rate"
                  type="number"
                />
                <div className="flex flex-col gap-4">
                  <TextareaWrapper
                    control={vendorForm.control}
                    name="notes"
                    label="Notes"
                    rows={4}
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
                  name="phone_1"
                  label="Phone 1:"
                  type="text"
                  required
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="phone_2"
                  label="Phone 2:"
                  type="text"
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="fax"
                  label="Fax:"
                  type="text"
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="email"
                  label="Email:"
                  type="text"
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="website"
                  label="Website:"
                  type="text"
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
