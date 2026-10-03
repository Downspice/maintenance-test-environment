"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pen, Plus, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Form wrappers
import InputWrapper from "@/components/forms/fields/InputWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
// Schema and types
import { assigneeOptions } from "@/lib/schemas/equipment-schema";
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
import { Modal } from "@/components/ui/modal";
import SelectWrapper from "../fields/SelectWrapper";

import FileUploadWrapper from "../fields/FileUploadWrapper";
import SingleCheckboxWrapper from "../fields/SingleCheckboxWrapper";
import {
  PurchaseOrderSchema,
  PurchaseOrderItemSchema,
  PurchaseOrderType,
  PurchaseOrderItemType,
  PurchaseOrderStatusType,
} from "@/lib/domains/purchase-order/purchaseOrder-data";
import {
  useGetLocations,
  useGetPurchaseOrderTerms,
} from "@/services/setups/lookups";
import { useGetVendors } from "@/services/setups/vendor";
import {
  useGetPurchaseOrderShipVias,
  useGetNextPurchaseOrderNumber,
} from "@/services/setups/purchaseOrder";
import { useGetWarehouses } from "@/services/setups/inventory";
import { useGetItemTypes, useGetInvoices } from "@/services/setups/invoice";
import { useGetWorkOrders } from "@/services/setups/workOrder";
import { convertToOptionList } from "@/lib/shared/utils";

interface triggerVariant {
  variant?: "icon" | "default";
  formId?: string;
  hideSubmitButton?: boolean;
}

