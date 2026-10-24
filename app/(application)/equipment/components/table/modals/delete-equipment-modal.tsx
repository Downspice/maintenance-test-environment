"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeleteEquipmentModalProps {
  equipment: any | null;
  onClose: () => void;
}

export function DeleteEquipmentModal({
  equipment,
  onClose,
}: DeleteEquipmentModalProps) {
  return (
    <DeleteConfirmationModal
      open={!!equipment}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Delete equipment"
      description="Are you sure you want to delete the following equipment?"
      warningTitle="Warning:"
      warningText={
        <>
          This action{" "}
          <strong className="font-semibold text-text-strong-950">
            cannot be undone
          </strong>
          . Deleting this equipment will remove all its associated data
          including work orders, inspections, meter readings, and linked
          records.
        </>
      }
      item={
        equipment
          ? {
              name: equipment.unit_number || equipment.name || "Equipment",
              description:
                [
                  equipment.year,
                  equipment.model,
                  equipment.type?.name || equipment.type,
                  equipment.serial_number && `SN: ${equipment.serial_number}`,
                ]
                  .filter(Boolean)
                  .join(" • ") || "Equipment record",
            }
          : undefined
      }
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this equipment."
      confirmText="Yes, Delete Equipment"
      cancelText="Cancel"
      onDelete={async () => {
        if (!equipment?.id) return;
        try {
          toast.success(
            `Deleted ${equipment.unit_number || equipment.name || "Equipment"}`
          );
        } catch {
          toast.error("Unable to delete equipment");
        }
        onClose();
      }}
    />
  );
}
