"use client";

import RecordPaymentForm, {
  type RecordPaymentFormProps,
} from "@/components/forms/entities/record-payment-form";

export default function PaymentFormWrapper(props: RecordPaymentFormProps) {
  return <RecordPaymentForm {...props} />;
}
