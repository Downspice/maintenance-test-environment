"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import { useGetMarkupTypes } from "@/services/setups/inventory";

// Define the form schema with Zod
export const ChangeMarkUpSchema = z.object({
  markUp: z.enum(["none", "percent", "value", "manual"]),
  percentMarkup: z.coerce.number().optional(),
  markupid: z.coerce.number().optional(),
  markupPrice: z.coerce.number().optional(),
});

export type ChangeMarkUpInterface = z.infer<typeof ChangeMarkUpSchema>;

export default function ChangeMarkUpForm({
  data,
}: {
  data: ChangeMarkUpInterface;
}) {
  const{data:markupTypeOptions}=useGetMarkupTypes();
  const ChangeMarkUpForm = useForm<z.infer<typeof ChangeMarkUpSchema>>({
    resolver: zodResolver(ChangeMarkUpSchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof ChangeMarkUpSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("change category submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...ChangeMarkUpForm}>
        <form
          onSubmit={ChangeMarkUpForm.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <div className="flex flex-col">
            <>
              <SelectWrapper
                control={ChangeMarkUpForm.control}
                name={`markUp`}
                label="Markup Type"
                options={markupTypeOptions}
                required
              />
              {ChangeMarkUpForm.watch("markUp") === "percent" && (
                <InputWrapper
                  control={ChangeMarkUpForm.control}
                  name="percentMarkup"
                  label="% Markup"
                  type="number"
                  required
                  value=""
                />
              )}
              {ChangeMarkUpForm.watch("markUp") === "value" && (
                <InputWrapper
                  control={ChangeMarkUpForm.control}
                  name="markupValue"
                  label="Markup Value"
                  type="number"
                  required
                  value=""
                />
              )}
              {ChangeMarkUpForm.watch("markUp") === "manual" && (
                <InputWrapper
                  control={ChangeMarkUpForm.control}
                  name="markupPrice"
                  label="Markup Price"
                  type="number"
                  required
                  value=""
                />
              )}
            </>
          </div>
          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
