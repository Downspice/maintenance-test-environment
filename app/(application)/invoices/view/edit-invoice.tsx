"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pen, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {
  discount_typesOptions,
  invoicePaymentMethodOptionsList,
} from "@/lib/Invoice/invoices-page-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetCustomers,
  useGetLocations,
  useGetPurchaseOrderTerms,
} from "@/services/setups/vendor";
import { useGetWarehouses } from "@/services/setups/inventory";
import {
  useGetInvoice,
  useGetItemTypes,
  useGetPaymentMethods,
  useUpdateInvoice,
} from "@/services/setups/invoice";
import { convertToOptionList } from "@/lib/utils";

// Schema definitions (matching the creation form)
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
        value: z.string(),
      })
    )
    .optional(),
});

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

interface EditInvoiceProps {
  children: React.ReactNode;
  invoiceId: string;
}

export default function EditInvoice({ children, invoiceId }: EditInvoiceProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Fetch invoice data
  const { data: invoiceData, isLoading: isLoadingInvoice } = useGetInvoice(invoiceId);
  const { mutateAsync: updateInvoice } = useUpdateInvoice();

  // Fetch dropdown options
  const { data: locationOptionsList } = useGetLocations<Array<{ id: string; name: string }>>();
  const { data: warehouseOptionsList } = useGetWarehouses<Array<{ id: string; name: string }>>();
  const { data: itemTypesOptionsList } = useGetItemTypes<Array<{ id: string; name: string }>>();
  const { data: paymentMethodOptionsList } = useGetPaymentMethods<Array<{ id: string; name: string }>>();
  const { data: customersOptionsList } = useGetCustomers<Array<{ id: string; company_name: string }>>();
  const { data: termsOptionsList } = useGetPurchaseOrderTerms<Array<{ id: string; name: string }>>();

  const [items, setItems] = useState<InvoiceItemInterface[]>([]);
  const [editItems, setEditItems] = useState<InvoiceItemInterface | null>(null);
  const [openItems, setOpenItems] = useState(false);

  const [paymentsList, setPaymentsList] = useState<PaymentFormValues[]>([]);
  const [editPaymentIndex, setEditPaymentIndex] = useState<number | null>(null);
  const [editPayment, setEditPayment] = useState<PaymentFormValues | null>(null);
  const [openPayments, setOpenPayments] = useState(false);

  // Initialize form
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
    },
  });

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

  const PaymentsForm = useForm<PaymentFormValues>({
    resolver: zodResolver(InvoicePaymentSchema),
    defaultValues: {
      amount_received: 0,
      metadata: {},
    },
  });

  // Prepopulate form when invoice data loads
  useEffect(() => {
    if (invoiceData) {
      // Transform backend data to form format
      form.reset({
        id: invoiceData.id,
        invoice_number: invoiceData.invoice_number,
        invoice_date: new Date(invoiceData.invoice_date),
        due_date: new Date(invoiceData.due_date),
        customer_id: invoiceData.customer_id,
        customer_billing: invoiceData.customer_billing || "",
        customer_shipping: invoiceData.customer_shipping || "",
        invoice_notes: invoiceData.invoice_notes || "",
        internal_notes: invoiceData.internal_notes || "",
        term_id: invoiceData.term_id || "",
        po_number: invoiceData.po_number || "",
        location_id: invoiceData.location_id || "",
        is_discount: invoiceData.is_discount ? 1 : 0,
        discount_type: invoiceData.discount_type || "",
        discount: parseFloat(invoiceData.discount || "0"),
        discount_amount: parseFloat(invoiceData.discount_amount || "0"),
        tax_one: parseFloat(invoiceData.tax_one || "0"),
        tax_one_amount: parseFloat(invoiceData.tax_one_amount || "0"),
        tax_two: parseFloat(invoiceData.tax_two || "0"),
        tax_two_amount: parseFloat(invoiceData.tax_two_amount || "0"),
        shipping: parseFloat(invoiceData.shipping || "0"),
        total: parseFloat(invoiceData.total || "0"),
        payments: parseFloat(invoiceData.payments || "0"),
        balance_due: parseFloat(invoiceData.balance_due || "0"),
        others: invoiceData.others || [],
      });

      if (invoiceData.invoice_items) {
        const transformedItems = invoiceData.invoice_items.map((item: any) => ({
          item_type_id: item.item_type_id,
          item: item.item,
          cost: parseFloat(item.cost),
          quantity: item.quantity,
          amount: parseFloat(item.amount),
          extended_cost: parseFloat(item.extended_cost),
          tax_one: item.tax_one ? 1 : 0,
          tax_two: item.tax_two ? 1 : 0,
          discount: item.discount ? 1 : 0,
          warehouse_id: item.warehouse_id,
        }));
        setItems(transformedItems);
      }

      if (invoiceData.invoice_payments) {
        const transformedPayments = invoiceData.invoice_payments.map((payment: any) => ({
          date_received: new Date(payment.date_received),
          amount_received: parseFloat(payment.amount_received),
          payment_method_id: payment.payment_method_id,
          metadata: payment.metadata || {},
        }));
        setPaymentsList(transformedPayments);
      }
    }
  }, [invoiceData]);

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

  function onSubmitItems(data: InvoiceItemInterface) {
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

  async function onSubmit(data: z.infer<typeof InvoiceSchema>) {
    setIsSubmitting(true);
    try {
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

      const res = await updateInvoice(backendData);
      if (res) {
        toast.success("Invoice updated successfully!", {
          duration: 5000,
        });
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update invoice", {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoadingInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Invoice: {invoiceData?.invoice_number}</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form
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
                <div className="grid grid-cols-8 gap-4">
                  <div className="col-span-5 grid grid-cols-2 gap-1">
                    <div className="col-span-1">
                      <Fieldset
                        legend="Billing"
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
                    </div>
                    <div className="col-span-1">
                      <Fieldset
                        legend="Shipping"
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
                    <div className="col-span-2">
                      <Tabs defaultValue="Items" className="w-full">
                        <TabsList>
                          <TabsTrigger value="Items">Items</TabsTrigger>
                          <TabsTrigger value="Payments">Payments</TabsTrigger>
                          <TabsTrigger value="Notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Items">
                          <div className="flex justify-end mb-2">
                            <Dialog open={openItems} onOpenChange={setOpenItems}>
                              <DialogTrigger asChild>
                                <Button variant="outline">Add Item</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    {editIndex !== null ? "Edit Item" : "Add Item"}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 mt-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="quantity"
                                      label="Quantity"
                                      type="number"
                                      value=""
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="item"
                                      label="Item Name"
                                      type="text"
                                      value=""
                                    />
                                  </div>
                                  <ComboboxFieldWrapper
                                    control={Itemsform.control}
                                    name="item_type_id"
                                    label="Item Type"
                                    options={itemTypesOptionsList ?? []}
                                  />
                                  <ComboboxFieldWrapper
                                    control={Itemsform.control}
                                    name="warehouse_id"
                                    label="Warehouse"
                                    options={warehouseOptionsList ?? []}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="cost"
                                      label="Unit Cost"
                                      type="number"
                                      value=""
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="discount"
                                      label="Discount"
                                      type="number"
                                      value=""
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={Itemsform.handleSubmit(onSubmitItems)}
                                  >
                                    Save Item
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

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
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEditItem(item, idx)}
                                      >
                                        <Pen className="w-4 h-4 text-blue-500" />
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDeleteItem(idx)}
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                        <TabsContent value="Payments">
                          <div className="flex justify-end mb-2">
                            <Dialog
                              open={openPayments}
                              onOpenChange={setOpenPayments}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline">Add Payment</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    {editPaymentIndex !== null
                                      ? "Edit Payment"
                                      : "Add Payment"}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 mt-4">
                                  <DatePickerWrapper
                                    name="date_received"
                                    label="Date Received"
                                    control={PaymentsForm.control}
                                  />
                                  <InputWrapper
                                    name="amount_received"
                                    type="number"
                                    label="Amount Received"
                                    control={PaymentsForm.control}
                                    value=""
                                  />
                                  <ComboboxFieldWrapper
                                    control={PaymentsForm.control}
                                    name="payment_method_id"
                                    label="Payment Method"
                                    options={paymentMethodOptionsList ?? []}
                                  />
                                  <InputWrapper
                                    name="metadata.cheque_number"
                                    type="text"
                                    label="Cheque Number"
                                    control={PaymentsForm.control}
                                    value=""
                                  />
                                  <Button
                                    type="button"
                                    onClick={PaymentsForm.handleSubmit(
                                      onSubmitPayment
                                    )}
                                  >
                                    Save Payment
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

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
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setEditPaymentIndex(index);
                                          setEditPayment(payment);
                                          PaymentsForm.reset(payment);
                                          setOpenPayments(true);
                                        }}
                                      >
                                        <Pen className="h-4 w-4 text-blue-400" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          const filtered = paymentsList.filter(
                                            (_, i) => i !== index
                                          );
                                          setPaymentsList(filtered);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
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
                            options={locationOptionsList ?? []}
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
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-32 my-4 w-full"
                >
                  {isSubmitting ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Invoice
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}