"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CameraIcon, Plus, Trash2, Wrench } from "lucide-react";
import { Form } from "@/components/ui/form";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { assigneeOptions } from "@/lib/schemas/equipment-schema";
import { equipmentOptionsList } from "@/lib/shared/option-list";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import FormSubheader from "@/components/forms/ui/formSubheader";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

export const priorities = [
  { id: "Low", name: "Low" },
  { id: "Medium", name: "Medium" },
  { id: "High", name: "High" },
];

export const typeOptions = [
  { id: "Mechanical", name: "Mechanical" },
  { id: "Electrical", name: "Electrical" },
  { id: "Hydraulic", name: "Hydraulic" },
  { id: "Safety", name: "Safety" },
  { id: "Maintenance", name: "Maintenance" },
];

export const repairOptions = [
  { id: "Oil Leak", name: "Oil Leak", priority: "High", type: "Mechanical", laborTime: 2 },
  { id: "Hydraulic Leak", name: "Hydraulic Leak", priority: "High", type: "Mechanical", laborTime: 1.5 },
  { id: "Loose Belt", name: "Loose Belt", priority: "Medium", type: "Mechanical", laborTime: 1 },
  { id: "Broken Screen", name: "Broken Screen", priority: "Low", type: "Electrical", laborTime: 1 },
  { id: "Engine Noise", name: "Engine Noise", priority: "Medium", type: "Mechanical", laborTime: 2 },
  { id: "Track Replacement", name: "Track Replacement", priority: "Medium", type: "Mechanical", laborTime: 3 },
  { id: "Brake Check", name: "Brake Check", priority: "Medium", type: "Safety", laborTime: 1 },
  { id: "Oil Change", name: "Oil Change", priority: "Medium", type: "Maintenance", laborTime: 0.5 },
];

const repairsNeededSchema = z.object({
  repair: z.string().min(1, "Repair is required"),
  type: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  laborTime: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  image: z.any().optional(),
});

export const repairRequestSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  requestedBy: z.string().min(1, "Requested By is required"),
  dueDate: z.coerce.date({ required_error: "Due Date is required" }),
  repairBy: z.coerce.number().min(1, "Repair By is required"),
  repairsNeeded: z.array(repairsNeededSchema).min(1, "At least one repair item is required"),
  repairRequestId: z.string().optional(),
});

export type MoreButtonRequestInterface = z.infer<typeof repairRequestSchema>;

interface NewRepairRequestFormProps {
  formId?: string;
  hideSubmitButton?: boolean;
  initialData?: Partial<MoreButtonRequestInterface>;
  onSuccess?: (data: MoreButtonRequestInterface) => void;
}

