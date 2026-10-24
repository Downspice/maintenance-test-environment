"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { TableRowActions } from "@/components/ui/table-row-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import Fieldset from "@/components/customUI/fieldset";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import {
  useGetLocations,
  useGetPurchaseOrderTerms,
} from "@/services/setups/lookups";
import { useGetCustomers } from "@/services/setups/customer";
import { useGetWarehouses } from "@/services/setups/inventory";
import {
  useAddInvoice,
  useGetItemTypes,
  useGetPaymentMethods,
  useGetNextInvoiceNumber,
} from "@/services/setups/invoice";
import { convertToOptionList } from "@/lib/shared/utils";

type Customer = {
  id: string;
  company_name: string;
  address: string;
  phone_one?: string;
  country?: string;
  customer_shipping: {
    address: string;
    phone_one?: string;
    country?: string;
  };
};

// Updated Schema to match backend structure
export const InvoiceSchema = z.object({
  id: z.string().optional(),
  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_date: z.date({
    required_error: "Invoice date is required",
  }),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  customer_id: z.string().min(1, "Customer is required"),
  customer_billing: z.string().optional(),
  customer_shipping: z.string().optional(),
  invoice_notes: z.string().optional(),
  internal_notes: z.string().optional(),
  term_id: z.string().optional(),
  po_number: z.string().optional(),
  location_id: z.string().optional(),
  is_discount: z.coerce.number().optional(),
  discount_type: z.string().optional(),
  discount: z.coerce.number().optional(),
  discount_amount: z.coerce.number().optional(),
  tax_one: z.coerce.number().optional(),
  tax_one_amount: z.coerce.number().optional(),
  tax_two: z.coerce.number().optional(),
  tax_two_amount: z.coerce.number().optional(),
  shipping: z.coerce.number().optional(),
  total: z.coerce.number().optional(),
  payments: z.coerce.number().optional(),
  balance_due: z.coerce.number().optional(),
  others: z
    .array(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    )
    .optional(),
});

