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

interface JobSiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: { id?: string; name: string; notes?: string } | null;
  onSave: (data: { id?: string; name: string; notes?: string }) => void;
}

export default function JobSiteDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: JobSiteDialogProps) {
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

  const isEdit = Boolean(initialData?.name);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit job site" : "Add job site"}
      description="Set the job site name and optional notes for this assignment."
      formId="job-site-form"
      form={form}
      submitLabel={isEdit ? "Save changes" : "Create job site"}
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
