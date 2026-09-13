"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
// Form wrappers
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
// Schema and types
import Fieldset from "@/components/customUI/fieldset";
import { toast } from "sonner";
import z from "zod";
import {
  PurchaseOrderInterface,
  PurchaseOrderItemSchema,
  PurchaseOrderSchema,
  PurchaseOrderStatusType,
} from "@/lib/domains/purchase-order/purchaseOrder-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboboxFieldWrapper } from "../../fields/ComboboxWrapper";
import { useGetPurchaseOrders } from "@/services/setups/purchaseOrder";

type ItemFormValues = z.infer<typeof PurchaseOrderItemSchema>;

interface QuickActionsReceivePurchaseOrderProps {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
}

export default function QuickActionsReceivePurchaseOrder({
  formId = "receive-purchase-order-form",
  hideSubmitButton,
  onSuccess,
}: QuickActionsReceivePurchaseOrderProps = {}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const {data:PurchaseOrderOptions} = useGetPurchaseOrders();

  const [items, setItems] = useState<ItemFormValues[]>();
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
    defaultValues: {},
  });

  function onSubmit(data: PurchaseOrderInterface) {
    console.log("Form submitted with VALUES:", data);
    toast("Project created successfully!", {
      duration: 10000,
    });

    setOpen(false);
    form.reset();
    onSuccess?.();
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

  const watchItems = form.watch("items")??[];
  const updateAllReceived = () => {
    const updatedItems = watchItems.map((item) => {
      const additional =
        (item.orderQuantity || 0) - (item.receivedQuantity || 0);
      return {
        ...item,
        newReceivedQuantity: additional > 0 ? additional : 0,
      };
    });
    form.setValue("items", updatedItems);
  };
  const saveReceivedQuantities = () => {
    const updatedItems = watchItems.map((item) => ({
      ...item,
      receivedQuantity:
        (item.receivedQuantity || 0) + (item.newReceivedQuantity || 0),
      newReceivedQuantity: 0,
    }));
    form.setValue("items", updatedItems);
  };

  const content = (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row w-1/2 gap-x-3">
              <ComboboxFieldWrapper
                control={form.control}
                name={"purchaseOrderNumber"}
                label={"Purchase Order #"}
                options={PurchaseOrderOptions} 
              />
              <DatePickerWrapper
                control={form.control}
                name="dateReceived"
                label="Date received"
              />
            </div>
            <Fieldset
              legend={"Items Received"}
              content={
                <>
                  <div className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Receive Items</span>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            e.target.checked && updateAllReceived()
                          }
                        />
                        All items are received in full
                      </label>
                    </div>
                    <div className="grid grid-cols-2 text-sm font-semibold border-b pb-1">
                      <div>Description</div>
                      <div className="grid grid-cols-3 gap-2">
                        <span>Ordered</span>
                        <span>Received (Total)</span>
                        <span>Received</span>
                      </div>
                    </div>
                    {watchItems.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 items-center border-b py-1 text-sm"
                      >
                        <div>{item.description || item.partNumber}</div>
                        <div className="grid grid-cols-3 gap-2">
                          <span>{item.orderQuantity}</span>
                          <span>{item.receivedQuantity || 0}</span>
                          <input
                            type="number"
                            className="border rounded px-2 py-1"
                            value={item.newReceivedQuantity || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updatedItems = [...watchItems];
                              updatedItems[index].newReceivedQuantity = val;
                              form.setValue("items", updatedItems);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                        onClick={saveReceivedQuantities}
                      >
                        Save Received Quantities
                      </button>
                    </div>
                  </div>
                </>
              }
            />
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
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
  );

  if (hideSubmitButton) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
      {content}
    </ScrollArea>
  );
}
