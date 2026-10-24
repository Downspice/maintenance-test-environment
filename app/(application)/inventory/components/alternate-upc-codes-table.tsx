"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { GenericObject } from "@/types/types";

export type AlternateUpcRow = {
  manufacturer_id: string;
  vendor_id: string;
  upc: string;
};

export default function AlternateUpcCodesTable({
  manufacturers,
  vendors,
  value = [],
  onChange,
}: {
  manufacturers: GenericObject[];
  vendors: GenericObject[];
  value?: AlternateUpcRow[];
  onChange: (rows: AlternateUpcRow[]) => void;
}) {
  const rows = value ?? [];

  const handleAddRow = () => {
    onChange([...rows, { manufacturer_id: "", vendor_id: "", upc: "" }]);
  };

  const handleChange = (
    index: number,
    field: keyof AlternateUpcRow,
    val: string
  ) => {
    const updated = rows.map((row, i) => {
      if (i !== index) return row;
      return { ...row, [field]: val };
    });
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-paragraph-sm text-text-sub-600">
          Manage alternate UPC barcodes and vendor-specific codes for this
          inventory part.
        </p>
        <Button
          type="button"
          size="sm"
          variant="primary"
          className="shrink-0"
          onClick={handleAddRow}
        >
          <Plus className="mr-2 size-4" />
          Add UPC code
        </Button>
      </div>

      <div className="min-w-0 overflow-x-auto ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[10rem]">Manufacturer</TableHead>
              <TableHead className="min-w-[10rem]">Vendor</TableHead>
              <TableHead className="min-w-[10rem]">UPC</TableHead>
              <TableHead className="w-[5.5rem] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-paragraph-sm text-text-sub-600"
                >
                  No alternate UPC codes added yet. Add a code to define
                  alternate barcodes.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="align-middle">
                    <Select
                      value={row.manufacturer_id || undefined}
                      onValueChange={(val) =>
                        handleChange(index, "manufacturer_id", val)
                      }
                    >
                      <SelectTrigger className="h-9 w-full min-w-[8rem]">
                        <SelectValue placeholder="Select Manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers.map((item) => (
                          <SelectItem key={item.id} value={item.id ?? ""}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="align-middle">
                    <Select
                      value={row.vendor_id || undefined}
                      onValueChange={(val) =>
                        handleChange(index, "vendor_id", val)
                      }
                    >
                      <SelectTrigger className="h-9 w-full min-w-[8rem]">
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((item) => (
                          <SelectItem key={item.id} value={item.id ?? ""}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="align-middle">
                    <Input
                      className="h-9 w-full min-w-[8rem]"
                      value={row.upc}
                      onChange={(e) =>
                        handleChange(index, "upc", e.target.value)
                      }
                      placeholder="Enter UPC"
                    />
                  </TableCell>

                  <TableCell className="align-middle">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="Remove UPC code"
                        className="text-destructive focus:text-destructive shadow-none"
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
