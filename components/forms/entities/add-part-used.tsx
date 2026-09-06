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
import SingleCheckboxWrapper from "../wrappers/SingleCheckboxWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import { useGetCostCenters, useGetInventories } from "@/services/setups/inventory";
import { AddPartUsedSchema, AddPartUsedInterface } from "@/lib/WorkOrder/workOrder-data";
import { useGetVendorOptions } from "@/services/setups/vendor";
import { GenericObject } from "@/types/types";
import { useGetPurchaseOrders } from "@/services/setups/purchaseOrder";
import { convertToOptionList } from "@/lib/utils";
import Fieldset from "@/components/customUI/fieldset";

interface AddPartUsedProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAdd: (data: AddPartUsedInterface) => void;
    maintenanceId?: string;
    data?: AddPartUsedInterface | null;
}

export default function AddPartUsed({
    open,
    setOpen,
    onAdd,
    maintenanceId,
    data,
}: AddPartUsedProps) {
    const { data: inventoriesRes } = useGetInventories();
    const { data: vendorOptions } = useGetVendorOptions<GenericObject[]>();
    const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
    const { data: purchaseOrderOptions } = useGetPurchaseOrders<GenericObject[]>();
    const inventories = inventoriesRes?.data || [];

    const form = useForm<AddPartUsedInterface>({
        resolver: zodResolver(AddPartUsedSchema),
        defaultValues: {
            quantity: 1,
            unit_cost: 0,
            extended_cost: 0,
            is_warranty_replaced: false,
            is_part_under_warranty: false,
            days: 0,
            hours: 0,
        },
    });

    // Populate form when data changes (edit mode)
    useEffect(() => {
        if (data) {
            form.reset({
                part_id: data.part_id,
                name: data.name,
                description: data.description,
                vendor_id: data.vendor_id,
                cost_center_id: data.cost_center_id,
                quantity: data.quantity,
                unit_cost: data.unit_cost,
                extended_cost: data.extended_cost,
                is_warranty_replaced: data.is_warranty_replaced,
                is_part_under_warranty: data.is_part_under_warranty,
                days: data.days,
                hours: data.hours,
                expiry_date: data.expiry_date,
            });
        }
    }, [data, form]);

    const partOptions = Array.isArray(inventories)
        ? inventories.map((part: any) => ({
            id: part.id,
            name: part.part_number || part.name,
        }))
        : [];

    const selectedPartId = form.watch("part_id");
    const quantity = form.watch("quantity");
    const unitCost = form.watch("unit_cost");

    // Auto-populate fields when part is selected
    useEffect(() => {
        if (selectedPartId && Array.isArray(inventories)) {
            const selectedPart = inventories.find((p: any) => p.id === selectedPartId);
            if (selectedPart) {
                console.log("Selected part:", selectedPart); // Debug log
                form.setValue("name", selectedPart.name || "");
                form.setValue("description", selectedPart.description || "");
                form.setValue("vendor_id", selectedPart.vendor_id || "");
                // Try different possible field names for unit cost
                const unitCostValue = selectedPart.unit_cost || selectedPart.unitCost || selectedPart.cost || selectedPart.price || 0;
                form.setValue("unit_cost", unitCostValue);
            }
        }
    }, [selectedPartId, inventories, form]);

    // Calculate extended cost
    useEffect(() => {
        const extended = (Number(quantity) || 0) * (Number(unitCost) || 0);
        form.setValue("extended_cost", extended);
    }, [quantity, unitCost, form]);

    function handleSubmit(data: AddPartUsedInterface) {
        if (data) {
            onAdd(data);
            form.reset();
            setOpen(false);
        }
    }

    function handleSaveAndAdd(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        const data = form.getValues();
        if (maintenanceId) {
            console.log("Submitting Part with Maintenance ID:", maintenanceId);
        }
        onAdd({ ...data, maintenance_id: maintenanceId } as any);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Part Used</DialogTitle>
                    <DialogDescription>
                        {data ? "Update the" : "Add a"} part used details below.
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
                        <ComboboxFieldWrapper
                            control={form.control}
                            name="part_id"
                            label="Part Number"
                            options={partOptions}
                        />

                        <InputWrapper
                            control={form.control}
                            name="name"
                            label="Name"
                            readOnly
                            placeholder="Auto-filled"
                        />

                        <InputWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            readOnly
                            placeholder="Auto-filled"
                        />
                        <ComboboxFieldWrapper
                            control={form.control}
                            name="vendor_id"
                            label="Vendor"
                            options={vendorOptions || []}
                        />
                        <ComboboxFieldWrapper
                            control={form.control}
                            name="cost_center_id"
                            label="Cost Center"
                            options={costCenterOptions || []}
                        />

                        <InputWrapper
                            control={form.control}
                            name="quantity"
                            label="Quantity Used"
                            type="number"
                            placeholder="1"
                        />
                        <InputWrapper
                            control={form.control}
                            name="unit_cost"
                            label="Unit Cost"
                            type="number"
                            readOnly
                            placeholder="0.00"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputWrapper
                                control={form.control}
                                name="extended_cost"
                                label="Extended Cost"
                                type="number"
                                readOnly
                                placeholder="0.00"
                            />
                            <SingleCheckboxWrapper
                                control={form.control}
                                name="is_warranty_replaced"
                                label="Replaced under warranty"
                            />
                        </div>


                        <ComboboxFieldWrapper
                            control={form.control}
                            name="po_id"
                            label="PO #"
                            options={convertToOptionList(purchaseOrderOptions ?? [], "id", "po_number")}
                        />


                        <Fieldset
                            legend="Warranty"
                            content={
                                <>
                                    <SingleCheckboxWrapper
                                        control={form.control}
                                        name="is_part_under_warranty"
                                        label="Part under warranty"
                                    />

                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <InputWrapper
                                                control={form.control}
                                                name="days"
                                                label="Days"
                                                type="number"
                                                placeholder="0"
                                            />
                                            <InputWrapper
                                                control={form.control}
                                                name="hours"
                                                label="Hours"
                                                type="number"
                                                placeholder="0"
                                            />
                                        </div>
                                        <DatePickerWrapper
                                            control={form.control}
                                            name="expiry_date"
                                            label="Expires"
                                        />
                                    </div>
                                </>
                            }
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
