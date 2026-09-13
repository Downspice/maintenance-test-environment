"use client";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Plus } from "lucide-react";
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
import { Separator } from "../ui/separator";
import { ActualEquipmentForm } from "@/components/forms/entities/equipment/new-equipment-form";
import ActualRepairRequestForm from "../forms/entities/repairRequest";

export default function CreateAllButton() {
  const [open, setOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(
    null
  );

  const handleDropdownOptionSelect = (x: string) => {
    console.log("f", x);
    setSelectedProjectType(x);
    setOpen(true);
  };

  const genericDropdown = (x: string) => {
    console.log("did something", x);
    handleDropdownOptionSelect(x);
  };

  const dropdownItems1 = [
    { name: "Equipment", onSelect: genericDropdown },
    { name: "Repair Request", onSelect: genericDropdown },
    { name: "Daily Inspection", onSelect: genericDropdown },
    { name: "Work Order", onSelect: genericDropdown },
    { name: "Expense", onSelect: genericDropdown },
    { name: "Assignment", onSelect: genericDropdown },
    { name: "Accident", onSelect: genericDropdown },
  ];

  const dropdownItems2 = [
    { name: "Part", onSelect: genericDropdown },
    { name: "Purchase Order", onSelect: genericDropdown },
    { name: "Employee", onSelect: genericDropdown },
    { name: "Vendor", onSelect: genericDropdown },
  ];

  const dropdownItems3 = [
    { name: "Receive | Adjust Inventory", onSelect: genericDropdown },
    { name: "Receive Purchase Order", onSelect: genericDropdown },
  ];

  const formComponents: Record<string, React.ReactNode> = {
    Equipment: (
      <ActualEquipmentForm
        formId="new-equipment-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    "Repair Request": (
      <ActualRepairRequestForm
        formId="repair-request-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    "Daily Inspection": (
      <InspectionForm
        formId="new-inspection-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    "Work Order": (
      <ActualWorkOrderForm
        formId="actual-work-order-form"
        hideSubmitButton
      />
    ),
    Expense: (
      <GeneralExpense
        formId="new-general-expense-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    Assignment: (
      <EquipmentAssignment
        formId="assign-equipment-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    Accident: (
      <NewAccident
        formId="new-accident-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    Part: (
      <NewPart
        formId="new-part-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    "Purchase Order": (
      <NewPurchaseOrderForm
        formId="new-purchase-order-form"
        hideSubmitButton
      />
    ),
    Employee: (
      <NewEmployeeForm
        formId="new-employee-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    Vendor: (
      <NewVendor
        formId="new-vendor-form"
        hideSubmitButton
      />
    ),
    "Receive | Adjust Inventory": (
      <AdjustInventoryForm
        data={undefined}
        formId="adjust-inventory-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
    "Receive Purchase Order": (
      <QuickActionsReceivePurchaseOrder
        formId="receive-purchase-order-form"
        hideSubmitButton
        onSuccess={() => setOpen(false)}
      />
    ),
  };

  const renderFormContent = () => {
    const SelectedComponent = formComponents[selectedProjectType || ""];
    console.log("new selected", SelectedComponent);
    return SelectedComponent ? SelectedComponent : null;
  };

  const isFullscreen =
    selectedProjectType === "Purchase Order" ||
    selectedProjectType === "Equipment" ||
    selectedProjectType === "Receive Purchase Order";

  const drawerClassName = isFullscreen
    ? "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus /> Quick Actions
            <span className="sr-only">Create Something</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 rounded-lg"
        >
          <div className="w-full *:p-3 items-end flex justify-between">
            <div className="text-md font-semibold">Create New</div>
          </div>

          {dropdownItems1.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <Separator className="text-gray-900" orientation="horizontal" />
          {dropdownItems2.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <span className="font-bold">Other actions</span>
          <Separator orientation="horizontal" />
          {dropdownItems3.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
