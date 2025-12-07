"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ComboboxFieldWrapper,
  ComboboxOption,
} from "@/components/forms/wrappers/ComboboxWrapper";
import { Input } from "@/components/ui/input";
import { EditableDataTable } from "@/components/customUI/editableTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { Save, Pen, Trash2 } from "lucide-react";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import {
  maintenanceTaskOptionsList,
  MaintenanceTypesOptionList,
  taskTypeOptionList,
} from "@/lib/work-orders-data";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {
  AddMaintenanceInWorkOrderInterface,
  AddMaintenanceInWorkOrderSchema,
  Part,
} from "@/lib/WorkOrder/workOrder-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddLabor from "./add-labor";
import AddPart from "./add-parts";

export default function AddMaintenance({
  data,
  onAdd,
  open,
  setOpen,
}: {
  data: AddMaintenanceInWorkOrderInterface | null;
  onAdd: (task: AddMaintenanceInWorkOrderInterface) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [laborDialogOpen, setLaborDialogOpen] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [partDialogOpen, setPartDialogOpen] = useState(false);
  const [editPartIndex, setEditPartIndex] = useState<number | null>(null);
  const [partToEdit, setPartToEdit] = useState<Part | null>(null);

  const form = useForm<AddMaintenanceInWorkOrderInterface>({
    resolver: zodResolver(AddMaintenanceInWorkOrderSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    } else {
      form.reset({
        task: "",
        taskType: "",
        labor: undefined,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (data?.parts) {
      setParts(data.parts);
    }
  }, [data]);
  // Update partsCost when parts change
  useEffect(() => {
    const totalPartsCost = parts.reduce((sum, part) => sum + part.totalCost, 0);
    form.setValue("parts", parts);
    form.setValue("partsCost", totalPartsCost.toFixed(2));
  }, [parts, form]);

  const watchPartsCost = form.watch("partsCost");
  const watchLabor = form.watch("labor");

  useEffect(() => {
    const parts = parseFloat(watchPartsCost || "0");
    const laborCost = watchLabor?.totalCost || 0;
    const total = parseFloat((parts + laborCost).toFixed(2));
    form.setValue("total", total.toString());
  }, [watchPartsCost, watchLabor, form]);

  function onSubmit(data: AddMaintenanceInWorkOrderInterface) {
    console.log("Form submitted with VALUES:", data);

    onAdd(data); // send data back to parent
    toast("Maintenance added successfully!");
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Add Maintenance</Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>Add Maintenance</SheetTitle>
          <SheetDescription>
            Fill out the form below to Add Maintenance on AddMaintenance.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div>
                <div className="flex flex-col space-y-0.5">
                  <RadioGroupWrapper
                    control={form.control}
                    name="usage"
                    label=""
                    options={MaintenanceTypesOptionList}
                  />

                  <ComboboxFieldWrapper
                    control={form.control}
                    name="task"
                    label="Task"
                    options={maintenanceTaskOptionsList}
                  />
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="taskType"
                    label="Task Type"
                    options={taskTypeOptionList}
                  />
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <InputWrapper
                      control={form.control}
                      name="partsCost"
                      label="Parts Cost"
                      type="number"
                      value={""}
                    />
                    <Dialog
                      open={partDialogOpen}
                      onOpenChange={setPartDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditPartIndex(null);
                            setPartToEdit(null);
                          }}
                          type="button"
                        >
                          Add Part
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editPartIndex !== null ? "Edit Part" : "Add Part"}
                          </DialogTitle>
                        </DialogHeader>
                        <AddPart
                          initialValues={partToEdit}
                          onSave={(partData) => {
                            const updatedParts = [...parts];
                            if (editPartIndex !== null) {
                              updatedParts[editPartIndex] = partData;
                            } else {
                              updatedParts.push(partData);
                            }
                            setParts(updatedParts);
                            setPartDialogOpen(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <table className="w-full text-sm mt-4">
                    <thead>
                      <tr className="border-b font-semibold">
                        <th className="px-2 py-1">Part #</th>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Qty</th>
                        <th className="px-2 py-1">Unit Cost</th>
                        <th className="px-2 py-1">Total</th>
                        <th className="px-2 py-1 w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((part, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-2 py-1">{part.partNumber}</td>
                          <td className="px-2 py-1">{part.name}</td>
                          <td className="px-2 py-1">{part.quantityUsed}</td>
                          <td className="px-2 py-1">
                            {part.unit_cost.toFixed(2)}
                          </td>
                          <td className="px-2 py-1">
                            {part.totalCost.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 space-x-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => {
                                setEditPartIndex(index);
                                setPartToEdit(part);
                                setPartDialogOpen(true);
                              }}
                            >
                              <Pen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this part?"
                                  )
                                ) {
                                  console.log(
                                    "Deleting part:",
                                    part?.partNumber
                                  );
                                  const newParts = parts.filter(
                                    (_, i) => i !== index
                                  );
                                  setParts(newParts);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <InputWrapper
                      control={form.control}
                      name="laborCost"
                      label="Labor Cost"
                      type="text"
                      value={""}
                    />
                    <Dialog
                      open={laborDialogOpen}
                      onOpenChange={setLaborDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="mt-1"
                        >
                          Add Labor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Add Labor Entry</DialogTitle>
                        </DialogHeader>
                        <AddLabor
                          initialValues={form.getValues("labor")} // pass full object
                          onSave={(laborData) => {
                            form.setValue("labor", laborData); // store full object
                            form.setValue("laborCost", laborData.totalCost); // optional: still keep separate field if needed
                            setLaborDialogOpen(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <InputWrapper
                    control={form.control}
                    name="total"
                    label="Total"
                    disabled
                    type="number"
                  />
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
                      Create AddMaintenance
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
