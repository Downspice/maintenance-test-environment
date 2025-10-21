"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { assigneeOptions } from "@/lib/equipment-schema";
import { MultiComboboxWrapper } from "@/components/forms/wrappers/ComboboxWrapper";

// Define the form schema with Zod
export const ChangeAssigneesSchema = z.object({
  priority: z.string().optional(),
});

export type ChangeAssigneesInterface = z.infer<typeof ChangeAssigneesSchema>;

export default function ChangeAssigneesForm({
  data,
}: {
  data: ChangeAssigneesInterface;
}) {
  const ChangeAssigneesForm = useForm<z.infer<typeof ChangeAssigneesSchema>>({
    resolver: zodResolver(ChangeAssigneesSchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof ChangeAssigneesSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("change priority submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...ChangeAssigneesForm}>
        <form
          onSubmit={ChangeAssigneesForm.handleSubmit((data) =>
            handleSubmit(data)
          )}
          className="w-full"
        >
          <div className="flex flex-col">
            <>
              <MultiComboboxWrapper
                control={ChangeAssigneesForm.control}
                name="assigneeIds"
                label="Assignee"
                options={assigneeOptions}
                placeholder="Select assignees"
                searchPlaceholder="Search assignees..."
                maxSelections={2}
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
