"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import TextareaWrapper from "../fields/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../fields/InputWrapper";
import { ChoiceListComboboxField } from "../fields/ChoiceListComboboxWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomFieldsWrapper from "../fields/CustomFieldsWrapper";
import FileUploadWrapper from "../fields/FileUploadWrapper";
import { useAddVendor } from "@/services/setups/vendor";

export type VendorFormInput = z.input<typeof vendorSchema>;
export type VendorFormValues = z.output<typeof vendorSchema>;

// Define the form schema with Zod
export const vendorSchema = z.object({
  // General Tab
  id: z.string().optional(),

  name: z.string().min(1, { message: "Vendor name is required" }),
  vendor_number: z.string().min(1, { message: "Vendor number is required" }),
  contact: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(1, { message: "Vendor number is required" }),
  postal_code: z.string().min(1, { message: "Vendor number is required" }),
  country: z.string().optional(),

  location_id: z.string().min(1, { message: "Location is required" }),
  status_id: z.string().min(1, { message: "Status is required" }),
  type_id: z.string().min(1, { message: "Vendor type is required" }),
  term_id: z.string().min(1, { message: "Payment term is required" }),

  billing_rate: z.coerce
    .number({ error: "Billing rate must be a number" })
    .optional(),

  notes: z.coerce.string().optional(),

  others: z.any().optional(), // Can refine later

  // Contact Tab
  phone_one: z
    .string()
    .min(1, { message: "Primary phone number is required" })
    .optional(),
  phone_two: z.string().optional(),
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

interface NewVendorProps {
  formId?: string;
  hideSubmitButton?: boolean;
}

export default function NewVendor({
  formId = "new-vendor-form",
  hideSubmitButton,
}: NewVendorProps = {}) {
  const [customFields, setCustomFields] = useState<
    { name: string; id: string }[]
  >([]);

  const vendorForm = useForm<VendorFormInput, unknown, VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
    },
  });
  const formControl = vendorForm.control as Control<any>;

  const { mutateAsync, isPending } = useAddVendor();

  // 3. Define the mutation handler that receives validated data
  const handleSubmit = async (data: VendorFormValues) => {
    console.log("Submitting data:", data);

    // try {
    // 4. AWAIT the mutateAsync call, passing the validated 'data' object
    const res = (await mutateAsync(data)) as { message?: string };
    toast.success(res?.message ?? "Vendor created.");
    vendorForm.reset(); // Reset form state on success

    // In a real application, you would likely close the sheet/modal here

    // } catch (error: any) {
    //   // 6. Handle error and feedback using the try/catch block
    //   console.error("Mutation failed:", error);
    //   const errorMessage = error?.response?.data?.message || 'Failed to create vendor.';
    //   toast.error(errorMessage);
    // }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", id: "" }]);
  };

  return (
    <div>
      <Form {...vendorForm}>
        <form
          id={formId}
          onSubmit={vendorForm.handleSubmit(handleSubmit, (errors) => {
            const firstErrorField = Object.values(errors)[0];
            const message =
              firstErrorField &&
              typeof firstErrorField === "object" &&
              "message" in firstErrorField
                ? String(firstErrorField.message)
                : undefined;

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
                  control={formControl}
                  name="name"
                  label="Name"
                  type="text"
                  required
                />
                <InputWrapper
                  control={formControl}
                  required
                  name="vendor_number"
                  label="Vendor #"
                  type="text"
                />

                <InputWrapper
                  control={formControl}
                  name="contact"
                  label="Contact"
                  type="text"
                />

                <InputWrapper
                  control={formControl}
                  name="address"
                  label="Address"
                  type="text"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <InputWrapper
                      control={formControl}
                      name="city"
                      label="City"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={formControl}
                      required
                      name="state"
                      label="State /Province"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={formControl}
                      name="postal_code"
                      label="Postal Code"
                      type="text"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={formControl}
                      name="country"
                      label="Country"
                      type="text"
                    />
                  </div>
                  <div className="col-span-1"></div>
                </div>
                <ChoiceListComboboxField
                  control={formControl}
                  name="location_id"
                  label="Location"
                  choiceList="locations"
                  required
                />

                <ChoiceListComboboxField
                  control={formControl}
                  name="status_id"
                  label="Status"
                  choiceList="statusOnes"
                  required
                />

                <ChoiceListComboboxField
                  control={formControl}
                  name="type_id"
                  label="Type"
                  choiceList="vendorTypes"
                  required
                />
                <ChoiceListComboboxField
                  control={formControl}
                  name="term_id"
                  label="Term"
                  choiceList="purchaseOrders:terms"
                  required
                />
                <InputWrapper
                  control={formControl}
                  name="billing_rate"
                  label="Billing Rate"
                  type="number"
                />
                <div className="flex flex-col gap-4">
                  <TextareaWrapper
                    control={formControl}
                    name="notes"
                    label="Notes"
                    rows={4}
                  />
                </div>
                <CustomFieldsWrapper
                  control={formControl}
                  name="others"
                  label="Custom Fields"
                />
              </div>
            </TabsContent>
            <TabsContent value="contact">
              <div className="flex flex-col gap-1">
                <InputWrapper
                  control={formControl}
                  name="phone_one"
                  label="Phone 1:"
                  type="text"
                  required
                />
                <InputWrapper
                  control={formControl}
                  name="phone_two"
                  label="Phone 2:"
                  type="text"
                />
                <InputWrapper
                  control={formControl}
                  name="fax"
                  label="Fax:"
                  type="text"
                />
                <InputWrapper
                  control={formControl}
                  name="email"
                  label="Email:"
                  type="text"
                />
                <InputWrapper
                  control={formControl}
                  name="website"
                  label="Website:"
                  type="text"
                />
              </div>
            </TabsContent>
            <TabsContent value="attachment">
              <FileUploadWrapper
                multiple={true}
                control={formControl}
                name={"Attachments"}
                label={"Attachments"}
              />
            </TabsContent>
          </Tabs>

          {!hideSubmitButton && (
            <div className="flex justify-between gap-x-4 my-8 w-full">
              <Button className=" w-full" disabled={isPending}>
                <GitPullRequestArrow className="mr-2" /> Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
