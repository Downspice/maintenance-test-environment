"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { useGetCostCenters } from "@/services/setups/inventory";
import { useUpdateWorkOrderCostCenter } from "@/services/setups/workOrder";

// Define the form schema with Zod
export const ChangeCostCenterSchema = z.object({
  cost_center_id: z.string().optional(),
});

export type ChangeCostCenterInterface = z.infer<typeof ChangeCostCenterSchema>;

export default function ChangeCostCenterForm({
  data,
  onSuccess
}: {
  data: any;
  onSuccess?: () => void;
}) {
  const { data: costCenterOptions } = useGetCostCenters();

  // Transform options for Combobox
  const formattedOptions = (costCenterOptions || []).map((option: any) => ({
    id: option.id,
    name: option.name,
  }));

  const { mutate: updateCostCenter, isPending } = useUpdateWorkOrderCostCenter();

  const form = useForm<ChangeCostCenterInterface>({
    resolver: zodResolver(ChangeCostCenterSchema),
    defaultValues: {
      cost_center_id: data.cost_center_id
    },
  });

  async function handleSubmit(formData: ChangeCostCenterInterface) {
    if (!formData.cost_center_id) {
      toast.error("Please select a cost center");
      return;
    }

    const payload = {
      id: data.id,
      cost_center_id: formData.cost_center_id,
    };

    updateCostCenter(payload, {
      onSuccess: () => {
        toast.success("Cost center updated successfully!");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update cost center");
        console.error(error);
      }
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
              <ComboboxFieldWrapper
                control={form.control}
                name="cost_center_id"
                label="Cost Center"
                options={formattedOptions}
                placeholder="Select cost center"
                searchPlaceholder="Search cost center..."
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
