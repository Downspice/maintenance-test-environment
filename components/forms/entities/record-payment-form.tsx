"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputWrapper from "../fields/InputWrapper";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";
import DatePickerWrapper from "../fields/DatePickerWrapper";
import SelectWrapper from "../fields/SelectWrapper";
import FormSubheader from "../ui/formSubheader";
import {
  useGetPaymentMethods,
  useGetInvoices,
  useAddInvoicePayment,
} from "@/services/setups/invoice";
import { convertToOptionList } from "@/lib/shared/utils";

// Define the payment form schema
export const paymentSchema = z.object({
  invoice_number: z.string().min(1, "Invoice is required"),
  date_received: z.date({
    required_error: "Date received is required",
  }),
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

export type PaymentFormValues = z.infer<typeof paymentSchema>;
// Backwards compatibility alias
export const vendorSchema = paymentSchema;

export interface ActualRecordPaymentFormProps {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
  invoiceNumber?: string;
}

export function ActualRecordPaymentForm({
  formId = "record-payment-form",
  hideSubmitButton = false,
  onSuccess,
  invoiceNumber,
}: ActualRecordPaymentFormProps) {
  const { data: invoicePaymentMethodOptionsList } =
    useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const { data: invoices } =
    useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(
    invoices ?? [],
    "id",
    "invoice_number"
  );
  const addPaymentMutation = useAddInvoicePayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoice_number: invoiceNumber || "",
      amount_received: "",
      date_received: new Date(),
      payment_method_id: "",
      metadata: {},
    },
  });

  const paymentMethodWatch = form.watch("payment_method_id");

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

  async function handleSubmit(data: PaymentFormValues) {
    try {
      const payload = {
        ...data,
        date_received: data.date_received
          ? data.date_received.toISOString().split("T")[0]
          : undefined,
      };

      await addPaymentMutation.mutateAsync(payload);
      toast.success("Payment recorded successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating payment record:", error);
      toast.error("Failed to record payment. Please check the form and try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
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
            control={form.control}
            name="invoice_number"
            label="Invoice #"
            options={invoiceOptionsList}
            required
            disabled={!!invoiceNumber}
          />
          <InputWrapper
            control={form.control}
            name="amount_received"
            type="number"
            label="Amount Received"
            required
            value=""
          />
          <DatePickerWrapper
            control={form.control}
            name="date_received"
            label="Date Received"
            required
          />

          <FormSubheader header="Payment Method" />

          <SelectWrapper
            control={form.control}
            name="payment_method_id"
            label="Method"
            options={invoicePaymentMethodOptionsList ?? []}
            required
          />

          {isCheque && (
            <InputWrapper
              control={form.control}
              name="metadata.cheque_number"
              type="text"
              label="Cheque #"
              value=""
            />
          )}

          {isCreditCard && (
            <>
              <InputWrapper
                control={form.control}
                name="metadata.credit_number"
                type="text"
                label="Credit Card #"
                value=""
              />
              <InputWrapper
                control={form.control}
                name="metadata.name_on_card"
                type="text"
                label="Name on Card"
                value=""
              />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="col-span-1">
                  <InputWrapper
                    control={form.control}
                    name="metadata.expiration_month"
                    type="text"
                    label="Exp. Month"
                    value=""
                  />
                </div>
                <div className="col-span-1">
                  <InputWrapper
                    control={form.control}
                    name="metadata.expiration_year"
                    type="text"
                    label="Exp. Year"
                    value=""
                  />
                </div>
              </div>
              <InputWrapper
                control={form.control}
                name="metadata.transaction"
                type="text"
                label="Transaction #"
                value=""
              />
            </>
          )}

          {isOther && (
            <InputWrapper
              control={form.control}
              name="metadata.other"
              type="text"
              label="Other Details"
              value=""
            />
          )}
        </div>

        {!hideSubmitButton && (
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={addPaymentMutation.isPending}
              className="w-full"
            >
              {addPaymentMutation.isPending ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export interface RecordPaymentFormProps {
  variant?: "icon" | "default";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  invoiceNumber?: string;
}

export default function RecordPaymentForm({
  variant = "default",
  trigger,
  onSuccess,
  invoiceNumber,
}: RecordPaymentFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      modal={false}
      trigger={
        trigger ? (
          trigger
        ) : (
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
                Record Payment
              </>
            )}
          </Button>
        )
      }
      title="Record Payment"
      description="Fill out the form below to record a payment."
      closeable={true}
      renderActions={
        <Button form="record-payment-form" type="submit" variant="primary">
          Save Payment
        </Button>
      }
      className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <ActualRecordPaymentForm
          formId="record-payment-form"
          hideSubmitButton
          invoiceNumber={invoiceNumber}
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
        />
      </ScrollArea>
    </Drawer>
  );
}