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
import { useGetCostCenters } from "@/services/setups/inventory";
import {
  useGetPriorities,
  useGetWorkOrderStatuses,
  useGetWorkOrderTypes,
  useAddWorkOrder,
  useGetWorkOrder,
} from "@/services/setups/workOrder";
import { GenericObject } from "@/types/types";
import { useSheet } from "@/lib/sheet-providers";
import { useConfirmDialog } from "@/lib/confirm-dialog";
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

export const PurchaseOrderOptions = [
  { id: "LOW", name: "P-00123" },
  { id: "NORMAL", name: "P-00124" },
  { id: "HIGH", name: "P-00128" },
  { id: "URGENT", name: "P-001234" },
];

export function ActualWorkOrderForm() {
  const confirmDialog = useConfirmDialog();
  const { data: WorkOrderStatuses } = useGetWorkOrderStatuses<GenericObject[]>();
  const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
  const { data: workOrderTypeOptions } = useGetWorkOrderTypes<GenericObject[]>();
  const { data: priorityOptions } = useGetPriorities<GenericObject[]>();

  const [maintenanceTasks, setMaintenanceTasks] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<AddMaintenanceInWorkOrderInterface | null>(null);
  const [maintenanceList, setMaintenanceList] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);
  const [status, setStatus] = useState<string>("Open");

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

  const addWorkOrderMutation = useAddWorkOrder();
  const { openSheet } = useSheet();

  // Helper function to transform form data to API format
  function transformFormDataToAPI(data: z.infer<typeof WorkOrderSchema>) {
    // Transform assignees
    const assignees = (data.assigneeIds || []).map((assigneeId: string) => {
      const assigneeOption = assigneeOptions.find((opt) => opt.id === assigneeId);
      const assigneeType = assigneeOption?.group === "Employees" ? "Employee" : "Vendor";
      return {
        assignee: assigneeType,
        assignee_id: assigneeId,
      };
    });

    return {
      wo_number: parseInt(data.workOrderNumber) || 0,
      priority_id: data.priority || "", // priority is already an ID from combobox
      scheduled_date: data.scheduledOn ? data.scheduledOn.toISOString().split("T")[0] : "",
      due_date: data.dueOn ? data.dueOn.toISOString().split("T")[0] : "",
      started_date: data.startedOn ? data.startedOn.toISOString().split("T")[0] : "",
      completed_date: data.completedOn ? data.completedOn.toISOString().split("T")[0] : "",
      type_id: data.workOrderType || "", // workOrderType is already an ID from combobox
      cost_center_id: data.costCenter || "", // costCenter is already an ID from combobox
      po_id: data.po || "", // po is already an ID from combobox
      invoice_number: data.invoice || "",
      status_id: data.status || "", // status is already an ID
      others: ((data as any).others || []).map((item: { name: string; value: string }) => ({
        name: item.name || "",
        value: item.value || "",
      })),
      assignees: assignees,
    };
  }

  async function handleSubmit(data: z.infer<typeof WorkOrderSchema>) {
    try {
      const apiPayload = transformFormDataToAPI(data);
      const response = await addWorkOrderMutation.mutateAsync(apiPayload);
      
      // Get the work order ID from response (assuming response contains id)
      const workOrderId = (response as any)?.id || (response as any)?.data?.id;
      
      if (workOrderId) {
        toast.success("Work Order created successfully!");
        
        // Fetch the work order data and open edit form
        openSheet({
          title: "Edit Work Order",
          description: "Update work order details",
          content: <EditWorkOrderSheetContent workOrderId={workOrderId} />,
        });
      } else {
        toast.success("Work Order created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating work order:", error);
      toast.error(error?.response?.data?.message || "Failed to create work order");
    }
  }

  return (
    <Form {...workOrderForm}>
      <form onSubmit={workOrderForm.handleSubmit((data) => handleSubmit(data))}>
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
                    options={(priorityOptions || []) as GenericObject[]}
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
                      options={(workOrderTypeOptions || []) as GenericObject[]}
                    />

                    <ComboboxFieldWrapper
                      control={workOrderForm.control}
                      name="costCenter"
                      label="Cost center"
                      options={(costCenterOptions || []) as GenericObject[]}
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
              <div className="flex gap-2">
                {WorkOrderStatuses?.map((stat) => (
                        <button
                          key={stat?.id}
                          type="button"
                          className={`p-3 h-fit rounded-md border text-sm font-medium ${
                            status === stat.name
                              ? stat.name.toLowerCase().includes("open")
                                ? "bg-green-500 text-white" // Open = Fresh, ready to start
                                : stat.name.toLowerCase().includes("progress")
                                ? "bg-blue-500 text-white" // In Progress = Active, working
                                : stat.name.toLowerCase().includes("hold")
                                ? "bg-yellow-400 text-white" // On Hold = Caution, paused
                                : stat.name.toLowerCase().includes("complete")
                                ? "bg-purple-600 text-white" // Complete = Done, celebratory
                                : stat.name.toLowerCase().includes("cancelled")
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
            </div>
            <div>
              <div className="flex flex-row justify-between space-x-2 pb-2">
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
                  <TabsTrigger value="Maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="Parts">Parts</TabsTrigger>
                  <TabsTrigger value="Labor">Labor</TabsTrigger>
                  <TabsTrigger value="Attachments">Attachments</TabsTrigger>
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
                              onChange={async (e) => {
                                if (e.target.checked) {
                                  const confirmed = await confirmDialog({ title: "Mark task complete?", confirmText: "Mark" });
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
                    maintenanceItems={workOrderForm.watch("maintenance") || []}
                    onUpdateParts={(updatedParts) =>
                      workOrderForm.setValue("parts", updatedParts)
                    }
                  />
                </TabsContent>
                <TabsContent value="Labor">
                  <LaborTab
                    maintenanceItems={workOrderForm.watch("maintenance") || []}
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
  );
}

// Component to fetch and display work order for editing
function EditWorkOrderSheetContent({ workOrderId }: { workOrderId: string }) {
  const { data: workOrderData, isLoading, isError } = useGetWorkOrder(workOrderId);
  const { closeSheet } = useSheet();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading work order...</div>
      </div>
    );
  }

  if (isError || !workOrderData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Failed to load work order</div>
      </div>
    );
  }

  // Transform API data to form format
  const apiData = workOrderData as any;
  const formData: Partial<z.infer<typeof WorkOrderSchema>> = {
    workOrderNumber: apiData?.wo_number?.toString() || "",
    priority: apiData?.priority_id || "",
    scheduledOn: apiData?.scheduled_date ? new Date(apiData.scheduled_date) : undefined,
    dueOn: apiData?.due_date ? new Date(apiData.due_date) : undefined,
    startedOn: apiData?.started_date ? new Date(apiData.started_date) : undefined,
    completedOn: apiData?.completed_date ? new Date(apiData.completed_date) : undefined,
    workOrderType: apiData?.type_id || "",
    costCenter: apiData?.cost_center_id || "",
    po: apiData?.po_id || "",
    invoice: apiData?.invoice_number || "",
    status: apiData?.status_id || "",
    others: (apiData?.others || []) as { name: string; value: string }[],
    assigneeIds: (apiData?.assignees || []).map((a: any) => a.assignee_id),
  };

  return <EditActualWorkOrderForm workOrderId={workOrderId} initialData={formData} onClose={closeSheet} />;
}

export default function NewWorkOrderForm() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create New Work Order
        </Button>
      </SheetTrigger>
      <SheetContent className="w-5/6">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Fill out the form below to set up your new Work Order.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <ActualWorkOrderForm />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function EditActualWorkOrderForm({
  children,
  data,
  onEdit,
  workOrderId,
  initialData,
  onClose,
}: {
  children?: React.ReactNode;
  data?: any;
  onEdit?: (data: any) => void;
  workOrderId?: string;
  initialData?: Partial<z.infer<typeof WorkOrderSchema>>;
  onClose?: () => void;
}) {
  const confirmDialog = useConfirmDialog();
  const [open, setOpen] = useState(false);
  const { data: priorityOptions } = useGetPriorities();
  const { data: workOrderTypeOptions } = useGetWorkOrderTypes();
  const { data: costCenterOptions } = useGetCostCenters();
  const { data: WorkOrderStatuses } = useGetWorkOrderStatuses();

  const [maintenanceTasks, setMaintenanceTasks] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<AddMaintenanceInWorkOrderInterface | null>(null);
  const [maintenanceList, setMaintenanceList] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);
  const [status, setStatus] = useState<string>("Open");

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

  // Use initialData if provided, otherwise fall back to data
  const formData = initialData || data || {};

  const workOrderForm = useForm<z.infer<typeof WorkOrderSchema>>({
    resolver: zodResolver(WorkOrderSchema),
    defaultValues: formData,
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        workOrderForm.setValue(key as any, value);
      });
    }
  }, [initialData, workOrderForm]);

  async function handleSubmit(data: z.infer<typeof WorkOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Work Order updated successfully!");
    if (onClose) {
      onClose();
    }
  }

  // If used directly (without Sheet wrapper), render just the form
  if (workOrderId || initialData) {
    return (
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
                      options={(priorityOptions || []) as GenericObject[]}
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
                      options={(workOrderTypeOptions || []) as GenericObject[]}
                    />

                    <ComboboxFieldWrapper
                      control={workOrderForm.control}
                      name="costCenter"
                      label="Cost center"
                      options={(costCenterOptions || []) as GenericObject[]}
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
                <div className="flex gap-2">
                  {((WorkOrderStatuses || []) as GenericObject[]).map((stat: GenericObject) => (
                    <button
                      key={stat?.id}
                      type="button"
                      className={`p-3 h-fit rounded-md border text-sm font-medium ${
                        status === (stat?.name as string)
                          ? (stat?.name as string).toLowerCase().includes("open")
                            ? "bg-green-500 text-white"
                            : (stat?.name as string).toLowerCase().includes("progress")
                            ? "bg-blue-500 text-white"
                            : (stat?.name as string).toLowerCase().includes("hold")
                            ? "bg-yellow-400 text-white"
                            : (stat?.name as string).toLowerCase().includes("complete")
                            ? "bg-purple-600 text-white"
                            : (stat?.name as string).toLowerCase().includes("cancelled")
                            ? "bg-red-600 text-white"
                            : "bg-gray-400 text-white"
                          : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() => {
                        workOrderForm.setValue("status", (stat?.id as string) ?? "");
                        setStatus((stat?.name as string) ?? "");
                      }}
                    >
                      {stat?.name as string}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex flex-row justify-between space-x-2 pb-2">
                  <div className="flex w-fit items-end">
                    <ComboboxFieldWrapper
                      control={workOrderForm.control}
                      name="equipment"
                      label="Unit"
                      options={equipmentOptions}
                      required={true}
                    />
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
                    <TabsTrigger value="Maintenance">Maintenance</TabsTrigger>
                    <TabsTrigger value="Parts">Parts</TabsTrigger>
                    <TabsTrigger value="Labor">Labor</TabsTrigger>
                    <TabsTrigger value="Attachments">Attachments</TabsTrigger>
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
                      maintenanceItems={workOrderForm.watch("maintenance") || []}
                      onUpdateParts={(updatedParts) =>
                        workOrderForm.setValue("parts", updatedParts)
                      }
                    />
                  </TabsContent>
                  <TabsContent value="Labor">
                    <LaborTab
                      maintenanceItems={workOrderForm.watch("maintenance") || []}
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
              <GitPullRequestArrow className="mr-2" /> Update Work Order
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // Original Sheet-based usage

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Fluid consumption</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
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
                          options={(priorityOptions || []) as GenericObject[]}
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
                          options={(workOrderTypeOptions || []) as GenericObject[]}
                        />

                        <ComboboxFieldWrapper
                          control={workOrderForm.control}
                          name="costCenter"
                          label="Cost center"
                          options={(costCenterOptions || []) as GenericObject[]}
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
                    <div className="flex gap-2">
                      {((WorkOrderStatuses || []) as GenericObject[]).map((stat: GenericObject) => (
                        <button
                          key={stat?.id}
                          type="button"
                          className={`p-3 h-fit rounded-md border text-sm font-medium ${
                            status === (stat?.name as string)
                              ? (stat?.name as string).toLowerCase().includes("open")
                                ? "bg-green-500 text-white"
                                : (stat?.name as string).toLowerCase().includes("progress")
                                ? "bg-blue-500 text-white"
                                : (stat?.name as string).toLowerCase().includes("hold")
                                ? "bg-yellow-400 text-white"
                                : (stat?.name as string).toLowerCase().includes("complete")
                                ? "bg-purple-600 text-white"
                                : (stat?.name as string).toLowerCase().includes("cancelled")
                                ? "bg-red-600 text-white"
                                : "bg-gray-400 text-white"
                              : "bg-white text-gray-700 border border-gray-300"
                          }`}
                          onClick={() => {
                            workOrderForm.setValue("status", (stat?.id as string) ?? "");
                            setStatus((stat?.name as string) ?? "");
                          }}
                        >
                          {stat?.name as string}
                        </button>
                      ))}
                    </div>
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
                                    onChange={async (e) => {
                                      if (e.target.checked) {
                                        const confirmed = await confirmDialog({ title: "Mark task complete?", confirmText: "Mark" });
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
