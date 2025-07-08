"use client";

import { useState } from "react";
import { RegisterOptions, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pen, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Form wrappers
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
// Schema and types
import {
  equipmentSchema,
  type EquipmentFormValues,
  assigneeOptions,
} from "@/lib/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
import { locationOptionsList } from "@/lib/option-list";
import { toast } from "sonner";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { termsList } from "./new-purchase-order-form";
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
  maintenanceItems,
  payments,
} from "@/lib/invoices-page-data";

interface triggerVariant {
  variant?: "icon" | "default";
}

const handleDeleteContact = (contactId: string) => {
  console.log("Delete contact:", contactId);
};

export default function NewInvoiceForm({ variant }: triggerVariant) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      status: "Active",
      renewalInterval: 1,
      primaryMeter: 0,
      secondaryMeter: 0,
      purchasePrice: 0,
      salvagePrice: 0,
      depreciationLifeMonths: 0,
      warrantyDescription: "Primary",
      secondaryWarrantyDescription: "Secondary",
      mviInterval: 1,
      ownership: "Owned",
      fuelVolumeUnits: "Gallons",
      annualOperatingBudget: 0,
      hasMeter: false,
    },
  });

  function onSubmit(data: EquipmentFormValues) {
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
                            <TableCell>{data.transaction_notes}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteContact(data.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteContact(data.id)}
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
                      options={termsList}
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
