"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RiHomeLine, RiBuildingLine } from "@remixicon/react";
import { cn } from "@/utils/cn";

export interface DeleteConfirmationItem {
  name: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
}

export interface DeleteConfirmationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  warningTitle?: React.ReactNode;
  warningText?: React.ReactNode;
  item?: DeleteConfirmationItem;
  switchLabel?: React.ReactNode;
  switchDescription?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onDelete?: () => void | Promise<void>;
  isLoading?: boolean;
  /** Optional mode where flipping the switch immediately fires onDelete */
  autoDeleteOnSwitch?: boolean;
  className?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  trigger,
  title = "Delete workspace",
  description = "Are you sure you want to delete the following workspace?",
  warningTitle = "Warning:",
  warningText = (
    <>
      This action <strong className="font-semibold text-text-strong-950">cannot be undone</strong>. Deleting a workspace will remove all its associated data. Any test, configuration, monitoring insights, and more will be <strong className="font-semibold text-text-strong-950">permanently lost</strong>.
    </>
  ),
  item = {
    name: "Acme",
    description: "4 Pipelines, 21 tests, 173 commits",
    action: {
      label: "Go to Home",
    },
  },
  switchLabel = "Confirm permanent deletion",
  switchDescription = "Toggle the switch to authorize and enable deleting this item.",
  cancelText = "Cancel",
  confirmText = "Yes, Delete Workspace",
  onDelete,
  isLoading = false,
  autoDeleteOnSwitch = false,
  className,
}: DeleteConfirmationModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const isControlled = open !== undefined;
  const modalOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset switch confirmation state upon closing
      setIsConfirmed(false);
    }
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const handleDelete = async () => {
    if (!isConfirmed && !autoDeleteOnSwitch) return;
    try {
      setDeleting(true);
      await onDelete?.();
      handleOpenChange(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSwitchChange = async (checked: boolean) => {
    setIsConfirmed(checked);
    if (checked && autoDeleteOnSwitch) {
      try {
        setDeleting(true);
        await onDelete?.();
        handleOpenChange(false);
      } finally {
        setDeleting(false);
      }
    }
  };

  const isActionLoading = isLoading || deleting;

  return (
    <Modal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      size="md"
      closeable={!isActionLoading}
      showFooter={true}
      footer={
        <Modal.Footer
          closeable={false}
          className="border-t border-stroke-soft-200 px-6 py-4 flex items-center justify-end gap-3"
        >
          <Button
            variant="ghost"
            type="button"
            disabled={isActionLoading}
            onClick={() => handleOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            type="button"
            disabled={!isConfirmed || isActionLoading}
            onClick={handleDelete}
            className="transition-all duration-200"
          >
            {isActionLoading ? "Deleting..." : confirmText}
          </Button>
        </Modal.Footer>
      }
      className={cn("sm:max-w-[500px]", className)}
    >
      <div className="flex flex-col gap-4 py-1">
        {/* Warning Banner */}
        <div className="relative flex items-start gap-3.5 rounded-xl border border-red-200/80 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
          <div className="w-1 self-stretch rounded-full bg-red-500 shrink-0 min-h-[3.25rem]" />
          <div className="text-paragraph-sm text-text-sub-600 leading-relaxed">
            <strong className="font-semibold text-text-strong-950 mr-1">
              {warningTitle}
            </strong>
            {warningText}
          </div>
        </div>

        {/* Item Preview Card */}
        {item && (
          <div className="flex items-center justify-between rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-3.5 shadow-regular-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white shrink-0 shadow-sm">
                {item.icon ?? <RiBuildingLine className="size-5" />}
              </div>
              <div className="min-w-0">
                <div className="truncate text-label-sm font-semibold text-text-strong-950">
                  {item.name}
                </div>
                {item.description && (
                  <div className="truncate text-paragraph-xs text-text-soft-400">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
            {item.action && (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="gap-1.5 shrink-0 ml-2"
                onClick={item.action.onClick}
              >
                {item.action.icon ?? <RiHomeLine className="size-3.5" />}
                {item.action.label}
              </Button>
            )}
          </div>
        )}

        {/* Switch Confirmation Section */}
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border p-4 transition-all duration-200",
            isConfirmed
              ? "border-red-300/80 bg-red-50/30 dark:border-red-900/50 dark:bg-red-950/10"
              : "border-stroke-soft-200 bg-bg-weak-50/50"
          )}
        >
          <div className="space-y-0.5 pr-4">
            <Label
              htmlFor="confirm-delete-switch"
              className="text-label-sm font-medium text-text-strong-950 cursor-pointer"
            >
              {switchLabel}
            </Label>
            <p className="text-paragraph-xs text-text-soft-400">
              {switchDescription}
            </p>
          </div>
          <Switch
            id="confirm-delete-switch"
            checked={isConfirmed}
            disabled={isActionLoading}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>
    </Modal>
  );
}
