"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewMeterReplacementForm, {
  UpdateMeterReplacementForm,
} from "@/components/forms/entities/equipment/MeterReplacement";

const sampleMeterReplacement = [
  {
    replaceDate: "2025-07-01",
    currentMeter: "12345",
    replacementMeter: "67890",
    description: "Replaced due to malfunction during diagnostics",
  },
  {
    replaceDate: "2025-07-05",
    currentMeter: "23456",
    replacementMeter: "78901",
    description: "Preventive replacement after 10,000 hours",
  },
  {
    replaceDate: "2025-07-10",
    currentMeter: "34567",
    replacementMeter: "89012",
    description: "Old meter inaccurate, replaced with new unit",
  },
  {
    replaceDate: "2025-07-15",
    currentMeter: "45678",
    replacementMeter: "90123",
    description: "Meter",
  },
];

export function MeterReplacementTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleMeterReplacement.filter((item) =>
    item.replacementMeter.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter Fuel..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add</Button>
          </SheetTrigger>
          <SheetContent className="w-1/4">
            <SheetHeader>
              <SheetTitle>Add New Fuel</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <NewMeterReplacementForm />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Replace Date</TableHead>
              <TableHead>Current Meter</TableHead>
              <TableHead>Replacement Meter</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.replaceDate}>
                <TableCell>{item.replaceDate}</TableCell>
                <TableCell>{item.currentMeter}</TableCell>
                <TableCell>{item.replacementMeter}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right space-x-2 w-px whitespace-nowrap" style={{ width: "1%" }}>
                  <UpdateMeterReplacementForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={item}
                  />
                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
