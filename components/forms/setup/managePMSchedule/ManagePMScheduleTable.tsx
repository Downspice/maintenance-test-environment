"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { PartType } from "@/lib/schemas/part-kits-schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const catalog = [
  { partNumber: "P001", name: "Oil Filter", warehouse: "Warehouse A", onHandQuantity: 100 },
  { partNumber: "P002", name: "Brake Pad", warehouse: "Warehouse B", onHandQuantity: 50 },
  { partNumber: "P003", name: "Air Filter", warehouse: "Warehouse C", onHandQuantity: 75 },
];

const options = catalog.map(c => ({ name: c.partNumber, id: c.partNumber }));

export default function ManagePMScheduleTable({
  parts,
  onUpdateParts,
}: {
  parts: PartType[];
  onUpdateParts: (updated: PartType[]) => void;
}) {
  const [editPart, setEditPart] = useState<PartType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const savePart = (newPart: PartType) => {
    const updated = editPart
      ? parts.map(p => (p.id === newPart.id ? newPart : p))
      : [...parts, { ...newPart, id: Date.now().toString() }];
    onUpdateParts(updated);
    setDialogOpen(false);
  };

  const deletePart = (id: string) => {
    onUpdateParts(parts.filter(p => p.id !== id));
  };

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-6 bg-gray-100 p-2 font-semibold text-sm">
        <span>Part #</span>
        <span>Name</span>
        <span>Warehouse</span>
        <span>Qty</span>
        <span>On-Hand</span>
        <span>Actions</span>
      </div>

      {parts.map(part => (
        <div key={part.id} className="grid grid-cols-6 p-2 border-b items-center text-sm">
          <span>{part.partNumber}</span>
          <span>{part.name}</span>
          <span>{part.warehouse}</span>
          <span>{part.quantityUsed}</span>
          <span>{part.onHandQuantity}</span>
          <div className="space-x-1">
            <Button variant="ghost" size="icon" onClick={() => { setEditPart(part); setDialogOpen(true); }}>
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deletePart(part.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}

      <Button className="w-full mt-2" onClick={() => { setEditPart(null); setDialogOpen(true); }}>
        <Plus size={16} className="mr-2" />
        Add Part
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <PartForm
            part={editPart}
            onSave={savePart}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
 
const partOptions = catalog.map(c => ({
  name: c.partNumber,
  id: c.partNumber,
}));

const schema = z.object({
  partNumber: z.string().min(1, "Select a part number"),
  quantityUsed: z.coerce.number().min(1, "Must be at least 1"),
});

type FormValues = z.infer<typeof schema>;

export  function PartForm({
  part,
  onSave,
}: {
  part: PartType | null;
  onSave: (p: PartType) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      partNumber: part?.partNumber || "",
      quantityUsed: part?.quantityUsed || 1,
    },
  });

  // Find selected part details
  const selectedPart = catalog.find(c => c.partNumber === form.watch("partNumber"));

  useEffect(() => {
    if (part) {
      form.reset({
        partNumber: part.partNumber,
        quantityUsed: part.quantityUsed,
      });
    }
  }, [part, form]);

  const handleSubmit = (data: FormValues) => {
    const selected = catalog.find(p => p.partNumber === data.partNumber);
    if (!selected) return;

    onSave({
      id: part?.id || Date.now().toString(),
      partNumber: selected.partNumber,
      name: selected.name,
      warehouse: selected.warehouse,
      quantityUsed: data.quantityUsed,
      onHandQuantity: selected.onHandQuantity,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <ComboboxFieldWrapper
        control={form.control}
        name="partNumber"
        label="Part Number"
        options={partOptions}
        required
        searchPlaceholder="Search Part..."
      />

      <InputWrapper
        control={form.control}
        name="name"
        label="Name"
        value={selectedPart?.name || ""}
        disabled
      />

      <InputWrapper
        control={form.control}
        name="warehouse"
        label="Warehouse"
        value={selectedPart?.warehouse || ""}
        disabled
      />

      <InputWrapper
        control={form.control}
        name="quantityUsed"
        label="Quantity Used"
        type="number" 
      />

      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}