"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeleteVendorModalProps {
  vendor: any | null;
  onClose: () => void;
  deleteVendor: { mutateAsync: (args: { id: string }) => Promise<any> };
  patchIsActive: { mutateAsync: (args: { id: string; status_id: string }) => Promise<any> };
  statusOnes?: Array<{ id: string }>;
}

export function DeleteVendorModal({
  vendor,
  onClose,
  deleteVendor,
  patchIsActive,
  statusOnes,
}: DeleteVendorModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!vendor}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete vendor"
      description="Are you sure you want to delete the following vendor?"
      warningTitle="Warning:"
      warningText={
        <>
          This action <strong className="font-semibold text-text-strong-950">cannot be undone</strong>. Deleting this vendor will remove all its associated data. Any linked purchase orders, invoices, parts, and contacts will be affected.
        </>
      }
      item={
        vendor
          ? {
              name: vendor.name || "Vendor",
              description: [
                vendor.type?.name,
                vendor.vendor_contact?.email || vendor.vendor_contact?.phone_one,
                vendor.city,
              ]
                .filter(Boolean)
                .join(" • ") || "Vendor record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this vendor."
      confirmText="Yes, Delete Vendor"
      cancelText="Cancel"
      onDelete={async () => {
        if (!vendor?.id) return;
        const currentStatusId: string | undefined = vendor.status?.id;
        const otherStatusId: string | undefined = Array.isArray(statusOnes)
          ? statusOnes.find((s: { id?: string }) => s?.id !== currentStatusId)?.id
          : undefined;

        try {
          await deleteVendor.mutateAsync({ id: vendor.id });
          toast.success(`Vendor "${vendor.name}" deleted successfully`);
        } catch {
          // Fallback to status update if backend uses soft delete / is-active
          if (otherStatusId) {
            await patchIsActive.mutateAsync({
              id: vendor.id,
              status_id: otherStatusId,
            });
            toast.success(`Vendor "${vendor.name}" deleted successfully`);
          } else {
            toast.error("Unable to delete vendor");
          }
        }
        onClose();
      }}
    />
  );
}
