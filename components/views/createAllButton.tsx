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
import NewWorkOrderForm, { ActualWorkOrderForm } from "../forms/actualForms/work-order-form";
import EquipmentAssignment from "../forms/actualForms/assign-equipment";
import NewAccident from "../forms/actualForms/new-accident";
import AdjustInventoryForm from "../forms/actualForms/adjust-inventory-form";
import { ScrollArea } from "../ui/scroll-area";
import QuickActionsReceivePurchaseOrder from "../forms/actualForms/quickActions/recievePurchaseOrder";
import NewPart from "../forms/actualForms/quickActions/addPart";
import { Separator } from "../ui/separator";
import EquipmentForm, { ActualEquipmentForm } from "@/app/(application)/equipment/components/new-equipment-form";
import ActualRepairRequestForm from "../forms/actualForms/repairRequest";

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
    { label: "Equipment", onSelect: genericDropdown },
    { label: "Repair Request", onSelect: genericDropdown },
    { label: "Daily Inspection", onSelect: genericDropdown },
    { label: "Work Order", onSelect: genericDropdown },
    { label: "Expense", onSelect: genericDropdown },
    { label: "Assignment", onSelect: genericDropdown },
    { label: "Accident", onSelect: genericDropdown },
  ];

  const dropdownItems2 = [
    { label: "Part", onSelect: genericDropdown },
    { label: "Purchase Order", onSelect: genericDropdown },
    { label: "Employee", onSelect: genericDropdown },
    { label: "Vendor", onSelect: genericDropdown },
  ];

  const dropdownItems3 = [
    { label: "Receive | Adjust Inventory", onSelect: genericDropdown },
    { label: "Receive Purchase Order", onSelect: genericDropdown },
  ];

  const formComponents = {
    "Equipment":<ActualEquipmentForm/>,
    "Repair Request": <ActualRepairRequestForm />,
    "Daily Inspection": <InspectionForm />,
    "Work Order": <ActualWorkOrderForm />,
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

  const selectedType = [
    ...dropdownItems1,
    ...dropdownItems2,
    ...dropdownItems3,
  ].find((type) => type.label === selectedProjectType);
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
          className="w-64 rounded-lg"
          // side={isMobile ? "bottom" : "right"}
          // align={isMobile ? "end" : "start"}
        >
          <div className="w-full  *:p-3 items-end flex justify-between">
            <div className="text-md font-semibold">Create New</div>
            {/* <Button variant="ghost">clear All</Button> */}
          </div>

          {dropdownItems1.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.onSelect(item.label)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <Separator className="text-gray-900" orientation="horizontal" />
          {dropdownItems2.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.onSelect(item.label)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <span className="font-bold">Other actions</span>
          <Separator orientation="horizontal" />
          {dropdownItems3.map((item) => (
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
