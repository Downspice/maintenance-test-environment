"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FilePenIcon, GitPullRequestArrow, Plus, Trash2 } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import DatePickerWrapper from "../fields/DatePickerWrapper";
import InputWrapper from "../fields/InputWrapper";
import { toast } from "sonner";
import {
  ComboboxFieldWrapper,
  MultiComboboxWrapper,
} from "../fields/ComboboxWrapper";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Fieldset from "@/components/customUI/fieldset";
import CustomFieldsWrapper from "../fields/CustomFieldsWrapper";
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
import { WorkOrderUpdateLoader } from "@/components/ui/work-order-update-loader";
import EmployeeFormWrapper from "@/components/forms/fields/employee-form-wrapper";
import VendorFormWrapper from "@/components/forms/fields/vendor-form-wrapper";
import {
  AddMaintenanceInWorkOrderInterface,
  AddLaborUsedInterface,
  AddPartUsedInterface,
  CreateWorkOrderSchema,
} from "@/lib/domains/work-order/workOrder-data";
import AddMaintenance from "./add-maintenance";
import {
  useGetCostCenters,
  useGetInventories,
} from "@/services/setups/inventory";
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
  useUpdateWorkOrderUnitPart,
  useUpdateWorkOrderUnitMaintenance,
  useDeleteWorkOrderUnitMaintenance,
  useAddWorkOrderUnitNote,
  useUpdateWorkOrderUnitNote,
  useDeleteWorkOrderUnitNote,
} from "@/services/setups/workOrder";
import AddLaborUsed from "./add-labor-used";
import AddPartUsed from "./add-part-used";
import AddNote from "./add-note";
import { GenericObject } from "@/types/types";
import { useSheet } from "@/lib/providers/sheet-providers";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { useGetPurchaseOrders } from "@/services/setups/purchaseOrder";
import { convertToOptionList } from "@/lib/shared/utils";
import { useGetInvoices } from "@/services/setups/invoice";
import { useGetVendors } from "@/services/setups/vendor";
import { useGetEmployees } from "@/services/setups/employee";
// Equipment options

