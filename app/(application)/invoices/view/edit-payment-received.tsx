"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Fieldset from "@/components/customUI/fieldset";
import { invoiceOptionsList, invoicePaymentMethodOptionsList } from "@/lib/Invoice/invoices-page-data";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";


const paymentSchema = z.object({
  invoice_number: z.string(),
  amount: z.string(),
  date: z.string(),
  paymentMethod: z.string(),
  chequeNumber: z.string().optional(),
  creditNumber: z.string().optional(),
  name: z.string().optional(),
  expirationMonth: z.string().optional(),
  expirationYear: z.string().optional(),
  transaction: z.string().optional(),
  other: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;


export default function EditPaymentReceived({
  children,
  data,
}: {
  children: React.ReactNode;
  data: PaymentFormValues;
}) {
  const [open, setOpen] = useState(false);
  console.log("in payment edit  data new", data);
  const PaymentsForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { ...data },
  });
  const paymentMethodWatch = PaymentsForm.watch("paymentMethod");

  async function handleSubmit(data: PaymentFormValues) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Edited  successfully!");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Record Payment</SheetTitle>
          <SheetDescription>
            Fill out the form below to record Payment
          </SheetDescription>
        </SheetHeader>

        <div>
          <Form {...PaymentsForm}>
            <form
              onSubmit={PaymentsForm.handleSubmit((data) => handleSubmit(data))}
            >
              <div className="grid grid-cols-2 space-y-2">
                <div className="col-span-2 flex space-y-2 flex-col">
                  <ComboboxFieldWrapper
                    className="col-span-1"
                    control={PaymentsForm.control}
                    name="invoice_number"
                    label="InvoiceNumber"
                    options={invoiceOptionsList}
                  />
                  <InputWrapper
                    name="amount"
                    type="number"
                    label="Amount Received"
                    control={PaymentsForm.control}
                    value={""}
                  />
                  <DatePickerWrapper
                    name="date"
                    label="Date"
                    control={PaymentsForm.control}
                  />
                  <Fieldset
                    content={
                      <>
                        <SelectWrapper
                          control={PaymentsForm.control}
                          name="paymentMethod"
                          label="Payment Method"
                          options={invoicePaymentMethodOptionsList}
                        />
                        {paymentMethodWatch === "Cheque" && (
                          <InputWrapper
                            name="chequeNumber"
                            type="text"
                            label="Cheque #"
                            control={PaymentsForm.control}
                            value={""}
                          />
                        )}
                        {paymentMethodWatch === "Credit Card" && (
                          <>
                            <InputWrapper
                              name="creditNumber"
                              type="text"
                              label="Credit #"
                              control={PaymentsForm.control}
                              value={""}
                            />
                            <InputWrapper
                              name="name"
                              type="text"
                              label="Name on Card"
                              control={PaymentsForm.control}
                              value={""}
                            />
                            <div className="grid grid-cols-2 gap-x-2">
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="expirationMonth"
                                  type="text"
                                  label="Expiration month"
                                  control={PaymentsForm.control}
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="expirationMonth"
                                  type="text"
                                  label="Expiration month"
                                  control={PaymentsForm.control}
                                  value={""}
                                />
                              </div>
                            </div>
                            <InputWrapper
                              name="transaction"
                              type="text"
                              label="Transaction"
                              control={PaymentsForm.control}
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
                            control={PaymentsForm.control}
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
