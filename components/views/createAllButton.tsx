"use client";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import RepairRequestForm from "../forms/actualForms/repair-request-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import NewEmployeeForm from "../forms/actualForms/new-employee-form";
import InspectionForm from "../forms/actualForms/new-inspection";
import NewVendor from "../forms/actualForms/new-vendor-form";
import NewPurchaseOrderForm from "../forms/actualForms/new-purchase-order-form";
import GeneralExpense from "../forms/actualForms/new-general-expense";
import NewWorkOrderForm from "../forms/actualForms/work-order-form";
import EquipmentAssignment from "../forms/actualForms/assign-equipment";
import NewAccident from "../forms/actualForms/new-accident";
import AdjustInventoryForm from "../forms/actualForms/adjust-inventory-form";
import { ScrollArea } from "../ui/scroll-area";
import QuickActionsReceivePurchaseOrder from "../forms/actualForms/quickActions/recievePurchaseOrder";
import NewPart from "../forms/actualForms/quickActions/addPart";

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

  const dropdownItems = [
    { label: "Repair Request", onSelect: genericDropdown },
    { label: "Daily Inspection", onSelect: genericDropdown },
    { label: "Work Order", onSelect: genericDropdown },
    { label: "Expense", onSelect: genericDropdown },
    { label: "Assignment", onSelect: genericDropdown },
    { label: "Accident", onSelect: genericDropdown },
    { label: "Part", onSelect: genericDropdown },
    { label: "Purchase Order", onSelect: genericDropdown },
    { label: "Employee", onSelect: genericDropdown },
    { label: "Vendor", onSelect: genericDropdown },
    { label: "Receive | Adjust Inventory", onSelect: genericDropdown },
    { label: "Receive Purchase Order", onSelect: genericDropdown },
  ];

  
  const formComponents = {
    "Repair Request": <RepairRequestForm />,
    "Daily Inspection": <InspectionForm />,
    "Work Order": <NewWorkOrderForm />,
    Expense: <GeneralExpense />,
    Assignment: <EquipmentAssignment />,
    Accident: <NewAccident />,
    Part: <NewPart />,
    "Purchase Order": <NewPurchaseOrderForm />,
    Employee: <NewEmployeeForm />,
    Vendor: <NewVendor />,
    "Receive | Adjust Inventory": <AdjustInventoryForm data={undefined} />,
    "Receive Purchase Order": <QuickActionsReceivePurchaseOrder />,
  };
  const renderFormContent = () => {
    const SelectedComponent = formComponents[selectedProjectType || ""];
    console.log("new selected", SelectedComponent);
    return SelectedComponent ? SelectedComponent : null;
  };

  const selectedType = dropdownItems.find(
    (type) => type.label === selectedProjectType
  );
  // const currentForm = getCurrentForm();
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
          className="w-48 rounded-lg"
          // side={isMobile ? "bottom" : "right"}
          // align={isMobile ? "end" : "start"}
        >
          <div className="w-full  *:p-3 items-end flex justify-between">
            <div className="text-md font-semibold">Create New</div>
            {/* <Button variant="ghost">clear All</Button> */}
          </div>
          <DropdownMenuItem>Equipment </DropdownMenuItem>

          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.onSelect(item.label)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px] sm:w-2/3">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {/* {selectedType && <selectedType.icon className="h-5 w-5" />} */}
              Create New {selectedType?.label || "Project"}
            </SheetTitle>
            <SheetDescription>
              {/* {selectedType?.label ||
                "Fill out the form below to set up your new development project."} */}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
            {renderFormContent() || "nothing else"}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
