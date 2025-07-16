"use client";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  AddMaintenanceInWorkOrderInterface,
  Part,
} from "@/lib/WorkOrder/workOrder-data";
import AddPart from "../forms/add-parts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function PartsTab({
  workOrderParts,
  maintenanceItems,
  onUpdateParts,
}: {
  workOrderParts: Part[];
  maintenanceItems: AddMaintenanceInWorkOrderInterface[];
  onUpdateParts: (parts: Part[]) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  const allParts = [
    ...maintenanceItems.flatMap((item) => item.parts || []),
    ...workOrderParts,
  ];

  const isFromMaintenance = (part: Part) =>
    maintenanceItems.some((m) =>
      m.parts?.some((p) => p.partNumber === part.partNumber)
    );

  const handleDelete = (part: Part) => {
    if (confirm(`Delete part ${part.partNumber}?`)) {
      console.log("Deleted part:", part.partNumber);
      const updatedParts = workOrderParts.filter(
        (p) => p.partNumber !== part.partNumber
      );
      onUpdateParts(updatedParts);
    }
  };

  const handleSavePart = (newPart: Part) => {
    if (editIndex !== null) {
      const updated = [...workOrderParts];
      updated[editIndex] = newPart;
      onUpdateParts(updated);
    } else {
      onUpdateParts([...workOrderParts, newPart]);
    }

    setDialogOpen(false);
    setEditingPart(null);
    setEditIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Parts</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"secondary"}
              onClick={() => {
                setEditIndex(null);
                setEditingPart(null);
              }}
            >
              <Plus className="w-4 h-4" /> Add Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <AddPart initialValues={editingPart} onSave={handleSavePart} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table  >
          <TableHeader  >
            <TableRow>
              <TableHead className="p-2">Part#</TableHead>
              <TableHead className="p-2">Name</TableHead>
              <TableHead className="p-2">Used</TableHead>
              <TableHead className="p-2">Cost</TableHead>
              <TableHead className="p-2">Total</TableHead>
              <TableHead className="p-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allParts.map((part, idx) => {
              const isEditable = !isFromMaintenance(part);

              return (
                <TableRow key={part.partNumber} className="border-t">
                  <TableCell className="p-2">{part.partNumber}</TableCell>
                  <TableCell className="p-2">{part.name}</TableCell>
                  <TableCell className="p-2">{part.quantityUsed}</TableCell>
                  <TableCell className="p-2">${part.unitCost}</TableCell>
                  <TableCell className="p-2">${part.totalCost}</TableCell>
                  <TableCell className="p-2 text-right space-x-2">
                    {isEditable && (
                      <>
                        <button
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingPart(part);
                            setEditIndex(
                              idx -
                                maintenanceItems.flatMap((m) => m.parts || [])
                                  .length
                            );
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(part)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
