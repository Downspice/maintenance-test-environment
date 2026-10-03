"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import { useEffect } from "react";
import { z } from "zod";
import { FormModal } from "@/components/ui/form-modal";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PartKitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: { id?: string; name: string; notes?: string } | null;
  onSave: (data: { id?: string; name: string; notes?: string }) => void;
}

export default function PartKitDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: PartKitDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (initialData) form.reset(initialData);
    else form.reset({ name: "", notes: "" });
  }, [initialData, form, open]);

  const isEdit = Boolean(initialData?.id ?? initialData?.name);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit part kit" : "Add part kit"}
      description="Name the kit and add optional notes for your team."
      formId="part-kit-dialog-form"
      form={form}
      submitLabel={isEdit ? "Save changes" : "Create kit"}
      onSubmit={(data) => {
        onSave({ ...initialData, ...data });
        onOpenChange(false);
      }}
    >
      <InputWrapper control={form.control} name="name" label="Name" />
      <TextareaWrapper control={form.control} name="notes" label="Notes" />
    </FormModal>
  );
}
