"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Plus } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vendorTypeOptions } from "@/lib/shared/option-list";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import CustomFieldsWrapper from "@/components/forms/fields/CustomFieldsWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import { useGetInventoryCategories } from "@/services/setups/inventory";
import { useGetEquipmentStatuses } from "@/services/setups/equipments";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function NewShipToForm() {
  const [customFields, setCustomFields] = useState<
    { name: string; id: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });
  const { data: categoryOptions } = useGetInventoryCategories();
  const { data: statusOptions } = useGetEquipmentStatuses();


  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", id: "" }]);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex justify-between w-full">
          <div></div>
          <Button>
            <Plus />
            New
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="w-5/6 ">
        <SheetHeader>
          <SheetTitle>Create Shipping</SheetTitle>
          <SheetDescription>
            Fill out the form below to set up your new Shipping.
          </SheetDescription>
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
                </TabsList>
                <TabsContent value="general">
                  <div className="flex flex-col gap-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="name"
                      label="Name"
                      type="text"
                      required
                      value={""}
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="number"
                      label="Vendor #"
                      type="text"
                      value={""}
                    />

                    <InputWrapper
                      control={vendorForm.control}
                      name="contactNumber"
                      label="Contact"
                      type="text"
                      value={""}
                    />

                    <InputWrapper
                      control={vendorForm.control}
                      name="address_one"
                      label="Address"
                      type="text"
                      value={""}
                    />

                    <InputWrapper
                      className="pt-0"
                      control={vendorForm.control}
                      name="street2"
                      placeholder=" "
                      label=""
                      type="text"
                      value={""}
                    />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="col-span-1">
                        <InputWrapper
                          control={vendorForm.control}
                          name="city"
                          label="City"
                          type="text"
                          value={""}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={vendorForm.control}
                          name="state"
                          label="State /Province"
                          type="text"
                          value={""}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={vendorForm.control}
                          name="postal_code"
                          label="Postal Code"
                          type="text"
                          value={""}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={vendorForm.control}
                          name="country"
                          label="Country"
                          type="text"
                          value={""}
                        />
                      </div>
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
                      name="status"
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
                      name="term"
                      label="Term "
                      required
                      options={vendorTypeOptions}
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="billing_rate"
                      label="Billing Rate"
                      type="number"
                      value={""}
                    />
                    <div className="flex flex-col gap-4">
                      <TextareaWrapper
                        control={vendorForm.control}
                        name="notes"
                        label="Notes"
                        rows={4}
                        value={""}
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
                      label="Phone 1"
                      type="text"
                      required
                      value={""}
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="phone_two"
                      label="Phone 2"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="fax"
                      label="Fax:"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="email"
                      label="Email:"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={vendorForm.control}
                      name="website"
                      label="Website:"
                      type="text"
                      value={""}
                    />
                  </div>
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
