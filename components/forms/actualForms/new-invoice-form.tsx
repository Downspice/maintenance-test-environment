"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pen, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import { assigneeOptions } from "@/lib/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import { locationOptionsList } from "@/lib/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  discountTypesOptions,
  invoiceOptionsList,
  invoicePaymentMethodOptionsList,
  maintenanceItems,
} from "@/lib/Invoice/invoices-page-data";
import { InvoiceInterface, InvoiceSchema } from "@/lib/Invoice/invoice-data";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectWrapper from "../wrappers/SelectWrapper";
 
export const InvoiceItemSchema = z.object({
  quantity: z.number(),
  item_name: z.string(),
  description: z.string().optional(),
  unit_cost: z.number(),
  amount: z.number(),
});

export type InvoiceItemInterface = z.infer<typeof InvoiceItemSchema>;

export const InvoicePaymentSchema = z.object({
  invoiceNumber: z.string(),
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

export type PaymentFormValues = z.infer<typeof InvoicePaymentSchema>;

export default function NewInvoiceForm( ) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [items, setItems] = useState<InvoiceItemInterface[]>([]);
  const [editItems, setEditItems] = useState<InvoiceItemInterface | null>(null);
  const [openItems, setOpenItems] = useState(false);

  //payment states
  const [paymentsList, setPaymentsList] = useState<
    z.infer<typeof InvoicePaymentSchema>[]
  >([]);
  const [editPaymentIndex, setEditPaymentIndex] = useState<number | null>(null);
  const [editPayment, setEditPayment] = useState<z.infer<
    typeof InvoicePaymentSchema
  > | null>(null);
  const [openPayments, setOpenPayments] = useState(false);

  const handleDeleteItem = (itemName: string) => {
    const filtered = items.filter((item) => item.item_name !== itemName);
    setItems(filtered);
  };

  const handleEditItem = (item: InvoiceItemInterface, index: number) => {
    setEditIndex(index);
    setEditItems(item);
    Itemsform.reset(item); // Pre-fill
    setOpenItems(true); // Open the dialog after setting the form
  };

  const Itemsform = useForm<InvoiceItemInterface>({
    resolver: zodResolver(InvoiceItemSchema),
    defaultValues: {},
  });

  function onSubmitItems(data: InvoiceItemInterface) {
    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = data;
      setItems(updated);
    } else {
      setItems((prev) => [...prev, data]);
    }

    Itemsform.reset({
      quantity: 0,
      item_name: "",
      description: "",
      unit_cost: 0,
      amount: 0,
    });

    setEditItems(null);
    setEditIndex(null);
    setOpenItems(false);
  }

  const form = useForm<z.infer<typeof InvoiceSchema>>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {},
  });

  function onSubmit(data: InvoiceInterface) {
    console.log("Form submitted with VALUES:", data);
    toast("Project created successfully!", {
      duration: 10000,
    });

    setOpen(false);
    form.reset();
  }

  function onError(errors: any) {
    // Get all error messages
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          unit: "Project Name",
        };

        return `${fieldLabels[field] || field}: ${error.message}`;
      }
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

  const watchDiscountType = form.watch("discountType");

  //paYMENT STUFF
  const PaymentsForm = useForm<PaymentFormValues>({
    resolver: zodResolver(InvoicePaymentSchema),
    defaultValues: { ...editPayment },
  });

  const paymentMethodWatch = PaymentsForm.watch("paymentMethod");

  function onSubmitPayment(data: z.infer<typeof InvoicePaymentSchema>) {
    if (editPaymentIndex !== null) {
      const updated = [...paymentsList];
      updated[editPaymentIndex] = data;
      setPaymentsList(updated);
    } else {
      setPaymentsList((prev) => [...prev, data]);
    }

    setEditPaymentIndex(null);
    setEditPayment(null);
    PaymentsForm.reset();
    setOpenPayments(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row gap-x-3">
            <InputWrapper
              control={form.control}
              name={"invoiceNumber"}
              label={"Invoice #"}
              value={""}
              type="text"
            />
            <DatePickerWrapper
              control={form.control}
              name="date"
              label="Date"
            />
            <DatePickerWrapper
              control={form.control}
              name="dueDate"
              label="Due By"
            />
          </div>
          <div className="grid grid-cols-2 space-x-3">
            <div className="col-span-1 flex flex-col">
              <ComboboxFieldWrapper
                control={form.control}
                name="customer"
                label="Customer"
                options={assigneeOptions}
              />
            </div>
            <div className="col-span-1 flex flex-col"></div>
          </div>
          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-6 grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <Fieldset
                  legend="Billing"
                  content={
                    <TextareaWrapper
                      control={form.control}
                      name="billing"
                      label=""
                      placeholder=" "
                      value={""}
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
                      name="shipping"
                      label=""
                      placeholder=" "
                      value={""}
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
                    <div className="flex justify-end">
                      <Dialog open={openItems} onOpenChange={setOpenItems}>
                        <DialogTrigger
                          asChild
                          onClick={() => {
                            setEditIndex(null);
                            setEditItems(null);
                            Itemsform.reset({
                              quantity: 0,
                              item_name: "",
                              description: "",
                              unit_cost: 0,
                              amount: 0,
                            }); // ensure blank form for create
                            setOpenItems(true);
                          }}
                        >
                          <Button variant="outline">Add Item</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editIndex !== null
                                ? "Edit Invoice Item"
                                : "Add Invoice Item"}
                            </DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={Itemsform.handleSubmit(onSubmitItems)}
                            className="grid gap-4 mt-4"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <InputWrapper
                                control={Itemsform.control}
                                name="quantity"
                                label="Quantity"
                                type="text"
                                value=""
                              />
                              <InputWrapper
                                control={Itemsform.control}
                                name="item_name"
                                label="Item Name"
                                type="text"
                                value=""
                              />
                            </div>
                            <InputWrapper
                              control={Itemsform.control}
                              name="description"
                              label="Description"
                              type="text"
                              value=""
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <InputWrapper
                                control={Itemsform.control}
                                name="unit_cost"
                                label="Unit Cost"
                                type="number"
                                value=""
                              />
                              <InputWrapper
                                control={Itemsform.control}
                                name="amount"
                                label="Amount"
                                type="number"
                                value={""}
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={Itemsform.handleSubmit(onSubmitItems)}
                            >
                              Save Item
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Qty</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Unit Cost</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.item_name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.unit_cost}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditItems(item);
                                    handleEditItem(item, idx); // Pass index
                                  }}
                                >
                                  <Pen className="w-4 h-4 text-blue-500" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleDeleteItem(item.item_name)
                                  }
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
                    <Dialog open={openPayments} onOpenChange={setOpenPayments}>
                      <DialogTrigger
                        asChild
                        onClick={() => {
                          setEditPayment(null);
                          setEditPaymentIndex(null);
                          PaymentsForm.reset({
                            invoiceNumber: "",
                            amount: 0,
                            date: "",
                            paymentMethod: "",
                            chequeNumber: "",
                            creditNumber: "",
                            name: "",
                            expirationMonth: "",
                            expirationYear: "",
                            transaction: "",
                            other: "",
                          });
                          setOpenPayments(true);
                        }}
                      >
                        <Button variant="outline">Add Payment</Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editPaymentIndex !== null
                              ? "Edit Payment"
                              : "Add Payment"}
                          </DialogTitle>
                        </DialogHeader>

                        <form
                          onSubmit={PaymentsForm.handleSubmit(onSubmitPayment)}
                          className="grid gap-4 mt-4"
                        >
                          <div className="grid grid-cols-2 space-y-2">
                            <div className="col-span-2 flex space-y-2 flex-col">
                              <ComboboxFieldWrapper
                                className="col-span-1"
                                control={PaymentsForm.control}
                                name="invoiceNumber"
                                label="Invoice Number"
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
                                        value=""
                                      />
                                    )}
                                    {paymentMethodWatch === "Credit Card" && (
                                      <>
                                        <InputWrapper
                                          name="creditNumber"
                                          type="text"
                                          label="Credit #"
                                          control={PaymentsForm.control}
                                          value=""
                                        />
                                        <InputWrapper
                                          name="name"
                                          type="text"
                                          label="Name on Card"
                                          control={PaymentsForm.control}
                                          value=""
                                        />
                                        <div className="grid grid-cols-2 gap-x-2">
                                          <InputWrapper
                                            name="expirationMonth"
                                            type="text"
                                            label="Expiration Month"
                                            control={PaymentsForm.control}
                                            value=""
                                          />
                                          <InputWrapper
                                            name="expirationYear"
                                            type="text"
                                            label="Expiration Year"
                                            control={PaymentsForm.control}
                                            value=""
                                          />
                                        </div>
                                        <InputWrapper
                                          name="transaction"
                                          type="text"
                                          label="Transaction"
                                          control={PaymentsForm.control}
                                          value=""
                                        />
                                      </>
                                    )}
                                    {paymentMethodWatch === "Other" && (
                                      <InputWrapper
                                        name="other"
                                        type="text"
                                        label="Other"
                                        control={PaymentsForm.control}
                                        value=""
                                      />
                                    )}
                                  </>
                                }
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              PaymentsForm.handleSubmit(
                                onSubmitPayment,
                                (errors) => {
                                  console.error("Payment form errors:", errors);
                                }
                              )();
                            }}
                          >
                            Save Payment
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date Received</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payments</TableHead>
                          <TableHead>Check #</TableHead>
                          <TableHead>Name On Card</TableHead>
                          <TableHead>Transactions</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentsList.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.date}</TableCell>
                            <TableCell>{data.amount}</TableCell>
                            <TableCell>{data.paymentMethod}</TableCell>
                            <TableCell>{data.chequeNumber}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.transaction}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditPaymentIndex(index);
                                  setEditPayment(data);
                                  PaymentsForm.reset(data);
                                  setOpenPayments(true);
                                }}
                              >
                                <Pen className="h-4 w-4 text-blue-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const filtered = paymentsList.filter(
                                    (_, i) => i !== index
                                  );
                                  setPaymentsList(filtered);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="Notes">
                    <TextareaWrapper
                      label="Invoice Notes"
                      name="invoiceNotes"
                      control={form.control}
                      value={""}
                    />
                    <TextareaWrapper
                      label="Internal Notes"
                      name="internalNotes"
                      control={form.control}
                      value={""}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="col-span-2 ">
              {" "}
              <Fieldset
                legend="Miscellaneous"
                content={
                  <>
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="terms"
                      label="Terms"
                      options={invoiceOptionsList}
                    />
                    <InputWrapper
                      control={form.control}
                      name={"poNumber"}
                      label={"PO #"}
                      value={""}
                      type="text"
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="location"
                      label="Location Filter"
                      options={locationOptionsList}
                    />
                    {/* <CustomFieldsWrapper
                      control={form.control}
                      name={"custom"}
                      label={"Custom"}
                    /> */}
                  </>
                }
              />
              <Fieldset
                legend="Totals"
                content={
                  <>
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="discountType"
                      label="Discount Type"
                      options={discountTypesOptions}
                    />

                    {watchDiscountType === "percent" && (
                      <InputWrapper
                        control={form.control}
                        name={"discountpercent"}
                        label={"Discount"}
                        value={""}
                        type="text"
                      />
                    )}
                    {watchDiscountType === "amount" && (
                      <InputWrapper
                        control={form.control}
                        name={"discountAmount"}
                        label={"Discount"}
                        value={""}
                        type="text"
                      />
                    )}

                    <InputWrapper
                      control={form.control}
                      name="tax1"
                      label="Tax 1"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={form.control}
                      name="tax2"
                      label="Tax 2"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={form.control}
                      name="shipping"
                      label="Shipping"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={form.control}
                      name="total"
                      label="Total"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={form.control}
                      name="payments"
                      label="Payments"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={form.control}
                      name="balanceDue"
                      label="BalanceDue"
                      type="text"
                      value={""}
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
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Equipment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
