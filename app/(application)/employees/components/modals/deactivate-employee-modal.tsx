"use client";

import { DeleteConfirmationModal } from "@/components/reusable/modals/delete-confirmation-modal";
import { toast } from "sonner";

interface DeactivateEmployeeModalProps {
  employee: any | null;
  onClose: () => void;
  patchIsActive: {
    mutateAsync: (args: { id: string; status_id: string }) => Promise<any>;
  };
  employeeStatuses?: Array<{ id: string; is_active?: boolean }>;
}

export function DeactivateEmployeeModal({
  employee,
  onClose,
  patchIsActive,
  employeeStatuses,
}: DeactivateEmployeeModalProps) {
  const employeeName = employee
    ? [employee.first_name, employee.middle_name, employee.last_name]
        .filter(Boolean)
        .join(" ") ||
      [employee.last_name, employee.first_name].filter(Boolean).join(" ") ||
      "Employee"
    : "Employee";

  return (
    <DeleteConfirmationModal
      open={!!employee}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Deactivate employee"
      description="Are you sure you want to deactivate the following employee?"
      warningTitle="Warning:"
      warningText={
        <>
          Deactivating this employee will prevent them from accessing the
          system, receiving new task assignments, and appearing in active
          schedules.
        </>
      }
      item={
        employee
          ? {
              name: employeeName,
              description:
                [
                  employee.employee_number && `ID: ${employee.employee_number}`,
                  employee.type?.name || employee.type,
                  employee.location?.name || employee.location,
                  employee.cell,
                ]
                  .filter(Boolean)
                  .join(" • ") || "Employee record",
            }
          : undefined
      }
      switchLabel="Confirm employee deactivation"
      switchDescription="Toggle switch to authorize deactivating this employee."
      confirmText="Yes, Deactivate Employee"
      cancelText="Cancel"
      onDelete={async () => {
        if (!employee?.id) return;
        const currentStatusId: string | undefined = employee.status?.id;
        const otherStatusId: string | undefined = Array.isArray(
          employeeStatuses
        )
          ? employeeStatuses.find((s: any) => s?.id !== currentStatusId)?.id
          : undefined;

        if (!otherStatusId) {
          toast.error("Unable to determine target status");
          return;
        }

        try {
          await patchIsActive.mutateAsync({
            id: employee.id,
            status_id: otherStatusId,
          });
          toast.success(`Employee "${employeeName}" deactivated successfully`);
        } catch {
          toast.error("Unable to deactivate employee");
        }
        onClose();
      }}
    />
  );
}
