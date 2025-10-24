"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import { useGetVendors } from "@/services/setups/vendor";

const equipmentOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Light System", id: "lights" },
];

const employeeOptions = [
  { name: "John Doe", id: "emp1" },
  { name: "Jane Smith", id: "emp2" },
];


const laborSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  service: z.string(),
  mode: z.enum(["assigned", "fixed"]),
  laborType: z.enum(["employee", "vendor"]).optional(),
  laborRef: z.string().optional(),
  rate: z.coerce.number().optional(),
  hours: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
});

type LaborForm = z.infer<typeof laborSchema>;
type LaborRecord = LaborForm & { id: string; name?: string };

type Props = {
  serviceName: string;
};

export default function ManageSchedulePMLaborTab({ serviceName }: Props) {
  const [labors, setLabors] = useState<LaborRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<LaborRecord | null>(null);
    const { data: vendorOptions } = useGetVendors();

  const form = useForm<LaborForm>({
    resolver: zodResolver(laborSchema),
    defaultValues: {
      equipment: "",
      service: serviceName,
      mode: "assigned",
    },
  });

  const { watch, setValue, reset, handleSubmit } = form;
  const mode = watch("mode");
  const laborType = watch("laborType");
  const laborRef = watch("laborRef");

  useEffect(() => {
    if (editingLabor) {
      reset(editingLabor);
    } else {
      reset({
        equipment: "",
        service: serviceName,
        mode: "assigned",
      });
    }
  }, [editingLabor, reset, serviceName]);

  const onSubmit = (data: LaborForm) => {
    const name =
      data.mode === "fixed"
        ? "Fixed Cost"
        : laborType === "employee"
        ? employeeOptions.find((e) => e.value === data.laborRef)?.label
        : vendorOptions.find((v) => v.value === data.laborRef)?.label;

    if (editingLabor) {
      setLabors((prev) =>
        prev.map((l) =>
          l.id === editingLabor.id
            ? { ...l, rate: data.rate, hours: data.hours, cost: data.cost }
            : l
        )
      );
    } else {
      setLabors((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID(), name: name ?? "-" },
      ]);
    }

    setOpen(false);
    setEditingLabor(null);
    reset();
  };

  const onEdit = (labor: LaborRecord) => {
    setEditingLabor(labor);
    setOpen(true);
  };

  const onDelete = (id: string) => {
    setLabors((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>Add Labor</Button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Equipment</th>
              <th className="p-2">Name</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Labor Hours</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labors.map((labor) => (
              <tr key={labor.id} className="border-t">
                <td className="p-2">{labor.equipment}</td>
                <td className="p-2">{labor.name ?? "-"}</td>
                <td className="p-2">{labor.rate ?? "-"}</td>
                <td className="p-2">{labor.hours ?? "-"}</td>
                <td className="p-2">{labor.cost ?? "-"}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" onClick={() => onEdit(labor)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(labor.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLabor ? "Edit Labor" : "Add Labor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ComboboxFieldWrapper
              control={form.control}
              name="equipment"
              label="Equipment"
              options={equipmentOptions}
              placeholder="Select Equipment"
              emptyText="No equipment found."
              searchPlaceholder="Search equipment..."
            />

            <InputWrapper
              control={form.control}
              name="service"
              label="Service"
              disabled
              type="text"
            />

            <RadioGroupWrapper
              control={form.control}
              name="mode"
              label="Labor Type"
              options={[
                { name: "Assigned Laborer", id: "assigned" },
                { name: "Fixed Cost", id: "fixed" },
              ]}
            />

            {mode === "fixed" ? (
              <InputWrapper
                control={form.control}
                name="cost"
                label="Cost"
                type="number"
                disabled={!!editingLabor}
              />
            ) : (
              <>
                <RadioGroupWrapper
                  control={form.control}
                  name="laborType"
                  label="Performed By"
                  options={[
                    { name: "Employee", id: "employee" },
                    { name: "Vendor", id: "vendor" },
                  ]}
                />

                {laborType === "employee" && (
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="laborRef"
                    label="Employee"
                    options={employeeOptions}
                    placeholder="Select Employee"
                    emptyText="No employee found."
                    searchPlaceholder="Search employees..."
                    disabled={!!editingLabor}
                  />
                )}

                {laborType === "vendor" && (
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="laborRef"
                    label="Vendor"
                    options={vendorOptions}
                    placeholder="Select Vendor"
                    emptyText="No vendor found."
                    searchPlaceholder="Search vendors..."
                    disabled={!!editingLabor}
                  />
                )}

                <InputWrapper
                  control={form.control}
                  name="rate"
                  label="Rate"
                  type="number"
                  disabled={!!editingLabor && mode === "fixed"}
                />

                <InputWrapper
                  control={form.control}
                  name="hours"
                  label="Hours"
                  type="number"
                  disabled={!!editingLabor && mode === "fixed"}
                />
              </>
            )}

            <div className="flex justify-end">
              <Button type="submit">{editingLabor ? "Update" : "Add"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
