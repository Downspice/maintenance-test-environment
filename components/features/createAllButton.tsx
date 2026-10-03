"use client";
import { Button } from "../ui/button";
import {
  AlertTriangle,
  ArrowLeftRight,
  Briefcase,
  ClipboardCheck,
  Package,
  Plus,
  ShoppingCart,
  Truck,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import {
  SectionedHeaderMenu,
  type HeaderMenuSection,
} from "./header/sectioned-header-menu";
import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import NewEmployeeForm from "../forms/entities/new-employee-form";
import InspectionForm from "../forms/entities/new-inspection";
import NewVendor from "../forms/entities/new-vendor-form";
import NewPurchaseOrderForm from "../forms/entities/new-purchase-order-form";
import GeneralExpense from "../forms/entities/new-general-expense";
import { ActualWorkOrderForm } from "../forms/entities/work-order-form";
import EquipmentAssignment from "../forms/entities/assign-equipment";
import NewAccident from "../forms/entities/new-accident";
import AdjustInventoryForm from "../forms/entities/adjust-inventory-form";
import { ScrollArea } from "../ui/scroll-area";
import QuickActionsReceivePurchaseOrder from "../forms/actions/quick/receive-purchase-order";
import NewPart from "../forms/actions/quick/addPart";
import { ActualEquipmentForm } from "@/components/forms/entities/equipment/new-equipment-form";
import ActualRepairRequestForm from "../forms/entities/repairRequest";

type CreateActionId =
  | "Equipment"
  | "Repair Request"
  | "Daily Inspection"
  | "Work Order"
  | "Expense"
  | "Assignment"
  | "Accident"
  | "Part"
  | "Purchase Order"
  | "Employee"
  | "Vendor"
  | "Receive | Adjust Inventory"
  | "Receive Purchase Order";

const CREATE_MENU_SECTIONS: HeaderMenuSection<CreateActionId>[] = [
  {
    label: "Operations",
    items: [
      { id: "Equipment", label: "Equipment", icon: Truck },
      { id: "Repair Request", label: "Repair request", icon: Wrench },
      { id: "Daily Inspection", label: "Daily inspection", icon: ClipboardCheck },
      { id: "Work Order", label: "Work order", icon: Briefcase },
      { id: "Expense", label: "Expense", icon: ArrowLeftRight },
      { id: "Assignment", label: "Equipment assignment", icon: Users },
      { id: "Accident", label: "Accident report", icon: AlertTriangle },
    ],
  },
  {
    label: "People & purchasing",
    items: [
      { id: "Part", label: "Part / inventory item", icon: Package },
      { id: "Purchase Order", label: "Purchase order", icon: ShoppingCart },
      { id: "Employee", label: "Employee", icon: UserPlus },
      { id: "Vendor", label: "Vendor", icon: Users },
    ],
  },
  {
    label: "Receiving",
    items: [
      {
        id: "Receive | Adjust Inventory",
        label: "Receive or adjust inventory",
        icon: Package,
      },
      {
        id: "Receive Purchase Order",
        label: "Receive purchase order",
        icon: ShoppingCart,
      },
    ],
  },
];

export default function CreateAllButton() {
  const [open, setOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] =
    useState<CreateActionId | null>(null);

  const handleActionSelect = (id: CreateActionId) => {
    setSelectedProjectType(id);
    window.setTimeout(() => setOpen(true), 0);
  };

  const renderFormContent = () => {
    if (!open || !selectedProjectType) return null;
    switch (selectedProjectType) {
      case "Equipment":
        return (
          <ActualEquipmentForm
            formId="new-equipment-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Repair Request":
        return (
          <ActualRepairRequestForm
            formId="repair-request-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Daily Inspection":
        return (
          <InspectionForm
            formId="new-inspection-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Work Order":
        return (
          <ActualWorkOrderForm
            formId="actual-work-order-form"
            hideSubmitButton
          />
        );
      case "Expense":
        return (
          <GeneralExpense
            formId="new-general-expense-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Assignment":
        return (
          <EquipmentAssignment
            formId="assign-equipment-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Accident":
        return (
          <NewAccident
            formId="new-accident-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Part":
        return (
          <NewPart
            formId="new-part-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Purchase Order":
        return (
          <NewPurchaseOrderForm
            formId="new-purchase-order-form"
            hideSubmitButton
          />
        );
      case "Employee":
        return (
          <NewEmployeeForm
            formId="new-employee-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Vendor":
        return (
          <NewVendor
            formId="new-vendor-form"
            hideSubmitButton
          />
        );
      case "Receive | Adjust Inventory":
        return (
          <AdjustInventoryForm
            data={undefined}
            formId="adjust-inventory-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      case "Receive Purchase Order":
        return (
          <QuickActionsReceivePurchaseOrder
            formId="receive-purchase-order-form"
            hideSubmitButton
            onSuccess={() => setOpen(false)}
          />
        );
      default:
        return null;
    }
  };

  const isFullscreen =
    selectedProjectType === "Purchase Order" ||
    selectedProjectType === "Equipment" ||
    selectedProjectType === "Repair Request" ||
    selectedProjectType === "Receive Purchase Order";

  const isWideDrawer = selectedProjectType === "Assignment";

  const drawerClassName = isFullscreen
    ? "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
    : isWideDrawer
      ? "w-full sm:w-[60%] sm:min-w-[800px] sm:max-w-none lg:max-w-none"
      : "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

  const getDrawerTitle = () => {
    if (!selectedProjectType) return "Create Item";
    if (selectedProjectType.startsWith("Receive")) return selectedProjectType;
    return `Create ${selectedProjectType}`;
  };

  const getDrawerDescription = () => {
    if (!selectedProjectType) return "";
    if (selectedProjectType.startsWith("Receive")) {
      return `Fill out the details below to ${selectedProjectType.toLowerCase()}.`;
    }
    return `Fill out the form below to create a new ${selectedProjectType.toLowerCase()}.`;
  };

  const renderSubmitAction = () => {
    switch (selectedProjectType) {
      case "Equipment":
        return (
          <Button form="new-equipment-form" type="submit" variant="primary">
            Save Equipment
          </Button>
        );
      case "Repair Request":
        return (
          <Button form="repair-request-form" type="submit" variant="primary">
            Save Repair Request
          </Button>
        );
      case "Daily Inspection":
        return (
          <Button form="new-inspection-form" type="submit" variant="primary">
            Save Inspection
          </Button>
        );
      case "Work Order":
        return (
          <Button form="actual-work-order-form" type="submit" variant="primary">
            Create Work Order
          </Button>
        );
      case "Expense":
        return (
          <Button form="new-general-expense-form" type="submit" variant="primary">
            Save Expense
          </Button>
        );
      case "Assignment":
        return (
          <Button form="assign-equipment-form" type="submit" variant="primary">
            Save Assignment
          </Button>
        );
      case "Accident":
        return (
          <Button form="new-accident-form" type="submit" variant="primary">
            Save Accident
          </Button>
        );
      case "Part":
        return (
          <Button form="new-part-form" type="submit" variant="primary">
            Save Part
          </Button>
        );
      case "Purchase Order":
        return (
          <Button form="new-purchase-order-form" type="submit" variant="primary">
            Save Purchase Order
          </Button>
        );
      case "Employee":
        return (
          <Button form="new-employee-form" type="submit" variant="primary">
            Save Employee
          </Button>
        );
      case "Vendor":
        return (
          <Button form="new-vendor-form" type="submit" variant="primary">
            Save Vendor
          </Button>
        );
      case "Receive | Adjust Inventory":
        return (
          <Button form="adjust-inventory-form" type="submit" variant="primary">
            Save Adjustment
          </Button>
        );
      case "Receive Purchase Order":
        return (
          <Button form="receive-purchase-order-form" type="submit" variant="primary">
            Receive Purchase Order
          </Button>
        );
      default:
        return undefined;
    }
  };

  return (
    <>
      <SectionedHeaderMenu
        sections={CREATE_MENU_SECTIONS}
        onSelect={handleActionSelect}
        align="start"
        trigger={
          <Button variant="primary" className="gap-2">
            <Plus className="size-4" />
            Quick actions
          </Button>
        }
      />
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title={getDrawerTitle()}
        description={getDrawerDescription()}
        closeable={true}
        renderActions={renderSubmitAction()}
        className={drawerClassName}
      >
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          {renderFormContent() || "nothing else"}
        </ScrollArea>
      </Drawer>
    </>
  );
}
