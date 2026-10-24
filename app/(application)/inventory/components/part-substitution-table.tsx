"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";

export interface PartTableInterface {
  id: string;
  inventory_id: string;
  part_number: string;
  name: string;
  manufacturer_id: string | null;
  description: string;
  created_by: unknown;
  updated_by: unknown;
  created_at: string;
  updated_at: string;
}

export type PartSubstitutionRow = {
  part_number: string;
  name: string;
  manufacturer_id: string;
  description: string;
};

export default function PartSubstitutionTable({
  parts,
  value = [],
  onChange,
}: {
  parts: PartTableInterface[];
  value?: PartSubstitutionRow[];
  onChange: (rows: PartSubstitutionRow[]) => void;
}) {
  const rows = value ?? [];

  const handleAddRow = () => {
    onChange([
      ...rows,
      { part_number: "", name: "", manufacturer_id: "", description: "" },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof PartSubstitutionRow,
    val: string
  ) => {
    const updated = rows.map((row, i) => {
      if (i !== index) return row;
      return { ...row, [field]: val };
    });

    if (field === "part_number") {
      const selected = parts.find((p) => p.part_number === val);
      if (selected) {
        updated[index] = {
          part_number: selected.part_number,
          name: selected.name,
          manufacturer_id: String(selected.manufacturer_id ?? ""),
          description: selected.description,
        };
      }
    }

    onChange(updated);
  };

  const handleDelete = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-paragraph-sm text-text-sub-600">
          Link alternate parts that can replace this item when primary stock is
          unavailable.
        </p>
        <Button
          type="button"
          size="sm"
          variant="primary"
          className="shrink-0"
          onClick={handleAddRow}
        >
          <Plus className="mr-2 size-4" />
          Add substitution
        </Button>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-md ring-1 ring-inset ring-stroke-soft-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[9rem]">Part #</TableHead>
              <TableHead className="min-w-[8rem]">Name</TableHead>
              <TableHead className="min-w-[7rem]">Manufacturer</TableHead>
              <TableHead className="min-w-[10rem]">Description</TableHead>
              <TableHead className="w-[5.5rem] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-paragraph-sm text-text-sub-600"
                >
                  No substitutions yet. Add a part to define alternates.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={`${row.part_number}-${index}`}>
                  <TableCell className="align-middle">
                    <Select
                      value={row.part_number || undefined}
                      onValueChange={(val) =>
                        handleChange(index, "part_number", val)
                      }
                    >
                      <SelectTrigger className="h-9 w-full min-w-[8rem]">
                        <SelectValue placeholder="Select part #" />
                      </SelectTrigger>
                      <SelectContent>
                        {parts.map((item) => (
                          <SelectItem
                            key={item.part_number}
                            value={item.part_number}
                          >
                            {item.part_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "align-middle text-paragraph-sm",
                      row.name ? "text-text-strong-950" : "text-text-soft-400"
                    )}
                  >
                    {row.name || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "align-middle text-paragraph-sm",
                      row.manufacturer_id
                        ? "text-text-sub-600"
                        : "text-text-soft-400"
                    )}
                  >
                    {row.manufacturer_id || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "align-middle text-paragraph-sm max-w-[14rem] truncate",
                      row.description
                        ? "text-text-sub-600"
                        : "text-text-soft-400"
                    )}
                    title={row.description || undefined}
                  >
                    {row.description || "—"}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="Remove substitution"
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(index)}
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
    </div>
  );
}
