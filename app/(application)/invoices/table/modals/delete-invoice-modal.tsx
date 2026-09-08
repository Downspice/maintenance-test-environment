"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeleteInvoiceModalProps {
  invoice: any | null;
  onClose: () => void;
  deleteApi: { mutateAsync: (args: any) => Promise<any> };
}

export function DeleteInvoiceModal({
  invoice,
  onClose,
  deleteApi,
}: DeleteInvoiceModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!invoice}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete invoice"
      description="Are you sure you want to delete the following invoice?"
      warningTitle="Warning:"
      warningText={
        <>
          This action <strong className="font-semibold text-text-strong-950">cannot be undone</strong>. Deleting this invoice will remove all its associated data including payments, line items, and linked records.
        </>
      }
      item={
        invoice
          ? {
              name: invoice.invoice_number || "Invoice",
              description: [
                invoice.customer?.company_name || invoice.customer,
                invoice.status,
                invoice.total != null ? `$${invoice.total}` : undefined,
              ]
                .filter(Boolean)
                .join(" • ") || "Invoice record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this invoice."
      confirmText="Yes, Delete Invoice"
      cancelText="Cancel"
      onDelete={async () => {
        if (!invoice?.id) return;
        try {
          await deleteApi.mutateAsync(invoice);
          toast.success(`Deleted successfully`);
        } catch {
          toast.error("Unable to delete invoice");
        }
        onClose();
      }}
    />
  );
}
