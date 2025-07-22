

"use client";

import { useState } from "react";
import {
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

// Form wrappers

// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
} from "@/lib/equipment-schema";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ComboboxOption,
} from "@/components/forms/wrappers/ComboboxWrapper";
import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";

export default function UpdateMetersTable() {
  
  return ( 
        <EditableDataTable
          data={data}
          columns={columns}
          onDataChange={(newData) => {
            console.log("Updated Data:", newData);
          }}
        /> 
  );
}


export interface MeterReading {
  equipment: string;
  unit: string;
  plate: string;
  prior: number;
  current: number;
  measure: string; // e.g. "hours", "kms"
  lastUpdated: string; // ISO date string
}

const columns = [
  {
    header: " ",
    columns: [
      {
        accessorKey: "equipment",
        header: "Equipment",
        enableSorting: true,
      },
      {
        accessorKey: "unit",
        header: "Unit",
        enableSorting: true,
      },
      {
        accessorKey: "plate",
        header: "plate",
        enableSorting: true,
      },
    ],
  },
  {
    header: "Meter ",
    columns: [
      {
        accessorKey: "prior",
        header: "Prior",
        // cell: ({ row, updateRow, rowIndex }: any) => (
        //   <Input
        //     value={row.original.driver}
        //     onChange={(e) => updateRow(rowIndex, "driver", e.target.value)}
        //   />
        // ),
        enableSorting: true,
      },
      {
        accessorKey: "current",
        header: "Current",
        cell: ({ row, updateRow, rowIndex }: any) => (
          <Input
            value={row.original.current}
            onChange={(e) => updateRow(rowIndex, "current", e.target.value)}
          />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "measure",
        header: "",
        enableSorting: true,
      },
    ],
  },
  {
    header: " ",
    columns: [
      {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        enableSorting: true,
      },
    ],
  },
];

const data: MeterReading[] = [
  {
    equipment: "Excavator ZX350",
    unit: "ZX350-21",
    plate: "GT-5120-22",
    prior: 1250,
    current: 1345,
    measure: "hours",
    lastUpdated: "2025-06-19T14:23:00Z",
  },
  {
    equipment: "Bulldozer D8R",
    unit: "CAT-D8R-18",
    plate: "GE-3302-20",
    prior: 3420,
    current: 3590,
    measure: "hours",
    lastUpdated: "2025-06-18T10:11:00Z",
  },
  {
    equipment: "Backhoe Loader 416F",
    unit: "CAT416F-09",
    plate: "GR-1205-19",
    prior: 910,
    current: 980,
    measure: "hours",
    lastUpdated: "2025-06-17T08:47:00Z",
  },
  {
    equipment: "Grader 140G",
    unit: "CAT140G-15",
    plate: "GN-4101-21",
    prior: 2500,
    current: 2600,
    measure: "kms",
    lastUpdated: "2025-06-20T17:00:00Z",
  },
  {
    equipment: "Compactor CS44B",
    unit: "CAT-CS44B-12",
    plate: "GS-2211-23",
    prior: 1125,
    current: 1188,
    measure: "hours",
    lastUpdated: "2025-06-21T06:30:00Z",
  },
];
