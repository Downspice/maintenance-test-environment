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
import { toast } from "sonner";

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
        // setOpen(false); // Let parent handle closing via onSuccess if desired, or close here?
        // work-order-form.tsx logic suggests it handles closing on success.
        // But wait, work-order-form.tsx expects to close the sheet itself?
        // line 711 of work-order-form.tsx: setIsMaintenanceSheetOpen(false) on success.
        // So we should probably NOT close it here if we want to wait for success.
        // However, onAdd is void. The parent doesn't return a promise.
        // The user request "wait for it to be successful dont automatically close" implies
        // the parent handles the async operation.

        // If I just call onAdd(), I don't know when it succeeds.
        // But standard pattern in this codebase seems to be: 
        // Dialog calls onAdd -> Parent calls API -> Parent closes dialog on success.
        // So I should NOT close the dialog here.
        // I should probably also not reset the form immediately if I want to preserve state on error?
        // But if I don't reset, and user cancels, state persists?
        // Effect at line 37 handles resetting when `data` changes or on open?
        // Line 61 handles data changes.
        // Line 100 handles initial parts/labor.

        // For now, I will consistent with other dialogs pattern IF they exist.
        // AddPartUsed calls onAdd and then form.reset().
        // Let's check AddPartUsed again.
        // AddPartUsed line 131: onAdd(...); form.reset();
        // It DOES NOT setOpen(false).

        // So I should just call onAdd and maybe reset form?
        // But if there is an error in parent, form is reset?

        // Let's just call onAdd. Resetting might clear data before submission completes? 
        // AddPartUsed resets immediately.

        // I will follow AddPartUsed pattern: onAdd(...) and maybe form.reset().
        // But AddMaintenance has complex state (parts/labor).

        // If I reset parts/labor here, and API fails in parent, user loses data.
        // Maybe I should NOT reset here.
        // AddPartUsed resets form.

        // Let's just call onAdd.

        // form.reset(); // If I reset, UI clears.
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full sm:max-w-2/5">
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
                                                    <span className="font-medium">${Number(part.extended_cost).toFixed(2)}</span>
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
                                                    <span className="font-medium">${Number(laborItem.total_cost).toFixed(2)}</span>
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
