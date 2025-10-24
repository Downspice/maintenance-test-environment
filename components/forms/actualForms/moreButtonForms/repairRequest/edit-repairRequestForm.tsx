// app/components/RepairRequestForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CameraIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, 
} from "@/components/ui/form";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import DatePicker from "@/components/ui/date-picker";
import { assigneeOptions } from "@/lib/equipment-schema";
import { equipmentOptionsList } from "@/lib/option-list";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import InputWrapper from "@/components/input-wrapper";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";

const priorities = ["Low", "Medium", "High"];
const typeOptions = [
  { name: "Mechanical ", id: "Mechanical" },
  { name: "Electrical ", id: "Electrical" },
];
const repairOptions = [
  { name: "Oil Leak", id: "oil-leak", priority: "High" },
  { name: "Loose Belt", id: "loose-belt", priority: "Medium" },
  { name: "Broken Screen", id: "broken-screen", priority: "Low" },
];

const repairsNeededSchema = z.object({
  repair: z.string(),
  type: z.string(),
  priority: z.enum(["Low", "Medium", "High"]),
  laborTime: z.coerce.number().min(0),
  notes: z.string().optional(),
  image: z.any().optional(),
});

const schema = z.object({
  equipment: z.string().min(1),
  requestedBy: z.string().min(1),
  dueDate: z.date(),
  repairBy: z.coerce.number().min(1),
  repairsNeeded: z.array(repairsNeededSchema),
  repairRequestId: z.string().optional(),
});

export type MoreButtonRequestInterface = z.infer<typeof schema>;

export default function EditRepairRequestForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: MoreButtonRequestInterface;
}) {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>(
    {}
  );
  const [modalImage, setModalImage] = useState<string | null>(null);

  const form = useForm<MoreButtonRequestInterface>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "repairsNeeded",
  });

  const handleRepairChange = (index: number, id: string) => {
    const priority = "Medium";
    const laborTime = 0;
    update(index, { ...fields[index], repair: value, priority, laborTime });
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [index]: reader.result as string,
      }));
      const newValue = [...form.getValues("repairsNeeded")];
      newValue[index].image = file;
      form.setValue("repairsNeeded", newValue);
    };
    reader.readAsDataURL(file);
  };

  return (
     <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>{children}</SheetTrigger>
          <SheetContent className="w-2/4 ">
            <SheetHeader>
              <SheetTitle>
                Edit Repair request
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("Submitted Repair Request:", data);
          },
          (errors) => {
            console.error("Submission error:", errors);
          }
        )}
        className="space-y-1"
      >
        <ComboboxFieldWrapper
          control={form.control}
          name="equipment"
          label="Equipment"
          options={equipmentOptionsList}
        />

        <ComboboxFieldWrapper
          control={form.control}
          name="requestedBy"
          label="Requested By"
          options={assigneeOptions}
        />

        <DatePickerWrapper
          control={form.control}
          name="dueDate"
          label="Due Date"
        />

        <InputWrapper
          control={form.control}
          name="repairBy"
          label="Repair By"
          type="number"
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Repairs Needed</h3>
            <Button
              type="button"
              onClick={() =>
                append({
                  repair: "",
                  type: "",
                  priority: "Medium",
                  laborTime: 0,
                  notes: "",
                })
              }
            >
              Add
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-7 gap-2 items-start border p-2 mb-2 rounded"
            >
              <ComboboxFieldWrapper
                control={form.control}
                name={`repairsNeeded.${index}.repair`}
                label="Repair"
                options={repairOptions}
                onChange={(val) => handleRepairChange(index, val)}
              />

              <ComboboxFieldWrapper
                control={form.control}
                name={`repairsNeeded.${index}.type`}
                label="Type"
                options={typeOptions}
              />

              <InputWrapper
                control={form.control}
                name={`repairsNeeded.${index}.priority`}
                label="Priority"
                disabled
                type={""}
              />

              <InputWrapper
                control={form.control}
                name={`repairsNeeded.${index}.laborTime`}
                label="Labor Time"
                type="number"
              />

              <TextareaWrapper
                control={form.control}
                name={`repairsNeeded.${index}.notes`}
                label="Notes"
              />

              <div className="flex items-center space-x-2 mt-6">
                {imagePreviews[index] ? (
                  <img
                    src={imagePreviews[index]}
                    alt="Uploaded"
                    className="h-12 w-12 rounded cursor-pointer"
                    onClick={() => setModalImage(imagePreviews[index])}
                  />
                ) : (
                  <label className="cursor-pointer">
                    <CameraIcon />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                    />
                  </label>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>

      <Dialog open={!!modalImage} onOpenChange={() => setModalImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Image</DialogTitle>
          </DialogHeader>
          {modalImage && (
            <img src={modalImage} alt="Preview" className="w-full" />
          )}
        </DialogContent>
      </Dialog>
    </Form>
     </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
