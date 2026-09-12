"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pen, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Form wrappers
import InputWrapper from "@/components/forms/fields/InputWrapper";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
// Schema and types


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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import SingleCheckboxWrapper from "@/components/forms/fields/SingleCheckboxWrapper";
import {
  PurchaseOrderItemSchema,
  PurchaseOrderSchema,
  PurchaseOrderStatusType,
  PurchaseOrderItemType,
  PurchaseOrderType,
} from "@/lib/domains/purchase-order/purchaseOrder-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetLocations,
  useGetPurchaseOrderTerms,
} from "@/services/setups/lookups";
import {
  useGetCustomerDiscounts,
  useGetCustomers,
} from "@/services/setups/customer";
import {
  useGetVendors,
} from "@/services/setups/vendor";
import {
  useGetPurchaseOrder,
  useGetPurchaseOrderShipVias,
  useUpdatePurchaseOrder,
} from "@/services/setups/purchaseOrder";
import { convertToOptionList } from "@/lib/shared/utils";
import { useGetWarehouses } from "@/services/setups/inventory";
import { useGetItemTypes, useGetInvoices } from "@/services/setups/invoice";
import { useGetWorkOrders } from "@/services/setups/workOrder";

export default function EditPurchaseOrderForm({
  children,
  purchaseOrderId,
  open: externalOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  purchaseOrderId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { data: pageData } = useGetPurchaseOrder(purchaseOrderId);
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();
  const { data: shipViaOptions } = useGetPurchaseOrderShipVias();
  const { data: vendorOptions } = useGetVendors<Array<{ id: string; name: string }>>();
  const vendorOptionsList = convertToOptionList(vendorOptions ?? [], "id", "name");
  const { data: customersOptions } = useGetCustomers();
  const { data: invoices } = useGetInvoices<Array<{ id: string; invoice_number: string }>>();
  const invoiceOptionsList = convertToOptionList(invoices ?? [], "id", "invoice_number");
  const { data: workOrders } = useGetWorkOrders<Array<{ id: string; wo_number: string }>>();
  const workOrderOptionsList = convertToOptionList(workOrders ?? [], "id", "wo_number");
  const {
    data: termsOptionsList,
    isLoading: termsOptionsListLoading,
    error: termsOptionsListError,
  } = useGetPurchaseOrderTerms<Array<{ id: string; name: string }>>();
  const {
    data: discount_typesOptions,
    isLoading: discount_typesOptionsLoading,
    error: discount_typesOptionsError
  } = useGetCustomerDiscounts<Array<{ id: string, name: string }>>();
  const { data: warehouseOptionsList } = useGetWarehouses<Array<{ id: string; name: string }>>();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [items, setItems] = useState<PurchaseOrderItemType[]>([]);
  const [editItems, setEditItems] = useState<PurchaseOrderItemType | null>(null);
  const [openItems, setOpenItems] = useState(false);
  const { data: itemTypesOptionsList } = useGetItemTypes<Array<{ id: string; name: string }>>();

  const [status, setStatus] = useState<PurchaseOrderStatusType>("Requisition");

  // Status ID to name mapping - adjust these IDs based on your backend
  const statusIdMap: Record<string, PurchaseOrderStatusType> = {
    "e15ec91b-4332-4dcc-94f8-b0a9da2238c0": "Requisition",
    // Add your other status IDs here
  };

  // Status name to ID mapping
  const statusNameToIdMap: Record<PurchaseOrderStatusType, string> = {
    "Requisition": "e15ec91b-4332-4dcc-94f8-b0a9da2238c0",
    "Ordered": "", // Add your status ID
    "Partial": "", // Add your status ID
    "Closed": "", // Add your status ID
  };

  const PurchaseOrderStatuses: PurchaseOrderStatusType[] = [
    "Requisition",
    "Ordered",
    "Partial",
    "Closed",
  ];

  // Initialize form with data from API
  useEffect(() => {
    if (pageData) {
      const mappedData: Partial<PurchaseOrderType> = {
        id: pageData.id,
        po_number: pageData.po_number,
        issued_date: new Date(pageData.issued_date),
        due_date: new Date(pageData.due_date),
        buyer_id: pageData.buyer_id,
        status_id: pageData.status_id,
        closed_date: pageData.closed_date ? new Date(pageData.closed_date) : null,
        vendor: pageData.vendor,
        shipping: pageData.shipping,
        term_id: pageData.term_id,
        ship_via_id: pageData.ship_via_id,
        invoice_number: pageData.invoice_number,
        order_number: pageData.order_number,
        wo_number: pageData.wo_number,
        location_id: pageData.location_id,
        subtotal: parseFloat(pageData.subtotal),
        is_discount: pageData.is_discount ? 1 : 0,
        discount_type: pageData.discount_type as "Fixed" | "Percent",
        discount: parseFloat(pageData.discount),
        discount_amount: parseFloat(pageData.discount_amount),
        tax_one: parseFloat(pageData.tax_one),
        tax_one_amount: parseFloat(pageData.tax_one_amount),
        tax_two: parseFloat(pageData.tax_two),
        tax_two_amount: parseFloat(pageData.tax_two_amount),
        credit: parseFloat(pageData.credit),
        freight: parseFloat(pageData.freight),
        total_cost: parseFloat(pageData.total_cost),
        notes: pageData.notes || "",
        others: pageData.others || [],
        items: pageData.items || [],
        attachments: [],
      };

      form.reset(mappedData);

      // Map items from API
      if (pageData.items) {
        const mappedItems = pageData.items.map((item: any) => ({
          item_type_id: item.item_type_id,
          item: item.item,
          warehouse_id: item.warehouse_id,
          quantity: item.quantity,
          cost: parseFloat(item.cost),
          amount: parseFloat(item.amount),
          extended_cost: parseFloat(item.extended_cost),
          notes: item.notes || "",
          tax_one: item.tax_one ? 1 : 0,
          tax_two: item.tax_two ? 1 : 0,
          discount: item.discount ? 1 : 0,
        }));
        setItems(mappedItems);
      }

      // Set status
      if (pageData.status) {
        setStatus(pageData.status.name as PurchaseOrderStatusType);
      }
    }
  }, [pageData]);

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
    defaultValues: {},
  });
  const { mutateAsync: updatePurchaseOrder } = useUpdatePurchaseOrder()
  function onSubmit(data: PurchaseOrderType) {
    // Add items to submission data
    const submissionData = {
      ...data,
      items: items,
    };

    console.log("Form submitted with VALUES:", submissionData);
    const res = updatePurchaseOrder(data)
    if (res) {
      toast.success(res.message, {
        duration: 10000,
      });
    }

    setOpen(false);
  }

  function onError(errors: any) {
    console.log(errors)
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        return `${field}: ${error.message}`;
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

  const watchdiscount_type = form.watch("discount_type");
  const watchStatus = form.watch("status_id");

  useEffect(() => {
    // Handle closed date logic based on status
    const currentStatus = pageData?.status?.name;
    if (currentStatus === "Closed") {
      if (!form.getValues("closed_date")) {
        form.setValue("closed_date", new Date());
      }
    }
  }, [watchStatus, pageData]);

  // Calculate extended cost when quantity or cost changes
  const watchQuantity = Itemsform.watch("quantity");
  const watchCost = Itemsform.watch("cost");

  useEffect(() => {
    const extended = watchQuantity * watchCost;
    Itemsform.setValue("extended_cost", extended);
    Itemsform.setValue("amount", extended);
  }, [watchQuantity, watchCost]);

  if (!pageData) {
    return <div>Loading...</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Purchase Order: {pageData.po_number}</div>
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
                    name={"po_number"}
                    label={"Purchase Order #"}
                    value={""}
                    type="text"
                  />
                  <div className="flex gap-2">
                    {PurchaseOrderStatuses.map((stat) => (
                      <button
                        key={stat}
                        type="button"
                        className={`p-3 h-fit rounded-md border text-sm font-medium ${status === stat
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
                          // Update both status name and status_id
                          const statusId = statusNameToIdMap[stat];
                          if (statusId) {
                            form.setValue("status_id", statusId);
                          }
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
                    options={convertToOptionList(customersOptions ?? [], "id", "company_name")}
                  />
                  <DatePickerWrapper
                    control={form.control}
                    name="closed_date"
                    label="Close"
                    disabled={status !== "Closed"}
                  />
                </div>
                <div className="grid grid-cols-8 gap-4 items-start">
                  <div className="col-span-5 flex flex-col gap-3">
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
                              label="Billing Address"
                              placeholder=" "
                              value={""}
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
                            <TextareaWrapper
                              control={form.control}
                              name="shipping"
                              label="Shipping Address"
                              placeholder=" "
                              value={""}
                            />
                          </>
                        }
                      />
                    </div>
                    <Tabs defaultValue="Items" className="w-full">
                        <TabsList>
                          <TabsTrigger value="Items">Items</TabsTrigger>
                          <TabsTrigger value="Attachments">
                            Attachments
                          </TabsTrigger>
                          <TabsTrigger value="Notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Items">
                          <div className="flex justify-end mb-2">
                            <Dialog open={openItems} onOpenChange={setOpenItems}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => {
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
                                  }}
                                >
                                  Add Item
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {editIndex !== null
                                      ? "Edit Purchase Order Item"
                                      : "Add Purchase Order Item"}
                                  </DialogTitle>
                                </DialogHeader>
                                <div


                                >
                                  <div className="grid grid-cols-2 gap-2">
                                    <ComboboxFieldWrapper
                                      control={Itemsform.control}
                                      name="item_type_id"
                                      label="Item Type"
                                      options={itemTypesOptionsList ?? []}
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="item"
                                      label="Part #"
                                      type="text"
                                      value=""
                                    />
                                    <ComboboxFieldWrapper
                                      control={Itemsform.control}
                                      name="warehouse_id"
                                      label="Warehouse"
                                      options={warehouseOptionsList ?? []}
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="quantity"
                                      label="Order Quantity"
                                      type="number"
                                      value="1"
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="cost"
                                      label="Unit Cost"
                                      type="number"
                                      value="0"
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="extended_cost"
                                      label="Extended Cost"
                                      type="number"
                                      value="0"
                                      disabled
                                    />
                                  </div>
                                  <TextareaWrapper
                                    control={Itemsform.control}
                                    name="notes"
                                    label="Notes"
                                    value=""
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <SingleCheckboxWrapper
                                      control={Itemsform.control}
                                      name="tax_one"
                                      label="Apply Primary Tax Rate"
                                    />
                                    <SingleCheckboxWrapper
                                      control={Itemsform.control}
                                      name="tax_two"
                                      label="Apply Secondary Tax Rate"
                                    />
                                    <SingleCheckboxWrapper
                                      control={Itemsform.control}
                                      name="discount"
                                      label="Apply Discount"
                                    />
                                  </div>
                                  <Button type="button" onClick={Itemsform.handleSubmit(onSubmitItems)}>
                                    {editIndex !== null ? "Update Item" : "Add Item"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {items.map((item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.item}</TableCell>
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
                        <TabsContent value="Attachments">
                          <FileUploadWrapper
                            multiple={true}
                            control={form.control}
                            name={"attachments"}
                            label={"Attachments"}
                          />
                        </TabsContent>
                        <TabsContent value="Notes">
                          <TextareaWrapper
                            label="Notes"
                            name="notes"
                            control={form.control}
                            value={""}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  <div className="col-span-3 space-y-2">
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
                            name="ship_via_id"
                            label="Ship Via"
                            options={shipViaOptions}
                          />
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="invoice_number"
                            label="Invoice #"
                            options={invoiceOptionsList ?? []}
                          />
                          <InputWrapper
                            control={form.control}
                            name={"order_number"}
                            label={"Order #"}
                            value={""}
                            type="text"
                          />
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="wo_number"
                            label="WO #"
                            options={workOrderOptionsList ?? []}
                          />
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="location_id"
                            label="Location Filter"
                            options={locationOptionsList}
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
                            name={"subtotal"}
                            label={"Sub total"}
                            value={""}
                            type="number"
                          />

                          {/* <ComboboxFieldWrapper
                                                control={form.control}
                                                name="discount_type"
                                                label="Discount Type"
                                                options={discount_typesOptions??[]}
                                              />
                                              {watchdiscount_type === "1fcd0622-ebfa-477a-ba12-21cfcb070a62" && (
                                                <InputWrapper
                                                  control={form.control}
                                                  name={"discount_percent"}
                                                  label={"Discount"}
                                                  value={""}
                                                  type="text"
                                                />
                                              )}
                                              {watchdiscount_type === "af4850a7-a669-4898-9adc-83a7c27132b9" && (
                                                <InputWrapper
                                                  control={form.control}
                                                  name={"discount_amount"}
                                                  label={"Discount"}
                                                  value={""}
                                                  type="text"
                                                />
                                              )} */}
                          <InputWrapper
                            control={form.control}
                            name="tax_one"
                            label="Tax 1"
                            type="number"
                            value={""}
                          />
                          <InputWrapper
                            control={form.control}
                            name="tax_two"
                            label="Tax 2"
                            type="number"
                            value={""}
                          />
                          <InputWrapper
                            control={form.control}
                            name="credit"
                            label="Credit"
                            type="number"
                            value={""}
                          />
                          <InputWrapper
                            control={form.control}
                            name="freight"
                            label="Freight"
                            type="number"
                            value={""}
                          />
                          <InputWrapper
                            control={form.control}
                            name="total_cost"
                            label="Total Cost"
                            type="number"
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
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Purchase Order
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