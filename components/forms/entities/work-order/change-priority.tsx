"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import { priorityOptions } from "@/lib/domains/work-order/constants";
import { useUpdateWorkOrderPriority } from "@/services/setups/workOrder";

// Define the form schema with Zod
export const ChangePrioritySchema = z.object({
  priority_id: z.string().optional(),
});

export type ChangePriorityInterface = z.infer<typeof ChangePrioritySchema>;

export default function ChangePriorityForm({
  data,
  onSuccess,
}: {
  data: any;
  onSuccess?: () => void;
}) {
  const { mutate: updatePriority, isPending } = useUpdateWorkOrderPriority();

  const form = useForm<ChangePriorityInterface>({
    resolver: zodResolver(ChangePrioritySchema),
    defaultValues: {
      priority_id: data.priority_id,
    },
  });

  async function handleSubmit(formData: ChangePriorityInterface) {
    if (!formData.priority_id) {
      toast.error("Please select a priority");
      return;
    }

    const payload = {
      id: data.id,
      priority_id: formData.priority_id,
    };

    updatePriority(payload, {
      onSuccess: () => {
        toast.success("Priority updated successfully!");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update priority"
        );
        console.error(error);
      },
    });
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <div className="flex flex-col">
            <>
              <SelectWrapper
                control={form.control}
                name={`priority_id`}
                label="Priority"
                options={priorityOptions}
                required
              />
            </>
          </div>
          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className="w-full" disabled={isPending}>
              <GitPullRequestArrow className="mr-2" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
