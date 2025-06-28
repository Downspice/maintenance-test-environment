"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import {
  iconsOptionList,
} from "@/lib/option-list";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function NewLocation() {
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
          <div className="grid grid-cols-2 gap-x-2">
            <div className="col-span-2 flex flex-col">
              <InputWrapper
                className="col-span-1"
                control={vendorForm.control}
                name="location"
                label="Location"
                type="text"
                value={""}
              />
              <ComboboxFieldWrapper
                className="col-span-1"
                control={vendorForm.control}
                name="locationIcon"
                label="Icon"
                options={iconsOptionList}
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <InputWrapper
                className="col-span-1"
                control={vendorForm.control}
                name="tax1"
                label="Tax 1"
                type="text"
                value={undefined}
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <InputWrapper
                className="col-span-1"
                control={vendorForm.control}
                name="tax2"
                label="Tax 2"
                type="text"
                value={undefined}
              />
            </div>
          </div>
          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Create Vendor
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
