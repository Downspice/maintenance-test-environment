"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Camera, Save, WrenchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
// Form wrappers
import InputWrapper from "@/components/forms/fields/InputWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
// Schema and types
import { assigneeOptions } from "@/lib/schemas/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import {
  conditionOptionsList,
  equipmentOptionsList,
} from "@/lib/shared/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import { Checkbox } from "@/components/ui/checkbox";
import NewRepairRequestForm from "../actions/more/repairRequest/repairRequestForm";
import { z } from "zod";

// Editable table row type
export const inspectionItemSchema = z.object({
  id: z.coerce.number(),
  ok: z.string(),
  fault: z.string(),
  inspection: z.string(),
  laborTime: z.coerce.number(),
  notes: z.string(),
});

// Main inspection form schema
export const inspectionFormSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  inspectedBy: z.string().min(1, "Inspected By is required"),
  dueDate: z.string().min(1, "Date is required"),
  units: z.coerce.number().min(0, "Units required"),
  condition: z.string().min(1, "Condition is required"),
  conditionNotes: z.string().optional(),
  inspectionItems: z.array(inspectionItemSchema).optional(),
});

export type InspectionFormValues = z.infer<typeof inspectionFormSchema>;
export type InspectionItem = z.infer<typeof inspectionItemSchema>;

interface InspectionFormProps {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
}

export default function InspectionForm({
  formId = "new-inspection-form",
  hideSubmitButton,
  onSuccess,
}: InspectionFormProps = {}) {
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {},
  });

  function onSubmit(data: InspectionFormValues) {
    console.log("Form submitted with VALUES:", data);
    toast("Project created successfully!", {
      duration: 10000,
    });

    form.reset();
    onSuccess?.();
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
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col">
          <div className="grid grid-cols-2 space-x-3">
            <div className="col-span-1 flex flex-col">
              <ComboboxFieldWrapper
                control={form.control}
                name="equipment"
                label="Equipment"
                options={equipmentOptionsList}
              />
              <ComboboxFieldWrapper
                control={form.control}
                name="inspectedBy"
                label="Inspected By"
                options={assigneeOptions}
              />
              <DatePickerWrapper
                control={form.control}
                name="dueDate"
                label="Date"
              />
              <InputWrapper
                control={form.control}
                name={"units"}
                label={"Units"}
                value={""}
                type="number"
              />
              <ComboboxFieldWrapper
                control={form.control}
                name="condition"
                label="Condition"
                options={conditionOptionsList}
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <TextareaWrapper
                control={form.control}
                name="condition"
                label="Condition"
                value={""}
              />
            </div>
          </div>

          <Fieldset
            legend="Inspection Items"
            content={
              <EditableDataTable
                data={people}
                columns={columns}
                defaultRow={{ id: Date.now(), ok: "", email: "" }}
                onDataChange={(newData) => {
                  console.log("Updated Data:", newData);
                }}
              />
            }
          />
        </div>
        {!hideSubmitButton && (
          <div className="flex justify-end">
            <Button type="submit" className="min-w-32 my-4 w-full">
              <Save className="mr-2 h-4 w-4" />
              Create Inspection
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

const people = [{}];

type RepairRequestInterface = {
  id: number;
  ok: string;
  fault: string;
  inspection: string;
  laborTime: number;
  notes: string;
};

export const columns: ColumnDef<RepairRequestInterface>[] = [
  {
    accessorKey: "ok",
    header: "OK",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Checkbox
        value={row.original.ok}
        onCheckedChange={(e) => updateRow(rowIndex, "ok", e)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "fault",
    header: "Fault",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Checkbox
        value={row.original.fault}
        onCheckedChange={(e) => updateRow(rowIndex, "fault", e)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "inspection",
    header: "Inspection",

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row, updateRow, rowIndex }: any) => (
      <Input
        value={row.original.notes || ""}
        onChange={(e) => updateRow(rowIndex, "notes", e.target.value)}
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <InspectionActionCell person={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];

function InspectionActionCell({ person }: { person: RepairRequestInterface }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => alert(`upload the picture ${person.ok}`)}
      >
        <Camera />
      </Button>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button type="button" className="flex items-center gap-2">
            <WrenchIcon className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className=" ">
          <SheetHeader>
            <SheetTitle>New Repair Request</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
            <NewRepairRequestForm />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function EditInspectionForm({
  children,
  data,
  onEdit, // optional callback
}: {
  children: React.ReactNode;
  data: any;
  onEdit?: (data: any) => void; // optional
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: data,
  });

  function onSubmit(data: InspectionFormValues) {
    console.log("Form submitted with VALUES:", data);
    toast("Project created successfully!", {
      duration: 10000,
    });

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Fluid consumption</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div className="flex flex-col">
                <div className="grid grid-cols-2 space-x-3">
                  <div className="col-span-1 flex flex-col">
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="equipment"
                      label="Equipment"
                      options={equipmentOptionsList}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="inspectedBy"
                      label="Inspected By"
                      options={assigneeOptions}
                    />
                    <DatePickerWrapper
                      control={form.control}
                      name="dueDate"
                      label="Date"
                    />
                    <InputWrapper
                      control={form.control}
                      name={"units"}
                      label={"Units"}
                      value={""}
                      type="number"
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="condition"
                      label="Condition"
                      options={conditionOptionsList}
                    />
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <TextareaWrapper
                      control={form.control}
                      name="condition"
                      label="Condition"
                      value={""}
                    />
                  </div>
                </div>

                <Fieldset
                  legend="Inspection Items"
                  content={
                    <EditableDataTable
                      data={people}
                      columns={columns}
                      defaultRow={{ id: Date.now(), ok: "", email: "" }}
                      onDataChange={(newData) => {
                        console.log("Updated Data:", newData);
                      }}
                    />
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="min-w-32 my-4 w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Create Inspection
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
