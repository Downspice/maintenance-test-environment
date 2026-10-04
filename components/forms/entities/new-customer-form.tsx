"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import TextareaWrapper from "../fields/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../fields/InputWrapper";
import SelectWrapper from "../fields/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadWrapper from "../fields/FileUploadWrapper";
import FormSubheader from "../ui/formSubheader";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";
import {
  customerSchema,
  CustomerInterface,
} from "@/lib/domains/customer/customer-data";
import {
  useGetLocations,
  useGetPurchaseOrderTerms,
  useGetStatusOnes,
  useGetVendorTypes,
} from "@/services/setups/lookups";
import {
  useAddCustomer,
  useGetCustomerDiscounts,
} from "@/services/setups/customer";
import SingleCheckboxWrapper from "../fields/SingleCheckboxWrapper";

export default function NewCustomer({
  formId = "new-customer-form",
  hideSubmitButton,
}: {
  formId?: string;
  hideSubmitButton?: boolean;
} = {}) {
  const {
    data: vendorTypeOptions,
    isLoading,
    error: vendorTypesError,
  } = useGetVendorTypes<Array<{ id: string; name: string }>>();
  const {
    data: discount_typesOptions,
    isLoading: discount_typesOptionsLoading,
    error: discount_typesOptionsError,
  } = useGetCustomerDiscounts<Array<{ id: string; name: string }>>();
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();
  const {
    data: statusOptions,
    isLoading: statusOptionsLoading,
    error: statusOptionsError,
  } = useGetStatusOnes<Array<{ id: string; name: string }>>();
  const {
    data: termsOptionsList,
    isLoading: termsOptionsListLoading,
    error: termsOptionsListError,
  } = useGetPurchaseOrderTerms<Array<{ id: string; name: string }>>();
  const CustomerForm = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {},
  });

  const watchdiscount_type = CustomerForm.watch("discount_type");
  const watchIsSame = CustomerForm.watch("is_same");

  const { mutateAsync, isPending } = useAddCustomer();

  // 3. Define the mutation handler that receives validated data
  const handleSubmit = async (data: CustomerInterface) => {
    console.log("Submitting data:", data);

    // If is_same is true, clear shipping fields
    if (data.is_same) {
      data.shipping = {
        ...data.shipping,
        company_name: "",
        contact: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone_one: "",
        fax: "",
        email: "",
      };
    }

    // try {
    // 4. AWAIT the mutateAsync call, passing the validated 'data' object
    const res = await mutateAsync(data);

    // 5. Handle success and feedback
    // Assuming 'res' contains a success message or the created object
    toast.success(res?.messagee);
    CustomerForm.reset(); // Reset form state on success

    // In a real application, you would likely close the sheet/modal here

    // } catch (error: any) {
    //   // 6. Handle error and feedback using the try/catch block
    //   console.error("Mutation failed:", error);
    //   const errorMessage = error?.response?.data?.message || 'Failed to create vendor.';
    //   toast.error(errorMessage);
    // }
  };

  return (
    <div>
      <Form {...CustomerForm}>
        <form
          id={formId}
          onSubmit={CustomerForm.handleSubmit(handleSubmit, (errors) => {
            const firstErrorField = Object.values(errors)[0];
            const message = firstErrorField?.message;

            if (message) {
              toast.error(message);
            } else {
              toast.error("Please check the form for errors.");
            }
          })}
        >
          <Tabs defaultValue="Billing" className="w-full">
            <TabsList>
              <TabsTrigger value="Billing">Billing</TabsTrigger>
              <TabsTrigger value="Shipping">Shipping</TabsTrigger>
              <TabsTrigger value="Attachments">Attachments</TabsTrigger>
              <TabsTrigger value="Notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="Billing">
              <div className="flex flex-col gap-1">
                <FormSubheader header="Name/Address" />
                <InputWrapper
                  control={CustomerForm.control}
                  name="company_name"
                  label="Company"
                  type="text"
                  required
                  value={""}
                />
                <InputWrapper
                  control={CustomerForm.control}
                  name="contact"
                  label="Contact"
                  type="text"
                  value={""}
                />

                <InputWrapper
                  control={CustomerForm.control}
                  name="address"
                  label="Address"
                  type="text"
                  value={""}
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="city"
                      label="City"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="state"
                      label="State /Province"
                      required
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="postal_code"
                      label="Postal Code"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="country"
                      label="Country"
                      type="text"
                      value={""}
                    />
                  </div>
                </div>
                <FormSubheader header="Contact" />
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="phone_one"
                      label="Phone 1"
                      type="text"
                      required
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="phone_two"
                      label="Phone 2"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="fax"
                      label="Fax:"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="website"
                      label="website"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-2">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="email"
                      label="Email:"
                      type="text"
                      value={""}
                    />{" "}
                  </div>
                </div>

                <FormSubheader header="Payment" />
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    <SelectWrapper
                      control={CustomerForm.control}
                      name="term_id"
                      label="Term "
                      required
                      options={termsOptionsList ?? []}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="term_days"
                      label="Term Days"
                      type="number"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <ComboboxFieldWrapper
                      control={CustomerForm.control}
                      name="discount_type"
                      label="Discount Type"
                      options={discount_typesOptions ?? []}
                    />
                    {watchdiscount_type ===
                      "1fcd0622-ebfa-477a-ba12-21cfcb070a62" && (
                        <InputWrapper
                          control={CustomerForm.control}
                          name={"discount_percent"}
                          label={"Discount"}
                          value={""}
                          type="text"
                        />
                      )}
                    {watchdiscount_type ===
                      "af4850a7-a669-4898-9adc-83a7c27132b9" && (
                        <InputWrapper
                          control={CustomerForm.control}
                          name={"discount_amount"}
                          label={"Discount"}
                          value={""}
                          type="text"
                        />
                      )}
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="billing_rate"
                      label="Billing Rate"
                      type="number"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={CustomerForm.control}
                      name="type_id"
                      label="Type "
                      required
                      options={vendorTypeOptions ?? []}
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={CustomerForm.control}
                      name="location_id"
                      label="Location "
                      required
                      options={locationOptionsList ?? []}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Shipping">
              <div className="flex flex-col gap-1">
                <SingleCheckboxWrapper
                  control={CustomerForm.control}
                  name="is_same"
                  label="Same as billing"
                />
                <FormSubheader header="Name/Address" />

                <InputWrapper
                  control={CustomerForm.control}
                  name="shipping.company_name"
                  label="Name"
                  type="text"
                  required={!watchIsSame}
                  value={""}
                  disabled={watchIsSame}
                />

                <InputWrapper
                  control={CustomerForm.control}
                  name="shipping.contact"
                  label="Contact"
                  type="text"
                  required={!watchIsSame}
                  value={""}
                  disabled={watchIsSame}
                />

                <InputWrapper
                  control={CustomerForm.control}
                  name="shipping.address"
                  label="Address"
                  type="text"
                  value={""}
                  disabled={watchIsSame}
                />
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.phone_one"
                      label="Phone"
                      type="text"
                      required={!watchIsSame}
                      value={""}
                      disabled={watchIsSame}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.fax"
                      label="Fax:"
                      type="text"
                      value={""}
                      disabled={watchIsSame}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.email"
                      label="Email:"
                      type="text"
                      value={""}
                      disabled={watchIsSame}
                    />{" "}
                  </div>
                  <div className="col-span-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.city"
                      label="City"
                      type="text"
                      value={""}
                      disabled={watchIsSame}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.state"
                      label="State /Province"
                      required
                      type="text"
                      value={""}
                      disabled={watchIsSame}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.postal_code"
                      label="Postal Code"
                      type="text"
                      value={""}
                      disabled={watchIsSame}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={CustomerForm.control}
                      name="shipping.country"
                      label="Country"
                      type="text"
                      value={""}
                      disabled={watchIsSame}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Notes">
              <TextareaWrapper
                control={CustomerForm.control}
                name="notes"
                label="Notes"
                rows={4}
                value={""}
              />
            </TabsContent>

            <TabsContent value="Attachments">
              <FileUploadWrapper
                multiple={true}
                control={CustomerForm.control}
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
