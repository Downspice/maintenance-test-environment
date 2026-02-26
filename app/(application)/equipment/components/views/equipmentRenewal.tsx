"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserRoundCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import { useGetEquipmentRenewals, useUpdateEquipmentRenewals } from "@/services/setups/equipments";

// Define the form schema with Zod
export const updateEquipmentSchema = z.object({
  renewal_id: z.string().optional(),
  due_on: z.date().optional(),
});

type RenewalFormValues = z.infer<typeof updateEquipmentSchema>;

// ─── Edit Renewal Form ────────────────────────────────────────────────────────

export default function UpdateEquipmentRenewalForm({
  children,
  data,
  equipmentId,
}: {
  children: React.ReactNode;
  data: any;
  equipmentId?: string | number;
}) {
  const [open, setOpen] = useState(false);
  const { data: renewalOptionsList } = useGetEquipmentRenewals();
  const { mutate: updateRenewal, isPending } = useUpdateEquipmentRenewals();

  const form = useForm<RenewalFormValues>({
    resolver: zodResolver(updateEquipmentSchema),
    defaultValues: {
      renewal_id: data?.renewal_id ?? data?.renewal ?? "",
      due_on: data?.due_on ? new Date(data.due_on) : undefined,
    },
  });

  function handleSubmit(values: RenewalFormValues) {
    if (!equipmentId) {
      toast.error("Equipment ID is missing.");
      return;
    }
    updateRenewal(
      {
        id: equipmentId,
        renewals: [
          {
            id: data?.id,
            renewal_id: values.renewal_id,
            due_on: values.due_on
              ? new Date(values.due_on).toISOString().split("T")[0]
              : null,
          },
        ],
      },
      {
        onSuccess: () => {
          toast.success("Renewal updated successfully!");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update renewal.");
        },
      }
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-1/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Renewal </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div id="fields">
                  <div className="pt-4">
                    <div className="grid grid-cols-1 gap-4 ">
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="renewal_id"
                        label="Name"
                        options={renewalOptionsList}
                      />
                      <DatePickerWrapper
                        control={form.control}
                        name="due_on"
                        required={true}
                        label="Expires"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-x-4 mt-8 w-full">
                  <Button className="w-full" disabled={isPending}>
                    <UserRoundCheck className="mr-2" />
                    {isPending ? "Saving..." : "Update Renewal"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ─── New Renewal Form ─────────────────────────────────────────────────────────

export function NewEquipmentRenewalForm({
  equipmentId,
  onSuccess,
}: {
  equipmentId?: string | number;
  onSuccess?: () => void;
}) {
  const { data: renewalOptionsList } = useGetEquipmentRenewals();
  const { mutate: updateRenewal, isPending } = useUpdateEquipmentRenewals();

  const form = useForm<RenewalFormValues>({
    resolver: zodResolver(updateEquipmentSchema),
    defaultValues: {},
  });

  function handleSubmit(values: RenewalFormValues) {
    if (!equipmentId) {
      toast.error("Equipment ID is missing.");
      return;
    }
    updateRenewal(
      {
        id: equipmentId,
        renewals: [
          {
            renewal_id: values.renewal_id,
            due_on: values.due_on
              ? new Date(values.due_on).toISOString().split("T")[0]
              : null,
          },
        ],
      },
      {
        onSuccess: () => {
          toast.success("Renewal created successfully!");
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to create renewal.");
        },
      }
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div id="fields">
            <div className="pt-4">
              <div className="grid grid-cols-1 gap-4 ">
                <ComboboxFieldWrapper
                  control={form.control}
                  name="renewal_id"
                  label="Name"
                  options={renewalOptionsList ?? []}
                />
                <DatePickerWrapper
                  control={form.control}
                  name="due_on"
                  required={true}
                  label="Expires"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-4 mt-8 w-full">
            <Button className="w-full" disabled={isPending}>
              <UserRoundCheck className="mr-2" />
              {isPending ? "Saving..." : "Add Renewal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
