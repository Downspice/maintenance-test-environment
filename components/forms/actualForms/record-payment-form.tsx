"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
} from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow,  } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import {
  MultiComboboxWrapper,
} from "../wrappers/ComboboxWrapper";
import {
  invoiceOptionsList,
  invoicePaymentMethodOptionsList,
} from "@/lib/Invoice/invoices-page-data";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import Fieldset from "@/components/customUI/fieldset";
import SelectWrapper from "../wrappers/SelectWrapper";
import {Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
  paymentMethod: z.string(),
});

export default function RecordPaymentForm() {
  const [open, setOpen] = useState(false);


  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const paymentMethodWatch = vendorForm.watch("paymentMethod");
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Manage Payment</Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Record Payment</SheetTitle>
          <SheetDescription>
            Fill out the form below to record Payment
          </SheetDescription>
        </SheetHeader>

        <div>
          <Form {...vendorForm}>
            <form
              onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}
            >
              <div className="grid grid-cols-2 space-y-2">
                <div className="col-span-2 flex space-y-2 flex-col">
                  <MultiComboboxWrapper
                    className="col-span-1"
                    control={vendorForm.control}
                    name="invoiceNumber"
                    label="InvoiceNumber"
                    options={invoiceOptionsList}
                  />
                  <InputWrapper
                    name="amount"
                    type="number"
                    label="Amount Received"
                    control={vendorForm.control}
                    value={""}
                  />
                  <DatePickerWrapper
                    name="date"
                    label="Date"
                    control={vendorForm.control}
                  />
                  <Fieldset
                    content={
                      <>
                        <SelectWrapper
                          control={vendorForm.control}
                          name="paymentMethod"
                          label="Payment Method"
                          options={invoicePaymentMethodOptionsList}
                        />
                        {paymentMethodWatch === "Cheque" && (
                          <InputWrapper
                            name="chequeNumber"
                            type="text"
                            label="Cheque #"
                            control={vendorForm.control}
                            value={""}
                          />
                        )}
                        {paymentMethodWatch === "Credit Card" && (
                          <>
                            <InputWrapper
                              name="creditNumber"
                              type="text"
                              label="Credit #"
                              control={vendorForm.control}
                              value={""}
                            />
                            <InputWrapper
                              name="name"
                              type="text"
                              label="Name on Card"
                              control={vendorForm.control}
                              value={""}
                            />
                            <div className="grid grid-cols-2 gap-x-2">
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="expirationMonth"
                                  type="text"
                                  label="Expiration month"
                                  control={vendorForm.control}
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="expirationMonth"
                                  type="text"
                                  label="Expiration month"
                                  control={vendorForm.control}
                                  value={""}
                                />
                              </div>
                            </div>
                            <InputWrapper
                              name="transaction"
                              type="text"
                              label="Transaction"
                              control={vendorForm.control}
                              value={""}
                            />
                          </>
                        )}
                        {paymentMethodWatch === "Electronic Transfer" && <></>}
                        {paymentMethodWatch === "Other" && (
                          <InputWrapper
                            name="other"
                            type="text"
                            label="Other"
                            control={vendorForm.control}
                            value={""}
                          />
                        )}
                      </>
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between gap-x-4 my-8 w-full">
                <Button className=" w-full">
                  <GitPullRequestArrow className="mr-2" /> Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
