"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FilePenIcon, Trash2 } from "lucide-react";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { PartType } from "@/lib/schemas/part-kits-schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const catalog = [
  { partNumber: "P001", name: "Oil Filter", warehouse: "Warehouse A", onHandQuantity: 100 },
  { partNumber: "P002", name: "Brake Pad", warehouse: "Warehouse B", onHandQuantity: 50 },
  { partNumber: "P003", name: "Air Filter", warehouse: "Warehouse C", onHandQuantity: 75 },
];

export type PartKitPartsTableHandle = {
  openAddPart: () => void;
};

const PartKitPartsTable = forwardRef<
  PartKitPartsTableHandle,
  {
    parts: PartType[];
    onUpdateParts: (updated: PartType[]) => void;
  }
>(function PartKitPartsTable({ parts, onUpdateParts }, ref) {
  const [editPart, setEditPart] = useState<PartType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openAddPart: () => {
      setEditPart(null);
      setDialogOpen(true);
    },
  }));

  const savePart = (newPart: PartType) => {
    const updated = editPart
      ? parts.map((p) => (p.id === newPart.id ? newPart : p))
      : [...parts, { ...newPart, id: Date.now().toString() }];
    onUpdateParts(updated);
    setDialogOpen(false);
  };

  const deletePart = (id: string) => {
    onUpdateParts(parts.filter((p) => p.id !== id));
  };

  const rows = parts ?? [];

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-bg-white-0">
            <TableRow>
              <TableHead>Part #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>On-Hand</TableHead>
              <TableHead className="w-[5.5rem] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-paragraph-sm text-text-sub-600"
                >
                  No parts in this kit yet. Use Add Part to include inventory items.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>{part.partNumber}</TableCell>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.warehouse}</TableCell>
                  <TableCell>{part.quantityUsed}</TableCell>
                  <TableCell>{part.onHandQuantity}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setEditPart(part);
                          setDialogOpen(true);
                        }}
                      >
                        <FilePenIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deletePart(part.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <PartForm part={editPart} onSave={savePart} />
        </DialogContent>
      </Dialog>
    </>
  );
});

export default PartKitPartsTable;

const partOptions = catalog.map((c) => ({
  name: c.partNumber,
  id: c.partNumber,
}));

const schema = z.object({
  partNumber: z.string().min(1, "Select a part number"),
  quantityUsed: z.coerce.number().min(1, "Must be at least 1"),
});

type FormValues = z.infer<typeof schema>;

export function PartForm({
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

  const selectedPart = catalog.find((c) => c.partNumber === form.watch("partNumber"));

  useEffect(() => {
    if (part) {
      form.reset({
        partNumber: part.partNumber,
        quantityUsed: part.quantityUsed,
      });
    }
  }, [part, form]);

  const handleSubmit = (data: FormValues) => {
    const selected = catalog.find((p) => p.partNumber === data.partNumber);
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
        type=""
      />

      <InputWrapper
        control={form.control}
        name="warehouse"
        label="Warehouse"
        value={selectedPart?.warehouse || ""}
        disabled
        type=""
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
