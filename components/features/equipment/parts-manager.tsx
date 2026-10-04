"use client";



import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TableRowActions } from "@/components/ui/table-row-actions";


import { useEffect, useState } from "react";
import React from "react";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import { Form } from "@/components/ui/form";




















import {
  useGetEquipmentCommonParts,
} from "@/services/setups/equipments";

const partOptions = [
  {
    name: "Oil Filter (PN-123)",
    id: "PN-123",
    name: "Oil Filter",
    warehouse: "WH1",
    description: "Standard oil filter",
  },
  {
    name: "Hydraulic Fluid (PN-456)",
    id: "PN-456",
    name: "Hydraulic Fluid",
    warehouse: "WH2",
    description: "High pressure fluid",
  },
];

const equipmentOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Light System", id: "lights" },
];

const serviceOptions = [
  { name: "repairTypes", id: "Repair Types" },
  { name: "repairs", id: "Repairs" },
  { name: "taskTypes", id: "Task Types" },
];

const partSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  service: z.string(),
  mode: z.enum(["assigned", "fixed"]),
  partNumber: z.string().optional(),
  name: z.string().optional(),
  warehouse: z.string().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
});

type PartForm = z.infer<typeof partSchema>;
type PartRecord = PartForm & { id: string };

type PartsProps = {
  equipmentId?: string | number;
};

export function PartsManager({ equipmentId }: PartsProps) {
  console.log("equipomen....", equipmentId)
  // Fetch common parts from API
  const { data: parts = [], isLoading } = useGetEquipmentCommonParts(equipmentId || "");

  const [open, setOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PartRecord | null>(null);

  const form = useForm<PartForm>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      equipment: equipmentId?.toString() || "",
      mode: "assigned",
    },
  });

  const { watch, setValue, reset, handleSubmit } = form;
  const mode = watch("mode");
  const partNumber = watch("partNumber");

  useEffect(() => {
    if (editingPart) {
      reset(editingPart);
    } else {
      reset({
        equipment: equipmentId?.toString() || "",
        mode: "assigned",
      });
    }
  }, [editingPart, reset, equipmentId]);

  useEffect(() => {
    if (mode === "assigned" && partNumber) {
      const selected = partOptions.find((p) => p.value === partNumber);
      if (selected) {
        setValue("warehouse", selected.warehouse);
        setValue("name", selected.name);
        setValue("description", selected.description);
      }
    }
  }, [partNumber, mode, setValue]);

  const onSubmit = (data: PartForm) => {
    // TODO: Implement API calls to add/update common part
    console.log("Submit part:", data);
    setOpen(false);
    setEditingPart(null);
    reset();
  };

  const onEdit = (part: PartRecord) => {
    setEditingPart(part);
    setOpen(true);
  };

  const onDelete = (id: string) => {
    // TODO: Implement API call to delete common part
    console.log("Delete part:", id);
  };

  const handleAddNew = () => {
    setEditingPart(null);
    reset({
      equipment: equipmentId?.toString() || "",
      mode: "assigned",
    });
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleAddNew}>
          <Plus className="size-4 mr-2" />
          Add Part
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8">Loading common parts...</div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No common parts found
                  </TableCell>
                </TableRow>
              ) : (
                parts.map((part: any) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.partNumber ?? "N/A"}</TableCell>
                    <TableCell>{part.name ?? "N/A"}</TableCell>
                    <TableCell>{part.description ?? "N/A"}</TableCell>
                    <TableCell>{part.equipment ?? "N/A"}</TableCell>
                    <TableCell>{part.quantity ?? "N/A"}</TableCell>
                    <TableCell>{part.cost ?? "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <TableRowActions
                        onEdit={() => onEdit(part)}
                        onDelete={() => onDelete(part.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal Form */}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={editingPart ? "Edit Part" : "Add Part"}
        description="Fill out the form below to configure the part."
        size="md"
        closeable={true}
        renderActions={
          <Button form="part-form" type="submit" variant="primary">
            {editingPart ? "Update Part" : "Add Part"}
          </Button>
        }
      >
        <Form {...form}>
          <form id="part-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
            <InputWrapper
              control={form.control}
              name="equipment"
              label="Equipment"
              type="number"
              disabled
            />

            <ComboboxFieldWrapper
              control={form.control}
              disabled={!!editingPart}
              name="service"
              label="Service"
              options={serviceOptions}
            />

            <RadioGroupWrapper
              control={form.control}
              name="mode"
              label="Part Type"
              disabled={!!editingPart}
              options={[
                { name: "Assigned Part", id: "assigned" },
                { name: "Fixed Cost", id: "fixed" },
              ]}
            />

            {mode === "fixed" ? (
              <InputWrapper
                control={form.control}
                name="cost"
                label="Cost"
                type="number"
                disabled={!!editingPart}
              />
            ) : (
              <>
                <ComboboxFieldWrapper
                  control={form.control}
                  name="partNumber"
                  label="Part Number"
                  options={partOptions.map((p) => ({
                    name: p.label,
                    id: p.value,
                  }))}
                  placeholder="Select part"
                  emptyText="No part found"
                  searchPlaceholder="Search parts..."
                  disabled={!!editingPart}
                />
                <InputWrapper
                  control={form.control}
                  name="warehouse"
                  label="Warehouse"
                  disabled
                  type="text"
                />
                <InputWrapper
                  control={form.control}
                  name="name"
                  label="Name"
                  disabled
                  type="text"
                />
                <InputWrapper
                  control={form.control}
                  name="description"
                  label="Description"
                  disabled
                  type="text"
                />
                <InputWrapper
                  control={form.control}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  disabled={!!editingPart && mode === "fixed"}
                />
              </>
            )}
          </form>
        </Form>
      </Modal>
    </div >
  );
}

type ImageItem = {
  id: string;
  name: string;
  src: string;
};

