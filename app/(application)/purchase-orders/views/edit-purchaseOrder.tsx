"use client";

import { useEffect, useState } from "react";
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
import {
  assigneeOptions,
  shipViaOptions,
  substituteOptions,
  vendorOptions,
} from "@/lib/equipment-schema";
import Fieldset from "@/components/customUI/fieldset";
 
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
import z from "zod";
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
import {
  discount_typesOptions,
  invoiceOptionsList,
  itemTypeOptionsList,
  maintenanceItems,
} from "@/lib/Invoice/invoices-page-data";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import {
  PurchaseOrderInterface,
  purchaseOrderItems,
  PurchaseOrderItemSchema,
  PurchaseOrderSchema,
  PurchaseOrderStatusType,
} from "@/lib/PurchaseOrder/purchaseOrder-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetLocations } from "@/services/setups/vendor";


export type ItemFormValues = z.infer<typeof PurchaseOrderItemSchema>;

export default function EditPurchaseOrderForm({
  children,
  data,
  open: externalOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  data: Partial<PurchaseOrderInterface>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
    const { 
    data: locationOptionsList, 
    isLoading:locationOptionsListLoading, 
    error: locationOptionsListError
  } = useGetLocations<Array<{ id: string, name: string }>>();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [items, setItems] = useState<ItemFormValues[]>(data.items ?? []);
  const [editItems, setEditItems] = useState<ItemFormValues | null>(null);
  const [openItems, setOpenItems] = useState(false);

  const [status, setStatus] = useState<PurchaseOrderStatusType>("Requisition");

  const PurchaseOrderStatuses: PurchaseOrderStatusType[] = [
    "Requisition",
    "Ordered",
    "Partial",
    "Closed",
  ];
  const handleDeleteItem = (itemName: string) => {
    const filtered = items.filter((item) => item.partNumber !== itemName);
    setItems(filtered);
  };

  const handleEditItem = (item: ItemFormValues, index: number) => {
    setEditIndex(index);
    setEditItems(item);
    Itemsform.reset(item); // Pre-fill
    setOpenItems(true); // Open the dialog after setting the form
  };

  const Itemsform = useForm<ItemFormValues>({
    resolver: zodResolver(PurchaseOrderItemSchema),
    defaultValues: {},
  });

  function onSubmitItems(data: ItemFormValues) {
    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = data;
      setItems(updated);
    } else {
      setItems((prev) => [...prev, data]);
    }

    Itemsform.reset({
      itemType: " ",
      partNumber: " ",
      warehouse: " ",
      warranty: " ",
      orderQuantity: 0,
      receivedQuantity: 0,
      unit_cost: 0,
      extendedCost: 0,
      notes: " ",
    });

    setEditItems(null);
    setEditIndex(null);
    setOpenItems(false);
  }

  const form = useForm<z.infer<typeof PurchaseOrderSchema>>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: { ...data },
  });

  function onSubmit(data: PurchaseOrderInterface) {
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

  const watchdiscount_type = form.watch("discount_type");
  const watchStatus = form.watch("status");

  useEffect(() => {
    if (watchStatus === "Closed") {
      form.setValue("closedDate", new Date());
    } else {
      form.setValue("closedDate", undefined);
    }
  }, [watchStatus]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>{data.purchaseOrderNumber}</div>
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
                    name={"purchaseOrderNumber"}
                    label={"Purchase Order #"}
                    value={""}
                    type="text"
                  />
                  {/* put status  that is requisition,ordered,received partial, closed */}
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
                          form.setValue("status", stat);
                          setStatus(stat);
                        }}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row gap-x-2">
                  <DatePickerWrapper
                    control={form.control}
                    name="date"
                    label="Issue Date"
                  />
                  <DatePickerWrapper
                    control={form.control}
                    name="dueDate"
                    label="Due By"
                  />
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="customer"
                    label="Buyer"
                    options={assigneeOptions}
                  />
                  <DatePickerWrapper
                    control={form.control}
                    name="closedDate"
                    label="Close"
                    disabled={watchStatus !== "Closed"}
                  />
                </div>
                <div className="grid grid-cols-8 gap-4">
                  <div className="col-span-6 grid grid-cols-2 gap-2">
                    <div className="col-span-1 h-fit">
                      <Fieldset
                        legend="Vendor"
                        content={
                          <>
                            <ComboboxFieldWrapper
                              control={form.control}
                              name="vendor"
                              options={vendorOptions}
                              label=""
                            />

                            <TextareaWrapper
                              control={form.control}
                              name="billing"
                              label=""
                              placeholder=" "
                              value={""}
                            />
                          </>
                        }
                      />
                    </div>
                    <div className="col-span-1 h-fit">
                      <Fieldset
                        legend="Ship To"
                        content={
                          <>
                            <ComboboxFieldWrapper
                              control={form.control}
                              name="shipVia"
                              options={shipViaOptions}
                              label=""
                            />
                            <TextareaWrapper
                              control={form.control}
                              name="shipping"
                              label=""
                              placeholder=" "
                              value={""}
                            />
                          </>
                        }
                      />
                    </div>
                    <div className="col-span-2 flex items-start">
                      <Tabs defaultValue="Items" className="w-full">
                        <TabsList>
                          <TabsTrigger value="Items">Items</TabsTrigger>
                          <TabsTrigger value="Attachments">
                            Attachments
                          </TabsTrigger>
                          <TabsTrigger value="Notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Items">
                          <div className="flex justify-end">
                            <Dialog
                              open={openItems}
                              onOpenChange={setOpenItems}
                            >
                              <DialogTrigger
                                asChild
                                onClick={() => {
                                  setEditIndex(null);
                                  setEditItems(null);
                                  Itemsform.reset({
                                    itemType: " ",
                                    partNumber: " ",
                                    warehouse: " ",
                                    warranty: " ",
                                    orderQuantity: 0,
                                    receivedQuantity: 0,
                                    unit_cost: 0,
                                    extendedCost: 0,
                                    notes: " ",
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
                                      ? "Edit PurchaseOrder Item"
                                      : "Add PurchaseOrder Item"}
                                  </DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={Itemsform.handleSubmit(
                                    onSubmitItems
                                  )}
                                  className="grid gap-4 mt-4"
                                >
                                  <div className="grid grid-cols-2 gap-2">
                                    <ComboboxFieldWrapper
                                      control={Itemsform.control}
                                      name="itemType"
                                      label="Item Type"
                                      options={itemTypeOptionsList}
                                    />
                                    <ComboboxFieldWrapper
                                      className="col-span-1"
                                      control={Itemsform.control}
                                      name="partNumber"
                                      label="Part #"
                                      options={substituteOptions}
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="warehouse"
                                      label="Warehouse"
                                      type="text"
                                      value=""
                                      disabled
                                      required={false}
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="warranty"
                                      label="Warranty"
                                      type="text"
                                      value=""
                                      disabled
                                      required={false}
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="orderQuantity"
                                      label="Order Quantity"
                                      type="number"
                                      value="0"
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="unit_cost"
                                      label="Unit Cost"
                                      type="number"
                                      value="0"
                                    />
                                    <InputWrapper
                                      control={Itemsform.control}
                                      name="extendedCost"
                                      label="Extended Cost"
                                      type="number"
                                      value="0"
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
                                      control={form.control}
                                      name="primaryTaxRate"
                                      label="Apply Primary Tax Rate"
                                    />
                                    <SingleCheckboxWrapper
                                      control={form.control}
                                      name="secondaryTaxRate"
                                      label="Apply Secondary Tax Rate"
                                    />
                                    <SingleCheckboxWrapper
                                      control={form.control}
                                      name="discount"
                                      label="Apply Discount"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={Itemsform.handleSubmit(
                                      onSubmitItems
                                    )}
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
                                <TableHead>Ordered</TableHead>
                                <TableHead>Received</TableHead>
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
                                  <TableCell>{item.orderQuantity}</TableCell>
                                  <TableCell>{item.receivedQuantity}</TableCell>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{item.unit_cost}</TableCell>
                                  <TableCell>{item.extendedCost}</TableCell>
                                  <TableCell>{item.notes}</TableCell>
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
                                          handleDeleteItem(item.partNumber)
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
                        <TabsContent value="Attachments">
                          <FileUploadWrapper
                            multiple={true}
                            control={form.control}
                            name={"Attachments"}
                            label={"Attachments"}
                          />
                        </TabsContent>
                        <TabsContent value="Notes">
                          <TextareaWrapper
                            label=" "
                            name="Notes"
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
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="shipVia"
                            label="Ship Via"
                            options={shipViaOptions}
                          />
                          <InputWrapper
                            control={form.control}
                            name={"invoiceNumber"}
                            label={"Invoice#"}
                            value={""}
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name={"orderNumber"}
                            label={"Order #"}
                            value={""}
                            type="text"
                          />
                          <InputWrapper
                            control={form.control}
                            name={"woNumber"}
                            label={"WO #"}
                            value={""}
                            type="text"
                          />
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="location_id"
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
                          <InputWrapper
                            control={form.control}
                            name={"subTotal"}
                            label={"Sub total"}
                            value={""}
                            type="text"
                          />

                          <ComboboxFieldWrapper
                            control={form.control}
                            name="discount_type"
                            label="Discount Type"
                            options={discount_typesOptions}
                          />

                          {watchdiscount_type === "percent" && (
                            <InputWrapper
                              control={form.control}
                              name={"discount_percent"}
                              label={"Discount"}
                              value={""}
                              type="text"
                            />
                          )}
                          {watchdiscount_type === "amount" && (
                            <InputWrapper
                              control={form.control}
                              name={"discount_amount"}
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
                            name="Credit"
                            label="credit"
                            type="text"
                            value={""}
                          />
                          <InputWrapper
                            control={form.control}
                            name="freight"
                            label="Freight"
                            type="text"
                            value={""}
                          />
                          <InputWrapper
                            control={form.control}
                            name="Total Cost"
                            label="totalCost"
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
