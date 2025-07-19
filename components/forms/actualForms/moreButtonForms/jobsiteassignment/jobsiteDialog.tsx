"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

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
  }, [initialData, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form
          onSubmit={form.handleSubmit(data => onSave({ ...initialData, ...data }))}
          className="space-y-4"
        >
          <InputWrapper control={form.control} name="name" label="Name" />
          <TextareaWrapper control={form.control} name="notes" label="Notes" />
          <div className="flex justify-end">
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
