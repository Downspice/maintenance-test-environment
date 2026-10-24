"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "../fields/InputWrapper";
import { iconsOptionList } from "@/lib/shared/option-list";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function NewCategory({
  formId = "new-category-form",
  hideSubmitButton,
}: {
  formId?: string;
  hideSubmitButton?: boolean;
}) {
  const [customFields, setCustomFields] = useState<
    { name: string; id: string }[]
  >([]);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Category saved successfully!");
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", id: "" }]);
  };

  return (
    <div>
      <Form {...vendorForm}>
        <form
          id={formId}
          onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}
        >
          <div className="grid grid-cols-2 gap-x-2">
            <div className="col-span-2 flex flex-col">
              <InputWrapper
                className="col-span-1"
                control={vendorForm.control}
                name="category"
                label="Category"
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
          </div>
          {!hideSubmitButton && (
            <div className="flex justify-between gap-x-4 my-8 w-full">
              <Button className=" w-full">
                <GitPullRequestArrow className="mr-2" /> Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
