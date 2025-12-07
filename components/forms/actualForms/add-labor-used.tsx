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
import InputWrapper from "../wrappers/InputWrapper";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { ComboboxFieldWrapper } from "../wrappers/ComboboxWrapper";
import RadioGroupWrapper from "../wrappers/RadioGroupWrapper";
import SingleCheckboxWrapper from "../wrappers/SingleCheckboxWrapper";
import { useGetCostCenters } from "@/services/setups/inventory";
import { AddLaborUsedSchema, AddLaborUsedInterface } from "@/lib/WorkOrder/workOrder-data";
import { useGetEmployees } from "@/services/setups/employee";
import { useGetVendorOptions } from "@/services/setups/vendor";
import { GenericObject } from "@/types/types";

interface AddLaborUsedProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAdd: (data: AddLaborUsedInterface) => void;
    maintenanceId?: string;
    data?: AddLaborUsedInterface | null;
}

export default function AddLaborUsed({
    open,
    setOpen,
    onAdd,
    data,
    maintenanceId,
}: AddLaborUsedProps) {
    const { data: employees } = useGetEmployees<GenericObject[]>();
    const { data: vendorOptions } = useGetVendorOptions<GenericObject[]>();
    const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();

    const form = useForm<AddLaborUsedInterface>({
        resolver: zodResolver(AddLaborUsedSchema),
        defaultValues: {
            performed_by: "Employee",
            hours: 1,
            labor_rate: 0,
            total_cost: 0,
            is_under_warranty: false,
        },
    });

    const performedByOptions = [
        { id: "Employee", name: "Employee" },
        { id: "Vendor", name: "Vendor" },
    ];

    const performedBy = form.watch("performed_by");
    const technicianId = form.watch("technician_id");
    const hours = form.watch("hours");
    const laborRate = form.watch("labor_rate");

    // Get technician options based on performed_by
    const technicianOptions = performedBy === "Employee"
        ? (employees || []).map((emp: any) => {
            const lastName = emp.last_name || "";
            const firstName = emp.first_name || "";
            const middleName = emp.middle_name || "";
            const fullName = middleName
                ? `${lastName}, ${firstName}, ${middleName}`
                : `${lastName}, ${firstName}`;
            return {
                id: emp.id,
                name: fullName.trim(),
            };
        })
        : (vendorOptions || []);

    // Auto-populate labor_rate when technician is selected
    useEffect(() => {
        if (technicianId) {
            const allTechnicians = [...(employees || []), ...(vendorOptions || [])];
            const selectedTechnician = allTechnicians.find((t: any) => t.id === technicianId);
            if (selectedTechnician) {
                const rate = selectedTechnician.labor_rate || selectedTechnician.rate || selectedTechnician.hourly_rate || 0;
                form.setValue("labor_rate", rate);
            }
        }
    }, [technicianId, employees, vendorOptions, form]);

    // Calculate total_cost
    useEffect(() => {
        const total = (Number(hours) || 0) * (Number(laborRate) || 0);
        form.setValue("total_cost", total);
    }, [hours, laborRate, form]);

    function handleSubmit(data: AddLaborUsedInterface) {
        if (data) {
            if (maintenanceId) {
                console.log("Submitting Labor with Maintenance ID:", maintenanceId);
            }
            onAdd({ ...data, maintenance_id: maintenanceId } as any);
            form.reset();
            setOpen(false);
        }
    }

    function handleSaveAndAdd(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        const data = form.getValues();
        if (maintenanceId) {
            // If we need to pass maintenance_id in the labor data itself, add it here
            // However, usually it's passed in the API payload structure
            console.log("Submitting Labor with Maintenance ID:", maintenanceId);
            // For now, we'll just log it. The parent component usually handles the API payload construction
            // But if there's a field in AddLaborUsedInterface for it, we should add it.
            // Assuming AddLaborUsedInterface doesn't have it yet based on previous files.
        }
        onAdd({ ...data, maintenance_id: maintenanceId } as any);
        form.reset({
            performed_by: performedBy,
            hours: 1,
            labor_rate: 0,
            total_cost: 0,
            is_under_warranty: false,
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Labor" : "Add Labor"}</DialogTitle>
                    <DialogDescription>
                        {data ? "Update the" : "Add a"} labor details below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit(handleSubmit)(e);
                        }}
                        className="space-y-4 mt-4"
                    >
                        <RadioGroupWrapper
                            control={form.control}
                            name="performed_by"
                            label="Performed by"
                            options={performedByOptions}
                            orientation="horizontal"
                        />

                        <ComboboxFieldWrapper
                            control={form.control}
                            name="technician_id"
                            label="Technician"
                            options={technicianOptions}
                        />

                        <TextareaWrapper
                            control={form.control}
                            name="work_performed"
                            label="Work Performed"
                            placeholder="Describe the work performed..."
                        />

                        <ComboboxFieldWrapper
                            control={form.control}
                            name="cost_center_id"
                            label="Cost Center"
                            options={costCenterOptions || []}
                        />

                        <InputWrapper
                            control={form.control}
                            name="labor_rate"
                            label="Labor Rate"
                            type="number"
                            placeholder="0.00"
                        />

                        <div className="grid grid-cols-2 gap-1">
                            <InputWrapper
                                control={form.control}
                                name="hours"
                                label="Hours"
                                type="number"
                                placeholder="1"
                            />
                            <div className="flex items-end">
                                <SingleCheckboxWrapper
                                    control={form.control}
                                    name="is_under_warranty"
                                    label="Under Warranty"
                                />
                            </div>
                        </div>

                        <InputWrapper
                            control={form.control}
                            name="total_cost"
                            label="Total Cost"
                            type="number"
                            readOnly
                            placeholder="0.00"
                        />

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1">
                                Save
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleSaveAndAdd}
                                className="flex-1"
                            >
                                Save +
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
