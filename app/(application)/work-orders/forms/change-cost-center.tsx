"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { costCenterOptions } from "../view/edit-work-order";

// Define the form schema with Zod
export const ChangeCostCenterSchema = z.object({
  costCenter: z
    .enum(["preventive", "corrective", "inspection", "other"])
    .optional(),
});

export type ChangeCostCenterInterface = z.infer<typeof ChangeCostCenterSchema>;

export default function ChangeCostCenterForm({
  data,
}: {
  data: ChangeCostCenterInterface;
}) {
  const ChangeCostCenterForm = useForm<z.infer<typeof ChangeCostCenterSchema>>({
    resolver: zodResolver(ChangeCostCenterSchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof ChangeCostCenterSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("change priority submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...ChangeCostCenterForm}>
        <form
          onSubmit={ChangeCostCenterForm.handleSubmit((data) =>
            handleSubmit(data)
          )}
          className="w-full"
        >
          <div className="flex flex-col">
            <>
              <ComboboxFieldWrapper
                control={ChangeCostCenterForm.control}
                name="costCenter"
                label="Cost center"
                options={costCenterOptions}
              />
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
