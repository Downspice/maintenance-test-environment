"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableRowActions } from "@/components/ui/table-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MeterReplacementDrawer,
  type MeterReplacementFormValues,
} from "@/components/forms/entities/equipment/MeterReplacement";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";

type MeterReplacementRow = {
  id: string;
  replaceDate: string;
  currentMeter: string;
  replacementMeter: string;
  description: string;
};

const initialRows: MeterReplacementRow[] = [
  {
    id: "1",
    replaceDate: "2025-07-01",
    currentMeter: "12345",
    replacementMeter: "67890",
    description: "Replaced due to malfunction during diagnostics",
  },
  {
    id: "2",
    replaceDate: "2025-07-05",
    currentMeter: "23456",
    replacementMeter: "78901",
    description: "Preventive replacement after 10,000 hours",
  },
  {
    id: "3",
    replaceDate: "2025-07-10",
    currentMeter: "34567",
    replacementMeter: "89012",
    description: "Old meter inaccurate, replaced with new unit",
  },
  {
    id: "4",
    replaceDate: "2025-07-15",
    currentMeter: "45678",
    replacementMeter: "90123",
    description: "Meter",
  },
];

function rowToFormValues(row: MeterReplacementRow): MeterReplacementFormValues {
  return {
    equipment: "excavator",
    meterType: "primary",
    date: row.replaceDate,
    currentReading: Number(row.currentMeter) || 0,
    replacement: Number(row.replacementMeter) || 0,
    description: row.description,
  };
}

export function MeterReplacementTab() {
  const confirmDialog = useConfirmDialog();
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MeterReplacementRow | null>(
    null
  );

  const filteredData = rows.filter((item) =>
    item.replacementMeter.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (row: MeterReplacementRow) => {
    const ok = await confirmDialog({
      title: "Delete meter replacement?",
      description: `Remove the replacement recorded on ${row.replaceDate}?`,
      confirmText: "Delete replacement",
      tone: "danger",
      item: {
        name: `Replacement ${row.replacementMeter}`,
        description: row.description || undefined,
      },
    });
    if (ok) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const openEdit = (row: MeterReplacementRow) => {
    setEditingRow(row);
    setEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter replacements..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <MeterReplacementDrawer trigger={<Button type="button">Add</Button>} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Replace Date</TableHead>
              <TableHead>Current Meter</TableHead>
              <TableHead>Replacement Meter</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[5.5rem] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.replaceDate}</TableCell>
                <TableCell>{item.currentMeter}</TableCell>
                <TableCell>{item.replacementMeter}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right align-middle">
                  <TableRowActions
                    editLabel="Edit meter replacement"
                    deleteLabel="Delete meter replacement"
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingRow ? (
        <MeterReplacementDrawer
          open={editOpen}
          onOpenChange={(next) => {
            setEditOpen(next);
            if (!next) setEditingRow(null);
          }}
          title="Edit meter replacement"
          description="Update meter replacement details."
          defaultValues={rowToFormValues(editingRow)}
        />
      ) : null}
    </div>
  );
}
