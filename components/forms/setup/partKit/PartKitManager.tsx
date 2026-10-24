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
import PartKitDialog from "./PartKitDialog";
import PartKitPartsTable from "./PartKitPartsTable";
import { FilePenIcon, Trash2, Plus } from "lucide-react";
import { useRef, useState } from "react";
import type { PartKitPartsTableHandle } from "./PartKitPartsTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const initial: PartKitType[] = [
  {
    id: "1",
    name: "Quarterly Equipment Inspection",
    notes: "Includes checks for electrical, mechanical, and safety systems.",
    trackByDate: true,
    trackByMeterPrimary: true,
    meterPrimaryType: "hour",
    trackByMeterSecondary: false,
    meterSecondaryType: null,
  },
];

type PartKitManagerProps = {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
};

export default function PartKitManager({
  formId = "part-kits-form",
  hideSubmitButton = false,
  onSuccess,
}: PartKitManagerProps) {
  const form = useForm<PartKitsSubmission>({
    resolver: zodResolver(PartKitsSchema),
    defaultValues: { partKits: initial },
  });

  const [selectedId, setSelectedId] = useState(initial[0].id);
  const partKits = form.watch("partKits");
  const selected = partKits.find((k) => k.id === selectedId);
  const [editDialog, setEditDialog] = useState<PartKitType | null>(null);
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const partsTableRef = useRef<PartKitPartsTableHandle>(null);

  const updateKit = (kit: Partial<PartKitType> & { id?: string }) => {
    const current = form.getValues("partKits");
    if (kit.id) {
      form.setValue(
        "partKits",
        current.map((k) => (k.id === kit.id ? { ...k, ...kit } : k))
      );
    } else {
      const newKit = {
        ...kit,
        id: Date.now().toString(),
        parts: [],
      } as PartKitType;
      form.setValue("partKits", [...current, newKit]);
      setSelectedId(newKit.id);
    }
    setKitDialogOpen(false);
  };

  const openAddKit = () => {
    setEditDialog(null);
    setKitDialogOpen(true);
  };

  const handleSubmit = (data: PartKitsSubmission) => {
    console.log(data);
    toast.success("Part kits saved.");
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
                Kits
              </span>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={openAddKit}
              >
                <Plus className="mr-2 size-4" />
                Add Kit
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-bg-white-0">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[5.5rem] text-right">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partKits.map((kit) => (
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
                        <div className="flex flex-row justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              setEditDialog(kit);
                              setKitDialogOpen(true);
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
                <div className="flex shrink-0 items-center justify-between gap-2">
                  <p className="text-label-md font-medium text-text-strong-950">
                    {selected.name}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => partsTableRef.current?.openAddPart()}
                  >
                    <Plus className="mr-2 size-4" />
                    Add Part
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-auto">
                  <PartKitPartsTable
                    ref={partsTableRef}
                    parts={selected.parts}
                    onUpdateParts={(updated) => {
                      form.setValue(
                        "partKits",
                        form
                          .getValues("partKits")
                          .map((k) =>
                            k.id === selected.id ? { ...k, parts: updated } : k
                          )
                      );
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-paragraph-sm text-text-sub-600">
                Select a kit to view and edit its parts.
              </p>
            )}
          </div>
        </div>

        {!hideSubmitButton && (
          <div className="mt-4 flex shrink-0 justify-end">
            <Button type="submit" variant="primary">
              Save Part Kits
            </Button>
          </div>
        )}
      </form>

      <PartKitDialog
        open={kitDialogOpen}
        onOpenChange={setKitDialogOpen}
        initialData={editDialog}
        onSave={updateKit}
      />
    </Form>
  );
}
