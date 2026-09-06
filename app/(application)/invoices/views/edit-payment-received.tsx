"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Fieldset from "@/components/customUI/fieldset";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { useGetPaymentMethods, useGetInvoices } from "@/services/setups/invoice";
import { convertToOptionList } from "@/lib/shared/utils";

const paymentSchema = z.object({
  id: z.string().optional(),
  invoice_number: z.string(),
  date_received: z.date().optional(),
  amount_received: z.coerce.string().optional(),
  payment_method_id: z.string(),
  metadata: z
    .object({
      cheque_number: z.string().optional(),
      credit_number: z.string().optional(),
      name_on_card: z.string().optional(),
      expiration_month: z.string().optional(),
      expiration_year: z.string().optional(),
      transaction: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
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
  const {
    data: invoicePaymentMethodOptionsList,
    isLoading: invoicePaymentMethodListLoading,
    error: invoicePaymentMethodListError,
  } = useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const { data: invoices } = useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(invoices ?? [], "id", "invoice_number");
  const PaymentsForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { ...data },
  });
  const paymentMethodWatch = PaymentsForm.watch("payment_method_id");

  async function handleSubmit(data: PaymentFormValues) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Edited  successfully!");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
                    label="Invoice Number"
                    options={invoiceOptionsList}
                    disabled
                  />
                  <InputWrapper
                    name="amount_received"
                    type="number"
                    label="Amount Received"
                    control={PaymentsForm.control}
                    value={""}
                  />
                  <DatePickerWrapper
                    name="date_received"
                    label="Date Received"
                    control={PaymentsForm.control}
                  />
                  <Fieldset
                    content={
                      <>
                        <SelectWrapper
                          control={PaymentsForm.control}
                          name="payment_method_id"
                          label="Payment Method"
                          options={invoicePaymentMethodOptionsList ?? []}
                        />
                        {paymentMethodWatch === "9c9dc3d7-dede-42d5-bb22-aab2b82a3a63" && (
                          <InputWrapper
                            name="metadata.cheque_number"
                            type="text"
                            label="Cheque #"
                            control={PaymentsForm.control}
                            value={""}
                          />
                        )}
                        {paymentMethodWatch === "3b5caa3b-376e-44b4-a6a6-22a7026ae925" && (
                          <>
                            <InputWrapper
                              name="metadata.credit_number"
                              type="text"
                              label="Credit #"
                              control={PaymentsForm.control}
                              value={""}
                            />
                            <InputWrapper
                              name="metadata.name_on_card"
                              type="text"
                              label="Name on Card"
                              control={PaymentsForm.control}
                              value={""}
                            />
                            <div className="grid grid-cols-2 gap-x-2">
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="metadata.expiration_month"
                                  type="text"
                                  label="Expiration month"
                                  control={PaymentsForm.control}
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="metadata.expiration_year"
                                  type="text"
                                  label="Expiration Year"
                                  control={PaymentsForm.control}
                                  value={""}
                                />
                              </div>
                            </div>
                            <InputWrapper
                              name="metadata.transaction"
                              type="text"
                              label="Transaction"
                              control={PaymentsForm.control}
                              value={""}
                            />
                          </>
                        )}
                        {paymentMethodWatch === "5f27e7e5-08de-4dcf-8fb5-96f6d8ec68f6" && <></>}
                        {paymentMethodWatch === "Other" && (
                          <InputWrapper
                            name="metadata.other"
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
