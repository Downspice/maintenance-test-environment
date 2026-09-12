"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewPurchaseOrderForm
          formId="new-purchase-order-form"
          hideSubmitButton
        />
      </ScrollArea>
    </Drawer>
  );
}
