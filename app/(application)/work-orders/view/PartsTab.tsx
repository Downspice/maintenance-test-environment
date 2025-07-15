"use client"
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { AddMaintenanceInWorkOrderInterface, Part } from "@/lib/WorkOrder/workOrder-data";
import AddPart from "../forms/add-parts";
 
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
    maintenanceItems.some((m) => m.parts?.some((p) => p.partNumber === part.partNumber));

  const handleDelete = (part: Part) => {
    if (confirm(`Delete part ${part.partNumber}?`)) {
      console.log("Deleted part:", part.partNumber);
      const updatedParts = workOrderParts.filter((p) => p.partNumber !== part.partNumber);
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
            <button
              className="flex items-center gap-2 border px-3 py-1 rounded text-sm hover:bg-muted"
              onClick={() => {
                setEditIndex(null);
                setEditingPart(null);
              }}
            >
              <Plus className="w-4 h-4" /> Add Part
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <AddPart initialValues={editingPart} onSave={handleSavePart} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-2">Part#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Used</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Total</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allParts.map((part, idx) => {
              const isEditable = !isFromMaintenance(part);

              return (
                <tr key={part.partNumber} className="border-t">
                  <td className="p-2">{part.partNumber}</td>
                  <td className="p-2">{part.name}</td>
                  <td className="p-2">{part.quantityUsed}</td>
                  <td className="p-2">₹{part.unitCost}</td>
                  <td className="p-2">₹{part.totalCost}</td>
                  <td className="p-2 text-right space-x-2">
                    {isEditable && (
                      <>
                        <button
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingPart(part);
                            setEditIndex(idx - maintenanceItems.flatMap((m) => m.parts || []).length);
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