const parseDate = (d: any): Date => {
  if (!d) return new Date();
  if (d instanceof Date) return d;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export default function NewRepairRequestForm({
  formId = "new-repair-request-form",
  hideSubmitButton = false,
  initialData,
  onSuccess,
}: NewRepairRequestFormProps) {
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  const form = useForm<MoreButtonRequestInterface>({
    resolver: zodResolver(repairRequestSchema),
    defaultValues: {
      equipment: initialData?.equipment || "",
      requestedBy: initialData?.requestedBy || "",
      dueDate: parseDate(initialData?.dueDate),
      repairBy: initialData?.repairBy ?? 1,
      repairRequestId: initialData?.repairRequestId || "",
      repairsNeeded: initialData?.repairsNeeded?.length
        ? initialData.repairsNeeded
        : [
            {
              repair: "",
              type: "Mechanical",
              priority: "Medium",
              laborTime: 1,
              notes: "",
            },
          ],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        equipment: initialData.equipment || "",
        requestedBy: initialData.requestedBy || "",
        dueDate: parseDate(initialData.dueDate),
        repairBy: initialData.repairBy ?? 1,
        repairRequestId: initialData.repairRequestId || "",
        repairsNeeded: initialData.repairsNeeded?.length
          ? initialData.repairsNeeded
          : [
              {
                repair: "",
                type: "Mechanical",
                priority: "Medium",
                laborTime: 1,
                notes: "",
              },
            ],
      });
      const previews: Record<number, string> = {};
      initialData.repairsNeeded?.forEach((item, index) => {
        if (typeof item.image === "string") {
          previews[index] = item.image;
        }
      });
      setImagePreviews(previews);
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "repairsNeeded",
  });

  const handleRepairChange = (index: number, val: string) => {
    const matched = repairOptions.find((r) => r.id === val || r.name === val);
    if (matched) {
      form.setValue(`repairsNeeded.${index}.repair`, matched.name);
      form.setValue(`repairsNeeded.${index}.type`, matched.type);
      form.setValue(`repairsNeeded.${index}.priority`, matched.priority as any);
      form.setValue(`repairsNeeded.${index}.laborTime`, matched.laborTime);
    } else {
      form.setValue(`repairsNeeded.${index}.repair`, val);
    }
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreviews((prev) => ({
        ...prev,
        [index]: result,
      }));
      const currentRepairs = [...form.getValues("repairsNeeded")];
      if (currentRepairs[index]) {
        currentRepairs[index].image = result;
        form.setValue("repairsNeeded", currentRepairs);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: MoreButtonRequestInterface) => {
    const formattedData: MoreButtonRequestInterface = {
      ...values,
      repairRequestId:
        values.repairRequestId ||
        `RR-${Math.floor(100 + Math.random() * 900)}`,
      dueDate:
        values.dueDate instanceof Date
          ? (values.dueDate.toISOString().split("T")[0] as any)
          : values.dueDate,
    };
    console.log("Submitted Repair Request:", formattedData);
    toast.success(
      initialData?.repairRequestId
        ? "Repair request updated successfully"
        : "Repair request created successfully"
    );
    onSuccess?.(formattedData);
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          const firstError = Object.values(errors)[0];
          if (firstError?.message) {
            toast.error(String(firstError.message));
          } else {
            toast.error("Please fill in all required fields.");
          }
        })}
        className="space-y-6"
      >
        {/* General Info Section */}
        <div className="space-y-2">
          <FormSubheader header="General Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-2">
            <ComboboxFieldWrapper
              control={form.control}
              name="equipment"
              label="Equipment"
              options={equipmentOptionsList}
              required
            />
            <DatePickerWrapper
              control={form.control}
              name="dueDate"
              label="Due Date"
              required
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="requestedBy"
              label="Requested By"
              options={assigneeOptions}
              required
            />
            <InputWrapper
              control={form.control}
              name="repairBy"
              label="Repair By (Days)"
              type="number"
              required
            />
          </div>
        </div>

        {/* Repairs Needed Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h3 className="text-base font-semibold">Repairs Needed</h3>
              <p className="text-xs text-muted-foreground">
                Specify all repair items, labor estimations, and notes for this request.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  repair: "",
                  type: "Mechanical",
                  priority: "Medium",
                  laborTime: 1,
                  notes: "",
                })
              }
            >
              <Plus className="size-4 mr-2" />
              Add Repair Item
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20 text-center">
              <Wrench className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No repair items added yet</p>
              <p className="text-xs text-muted-foreground mb-3">
                Add at least one repair item to complete this request.
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() =>
                  append({
                    repair: "",
                    type: "Mechanical",
                    priority: "Medium",
                    laborTime: 1,
                    notes: "",
                  })
                }
              >
                <Plus className="size-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 bg-card shadow-xs transition-colors hover:border-primary/40 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        Item #{index + 1}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {form.watch(`repairsNeeded.${index}.repair`) || "New Repair"}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                    <ComboboxFieldWrapper
                      control={form.control}
                      name={`repairsNeeded.${index}.repair`}
                      label="Repair"
                      options={repairOptions}
                      placeholder="Select repair..."
                      direction="vertical"
                      required
                      onChange={(val) => handleRepairChange(index, val)}
                    />

                    <ComboboxFieldWrapper
                      control={form.control}
                      name={`repairsNeeded.${index}.type`}
                      label="Type"
                      options={typeOptions}
                      direction="vertical"
                    />

                    <ComboboxFieldWrapper
                      control={form.control}
                      name={`repairsNeeded.${index}.priority`}
                      label="Priority"
                      options={priorities}
                      direction="vertical"
                    />

                    <InputWrapper
                      control={form.control}
                      name={`repairsNeeded.${index}.laborTime`}
                      label="Labor Time (hrs)"
                      type="number"
                      direction="vertical"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 items-start pt-1">
                    <div className="md:col-span-2">
                      <TextareaWrapper
                        control={form.control}
                        name={`repairsNeeded.${index}.notes`}
                        label="Notes"
                        placeholder="Add specific instructions, symptoms, or part requirements..."
                        rows={2}
                        direction="vertical"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground block">
                        Attachment / Photo
                      </span>
                      {imagePreviews[index] ? (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                          <img
                            src={imagePreviews[index]}
                            alt="Attachment preview"
                            className="size-10 object-cover rounded cursor-pointer border"
                            onClick={() => setModalImage(imagePreviews[index])}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">Photo attached</p>
                            <button
                              type="button"
                              className="text-xs text-primary underline"
                              onClick={() => setModalImage(imagePreviews[index])}
                            >
                              View image
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setImagePreviews((prev) => {
                                const next = { ...prev };
                                delete next[index];
                                return next;
                              });
                              const currentRepairs = [...form.getValues("repairsNeeded")];
                              if (currentRepairs[index]) {
                                currentRepairs[index].image = undefined;
                                form.setValue("repairsNeeded", currentRepairs);
                              }
                            }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-3 border border-dashed rounded-md cursor-pointer hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                          <CameraIcon className="size-4" />
                          <span className="text-xs">Attach Photo</span>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!hideSubmitButton && (
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary">
              {initialData?.repairRequestId ? "Update Repair Request" : "Save Repair Request"}
            </Button>
          </div>
        )}
      </form>

      {/* Image Preview Modal */}
      <Modal
        open={!!modalImage}
        onOpenChange={() => setModalImage(null)}
        title="Image Preview"
        description="Attached photo for this repair item."
        size="lg"
        closeable={true}
      >
        {modalImage && (
          <div className="flex items-center justify-center p-2">
            <img
              src={modalImage}
              alt="Repair item photo"
              className="max-h-[70vh] rounded-md object-contain"
            />
          </div>
        )}
      </Modal>
    </Form>
  );
}
