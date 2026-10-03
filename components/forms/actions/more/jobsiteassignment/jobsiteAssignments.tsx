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
import { jobSiteOptionsList } from "@/lib/shared/option-list";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FilePenIcon, Plus, Trash2Icon } from "lucide-react";
import JobSiteDialog from "./jobsiteDialog";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { toast } from "sonner";

type JobSiteFormData = { id?: string; name: string; notes?: string };

export default function JobSiteAssignment() {
  const confirmDialog = useConfirmDialog();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<JobSiteFormData | null>(null);

  const openCreate = () => {
    setEditData(null);
    setOpen(true);
  };

  const openEdit = () => {
    setEditData({ name: "test", notes: "test notes" });
    setOpen(true);
  };

  const handleSave = (data: JobSiteFormData) => {
    console.log("Saved job site", data);
    toast.success(editData ? "Job site updated" : "Job site created");
    setEditData(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 pb-2">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a job site" />
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
        <div className="col-span-1 flex justify-end gap-x-2">
          <Button variant="primary" onClick={openCreate}>
            <Plus className="mr-2 size-4" /> Add new
          </Button>
          <Button variant="secondary" onClick={openEdit}>
            <FilePenIcon className="mr-2 size-4" /> Edit
          </Button>
          <Button
            variant="secondary"
            className="text-destructive focus:text-destructive"
            onClick={async () => {
              const ok = await confirmDialog({
                title: "Delete job site assignment?",
                description: "This will remove the selected assignment record.",
                confirmText: "Yes, delete",
                item: { name: "test", description: "Job site assignment" },
              });
              if (ok) toast.success("Assignment deleted");
            }}
          >
            <Trash2Icon className="mr-2 size-4" /> Delete
          </Button>
        </div>
      </div>
      <JobSiteDataTable />
      <JobSiteDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setEditData(null);
        }}
        initialData={editData}
        onSave={handleSave}
      />
    </>
  );
}
