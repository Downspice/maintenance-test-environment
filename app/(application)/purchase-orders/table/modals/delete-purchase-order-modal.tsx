"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeletePurchaseOrderModalProps {
  purchaseOrder: any | null;
  onClose: () => void;
}

export function DeletePurchaseOrderModal({
  purchaseOrder,
  onClose,
}: DeletePurchaseOrderModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!purchaseOrder}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete purchase order"
      description="Are you sure you want to delete the following purchase order?"
      warningTitle="Warning:"
      warningText={
        <>
          This action <strong className="font-semibold text-text-strong-950">cannot be undone</strong>. Deleting this purchase order will remove all its associated data including line items, receiving history, and linked records.
        </>
      }
      item={
        purchaseOrder
          ? {
              name: purchaseOrder.po_number || "Purchase Order",
              description: [
                purchaseOrder.vendor?.name || purchaseOrder.vendor,
                purchaseOrder.status?.name,
                purchaseOrder.buyer_name,
              ]
                .filter(Boolean)
                .join(" • ") || "Purchase order record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this purchase order."
      confirmText="Yes, Delete PO"
      cancelText="Cancel"
      onDelete={async () => {
        if (!purchaseOrder?.id) return;
        try {
          toast.success(`Deleted ${purchaseOrder.po_number || "Purchase Order"}`);
        } catch {
          toast.error("Unable to delete purchase order");
        }
        onClose();
      }}
    />
  );
}
