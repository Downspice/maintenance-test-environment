"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import FormSubheader from "@/components/forms/ui/formSubheader";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import {
  useGetPaymentMethods,
  useGetInvoices,
  useUpdateInvoicePayment,
} from "@/services/setups/invoice";
import { convertToOptionList } from "@/lib/shared/utils";

const paymentSchema = z.object({
  id: z.string().optional(),
  invoice_number: z.string().min(1, "Invoice is required"),
  date_received: z.date().optional(),
  amount_received: z.coerce.string().min(1, "Amount is required"),
  payment_method_id: z.string().min(1, "Payment method is required"),
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
  const { data: invoicePaymentMethodOptionsList } =
    useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const { data: invoices } =
    useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(
    invoices ?? [],
    "id",
    "invoice_number"
  );
  const updatePaymentMutation = useUpdateInvoicePayment();

  const PaymentsForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      ...data,
      date_received: data.date_received
        ? new Date(data.date_received)
        : undefined,
    },
  });

  const paymentMethodWatch = PaymentsForm.watch("payment_method_id");

  const selectedMethod = invoicePaymentMethodOptionsList?.find(
    (item) => item.id === paymentMethodWatch || item.name === paymentMethodWatch
  );
  const methodName = (selectedMethod?.name || "").toLowerCase();
  const isCheque =
    paymentMethodWatch === "9c9dc3d7-dede-42d5-bb22-aab2b82a3a63" ||
    methodName.includes("cheque") ||
    methodName.includes("check");
  const isCreditCard =
    paymentMethodWatch === "3b5caa3b-376e-44b4-a6a6-22a7026ae925" ||
    methodName.includes("credit") ||
    methodName.includes("card");
  const isOther =
    paymentMethodWatch === "Other" || methodName.includes("other");

  async function handleSubmit(formData: PaymentFormValues) {
    try {
      const payload = {
        ...formData,
        id: data.id || "",
        date_received: formData.date_received
          ? formData.date_received.toISOString().split("T")[0]
          : undefined,
      };

      await updatePaymentMutation.mutateAsync(payload);
      toast.success("Payment record updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating payment record:", error);
      toast.error(
        "Failed to update payment record. Please check the form and try again."
      );
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      modal={false}
      trigger={children}
      title="Edit Payment"
      description="Update the payment record details below."
      closeable={true}
      renderActions={
        <Button
          form="edit-payment-form"
          type="submit"
          variant="primary"
          disabled={updatePaymentMutation.isPending}
        >
          {updatePaymentMutation.isPending ? "Updating..." : "Update Payment"}
        </Button>
      }
      className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <Form {...PaymentsForm}>
          <form
            id="edit-payment-form"
            onSubmit={PaymentsForm.handleSubmit(handleSubmit, (errors) => {
              const firstErrorField = Object.values(errors)[0];
              const message =
                firstErrorField &&
                typeof firstErrorField === "object" &&
                "message" in firstErrorField
                  ? String(firstErrorField.message)
                  : undefined;

              if (message) {
                toast.error(message);
              } else {
                toast.error("Please check the form for errors.");
              }
            })}
          >
            <div className="flex flex-col gap-1">
              <ComboboxFieldWrapper
                control={PaymentsForm.control}
                name="invoice_number"
                label="Invoice #"
                options={invoiceOptionsList}
                disabled
              />
              <InputWrapper
                name="amount_received"
                type="number"
                label="Amount Received"
                control={PaymentsForm.control}
                required
                value=""
              />
              <DatePickerWrapper
                name="date_received"
                label="Date Received"
                control={PaymentsForm.control}
                required
              />

              <FormSubheader header="Payment Method" />

              <SelectWrapper
                control={PaymentsForm.control}
                name="payment_method_id"
                label="Method"
                options={invoicePaymentMethodOptionsList ?? []}
                required
              />

              {isCheque && (
                <InputWrapper
                  name="metadata.cheque_number"
                  type="text"
                  label="Cheque #"
                  control={PaymentsForm.control}
                  value=""
                />
              )}

              {isCreditCard && (
                <>
                  <InputWrapper
                    name="metadata.credit_number"
                    type="text"
                    label="Credit Card #"
                    control={PaymentsForm.control}
                    value=""
                  />
                  <InputWrapper
                    name="metadata.name_on_card"
                    type="text"
                    label="Name on Card"
                    control={PaymentsForm.control}
                    value=""
                  />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="col-span-1">
                      <InputWrapper
                        name="metadata.expiration_month"
                        type="text"
                        label="Exp. Month"
                        control={PaymentsForm.control}
                        value=""
                      />
                    </div>
                    <div className="col-span-1">
                      <InputWrapper
                        name="metadata.expiration_year"
                        type="text"
                        label="Exp. Year"
                        control={PaymentsForm.control}
                        value=""
                      />
                    </div>
                  </div>
                  <InputWrapper
                    name="metadata.transaction"
                    type="text"
                    label="Transaction #"
                    control={PaymentsForm.control}
                    value=""
                  />
                </>
              )}

              {isOther && (
                <InputWrapper
                  name="metadata.other"
                  type="text"
                  label="Other Details"
                  control={PaymentsForm.control}
                  value=""
                />
              )}
            </div>
          </form>
        </Form>
      </ScrollArea>
    </Drawer>
  );
}
