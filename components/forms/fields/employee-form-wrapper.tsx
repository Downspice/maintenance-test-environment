"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewEmployeeForm from "@/components/forms/entities/new-employee-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function EmployeeFormWrapper({ variant }: TriggerVariant) {
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
              Create Employee
            </>
          )}
        </Button>
      }
      title="Create Employee"
      description="Fill out the form below to create a new Employee."
      closeable={true}
      renderActions={
        <Button form="new-employee-form" type="submit" variant="primary">
          Save Employee
        </Button>
      }
      className="w-full sm:w-2/3 sm:min-w-[1200px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <NewEmployeeForm
          formId="new-employee-form"
          hideSubmitButton
          onSuccess={() => setOpen(false)}
        />
      </ScrollArea>
    </Drawer>
  );
}