export default function NewPurchaseOrderForm({
  variant,
  formId = "new-purchase-order-form",
  hideSubmitButton,
}: triggerVariant) {
  const { data: shipViaOptions } = useGetPurchaseOrderShipVias();
  const { data: itemTypesOptionsList } =
    useGetItemTypes<Array<{ id: string; name: string }>>();
  const { data: termsOptionsList } =
    useGetPurchaseOrderTerms<Array<{ id: string; name: string }>>();
  const { data: invoices } =
    useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(
    invoices ?? [],
    "id",
    "invoice_number"
  );
  const { data: workOrders } =
    useGetWorkOrders<Array<{ id: string; wo_number: string }>>();
  const workOrderOptionsList = convertToOptionList(
    workOrders ?? [],
    "id",
    "wo_number"
  );

  const { data: nextPoNumberData } = useGetNextPurchaseOrderNumber();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { data: vendorOptions } =
    useGetVendors<Array<{ id: string; name: string }>>();
  const vendorOptionsList = convertToOptionList(
    vendorOptions ?? [],
    "id",
    "name"
  );

  const [items, setItems] = useState<PurchaseOrderItemType[]>([]);
  const [editItems, setEditItems] = useState<PurchaseOrderItemType | null>(
    null
  );
  const [openItems, setOpenItems] = useState(false);
  const [poDetailTab, setPoDetailTab] = useState("Items");
  const { data: warehouseOptionsList } =
    useGetWarehouses<Array<{ id: string; name: string }>>();

  const [status, setStatus] = useState<PurchaseOrderStatusType>("Requisition");

  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();

  const PurchaseOrderStatuses: PurchaseOrderStatusType[] = [
    "Requisition",
    "Ordered",
    "Partial",
    "Closed",
  ];

  const handleDeleteItem = (index: number) => {
    const filtered = items.filter((_, idx) => idx !== index);
    setItems(filtered);
  };

  const handleEditItem = (item: PurchaseOrderItemType, index: number) => {
    setEditIndex(index);
    setEditItems(item);
    Itemsform.reset(item);
    setOpenItems(true);
  };

  const openAddItemModal = () => {
    setEditIndex(null);
    setEditItems(null);
    Itemsform.reset({
      item_type_id: "",
      item: "",
      warehouse_id: "",
      quantity: 1,
      cost: 0,
      amount: 0,
      extended_cost: 0,
      notes: "",
      tax_one: 0,
      tax_two: 0,
      discount: 0,
    });
    setOpenItems(true);
  };

  const Itemsform = useForm<PurchaseOrderItemType>({
    resolver: zodResolver(PurchaseOrderItemSchema),
    defaultValues: {
      item_type_id: "",
      item: "",
      warehouse_id: "",
      quantity: 1,
      cost: 0,
      amount: 0,
      extended_cost: 0,
      notes: "",
      tax_one: 0,
      tax_two: 0,
      discount: 0,
    },
  });

  // Calculate amount and extended cost when quantity or cost changes
  const watchQuantity = Itemsform.watch("quantity");
  const watchCost = Itemsform.watch("cost");

  useEffect(() => {
    const amount = watchQuantity * watchCost;
    Itemsform.setValue("amount", amount);
    Itemsform.setValue("extended_cost", amount);
  }, [watchQuantity, watchCost]);

  function onSubmitItems(data: PurchaseOrderItemType) {
    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = data;
      setItems(updated);
    } else {
      setItems((prev) => [...prev, data]);
    }

    Itemsform.reset({
      item_type_id: "",
      item: "",
      warehouse_id: "",
      quantity: 1,
      cost: 0,
      amount: 0,
      extended_cost: 0,
      notes: "",
      tax_one: 0,
      tax_two: 0,
      discount: 0,
    });

    setEditItems(null);
    setEditIndex(null);
    setOpenItems(false);
  }

  const form = useForm<PurchaseOrderType>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {
      po_number: "",
      issued_date: new Date(),
      due_date: new Date(),
      buyer_id: "",
      status_id: "",
      closed_date: null,
      vendor: "",
      shipping: "",
      term_id: "",
      ship_via_id: "",
      invoice_number: "",
      order_number: "",
      wo_number: "",
      location_id: "",
      subtotal: 0,
      is_discount: 0,
      discount_type: "Fixed",
      discount: 0,
      discount_amount: 0,
      tax_one: 0,
      tax_one_amount: 0,
      tax_two: 0,
      tax_two_amount: 0,
      credit: 0,
      freight: 0,
      total_cost: 0,
      notes: "",
      others: [],
      items: [],
      attachments: [],
    },
  });

  useEffect(() => {
    if (nextPoNumberData) {
      form.setValue("po_number", nextPoNumberData);
    }
  }, [nextPoNumberData, form]);

  function onSubmit(data: PurchaseOrderType) {
    // Add items to the submission data
    const submissionData = {
      ...data,
      items: items,
    };

    console.log("Form submitted with VALUES:", submissionData);
    toast.success("Purchase Order created successfully!", {
      duration: 3000,
    });

    setOpen(false);
    form.reset();
    setItems([]);
  }

  function onError(errors: any) {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          po_number: "Purchase Order Number",
          issued_date: "Issue Date",
          due_date: "Due Date",
          buyer_id: "Buyer",
          status_id: "Status",
          vendor: "Vendor",
          shipping: "Shipping Address",
          term_id: "Payment Terms",
          ship_via_id: "Ship Via",
          location_id: "Location",
          items: "Items",
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

  const watchDiscountType = form.watch("discount_type");
  const watchStatusId = form.watch("status_id");

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    form.setValue("subtotal", subtotal);

    // Calculate total cost (you can add tax and discount logic here)
    const total =
      subtotal + form.getValues("freight") - form.getValues("credit");
    form.setValue("total_cost", total);
  }, [items]);

  // Handle closed date based on status
  useEffect(() => {
    // You'll need to check if status_id corresponds to "Closed" status
    // This is a placeholder - adjust based on your actual status IDs
    const closedStatusId = "your-closed-status-id"; // Replace with actual ID
    if (watchStatusId === closedStatusId) {
      form.setValue("closed_date", new Date());
    } else {
      form.setValue("closed_date", null);
    }
  }, [watchStatusId]);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex h-full min-h-0 w-full flex-col gap-2"
      >
        <div className="shrink-0 space-y-2">
          <div className="flex flex-row gap-x-3">
            <InputWrapper
              control={form.control}
              name="po_number"
              label="Purchase Order #"
              value=""
              type="text"
            />
            {/* Status buttons - you'll need to map these to status_ids */}
            <div className="flex gap-2">
              {PurchaseOrderStatuses.map((stat) => (
                <button
                  key={stat}
                  type="button"
                  className={`p-3 h-fit rounded-md border text-sm font-medium ${
                    status === stat
                      ? stat === "Requisition"
                        ? "bg-green-600 text-white"
                        : stat === "Ordered"
                          ? "bg-yellow-500 text-white"
                          : stat === "Partial"
                            ? "bg-orange-500 text-white"
                            : "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  onClick={() => {
                    // You need to map status to status_id here
                    // This is a placeholder - replace with actual logic
                    const statusIdMap: Record<PurchaseOrderStatusType, string> =
                      {
                        Requisition: "requisition-id",
                        Ordered: "ordered-id",
                        Partial: "partial-id",
                        Closed: "closed-id",
                      };
                    form.setValue("status_id", statusIdMap[stat]);
                    setStatus(stat);
                  }}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-2">
            <DatePickerWrapper
              control={form.control}
              name="issued_date"
              label="Issue Date"
            />
            <DatePickerWrapper
              control={form.control}
              name="due_date"
              label="Due By"
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="buyer_id"
              label="Buyer"
              options={assigneeOptions ?? []}
            />
            <DatePickerWrapper
              control={form.control}
              name="closed_date"
              label="Close"
              disabled={status !== "Closed"}
            />
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-8 items-stretch gap-4">
            <div className="col-span-5 flex min-h-0 flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Fieldset
                  legend="Vendor"
                  className="h-full"
                  content={
                    <>
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="vendor"
                        label="Vendor Name"
                        options={vendorOptionsList ?? []}
                      />
                      <TextareaWrapper
                        control={form.control}
                        name="shipping"
                        label="Shipping Address"
                        placeholder="Enter shipping address"
                        value=""
                      />
                    </>
                  }
                />
                <Fieldset
                  legend="Ship To"
                  className="h-full"
                  content={
                    <>
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="ship_via_id"
                        options={shipViaOptions ?? []}
                        label="Ship Via"
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
              </div>
              <Tabs
                value={poDetailTab}
                onValueChange={setPoDetailTab}
                className="flex min-h-0 w-full flex-1 flex-col"
              >
                <div className="flex items-center justify-between gap-2">
                  <TabsList>
                    <TabsTrigger value="Items">Items</TabsTrigger>
                    <TabsTrigger value="Attachments">Attachments</TabsTrigger>
                    <TabsTrigger value="Notes">Notes</TabsTrigger>
                  </TabsList>
                  {poDetailTab === "Items" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={openAddItemModal}
                    >
                      <Plus className="mr-2 size-4" />
                      Add Item
                    </Button>
                  ) : null}
                </div>
                  <TabsContent
                    value="Items"
                    className="mt-4 min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden"
                  >
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
                          ? "Edit Purchase Order Item"
                          : "Add Purchase Order Item"
                      }
                      description={
                        editIndex !== null
                          ? "Update the details for this purchase order line item."
                          : "Fill out the details below to add an item to this purchase order."
                      }
                      size="lg"
                      closeable={true}
                      renderActions={
                        <Button
                          form="po-item-form"
                          type="submit"
                          variant="primary"
                        >
                          {editIndex !== null ? "Update Item" : "Save Item"}
                        </Button>
                      }
                    >
                      <Form {...Itemsform}>
                        <form
                          id="po-item-form"
                          onSubmit={Itemsform.handleSubmit(onSubmitItems)}
                          className="flex flex-col gap-1 py-1"
                        >
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <ComboboxFieldWrapper
                              control={Itemsform.control}
                              name="item_type_id"
                              label="Item Type"
                              options={itemTypesOptionsList ?? []}
                              required
                            />
                            <InputWrapper
                              control={Itemsform.control}
                              name="item"
                              label="Part # / Item"
                              type="text"
                              required
                            />
                            <ComboboxFieldWrapper
                              control={Itemsform.control}
                              name="warehouse_id"
                              label="Warehouse"
                              options={warehouseOptionsList ?? []}
                              required
                            />
                            <InputWrapper
                              control={Itemsform.control}
                              name="quantity"
                              label="Order Quantity"
                              type="number"
                              required
                            />
                            <InputWrapper
                              control={Itemsform.control}
                              name="cost"
                              label="Unit Cost"
                              type="number"
                              required
                            />
                            <InputWrapper
                              control={Itemsform.control}
                              name="amount"
                              label="Amount"
                              type="number"
                              disabled
                            />
                            <InputWrapper
                              control={Itemsform.control}
                              name="extended_cost"
                              label="Extended Cost"
                              type="number"
                              disabled
                            />
                          </div>
                          <TextareaWrapper
                            control={Itemsform.control}
                            name="notes"
                            label="Notes"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <SingleCheckboxWrapper
                              control={Itemsform.control}
                              name="tax_one"
                              label="Apply Tax 1"
                            />
                            <SingleCheckboxWrapper
                              control={Itemsform.control}
                              name="tax_two"
                              label="Apply Tax 2"
                            />
                            <SingleCheckboxWrapper
                              control={Itemsform.control}
                              name="discount"
                              label="Apply Discount"
                            />
                          </div>
                        </form>
                      </Form>
                    </Modal>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Cost</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.item}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.cost.toFixed(2)}</TableCell>
                            <TableCell>${item.amount.toFixed(2)}</TableCell>
                            <TableCell>{item.notes}</TableCell>
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
                  <TabsContent
                    value="Attachments"
                    className="mt-4 min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden"
                  >
                    <FileUploadWrapper
                      multiple={true}
                      control={form.control}
                      name="attachments"
                      label="Attachments"
                    />
                  </TabsContent>
                  <TabsContent
                    value="Notes"
                    className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
                  >
                    <TextareaWrapper
                      name="notes"
                      control={form.control}
                      fillSpace
                      direction="vertical"
                      placeholder="Enter notes for this purchase order…"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            <div className="col-span-3 min-h-0 space-y-2 overflow-y-auto">
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
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="invoice_number"
                      label="Invoice #"
                      options={invoiceOptionsList ?? []}
                    />
                    <InputWrapper
                      control={form.control}
                      name="order_number"
                      label="Order #"
                      value=""
                      type="text"
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="wo_number"
                      label="WO #"
                      options={workOrderOptionsList ?? []}
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
                      name="subtotal"
                      label="Subtotal"
                      value=""
                      type="number"
                      disabled
                    />

                    <SingleCheckboxWrapper
                      control={form.control}
                      name="is_discount"
                      label="Apply Discount"
                    />

                    <SelectWrapper
                      control={form.control}
                      name="discount_type"
                      label="Discount Type"
                      options={[
                        { id: "Fixed", name: "Fixed Amount" },
                        { id: "Percent", name: "Percentage" },
                      ]}
                    />

                    {watchDiscountType === "Percent" && (
                      <InputWrapper
                        control={form.control}
                        name="discount"
                        label="Discount %"
                        value=""
                        type="number"
                      />
                    )}
                    {watchDiscountType === "Fixed" && (
                      <InputWrapper
                        control={form.control}
                        name="discount_amount"
                        label="Discount Amount"
                        value=""
                        type="number"
                      />
                    )}
                    <InputWrapper
                      control={form.control}
                      name="tax_one"
                      label="Tax 1 %"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="tax_one_amount"
                      label="Tax 1 Amount"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="tax_two"
                      label="Tax 2 %"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="tax_two_amount"
                      label="Tax 2 Amount"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="credit"
                      label="Credit"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="freight"
                      label="Freight"
                      type="number"
                      value=""
                    />
                    <InputWrapper
                      control={form.control}
                      name="total_cost"
                      label="Total Cost"
                      type="number"
                      value=""
                      disabled
                    />
                  </>
                }
              />
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
                  Create Purchase Order
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
