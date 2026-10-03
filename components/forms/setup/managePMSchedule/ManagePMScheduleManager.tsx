"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PartKitsSchema,
  PartKitsSubmission,
  PartKitType,
} from "@/lib/schemas/part-kits-schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ManagePMScheduleDialog, {
  ManagePMScheduleFormValues,
} from "./ManagePMScheduleDialog";
import { FilePenIcon, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FullMaintenanceForm from "./PMService";
import { toast } from "sonner";

const initial: ManagePMScheduleFormValues[] = [
  {
    id: "33",
    name: "Quarterly Equipment Inspection",
    trackByDate: true,
    trackByMeterPrimary: true,
    meterPrimaryType: "hour",
    trackByMeterSecondary: false,
    meterSecondaryType: undefined,
  },
];

type ManagePMScheduleManagerProps = {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
};

export default function ManagePMScheduleManager({
  formId = "pm-schedule-templates-form",
  hideSubmitButton = false,
  onSuccess,
}: ManagePMScheduleManagerProps) {
  const form = useForm<PartKitsSubmission>({
    resolver: zodResolver(PartKitsSchema),
    defaultValues: { partKits: initial },
  });

  const schedules = form.watch("partKits");
  const [selectedId, setSelectedId] = useState(initial[0].id);
  const selected = schedules.find((k) => k.id === selectedId);
  const [editDialog, setEditDialog] = useState<PartKitType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateSchedule = (kit: ManagePMScheduleFormValues) => {
    const current = form.getValues("partKits");
    if (kit.id) {
      form.setValue(
        "partKits",
        current.map((k) => (k.id === kit.id ? { ...k, ...kit } : k)),
      );
    } else {
      const newKit = {
        ...kit,
        id: Date.now().toString(),
        parts: [],
      } as PartKitType & ManagePMScheduleFormValues;
      form.setValue("partKits", [...current, newKit]);
      setSelectedId(newKit.id);
    }
    setDialogOpen(false);
  };

  const handleSubmit = (data: PartKitsSubmission) => {
    console.log(data);
    toast.success("PM schedule templates saved.");
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(300px,1fr)_2fr]">
          <div className="flex min-h-0 flex-col gap-1">
            <div className="flex shrink-0 items-center justify-between gap-2">
              <span className="text-label-sm font-medium text-text-sub-600">
                Templates
              </span>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={() => {
                  setEditDialog(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 size-4" />
                Add Template
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-bg-white-0">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[5.5rem] text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((kit) => (
                    <TableRow
                      key={kit.id}
                      className={`cursor-pointer ${selectedId === kit.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedId(kit.id)}
                    >
                      <TableCell className="align-middle">{kit.name}</TableCell>
                      <TableCell
                        className="align-middle"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              setEditDialog(kit);
                              setDialogOpen(true);
                            }}
                          >
                            <FilePenIcon className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              const next = form
                                .getValues("partKits")
                                .filter((k) => k.id !== kit.id);
                              form.setValue("partKits", next);
                              if (selectedId === kit.id) {
                                setSelectedId(next[0]?.id ?? "");
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-1">
            {selected ? (
              <>
                <p className="shrink-0 text-label-md font-medium text-text-strong-950">
                  {selected.name}
                </p>
                <div className="min-h-0 flex-1 overflow-auto">
                  <FullMaintenanceForm />
                </div>
              </>
            ) : (
              <p className="text-paragraph-sm text-text-sub-600">
                Select a template to configure parts and labor.
              </p>
            )}
          </div>
        </div>

        {!hideSubmitButton && (
          <div className="mt-4 flex shrink-0 justify-end">
            <Button type="submit" variant="primary">
              Save Templates
            </Button>
          </div>
        )}
      </form>

      <ManagePMScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editDialog}
        onSave={updateSchedule}
      />
    </Form>
  );
}
