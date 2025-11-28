"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import NewEmployeeForm from "./new-employee-form";
import NewVendor from "./new-vendor-form";
import {
  AddMaintenanceInWorkOrderInterface,
  CreateWorkOrderSchema,
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
  useGetNextWorkOrderNumber,
} from "@/services/setups/workOrder";
import { useGetEquipments } from "@/services/setups/equipments";
import {
  useAddWorkOrderUnit,
  useAddWorkOrderUnitMaintenance,
  useAddWorkOrderUnitPart,
  useAddWorkOrderUnitLabor,
  useAddWorkOrderUnitAttachment,
  useAddWorkOrderUnitNote,
} from "@/services/setups/workOrder";
import { GenericObject } from "@/types/types";
import { useSheet } from "@/lib/sheet-providers";
import { useConfirmDialog } from "@/lib/confirm-dialog";
import { useGetPurchaseOrders } from "@/services/setups/purchaseOrder";
import { convertToOptionList } from "@/lib/utils";
import { useGetInvoices } from "@/services/setups/invoice";
import { useGetVendors } from "@/services/setups/vendor";
import { useGetEmployees } from "@/services/setups/employee";
// Equipment options




export function ActualWorkOrderForm() {
  const confirmDialog = useConfirmDialog();
  const { data: WorkOrderStatuses } = useGetWorkOrderStatuses<GenericObject[]>();
  const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
  const { data: workOrderTypeOptions } = useGetWorkOrderTypes<GenericObject[]>();
  const { data: priorityOptions } = useGetPriorities<GenericObject[]>();
  const { data: nextWorkOrderNumberData } = useGetNextWorkOrderNumber();
  const { data: PurchaseOrderOptions } = useGetPurchaseOrders<GenericObject[]>();
  const { data: InvoiceOptions } = useGetInvoices<GenericObject[]>();
  const { data: vendorOptions } = useGetVendors<GenericObject[]>();
  const { data: employeeOptions } = useGetEmployees<GenericObject[]>();

  const transformedEmployeeOptions = useMemo(() => {
    return (employeeOptions || []).map((emp: any) => ({
      id: emp.id,
      name: `${emp.first_name} ${emp.last_name}`,
      group: "Employees",
    }));
  }, [employeeOptions]);

  const { data: equipments } = useGetEquipments<GenericObject[]>();
  const equipmentOptions = useMemo(() => {
    return (equipments || []).map((eq: any) => ({
      id: eq.id,
      name: eq.unit_number,
    }));
  }, [equipments]);

  const transformedVendorOptions = useMemo(() => {
    return (vendorOptions || []).map((vendor: any) => ({
      id: vendor.id,
      name: vendor.name,
      group: "Vendors",
    }));
  }, [vendorOptions]);

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
  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">("Employee");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("");

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

  const workOrderForm = useForm<z.infer<typeof CreateWorkOrderSchema>>({
    resolver: zodResolver(CreateWorkOrderSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (nextWorkOrderNumberData) {
      workOrderForm.setValue("wo_number", nextWorkOrderNumberData);
      workOrderForm.setValue("status_id", "e0a77a5e-fffe-4d94-bec2-91aa2bf1750d");
    }
  }, [nextWorkOrderNumberData, workOrderForm]);

  const addWorkOrderMutation = useAddWorkOrder();
  const { openSheet } = useSheet();

  // Helper function to transform form data to API format
  function transformFormDataToAPI(data: z.infer<typeof CreateWorkOrderSchema>) {
    // Transform assignees
    const assignees = (data.assignee_ids || []).map((assigneeId: string) => {
      // Check both lists to find the assignee
      const isEmployee = transformedEmployeeOptions.find(opt => opt.id === assigneeId);
      const assigneeType = isEmployee ? "Employee" : "Vendor";
      return {
        assignee: assigneeType,
        assignee_id: assigneeId,
      };
    });

    return {
      wo_number: data.wo_number || 0,
      priority_id: data.priority_id || "",
      scheduled_date: data.scheduled_date ? data.scheduled_date.toISOString().split("T")[0] : "",
      due_date: data.due_date ? data.due_date.toISOString().split("T")[0] : "",
      started_date: data.started_date ? data.started_date.toISOString().split("T")[0] : "",
      completed_date: data.completed_date ? data.completed_date.toISOString().split("T")[0] : "",
      type_id: data.type_id || "",
      cost_center_id: data.cost_center_id || "",
      po_id: data.po_id || "",
      invoice_number: data.invoice_number || "",
      status_id: data.status_id || "",
      others: ((data as any).others || []).map((item: { name: string; value: string }) => ({
        name: item.name || "",
        value: item.value || "",
      })),
      assignees: assignees,
    };
  }

  async function handleSubmit(data: z.infer<typeof CreateWorkOrderSchema>) {
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
      <form
        onSubmit={workOrderForm.handleSubmit(
          (data) => handleSubmit(data),
          (errors) => {
            console.error("Form validation errors:", errors);
            toast.error("Please check the form for errors");
          }
        )}
      >
        <div className="grid grid-cols-7 space-x-2">
          <div className="col-span-2 space-y-1">
            <Fieldset
              content={
                <>
                  <InputWrapper
                    control={workOrderForm.control}
                    name="wo_number"
                    label="WO Number"
                    type="number"
                    value={""}
                    required
                  />
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="priority_id"
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
                    name="scheduled_date"
                    label="Scheduled"
                  />

                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="due_date"
                    label="Due"
                  />
                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="started_date"
                    label="Started On"
                  />
                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="completed_date"
                    label="Completed On"
                  />
                </>
              }
            />
            <Fieldset
              legend="Assignees"
              content={
                <>
                  <div className="space-y-4">
                    <RadioGroup
                      defaultValue="Employee"
                      onValueChange={(val) => setAssigneeType(val as "Employee" | "Vendor")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Employee" id="r1" />
                        <Label htmlFor="r1">Employee</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Vendor" id="r2" />
                        <Label htmlFor="r2">Vendor</Label>
                      </div>
                    </RadioGroup>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <MultiComboboxWrapper
                          control={workOrderForm.control}
                          name="assignee_ids"
                          label=""
                          options={assigneeType === "Employee" ? transformedEmployeeOptions : transformedVendorOptions}
                          placeholder={`Select ${assigneeType}s`}
                          searchPlaceholder={`Search ${assigneeType}s...`}
                          maxSelections={assigneeType === "Employee" ? 2 : 1}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (assigneeType === "Employee") {
                            openSheet({
                              title: "Add New Employee",
                              description: "Create a new employee record",
                              content: <NewEmployeeForm />,
                            });
                          } else {
                            openSheet({
                              title: "Add New Vendor",
                              description: "Create a new vendor record",
                              content: <NewVendor />,
                            });
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>


                </>
              }
            />

            <Fieldset
              legend="Misc. Details"
              content={
                <>
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="type_id"
                    label="Type"
                    options={(workOrderTypeOptions || []) as GenericObject[]}
                  />

                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="cost_center_id"
                    label="Cost center"
                    options={(costCenterOptions || []) as GenericObject[]}
                  />

                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="po_id"
                    label="PO#"
                    options={convertToOptionList(PurchaseOrderOptions ?? [], "id", "po_number")}
                  />
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="invoice_number"
                    label="Invoice"
                    options={convertToOptionList(InvoiceOptions ?? [], "id", "invoice_number")}
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
  const formData: Partial<z.infer<typeof CreateWorkOrderSchema>> = {
    wo_number: apiData?.wo_number || apiData?.workOrderNumber || 0,
    priority_id: apiData?.priority_id || apiData?.priority || "",
    scheduled_date: apiData?.scheduled_date ? new Date(apiData.scheduled_date) : apiData?.scheduledOn ? new Date(apiData.scheduledOn) : undefined,
    due_date: apiData?.due_date ? new Date(apiData.due_date) : apiData?.dueOn ? new Date(apiData.dueOn) : undefined,
    started_date: apiData?.started_date ? new Date(apiData.started_date) : apiData?.startedOn ? new Date(apiData.startedOn) : undefined,
    completed_date: apiData?.completed_date ? new Date(apiData.completed_date) : apiData?.completedOn ? new Date(apiData.completedOn) : undefined,
    type_id: apiData?.type_id || apiData?.workOrderType || "",
    cost_center_id: apiData?.cost_center_id || apiData?.costCenter || "",
    po_id: apiData?.po_id || apiData?.po || "",
    invoice_number: apiData?.invoice_number || apiData?.invoice || "",
    status_id: apiData?.status_id || apiData?.status || "",
    others: (apiData?.others || []) as { name: string; value: string }[],
    assignee_ids: apiData?.assignee_ids || apiData?.assigneeIds || (apiData?.assignees || []).map((a: any) => a.assignee_id || a.id),
    equipment_id: apiData?.units?.[0]?.unit_id || apiData?.units?.[0]?.equipment_id || apiData?.units?.[0]?.id || apiData?.equipment_id || apiData?.equipment || "",
    hours: apiData?.units?.[0]?.hours || apiData?.hours || 0,
    maintenance: apiData?.maintenance || [],
    parts: apiData?.parts || [],
    labor: apiData?.labor || [],
    notes: apiData?.notes || [],
    units: apiData?.units || [],
  };

  console.log("EditWorkOrderSheetContent - API Data:", apiData);
  console.log("EditWorkOrderSheetContent - Form Data:", formData);

  return <EditActualWorkOrderForm workOrderId={workOrderId} initialData={formData} onClose={closeSheet} onRefetch={refetch} />;
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

function EditActualWorkOrderFormContent({
  children,
  data,
  onEdit,
  workOrderId,
  initialData,
  onClose,
  onRefetch,
}: {
  children?: React.ReactNode;
  data?: any;
  onEdit?: (data: any) => void;
  workOrderId?: string;
  initialData?: Partial<z.infer<typeof CreateWorkOrderSchema>>;
  onClose?: () => void;
  onRefetch?: () => void;
}) {
  const confirmDialog = useConfirmDialog();

  const { data: priorityOptions } = useGetPriorities();
  const { data: workOrderTypeOptions } = useGetWorkOrderTypes();
  const { data: costCenterOptions } = useGetCostCenters();
  const { data: WorkOrderStatuses } = useGetWorkOrderStatuses();
  const { data: PurchaseOrderOptions } = useGetPurchaseOrders<GenericObject[]>();
  const { data: InvoiceOptions } = useGetInvoices<GenericObject[]>();
  const { data: vendorOptions } = useGetVendors<GenericObject[]>();
  const { data: employeeOptions } = useGetEmployees<GenericObject[]>();
  const { data: equipments } = useGetEquipments<GenericObject[]>();

  const equipmentOptions = useMemo(() => {
    return (equipments || []).map((eq: any) => ({
      id: eq.id,
      name: eq.unit_number,
    }));
  }, [equipments]);


  const [maintenanceTasks, setMaintenanceTasks] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<AddMaintenanceInWorkOrderInterface | null>(null);

  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);
  const [isAddUnitSheetOpen, setIsAddUnitSheetOpen] = useState(false);
  const [status, setStatus] = useState<string>("Open");
  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">("Employee");

  const transformedEmployeeOptions = useMemo(() => {
    return (employeeOptions || []).map((emp: any) => ({
      id: emp.id,
      name: `${emp.first_name} ${emp.last_name} ${emp?.middle_name}`,
    }));
  }, [employeeOptions]);

  const transformedVendorOptions = useMemo(() => {
    return (vendorOptions || []).map((ven: any) => ({
      id: ven.id,
      name: ven.name,
      group: "Vendors",
    }));
  }, [vendorOptions]);

  const { mutate: addMaintenance } = useAddWorkOrderUnitMaintenance();

  function handleAddMaintenanceTask(task: AddMaintenanceInWorkOrderInterface) {
    const unitId = workOrderForm.getValues("equipment_id");
    if (!unitId) {
      toast.error("Please select a unit first.");
      return;
    }

    const payload = {
      unit_id: unitId,
      maintenance: [
        {
          category: task.usage,
          task_id: task.task, // Assuming this is the ID
          type_id: task.taskType, // Assuming this is the ID
          other_task_name: "", // Handle if "Other" is selected?
          other_type_name: "",
          parts_cost: parseFloat(task.partsCost) || 0,
          labor_cost: parseFloat(task.laborCost) || 0,
          total: parseFloat(task.total || "0") || 0,
          notes: "", // Add notes if available in task interface
          parts: (task.parts || []).map((p) => ({
            part_id: p.partNumber, // Assuming partNumber is the ID
            name: p.name,
            description: "",
            vendor_id: "",
            cost_center_id: "",
            quantity: p.quantityUsed,
            unit_cost: p.unit_cost,
            extended_cost: p.totalCost,
            is_warranty_replaced: false,
            po_id: "",
            is_part_under_warranty: false,
            days: "",
            hours: "",
            expiry_date: "",
          })),
          labor: [
            {
              performed_by: "Employee", // Default or from task?
              technician_id: "", // Need to map from task.labor.technicianName (if it's ID)
              work_performed: task.labor.workPerformed,
              cost_center_id: task.labor.costCenter,
              labor_rate: task.labor.labor_rate,
              is_under_warranty: false,
              hours: task.labor.hours,
              total_cost: task.labor.totalCost,
            },
          ],
        },
      ],
    };

    addMaintenance(payload, {
      onSuccess: () => {
        toast.success("Maintenance task added successfully");
        const taskWithStatus = { ...task, complete: false };
        setMaintenanceTasks((prev) => {
          if (selectedMaintenance) {
            return prev.map((t, i) =>
              t === selectedMaintenance ? taskWithStatus : t
            );
          }
          return [...prev, taskWithStatus];
        });
        setSelectedMaintenance(null);
        setIsMaintenanceSheetOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to add maintenance task");
        console.error(error);
      },
    });
  }

  // Use initialData if provided, otherwise fall back to data
  const formData = initialData || data || {};

  const workOrderForm = useForm<z.infer<typeof CreateWorkOrderSchema>>({
    resolver: zodResolver(CreateWorkOrderSchema),
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

  // Watch for equipment selection changes
  const selectedEquipmentId = workOrderForm.watch("equipment_id");
  const [initialEquipmentId, setInitialEquipmentId] = useState<string | undefined>(initialData?.equipment_id);

  useEffect(() => {
    // If initial data loads later, update the ref
    if (initialData?.equipment_id && !initialEquipmentId) {
      setInitialEquipmentId(initialData.equipment_id);
    }
  }, [initialData, initialEquipmentId]);

  useEffect(() => {
    if (selectedEquipmentId && selectedEquipmentId !== initialEquipmentId) {
      // Wait a bit as requested ("wait a while")
      const timer = setTimeout(() => {
        setIsAddUnitSheetOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedEquipmentId, initialEquipmentId]);

  async function handleSubmit(data: z.infer<typeof CreateWorkOrderSchema>) {
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Work Order updated successfully!");
    if (onClose) {
      onClose();
    }
  }

  // If used directly (without Sheet wrapper), render just the form

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
                    name="wo_number"
                    label="WO Number"
                    type="number"
                    value={""}
                    required
                  />
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="priority_id"
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
                    name="scheduled_date"
                    label="Scheduled"
                  />

                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="due_date"
                    label="Due"
                  />
                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="started_date"
                    label="Started On"
                  />
                  <DatePickerWrapper
                    control={workOrderForm.control}
                    name="completed_date"
                    label="Completed On"
                  />
                </>
              }
            />
            <Fieldset
              legend="Assignees"
              content={
                <>
                  <div className="space-y-4">
                    <RadioGroup
                      defaultValue="Employee"
                      onValueChange={(val) => setAssigneeType(val as "Employee" | "Vendor")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Employee" id="edit-r1" />
                        <Label htmlFor="edit-r1">Employee</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Vendor" id="edit-r2" />
                        <Label htmlFor="edit-r2">Vendor</Label>
                      </div>
                    </RadioGroup>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <MultiComboboxWrapper
                          control={workOrderForm.control}
                          name="assignee_ids"
                          label=""
                          options={assigneeType === "Employee" ? transformedEmployeeOptions : transformedVendorOptions}
                          placeholder={`Select ${assigneeType}s`}
                          searchPlaceholder={`Search ${assigneeType}s...`}
                          maxSelections={assigneeType === "Employee" ? 2 : 1}
                        />
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        type="button"
                        onClick={() => {
                          if (assigneeType === "Employee") {
                            // Logic to open new employee sheet if needed
                            toast.info("Add new employee feature coming soon");
                          } else {
                            // Logic to open new vendor sheet if needed
                            toast.info("Add new vendor feature coming soon");
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              }
            />

            <Fieldset
              legend="Misc. Details"
              content={
                <>
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="type_id"
                    label="Type"
                    options={(workOrderTypeOptions || []) as GenericObject[]}
                  />

                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="cost_center_id"
                    label="Cost center"
                    options={(costCenterOptions || []) as GenericObject[]}
                  />

                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="po_id"
                    label="PO#"
                    options={convertToOptionList(PurchaseOrderOptions ?? [], "id", "po_number")}
                  />
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="invoice_number"
                    label="Invoice"
                    options={convertToOptionList(InvoiceOptions ?? [], "id", "invoice_number")}
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
                    className={`p-3 h-fit rounded-md border text-sm font-medium ${status === (stat?.name as string)
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
                      workOrderForm.setValue("status_id", stat?.id);
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
                    name="equipment_id"
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
            {(workOrderForm.watch("units")?.length ?? 0) > 0 && (
              <div id="orderDetailsTabs">
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
                      notes={(workOrderForm.watch("notes") || []) as NotesInterface[]}
                      onUpdateNotes={(updated) =>
                        workOrderForm.setValue("notes", updated)
                      }
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-x-4 my-8 w-full">
          <Button className=" w-full">
            <GitPullRequestArrow className="mr-2" /> Update Work Order
          </Button>
        </div>
      </form>
      <UnitHoursDialog
        open={isAddUnitSheetOpen}
        onOpenChange={setIsAddUnitSheetOpen}
        unitId={workOrderForm.watch("equipment_id")}
        unitName={equipmentOptions?.find((e) => e.id === workOrderForm.watch("equipment_id"))?.name || ""}
        workOrderId={workOrderId || ""}
        onSuccess={() => {
          setIsAddUnitSheetOpen(false);
          // Optionally trigger a refetch of the work order data here
          if (onRefetch) onRefetch();
        }}
        onCancel={() => {
          setIsAddUnitSheetOpen(false);
          toast.info("Unit addition cancelled. No hours entered.");
        }}
      />
    </Form>
  );
}

export function EditActualWorkOrderForm(props: {
  children?: React.ReactNode;
  data?: any;
  onEdit?: (data: any) => void;
  workOrderId?: string;
  initialData?: Partial<z.infer<typeof CreateWorkOrderSchema>>;
  onClose?: () => void;
  onRefetch?: () => void;
}) {
  const [open, setOpen] = useState(false);

  // If controlled (has ID or data), render directly
  if (props.workOrderId || props.initialData) {
    return <EditActualWorkOrderFormContent {...props} />;
  }

  // Otherwise render with Sheet wrapper
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent className="w-3/4 sm:max-w-screen-lg">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Work Order</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <EditActualWorkOrderFormContent {...props} onClose={() => setOpen(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function UnitHoursDialog({
  open,
  onOpenChange,
  unitId,
  unitName,
  workOrderId,
  onSuccess,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string;
  unitName: string;
  workOrderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { mutate: addUnit } = useAddWorkOrderUnit();
  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (hours <= 0) return;

    const timer = setTimeout(() => {
      addUnit(
        { work_order_id: workOrderId, unit_id: unitId, hours },
        {
          onSuccess: () => {
            toast.success("Unit added successfully");
            onSuccess();
            setHours(0);
          },
          onError: () => toast.error("Failed to add unit"),
        }
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [hours, workOrderId, unitId, addUnit, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) onCancel();
    }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Unit: {unitName}</SheetTitle>
          <SheetDescription>Enter hours for this unit.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Hours</Label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              autoFocus
            />
          </div>

        </form>
      </SheetContent>
    </Sheet>
  );
}
