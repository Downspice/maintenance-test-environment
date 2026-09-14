"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewInventory from "@/components/forms/entities/new-inventory-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function InventoryFormWrapper({ variant }: TriggerVariant) {
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
              Create Inventory
            </>
          )}
        </Button>
      }
      title="Create Inventory"
      description="Fill out the form below to create a new Inventory."
      closeable={true}
      renderActions={
        <Button form="new-inventory-form" type="submit" variant="primary">
          Save Inventory
        </Button>
      }
      className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewInventory formId="new-inventory-form" hideSubmitButton />
      </ScrollArea>
    </Drawer>
  );
}
