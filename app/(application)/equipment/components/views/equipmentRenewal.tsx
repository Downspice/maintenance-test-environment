"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserRoundCheck } from "lucide-react";
import { toast } from "sonner";
import { renewalOptionsList } from "@/lib/option-list";
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

// Define the form schema with Zod
export const updateEquipmentSchema = z.object({
  issued_on: z.date({
    required_error: "Date is required",
  }),
  expires_on: z.date({
    required_error: "Date is required",
  }),
});

export default function UpdateEquipmentRenewalForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const [open, setOpen] = useState(false);
  const updateEquipment = useForm<z.infer<typeof updateEquipmentSchema>>({
    resolver: zodResolver(updateEquipmentSchema),
    defaultValues: data,
  });

  async function handleSubmit(data: z.infer<typeof updateEquipmentSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
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
            <Form {...updateEquipment}>
              <form
                onSubmit={updateEquipment.handleSubmit((data) =>
                  handleSubmit(data)
                )}
              >
                <div id="fields">
                  <div className="pt-4">
                    <div className="grid grid-cols-1 gap-4 ">
                      <ComboboxFieldWrapper
                        control={updateEquipment.control}
                        name="Renewal"
                        label="Name"
                        options={renewalOptionsList}
                      />
                      <DatePickerWrapper
                        control={updateEquipment.control}
                        name="dueOn"
                        required={true}
                        label="Expires"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-x-4 mt-8 w-full">
                  <Button className="  w-full">
                    <UserRoundCheck className="mr-2" /> Update Equipment
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

export function NewEquipmentRenewalForm() {
  const updateEquipment = useForm<z.infer<typeof updateEquipmentSchema>>({
    resolver: zodResolver(updateEquipmentSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof updateEquipmentSchema>) {
    console.log(data);
    toast.success("Work Order submitted successfully!");
  }

  return (
    <div>
      <Form {...updateEquipment}>
        <form
          onSubmit={updateEquipment.handleSubmit((data) => handleSubmit(data))}
        >
          <div id="fields">
            <div className="pt-4">
              <div className="grid grid-cols-1 gap-4 ">
                <ComboboxFieldWrapper
                  control={updateEquipment.control}
                  name="renewal"
                  label="Name"
                  options={renewalOptionsList}
                />
                <DatePickerWrapper
                  control={updateEquipment.control}
                  name="expires_on"
                  required={true}
                  label="Expires"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-4 mt-8 w-full">
            <Button className="  w-full">
              <UserRoundCheck className="mr-2" /> Update Equipment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
