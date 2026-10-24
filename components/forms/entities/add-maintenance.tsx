"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RadioGroupWrapper from "../fields/RadioGroupWrapper";
import InputWrapper from "../fields/InputWrapper";
import TextareaWrapper from "../fields/TextareaWrapper";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";
import {
  useGetMaintenanceTaskTypes,
  useGetMaintenanceRepairs,
  useGetMaintenanceRepairTypes,
} from "@/services/setups/maintenance";
import {
  AddMaintenanceInWorkOrderSchema,
  AddMaintenanceInWorkOrderInterface,
  AddPartUsedInterface,
  AddLaborUsedInterface,
} from "@/lib/domains/work-order/workOrder-data";
import AddPartUsed from "./add-part-used";
import AddLaborUsed from "./add-labor-used";
import { toast } from "sonner";
import { GenericObject } from "@/types/types";
import { useGetPMServices } from "@/services/setups/workOrder";

interface AddMaintenanceProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (task: AddMaintenanceInWorkOrderInterface) => void;
  data?: AddMaintenanceInWorkOrderInterface | null;
  unitId?: string; // Unit ID for API submission
  initialParts?: AddPartUsedInterface[];
  initialLabor?: AddLaborUsedInterface[];
}

export default function AddMaintenance({
  open,
  setOpen,
  onAdd,
  data,
  unitId,
  initialParts = [],
  initialLabor = [],
}: AddMaintenanceProps) {
  const { data: pmServices } = useGetPMServices();
  const { data: taskTypes } = useGetMaintenanceTaskTypes<GenericObject[]>();
  const { data: repairTypes } = useGetMaintenanceRepairs<GenericObject[]>(); // "Repair Types" from choice list
  const { data: repairs } = useGetMaintenanceRepairTypes<GenericObject[]>(); // "Repairs" from choice list

  const form = useForm<AddMaintenanceInWorkOrderInterface>({
    resolver: zodResolver(AddMaintenanceInWorkOrderSchema),
    defaultValues: {
      category: "Preventive",
      parts_cost: 0,
      labor_cost: 0,
      total: 0,
      notes: "",
    },
  });

  // Populate form when data changes (edit mode)
  useEffect(() => {
    if (data) {
      form.reset({
        category: data.category || "Preventive",
        task_id: data.task_id || "",
        type_id: data.type_id || "",
        other_task_name: data.other_task_name || "",
        other_type_name: data.other_type_name || "",
        parts_cost: data.parts_cost || 0,
        labor_cost: data.labor_cost || 0,
        total: data.total || 0,
        notes: data.notes || "",
      });
    } else {
      form.reset({
        category: "Preventive",
        parts_cost: 0,
        labor_cost: 0,
        total: 0,
        notes: "",
      });
    }
  }, [data, form]);

  const [parts, setParts] = useState<AddPartUsedInterface[]>([]);
  const [addPartOpen, setAddPartOpen] = useState(false);
  const [labor, setLabor] = useState<AddLaborUsedInterface[]>([]);
  const [addLaborOpen, setAddLaborOpen] = useState(false);

  // Initialize parts and labor from props when in edit mode
  useEffect(() => {
    if (data) {
      if (initialParts.length > 0) setParts(initialParts);
      if (initialLabor.length > 0) setLabor(initialLabor);
    } else {
      // Reset if adding new
      setParts([]);
      setLabor([]);
    }
  }, [data, initialParts, initialLabor]);

  const pmServiceOptions =
    pmServices?.map((service: any) => ({
      id: service.id,
      name: service.pm_service,
    })) || [];

  const selectedTaskId = form.watch("task_id");
  const selectedCategory = form.watch("category");

  // Sync task name and type when task_id changes ONLY for Preventive (if we want auto-fill behavior)
  // The user requirement says "change the type to combobox...".
  // This implies manual selection might be desired or primary.
  // Existing logic was:
  /*
    useEffect(() => {
        if (!pmServices) return;
        const selectedService = pmServices.find((s: any) => s.id === selectedTaskId);
        if (selectedService) {
            form.setValue("task", selectedService.pm_service);
            form.setValue("type_id", selectedService.type?.name || "");
        }
    }, [selectedTaskId, pmServices, form]);
    */
  // I will remove the auto-set of type_id since it is now a combobox.
  // But I should still set the "task" name for display purposes if needed by API,
  // though the API likely uses task_id.

  useEffect(() => {
    if (selectedCategory === "Preventive" && pmServices) {
      const selectedService = pmServices.find(
        (s: any) => s.id === selectedTaskId
      );
      if (selectedService) {
        form.setValue("task", selectedService.pm_service);
      }
    }
    // Logic for Repair category task name if needed?
    // The Schema likely expects 'task_id' and backend handles name, or 'task' hidden field.
    // Let's assume standard behavior is fine.
  }, [selectedTaskId, pmServices, selectedCategory, form]);

  const otherTaskName = form.watch("other_task_name");
  useEffect(() => {
    if (selectedCategory === "Other" && otherTaskName) {
      form.setValue("task", otherTaskName);
    }
  }, [selectedCategory, otherTaskName, form]);

  const partsCost = form.watch("parts_cost");
  const laborCost = form.watch("labor_cost");

  useEffect(() => {
    const total = (Number(partsCost) || 0) + (Number(laborCost) || 0);
    form.setValue("total", total);
  }, [partsCost, laborCost, form]);

  // Calculate parts_cost from added parts
  useEffect(() => {
    const totalPartsCost = parts.reduce(
      (sum, part) => sum + (Number(part.extended_cost) || 0),
      0
    );
    form.setValue("parts_cost", totalPartsCost);
  }, [parts, form]);

  // Calculate labor_cost from added labor
  useEffect(() => {
    const totalLaborCost = labor.reduce(
      (sum, l) => sum + (Number(l.total_cost) || 0),
      0
    );
    form.setValue("labor_cost", totalLaborCost);
  }, [labor, form]);

  const handleAddPart = (part: AddPartUsedInterface) => {
    setParts([...parts, part]);
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleAddLabor = (laborItem: AddLaborUsedInterface) => {
    setLabor([...labor, laborItem]);
  };

  const handleRemoveLabor = (index: number) => {
    setLabor(labor.filter((_, i) => i !== index));
  };

  const categoryOptions = [
    { id: "Preventive", name: "Preventive" },
    { id: "Repair", name: "Repair" },
    { id: "Other", name: "Other" },
  ];

  function handleSubmit(data: AddMaintenanceInWorkOrderInterface) {
    if (!unitId) {
      toast.error("Unit ID is required to add maintenance");
      return;
    }

    // Call the onAdd callback with the data, including parts and labor from local state
    onAdd({
      ...data,
      parts: parts,
      labor: labor,
    });

    // Reset the form and close
    setParts([]);
    setLabor([]);
    form.reset({
      category: "Preventive",
      parts_cost: 0,
      labor_cost: 0,
      total: 0,
      notes: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full sm:max-w-2/5">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Maintenance Service" : "Add New Maintenance Service"}
          </DialogTitle>
          <DialogDescription>
            {data ? "Update the" : "Add a new"} maintenance service details
            below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.error("Form validation errors:", errors);
              toast.error(
                "Please check the form for errors. Required fields might be missing."
              );
            })}
            className="space-y-4 mt-4"
          >
            <RadioGroupWrapper
              control={form.control}
              name="category"
              label=""
              options={categoryOptions}
              orientation="horizontal"
            />

            {selectedCategory === "Preventive" && (
              <>
                <ComboboxFieldWrapper
                  control={form.control}
                  name="task_id"
                  label="Task"
                  options={pmServiceOptions}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="type_id"
                  label="Type"
                  options={taskTypes || []}
                />
              </>
            )}

            {selectedCategory === "Repair" && (
              <>
                <ComboboxFieldWrapper
                  control={form.control}
                  name="task_id"
                  label="Task"
                  options={(repairs || []).map((r: any) => ({
                    id: r.id,
                    name: r.name,
                  }))}
                />
                <ComboboxFieldWrapper
                  control={form.control}
                  name="type_id"
                  label="Type"
                  options={repairTypes || []}
                />
              </>
            )}

            {selectedCategory === "Other" && (
              <>
                <InputWrapper
                  control={form.control}
                  name="other_task_name"
                  label="Task Name"
                  placeholder="Enter task name"
                />
                <InputWrapper
                  control={form.control}
                  name="other_type_name"
                  label="Type Name"
                  placeholder="Enter type name"
                />
              </>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <InputWrapper
                    control={form.control}
                    name="parts_cost"
                    label="Parts Cost"
                    type="number"
                    readOnly
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => setAddPartOpen(true)}
                    size="sm"
                  >
                    Add Part
                  </Button>
                </div>
                {parts.length > 0 && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {parts.map((part, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded"
                      >
                        <span>
                          {part.name} (x{part.quantity})
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-medium">
                            ${Number(part.extended_cost).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePart(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <InputWrapper
                    control={form.control}
                    name="labor_cost"
                    label="Labor Cost"
                    type="number"
                    readOnly
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => setAddLaborOpen(true)}
                    size="sm"
                  >
                    Add Labor
                  </Button>
                </div>
                {labor.length > 0 && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {labor.map((laborItem, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded"
                      >
                        <span>
                          {laborItem.performed_by} ({laborItem.hours}h)
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-medium">
                            ${Number(laborItem.total_cost).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLabor(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <InputWrapper
              control={form.control}
              name="total"
              label="Total Cost"
              type="number"
              readOnly
              placeholder="0.00"
            />

            <TextareaWrapper
              control={form.control}
              name="notes"
              label="Notes"
              placeholder="Add any additional notes here..."
            />

            <Button type="submit" className="w-full">
              {data ? "Update" : "Add"} Task
            </Button>
          </form>
        </Form>

        <AddPartUsed
          open={addPartOpen}
          setOpen={setAddPartOpen}
          onAdd={handleAddPart}
        />

        <AddLaborUsed
          open={addLaborOpen}
          setOpen={setAddLaborOpen}
          onAdd={handleAddLabor}
        />
      </DialogContent>
    </Dialog>
  );
}
