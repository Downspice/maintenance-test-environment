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
  categoryOptions,
} from "@/lib/equipment-schema";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";

// Define the form schema with Zod
export const CategoryChangeSchema = z.object({
  category: z.string().min(1, "Transfer to warehouse is required"),
});

export type CategoryChangeInterface = z.infer<
  typeof CategoryChangeSchema
>;
export default function CategoryChangeForm({
  data,
}: {
  data: CategoryChangeInterface;
}) {
  const CategoryChangeForm = useForm<
    z.infer<typeof CategoryChangeSchema>
  >({
    resolver: zodResolver(CategoryChangeSchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof CategoryChangeSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("change category submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...CategoryChangeForm}>
        <form
          onSubmit={CategoryChangeForm.handleSubmit((data) =>
            handleSubmit(data)
          )}
          className="w-full"
        >
          <div className="flex flex-col">
            <SelectWrapper
              control={CategoryChangeForm.control}
              name="category"
              label="Category"
              options={categoryOptions}
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
