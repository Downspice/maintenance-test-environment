"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Pen, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  assigneeOptions,
  categoryOptions,
  statusOptions,
} from "@/lib/equipment-schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { locationOptionsList, vendorTypeOptions } from "@/lib/option-list";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {
  discountTypesOptions,
  invoiceOptionsList,
  maintenanceItems,
  payments,
} from "@/lib/Invoice/invoices-page-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceInterface, InvoiceSchema } from "@/lib/Invoice/invoice-data";
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

export default function EditInvoice({
  children,
  data,
}: {
  children: React.ReactNode;
  data: InvoiceInterface;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log("in invoices  data new", data);
  const form = useForm<z.infer<typeof InvoiceSchema>>({
    resolver: zodResolver(InvoiceSchema),
    // defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof InvoiceSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Edited  successfully!");
  }
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
  const handleDeleteContact = (contactId: string) => {
    console.log("Delete contact:", contactId);
  };

  const watchDiscountType = form.watch("discountType");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>{data.invoiceNumber}</div>
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
                    name={"invoiceNumber"}
                    label={"Invoice #"}
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
                              {maintenanceItems.map((data) => (
                                <TableRow key={data.item_name}>
                                  <TableCell>{data.quantity}</TableCell>
                                  <TableCell>{data.item_name}</TableCell>
                                  <TableCell>{data.description}</TableCell>
                                  <TableCell>{data.unit_cost}</TableCell>
                                  <TableCell>{data.amount}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteContact(data.item_name)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteContact(data.item_name)
                                      }
                                    >
                                      <Pen className="h-4 w-4 text-blue-400" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                        <TabsContent value="Payments">
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
                              {payments.map((data) => (
                                <TableRow key={data.id}>
                                  <TableCell>{data.date_received}</TableCell>
                                  <TableCell>{data.amount}</TableCell>
                                  <TableCell>{data.payment_type}</TableCell>
                                  <TableCell>{data.check_number}</TableCell>
                                  <TableCell>{data.name_on_card}</TableCell>
                                  <TableCell>
                                    {data.transaction_notes}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteContact(data.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteContact(data.id)
                                      }
                                    >
                                      <Pen className="h-4 w-4 text-blue-400" />
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
                          />
                          <TextareaWrapper
                            label="Internal Notes"
                            name="internalNotes"
                            control={form.control}
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
                              type="text"
                            />
                          )}
                          {watchDiscountType === "amount" && (
                            <InputWrapper
                              control={form.control}
                              name={"discountAmount"}
                              label={"Discount"}
                              type="text"
                            />
                          )}

                          <InputWrapper
                            control={form.control}
                            name="tax1"
                            label="Tax 1"
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name="tax2"
                            label="Tax 2"
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name="shipping"
                            label="Shipping"
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name="total"
                            label="Total"
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name="payments"
                            label="Payments"
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name="balanceDue"
                            label="BalanceDue"
                            type="text"
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
                      Create Invoice
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
