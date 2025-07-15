"use client";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  AddLaborFormValues,
  AddMaintenanceInWorkOrderInterface,
} from "@/lib/WorkOrder/workOrder-data";
import AddLabor from "../forms/add-labor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function LaborTab({
  maintenanceItems,
  laborEntries,
  onUpdateLabor,
}: {
  maintenanceItems: AddMaintenanceInWorkOrderInterface[];
  laborEntries: AddLaborFormValues[];
  onUpdateLabor: (updated: AddLaborFormValues[]) => void;
}) {
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
    if (confirm(`Delete labor entry for ${labor?.technicianName}?`)) {
      console.log("Deleted labor:", labor?.technicianName);
      const updated = laborEntries.filter(
        (l) => l.technicianName !== labor?.technicianName
      );
      onUpdateLabor(updated);
    }
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
                  <TableCell className="p-2">${labor.laborRate}</TableCell>
                  <TableCell className="p-2">${labor.totalCost}</TableCell>
                  <TableCell className="p-2 text-right space-x-2">
                    {isEditable && (
                      <>
                        <button
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingLabor(labor);
                            setEditingIndex(
                              idx -
                                maintenanceItems.filter((m) => m.labor).length
                            );
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(labor)}
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
