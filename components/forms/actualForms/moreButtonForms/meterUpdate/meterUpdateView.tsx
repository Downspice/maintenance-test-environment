"use client";

import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import DatePicker from "@/components/ui/date-picker";

export default function MeterUpdatesMoreButton() {
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

interface MeterReading {
  equipment: string;
  category: string;
  meterOne: string;
  meterTwo: number;
  logDate: string;
}

const columns = [
  {
    accessorKey: "equipment",
    header: "Equipment",
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    enableSorting: true,
  },
  {
    accessorKey: "meterOne",
    header: "Meter One",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.meterOne}
        onChange={(e) => updateRow(rowIndex, "meterOne", e.target.value)}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "meterTwo",
    header: "Meter Two",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.meterTwo}
        onChange={(e) => updateRow(rowIndex, "meterTwo", e.target.value)}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "logDate",
    header: "Log Date",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <DatePicker
        value={row.original.logDate}
        onChange={(e) => updateRow(rowIndex, "logDate", e)}
      />
    ),
    enableSorting: true,
  },
];

const data: MeterReading[] = [
  {
    equipment: "Compressor A",
    category: "Pressure",
    meterOne: "250 psi",
    meterTwo: 87,
    logDate: "2023-07-19",
  },
  {
    equipment: "Generator B",
    category: "Voltage",
    meterOne: "480 V",
    meterTwo: 123,
    logDate: "2025-07-18",
  },
  {
    equipment: "Pump C",
    category: "Flow Rate",
    meterOne: "15 L/min",
    meterTwo: 32,
    logDate: "2025-07-17",
  },
];
