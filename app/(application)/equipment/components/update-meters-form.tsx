"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { ComboboxOption } from "@/components/forms/wrappers/ComboboxWrapper";
import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";
import UpdateMetersTable from "./update-meter-table";

export default function UpdateMeters() {
  const [open, setOpen] = useState(false);

  function onError(errors: any) {
    // Get all error messages
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          unit: "Project Name",
        };

        return `${fieldLabels[field] || field}: ${error.message}`;
      }
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Update Meters</Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Update Meters</SheetTitle>
          <SheetDescription>
            Fill out the form below to Update Meters on equipment.
          </SheetDescription>
        </SheetHeader>

        <UpdateMetersTable />
      </SheetContent>
    </Sheet>
  );
}
