"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export type SelectActionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

/** Modal for a single picker/field plus a primary confirm action (e.g. add warehouse). */
export function SelectActionModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel = "Add",
  onConfirm,
  confirmDisabled = false,
  children,
  size = "md",
}: SelectActionModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      size={size}
      closeable
      renderActions={
        <Button
          type="button"
          variant="primary"
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      }
    >
      <div className="flex flex-col gap-1">{children}</div>
    </Modal>
  );
}