// Updated Item Schema to match backend
export const InvoiceItemSchema = z.object({
  item_type_id: z.string().min(1, "Item type is required"),
  item: z.string().min(1, "Item name is required"),
  cost: z.coerce.number().min(0, "Cost must be positive"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  amount: z.coerce.number().min(0),
  extended_cost: z.coerce.number().min(0),
  tax_one: z.coerce.number().optional(),
  tax_two: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  warehouse_id: z.string().min(1, "Warehouse is required"),
});

export type InvoiceItemInterface = z.infer<typeof InvoiceItemSchema>;

// Updated Payment Schema to match backend
export const InvoicePaymentSchema = z.object({
  date_received: z.date({
    required_error: "Date received is required",
  }),
  amount_received: z.coerce.number().min(0, "Amount must be positive"),
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

export type PaymentFormValues = z.infer<typeof InvoicePaymentSchema>;

export default function NewInvoiceForm({
  formId = "new-invoice-form",
  hideSubmitButton,
}: {
  formId?: string;
  hideSubmitButton?: boolean;
} = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { mutateAsync } = useAddInvoice();

  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();
  const {
    data: warehouseOptionsList,
    isLoading: warehouseOptionsListLoading,
    error: warehouseOptionsListError,
  } = useGetWarehouses<Array<{ id: string; name: string }>>();
  const {
    data: itemTypesOptionsList,
    isLoading: itemTypesListLoading,
    error: itemTypesListError,
  } = useGetItemTypes<Array<{ id: string; name: string }>>();
  const {
    data: invoicePaymentMethodOptionsList,
    isLoading: invoicePaymentMethodListLoading,
    error: invoicePaymentMethodListError,
  } = useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const {
    data: customersOptionsList,
    isLoading: customersListLoading,
    error: customersListError,
  } = useGetCustomers<Customer[]>();

  const { data: nextInvoiceNumberData } = useGetNextInvoiceNumber();

  const [items, setItems] = useState<InvoiceItemInterface[]>([]);
  const [editItems, setEditItems] = useState<InvoiceItemInterface | null>(null);
  const [openItems, setOpenItems] = useState(false);

  const [paymentsList, setPaymentsList] = useState<PaymentFormValues[]>([]);
  const [editPaymentIndex, setEditPaymentIndex] = useState<number | null>(null);
  const [editPayment, setEditPayment] = useState<PaymentFormValues | null>(
    null
  );
  const [openPayments, setOpenPayments] = useState(false);

  const handleDeleteItem = (index: number) => {
    const filtered = items.filter((_, idx) => idx !== index);
    setItems(filtered);
  };

  const handleEditItem = (item: InvoiceItemInterface, index: number) => {
    setEditIndex(index);
    setEditItems(item);
    Itemsform.reset(item);
    setOpenItems(true);
  };

  const Itemsform = useForm<InvoiceItemInterface>({
    resolver: zodResolver(InvoiceItemSchema),
    defaultValues: {
      quantity: 1,
      cost: 0,
      amount: 0,
      extended_cost: 0,
      tax_one: 0,
      tax_two: 0,
      discount: 0,
    },
  });

  function onSubmitItems(data: InvoiceItemInterface) {
    // Calculate amount and extended_cost
    const calculatedAmount = data.quantity * data.cost;
    const itemData = {
      ...data,
      amount: calculatedAmount,
      extended_cost: calculatedAmount,
    };

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = itemData;
      setItems(updated);
    } else {
      setItems((prev) => [...prev, itemData]);
    }

    Itemsform.reset({
      quantity: 1,
      item: "",
      cost: 0,
      amount: 0,
      item_type_id: "",
      warehouse_id: "",
      extended_cost: 0,
      tax_one: 0,
      tax_two: 0,
      discount: 0,
    });

    setEditItems(null);
    setEditIndex(null);
    setOpenItems(false);
  }

  const form = useForm<z.infer<typeof InvoiceSchema>>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      is_discount: 0,
      discount: 0,
      discount_amount: 0,
      tax_one: 0,
      tax_one_amount: 0,
      tax_two: 0,
      tax_two_amount: 0,
      shipping: 0,
      total: 0,
      payments: 0,
      balance_due: 0,
      others: [],
    },
  });

  useEffect(() => {
    if (nextInvoiceNumberData) {
      form.setValue("invoice_number", nextInvoiceNumberData);
    }
  }, [nextInvoiceNumberData, form]);

  const customerId = form.watch("customer_id");

  useEffect(() => {
    if (customerId && customersOptionsList) {
      const customer = customersOptionsList.find((c) => c.id === customerId);
      if (customer) {
        const billingDetails = [
          customer.address,
          customer.phone_one && `Phone: ${customer.phone_one}`,
          customer.country && `Country: ${customer.country}`,
        ]
          .filter(Boolean)
          .join("\n");

        const shippingDetails = [
          customer.customer_shipping?.address,
          customer.customer_shipping?.phone_one &&
            `Phone: ${customer.customer_shipping.phone_one}`,
          customer.customer_shipping?.country &&
            `Country: ${customer.customer_shipping.country}`,
        ]
          .filter(Boolean)
          .join("\n");

        form.setValue("customer_billing", billingDetails);
        form.setValue("customer_shipping", shippingDetails);
      }
    }
  }, [customerId, customersOptionsList, form]);

  function onSubmit(data: z.infer<typeof InvoiceSchema>) {
    // Transform data to match backend format
    const backendData = {
      ...data,
      invoice_date: data.invoice_date.toISOString().split("T")[0],
      due_date: data.due_date.toISOString().split("T")[0],
      invoice_items: items,
      invoice_payments: paymentsList.map((payment) => ({
        date_received: payment.date_received.toISOString().split("T")[0],
        amount_received: payment.amount_received,
        payment_method_id: payment.payment_method_id,
        metadata: payment.metadata || {},
      })),
    };

    console.log("Form submitted with VALUES:", backendData);
    const res = mutateAsync(backendData);
    if (res) {
      toast.success(res.message, {
        duration: 5000,
      });
    }

    form.reset();
    setItems([]);
    setPaymentsList([]);
  }

  function onError(errors: any) {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => `${field}: ${error.message}`
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  }

  const watchDiscountType = form.watch("discount_type");

  const PaymentsForm = useForm<PaymentFormValues>({
    resolver: zodResolver(InvoicePaymentSchema),
    defaultValues: {
      amount_received: 0,
      metadata: {},
    },
  });

  function onSubmitPayment(data: PaymentFormValues) {
    if (editPaymentIndex !== null) {
      const updated = [...paymentsList];
      updated[editPaymentIndex] = data;
      setPaymentsList(updated);
    } else {
      setPaymentsList((prev) => [...prev, data]);
    }

    setEditPaymentIndex(null);
    setEditPayment(null);
    PaymentsForm.reset({
      amount_received: 0,
      metadata: {},
    });
    setOpenPayments(false);
  }

  const {
    data: termsOptionsList,
    isLoading: termsOptionsListLoading,
    error: termsOptionsListError,
  } = useGetPurchaseOrderTerms<Array<{ id: string; name: string }>>();

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row gap-x-3">
            <InputWrapper
              control={form.control}
              name="invoice_number"
              label="Invoice #"
              value=""
              type="text"
            />
            <DatePickerWrapper
              control={form.control}
              name="invoice_date"
              label="Invoice Date"
            />
            <DatePickerWrapper
              control={form.control}
              name="due_date"
              label="Due Date"
            />
          </div>
          <div className="grid grid-cols-2 space-x-3">
            <div className="col-span-1 flex flex-col">
              <ComboboxFieldWrapper
                control={form.control}
                name="customer_id"
                label="Customer"
                options={convertToOptionList(
                  customersOptionsList ?? [],
                  "id",
                  "company_name"
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-8 gap-4 items-start">
            <div className="col-span-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Fieldset
                  legend="Billing"
                  className="h-full"
                  content={
                    <TextareaWrapper
                      control={form.control}
                      name="customer_billing"
                      label=""
                      placeholder="Billing address"
                      value=""
                    />
                  }
                />
                <Fieldset
                  legend="Shipping"
                  className="h-full"
                  content={
                    <TextareaWrapper
                      control={form.control}
                      name="customer_shipping"
                      label=""
                      placeholder="Shipping address"
                      value=""
                    />
                  }
                />
              </div>
              <Tabs defaultValue="Items" className="w-full">
                <TabsList>
                  <TabsTrigger value="Items">Items</TabsTrigger>
                  <TabsTrigger value="Payments">Payments</TabsTrigger>
                  <TabsTrigger value="Notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="Items">
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        setEditIndex(null);
                        setEditItems(null);
                        Itemsform.reset({
                          quantity: 1,
                          item: "",
                          cost: 0,
                          amount: 0,
                          item_type_id: "",
                          warehouse_id: "",
                          extended_cost: 0,
                          tax_one: 0,
                          tax_two: 0,
                          discount: 0,
                        });
                        setOpenItems(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </div>

                  <Modal
                    open={openItems}
                    onOpenChange={(val) => {
                      setOpenItems(val);
                      if (!val) {
                        setEditIndex(null);
                        setEditItems(null);
                      }
                    }}
                    title={
                      editIndex !== null
                        ? "Edit Invoice Item"
                        : "Add Invoice Item"
                    }
                    description={
                      editIndex !== null
                        ? "Update the details for this invoice line item."
                        : "Fill out the details below to add an item to this invoice."
                    }
                    size="lg"
                    closeable={true}
                    renderActions={
                      <Button
                        form="invoice-item-form"
                        type="submit"
                        variant="primary"
                      >
                        {editIndex !== null ? "Update Item" : "Save Item"}
                      </Button>
                    }
                  >
                    <Form {...Itemsform}>
                      <form
                        id="invoice-item-form"
                        onSubmit={Itemsform.handleSubmit(
                          onSubmitItems,
                          (errors) => {
                            console.log(errors);
                            const firstErrorField = Object.values(errors)[0];
                            const message = firstErrorField?.message;

                            if (message) {
                              toast.error(message);
                            } else {
                              toast.error("Please check the form for errors.");
                            }
                          }
                        )}
                        className="flex flex-col gap-1 py-1"
                      >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <InputWrapper
                            control={Itemsform.control}
                            name="quantity"
                            label="Quantity"
                            type="number"
                            required
                          />
                          <InputWrapper
                            control={Itemsform.control}
                            name="item"
                            label="Item Name"
                            type="text"
                            required
                          />
                        </div>
                        <ComboboxFieldWrapper
                          control={Itemsform.control}
                          name="item_type_id"
                          label="Item Type"
                          options={itemTypesOptionsList ?? []}
                          required
                        />
                        <ComboboxFieldWrapper
                          control={Itemsform.control}
                          name="warehouse_id"
                          label="Warehouse"
                          options={warehouseOptionsList ?? []}
                          required
                        />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <InputWrapper
                            control={Itemsform.control}
                            name="cost"
                            label="Unit Cost"
                            type="number"
                            required
                          />
                          <InputWrapper
                            control={Itemsform.control}
                            name="discount"
                            label="Discount"
                            type="number"
                          />
                        </div>
                      </form>
                    </Form>
                  </Modal>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Qty</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>{item.cost}</TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell
                            className="w-px whitespace-nowrap"
                            style={{ width: "1%" }}
                          >
                            <TableRowActions
                              onEdit={() => handleEditItem(item, idx)}
                              onDelete={() => handleDeleteItem(idx)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="Payments">
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        setEditPaymentIndex(null);
                        setEditPayment(null);
                        PaymentsForm.reset({
                          amount_received: 0,
                          metadata: {},
                        });
                        setOpenPayments(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Payment
                    </Button>
                  </div>

                  <Modal
                    open={openPayments}
                    onOpenChange={(val) => {
                      setOpenPayments(val);
                      if (!val) {
                        setEditPaymentIndex(null);
                        setEditPayment(null);
                      }
                    }}
                    title={
                      editPaymentIndex !== null ? "Edit Payment" : "Add Payment"
                    }
                    description={
                      editPaymentIndex !== null
                        ? "Update the details for this payment."
                        : "Fill out the details below to record a payment for this invoice."
                    }
                    size="lg"
                    closeable={true}
                    renderActions={
                      <Button
                        form="invoice-payment-form"
                        type="submit"
                        variant="primary"
                      >
                        {editPaymentIndex !== null
                          ? "Update Payment"
                          : "Save Payment"}
                      </Button>
                    }
                  >
                    <Form {...PaymentsForm}>
                      <form
                        id="invoice-payment-form"
                        onSubmit={PaymentsForm.handleSubmit(
                          onSubmitPayment,
                          (errors) => {
                            console.log(errors);
                            const firstErrorField = Object.values(errors)[0];
                            const message = firstErrorField?.message;

                            if (message) {
                              toast.error(message);
                            } else {
                              toast.error("Please check the form for errors.");
                            }
                          }
                        )}
                        className="flex flex-col gap-1 py-1"
                      >
                        <DatePickerWrapper
                          name="date_received"
                          label="Date Received"
                          control={PaymentsForm.control}
                          required
                        />
                        <InputWrapper
                          name="amount_received"
                          type="number"
                          label="Amount Received"
                          control={PaymentsForm.control}
                          required
                        />
                        <ComboboxFieldWrapper
                          control={PaymentsForm.control}
                          name="payment_method_id"
                          label="Payment Method"
                          options={invoicePaymentMethodOptionsList ?? []}
                          required
                        />
                        <InputWrapper
                          name="metadata.cheque_number"
                          type="text"
                          label="Cheque Number"
                          control={PaymentsForm.control}
                        />
                      </form>
                    </Form>
                  </Modal>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentsList.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {payment.date_received.toLocaleDateString()}
                          </TableCell>
                          <TableCell>{payment.amount_received}</TableCell>
                          <TableCell
                            className="w-px whitespace-nowrap"
                            style={{ width: "1%" }}
                          >
                            <TableRowActions
                              editLabel="Edit payment"
                              deleteLabel="Delete payment"
                              onEdit={() => {
                                setEditPaymentIndex(index);
                                setEditPayment(payment);
                                PaymentsForm.reset(payment);
                                setOpenPayments(true);
                              }}
                              onDelete={() => {
                                setPaymentsList(
                                  paymentsList.filter((_, i) => i !== index)
                                );
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="Notes">
                  <TextareaWrapper
                    label="Invoice Notes"
                    name="invoice_notes"
                    control={form.control}
                    value=""
                  />
                  <TextareaWrapper
                    label="Internal Notes"
                    name="internal_notes"
                    control={form.control}
                    value=""
                  />
                </TabsContent>
              </Tabs>
            </div>
            <div className="col-span-3">
              <Fieldset
                legend="Miscellaneous"
                content={
                  <>
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="term_id"
                      label="Terms"
                      options={termsOptionsList ?? []}
                    />
                    <InputWrapper
                      control={form.control}
                      name="po_number"
                      label="PO #"
                      value=""
                      type="text"
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="location_id"
                      label="Location"
                      options={locationOptionsList || []}
                    />
                  </>
                }
              />
              <Fieldset
                legend="Totals"
                content={
                  <>
                    <InputWrapper
                      control={form.control}
                      name="discount_type"
                      label="Discount Type"
                      value=""
                      type="text"
                    />
                    <InputWrapper
                      control={form.control}
                      name="discount_amount"
                      label="Discount Amount"
                      value=""
                      type="number"
                    />
                    <InputWrapper
                      control={form.control}
                      name="tax_one"
                      label="Tax 1"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="tax_two"
                      label="Tax 2"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="shipping"
                      label="Shipping"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="total"
                      label="Total"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="payments"
                      label="Payments"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="balance_due"
                      label="Balance Due"
                      type="number"
                      value=""
                    />
                  </>
                }
              />
            </div>
          </div>
        </div>
        {!hideSubmitButton && (
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32 my-4 w-full"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
