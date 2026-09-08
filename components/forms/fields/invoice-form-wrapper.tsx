"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewInvoiceForm from "@/components/forms/entities/new-invoice-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function InvoiceFormWrapper({ variant }: TriggerVariant) {
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
              Create Invoice
            </>
          )}
        </Button>
      }
      title="Create Invoice"
      description="Fill out the form below to create a new Invoice."
      closeable={true}
      renderActions={
        <Button form="new-invoice-form" type="submit" variant="primary">
          Save Invoice
        </Button>
      }
      className="w-3/4"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewInvoiceForm formId="new-invoice-form" hideSubmitButton />
      </ScrollArea>
    </Drawer>
  );
}
