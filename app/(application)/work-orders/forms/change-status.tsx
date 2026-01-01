"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import { useGetWorkOrderStatuses, useUpdateWorkOrderCurrentStatus } from "@/services/setups/workOrder";

// Define the form schema with Zod
export const ChangeStatusSchema = z.object({
    status_id: z.string().optional(),
});

export type ChangeStatusInterface = z.infer<typeof ChangeStatusSchema>;

export default function ChangeStatusForm({
    data,
    onSuccess
}: {
    data: any;
    onSuccess?: () => void;
}) {
    const { data: statusOptions } = useGetWorkOrderStatuses();

    // Transform options for SelectWrapper
    const formattedOptions = (statusOptions || []).map((option: any) => ({
        id: option.id,
        name: option.name,
    }));

    const { mutate: updateStatus, isPending } = useUpdateWorkOrderCurrentStatus();

    const form = useForm<ChangeStatusInterface>({
        resolver: zodResolver(ChangeStatusSchema),
        defaultValues: {
            status_id: data.status_id
        },
    });

    async function handleSubmit(formData: ChangeStatusInterface) {
        if (!formData.status_id) {
            toast.error("Please select a status");
            return;
        }

        const payload = {
            id: data.id,
            status_id: formData.status_id,
        };

        updateStatus(payload, {
            onSuccess: () => {
                toast.success("Status updated successfully!");
                onSuccess?.();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to update status");
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
                            <SelectWrapper
                                control={form.control}
                                name="status_id"
                                label="Status"
                                options={formattedOptions}
                                placeholder="Select status"
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
