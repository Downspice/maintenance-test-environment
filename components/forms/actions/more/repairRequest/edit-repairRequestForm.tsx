"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilePenIcon } from "lucide-react";
import NewRepairRequestForm, {
  MoreButtonRequestInterface,
} from "./repairRequestForm";

interface EditRepairRequestFormProps {
  children?: React.ReactNode;
  data: MoreButtonRequestInterface;
  onUpdate?: (updated: MoreButtonRequestInterface) => void;
}

export default function EditRepairRequestForm({
  children,
  data,
  onUpdate,
}: EditRepairRequestFormProps) {
  const [open, setOpen] = useState(false);
  const formId = `edit-repair-request-form-${data.repairRequestId || "edit"}`;

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </span>
        ) : (
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FilePenIcon className="size-4" />
          </Button>
        )
      }
      title="Edit Repair Request"
      description={`Update the repair request details for ${data.equipment || "equipment"}.`}
      closeable={true}
      renderActions={
        <Button form={formId} type="submit" variant="primary">
          Update Repair Request
        </Button>
      }
      className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewRepairRequestForm
          formId={formId}
          hideSubmitButton
          initialData={data}
          onSuccess={(updated) => {
            onUpdate?.(updated);
            setOpen(false);
          }}
        />
      </ScrollArea>
    </Drawer>
  );
}
