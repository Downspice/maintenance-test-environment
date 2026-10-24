"use client";
import { Plus } from "lucide-react";
import { TableRowActions } from "@/components/ui/table-row-actions";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  AddLaborFormValues,
  AddMaintenanceInWorkOrderInterface,
} from "@/lib/domains/work-order/workOrder-data";
import AddLabor from "@/components/forms/entities/work-order/add-labor";
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

export default function LaborTab({
  maintenanceItems,
  laborEntries,
  onUpdateLabor,
}: {
  maintenanceItems: AddMaintenanceInWorkOrderInterface[];
  laborEntries: AddLaborFormValues[];
  onUpdateLabor: (updated: AddLaborFormValues[]) => void;
}) {
  const confirmDialog = useConfirmDialog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLabor, setEditingLabor] = useState<AddLaborFormValues | null>(
    null
  );

  const allLabor = [
    ...(maintenanceItems
      .map((m) => m.labor)
      .filter(Boolean) as AddLaborFormValues[]),
    ...laborEntries,
  ];

  const isFromMaintenance = (labor: AddLaborFormValues) =>
    maintenanceItems.some(
      (m) =>
        m.labor?.technicianName === labor?.technicianName &&
        m.labor?.hours === labor.hours
    );

  const handleDelete = (labor: AddLaborFormValues) => {
    (async () => {
      const ok = await confirmDialog({
        title: "Delete labor entry?",
        description: `Delete labor entry for ${labor?.technicianName}?`,
        confirmText: "Delete",
      });
      if (ok) {
        const updated = laborEntries.filter(
          (l) => l.technicianName !== labor?.technicianName
        );
        onUpdateLabor(updated);
        toast.success("Labor entry deleted");
      }
    })();
  };

  const handleSave = (labor: AddLaborFormValues) => {
    if (editingIndex !== null) {
      const updated = [...laborEntries];
      updated[editingIndex] = labor;
      onUpdateLabor(updated);
    } else {
      onUpdateLabor([...laborEntries, labor]);
    }

    setDialogOpen(false);
    setEditingLabor(null);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Labor</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingLabor(null);
                setEditingIndex(null);
              }}
            >
              <Plus className="w-4 h-4" /> Add Labor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <AddLabor
              initialValues={editingLabor || undefined}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table className="w-full text-sm">
          <TableHeader className=" text-left">
            <TableRow>
              <TableHead className="p-2">Name</TableHead>
              <TableHead className="p-2">Hours</TableHead>
              <TableHead className="p-2">Rate</TableHead>
              <TableHead className="p-2">Total</TableHead>
              <TableHead className="p-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLabor.map((labor, idx) => {
              const isEditable = !isFromMaintenance(labor);
              return (
                <TableRow
                  key={labor?.technicianName + idx}
                  className="border-t"
                >
                  <TableCell className="p-2">{labor?.technicianName}</TableCell>
                  <TableCell className="p-2">{labor.hours}</TableCell>
                  <TableCell className="p-2">${labor.labor_rate}</TableCell>
                  <TableCell className="p-2">${labor.totalCost}</TableCell>
                  <TableCell className="p-2 text-right">
                    {isEditable ? (
                      <TableRowActions
                        onEdit={() => {
                          setEditingLabor(labor);
                          setEditingIndex(
                            idx - maintenanceItems.filter((m) => m.labor).length
                          );
                          setDialogOpen(true);
                        }}
                        onDelete={() => handleDelete(labor)}
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
