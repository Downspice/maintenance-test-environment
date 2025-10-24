"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
 import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";

const equipmentOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Light System", id: "lights" },
];

const InstructionTabSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  photos: z.any().optional(),
  generalNotes: z.string().optional(),
});

type InstructionTabForm = z.infer<typeof InstructionTabSchema>;

export default function InstructionTab() {
  const form = useForm<InstructionTabForm>({
    resolver: zodResolver(InstructionTabSchema),
    defaultValues: {
      equipment: "",
      generalNotes: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: InstructionTabForm) => {
    console.log("Form submitted:", data);
    // Perform save action here (e.g., API call)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
      <ComboboxFieldWrapper
        control={form.control}
        name="equipment"
        label="Equipment"
        placeholder="Select equipment"
        options={equipmentOptions}
        emptyText="No equipment found"
        searchPlaceholder="Search equipment..."
      />

      <FileUploadWrapper
        control={form.control}
        name="photos"
        label="Photos"
      />

      <TextareaWrapper
        control={form.control}
        name="generalNotes"
        placeholder="Enter general notes or description..."
        value={""}
      />

      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
