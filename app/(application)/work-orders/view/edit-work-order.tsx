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
import { toast } from "sonner";

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
  WorkOrderInterface,
  WorkOrderSchema,
} from "@/lib/WorkOrder/workOrder-data";
import PartsTab from "@/app/(application)/work-orders/view/PartsTab";
import LaborTab from "@/app/(application)/work-orders/view/LaborTab";
import NotesTab from "@/app/(application)/work-orders/view/NotesTab";
import CustomFieldsWrapper from "@/components/forms/wrappers/CustomFieldsWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import {
  ComboboxFieldWrapper,
  MultiComboboxWrapper,
} from "@/components/forms/wrappers/ComboboxWrapper";
import { useGetCostCenters } from "@/services/setups/inventory";
import { useGetWorkOrderStatuses } from "@/services/setups/workOrder";
import { GenericObject } from "@/types/types";
// Equipment options
const equipmentOptions = [{ id: "1311827", name: "AC-001-07 Class 8" }];
// Assignee options
const assigneeOptions = [
  { id: "User-246964", name: "Joseph Awer", group: "Employees" },
  { id: "Vendor-324052", name: "Cameron, Inc.", group: "Vendors" },
  { id: "Vendor-324053", name: "Davis Plumbing", group: "Vendors" },
  {
    id: "Vendor-324047",
    name: "International Belt Supply",
    group: "Vendors",
  },
  { id: "Vendor-324051", name: "NAPA", group: "Vendors" },
  { id: "Vendor-324048", name: "Neff Electrical Supply", group: "Vendors" },
  { id: "Vendor-324050", name: "Rush Truck Centers", group: "Vendors" },
  { id: "Vendor-324049", name: "The Instrument Group", group: "Vendors" },
];

// Priority options
const priorityOptions = [
  { id: "LOW", name: "LOW" },
  { id: "NORMAL", name: "NORMAL" },
  { id: "HIGH", name: "HIGH" },
  { id: "URGENT", name: "URGENT" },
];
export const PurchaseOrderOptions = [
  { id: "LOW", name: "P-00123" },
  { id: "NORMAL", name: "P-00124" },
  { id: "HIGH", name: "P-00128" },
  { id: "URGENT", name: "P-001234" },
];
// Work order type options
export const workOrderTypeOptions = [
  { id: "preventive", name: "Preventive Maintenance" },
  { id: "corrective", name: "Corrective Maintenance" },
  { id: "inspection", name: "Inspection" },
  { id: "other", name: "Other" },
];

export const costCenterOptions = [
  { id: "preventive", name: "Preventive Cost Center" },
  { id: "corrective", name: "Corrective Cost Center" },
  { id: "inspection", name: "Inspection Cost Center" },
  { id: "other", name: "Other" },
];

export default function EditWorkOrderForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: WorkOrderInterface;
}) {
  const { data:WorkOrderStatuses } = useGetWorkOrderStatuses<GenericObject[]>();
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
  const [status, setStatus] = useState<string>(data.status);

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
  const { data: costCenterOptions } = useGetCostCenters();

  const workOrderForm = useForm<z.infer<typeof WorkOrderSchema>>({
    resolver: zodResolver(WorkOrderSchema),
    defaultValues: { ...data },
  });

  async function handleSubmit(data: z.infer<typeof WorkOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Work Order submitted successfully!");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>{data.workOrderNumber}</div>
            </div>
          </SheetTitle>
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
                            name="others"
                            label={"Custom Fields"}
                          />
                        </>
                      }
                    />
                  </div>
                  <div className="col-span-5 space-y-2">
                    <div className="flex justify-end space-x-1 border border-b-black/20">
                      {WorkOrderStatuses?.map((stat) => (
                        <button
                          key={stat?.id}
                          type="button"
                          className={`p-3 h-fit rounded-md border text-sm font-medium ${
                            status === stat.name
                              ? stat.name.toLowerCase() === "open"
                                ? "bg-green-500 text-white" // Open = Fresh, ready to start
                                : stat.name.toLowerCase() === "progress"
                                ? "bg-blue-500 text-white" // In Progress = Active, working
                                : stat.name.toLowerCase() === "hold"
                                ? "bg-yellow-400 text-white" // On Hold = Caution, paused
                                : stat.name.toLowerCase() === "complete"
                                ? "bg-purple-600 text-white" // Complete = Done, celebratory
                                : stat.name.toLowerCase() === "cancelled"
                                ? "bg-red-600 text-white" // Cancelled = Error or terminated
                                : "bg-gray-400 text-white" // Fallback for unexpected status
                              : "bg-white text-gray-700 border border-gray-300"
                          }`}
                          onClick={() => {
                            workOrderForm.setValue("status", stat?.id ?? "");
                            setStatus(stat.name);
                          }}
                        >
                          {stat.name}
                        </button>
                      ))}
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
