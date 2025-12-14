"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  GitPullRequestArrow,
  Pen,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewEmployeeForm from "./new-employee-form";
import NewVendor from "./new-vendor-form";
import {
  AddMaintenanceInWorkOrderInterface,
  CreateWorkOrderSchema,
} from "@/lib/WorkOrder/workOrder-data";
import AddMaintenance from "./add-maintenance";
import { useGetCostCenters, useGetInventories } from "@/services/setups/inventory";
import {
  useGetPriorities,
  useGetWorkOrderStatuses,
  useGetWorkOrderTypes,
  useAddWorkOrder,
  useGetWorkOrder,
  useGetNextWorkOrderNumber,
  useAddWorkOrderUnit,
  useUpdateWorkOrder,
} from "@/services/setups/workOrder";
import { useGetEquipments } from "@/services/setups/equipments";
import {
  useAddWorkOrderUnitPart,
  useAddWorkOrderUnitLabor,
  useDeleteWorkOrderUnitPart,
  useDeleteWorkOrderUnitLabor,
  useAddWorkOrderUnitMaintenance,
  useUpdateWorkOrderUnitLabor,
  useUpdateWorkOrderUnitMaintenance,
  useDeleteWorkOrderUnitMaintenance,
} from "@/services/setups/workOrder";
import AddLaborUsed from "./add-labor-used";
import AddPartUsed from "./add-part-used";
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
  const { data: inventoriesRes } = useGetInventories();
  const inventories = inventoriesRes?.data || [];
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
  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);
  const [status, setStatus] = useState<string>("Open");
  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">("Employee");

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
    equipment_id: apiData?.units?.[0]?.id || "",
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

        <ScrollArea className="h-[calc(100vh-60px)] pr-4 mt-6">
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
  const { data: inventoriesRes } = useGetInventories();
  const inventories = inventoriesRes?.data || [];
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

  const { mutate: updateWorkOrder } = useUpdateWorkOrder();

  const [maintenanceTasks, setMaintenanceTasks] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<AddMaintenanceInWorkOrderInterface | null>(null);
  const [selectedMaintenanceParts, setSelectedMaintenanceParts] = useState<any[]>([]);
  const [selectedMaintenanceLabor, setSelectedMaintenanceLabor] = useState<any[]>([]);
  const [editingLaborId, setEditingLaborId] = useState<string | null>(null);
  const [editingLaborData, setEditingLaborData] = useState<AddLaborUsedInterface | null>(null);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editingPartData, setEditingPartData] = useState<AddPartUsedInterface | null>(null);

  const { mutate: addLabor } = useAddWorkOrderUnitLabor();
  const { mutate: deleteLabor } = useDeleteWorkOrderUnitLabor();
  const { mutate: addPart } = useAddWorkOrderUnitPart();
  const { mutate: deletePart } = useDeleteWorkOrderUnitPart();

  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);
  const [isAddLaborSheetOpen, setIsAddLaborSheetOpen] = useState(false);
  const [isAddPartSheetOpen, setIsAddPartSheetOpen] = useState(false);
  const [isAddUnitSheetOpen, setIsAddUnitSheetOpen] = useState(false);
  const [status, setStatus] = useState<string>("Open");
  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">("Employee");
  const [units, setUnits] = useState<any[]>([]);

  // Financial State
  const [subtotal, setSubtotal] = useState<number | string>(0);
  const [isDiscount, setIsDiscount] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<"Percent" | "Fixed">("Fixed");
  const [discountAmount, setDiscountAmount] = useState<number | string>(0);
  const [taxOne, setTaxOne] = useState<number | string>(0);
  const [taxTwo, setTaxTwo] = useState<number | string>(0);
  const [total, setTotal] = useState<number | string>(0);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

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
  const { mutate: addLaborAPI } = useAddWorkOrderUnitLabor();
  const { mutate: addPartAPI } = useAddWorkOrderUnitPart();
  const { mutate: updateLabor } = useUpdateWorkOrderUnitLabor();
  const { mutate: updateMaintenance } = useUpdateWorkOrderUnitMaintenance();
  const { mutate: deleteMaintenance } = useDeleteWorkOrderUnitMaintenance();

  function handleAddMaintenanceTask(task: AddMaintenanceInWorkOrderInterface) {
    const unitId = workOrderForm.getValues("equipment_id");
    const units = workOrderForm.getValues("units");

    console.log("handleAddMaintenanceTask - equipment_id:", unitId);
    console.log("handleAddMaintenanceTask - units array:", units);
    console.log("DEBUG: handleAddMaintenanceTask - selectedMaintenance:", selectedMaintenance);
    console.log("DEBUG: handleAddMaintenanceTask - incoming task:", task);

    if (!unitId) {
      toast.error("Please select a unit first.");
      return;
    }

    const payload = {
      unit_id: unitId,
      maintenance: [
        {
          category: task.category,
          task_id: task.task, // Assuming this is the ID
          type_id: task.taskType, // Assuming this is the ID
          other_task_name: "", // Handle if "Other" is selected?
          other_type_name: "",
          parts_cost: parseFloat(task.partsCost) || 0,
          labor_cost: parseFloat(task.laborCost) || 0,
          total: Number(task.total || "0") || 0,
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
          labor: (task.labor || []).map((l) => ({
            performed_by: l.performed_by,
            technician_id: l.technician_id,
            work_performed: l.work_performed,
            cost_center_id: l.cost_center_id,
            labor_rate: l.labor_rate,
            hours: l.hours,
            total_cost: l.total_cost,
            maintenance_id: "",
            is_under_warranty: l.is_under_warranty,
          })),
        },
      ],
    };

    const workOrderData = props as any;
    const workOrderId = workOrderData.workOrderId || workOrderData.data?.id;

    // derived Id
    const maintenanceId = selectedMaintenance?.id || (selectedMaintenance as any)?.maintenance_id;

    if (maintenanceId) {
      // Edit Mode
      const updatePayload = {
        id: maintenanceId,
        unit_id: unitId,
        work_order_id: workOrderId,
        ...payload.maintenance[0], // Extract the single maintenance object
        parts: payload.maintenance[0].parts,
        labor: payload.maintenance[0].labor,
      };

      updateMaintenance(updatePayload, {
        onSuccess: () => {
          toast.success("Maintenance task updated successfully");
          setSelectedMaintenance(null);
          setIsMaintenanceSheetOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update maintenance task");
          console.error(error);
        }
      });

    } else {
      // Create Mode
      addMaintenance(payload, {
        onSuccess: () => {
          toast.success("Maintenance task added successfully");
          // Local state update mostly irrelevant if we rely on refetch, but keeping for now if mixed mode
          const taskWithStatus = { ...task, complete: false };
          setMaintenanceTasks((prev) => [...prev, taskWithStatus]);
          setSelectedMaintenance(null);
          setIsMaintenanceSheetOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to add maintenance task");
          console.error(error);
        },
      });
    }
  }

  const handleAddLabor = async (labor: AddLaborUsedInterface) => {
    const unitId = workOrderForm.getValues("equipment_id");

    console.log("DEBUG: handleAddLabor called", { labor, unitId, editingLaborId });

    if (!unitId) {
      console.log("DEBUG: No unitId selected");
      toast.error("Please select a unit first.");
      return;
    }

    const payload = {
      unit_id: unitId,
      labor: [labor],
    };

    if (editingLaborId) {
      // Edit mode: Use Update API
      const updatePayload = {
        id: editingLaborId,
        unit_id: unitId, // Preserve context
        work_order_id: workOrderId, // For cache invalidation
        ...labor,
      };

      updateLabor(updatePayload, {
        onSuccess: () => {
          toast.success("Labor updated successfully");
          setIsAddLaborSheetOpen(false);
          setEditingLaborId(null);
          setEditingLaborData(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update labor");
          console.error(error);
        },
      });
    } else {
      // Create mode
      addLabor(payload, {
        onSuccess: () => {
          toast.success("Labor added successfully");
          setIsAddLaborSheetOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add labor");
          console.error(error);
        },
      });
    }
  };

  const handleDeleteLabor = (id: string, index: number) => {
    if (!id) {
      // Fallback for local-only items (shouldn't happen if everything is via API)
      const currentLabor = workOrderForm.getValues("labor") || [];
      const updatedLabor = currentLabor.filter((_, i) => i !== index);
      workOrderForm.setValue("labor", updatedLabor);
      return;
    }

    if (confirm("Are you sure you want to delete this labor entry?")) {
      deleteLabor({ id }, {
        onSuccess: () => {
          toast.success("Labor deleted successfully");
        },
        onError: (error) => {
          toast.error("Failed to delete labor");
          console.error(error);
        }
      });
    }
  };

  async function handleAddPart(partData: AddPartUsedInterface) {
    const unitId = workOrderForm.getValues("equipment_id");
    if (!unitId) {
      toast.error("Please select a unit first.");
      return;
    }

    const payload = {
      unit_id: unitId,
      parts: [partData],
    };

    try {
      if (editingPartId) {
        // Edit mode: Delete old then Add new
        await deletePart({ id: editingPartId }, {
          onSuccess: () => {
            console.log("Deleted old part entry");
          },
          onError: (err) => {
            console.error("Failed to delete part for update", err);
            toast.error("Failed to update part (delete step)");
            return;
          }
        });
      }

      addPart(payload, {
        onSuccess: () => {
          toast.success(editingPartId ? "Part updated successfully" : "Part added successfully");
          setIsAddPartSheetOpen(false);
          setEditingPartId(null);
          setEditingPartData(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add part");
          console.error(error);
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  const handleDeletePart = (id: string, index: number) => {
    if (!id) {
      const currentParts = workOrderForm.getValues("parts") || [];
      const updatedParts = currentParts.filter((_, i) => i !== index);
      workOrderForm.setValue("parts", updatedParts);
      return;
    }

    if (confirm("Are you sure you want to delete this part?")) {
      deletePart({ id }, {
        onSuccess: () => {
          toast.success("Part deleted successfully");
        },
        onError: (error) => {
          toast.error("Failed to delete part");
          console.error(error);
        }
      });
    }
  };

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
      console.log("Form initialized with equipment_id:", initialData.equipment_id);
      if (initialData.units) {
        setUnits(initialData.units);
      }
      const assignedTo = (initialData as any).assigned_to;
      if (assignedTo && assignedTo.length > 0) {
        const type = assignedTo[0].assignee_type_name;

        setAssigneeType(type as "Employee" | "Vendor");

        const ids = assignedTo.map((a: any) => a.assignee_id);

        // Timeout to ensure state updates propagate if needed, though setValue should work
        setTimeout(() => {
          workOrderForm.setValue("assignee_ids", ids);
        }, 0);

      } else if (initialData.assignees && initialData.assignees.length > 0) {
        // Fallback for assignees object
        const type = initialData.assignees[0].assignee_type;
        setAssigneeType(type as "Employee" | "Vendor");
        const ids = initialData.assignees.map((a: any) => a.assignee_id);
        workOrderForm.setValue("assignee_ids", ids);
      } else if (initialData.assignee_ids) {
        // Fallback for assignee_ids array
        workOrderForm.setValue("assignee_ids", initialData.assignee_ids);
      }

      // Handle financial fields
      if (initialData.subtotal !== undefined) setSubtotal(initialData.subtotal);
      if (initialData.is_discount !== undefined) setIsDiscount(initialData.is_discount);
      if (initialData.discount_type !== undefined) setDiscountType(initialData.discount_type as "Percent" | "Fixed");
      if (initialData.discount_amount !== undefined) setDiscountAmount(initialData.discount_amount);
      if (initialData.tax_one !== undefined) setTaxOne(initialData.tax_one);
      if (initialData.tax_two !== undefined) setTaxTwo(initialData.tax_two);
      if (initialData.total !== undefined) setTotal(initialData.total);
      if (initialData.is_calculated !== undefined) setIsCalculated(initialData.is_calculated);

      // Handle Status State for UI highlighting
      if (initialData.status_id && WorkOrderStatuses) {
        const foundStatus = (WorkOrderStatuses as GenericObject[]).find(s => s.id === initialData.status_id);
        if (foundStatus) {
          setStatus(foundStatus.name as string);
        }
      }

    }
  }, [initialData, workOrderForm, WorkOrderStatuses]);

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
    const targetId = workOrderId || (initialData as any)?.id;
    if (!targetId) {
      toast.error("Cannot update: Missing Work Order ID");
      return;
    }

    // Transform assignee_ids to assignees object array
    const assignees = (data.assignee_ids || []).map(id => ({
      assignee_type: assigneeType,
      assignee_id: id
    }));

    // Create payload with assignees
    const payload = {
      ...data,
      id: targetId,
      assignees: assignees
    };

    updateWorkOrder(payload, {
      onSuccess: () => {
        toast.success("Work Order updated successfully!");
        if (onRefetch) onRefetch();
        if (onClose) onClose();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update Work Order");
        console.error("Update Error:", error);
      }
    });
  }

  // If used directly (without Sheet wrapper), render just the form

  return (
    <Form {...workOrderForm}>
      <form
        onSubmit={workOrderForm.handleSubmit(
          (data) => handleSubmit(data),
          (errors) => {
            console.error("Form Validation Errors:", errors);
            toast.error("Please fix the errors in the form");
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
              <div className="flex flex-row justify-between pb-2">
                {/* Logic for live calculations */}
                {(() => {
                  const maintenance = workOrderForm.watch("maintenance") || [];
                  const labor = workOrderForm.watch("labor") || [];
                  const parts = workOrderForm.watch("parts") || [];
                  const isDiscount = workOrderForm.watch("is_discount");
                  const discountType = workOrderForm.watch("discount_type");
                  const discountAmount = Number(workOrderForm.watch("discount_amount") || 0);
                  const tax1Rate = Number(workOrderForm.watch("tax_one") || 0);
                  const tax2Rate = Number(workOrderForm.watch("tax_two") || 0);
                  const isCalculated = workOrderForm.watch("is_calculated");

                  // Calculate Subtotal
                  const mTotal = maintenance.reduce((sum, task) => sum + (Number(task.total) || 0), 0);
                  const lTotal = labor.filter((l: any) => !l.maintenance_id).reduce((sum, l: any) => sum + (Number(l.total_cost) || 0), 0);
                  const pTotal = parts.filter((p: any) => !p.maintenance_id).reduce((sum, p: any) => sum + (Number(p.extended_cost) || ((Number(p.quantity) || 0) * (Number(p.unit_cost) || 0)) || 0), 0);

                  const calculatedSubtotal = mTotal + lTotal + pTotal;

                  useEffect(() => {
                    // Update subtotal if not manually overridden (User said: when is calculated is false use totals)
                    // Assuming 'calculated' means auto-sum from tables.
                    // We don't have a UI to toggle 'is_calculated' yet so we assume it's always calculating for now, or use the field if it existed.
                    // Defaulting to always update as per "provide live updates"
                    if (!isCalculated) {
                      workOrderForm.setValue("subtotal", calculatedSubtotal);
                    }

                    // Calc Discount
                    let dAmt = 0;
                    if (isDiscount) {
                      if (discountType === "Percent") dAmt = calculatedSubtotal * (discountAmount / 100);
                      else dAmt = discountAmount;
                    }

                    const taxable = Math.max(0, calculatedSubtotal - dAmt);
                    const t1 = taxable * tax1Rate;
                    const t2 = taxable * tax2Rate;
                    const total = taxable + t1 + t2;

                    workOrderForm.setValue("total", total);

                  }, [calculatedSubtotal, isDiscount, discountType, discountAmount, tax1Rate, tax2Rate, isCalculated, workOrderForm.setValue]);

                  return null;
                })()}

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
              {workOrderForm.watch("equipment_id") && (
                <Tabs defaultValue="maintenance" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    <TabsTrigger value="labor">Labor</TabsTrigger>
                    <TabsTrigger value="parts">Parts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="maintenance" className="mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-semibold text-lg">Maintenance List</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMaintenance(null);
                          setIsMaintenanceSheetOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Maintenance
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Maintenance</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Complete</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workOrderForm.watch("maintenance")?.map((task, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {task.other_task_name ||
                                (task.task_id
                                  ? task.task_name // Assuming task_name is populated, otherwise needs lookup
                                  : "Unknown Task")}
                            </TableCell>
                            <TableCell>
                              {workOrderForm.watch("currency")}{Number(task.total).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={task.complete}
                                onChange={() => {
                                  // Logic to update completion status would go here
                                  // For now, just a placeholder or read-only view since functionality wasn't clearly defined in recent edits
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => {
                                    const maintenanceId = task.id || (task as any).maintenance_id;
                                    const allParts = workOrderForm.getValues("parts") || [];
                                    const allLabor = workOrderForm.getValues("labor") || [];

                                    const linkedParts = allParts.filter((p: any) => p.maintenance_id === maintenanceId);
                                    const linkedLabor = allLabor.filter((l: any) => l.maintenance_id === maintenanceId);

                                    setSelectedMaintenanceParts(linkedParts);
                                    setSelectedMaintenanceLabor(linkedLabor);
                                    setSelectedMaintenance(task);
                                    setIsMaintenanceSheetOpen(true);
                                  }}
                                >
                                  <Pen className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedMaintenance({ ...task, id: task.id || (task as any).maintenance_id }); // Ensure ID is passed for linking
                                        setIsAddLaborSheetOpen(true);
                                      }}
                                    >
                                      Add Labor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedMaintenance({ ...task, id: task.id || (task as any).maintenance_id }); // Ensure ID is passed for linking
                                        setIsAddPartSheetOpen(true);
                                      }}
                                    >
                                      Add Parts
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600 focus:text-red-600"
                                      onClick={() => {
                                        if (task.id) {
                                          if (confirm("Are you sure you want to delete this maintenance task?")) {
                                            deleteMaintenance({ id: task.id }, {
                                              onSuccess: () => {
                                                toast.success("Maintenance task deleted successfully");
                                              },
                                              onError: (error) => {
                                                toast.error("Failed to delete maintenance task");
                                                console.error(error);
                                              }
                                            });
                                          }
                                        } else {
                                          const currentMaintenance = workOrderForm.getValues("maintenance") || [];
                                          const updatedMaintenance = currentMaintenance.filter((_, i) => i !== index);
                                          workOrderForm.setValue("maintenance", updatedMaintenance);
                                        }
                                      }}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell className="text-right font-bold">Total</TableCell>
                          <TableCell className="font-bold">
                            {workOrderForm.watch("currency")}{
                              (workOrderForm.watch("maintenance") || []).reduce((sum, task) => sum + (Number(task.total) || 0), 0).toFixed(2)
                            }
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TabsContent>
                  <TabsContent value="labor" className="mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-semibold text-lg">Labor List</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMaintenance(null); // Ensure no maintenance context
                          setEditingLaborId(null); // Reset edit state
                          setEditingLaborData(null);
                          setIsAddLaborSheetOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Labor
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Technician</TableHead>
                          <TableHead>Comments</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(workOrderForm.watch("labor")?.filter((l: any) => !l.maintenance_id) ?? []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No standalone labor added.
                            </TableCell>
                          </TableRow>
                        ) : (
                          workOrderForm.watch("labor")?.map((laborItem, index) => {
                            if (laborItem.maintenance_id) return null; // Skip maintenance-linked labor

                            // Lookup technician name
                            const technicianId = laborItem.technician_id;
                            const employee = employeeOptions?.find((e) => e.id === technicianId);
                            const vendor = vendorOptions?.find((v) => v.id === technicianId);

                            let technicianName = "Unknown";
                            if (employee) {
                              technicianName = `${employee.last_name || ''}, ${employee.first_name || ''}`.trim().replace(/^, /, "").replace(/,$/, "");
                            } else if (vendor) {
                              technicianName = vendor.name || "Vendor";
                            }

                            return (
                              <TableRow key={index}>
                                <TableCell>{technicianName}</TableCell>
                                <TableCell>{laborItem.work_performed || "-"}</TableCell>
                                <TableCell>{workOrderForm.watch("currency")}{Number(laborItem.labor_rate).toFixed(2)}</TableCell>
                                <TableCell>{laborItem.hours}</TableCell>
                                <TableCell>{workOrderForm.watch("currency")}{Number(laborItem.total_cost).toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      onClick={() => {
                                        setEditingLaborId(laborItem.id);
                                        setEditingLaborData(laborItem);
                                        setSelectedMaintenance(null);
                                        setIsAddLaborSheetOpen(true);
                                      }}
                                    >
                                      <Pen className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      className="text-red-600"
                                      onClick={() => handleDeleteLabor(laborItem.id, index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                          <TableCell className="font-bold">
                            {workOrderForm.watch("currency")}{
                              (workOrderForm.watch("labor") || [])
                                .filter(l => !l.maintenance_id)
                                .reduce((sum, l) => sum + (Number(l.total_cost) || 0), 0)
                                .toFixed(2)
                            }
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TabsContent>
                  <TabsContent value="parts" className="mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-semibold text-lg">Parts List</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMaintenance(null);
                          setEditingPartId(null);
                          setEditingPartData(null);
                          setIsAddPartSheetOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Parts
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Part#</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Used</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(workOrderForm.watch("parts")?.filter((p: any) => !p.maintenance_id) ?? []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No standalone parts added.
                            </TableCell>
                          </TableRow>
                        ) : (
                          workOrderForm.watch("parts")?.map((partItem, index) => {
                            if (partItem.maintenance_id) return null; // Skip maintenance-linked parts

                            const partId = partItem.part_id;
                            const inventoryPart = inventories?.find((i: any) => i.id === partId);
                            const partNumber = inventoryPart?.part_number || "N/A";
                            const partName = inventoryPart?.name || partItem.name || "Unknown";

                            // Calculate total if extended_cost is missing (though our form calculates it)
                            const total = partItem.extended_cost || ((partItem.quantity || 0) * (partItem.unit_cost || 0));

                            return (
                              <TableRow key={index}>
                                <TableCell>{partNumber}</TableCell>
                                <TableCell>{partName}</TableCell>
                                <TableCell>{partItem.quantity}</TableCell>
                                <TableCell>{workOrderForm.watch("currency")}{Number(partItem.unit_cost).toFixed(2)}</TableCell>
                                <TableCell>{workOrderForm.watch("currency")}{Number(total).toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      onClick={() => {
                                        setEditingPartId(partItem.id);
                                        setEditingPartData(partItem);
                                        setSelectedMaintenance(null);
                                        setIsAddPartSheetOpen(true);
                                      }}
                                    >
                                      <Pen className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      className="text-red-600"
                                      onClick={() => handleDeletePart(partItem.id, index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                          <TableCell className="font-bold">
                            {workOrderForm.watch("currency")}{
                              (workOrderForm.watch("parts") || [])
                                .filter(p => !p.maintenance_id)
                                .reduce((sum, p) => sum + (Number(p.extended_cost) || ((Number(p.quantity) || 0) * (Number(p.unit_cost) || 0)) || 0), 0)
                                .toFixed(2)
                            }
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TabsContent>
                </Tabs>
              )}

              {/* Financial Summary */}
              {workOrderForm.watch("equipment_id") && (
                <div className="mt-8 border rounded-lg p-6 bg-muted/10 space-y-4 max-w-2xl ml-auto">
                  <h3 className="font-semibold text-lg mb-4">Financial Summary</h3>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold text-lg">
                      {workOrderForm.watch("currency")}
                      {Number(workOrderForm.watch("subtotal") || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex flex-col gap-4 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="discount-switch" className="font-medium">Discount</Label>
                        <Switch
                          id="discount-switch"
                          checked={workOrderForm.watch("is_discount")}
                          onCheckedChange={(val) => {
                            workOrderForm.setValue("is_discount", val);
                            if (!val) {
                              workOrderForm.setValue("discount_amount", 0);
                            }
                          }}
                        />
                      </div>
                      {workOrderForm.watch("is_discount") && (
                        <div className="flex items-center gap-4">
                          <RadioGroup
                            value={workOrderForm.watch("discount_type") || "Fixed"}
                            onValueChange={(val: "Percent" | "Fixed") => workOrderForm.setValue("discount_type", val)}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Percent" id="disc-percent" />
                              <Label htmlFor="disc-percent">Percent</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Fixed" id="disc-fixed" />
                              <Label htmlFor="disc-fixed">Fixed</Label>
                            </div>
                          </RadioGroup>
                          <div className="w-32">
                            <Input
                              type="number"
                              placeholder={workOrderForm.watch("discount_type") === "Percent" ? "%" : "Amount"}
                              {...workOrderForm.register("discount_amount")}
                              className="h-9"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {workOrderForm.watch("is_discount") && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Discount Amount</span>
                        <span>
                          - {workOrderForm.watch("currency")}
                          {(() => {
                            const sub = Number(workOrderForm.watch("subtotal") || 0);
                            const type = workOrderForm.watch("discount_type");
                            const val = Number(workOrderForm.watch("discount_amount") || 0);
                            let amt = 0;
                            if (type === "Percent") amt = sub * (val / 100);
                            else amt = val;
                            return amt.toFixed(2);
                          })()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Taxes */}
                  <div className="space-y-3 py-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label>Tax 1 (Rate)</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          className="w-24 h-8"
                          placeholder="0.0000"
                          {...workOrderForm.register("tax_one")}
                        />
                      </div>
                      <span className="text-muted-foreground">
                        {workOrderForm.watch("currency")}
                        {(() => {
                          const sub = Number(workOrderForm.watch("subtotal") || 0);
                          const discType = workOrderForm.watch("discount_type");
                          const discVal = Number(workOrderForm.watch("discount_amount") || 0);
                          let dAmt = 0;
                          if (workOrderForm.watch("is_discount")) {
                            if (discType === "Percent") dAmt = sub * (discVal / 100);
                            else dAmt = discVal;
                          }
                          const taxable = Math.max(0, sub - dAmt);
                          return (taxable * (Number(workOrderForm.watch("tax_one")) || 0)).toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label>Tax 2 (Rate)</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          className="w-24 h-8"
                          placeholder="0.0000"
                          {...workOrderForm.register("tax_two")}
                        />
                      </div>
                      <span className="text-muted-foreground">
                        {workOrderForm.watch("currency")}
                        {(() => {
                          const sub = Number(workOrderForm.watch("subtotal") || 0);
                          const discType = workOrderForm.watch("discount_type");
                          const discVal = Number(workOrderForm.watch("discount_amount") || 0);
                          let dAmt = 0;
                          if (workOrderForm.watch("is_discount")) {
                            if (discType === "Percent") dAmt = sub * (discVal / 100);
                            else dAmt = discVal;
                          }
                          const taxable = Math.max(0, sub - dAmt);
                          return (taxable * (Number(workOrderForm.watch("tax_two")) || 0)).toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {workOrderForm.watch("currency")}
                      {Number(workOrderForm.watch("total") || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Duplicate table and buttons removed from here */}
        <div className="flex justify-between gap-x-4 my-8 w-full">
          <Button className=" w-full">
            <GitPullRequestArrow className="mr-2" /> Update Work Order
          </Button>
        </div>
      </form>

      <AddMaintenance
        open={isMaintenanceSheetOpen}
        setOpen={setIsMaintenanceSheetOpen}
        onAdd={handleAddMaintenanceTask}
        data={selectedMaintenance}
        unitId={workOrderForm.watch("equipment_id")}
        initialParts={selectedMaintenanceParts}
        initialLabor={selectedMaintenanceLabor}
      />
      <AddLaborUsed
        open={isAddLaborSheetOpen}
        setOpen={setIsAddLaborSheetOpen}
        onAdd={handleAddLabor}
        maintenanceId={selectedMaintenance?.id || (selectedMaintenance as any)?.maintenance_id}
        data={editingLaborData}
      />
      <AddPartUsed
        open={isAddPartSheetOpen}
        setOpen={setIsAddPartSheetOpen}
        onAdd={handleAddPart}
        maintenanceId={selectedMaintenance?.id || (selectedMaintenance as any)?.maintenance_id}
        data={editingPartData}
      />
      <UnitHoursDialog
        open={isAddUnitSheetOpen}
        onOpenChange={setIsAddUnitSheetOpen}
        unitId={workOrderForm.watch("equipment_id") || ""}
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
