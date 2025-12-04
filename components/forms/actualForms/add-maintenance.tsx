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
import RadioGroupWrapper from "../wrappers/RadioGroupWrapper";
import InputWrapper from "../wrappers/InputWrapper";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";
import { useGetPMServices } from "@/services/setups/workOrder";
import { AddMaintenanceInWorkOrderSchema, AddMaintenanceInWorkOrderInterface, AddPartUsedInterface, AddLaborUsedInterface } from "@/lib/WorkOrder/workOrder-data";
import AddPartUsed from "./add-part-used";
import AddLaborUsed from "./add-labor-used";
import { useAddWorkOrderUnitMaintenance } from "@/services/setups/workOrder";
import { toast } from "sonner";

interface AddMaintenanceProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAdd: (task: AddMaintenanceInWorkOrderInterface) => void;
    data?: AddMaintenanceInWorkOrderInterface | null;
    unitId?: string; // Unit ID for API submission
}

export default function AddMaintenance({
    open,
    setOpen,
    onAdd,
    data,
    unitId,
}: AddMaintenanceProps) {
    const { data: pmServices } = useGetPMServices();

    const { mutate: addMaintenanceAPI, isPending } = useAddWorkOrderUnitMaintenance();

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

    const [parts, setParts] = useState<AddPartUsedInterface[]>([]);
    const [addPartOpen, setAddPartOpen] = useState(false);
    const [labor, setLabor] = useState<AddLaborUsedInterface[]>([]);
    const [addLaborOpen, setAddLaborOpen] = useState(false);

    const taskOptions = pmServices?.map((service: any) => ({
        id: service.id,
        name: service.pm_service,
    })) || [];

    const selectedTaskId = form.watch("task_id");
    const selectedCategory = form.watch("category");

    // Sync task name when task_id changes
    useEffect(() => {
        const selectedTask = taskOptions.find((t: { id: string; name: string }) => t.id === selectedTaskId);
        if (selectedTask) {
            form.setValue("task", selectedTask.name);
        }
    }, [selectedTaskId, taskOptions, form]);

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
        const totalPartsCost = parts.reduce((sum, part) => sum + (Number(part.extended_cost) || 0), 0);
        form.setValue("parts_cost", totalPartsCost);
    }, [parts, form]);

    // Calculate labor_cost from added labor
    useEffect(() => {
        const totalLaborCost = labor.reduce((sum, l) => sum + (Number(l.total_cost) || 0), 0);
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
        console.log("handleSubmit called with data:", data);
        console.log("unitId:", unitId);
        console.log("parts:", parts);
        console.log("labor:", labor);

        if (!unitId) {
            toast.error("Unit ID is required to add maintenance");
            return;
        }

        // Format the payload for the API
        const payload = {
            unit_id: unitId,
            maintenance: [
                {
                    category: data.category,
                    task_id: data.task_id || "",
                    type_id: data.type_id || "",
                    other_task_name: data.other_task_name || "",
                    other_type_name: data.other_type_name || "",
                    parts_cost: data.parts_cost || 0,
                    labor_cost: data.labor_cost || 0,
                    total: data.total || 0,
                    notes: data.notes || "",
                    parts: parts,
                    labor: labor,
                },
            ],
        };

        console.log("Submitting payload:", JSON.stringify(payload, null, 2));

        // Submit to API
        addMaintenanceAPI(payload, {
            onSuccess: () => {
                console.log("Maintenance added successfully");
                toast.success("Maintenance added successfully");
                // Call the onAdd callback with the data
                onAdd(data);
                // Reset the form and close
                setParts([]);
                setLabor([]);
                setOpen(false);
            },
            onError: (error: any) => {
                console.error("Error adding maintenance:", error);
                toast.error(error?.response?.data?.message || "Failed to add maintenance");
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            // Only allow closing if not submitting
            if (!isPending) {
                setOpen(isOpen);
            }
        }}>
            <DialogContent className="w-full sm:max-w-2/5" onInteractOutside={(e) => {
                // Prevent closing dialog when clicking outside during submission
                if (isPending) {
                    e.preventDefault();
                }
            }}>
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Maintenance Service" : "Add New Maintenance Service"}</DialogTitle>
                    <DialogDescription>
                        {data ? "Update the" : "Add a new"} maintenance service details below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                        console.error("Form validation errors:", errors);
                        toast.error("Please check the form for errors. Required fields might be missing.");
                    })} className="space-y-4 mt-4">
                        <RadioGroupWrapper
                            control={form.control}
                            name="category"
                            label=""
                            options={categoryOptions}
                            orientation="horizontal"
                        />

                        {selectedCategory === "Other" ? (
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
                        ) : (
                            <>
                                <ComboboxFieldWrapper
                                    control={form.control}
                                    name="task_id"
                                    label="Task"
                                    options={taskOptions}
                                />

                                <ComboboxFieldWrapper
                                    control={form.control}
                                    name="type_id"
                                    label="Type"
                                    options={[]}
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
                                            <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                                                <span>{part.name} (x{part.quantity})</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="font-medium">${part.extended_cost.toFixed(2)}</span>
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
                                            <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                                                <span>{laborItem.performed_by} ({laborItem.hours}h)</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="font-medium">${laborItem.total_cost.toFixed(2)}</span>
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

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Submitting..." : (data ? "Update" : "Add")} Task
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
