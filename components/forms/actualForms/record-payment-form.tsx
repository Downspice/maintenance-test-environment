"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import { ComboboxFieldWrapper, MultiComboboxWrapper } from "../wrappers/ComboboxWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import Fieldset from "@/components/customUI/fieldset";
import SelectWrapper from "../wrappers/SelectWrapper";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useGetPaymentMethods, useGetInvoices, useAddInvoicePayment } from "@/services/setups/invoice";
import { convertToOptionList } from "@/lib/utils";

// Define the form schema with Zod
export const vendorSchema = z.object({
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

export default function RecordPaymentForm() {
  const [open, setOpen] = useState(false);
  const {
    data: invoicePaymentMethodOptionsList,
    isLoading: invoicePaymentMethodListLoading,
    error: invoicePaymentMethodListError,
  } = useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const { data: invoices } = useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(invoices ?? [], "id", "invoice_number");
  const addPaymentMutation = useAddInvoicePayment();

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    try {
      // Format the date to ISO string if it exists
      const payload = {
        ...data,
        date_received: data.date_received ? data.date_received.toISOString().split('T')[0] : undefined,
      };

      await addPaymentMutation.mutateAsync(payload);
      toast.success("Payment record created successfully!");
      vendorForm.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating payment record:", error);
      toast.error("Failed to create payment record. Please try again.");
    }
  }

  const paymentMethodWatch = vendorForm.watch("payment_method_id");
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">New Payment Record</Button>
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
                  <ComboboxFieldWrapper
                    className="col-span-1"
                    control={vendorForm.control}
                    name="invoice_number"
                    label="InvoiceNumber"
                    options={invoiceOptionsList}
                  />
                  <InputWrapper
                    name="amount_received"
                    type="number"
                    label="Amount Received"
                    control={vendorForm.control}
                    value={""}
                  />
                  <DatePickerWrapper
                    name="date_received"
                    label="Date"
                    control={vendorForm.control}
                  />
                  <Fieldset
                    content={
                      <>
                        <SelectWrapper
                          control={vendorForm.control}
                          name="payment_method_id"
                          label="Payment Method"
                          options={invoicePaymentMethodOptionsList ?? []}
                        />
                        {paymentMethodWatch === "9c9dc3d7-dede-42d5-bb22-aab2b82a3a63" && (
                          <InputWrapper
                            name="metadata.cheque_number"
                            type="text"
                            label="Cheque #"
                            control={vendorForm.control}
                            value={""}
                          />
                        )}
                        {paymentMethodWatch === "3b5caa3b-376e-44b4-a6a6-22a7026ae925" && (
                          <>
                            <InputWrapper
                              name="metadata.credit_number"
                              type="text"
                              label="Credit #"
                              control={vendorForm.control}
                              value={""}
                            />
                            <InputWrapper
                              name="metadata.name_on_card"
                              type="text"
                              label="Name on Card"
                              control={vendorForm.control}
                              value={""}
                            />
                            <div className="grid grid-cols-2 gap-x-2">
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="metadata.expiration_month"
                                  type="text"
                                  label="Expiration month"
                                  control={vendorForm.control}
                                  value={""}
                                />
                              </div>
                              <div className="col-span-1 flex flex-col">
                                <InputWrapper
                                  name="metadata.expiration_year"
                                  type="text"
                                  label="Expiration Year"
                                  control={vendorForm.control}
                                  value={""}
                                />
                              </div>
                            </div>
                            <InputWrapper
                              name="metadata.transaction"
                              type="text"
                              label="Transaction"
                              control={vendorForm.control}
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
                <Button
                  className=" w-full"
                  type="submit"
                  disabled={addPaymentMutation.isPending}
                >
                  <GitPullRequestArrow className="mr-2" />
                  {addPaymentMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ActualRecordPaymentForm() {
  const {
    data: invoicePaymentMethodOptionsList,
  } = useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const { data: invoices } = useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(invoices ?? [], "id", "invoice_number");

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  const paymentMethodWatch = vendorForm.watch("payment_method_id");
  return (

    <Form {...vendorForm}>
      <form
        onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}
      >
        <div className="grid grid-cols-2 space-y-2">
          <div className="col-span-2 flex space-y-2 flex-col">
            <MultiComboboxWrapper
              className="col-span-1"
              control={vendorForm.control}
              name="invoice_number"
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
              name="date_received"
              label="Date"
              control={vendorForm.control}
            />
            <Fieldset
              content={
                <>
                  <SelectWrapper
                    control={vendorForm.control}
                    name="payment_method_id"
                    label="Payment Method"
                    options={invoicePaymentMethodOptionsList ?? []}
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

  );
}