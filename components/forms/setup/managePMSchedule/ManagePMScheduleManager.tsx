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
import PartKitDialog, {
  ManagePMScheduleFormValues,
} from "./ManagePMScheduleDialog";
import { Pencil, Trash2, Plus, Save } from "lucide-react";
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

export default function ManagePMScheduleManager() {
  const form = useForm<PartKitsSubmission>({
    resolver: zodResolver(PartKitsSchema),
    defaultValues: { partKits: initial },
  });

  const [selectedId, setSelectedId] = useState(initial[0].id);
  const selected = form.watch("partKits").find((k) => k.id === selectedId);
  const [editDialog, setEditDialog] = useState<PartKitType | null>(null);
  const [open, setOpen] = useState(false);

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
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-160px)]">
          {" "}
          {/* Adjust 100px as needed */}
          <div className="h-full flex flex-col overflow-hidden">
            <h2 className="font-bold mb-2">Maintenance Schedule Templates</h2>
            <div className="flex-1 overflow-auto border rounded-md h-full">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-26">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {form.watch("partKits").map((kit) => (
                    <TableRow
                      key={kit.id}
                      className={`${selectedId === kit.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedId(kit.id)}
                    >
                      <TableCell>{kit.name}</TableCell>
                      <TableCell className="space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditDialog(kit);
                            setOpen(true);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.setValue(
                              "partKits",
                              form
                                .getValues("partKits")
                                .filter((k) => k.id !== kit.id)
                            );
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => {
                setEditDialog(null);
                setOpen(true);
              }}
            >
              <Plus size={16} className="mr-2" /> Add
            </Button>
          </div>
          <div className="col-span-2 h-full flex flex-col overflow-hidden">
            {selected ? (
              <>
                <h2 className="font-semibold text-lg mb-2">{selected.name}</h2>
                <div className="flex-1 overflow-auto">
                  {/* <DailyInspectionTable/> */}
                  {/* <ManagePMSchedulePartsTab serviceName={selected.name}/> */}
                  {/* <ManageSchedulePMLaborTab serviceName={selected.name}/> */}
                  {/* <ManagePMAdvancedTab /> */}
                  <FullMaintenanceForm/>
                  {/* <PartKitPartsTable
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
                  /> */}
                </div>
              </>
            ) : (
              <p>Select a kit</p>
            )}
          </div>
        </div>

        <div className="flex justify-end  ">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Submit All Kits
          </Button>
        </div>
      </form>

      <PartKitDialog
        open={open}
        onOpenChange={setOpen}
        initialData={editDialog}
        onSave={updateKit}
      />
    </Form>
  );
}
