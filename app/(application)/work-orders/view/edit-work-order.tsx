"use client";

import { z } from "zod";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkOrderInterface, CreateWorkOrderSchema } from "@/lib/WorkOrder/workOrder-data";
import { EditActualWorkOrderForm } from "@/components/forms/actualForms/work-order-form";
import { useGetWorkOrder } from "@/services/setups/workOrder";

export default function EditWorkOrderForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: WorkOrderInterface;
}) {
  const [open, setOpen] = useState(false);
  const workOrderId = (data as any).id; // Access id from data which might not be in WorkOrderInterface
  const { data: workOrderData, isLoading, isError } = useGetWorkOrder(workOrderId, {
    enabled: open && !!workOrderId, // Only fetch when sheet is open
  });

  // Transform API data to form format
  const apiData = workOrderData as any;
  const formData: Partial<z.infer<typeof CreateWorkOrderSchema>> = apiData ? {
    wo_number: apiData.wo_number || apiData.workOrderNumber || 0,
    priority_id: apiData.priority_id || apiData.priority || "",
    scheduled_date: apiData.scheduled_date ? new Date(apiData.scheduled_date) : apiData.scheduledOn ? new Date(apiData.scheduledOn) : undefined,
    due_date: apiData.due_date ? new Date(apiData.due_date) : apiData.dueOn ? new Date(apiData.dueOn) : undefined,
    started_date: apiData.started_date ? new Date(apiData.started_date) : apiData.startedOn ? new Date(apiData.startedOn) : undefined,
    completed_date: apiData.completed_date ? new Date(apiData.completed_date) : apiData.completedOn ? new Date(apiData.completedOn) : undefined,
    type_id: apiData.type_id || apiData.workOrderType || "",
    cost_center_id: apiData.cost_center_id || apiData.costCenter || "",
    po_id: apiData.po_id || apiData.po || "",
    invoice_number: apiData.invoice_number || apiData.invoice || "",
    status_id: apiData.status_id || apiData.status || "",
    others: (apiData.others || []) as { name: string; value: string }[],
    assignee_ids: apiData.assignee_ids || apiData.assigneeIds || (apiData.assignees || []).map((a: any) => a.assignee_id || a.id),
    assigned_to: apiData.assigned_to || [],
    equipment_id: apiData.units?.[0]?.id || "",
    hours: apiData.units?.[0]?.hours || apiData.hours || 0,
    maintenance: apiData.units?.[0]?.maintenance || [],
    parts: apiData.units?.[0]?.parts || [],
    labor: apiData.units?.[0]?.labors || [],
    notes: apiData.notes || [],
    units: apiData.units || [],
    currency: apiData.currency,
    subtotal: apiData.subtotal,
    is_discount: apiData.is_discount,
    discount_type: apiData.discount_type,
    discount_amount: apiData.discount_amount,
    tax_one: apiData.tax_one,
    tax_two: apiData.tax_two,
    tax_one_amount: apiData.tax_one_amount,
    tax_two_amount: apiData.tax_two_amount,
    total: apiData.total,
    is_calculated: apiData.is_calculated,
  } : {};

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Work Order {data.wo_number || data.workOrderNumber}</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-60px)] pr-4 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading work order...</div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-destructive">Failed to load work order</div>
            </div>
          ) : (
            <EditActualWorkOrderForm
              workOrderId={workOrderId}
              initialData={formData}
              onClose={() => setOpen(false)}
            />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
