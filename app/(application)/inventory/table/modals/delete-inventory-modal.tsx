"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeleteInventoryModalProps {
  item: any | null;
  onClose: () => void;
  deleteApi: { mutateAsync: (args: any) => Promise<any> };
}

export function DeleteInventoryModal({
  item,
  onClose,
  deleteApi,
}: DeleteInventoryModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete inventory item"
      description="Are you sure you want to delete the following inventory item?"
      warningTitle="Warning:"
      warningText={
        <>
          This action{" "}
          <strong className="font-semibold text-text-strong-950">
            cannot be undone
          </strong>
          . Deleting this inventory item will remove all its associated data
          including stock levels, purchase history, and linked records.
        </>
      }
      item={
        item
          ? {
              name: item.name || "Inventory Item",
              description:
                [
                  item.part_number && `PN: ${item.part_number}`,
                  item.category?.name || item.category,
                  item.vendor?.name || item.vendor,
                ]
                  .filter(Boolean)
                  .join(" • ") || "Inventory record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this item."
      confirmText="Yes, Delete Item"
      cancelText="Cancel"
      onDelete={async () => {
        if (!item?.id) return;
        try {
          await deleteApi.mutateAsync(item);
          toast.success(`Deleted successfully`);
        } catch {
          toast.error("Unable to delete inventory item");
        }
        onClose();
      }}
    />
  );
}
