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
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
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

  const formComponents = {
    "Equipment": <ActualEquipmentForm />,
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

  // const selectedType = [
  //   ...dropdownItems1,
  //   ...dropdownItems2,
  //   ...dropdownItems3,
  // ].find((type) => type.label === selectedProjectType);
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          className={
            selectedProjectType === "Purchase Order"
              ? "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
              : "w-[400px] sm:w-2/3"
          }
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {/* {selectedType && <selectedType.icon className="h-5 w-5" />} */}
              {selectedProjectType?.startsWith("Receive")
                ? selectedProjectType
                : `Create New ${selectedProjectType || "Project"}`}
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
