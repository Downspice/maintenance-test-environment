"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobSiteDataTable from "./jobsiteTable";
import { jobSiteOptionsList } from "@/lib/option-list";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FilePenIcon, Plus, Trash2Icon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { Save } from "lucide-react";
import { Form } from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function JobSiteAssignment() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<FormValues | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editData ?? { name: "", notes: "" },
  });

  useEffect(() => {
    if (editData) {
      form.reset(editData);
    }
  }, [editData]);

  return (
    <>
      <div className="flex grid grid-cols-2 pb-2">
        <Select className="w-[180px] col-span-1">
          <SelectTrigger>
            <SelectValue placeholder="Select a Job Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {jobSiteOptionsList.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex justify-end gap-x-4 col-span-1">
          <Button
            onClick={() => {
              form.reset({ name: "", notes: "" });
              setOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> Add New
          </Button>
          <Button 
            onClick={() => {
              setOpen(true);
              setEditData({ name: "test", notes: "test notes" });
            }}
          >
            <FilePenIcon size={16} className="mr-2" /> Edit
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (confirm(`Are you sure you want to delete test?`)) {
                alert(`Deleted test`);
                // Here you would typically call your bulk delete API
              }
            }}
          >
            <Trash2Icon size={16} className="mr-2" /> Delete
          </Button>
        </div>
      </div>
      <JobSiteDataTable />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                console.log({ ...editData, ...data });
                form.reset();
                setOpen(false);
              })}
              className="space-y-4"
            >
              <InputWrapper control={form.control} name="name" label="Name" />
              <TextareaWrapper
                control={form.control}
                name="notes"
                label="Notes"
              />
              <div className="flex justify-end">
                <Button type="submit">
                  <Save size={16} className="mr-2" />
                  {editData ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
