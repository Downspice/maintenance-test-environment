"use client";

import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { ColumnDef } from "@tanstack/react-table";
 import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { locationOptionsList } from "@/lib/option-list";

export default function PhysicalInventoryUpdateMoreButton() {
      const handleSelectChange = (
    key: "equipment" | "location" | "custom",
    value: string
  ) => {
    if (value === "new") {
      console.log("Launching new location modal...");
      return;
    }

    // const updated = { ...filters, [key]: value };
    // setFilters(updated);

    // if (key !== "search") {
    //   buildURL(updated);
    // }
  };
  return (
    <>
    <div className="flex flex-row space-x-0.5">
          <Select onValueChange={(val) => handleSelectChange("location", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              {locationOptionsList.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
    </div>
    <EditableDataTable
      data={data}
      columns={columns}
      onDataChange={(newData) => {
        console.log("Updated Data:", newData);
      }}
    /></>
  );
}

interface PartRow {
  partNumber: string;
  name: string;
  category: string;
  aisle: string;
  row: string;
  bin: string;
  currentQty: number;
  actualQty: number;
  notes: string;
}

const columns: ColumnDef<PartRow>[] = [
  {
    accessorKey: "partNumber",
    header: "Part Number",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    enableSorting: true,
  },
  {
    accessorKey: "aisle",
    header: "Aisle",
    enableSorting: true,
  },
  {
    accessorKey: "row",
    header: "Row",
    enableSorting: true,
  },
  {
    accessorKey: "bin",
    header: "Bin",
    enableSorting: true,
  },
  {
    accessorKey: "currentQty",
    header: "Current Qty",
    enableSorting: true,
  },
  {
    accessorKey: "actualQty",
    header: "Actual Qty",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        type="number"
        value={row.original.actualQty}
        onChange={(e) =>
          updateRow(rowIndex, "actualQty", parseInt(e.target.value) || 0)
        }
      />
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.notes}
        onChange={(e) => updateRow(rowIndex, "notes", e.target.value)}
      />
    ),
  },
];

const data: PartRow[] = [
  {
    partNumber: "PN-1001",
    name: "Bearing",
    category: "Mechanical",
    aisle: "A1",
    row: "R1",
    bin: "B1",
    currentQty: 120,
    actualQty: 115,
    notes: "5 units missing",
  },
  {
    partNumber: "PN-2002",
    name: "Filter",
    category: "Consumable",
    aisle: "A2",
    row: "R3",
    bin: "B4",
    currentQty: 80,
    actualQty: 80,
    notes: "All good",
  },
  {
    partNumber: "PN-3003",
    name: "Belt",
    category: "Mechanical",
    aisle: "A3",
    row: "R2",
    bin: "B2",
    currentQty: 45,
    actualQty: 42,
    notes: "Worn out belts found",
  },
];
