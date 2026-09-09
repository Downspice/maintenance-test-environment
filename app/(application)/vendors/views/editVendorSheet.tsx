"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import { ChoiceListComboboxField } from "@/components/forms/fields/ChoiceListComboboxWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import CustomFieldRow from "@/components/forms/fields/CustomFieldRow";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetVendor, useUpdateVendor } from "@/services/setups/vendor";
import { vendorSchema } from "@/components/forms/entities/new-vendor-form";
import { VendorTableInterface } from "@/lib/domains/vendor/vendor-data";
import { deepCleanNulls } from "@/lib/shared/utils";

interface VendorDetailData extends VendorTableInterface {
  others?: Array<{ name?: string; value?: string }>;
}

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
  const { data: vendorDetails } = useGetVendor<VendorDetailData>(
    initialData.id,
    {
      enabled: open && !!initialData.id,
    }
  );

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
          : (initialData.billing_rate ?? ""),
      notes: vendorDetails.notes ?? initialData.notes ?? "",
      others: [
        {
          name:
            Array.isArray(vendorDetails.others) && vendorDetails.others[0]?.name
              ? vendorDetails.others[0].name
              : "",
          value:
            Array.isArray(vendorDetails.others) &&
              vendorDetails.others[0]?.value
              ? vendorDetails.others[0].value
              : "",
        },
        {
          name:
            Array.isArray(vendorDetails.others) && vendorDetails.others[1]?.name
              ? vendorDetails.others[1].name
              : "",
          value:
            Array.isArray(vendorDetails.others) &&
              vendorDetails.others[1]?.value
              ? vendorDetails.others[1].value
              : "",
        },
      ],
      phone_one:
        vendorDetails.vendor_contact?.phone_one ??
        initialData.vendor_contact?.phone_one ??
        "",
      phone_two:
        vendorDetails.vendor_contact?.phone_two ??
        initialData.vendor_contact?.phone_two ??
        "",
      fax:
        vendorDetails.vendor_contact?.fax ??
        initialData.vendor_contact?.fax ??
        "",
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
      const validOthers = Array.isArray(formData.others)
        ? formData.others.filter(
          (item: { name?: string; value?: string }) =>
            item && (item.name?.trim() || item.value?.trim())
        )
        : [];

      const payload = {
        ...formData,
        id: formData.id ?? vendorDetails?.id ?? initialData.id,
        others: validOthers,
      };
      const res = await mutateAsync(
        payload as unknown as Parameters<typeof mutateAsync>[0]
      );
      toast.success(
        (res as { message?: string })?.message ?? "Edited successfully!"
      );
      vendorForm.reset();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update vendor.";
      toast.error(errorMessage);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={initialData.name}
      description="Edit vendor details."
      closeable={true}
      renderActions={
        <Button
          form="edit-vendor-form"
          type="submit"
          variant="primary"
          disabled={isPending}
        >
          Save Vendor
        </Button>
      }
      className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <Form {...vendorForm}>
          <form
            id="edit-vendor-form"
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
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
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
                  <CustomFieldRow
                    control={vendorForm.control}
                    nameField="others.0.name"
                    valueField="others.0.value"
                  />
                  <CustomFieldRow
                    control={vendorForm.control}
                    nameField="others.1.name"
                    valueField="others.1.value"
                  />
                </div>
              </TabsContent>
              <TabsContent value="contact">
                <div className="flex flex-col gap-1">
                  <InputWrapper
                    control={vendorForm.control}
                    name="phone_one"
                    label="Phone 1"
                    type="text"
                    required
                  />
                  <InputWrapper
                    control={vendorForm.control}
                    name="phone_two"
                    label="Phone 2"
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
          </form>
        </Form>
      </ScrollArea>
    </Drawer>
  );
}
