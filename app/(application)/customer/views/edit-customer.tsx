"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { categoryOptions } from "@/lib/equipment-schema";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  vendorTypeOptions } from "@/lib/option-list";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";
import FormSubheader from "@/components/forms/ui/formSubheader";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { discount_typesOptions } from "@/lib/Invoice/invoices-page-data";
import {
  customerSchema,
  CustomerInterface,
} from "@/lib/Customer/customer-data";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { useGetLocations, useGetStatusOnes } from "@/services/setups/vendor";

export default function EditCustomer({
  children,
  data,
}: {
  children: React.ReactNode;
  data: CustomerInterface;
}) {
  const [open, setOpen] = useState(false);
  const CustomerForm = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: { ...data },
  });

    const {
      data: locationOptionsList,
      isLoading: locationOptionsListLoading,
      error: locationOptionsListError,
    } = useGetLocations<Array<{ id: string; name: string }>>();
  const { 
    data: statusOptions, 
    isLoading:statusOptionsLoading, 
    error: statusOptionsError
  } = useGetStatusOnes<Array<{ id: string, name: string }>>();
  
  async function handleSubmit(data: CustomerInterface) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Work Order submitted successfully!");
  }

  const watchdiscount_type = CustomerForm.watch("discount_type");

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
                        name="name"
                        label="Name"
                        type="text"
                        required
                        value={""}
                      />
                      <InputWrapper
                        control={CustomerForm.control}
                        name="number"
                        label="Vendor #"
                        type="text"
                        value={""}
                      />
                      <InputWrapper
                        control={CustomerForm.control}
                        name="ShippingNumber"
                        label="Shipping"
                        type="text"
                        value={""}
                      />
                      <InputWrapper
                        control={CustomerForm.control}
                        name="street1"
                        label="Address"
                        type="text"
                        value={""}
                      />

                      <InputWrapper
                        className="pt-0"
                        control={CustomerForm.control}
                        name="street2"
                        placeholder=" "
                        label=""
                        type="text"
                        value={""}
                      />
                      <div className="grid grid-cols-2 gap-4">
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
                        <div className="col-span-1"></div>
                      </div>
                      <SelectWrapper
                        control={CustomerForm.control}
                        name="location_id"
                        label="Location"
                        required
                        options={locationOptionsList??[]}
                      />

                      <SelectWrapper
                        control={CustomerForm.control}
                        name="status"
                        label="Status "
                        required
                        options={statusOptions??[]}
                      />

                      <SelectWrapper
                        control={CustomerForm.control}
                        name="type_id"
                        label="Type "
                        required
                        options={vendorTypeOptions}
                      />
                      <FormSubheader header="Contact" />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="col-span-1">
                          <InputWrapper
                            control={CustomerForm.control}
                            name="phone_one"
                            label="Phone 1:"
                            type="text"
                            required
                            value={""}
                          />
                        </div>
                        <div className="col-span-1">
                          <InputWrapper
                            control={CustomerForm.control}
                            name="phone_two"
                            label="Phone 2:"
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
                            name="term"
                            label="Term "
                            required
                            options={vendorTypeOptions}
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
                            options={discount_typesOptions}
                          />
                          {watchdiscount_type === "percent" && (
                            <InputWrapper
                              control={CustomerForm.control}
                              name={"discount_percent"}
                              label={"Discount"}
                              value={""}
                              type="text"
                            />
                          )}
                          {watchdiscount_type === "amount" && (
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
                            options={vendorTypeOptions}
                          />
                        </div>
                        <div className="col-span-1">
                          <SelectWrapper
                            control={CustomerForm.control}
                            name="location_id"
                            label="Location "
                            required
                            options={locationOptionsList}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="Shipping">
                    <div className="flex flex-col gap-1">
                      <FormSubheader header="Name/Address" />

                      <InputWrapper
                        control={CustomerForm.control}
                        name="name"
                        label="Name"
                        type="text"
                        required
                        value={""}
                      />

                      <InputWrapper
                        control={CustomerForm.control}
                        name="contact"
                        label="Contact"
                        type="text"
                        required
                        value={""}
                      />

                      <InputWrapper
                        control={CustomerForm.control}
                        name="street1"
                        label="Address"
                        type="text"
                        value={""}
                      />

                      <InputWrapper
                        className="pt-0"
                        control={CustomerForm.control}
                        name="street2"
                        placeholder=" "
                        label=""
                        type="text"
                        value={""}
                      />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="col-span-1">
                          <InputWrapper
                            control={CustomerForm.control}
                            name="phone_one"
                            label="Phone"
                            type="text"
                            required
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
                            name="email"
                            label="Email:"
                            type="text"
                            value={""}
                          />{" "}
                        </div>
                        <div className="col-span-1"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
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
                        <div className="col-span-1"></div>
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
                  <Button className=" w-full">
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
