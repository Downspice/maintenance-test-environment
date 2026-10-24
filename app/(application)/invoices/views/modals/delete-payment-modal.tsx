"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeletePaymentModalProps {
  payment: any | null;
  onClose: () => void;
}

export function DeletePaymentModal({
  payment,
  onClose,
}: DeletePaymentModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!payment}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete payment"
      description="Are you sure you want to delete the following payment?"
      warningTitle="Warning:"
      warningText={
        <>
          This action{" "}
          <strong className="font-semibold text-text-strong-950">
            cannot be undone
          </strong>
          . Deleting this payment will update the associated invoice balance and
          remove the payment record.
        </>
      }
      item={
        payment
          ? {
              name: payment.name || "Payment",
              description:
                [
                  payment.invoice_number &&
                    `Invoice: ${payment.invoice_number}`,
                  payment.payment_method_name,
                  payment.amount_received != null
                    ? `$${payment.amount_received}`
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(" • ") || "Payment record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this payment."
      confirmText="Yes, Delete Payment"
      cancelText="Cancel"
      onDelete={async () => {
        if (!payment?.id) return;
        try {
          toast.success(`Deleted ${payment.name || "Payment"}`);
        } catch {
          toast.error("Unable to delete payment");
        }
        onClose();
      }}
    />
  );
}