export function ActualWorkOrderForm({
  formId = "actual-work-order-form",
  hideSubmitButton,
}: {
  formId?: string;
  hideSubmitButton?: boolean;
} = {}) {
  const confirmDialog = useConfirmDialog();
  const { data: WorkOrderStatuses } =
    useGetWorkOrderStatuses<GenericObject[]>();
  const { data: costCenterOptions } = useGetCostCenters<GenericObject[]>();
  const { data: inventoriesRes } = useGetInventories();
  const inventories = inventoriesRes?.data || [];
  const { data: workOrderTypeOptions } =
    useGetWorkOrderTypes<GenericObject[]>();
  const { data: priorityOptions } = useGetPriorities<GenericObject[]>();
  const { data: nextWorkOrderNumberData } = useGetNextWorkOrderNumber();
  const { data: PurchaseOrderOptions } =
    useGetPurchaseOrders<GenericObject[]>();
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
  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">(
    "Employee"
  );

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
      workOrderForm.setValue(
        "status_id",
        "e0a77a5e-fffe-4d94-bec2-91aa2bf1750d"
      );
    }
  }, [nextWorkOrderNumberData, workOrderForm]);

  const addWorkOrderMutation = useAddWorkOrder();
  const { openSheet } = useSheet();

  // Helper function to transform form data to API format
  function transformFormDataToAPI(data: z.infer<typeof CreateWorkOrderSchema>) {
    // Transform assignees
    const assignees = (data.assignee_ids || []).map((assigneeId: string) => {
      // Check both lists to find the assignee
      const isEmployee = transformedEmployeeOptions.find(
        (opt) => opt.id === assigneeId
      );
      const assigneeType = isEmployee ? "Employee" : "Vendor";
      return {
        assignee_type: assigneeType,
        assignee_id: assigneeId,
      };
    });

    return {
      wo_number: data.wo_number || 0,
      priority_id: data.priority_id || "",
      scheduled_date: data.scheduled_date
        ? data.scheduled_date.toISOString().split("T")[0]
        : "",
      due_date: data.due_date ? data.due_date.toISOString().split("T")[0] : "",
      started_date: data.started_date
        ? data.started_date.toISOString().split("T")[0]
        : "",
      completed_date: data.completed_date
        ? data.completed_date.toISOString().split("T")[0]
        : "",
      type_id: data.type_id || "",
      cost_center_id: data.cost_center_id || "",
      po_id: data.po_id || "",
      invoice_number: data.invoice_number || "",
      status_id: data.status_id || "",
      others: ((data as any).others || []).map((item: any) => ({
        ...(item.id && { id: item.id }), // Preserve id if it exists
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
      toast.error(
        error?.response?.data?.message || "Failed to create work order"
      );
    }
  }

  return (
    <Form {...workOrderForm}>
      <form
        id={formId}
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
                      onValueChange={(val) =>
                        setAssigneeType(val as "Employee" | "Vendor")
                      }
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
                          showLabel={false}
                          control={workOrderForm.control}
                          name="assignee_ids"
                          label=""
                          options={
                            assigneeType === "Employee"
                              ? transformedEmployeeOptions
                              : transformedVendorOptions
                          }
                          placeholder={`Select ${assigneeType}s`}
                          searchPlaceholder={`Search ${assigneeType}s...`}
                          maxSelections={assigneeType === "Employee" ? 2 : 1}
                        />
                      </div>
                      {assigneeType === "Employee" ? (
                        <EmployeeFormWrapper variant="icon" />
                      ) : (
                        <VendorFormWrapper variant="icon" />
                      )}
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
                    options={convertToOptionList(
                      PurchaseOrderOptions ?? [],
                      "id",
                      "po_number"
                    )}
                  />
                  <ComboboxFieldWrapper
                    control={workOrderForm.control}
                    name="invoice_number"
                    label="Invoice"
                    options={convertToOptionList(
                      InvoiceOptions ?? [],
                      "id",
                      "invoice_number"
                    )}
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
        {!hideSubmitButton && (
          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Create Work Order
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

// Component to fetch and display work order for editing
// Component to fetch and display work order for editing
function EditWorkOrderSheetContent({ workOrderId }: { workOrderId: string }) {
  const {
    data: workOrderData,
    isLoading,
    isError,
    refetch,
  } = useGetWorkOrder(workOrderId);
  const { closeSheet } = useSheet();

  // Only show loading spinner if we have NO data.
  // If we have data but are refetching (isFetching), we keep the form mounted.
  if (isLoading && !workOrderData) {
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
    scheduled_date: apiData?.scheduled_date
      ? new Date(apiData.scheduled_date)
      : apiData?.scheduledOn
        ? new Date(apiData.scheduledOn)
        : undefined,
    due_date: apiData?.due_date
      ? new Date(apiData.due_date)
      : apiData?.dueOn
        ? new Date(apiData.dueOn)
        : undefined,
    started_date: apiData?.started_date
      ? new Date(apiData.started_date)
      : apiData?.startedOn
        ? new Date(apiData.startedOn)
        : undefined,
    completed_date: apiData?.completed_date
      ? new Date(apiData.completed_date)
      : apiData?.completedOn
        ? new Date(apiData.completedOn)
        : undefined,
    type_id: apiData?.type_id || apiData?.workOrderType || "",
    cost_center_id: apiData?.cost_center_id || apiData?.costCenter || "",
    po_id: apiData?.po_id || apiData?.po || "",
    invoice_number: apiData?.invoice_number || apiData?.invoice || "",
    status_id: apiData?.status_id || apiData?.status || "",
    others: (apiData?.others || []).map((item: any) => ({
      ...(item.id && { id: item.id }),
      name: item.name || "",
      value: item.value || "",
    })),
    assignees: (apiData?.assignees || []).map((item: any) => ({
      ...(item.id && { id: item.id }),
      assignee_type: item.assignee_type || "Employee",
      assignee_id: item.assignee_id || "",
    })),
    assignee_ids:
      apiData?.assignee_ids ||
      apiData?.assigneeIds ||
      (apiData?.assignees || []).map((a: any) => a.assignee_id || a.id),
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

  return (
    <EditActualWorkOrderForm
      workOrderId={workOrderId}
      initialData={formData}
      onClose={closeSheet}
      onRefetch={refetch}
    />
  );
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
  onRefetch?: () => Promise<any>;
}) {
  const confirmDialog = useConfirmDialog();

  const { data: priorityOptions } = useGetPriorities();
  const { data: workOrderTypeOptions } = useGetWorkOrderTypes();
  const { data: costCenterOptions } = useGetCostCenters();
  const { data: inventoriesRes } = useGetInventories();
  const inventories = inventoriesRes?.data || [];
  const { data: WorkOrderStatuses } = useGetWorkOrderStatuses();
  const { data: PurchaseOrderOptions } =
    useGetPurchaseOrders<GenericObject[]>();
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

  const partOptions = useMemo(() => {
    return (inventories || []).map((inv: any) => ({
      id: inv.id,
      name: inv.name,
    }));
  }, [inventories]);

  const { mutate: updateWorkOrder } = useUpdateWorkOrder();

  const [maintenanceTasks, setMaintenanceTasks] = useState<
    AddMaintenanceInWorkOrderInterface[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<AddMaintenanceInWorkOrderInterface | null>(null);
  const [selectedMaintenanceParts, setSelectedMaintenanceParts] = useState<
    any[]
  >([]);
  const [selectedMaintenanceLabor, setSelectedMaintenanceLabor] = useState<
    any[]
  >([]);
  const [editingLaborId, setEditingLaborId] = useState<string | null>(null);
  const [editingLaborData, setEditingLaborData] =
    useState<AddLaborUsedInterface | null>(null);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editingPartData, setEditingPartData] =
    useState<AddPartUsedInterface | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteData, setEditingNoteData] = useState<any | null>(null);

  const { mutate: addLabor } = useAddWorkOrderUnitLabor();
  const { mutate: deleteLabor } = useDeleteWorkOrderUnitLabor();
  const { mutate: updateLabor } = useUpdateWorkOrderUnitLabor();
  const { mutate: addPart } = useAddWorkOrderUnitPart();
  const { mutate: updatePart } = useUpdateWorkOrderUnitPart();
  const { mutate: deletePart } = useDeleteWorkOrderUnitPart();
  const { mutate: addNote } = useAddWorkOrderUnitNote();
  const { mutate: updateNote } = useUpdateWorkOrderUnitNote();
  const { mutate: deleteNote } = useDeleteWorkOrderUnitNote();

  const [isMaintenanceSheetOpen, setIsMaintenanceSheetOpen] = useState(false);
  const [isAddLaborSheetOpen, setIsAddLaborSheetOpen] = useState(false);
  const [isAddPartSheetOpen, setIsAddPartSheetOpen] = useState(false);
  const [isAddNoteSheetOpen, setIsAddNoteSheetOpen] = useState(false);
  const [isAddUnitSheetOpen, setIsAddUnitSheetOpen] = useState(false);
  const [status, setStatus] = useState<string>("Open");
  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">(
    "Employee"
  );
  const [units, setUnits] = useState<any[]>([]);

  // Financial State
  const [subtotal, setSubtotal] = useState<number | string>(0);
  const [isDiscount, setIsDiscount] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<"Percent" | "Fixed">(
    "Fixed"
  );
  const [discountAmount, setDiscountAmount] = useState<number | string>(0);
  const [taxOne, setTaxOne] = useState<number | string>(0);
  const [taxTwo, setTaxTwo] = useState<number | string>(0);
  const [total, setTotal] = useState<number | string>(0);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Work order update loader state
  const [isWorkOrderUpdating, setIsWorkOrderUpdating] =
    useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingFormData, setPendingFormData] = useState<z.infer<
    typeof CreateWorkOrderSchema
  > | null>(null);

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
  const { mutate: updateMaintenance } = useUpdateWorkOrderUnitMaintenance();
  const { mutate: deleteMaintenance } = useDeleteWorkOrderUnitMaintenance();

  function handleAddMaintenanceTask(task: AddMaintenanceInWorkOrderInterface) {
    const unitId = workOrderForm.getValues("equipment_id");
    const units = workOrderForm.getValues("units");

    // console.log("handleAddMaintenanceTask - equipment_id:", unitId);
    // console.log("handleAddMaintenanceTask - units array:", units);
    // console.log("DEBUG: handleAddMaintenanceTask - selectedMaintenance:", selectedMaintenance);
    // console.log("DEBUG: handleAddMaintenanceTask - incoming task:", task);

    if (!unitId) {
      toast.error("Please select a unit first.");
      return;
    }

    const effectiveWorkOrderId = workOrderId || (data as any)?.id;

    // Construct the maintenance task object for local state update
    const maintenanceTaskForState = {
      ...task,
      unit_id: unitId,
      work_order_id: effectiveWorkOrderId,
      // Ensure numeric values for calculations
      parts_cost: Number(task.parts_cost || 0),
      labor_cost: Number(task.labor_cost || 0),
      total: Number(task.total || 0),
      // We might need an ID.
      // Ideally the API returns it. We'll handle it in onSuccess.
    };

    // Derived Id
    const maintenanceId =
      selectedMaintenance?.id || (selectedMaintenance as any)?.maintenance_id;

    if (maintenanceId) {
      // Edit Mode
      const updatePayload = {
        id: maintenanceId,
        unit_id: unitId,
        work_order_id: effectiveWorkOrderId,
        ...payload.maintenance[0], // Extract the single maintenance object
        parts: payload.maintenance[0].parts,
        labor: payload.maintenance[0].labor,
      };

      updateMaintenance(updatePayload, {
        onSuccess: (responseData: any) => {
          toast.success("Maintenance task updated successfully");

          // Manual State Sync
          const updatedTask = {
            ...maintenanceTaskForState,
            id: maintenanceId, // Ensure ID is preserved
            maintenance_id: maintenanceId,
            complete: selectedMaintenance?.complete || false, // Preserve status
          };

          // 1. Update Units Array (for UI List)
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (
              u.id === unitId ||
              u.unit_id === unitId ||
              (u.id && u.id === unitId)
            ) {
              // Robust ID check
              const currentMaintenance = u.maintenance || [];
              return {
                ...u,
                maintenance: currentMaintenance.map((m: any) =>
                  m.id === maintenanceId || m.maintenance_id === maintenanceId
                    ? updatedTask
                    : m
                ),
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // 2. Update Maintenance Array (for Calculations)
          const currentMaintenanceList =
            workOrderForm.getValues("maintenance") || [];
          const updatedMaintenanceList = currentMaintenanceList.map((m: any) =>
            m.id === maintenanceId || m.maintenance_id === maintenanceId
              ? updatedTask
              : m
          );
          workOrderForm.setValue("maintenance", updatedMaintenanceList);

          setSelectedMaintenance(null);
          setIsMaintenanceSheetOpen(false);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Failed to update maintenance task"
          );
          console.error(error);
        },
      });
    } else {
      // Create Mode
      addMaintenance(payload, {
        onSuccess: (responseData: any) => {
          toast.success("Maintenance task added successfully");

          // The API response likely contains the created ID.
          // If responseData is the object, use its ID.
          // Fallback to a temp ID if needed, but risky for updates.
          const newId = responseData?.id || responseData?.data?.id;

          const newTask = {
            ...maintenanceTaskForState,
            id: newId,
            maintenance_id: newId,
            complete: false,
          };

          // 1. Update Units Array
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              return {
                ...u,
                maintenance: [...(u.maintenance || []), newTask],
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // 2. Update Maintenance Array
          const currentMaintenanceList =
            workOrderForm.getValues("maintenance") || [];
          workOrderForm.setValue("maintenance", [
            ...currentMaintenanceList,
            newTask,
          ]);

          setMaintenanceTasks((prev) => [
            ...prev,
            { ...task, complete: false },
          ]);
          setSelectedMaintenance(null);
          setIsMaintenanceSheetOpen(false);

          triggerWorkOrderUpdate();
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

    console.log("DEBUG: handleAddLabor called", {
      labor,
      unitId,
      editingLaborId,
    });

    if (!unitId) {
      console.log("DEBUG: No unitId selected");
      toast.error("Please select a unit first.");
      return;
    }

    const payload = {
      unit_id: unitId,
      work_order_id: workOrderId,
      labor: [labor],
    };

    // Construct labor object for local state
    const laborForState = {
      ...labor,
      unit_id: unitId,
      work_order_id: workOrderId,
      total_cost: Number(labor.total_cost || 0),
      labor_rate: Number(labor.labor_rate || 0),
      hours: Number(labor.hours || 0),
    };

    if (editingLaborId) {
      // Edit mode: Use Update API
      const updatePayload = {
        id: editingLaborId,
        unit_id: unitId,
        work_order_id: workOrderId,
        ...labor,
      };

      updateLabor(updatePayload, {
        onSuccess: (responseData: any) => {
          toast.success("Labor updated successfully");

          // Manual State Sync
          const updatedLabor = {
            ...laborForState,
            id: editingLaborId,
          };

          // Update Units Array (labors within unit)
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              const currentLabors = u.labors || [];
              return {
                ...u,
                labors: currentLabors.map((l: any) =>
                  l.id === editingLaborId ? updatedLabor : l
                ),
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // Update Labor Global Array (for calculations)
          const currentLaborList = workOrderForm.getValues("labor") || [];
          const updatedLaborList = currentLaborList.map((l: any) =>
            l.id === editingLaborId ? updatedLabor : l
          );
          workOrderForm.setValue("labor", updatedLaborList);

          setIsAddLaborSheetOpen(false);
          setEditingLaborId(null);
          setEditingLaborData(null);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update labor"
          );
          console.error(error);
        },
      });
    } else {
      // Create mode
      addLabor(payload, {
        onSuccess: (responseData: any) => {
          toast.success("Labor added successfully");

          const newId = responseData?.id || responseData?.data?.id;
          const newLabor = {
            ...laborForState,
            id: newId,
          };

          // Update Units Array
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              return {
                ...u,
                labors: [...(u.labors || []), newLabor],
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // Update Labor Global Array
          const currentLaborList = workOrderForm.getValues("labor") || [];
          workOrderForm.setValue("labor", [...currentLaborList, newLabor]);

          setIsAddLaborSheetOpen(false);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add labor");
          console.error(error);
        },
      });
    }
  };

  const handleDeleteLabor = (id: string, index: number) => {
    const unitId = workOrderForm.getValues("equipment_id");

    if (!id) {
      // Fallback for local-only items
      const currentLabor = workOrderForm.getValues("labor") || [];
      const updatedLabor = currentLabor.filter(
        (_: any, i: number) => i !== index
      );
      workOrderForm.setValue("labor", updatedLabor);
      return;
    }

    if (confirm("Are you sure you want to delete this labor entry?")) {
      deleteLabor(
        { id, work_order_id: workOrderId },
        {
          onSuccess: () => {
            toast.success("Labor deleted successfully");

            // Manual State Sync - Remove from Units
            const currentUnits = workOrderForm.getValues("units") || [];
            const updatedUnits = currentUnits.map((u: any) => {
              if (u.labors?.some((l: any) => l.id === id)) {
                return {
                  ...u,
                  labors: u.labors.filter((l: any) => l.id !== id),
                };
              }
              return u;
            });
            workOrderForm.setValue("units", updatedUnits);

            // Manual State Sync - Remove from Labor Global Array
            const currentLaborList = workOrderForm.getValues("labor") || [];
            const updatedLaborList = currentLaborList.filter(
              (l: any) => l.id !== id
            );
            workOrderForm.setValue("labor", updatedLaborList);

            triggerWorkOrderUpdate();
          },
          onError: (error) => {
            toast.error("Failed to delete labor");
            console.error(error);
          },
        }
      );
    }
  };

  async function handleAddPart(partData: AddPartUsedInterface) {
    const unitId = workOrderForm.getValues("equipment_id");
    if (!unitId) {
      toast.error("Please select a unit first.");
      return;
    }

    // Construct part object for local state
    const partForState = {
      ...partData,
      unit_id: unitId,
      work_order_id: workOrderId,
      quantity: Number(partData.quantity || 0),
      unit_cost: Number(partData.unit_cost || 0),
      extended_cost:
        Number(partData.extended_cost || 0) ||
        Number(partData.quantity || 0) * Number(partData.unit_cost || 0),
    };

    if (editingPartId) {
      // Edit mode: Use Update API
      const updatePayload = {
        id: editingPartId,
        unit_id: unitId,
        work_order_id: workOrderId,
        ...partData,
      };

      updatePart(updatePayload, {
        onSuccess: (responseData: any) => {
          toast.success("Part updated successfully");

          // Manual State Sync
          const updatedPart = {
            ...partForState,
            id: editingPartId,
          };

          // Update Units Array (parts within unit)
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              const currentParts = u.parts || [];
              return {
                ...u,
                parts: currentParts.map((p: any) =>
                  p.id === editingPartId ? updatedPart : p
                ),
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // Update Parts Global Array (for calculations)
          const currentPartsList = workOrderForm.getValues("parts") || [];
          const updatedPartsList = currentPartsList.map((p: any) =>
            p.id === editingPartId ? updatedPart : p
          );
          workOrderForm.setValue("parts", updatedPartsList);

          setIsAddPartSheetOpen(false);
          setEditingPartId(null);
          setEditingPartData(null);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update part"
          );
          console.error(error);
        },
      });
    } else {
      // Create mode
      const payload = {
        unit_id: unitId,
        work_order_id: workOrderId,
        parts: [partData],
      };

      addPart(payload, {
        onSuccess: (responseData: any) => {
          toast.success("Part added successfully");

          const newId = responseData?.id || responseData?.data?.id;
          const newPart = {
            ...partForState,
            id: newId,
          };

          // Update Units Array
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              return {
                ...u,
                parts: [...(u.parts || []), newPart],
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // Update Parts Global Array
          const currentPartsList = workOrderForm.getValues("parts") || [];
          workOrderForm.setValue("parts", [...currentPartsList, newPart]);

          setIsAddPartSheetOpen(false);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add part");
          console.error(error);
        },
      });
    }
  }

  const handleDeletePart = (id: string, index: number) => {
    if (!id) {
      const currentParts = workOrderForm.getValues("parts") || [];
      const updatedParts = currentParts.filter(
        (_: any, i: number) => i !== index
      );
      workOrderForm.setValue("parts", updatedParts);
      return;
    }

    if (confirm("Are you sure you want to delete this part?")) {
      deletePart(
        { id, work_order_id: workOrderId },
        {
          onSuccess: () => {
            toast.success("Part deleted successfully");

            // Manual State Sync - Remove from Units
            const currentUnits = workOrderForm.getValues("units") || [];
            const updatedUnits = currentUnits.map((u: any) => {
              if (u.parts?.some((p: any) => p.id === id)) {
                return {
                  ...u,
                  parts: u.parts.filter((p: any) => p.id !== id),
                };
              }
              return u;
            });
            workOrderForm.setValue("units", updatedUnits);

            // Manual State Sync - Remove from Parts Global Array
            const currentPartsList = workOrderForm.getValues("parts") || [];
            const updatedPartsList = currentPartsList.filter(
              (p: any) => p.id !== id
            );
            workOrderForm.setValue("parts", updatedPartsList);

            triggerWorkOrderUpdate();
          },
          onError: (error) => {
            toast.error("Failed to delete part");
            console.error(error);
          },
        }
      );
    }
  };

  // Note handlers
  async function handleAddNote(noteData: any) {
    const unitId = workOrderForm.getValues("equipment_id");
    if (!unitId) {
      toast.error("Please select a unit first.");
      return;
    }

    // Construct note object for local state
    const noteForState = {
      ...noteData,
      unit_id: unitId,
      work_order_id: workOrderId,
    };

    if (editingNoteId) {
      // Edit mode: Use Update API
      const updatePayload = {
        id: editingNoteId,
        unit_id: unitId,
        work_order_id: workOrderId,
        ...noteData,
      };

      updateNote(updatePayload, {
        onSuccess: (responseData: any) => {
          toast.success("Note updated successfully");

          // Manual State Sync
          const updatedNote = {
            ...noteForState,
            id: editingNoteId,
          };

          // Update Units Array (notes within unit)
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              const currentNotes = u.notes || [];
              return {
                ...u,
                notes: currentNotes.map((n: any) =>
                  n.id === editingNoteId ? updatedNote : n
                ),
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // Update Notes Global Array
          const currentNotesList = workOrderForm.getValues("notes") || [];
          const updatedNotesList = currentNotesList.map((n: any) =>
            n.id === editingNoteId ? updatedNote : n
          );
          workOrderForm.setValue("notes", updatedNotesList);

          setIsAddNoteSheetOpen(false);
          setEditingNoteId(null);
          setEditingNoteData(null);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update note"
          );
          console.error(error);
        },
      });
    } else {
      // Create mode
      const payload = {
        unit_id: unitId,
        work_order_id: workOrderId,
        notes: [noteData],
      };

      addNote(payload, {
        onSuccess: (responseData: any) => {
          toast.success("Note added successfully");

          const newId = responseData?.id || responseData?.data?.id;
          const newNote = {
            ...noteForState,
            id: newId,
          };

          // Update Units Array
          const currentUnits = workOrderForm.getValues("units") || [];
          const updatedUnits = currentUnits.map((u: any) => {
            if (u.id === unitId || u.unit_id === unitId) {
              return {
                ...u,
                notes: [...(u.notes || []), newNote],
              };
            }
            return u;
          });
          workOrderForm.setValue("units", updatedUnits);

          // Update Notes Global Array
          const currentNotesList = workOrderForm.getValues("notes") || [];
          workOrderForm.setValue("notes", [...currentNotesList, newNote]);

          setIsAddNoteSheetOpen(false);
          triggerWorkOrderUpdate();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add note");
          console.error(error);
        },
      });
    }
  }

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(
        { id, work_order_id: workOrderId },
        {
          onSuccess: () => {
            toast.success("Note deleted successfully");

            // Manual State Sync - Remove from Units
            const currentUnits = workOrderForm.getValues("units") || [];
            const updatedUnits = currentUnits.map((u: any) => {
              if (u.notes?.some((n: any) => n.id === id)) {
                return {
                  ...u,
                  notes: u.notes.filter((n: any) => n.id !== id),
                };
              }
              return u;
            });
            workOrderForm.setValue("units", updatedUnits);

            // Manual State Sync - Remove from Notes Global Array
            const currentNotesList = workOrderForm.getValues("notes") || [];
            const updatedNotesList = currentNotesList.filter(
              (n: any) => n.id !== id
            );
            workOrderForm.setValue("notes", updatedNotesList);

            triggerWorkOrderUpdate();
          },
          onError: (error) => {
            toast.error("Failed to delete note");
            console.error(error);
          },
        }
      );
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
      console.log(
        "Form initialized with equipment_id:",
        initialData.equipment_id
      );
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
      if (initialData.is_discount !== undefined)
        setIsDiscount(initialData.is_discount);
      if (initialData.discount_type !== undefined)
        setDiscountType(initialData.discount_type as "Percent" | "Fixed");
      if (initialData.discount_amount !== undefined)
        setDiscountAmount(initialData.discount_amount);
      if (initialData.tax_one !== undefined) setTaxOne(initialData.tax_one);
      if (initialData.tax_two !== undefined) setTaxTwo(initialData.tax_two);
      if (initialData.total !== undefined) setTotal(initialData.total);
      if (initialData.is_calculated !== undefined)
        setIsCalculated(initialData.is_calculated);

      // Handle Status State for UI highlighting
      if (initialData.status_id && WorkOrderStatuses) {
        const foundStatus = (WorkOrderStatuses as GenericObject[]).find(
          (s) => s.id === initialData.status_id
        );
        if (foundStatus) {
          setStatus(foundStatus.name as string);
        }
      }
    }
  }, [initialData, workOrderForm, WorkOrderStatuses]);

  // Watch for equipment selection changes
  const selectedEquipmentId = workOrderForm.watch("equipment_id");
  const [initialEquipmentId, setInitialEquipmentId] = useState<
    string | undefined
  >(initialData?.equipment_id);

  useEffect(() => {
    // If initial data loads later, update the ref
    if (initialData?.equipment_id && !initialEquipmentId) {
      setInitialEquipmentId(initialData.equipment_id);
    }
  }, [initialData, initialEquipmentId]);

  useEffect(() => {
    if (selectedEquipmentId && selectedEquipmentId !== initialEquipmentId) {
      // Don't auto-open unit dialog if another dialog is already open
      if (
        isAddNoteSheetOpen ||
        isAddLaborSheetOpen ||
        isAddPartSheetOpen ||
        isMaintenanceSheetOpen
      ) {
        return;
      }
      // Wait a bit as requested ("wait a while")
      const timer = setTimeout(() => {
        setIsAddUnitSheetOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    selectedEquipmentId,
    initialEquipmentId,
    isAddNoteSheetOpen,
    isAddLaborSheetOpen,
    isAddPartSheetOpen,
    isMaintenanceSheetOpen,
  ]);

  // Calculate tax amounts to sync with form state
  const taxOneRate = workOrderForm.watch("tax_one");
  const taxTwoRate = workOrderForm.watch("tax_two");
  const subTotalValue = workOrderForm.watch("subtotal");
  const isDiscountValue = workOrderForm.watch("is_discount");
  const discountTypeValue = workOrderForm.watch("discount_type");
  const discountAmountValue = workOrderForm.watch("discount_amount");

  useEffect(() => {
    const sub = Number(subTotalValue) || 0;
    let dAmt = 0;
    if (isDiscountValue) {
      if (discountTypeValue === "Percent")
        dAmt = sub * ((Number(discountAmountValue) || 0) / 100);
      else dAmt = Number(discountAmountValue) || 0;
    }
    const taxable = Math.max(0, sub - dAmt);

    // Tax rates are entered as whole numbers (e.g., 15 for 15%), so divide by 100
    const t1Amount = taxable * ((Number(taxOneRate) || 0) / 100);
    const t2Amount = taxable * ((Number(taxTwoRate) || 0) / 100);

    // Use setValue with shouldValidate: true if needed, but here simple set is fine as schema allows nulls
    workOrderForm.setValue("tax_one_amount", Number(t1Amount.toFixed(2)));
    workOrderForm.setValue("tax_two_amount", Number(t2Amount.toFixed(2)));
  }, [
    taxOneRate,
    taxTwoRate,
    subTotalValue,
    isDiscountValue,
    discountTypeValue,
    discountAmountValue,
    workOrderForm,
  ]);

  async function performWorkOrderUpdate(
    data: z.infer<typeof CreateWorkOrderSchema>
  ) {
    const targetId = workOrderId || (initialData as any)?.id;
    if (!targetId) {
      toast.error("Cannot update: Missing Work Order ID");
      return;
    }

    // Transform assignee_ids to assignees object array, preserving existing IDs
    const currentAssignees = data.assignees || [];
    const assignees = (data.assignee_ids || []).map((id) => {
      const existingAssignee = currentAssignees.find(
        (a) => a.assignee_id === id
      );
      return {
        ...(existingAssignee?.id && { id: existingAssignee.id }),
        assignee_type: assigneeType,
        assignee_id: id,
      };
    });

    // Create payload with assignees
    const payload = {
      ...data,
      id: targetId,
      assignees: assignees,
    };

    updateWorkOrder(payload, {
      onSuccess: () => {
        setIsWorkOrderUpdating(false);
        toast.success("Work Order updated successfully!");
        if (onRefetch) onRefetch();
        // Sheet stays open after update
      },
      onError: (error: any) => {
        setIsWorkOrderUpdating(false);
        toast.error(
          error?.response?.data?.message || "Failed to update Work Order"
        );
        console.error("Update Error:", error);
      },
    });
  }

  function handleSubmit(data: z.infer<typeof CreateWorkOrderSchema>) {
    // Show confirmation dialog and store pending data
    setPendingFormData(data);
    setShowConfirmDialog(true);
  }

  function handleConfirmUpdate() {
    if (pendingFormData) {
      performWorkOrderUpdate(pendingFormData);
      setShowConfirmDialog(false);
      setPendingFormData(null);
    }
  }

  function handleCancelUpdate() {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  }

  /**
   * Triggers work order update with a 2000ms delay.
   * Shows a full-screen loader during the delay to allow
   * derived state calculations to complete before submitting.
   */
  function triggerWorkOrderUpdate() {
    setIsWorkOrderUpdating(true);
    setTimeout(() => {
      const formData = workOrderForm.getValues();
      performWorkOrderUpdate(formData);
    }, 2000);
  }

  // If used directly (without Sheet wrapper), render just the form

  return (
    <>
      {/* Full-screen loader overlay for work order updates */}
      <WorkOrderUpdateLoader isOpen={isWorkOrderUpdating} />

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
                        onValueChange={(val) =>
                          setAssigneeType(val as "Employee" | "Vendor")
                        }
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
                            showLabel={false}
                            control={workOrderForm.control}
                            name="assignee_ids"
                            label=""
                            options={
                              assigneeType === "Employee"
                                ? transformedEmployeeOptions
                                : transformedVendorOptions
                            }
                            placeholder={`Select ${assigneeType}s`}
                            searchPlaceholder={`Search ${assigneeType}s...`}
                            maxSelections={assigneeType === "Employee" ? 2 : 1}
                          />
                        </div>
                        {assigneeType === "Employee" ? (
                          <EmployeeFormWrapper variant="icon" />
                        ) : (
                          <VendorFormWrapper variant="icon" />
                        )}
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
                      options={convertToOptionList(
                        PurchaseOrderOptions ?? [],
                        "id",
                        "po_number"
                      )}
                    />
                    <ComboboxFieldWrapper
                      control={workOrderForm.control}
                      name="invoice_number"
                      label="Invoice"
                      options={convertToOptionList(
                        InvoiceOptions ?? [],
                        "id",
                        "invoice_number"
                      )}
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
                  {((WorkOrderStatuses || []) as GenericObject[]).map(
                    (stat: GenericObject) => (
                      <button
                        key={stat?.id}
                        type="button"
                        className={`p-3 h-fit rounded-md border text-sm font-medium ${
                          status === (stat?.name as string)
                            ? (stat?.name as string)
                                .toLowerCase()
                                .includes("open")
                              ? "bg-green-500 text-white"
                              : (stat?.name as string)
                                    .toLowerCase()
                                    .includes("progress")
                                ? "bg-blue-500 text-white"
                                : (stat?.name as string)
                                      .toLowerCase()
                                      .includes("hold")
                                  ? "bg-yellow-400 text-white"
                                  : (stat?.name as string)
                                        .toLowerCase()
                                        .includes("complete")
                                    ? "bg-purple-600 text-white"
                                    : (stat?.name as string)
                                          .toLowerCase()
                                          .includes("cancelled")
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
                    )
                  )}
                </div>
              </div>
              <div>
                <div className="flex flex-row justify-between pb-2">
                  {/* Logic for live calculations */}
                  {(() => {
                    const maintenance =
                      workOrderForm.watch("maintenance") || [];
                    const labor = workOrderForm.watch("labor") || [];
                    const parts = workOrderForm.watch("parts") || [];
                    const isDiscount = workOrderForm.watch("is_discount");
                    const discountType = workOrderForm.watch("discount_type");
                    const discountAmount = Number(
                      workOrderForm.watch("discount_amount") || 0
                    );
                    const tax1Rate = Number(
                      workOrderForm.watch("tax_one") || 0
                    );
                    const tax2Rate = Number(
                      workOrderForm.watch("tax_two") || 0
                    );
                    const isCalculated = workOrderForm.watch("is_calculated");

                    // Calculate Subtotal
                    const mTotal = maintenance.reduce(
                      (sum, task) => sum + (Number(task.total) || 0),
                      0
                    );
                    const lTotal = labor
                      .filter((l: any) => !l.maintenance_id)
                      .reduce(
                        (sum, l: any) => sum + (Number(l.total_cost) || 0),
                        0
                      );
                    const pTotal = parts
                      .filter((p: any) => !p.maintenance_id)
                      .reduce(
                        (sum, p: any) =>
                          sum +
                          (Number(p.extended_cost) ||
                            (Number(p.quantity) || 0) *
                              (Number(p.unit_cost) || 0) ||
                            0),
                        0
                      );

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
                        if (discountType === "Percent")
                          dAmt = calculatedSubtotal * (discountAmount / 100);
                        else dAmt = discountAmount;
                      }

                      const taxable = Math.max(0, calculatedSubtotal - dAmt);
                      // Tax rates are entered as whole numbers (e.g., 15 for 15%), so divide by 100
                      const t1 = taxable * (tax1Rate / 100);
                      const t2 = taxable * (tax2Rate / 100);
                      const total = taxable + t1 + t2;

                      workOrderForm.setValue("total", total);
                    }, [
                      calculatedSubtotal,
                      isDiscount,
                      discountType,
                      discountAmount,
                      tax1Rate,
                      tax2Rate,
                      isCalculated,
                      workOrderForm.setValue,
                    ]);

                    return null;
                  })()}
                </div>
                {/* Units Tabs - Show tabs for each unit in the units array */}
                {workOrderForm.watch("units") &&
                (workOrderForm.watch("units") || []).length > 0 ? (
                  <Tabs
                    defaultValue={
                      (workOrderForm.watch("units")?.[0] as any)?.id || "0"
                    }
                    className="w-full mt-4"
                  >
                    <div className="flex items-center gap-2">
                      <TabsList
                        className="grid flex-1"
                        style={{
                          gridTemplateColumns: `repeat(${(workOrderForm.watch("units") || []).length}, minmax(0, 1fr))`,
                        }}
                      >
                        {(workOrderForm.watch("units") || []).map(
                          (unit: any, index: number) => {
                            const equipmentName =
                              equipmentOptions?.find(
                                (e) => e.id === unit.unit_id
                              )?.name || `Unit ${index + 1}`;
                            return (
                              <TabsTrigger
                                key={unit.id || index}
                                value={unit.id || index.toString()}
                              >
                                {equipmentName}
                              </TabsTrigger>
                            );
                          }
                        )}
                      </TabsList>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddUnitSheetOpen(true)}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Unit
                      </Button>
                    </div>

                    {/* Content for each unit */}
                    {(workOrderForm.watch("units") || []).map(
                      (unit: any, unitIndex: number) => (
                        <TabsContent
                          key={unit.id || unitIndex}
                          value={unit.id || unitIndex.toString()}
                        >
                          <div className="mb-2 text-sm text-muted-foreground">
                            Hours: {unit.hours || 0}
                          </div>

                          {/* Nested tabs for Maintenance, Labor, Parts, Notes within each unit */}
                          <Tabs defaultValue="maintenance" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="maintenance">
                                Maintenance
                              </TabsTrigger>
                              <TabsTrigger value="labor">Labor</TabsTrigger>
                              <TabsTrigger value="parts">Parts</TabsTrigger>
                              <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="maintenance" className="mt-2">
                              <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold text-lg">
                                  Maintenance List
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Set the current unit context for adding maintenance
                                    workOrderForm.setValue(
                                      "equipment_id",
                                      unit.id
                                    );
                                    setSelectedMaintenance(null);
                                    setIsMaintenanceSheetOpen(true);
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Add
                                  Maintenance
                                </Button>
                              </div>

                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Maintenance</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Complete</TableHead>
                                    <TableHead className="w-[100px]">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {((unit.maintenance || []) as any[]).map(
                                    (task, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {task.other_task_name ||
                                            (task.task_id
                                              ? task.task_name
                                              : "Unknown Task")}
                                        </TableCell>
                                        <TableCell>
                                          {workOrderForm.watch("currency")}
                                          {Number(task.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={task.complete}
                                            onChange={() => {}}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              type="button"
                                              variant="secondary"
                                              size="icon"
                                              onClick={() => {
                                                const maintenanceId =
                                                  task.id ||
                                                  task.maintenance_id;
                                                const allParts =
                                                  unit.parts || [];
                                                const allLabor =
                                                  unit.labors || [];

                                                const linkedParts =
                                                  allParts.filter(
                                                    (p: any) =>
                                                      p.maintenance_id ===
                                                      maintenanceId
                                                  );
                                                const linkedLabor =
                                                  allLabor.filter(
                                                    (l: any) =>
                                                      l.maintenance_id ===
                                                      maintenanceId
                                                  );

                                                setSelectedMaintenanceParts(
                                                  linkedParts
                                                );
                                                setSelectedMaintenanceLabor(
                                                  linkedLabor
                                                );
                                                setSelectedMaintenance(task);
                                                workOrderForm.setValue(
                                                  "equipment_id",
                                                  unit.id
                                                );
                                                setIsMaintenanceSheetOpen(true);
                                              }}
                                            >
                                              <FilePenIcon className="size-4" />
                                            </Button>
                                            <Button
                                              type="button"
                                              variant="secondary"
                                              size="icon"
                                              className="text-destructive focus:text-destructive"
                                              onClick={() => {
                                                if (task.id) {
                                                  if (
                                                    confirm(
                                                      "Are you sure you want to delete this maintenance task?"
                                                    )
                                                  ) {
                                                    deleteMaintenance(
                                                      { id: task.id },
                                                      {
                                                        onSuccess: async () => {
                                                          toast.success(
                                                            "Maintenance task deleted successfully"
                                                          );

                                                          // Manual State Sync - Remove from Units
                                                          const currentUnits =
                                                            workOrderForm.getValues(
                                                              "units"
                                                            ) || [];
                                                          const updatedUnits =
                                                            currentUnits.map(
                                                              (u: any) => {
                                                                if (
                                                                  u.maintenance?.some(
                                                                    (m: any) =>
                                                                      m.id ===
                                                                        task.id ||
                                                                      m.maintenance_id ===
                                                                        task.id
                                                                  )
                                                                ) {
                                                                  return {
                                                                    ...u,
                                                                    maintenance:
                                                                      u.maintenance.filter(
                                                                        (
                                                                          m: any
                                                                        ) =>
                                                                          m.id !==
                                                                            task.id &&
                                                                          m.maintenance_id !==
                                                                            task.id
                                                                      ),
                                                                  };
                                                                }
                                                                return u;
                                                              }
                                                            );
                                                          workOrderForm.setValue(
                                                            "units",
                                                            updatedUnits
                                                          );

                                                          // Manual State Sync - Remove from Maintenance Global Array
                                                          const currentMaintenanceList =
                                                            workOrderForm.getValues(
                                                              "maintenance"
                                                            ) || [];
                                                          const updatedMaintenanceList =
                                                            currentMaintenanceList.filter(
                                                              (m: any) =>
                                                                m.id !==
                                                                  task.id &&
                                                                m.maintenance_id !==
                                                                  task.id
                                                            );
                                                          workOrderForm.setValue(
                                                            "maintenance",
                                                            updatedMaintenanceList
                                                          );

                                                          triggerWorkOrderUpdate();
                                                        },
                                                        onError: (error) => {
                                                          toast.error(
                                                            "Failed to delete maintenance task"
                                                          );
                                                          console.error(error);
                                                        },
                                                      }
                                                    );
                                                  }
                                                }
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                                <TableFooter>
                                  <TableRow>
                                    <TableCell className="text-right font-bold">
                                      Total
                                    </TableCell>
                                    <TableCell className="font-bold">
                                      {workOrderForm.watch("currency")}
                                      {((unit.maintenance || []) as any[])
                                        .reduce(
                                          (sum, task) =>
                                            sum + (Number(task.total) || 0),
                                          0
                                        )
                                        .toFixed(2)}
                                    </TableCell>
                                    <TableCell colSpan={2}></TableCell>
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            </TabsContent>

                            <TabsContent value="labor" className="mt-2">
                              <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold text-lg">
                                  Standalone Labor
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    workOrderForm.setValue(
                                      "equipment_id",
                                      unit.id
                                    );
                                    setEditingLaborId(null);
                                    setEditingLaborData(null);
                                    setSelectedMaintenance(null);
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
                                    <TableHead className="w-[100px]">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {((unit.labors || []) as any[]).filter(
                                    (l: any) => !l.maintenance_id
                                  ).length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                      >
                                        No standalone labor added.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ((unit.labors || []) as any[]).map(
                                      (laborItem, index) => {
                                        if (laborItem.maintenance_id)
                                          return null;

                                        const technicianId =
                                          laborItem.technician_id;
                                        const employee = employeeOptions?.find(
                                          (e) => e.id === technicianId
                                        );
                                        const vendor = vendorOptions?.find(
                                          (v) => v.id === technicianId
                                        );

                                        let technicianName = "Unknown";
                                        if (employee) {
                                          technicianName =
                                            `${(employee as any).last_name || ""}, ${(employee as any).first_name || ""}`
                                              .trim()
                                              .replace(/^, /, "")
                                              .replace(/,$/, "");
                                        } else if (vendor) {
                                          technicianName =
                                            vendor.name || "Vendor";
                                        }

                                        return (
                                          <TableRow key={index}>
                                            <TableCell>
                                              {technicianName}
                                            </TableCell>
                                            <TableCell>
                                              {laborItem.work_performed || "-"}
                                            </TableCell>
                                            <TableCell>
                                              {workOrderForm.watch("currency")}
                                              {Number(
                                                laborItem.labor_rate
                                              ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                              {laborItem.hours}
                                            </TableCell>
                                            <TableCell>
                                              {workOrderForm.watch("currency")}
                                              {Number(
                                                laborItem.total_cost
                                              ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  onClick={() => {
                                                    setEditingLaborId(
                                                      (laborItem as any).id
                                                    );
                                                    setEditingLaborData(
                                                      laborItem
                                                    );
                                                    setSelectedMaintenance(
                                                      null
                                                    );
                                                    setIsAddLaborSheetOpen(
                                                      true
                                                    );
                                                  }}
                                                >
                                                  <FilePenIcon className="size-4" />
                                                </Button>
                                                <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  className="text-destructive focus:text-destructive"
                                                  onClick={() => {
                                                    if ((laborItem as any).id) {
                                                      if (
                                                        confirm(
                                                          "Are you sure you want to delete this labor entry?"
                                                        )
                                                      ) {
                                                        deleteLabor(
                                                          {
                                                            id: (
                                                              laborItem as any
                                                            ).id,
                                                          },
                                                          {
                                                            onSuccess: () => {
                                                              toast.success(
                                                                "Labor entry deleted successfully"
                                                              );
                                                            },
                                                            onError: (
                                                              error
                                                            ) => {
                                                              toast.error(
                                                                "Failed to delete labor entry"
                                                              );
                                                              console.error(
                                                                error
                                                              );
                                                            },
                                                          }
                                                        );
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )
                                  )}
                                </TableBody>
                                <TableFooter>
                                  <TableRow>
                                    <TableCell
                                      colSpan={4}
                                      className="text-right font-bold"
                                    >
                                      Total
                                    </TableCell>
                                    <TableCell className="font-bold">
                                      {workOrderForm.watch("currency")}
                                      {((unit.labors || []) as any[])
                                        .filter((l: any) => !l.maintenance_id)
                                        .reduce(
                                          (sum, l: any) =>
                                            sum + (Number(l.total_cost) || 0),
                                          0
                                        )
                                        .toFixed(2)}
                                    </TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            </TabsContent>

                            <TabsContent value="parts" className="mt-2">
                              <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold text-lg">
                                  Standalone Parts
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    workOrderForm.setValue(
                                      "equipment_id",
                                      unit.id
                                    );
                                    setSelectedMaintenance(null);
                                    setIsAddPartSheetOpen(true);
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Add Part
                                </Button>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Part</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit Cost</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead className="w-[100px]">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {((unit.parts || []) as any[]).filter(
                                    (p: any) => !p.maintenance_id
                                  ).length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                      >
                                        No standalone parts added.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ((unit.parts || []) as any[]).map(
                                      (partItem, index) => {
                                        if (partItem.maintenance_id)
                                          return null;

                                        const partId = partItem.part_id;
                                        const partOption = partOptions?.find(
                                          (p) => p.id === partId
                                        );
                                        const partName = partOption
                                          ? partOption.name
                                          : "Unknown Part";

                                        return (
                                          <TableRow key={index}>
                                            <TableCell>{partName}</TableCell>
                                            <TableCell>
                                              {partItem.quantity}
                                            </TableCell>
                                            <TableCell>
                                              {workOrderForm.watch("currency")}
                                              {Number(
                                                partItem.unit_cost
                                              ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                              {workOrderForm.watch("currency")}
                                              {Number(
                                                partItem.extended_cost
                                              ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  onClick={() => {
                                                    setEditingPartId(
                                                      (partItem as any).id
                                                    );
                                                    setEditingPartData(
                                                      partItem
                                                    );
                                                    setSelectedMaintenance(
                                                      null
                                                    );
                                                    workOrderForm.setValue(
                                                      "equipment_id",
                                                      unit.id
                                                    );
                                                    setIsAddPartSheetOpen(true);
                                                  }}
                                                >
                                                  <FilePenIcon className="size-4" />
                                                </Button>
                                                <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  className="text-destructive focus:text-destructive"
                                                  onClick={() =>
                                                    handleDeletePart(
                                                      (partItem as any).id,
                                                      index
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )
                                  )}
                                </TableBody>
                                <TableFooter>
                                  <TableRow>
                                    <TableCell
                                      colSpan={4}
                                      className="text-right font-bold"
                                    >
                                      Total
                                    </TableCell>
                                    <TableCell className="font-bold">
                                      {workOrderForm.watch("currency")}
                                      {((unit.parts || []) as any[])
                                        .filter((p: any) => !p.maintenance_id)
                                        .reduce(
                                          (sum, p: any) =>
                                            sum +
                                            (Number(p.extended_cost) ||
                                              (Number(p.quantity) || 0) *
                                                (Number(p.unit_cost) || 0) ||
                                              0),
                                          0
                                        )
                                        .toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            </TabsContent>

                            <TabsContent value="notes" className="mt-2">
                              <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold text-lg">
                                  Notes
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    workOrderForm.setValue(
                                      "equipment_id",
                                      unit.id
                                    );
                                    setEditingNoteId(null);
                                    setEditingNoteData(null);
                                    setIsAddNoteSheetOpen(true);
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Add Note
                                </Button>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead className="w-[100px]">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {((unit.notes || []) as any[]).length ===
                                  0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                      >
                                        No notes added.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ((unit.notes || []) as any[]).map(
                                      (noteItem, index) => {
                                        // Format date
                                        const formattedDate = noteItem.date
                                          ? new Date(
                                              noteItem.date
                                            ).toLocaleDateString()
                                          : new Date(
                                              noteItem.created_at || Date.now()
                                            ).toLocaleDateString();

                                        return (
                                          <TableRow key={index}>
                                            <TableCell>
                                              {formattedDate}
                                            </TableCell>
                                            <TableCell>
                                              {noteItem.created_by || "Unknown"}
                                            </TableCell>
                                            <TableCell className="max-w-md truncate">
                                              {noteItem.note}
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  onClick={() => {
                                                    setEditingNoteId(
                                                      (noteItem as any).id
                                                    );
                                                    setEditingNoteData(
                                                      noteItem
                                                    );
                                                    workOrderForm.setValue(
                                                      "equipment_id",
                                                      unit.id
                                                    );
                                                    setIsAddNoteSheetOpen(true);
                                                  }}
                                                >
                                                  <FilePenIcon className="size-4" />
                                                </Button>
                                                <Button
                                                  type="button"
                                                  variant="secondary"
                                                  size="icon"
                                                  className="text-destructive focus:text-destructive"
                                                  onClick={() =>
                                                    handleDeleteNote(
                                                      (noteItem as any).id
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TabsContent>
                          </Tabs>
                        </TabsContent>
                      )
                    )}
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-lg bg-gray-50 mt-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-medium">No Unit Selected</h3>
                      <p className="text-sm text-gray-500">
                        There are no maintenance items for this work order yet.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      className="mt-4"
                      onClick={() => setIsAddUnitSheetOpen(true)}
                    >
                      Add your first unit
                    </Button>
                  </div>
                )}

                {/* Financial Summary */}
                {workOrderForm.watch("equipment_id") && (
                  <div className="mt-8 border rounded-lg p-6 bg-muted/10 space-y-4 max-w-2xl ml-auto">
                    <h3 className="font-semibold text-lg mb-4">
                      Financial Summary
                    </h3>

                    {/* Subtotal */}
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold text-lg">
                        {workOrderForm.watch("currency")}
                        {Number(workOrderForm.watch("subtotal") || 0).toFixed(
                          2
                        )}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="flex flex-col gap-4 py-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="discount-switch"
                            className="font-medium"
                          >
                            Discount
                          </Label>
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
                              value={
                                workOrderForm.watch("discount_type") || "Fixed"
                              }
                              onValueChange={(val: "Percent" | "Fixed") =>
                                workOrderForm.setValue("discount_type", val)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Percent"
                                  id="disc-percent"
                                />
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
                                placeholder={
                                  workOrderForm.watch("discount_type") ===
                                  "Percent"
                                    ? "%"
                                    : "Amount"
                                }
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
                              const sub = Number(
                                workOrderForm.watch("subtotal") || 0
                              );
                              const type = workOrderForm.watch("discount_type");
                              const val = Number(
                                workOrderForm.watch("discount_amount") || 0
                              );
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
                            const sub = Number(
                              workOrderForm.watch("subtotal") || 0
                            );
                            const discType =
                              workOrderForm.watch("discount_type");
                            const discVal = Number(
                              workOrderForm.watch("discount_amount") || 0
                            );
                            let dAmt = 0;
                            if (workOrderForm.watch("is_discount")) {
                              if (discType === "Percent")
                                dAmt = sub * (discVal / 100);
                              else dAmt = discVal;
                            }
                            const taxable = Math.max(0, sub - dAmt);
                            return (
                              taxable *
                              ((Number(workOrderForm.watch("tax_one")) || 0) /
                                100)
                            ).toFixed(2);
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
                            const sub = Number(
                              workOrderForm.watch("subtotal") || 0
                            );
                            const discType =
                              workOrderForm.watch("discount_type");
                            const discVal = Number(
                              workOrderForm.watch("discount_amount") || 0
                            );
                            let dAmt = 0;
                            if (workOrderForm.watch("is_discount")) {
                              if (discType === "Percent")
                                dAmt = sub * (discVal / 100);
                              else dAmt = discVal;
                            }
                            const taxable = Math.max(0, sub - dAmt);
                            return (
                              taxable *
                              ((Number(workOrderForm.watch("tax_two")) || 0) /
                                100)
                            ).toFixed(2);
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
          maintenanceId={
            selectedMaintenance?.id ||
            (selectedMaintenance as any)?.maintenance_id
          }
          data={editingLaborData}
        />
        <AddPartUsed
          open={isAddPartSheetOpen}
          setOpen={setIsAddPartSheetOpen}
          onAdd={handleAddPart}
          maintenanceId={
            selectedMaintenance?.id ||
            (selectedMaintenance as any)?.maintenance_id
          }
          data={editingPartData}
        />
        <AddUnitDialog
          open={isAddUnitSheetOpen}
          onOpenChange={setIsAddUnitSheetOpen}
          workOrderId={workOrderId}
          onSuccess={() => {
            // Trigger refetch after successful unit addition
            if (onRefetch) onRefetch();
          }}
        />
        <AddNote
          open={isAddNoteSheetOpen}
          setOpen={setIsAddNoteSheetOpen}
          onAdd={handleAddNote}
          data={editingNoteData}
        />

        {/* Confirmation Dialog for Update Work Order */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-2xl p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-semibold text-foreground leading-relaxed">
                Confirm Work Order Update
              </DialogTitle>
              <DialogDescription className="text-muted-foreground leading-relaxed mt-3">
                Updating the work order will apply all pending changes and
                overwrite existing values if applicable.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleCancelUpdate}
                className="glass-hover"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUpdate}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Yes, Update Work Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Form>
    </>
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
          <EditActualWorkOrderFormContent
            {...props}
            onClose={() => setOpen(false)}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function AddUnitDialog({
  open,
  onOpenChange,
  workOrderId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId?: string;
  onSuccess: () => void;
}) {
  const { mutate: addUnit } = useAddWorkOrderUnit();
  const { data: equipments } = useGetEquipments<GenericObject[]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const equipmentOptions = useMemo(() => {
    return (equipments || []).map((eq: any) => ({
      id: eq.id,
      name: eq.unit_number,
    }));
  }, [equipments]);

  // Schema for the add unit form
  const addUnitSchema = z.object({
    unit_id: z.string().min(1, "Please select a unit"),
    hours: z.coerce.number().positive("Hours must be greater than 0"),
  });

  const addUnitForm = useForm<z.infer<typeof addUnitSchema>>({
    resolver: zodResolver(addUnitSchema),
    defaultValues: {
      unit_id: "",
      hours: 0,
    },
  });

  const handleSubmit = (data: z.infer<typeof addUnitSchema>) => {
    if (!workOrderId) {
      toast.error("Work Order ID is missing");
      return;
    }

    setIsSubmitting(true);
    addUnit(
      { work_order_id: workOrderId, unit_id: data.unit_id, hours: data.hours },
      {
        onSuccess: () => {
          toast.success("Unit added successfully");
          addUnitForm.reset();
          setIsSubmitting(false);
          onOpenChange(false);
          onSuccess();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add unit");
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Unit to Work Order</DialogTitle>
          <DialogDescription>
            Select a unit and enter the hours for this work order.
          </DialogDescription>
        </DialogHeader>
        <Form {...addUnitForm}>
          <form
            onSubmit={addUnitForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <ComboboxFieldWrapper
              control={addUnitForm.control}
              name="unit_id"
              label="Unit"
              options={(equipmentOptions || []) as GenericObject[]}
              required={true}
            />

            <InputWrapper
              control={addUnitForm.control}
              name="hours"
              label="Hours"
              type="number"
              placeholder="Enter hours"
              required={true}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addUnitForm.reset();
                  onOpenChange(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Unit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
