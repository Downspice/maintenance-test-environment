'use client'
import { NotesInterface, NotesSchema } from "@/lib/WorkOrder/workOrder-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { useEffect } from "react";

export default function AddNotes({
  initialValues,
  onSave,
}: {
  initialValues?: NotesInterface;
  onSave: (note: NotesInterface) => void;
}) {
  const form = useForm<NotesInterface>({
    resolver: zodResolver(NotesSchema),
    defaultValues: {
      notes: "",
      createdBy: "Joseph",
      createdAt: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = (data: NotesInterface) => {
    onSave(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextareaWrapper
          control={form.control}
          name="notes"
          label="Note"
          value=""
        />
        <div className="flex justify-end">
          <Button type="submit" className="min-w-32 my-4 w-full">
            <Save className="mr-2 h-4 w-4" />
            {initialValues ? "Update Note" : "Add Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
