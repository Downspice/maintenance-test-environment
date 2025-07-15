"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  GitPullRequestArrow,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import InputWrapper from "../wrappers/InputWrapper";
import { toast } from "sonner";
import {
  ComboboxFieldWrapper,
  MultiComboboxWrapper,
} from "../wrappers/ComboboxWrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Fieldset from "@/components/customUI/fieldset";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddMaintenance from "@/app/(application)/work-orders/forms/add-maintenance-form";
import {
  AddMaintenanceInWorkOrderInterface,
  WorkOrderSchema,
} from "@/lib/WorkOrder/workOrder-data";
import PartsTab from "@/app/(application)/work-orders/view/PartsTab";
import LaborTab from "@/app/(application)/work-orders/view/LaborTab";
import NotesTab from "@/app/(application)/work-orders/view/NotesTab";

// Equipment options
const equipmentOptions = [{ value: "1311827", label: "AC-001-07 Class 8" }];

// Assignee options
const assigneeOptions = [
  { value: "User-246964", label: "Joseph Awer", group: "Employees" },
  { value: "Vendor-324052", label: "Cameron, Inc.", group: "Vendors" },
  { value: "Vendor-324053", label: "Davis Plumbing", group: "Vendors" },
  {
    value: "Vendor-324047",
    label: "International Belt Supply",
    group: "Vendors",
  },
  { value: "Vendor-324051", label: "NAPA", group: "Vendors" },
  { value: "Vendor-324048", label: "Neff Electrical Supply", group: "Vendors" },
  { value: "Vendor-324050", label: "Rush Truck Centers", group: "Vendors" },
  { value: "Vendor-324049", label: "The Instrument Group", group: "Vendors" },
];

// Priority options
const priorityOptions = [
  { value: "LOW", label: "LOW" },
  { value: "NORMAL", label: "NORMAL" },
  { value: "HIGH", label: "HIGH" },
  { value: "URGENT", label: "URGENT" },
];
export const PurchaseOrderOptions = [
  { value: "LOW", label: "P-00123" },
  { value: "NORMAL", label: "P-00124" },
  { value: "HIGH", label: "P-00128" },
  { value: "URGENT", label: "P-001234" },
];
// Work order type options
export const workOrderTypeOptions = [
  { value: "preventive", label: "Preventive Maintenance" },
  { value: "corrective", label: "Corrective Maintenance" },
  { value: "inspection", label: "Inspection" },
  { value: "other", label: "Other" },
];

export const costCenterOptions = [
  { value: "preventive", label: "Preventive Cost Center" },
  { value: "corrective", label: "Corrective Cost Center" },
  { value: "inspection", label: "Inspection Cost Center" },
  { value: "other", label: "Other" },
];

