"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import NewPurchaseOrderForm from "@/components/forms/entities/new-purchase-order-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function PurchaseOrderFormWrapper({ variant }: TriggerVariant) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant={variant === "icon" ? "ghost" : "primary"}
          size={variant === "icon" ? "icon" : "md"}
          className={variant === "icon" ? "size-6 p-0" : undefined}
        >
          {variant === "icon" ? (
            <Plus className="size-4" />
          ) : (
            <>
              <Plus className="size-4 mr-2" />
              Create Purchase Order
            </>
          )}
        </Button>
      }
      title="Create Purchase Order"
      description="Fill out the form below to create a new Purchase Order."
      closeable={true}
      renderActions={
        <Button form="new-purchase-order-form" type="submit" variant="primary">
          Save Purchase Order
        </Button>
      }
      className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden !px-0 !py-0"
    >
      <div className="flex h-[calc(100dvh-9.75rem)] min-h-0 flex-col overflow-y-auto px-6 py-4 pr-4">
        <NewPurchaseOrderForm
          formId="new-purchase-order-form"
          hideSubmitButton
        />
      </div>
    </Drawer>
  );
}
