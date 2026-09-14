"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewCustomer from "@/components/forms/entities/new-customer-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function CustomerFormWrapper({ variant }: TriggerVariant) {
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
              Create Customer
            </>
          )}
        </Button>
      }
      title="Create Customer"
      description="Fill out the form below to create a new customer."
      closeable={true}
      renderActions={
        <Button form="new-customer-form" type="submit" variant="primary">
          Save Customer
        </Button>
      }
      className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewCustomer formId="new-customer-form" hideSubmitButton />
      </ScrollArea>
    </Drawer>
  );
}