export default function NewWorkOrderForm() {
  const [open, setOpen] = useState(false);
  const [maintenanceTasks, setMaintenanceTasks] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<AddMaintenanceInWorkOrderInterface | null>(null);
  const [maintenanceList, setMaintenanceList] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);

  function handleAddMaintenanceTask(task: AddMaintenanceInWorkOrderInterface) {
    const taskWithStatus = { ...task, complete: false };
    setMaintenanceTasks((prev) => {
      if (selectedMaintenance) {
        // If editing, replace the task instead of adding
        return prev.map((t, i) =>
          t === selectedMaintenance ? taskWithStatus : t
        );
      }
      return [...prev, taskWithStatus];
    });
    setSelectedMaintenance(null);
  }

  const workOrderForm = useForm<z.infer<typeof WorkOrderSchema>>({
    resolver: zodResolver(WorkOrderSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof WorkOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create New Work Order
        </Button>
      </SheetTrigger>
      <SheetContent className="w-5/6 ">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Fill out the form below to set up your new Work Order.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...workOrderForm}>
              <form
                onSubmit={workOrderForm.handleSubmit((data) =>
                  handleSubmit(data)
                )}
              >
                <div className="grid grid-cols-7 space-x-2">
                  <div className="col-span-2 space-y-1">
                    <Fieldset
                      content={
                        <>
                          <InputWrapper
                            control={workOrderForm.control}
                            name="workOrderNumber"
                            label="WO Number"
                            type="text"
                            value={""}
                            required
                          />
                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="priority"
                            label="Priority"
                            options={priorityOptions}
                            required={true}
                          />
                        </>
                      }
                    />

                    <Fieldset
                      legend="Dates"
                      content={
                        <>
                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="scheduledOn"
                            label="Scheduled"
                          />

                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="dueOn"
                            label="Due"
                          />
                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="startedOn"
                            label="Started On"
                          />
                          <DatePickerWrapper
                            control={workOrderForm.control}
                            name="completedOn"
                            label="Completed On"
                          />
                        </>
                      }
                    />
                    <Fieldset
                      legend="Assignees"
                      content={
                        <>
                          <MultiComboboxWrapper
                            control={workOrderForm.control}
                            name="assigneeIds"
                            label="Assignee"
                            options={assigneeOptions}
                            placeholder="Select assignees"
                            searchPlaceholder="Search assignees..."
                            maxSelections={2}
                          />
                        </>
                      }
                    />

                    <Fieldset
                      legend="Misc. Details"
                      content={
                        <>
                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="workOrderType"
                            label="Type"
                            options={workOrderTypeOptions}
                          />

                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="costCenter"
                            label="Cost center"
                            options={costCenterOptions}
                          />

                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="po"
                            label="PO#"
                            options={PurchaseOrderOptions}
                          />
                          <InputWrapper
                            control={workOrderForm.control}
                            name="invoice"
                            label="Invoice"
                            value={""}
                            type={"text"}
                          />
                          <CustomFieldsWrapper
                            control={workOrderForm.control}
                            name="custom"
                            label={"Custom Fields"}
                          />
                        </>
                      }
                    />
                  </div>
                  <div className="col-span-5 space-y-2">
                    <div className="flex justify-end space-x-1 border border-b-black/20">
                      <Button>Open</Button>
                      <Button>In Progress</Button>
                      <Button>On Hold</Button>
                      <Button>Complete</Button>
                    </div>
                    <div>
                      <div className="flex flex-row justify-between space-x-2 ">
                        <div className="flex w-fit items-end">
                          <ComboboxFieldWrapper
                            control={workOrderForm.control}
                            name="equipment"
                            label="Unit"
                            options={equipmentOptions}
                            required={true}
                          />
                          {/* <Button variant="secondary" size={"icon"}>
                            <Plus />
                          </Button> */}
                        </div>
                        <div className="flex w-fit">
                          <InputWrapper
                            control={workOrderForm.control}
                            name="hours"
                            label="Hours"
                            value={""}
                            type={"number"}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Tabs defaultValue="Maintenance" className="w-full">
                        <TabsList>
                          <TabsTrigger value="Maintenance">
                            Maintenance
                          </TabsTrigger>
                          <TabsTrigger value="Parts">Parts</TabsTrigger>
                          <TabsTrigger value="Labor">Labor</TabsTrigger>
                          <TabsTrigger value="Attachments">
                            Attachments
                          </TabsTrigger>
                          <TabsTrigger value="Notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Maintenance">
                          <div className="mb-4">
                            <AddMaintenance
                              data={selectedMaintenance}
                              onAdd={handleAddMaintenanceTask}
                              open={isMaintenanceSheetOpen}
                              setOpen={setIsMaintenanceSheetOpen}
                            />
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Task Name</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Complete</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {maintenanceTasks.map((task, index) => (
                                <TableRow key={index}>
                                  <TableCell>{task.task}</TableCell>
                                  <TableCell>
                                    $
                                    {(
                                      (parseFloat(task.partsCost) || 0) +
                                      (parseFloat(task.laborCost) || 0)
                                    ).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      type="checkbox"
                                      checked={task.complete}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          const confirmed = window.confirm(
                                            "Mark this task as complete?"
                                          );
                                          if (confirmed) {
                                            setMaintenanceTasks((prev) =>
                                              prev.map((t, i) =>
                                                i === index
                                                  ? { ...t, complete: true }
                                                  : t
                                              )
                                            );
                                          }
                                        } else {
                                          // Optional: uncheck logic, or disable unchecking
                                          setMaintenanceTasks((prev) =>
                                            prev.map((t, i) =>
                                              i === index
                                                ? { ...t, complete: false }
                                                : t
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell className="space-x-2">
                                    <Button
                                      onClick={() => {
                                        setSelectedMaintenance(task);
                                        setIsMaintenanceSheetOpen(true);
                                      }}
                                    >
                                      <Pen />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        setMaintenanceTasks((prev) =>
                                          prev.filter((_, i) => i !== index)
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                        <TabsContent value="Parts">
                          <PartsTab
                            workOrderParts={workOrderForm.watch("parts") || []}
                            maintenanceItems={
                              workOrderForm.watch("maintenance") || []
                            }
                            onUpdateParts={(updatedParts) =>
                              workOrderForm.setValue("parts", updatedParts)
                            }
                          />
                        </TabsContent>
                        <TabsContent value="Labor">
                          <LaborTab
                            maintenanceItems={
                              workOrderForm.watch("maintenance") || []
                            }
                            laborEntries={workOrderForm.watch("labor") || []}
                            onUpdateLabor={(updated) =>
                              workOrderForm.setValue("labor", updated)
                            }
                          />
                        </TabsContent>
                        <TabsContent value="Attachments"> </TabsContent>
                        <TabsContent value="Notes">
                          <NotesTab
                            notes={workOrderForm.watch("notes") || []}
                            onUpdateNotes={(updated) =>
                              workOrderForm.setValue("notes", updated)
                            }
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-x-4 my-8 w-full">
                  <Button className=" w-full">
                    <GitPullRequestArrow className="mr-2" /> Create Work Order
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
