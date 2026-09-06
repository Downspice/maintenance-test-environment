"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import { ChoiceListComboboxField } from "@/components/forms/fields/ChoiceListComboboxWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import CustomFieldsWrapper from "@/components/forms/fields/CustomFieldsWrapper";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetVendor,
  useUpdateVendor,
} from "@/services/setups/vendor";
import {
  vendorSchema,
} from "@/components/forms/entities/new-vendor-form";
import { VendorTableInterface } from "@/lib/domains/vendor/vendor-data";
import { deepCleanNulls } from "@/lib/shared/utils";

export default function EditVendor({
  children,
  data: initialData,
}: {
  children: React.ReactNode;
  data: VendorTableInterface;
}) {
  const [open, setOpen] = useState(false);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });
  const { data: vendorDetails } = useGetVendor<any>(initialData.id, {
    enabled: open && !!initialData.id,
  });

  useEffect(() => {
    if (!open || !vendorDetails) {
      return;
    }

    const formData: Partial<z.infer<typeof vendorSchema>> = {
      id: vendorDetails.id ?? initialData.id,
      name: vendorDetails.name ?? "",
      vendor_number: vendorDetails.vendor_number ?? "",
      contact: vendorDetails.contact ?? "",
      address: vendorDetails.address ?? "",
      city: vendorDetails.city ?? "",
      state: vendorDetails.state ?? "",
      postal_code: vendorDetails.postal_code ?? "",
      country: vendorDetails.country ?? "",
      location_id:
        vendorDetails.location?.id ??
        vendorDetails.location_id ??
        initialData.location?.id ??
        initialData.location_id ??
        "",
      status_id:
        vendorDetails.status?.id ??
        vendorDetails.status_id ??
        initialData.status?.id ??
        initialData.status_id ??
        "",
      type_id:
        vendorDetails.type?.id ??
        vendorDetails.type_id ??
        initialData.type?.id ??
        initialData.type_id ??
        "",
      term_id:
        vendorDetails.term?.id ??
        vendorDetails.term_id ??
        initialData.term?.id ??
        initialData.term_id ??
        "",
      billing_rate:
        vendorDetails.billing_rate != null
          ? String(vendorDetails.billing_rate)
          : initialData.billing_rate ?? "",
      notes: vendorDetails.notes ?? initialData.notes ?? "",
      others: vendorDetails.others ?? (initialData as any).others ?? {},
      phone_one:
        vendorDetails.vendor_contact?.phone_one ??
        initialData.vendor_contact?.phone_one ??
        "",
      phone_two:
        vendorDetails.vendor_contact?.phone_two ??
        initialData.vendor_contact?.phone_two ??
        "",
      fax:
        vendorDetails.vendor_contact?.fax ?? initialData.vendor_contact?.fax ?? "",
      email:
        vendorDetails.vendor_contact?.email ??
        initialData.vendor_contact?.email ??
        "",
      website:
        vendorDetails.vendor_contact?.website ??
        initialData.vendor_contact?.website ??
        "",
      Attachments: vendorDetails.attachments ?? [],
    };

    vendorForm.reset(deepCleanNulls(formData));
  }, [vendorDetails, open, initialData, vendorForm]);
  const { mutateAsync, isPending } = useUpdateVendor();
  async function handleSubmit(formData: z.infer<typeof vendorSchema>) {
    try {
      const payload = {
        ...formData,
        id: formData.id ?? vendorDetails?.id ?? initialData.id,
      };
      const res = await mutateAsync(payload);
      toast.success((res as any)?.message ?? "Edited successfully!");
      vendorForm.reset();
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "Failed to update vendor.";
      toast.error(errorMessage);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>{initialData.name}</div>
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
                      name="vendor_number"
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
                    <ChoiceListComboboxField
                      control={vendorForm.control}
                      name="location_id"
                      label="Location"
                      choiceList="locations"
                      required
                    />

                    <ChoiceListComboboxField
                      control={vendorForm.control}
                      name="status_id"
                      label="Status"
                      choiceList="statusOnes"
                      required
                    />

                    <ChoiceListComboboxField
                      control={vendorForm.control}
                      name="type_id"
                      label="Type"
                      choiceList="vendorTypes"
                      required
                    />
                    <ChoiceListComboboxField
                      control={vendorForm.control}
                      name="term_id"
                      label="Term"
                      choiceList="purchaseOrders:terms"
                      required
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
                <Button className=" w-full" type="submit" disabled={isPending}>
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
