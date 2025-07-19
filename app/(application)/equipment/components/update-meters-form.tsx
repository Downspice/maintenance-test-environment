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

export default function UpdateMeters() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    identification: true,
    assignment: false,
    purchase: false,
    additionalDetails: false,
  });

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      status: "Active",
      renewalInterval: 1,
      primaryMeter: 0,
      secondaryMeter: 0,
      purchasePrice: 0,
      salvagePrice: 0,
      depreciationLifeMonths: 0,
      warrantyDescription: "Primary",
      secondaryWarrantyDescription: "Secondary",
      mviInterval: 1,
      ownership: "Owned",
      fuelVolumeUnits: "Gallons",
      annualOperatingBudget: 0,
      hasMeter: false,
    },
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const watchHasMeter = form.watch("hasMeter");
  const watchStatus = form.watch("status");
  const watchPrimary = form.watch("primaryMeterUnit");
  const watchSecondary = form.watch("secondaryMeterUnit");

  function onSubmit(data: EquipmentFormValues) {
    console.log("Form submitted with VALUES:", data);

  
    toast("Project created successfully!", {
      duration: 10000,
    });

    setOpen(false);
    form.reset();
  }

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

        <EditableDataTable
          data={data}
          columns={columns}
          onDataChange={(newData) => {
            console.log("Updated Data:", newData);
          }}
        />
      </SheetContent>
    </Sheet>
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
