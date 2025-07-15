"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { markupTypeOptions } from "@/lib/inventory-data";
import { priorityOptions } from "./newWorkOrderFormSheet";

// Define the form schema with Zod
export const ChangePrioritySchema = z.object({
   priority: z.string().optional(), 
});

export type ChangePriorityInterface = z.infer<typeof ChangePrioritySchema>;

export default function ChangePriorityForm({
  data,
}: {
  data: ChangePriorityInterface;
}) {
  const ChangePriorityForm = useForm<z.infer<typeof ChangePrioritySchema>>({
    resolver: zodResolver(ChangePrioritySchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof ChangePrioritySchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("change priority submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...ChangePriorityForm}>
        <form
          onSubmit={ChangePriorityForm.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <div className="flex flex-col">
            <>
              <SelectWrapper
                control={ChangePriorityForm.control}
                name={`priority`}
                label="Priority"
                options={priorityOptions}
                required
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
