"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
} from "react-hook-form"; 
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { 
  warehouseOptions,
} from "@/lib/equipment-schema";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";

// Define the form schema with Zod
export const TransferInventorySchema = z.object({
  transferTo: z.string().min(1, "Transfer to warehouse is required"),
  quantity: z.coerce.number().optional(), // Optional if 'transferAll' is checked
  transferAll: z.boolean().optional(),
  reason: z.string().optional(),
});

export type TransferInventoryInterface = z.infer<
  typeof TransferInventorySchema
>;
export default function TransferInventoryForm({
  data,
}: {
  data: TransferInventoryInterface;
}) {
  const TransferInventoryForm = useForm<
    z.infer<typeof TransferInventorySchema>
  >({
    resolver: zodResolver(TransferInventorySchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof TransferInventorySchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Work Order submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...TransferInventoryForm}>
        <form
          onSubmit={TransferInventoryForm.handleSubmit((data) =>
            handleSubmit(data)
          )}
          className="w-full"
        >
          <div className="flex flex-col">
            <SelectWrapper
              control={TransferInventoryForm.control}
              name="transferTo"
              label="Transfer to"
              options={warehouseOptions}
            />
            <div className="grid grid-cols-2 gap-2">
              <InputWrapper
                className="col-span-1"
                control={TransferInventoryForm.control}
                name="quantity"
                label="Quantity"
                type="number"
              />
              <SingleCheckboxWrapper
                control={TransferInventoryForm.control}
                name={"transferAll"}
                label={"Transfer all"}
              />{" "}
            </div>
            <TextareaWrapper
              control={TransferInventoryForm.control}
              name="reason"
              label="Reason"
              placeholder={""}
              value={""}
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
