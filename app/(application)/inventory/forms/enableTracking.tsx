"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";

// Define the form schema with Zod
export const EnableTrackingSchema = z.object({
  enableTracking: z.boolean(),
});

export type EnableTrackingInterface = z.infer<typeof EnableTrackingSchema>;
export default function EnableTrackingForm({
  data,
}: {
  data: EnableTrackingInterface;
}) {
  const EnableTrackingForm = useForm<z.infer<typeof EnableTrackingSchema>>({
    resolver: zodResolver(EnableTrackingSchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof EnableTrackingSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("change category submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...EnableTrackingForm}>
        <form
          onSubmit={EnableTrackingForm.handleSubmit((data) =>
            handleSubmit(data)
          )}
          className="w-full"
        >
          <div className="flex flex-col">
            <SingleCheckboxWrapper
              control={EnableTrackingForm.control}
              name="enableTracking"
              label="Enable Tracking"
            />
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
