"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import { AlertDialog } from "@/components/ui/alert-dialog";

const priorityOptions = [
  { name: "Normal", id: "normal" },
  { name: "High", id: "high" },
];

const typeOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Lights", id: "lights" },
  { name: "Inspection", id: "inspection" },
];

// Zod Schema
const InspectionSchema = z.object({
  pmService: z.string().min(1, "PM Service is required"),
  priority: z.enum(["normal", "high"]),
  type: z.enum(["forklift", "lights", "inspection"]),
});

type InspectionFormValues = z.infer<typeof InspectionSchema>;

export default function DailyInspectionTable() {
  const [data, setData] = useState<InspectionFormValues[]>([
    {
      pmService: "Monthly Forklift Check",
      priority: "high",
      type: "forklift",
    },
    {
      pmService: "Weekly Light Check",
      priority: "normal",
      type: "lights",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(InspectionSchema),
    defaultValues: {
      pmService: "",
      priority: "normal",
      type: "forklift",
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (editingIndex !== null) {
      reset(data[editingIndex]);
    } else {
      reset({
        pmService: "",
        priority: "normal",
        type: "forklift",
      });
    }
  }, [editingIndex, reset, openDialog]);

  const onSubmit = (formData: InspectionFormValues) => {
    if (editingIndex !== null) {
      const updated = [...data];
      updated[editingIndex] = formData;
      setData(updated);
    } else {
      setData(prev => [...prev, formData]);
    }
    setOpenDialog(false);
    setEditingIndex(null);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const newData = data.filter((_, i) => i !== deleteIndex);
      setData(newData);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Inspection</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{row.pmService}</td>
                <td className="px-4 py-2 capitalize">{row.type}</td>
                <td className="px-4 py-2 capitalize">{row.priority}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingIndex(index);
                      setOpenDialog(true);
                    }}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted-foreground">
                  No inspections available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Button onClick={() => setOpenDialog(true)}>
        <Plus className="mr-2" size={16} />
        Add Inspection
      </Button>

      {/* Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Inspection" : "Create Inspection"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <InputWrapper
              control={control}
              name="pmService"
              label="PM Service"
            />
            <SelectWrapper
              control={control}
              name="priority"
              label="Priority"
              options={priorityOptions}
            />
            <SelectWrapper
              control={control}
              name="type_id"
              label="Type"
              options={typeOptions}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit">
                {editingIndex !== null ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteIndex(null);
        }}
        title="Are you sure?"
        description="This action cannot be undone. Do you want to delete this inspection?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
