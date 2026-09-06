"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { cn } from "@/lib/utils";

export default function MeterUpdatesMoreButton() {
  const [rows, setRows] = useState(meterData);

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse text-sm text-left border">
        <thead>
          <tr>
            <th rowSpan={2} className="border px-4 py-2 bg-muted">Equipment</th>
            <th rowSpan={2} className="border px-4 py-2 bg-muted">Category</th>
            <th colSpan={2} className="border px-4 py-2 bg-muted text-center">Meter 1</th>
            <th colSpan={2} className="border px-4 py-2 bg-muted text-center">Meter 2</th>
            <th rowSpan={2} className="border px-4 py-2 bg-muted">Log Date</th>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-muted">Current</th>
            <th className="border px-4 py-2 bg-muted">New</th>
            <th className="border px-4 py-2 bg-muted">Current</th>
            <th className="border px-4 py-2 bg-muted">New</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{row.equipment}</td>
              <td className="border px-4 py-2">{row.category}</td>
              <td className="border px-4 py-2">{row.meter1.current}</td>
              <td className="border px-4 py-2">
                <Input
                  value={row.meter1.new}
                  onChange={(e) => {
                    const updated = [...rows];
                    updated[index].meter1.new = e.target.value;
                    setRows(updated);
                  }}
                />
              </td>
              <td className="border px-4 py-2">
                {row.meter2?.current ?? <span className="text-muted-foreground italic">—</span>}
              </td>
              <td className="border px-4 py-2">
                {row.meter2 ? (
                  <Input
                    value={row.meter2.new}
                    onChange={(e) => {
                      const updated = [...rows];
                      if (updated[index].meter2) {
                        updated[index].meter2!.new = e.target.value;
                      }
                      setRows(updated);
                    }}
                  />
                ) : (
                  <span className="text-muted-foreground italic">—</span>
                )}
              </td>
              <td className="border px-4 py-2">{row.logDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface MeterRow {
  equipment: string;
  category: string;
  meter1: {
    current: string;
    new: string;
  };
  meter2?: {
    current: string;
    new: string;
  };
  logDate: string;
}

const meterData: MeterRow[] = [
  {
    equipment: "Compressor A",
    category: "Pressure",
    meter1: { current: "250 psi", new: "260 psi" },
    meter2: { current: "87 hrs", new: "90 hrs" },
    logDate: "2025-07-18",
  },
  {
    equipment: "Generator B",
    category: "Voltage",
    meter1: { current: "480 V", new: "482 V" },
    meter2: { current: "123 hrs", new: "126 hrs" },
    logDate: "2025-07-18",
  },
  {
    equipment: "Pump C",
    category: "Flow Rate",
    meter1: { current: "15 L/min", new: "16 L/min" },
    logDate: "2025-07-17", // No meter2
  },
  {
    equipment: "Fan D",
    category: "Speed",
    meter1: { current: "1800 RPM", new: "1850 RPM" },
    meter2: { current: "310 hrs", new: "312 hrs" },
    logDate: "2025-07-17",
  },
];
