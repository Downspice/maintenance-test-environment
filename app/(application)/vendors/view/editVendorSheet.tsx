"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { categoryOptions } from "@/lib/equipment-schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vendorTypeOptions } from "@/lib/option-list";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import CustomFieldsWrapper from "@/components/forms/wrappers/CustomFieldsWrapper";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetLocations,
  useGetPurchaseOrderTerms,
  useGetStatusOnes,
  useGetVendorTypes,
  useUpdateVendor,
} from "@/services/setups/vendor";
import {
  VendorFormValues,
  vendorSchema,
} from "@/components/forms/actualForms/new-vendor-form";
import { VendorTableInterface } from "@/lib/vendor-data";

export default function EditVendor({
  children,
  data,
}: {
  children: React.ReactNode;
  data: VendorTableInterface;
}) {
  const [open, setOpen] = useState(false);
  const {
    data: termsOptionsList,
    isLoading: termsOptionsListLoading,
    error: termsOptionsListError,
  } = useGetPurchaseOrderTerms<Array<{ id: string; name: string }>>();
  const {
    data: statusOptions,
    isLoading: statusOptionsLoading,
    error: statusOptionsError,
  } = useGetStatusOnes<Array<{ id: string; name: string }>>();
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

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      ...data,
      term_id: data.term.id,
      phone_one: data.contact.phone_one ?? "",
      phone_two: data.contact.phone_two ?? "",
      fax: data.contact.fax ?? "",
      email: data.contact.email ?? "",
      website: data.contact.website ?? "",
    },
  });
  const { mutateAsync, isPending } = useUpdateVendor();
  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Edited  successfully!");
    const res = await mutateAsync(data);
    toast.success(res?.messagee);
    vendorForm.reset();
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
          <Form {...vendorForm}>
            <form
              onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}
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
                      name="vendorNumber"
                      label="Vendor #"
                      type="text"
                    />

                    <InputWrapper
                      control={vendorForm.control}
                      name="contact"
                      label="Contact"
                      type="text"
                    />

                    <InputWrapper
                      control={vendorForm.control}
                      name="address"
                      label="Address"
                      type="text"
                    />
                    <div className="grid grid-cols-2 gap-1">
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
                      options={locationOptionsList}
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
                      options={termsOptionsList}
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
                      name="others"
                      label="Custom Fields"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="contact">
                  <div className="flex flex-col gap-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="phone_one"
                      label="Phone 1:"
                      type="text"
                      required
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="phone_two"
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
