"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import FormSubheader from "@/components/forms/ui/formSubheader";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { discount_typesOptions } from "@/lib/domains/invoice/invoices-page-data";
import {
  customerSchema,
  CustomerInterface,
  CustomerTableDataInterface,
} from "@/lib/domains/customer/customer-data";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import {
  useGetLocations,
  useGetPurchaseOrderTerms,
  useGetStatusOnes,
  useGetVendorTypes,
} from "@/services/setups/lookups";
import { useUpdateCustomer, useGetCustomer } from "@/services/setups/customer";
import { deepCleanNulls } from "@/lib/shared/utils";
import { useGetInventoryCategories } from "@/services/setups/inventory";
import { useEffect } from "react";
export default function EditCustomer({
  children,
  data,
}: {
  children: React.ReactNode;
  data: CustomerTableDataInterface;
}) {
  const { data: categoryOptions } = useGetInventoryCategories();

  const [open, setOpen] = useState(false);

  // Fetch full customer details by ID
  const { data: customerDetails, isLoading: isLoadingCustomer } =
    useGetCustomer<
      CustomerTableDataInterface & {
        customer_shipping?: any;
        discount_type?: string;
        discount_amount?: string;
      }
    >(data.id, {
      enabled: open && !!data.id,
    } as any);

  const CustomerForm = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {},
  });

  // Update form when customer details are loaded
  useEffect(() => {
    if (customerDetails && open) {
      const formData: any = {
        id: customerDetails.id,
        company_name: customerDetails.company_name || "",
        contact: customerDetails.contact || "",
        address: customerDetails.address || "",
        city: customerDetails.city || "",
        state: customerDetails.state || "",
        postal_code: customerDetails.postal_code || "",
        country: customerDetails.country || "",
        phone_one: customerDetails.phone_one || "",
        phone_two: customerDetails.phone_two || "",
        fax: customerDetails.fax || "",
        website: customerDetails.website || "",
        email: customerDetails.email || "",
        term_id: customerDetails.term?.id || customerDetails.term_id || "",
        term_days: customerDetails.term_days || 0,
        discount_type: customerDetails.discount_type || "",
        discount_percent: customerDetails.discount_percent || "",
        discount_amount: customerDetails.discount_amount || "",
        billing_rate: customerDetails.billing_rate
          ? Number(customerDetails.billing_rate)
          : undefined,
        type_id: customerDetails.type?.id || customerDetails.type_id || "",
        location_id:
          customerDetails.location?.id || customerDetails.location_id || "",
        notes: customerDetails.notes || "",
        // Map shipping data
        shipping: customerDetails.customer_shipping
          ? {
              company_name:
                customerDetails.customer_shipping.company_name || "",
              contact: customerDetails.customer_shipping.contact || "",
              address: customerDetails.customer_shipping.address || "",
              city: customerDetails.customer_shipping.city || "",
              state: customerDetails.customer_shipping.state || "",
              postal_code: customerDetails.customer_shipping.postal_code || "",
              country: customerDetails.customer_shipping.country || "",
              phone_one: customerDetails.customer_shipping.phone_one || "",
              fax: customerDetails.customer_shipping.fax || "",
              email: customerDetails.customer_shipping.email || "",
            }
          : {
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
            },
        // Map is_same from customer_shipping
        is_same: customerDetails.customer_shipping?.is_same || false,
      };

      CustomerForm.reset(deepCleanNulls(formData));
    }
  }, [customerDetails, open]);
  const {
    data: vendorTypeOptions,
    isLoading,
    error: vendorTypesError,
  } = useGetVendorTypes<Array<{ id: string; name: string }>>();

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

  const { mutateAsync, isPending } = useUpdateCustomer();
  async function handleSubmit(formData: z.infer<typeof customerSchema>) {
    console.log(formData);

    // If is_same is true, clear shipping fields
    if (formData.is_same) {
      formData.shipping = {
        ...formData.shipping,
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

    // Here you would typically send the data to your API
    const res = await mutateAsync(
      formData as CustomerInterface & { id: string }
    );
    toast.success((res as any)?.message || "Edited successfully!");
    CustomerForm.reset();
  }

  const watchdiscount_type = CustomerForm.watch("discount_type");
  const watchIsSame = CustomerForm.watch("is_same");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>{data.company_name}</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...CustomerForm}>
              <form
                onSubmit={CustomerForm.handleSubmit((data) =>
                  handleSubmit(data)
                )}
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
                            required
                            label="State /Province"
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
                            type="text"
                            value={""}
                            required
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

                <div className="flex justify-between gap-x-4 my-8 w-full">
                  <Button className=" w-full" disabled={isPending}>
                    <GitPullRequestArrow className="mr-2" /> Save
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
