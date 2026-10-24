"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeleteWorkOrderModalProps {
  workOrder: any | null;
  onClose: () => void;
  deleteWorkOrderAsync: (args: { id: string }) => Promise<any>;
}

export function DeleteWorkOrderModal({
  workOrder,
  onClose,
  deleteWorkOrderAsync,
}: DeleteWorkOrderModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!workOrder}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete work order"
      description="Are you sure you want to delete the following work order?"
      warningTitle="Warning:"
      warningText={
        <>
          This action{" "}
          <strong className="font-semibold text-text-strong-950">
            cannot be undone
          </strong>
          . Deleting this work order will remove all its associated data
          including tasks, labor, parts, and linked records.
        </>
      }
      item={
        workOrder
          ? {
              name:
                workOrder.wo_number ||
                workOrder.workOrderNumber ||
                "Work Order",
              description:
                [
                  workOrder.equipment?.name,
                  workOrder.status?.name || workOrder.status,
                  workOrder.total != null ? `$${workOrder.total}` : undefined,
                ]
                  .filter(Boolean)
                  .join(" • ") || "Work order record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this work order."
      confirmText="Yes, Delete Work Order"
      cancelText="Cancel"
      onDelete={async () => {
        if (!workOrder?.id) return;
        try {
          await deleteWorkOrderAsync({ id: workOrder.id });
          toast.success(`Deleted ${workOrder.wo_number || "Work Order"}`);
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to delete work order"
          );
        }
        onClose();
      }}
    />
  );
}
