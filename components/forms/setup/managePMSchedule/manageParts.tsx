"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";

const partOptions = [
  {
    name: "Oil Filter (PN-123)",
    id: "PN-123",
    name: "Oil Filter",
    warehouse: "WH1",
    description: "Standard oil filter",
  },
  {
    name: "Hydraulic Fluid (PN-456)",
    id: "PN-456",
    name: "Hydraulic Fluid",
    warehouse: "WH2",
    description: "High pressure fluid",
  },
];

const equipmentOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Light System", id: "lights" },
];

const partSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  service: z.string(),
  mode: z.enum(["assigned", "fixed"]),
  partNumber: z.string().optional(),
  name: z.string().optional(),
  warehouse: z.string().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
});

type PartForm = z.infer<typeof partSchema>;

type PartRecord = PartForm & { id: string };

type Props = {
  serviceName: string;
};

export default function ManagePMSchedulePartsTab({ serviceName }: Props) {
  const [parts, setParts] = useState<PartRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PartRecord | null>(null);

  const form = useForm<PartForm>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      equipment: "",
      service: serviceName,
      mode: "assigned",
    },
  });

  const { watch, setValue, reset, handleSubmit } = form;
  const mode = watch("mode");
  const partNumber = watch("partNumber");

  useEffect(() => {
    if (editingPart) {
      reset(editingPart);
    } else {
      reset({
        equipment: "",
        service: serviceName,
        mode: "assigned",
      });
    }
  }, [editingPart, reset, serviceName]);

  useEffect(() => {
    if (mode === "assigned" && partNumber) {
      const selected = partOptions.find((p) => p.value === partNumber);
      if (selected) {
        setValue("warehouse", selected.warehouse);
        setValue("name", selected.name);
        setValue("description", selected.description);
      }
    }
  }, [partNumber, mode, setValue]);

  const onSubmit = (data: PartForm) => {
    if (editingPart) {
      setParts((prev) =>
        prev.map((p) =>
          p.id === editingPart.id
            ? { ...p, quantity: data.quantity, cost: data.cost }
            : p
        )
      );
    } else {
      setParts((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }

    setOpen(false);
    setEditingPart(null);
    reset();
  };

  const onEdit = (part: PartRecord) => {
    setEditingPart(part);
    setOpen(true);
  };

  const onDelete = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>Add Part</Button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Part Number</th>
              <th className="p-2">Name</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Equipment</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="border-t">
                <td className="p-2">{part.partNumber ?? "-"}</td>
                <td className="p-2">{part.name ?? "-"}</td>
                <td className="p-2">{part.quantity ?? "-"}</td>
                <td className="p-2">{part.cost ?? "-"}</td>
                <td className="p-2">{part.equipment}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" onClick={() => onEdit(part)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(part.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingPart ? "Edit part" : "Add part"}
        description="Assign parts or fixed costs to this PM service."
        formId="pm-service-part-form"
        form={form}
        submitLabel={editingPart ? "Save changes" : "Add part"}
        scrollable
        onSubmit={(data) => {
          onSubmit(data);
        }}
      >
            <ComboboxFieldWrapper
              control={form.control}
              name="equipment"
              label="Equipment"
              options={equipmentOptions}
              placeholder="Select Equipment"
              emptyText="No equipment found."
              searchPlaceholder="Search equipment..."
            />

            <InputWrapper
              control={form.control}
              name="service"
              label="Service"
              disabled
              type="text"
            />

            <RadioGroupWrapper
              control={form.control}
              name="mode"
              label="Part Type"
              options={[
                { name: "Assigned Part", id: "assigned" },
                { name: "Fixed Cost", id: "fixed" },
              ]}
            />

            {mode === "fixed" ? (
              <InputWrapper
                control={form.control}
                name="cost"
                label="Cost"
                type="number"
                disabled={!!editingPart}
              />
            ) : (
              <>
                <ComboboxFieldWrapper
                  control={form.control}
                  name="partNumber"
                  label="Part Number"
                  options={partOptions.map((p) => ({
                    name: p.label,
                    id: p.value,
                  }))}
                  placeholder="Select part"
                  emptyText="No part found"
                  searchPlaceholder="Search parts..."
                  disabled={!!editingPart}
                />
                <InputWrapper
                  control={form.control}
                  name="warehouse"
                  label="Warehouse"
                  disabled
                  type="text"
                />
                <InputWrapper
                  control={form.control}
                  name="name"
                  label="Name"
                  disabled
                  type="text"
                />
                <InputWrapper
                  control={form.control}
                  name="description"
                  label="Description"
                  disabled
                  type="text"
                />
                <InputWrapper
                  control={form.control}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  disabled={!!editingPart && mode === "fixed"}
                />
              </>
            )}


      </FormModal>
    </div>
  );
}
