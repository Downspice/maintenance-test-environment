"use client";
import { Plus } from "lucide-react";
import { TableRowActions } from "@/components/ui/table-row-actions";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  AddMaintenanceInWorkOrderInterface,
  Part,
} from "@/lib/domains/work-order/workOrder-data";
import AddPart from "@/components/forms/entities/work-order/add-parts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { toast } from "sonner";

export default function PartsTab({
  workOrderParts,
  maintenanceItems,
  onUpdateParts,
}: {
  workOrderParts: Part[];
  maintenanceItems: AddMaintenanceInWorkOrderInterface[];
  onUpdateParts: (parts: Part[]) => void;
}) {
  const confirmDialog = useConfirmDialog();
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
    (async () => {
      const ok = await confirmDialog({
        title: "Delete part?",
        description: `Delete part ${part.partNumber}?`,
        confirmText: "Delete",
      })
      if (ok) {
        const updatedParts = workOrderParts.filter(
          (p) => p.partNumber !== part.partNumber
        );
        onUpdateParts(updatedParts);
        toast.success("Part deleted")
      }
    })()
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
                  <TableCell className="p-2">${part.unit_cost}</TableCell>
                  <TableCell className="p-2">${part.totalCost}</TableCell>
                  <TableCell className="p-2 text-right">
                    {isEditable ? (
                      <TableRowActions
                        onEdit={() => {
                          setEditingPart(part);
                          setEditIndex(
                            idx -
                              maintenanceItems.flatMap((m) => m.parts || [])
                                .length
                          );
                          setDialogOpen(true);
                        }}
                        onDelete={() => handleDelete(part)}
                      />
                    ) : null}
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
