"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import ComboboxWrapper from "../wrappers/ComboboxWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
// Define the form schema with Zod
export const workOrderSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),

  notes: z.string().optional(),
});

// Equipment options
const equipmentOptions = [{ id: "1311827", name: "AC-001-07 Class 8" }];
 
export default function NewInspection() {

  const workOrderForm = useForm<z.infer<typeof workOrderSchema>>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
       
    },
  });

  async function handleSubmit(data: z.infer<typeof workOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

 const handleRowClick = (workOrderId: string, event: React.MouseEvent) => {
     // Don't navigate if clicking on checkbox or other interactive elements
     if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
       return
     }
     router.push(`/work-order/${workOrderId}`)
   }

  return (
    <div>
      <Form {...workOrderForm}>
        <form
          onSubmit={workOrderForm.handleSubmit((data) => handleSubmit(data))}
        >
          <div className="work-order-form-wrapper">
            <div className="pt-2">
              <ComboboxWrapper
                control={workOrderForm.control}
                name="equipmentId"
                label="Equipment"
                options={equipmentOptions}
                required={true}
                searchPlaceholder="Search equipment..."
              />
            </div>

            <div className="disable-fields-without-equipment pt-4">
              <div id="fields">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="date"
                    label="Date"
                  />
                </div>
                <div className="pt-4">
                  <TextareaWrapper
                    control={workOrderForm.control}
                    name="notes"
                    label="Notes"
                    value={""}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Create Inspection
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
