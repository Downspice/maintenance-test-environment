"use client";

import { FilePenIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export type TableRowActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
};

export function TableRowActions({
  onEdit,
  onDelete,
  editLabel = "Edit row",
  deleteLabel = "Delete row",
  className,
}: TableRowActionsProps) {
  if (!onEdit && !onDelete) {
    return null;
  }

  return (
    <div className={cn("flex justify-end gap-2", className)}>
      {onEdit ? (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={editLabel}
          className="shadow-none"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <FilePenIcon className="size-4" />
        </Button>
      ) : null}
      {onDelete ? (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={deleteLabel}
          className="text-destructive focus:text-destructive shadow-none"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
