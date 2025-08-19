"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Camera, LucideTrash2, Save } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import {
  assigneeOptions,
} from "@/lib/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import { equipmentOptionsList, locationOptionsList } from "@/lib/option-list";
import { toast } from "sonner";
import {
  ComboboxFieldWrapper, 
} from "@/components/forms/wrappers/ComboboxWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorityOptions } from "../../../app/(application)/work-orders/forms/newWorkOrderFormSheet";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Table row type
export type RepairRequestTableRow = {
  id: number;
  repair: string;
  type: string;
  priority: string;
  laborTime: number;
  notes: string;
};

// Main form type
export type RepairRequestType = {
  equipment: string;
  requestedBy: string;
  dueDate: string;
  repairBy: number;
  repairsNeeded: RepairRequestTableRow[];
};

// Zod schema
export const repairRequestSchema = z.object({
  id:z.any().optional(),
  equipment: z.string().min(1, "Equipment is required"),
  requestedBy: z.string().min(1, "Requested By is required"),
  dueDate: z.string().min(1, "Due Date is required"),
  repairBy: z.coerce.number().optional(),
  repairsNeeded: z
    .array(
      z.object({
        id: z.number(),
        repair: z.string().min(1, "Repair is required"),
        type: z.string().min(1, "Type is required"),
        priority: z.string().min(1, "Priority is required"),
        laborTime: z.coerce.number().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

interface triggerVariant {
  variant?: "icon" | "default";
}
export default function ActualRepairRequestForm({ variant }: triggerVariant) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RepairRequestType>({
    resolver: zodResolver(repairRequestSchema),
    defaultValues: {
    },
  });

  function onSubmit(data: RepairRequestType) {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col">
          <ComboboxFieldWrapper
            control={form.control}
            name="equipment"
            label="Equipment"
            options={equipmentOptionsList}
          />

          <ComboboxFieldWrapper
            control={form.control}
            name="requestedBy"
            label="Requested By"
            options={assigneeOptions}
          />

          <DatePickerWrapper
            control={form.control}
            name="dueDate"
            label="Due Date"
          />

          <InputWrapper
            control={form.control}
            name={"repairBy"}
            label={"Repair By"}
            value={""}
            type="number"
            warning="(meter)"
          />
          
          <Fieldset
            legend="Repairs Needed"
            content={
              <EditableDataTable
                data={people}
                columns={columns}
                defaultRow={{ id: Date.now(), repair: "", email: "" }}
                onDataChange={(newData) => {
                  console.log("Updated Data:", newData);
                }}
              />
            }
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 my-4 w-full"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


 
  export  function EditActualUpdateRepairRequestForm({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: any;
  }) {

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RepairRequestType>({
    resolver: zodResolver(repairRequestSchema),
    defaultValues: data,
  });

  function onSubmit(data: RepairRequestType) {
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
          <SheetTrigger asChild>{children}</SheetTrigger>
          <SheetContent className="w-3/4 ">
            <SheetHeader>
              <SheetTitle>
                <div className="flex justify-between">
                  <div>{data.name}</div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <div>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        
        <div className="flex flex-col">
          <ComboboxFieldWrapper
            control={form.control}
            name="equipment"
            label="Equipment"
            options={equipmentOptionsList}
          />

          <ComboboxFieldWrapper
            control={form.control}
            name="requestedBy"
            label="Requested By"
            options={assigneeOptions}
          />

          <DatePickerWrapper
            control={form.control}
            name="dueDate"
            label="Due Date"
          />

          <InputWrapper
            control={form.control}
            name={"repairBy"}
            label={"Repair By"}
            value={""}
            type="number"
            warning="(meter)"
          />
          
          <Fieldset
            legend="Repairs Needed"
            content={
              <EditableDataTable
                data={people}
                columns={columns}
                defaultRow={{ id: Date.now(), repair: "", email: "" }}
                onDataChange={(newData) => {
                  console.log("Updated Data:", newData);
                }}
              />
            }
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 my-4 w-full"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Equipment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
    </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
  );
}

const people = [{}];

type RepairRequestInterface = {
  id: number;
  repair: string;
  type: string;
  priority: string;
  laborTime: number;
  notes: string;
};

export const columns: ColumnDef<RepairRequestInterface>[] = [
  {
    accessorKey: "repair",
    header: "Repair",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Select
        value={row.original.repair}
        onValueChange={(e) => updateRow(rowIndex, "repair", e)}
      >
        <SelectTrigger className=" ">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          {locationOptionsList.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Select
        value={row.original.type}
        onValueChange={(e) => updateRow(rowIndex, "type", e)}
      >
        <SelectTrigger className=" ">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          {locationOptionsList.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Select
        value={row.original.priority}
        onValueChange={(e) => updateRow(rowIndex, "priority", e)}
      >
        <SelectTrigger className=" ">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "laborTime",
    header: "Labor Time",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.laborTime}
        onChange={(e) => updateRow(rowIndex, "laborTime", e.target.value)}
        type="number"
      />
    ),
    enableSorting: true,
    enableHiding: true,
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
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => alert(`Upload image here`)}
          >
            <Camera />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => alert(`Delete ${person.notes}`)}
          >
            <LucideTrash2 className="text-destructive" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
