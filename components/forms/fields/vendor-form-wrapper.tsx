"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewVendor from "@/components/forms/entities/new-vendor-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function VendorFormWrapper({ variant }: TriggerVariant) {
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
              Create Vendor
            </>
          )}
        </Button>
      }
      title="Create Vendor"
      description="Fill out the form below to create a new Vendor."
      closeable={true}
      renderActions={
        <Button form="new-vendor-form" type="submit" variant="primary">
          Save Vendor
        </Button>
      }
      className="w-3/4"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewVendor formId="new-vendor-form" hideSubmitButton />
      </ScrollArea>
    </Drawer>
  );
}
