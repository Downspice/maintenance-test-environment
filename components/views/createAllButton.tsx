"use client";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import RepairRequestForm from "../forms/actualForms/repair-request-form";
import {
  Plus,
  ChevronDown,
  Code,
  Smartphone,
  Globe,
  Database,
  Palette,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Form } from "react-hook-form";
import InputWrapper from "../input-wrapper";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "../ui/sheet";
import NewWarehouse from "../forms/actualForms/new-warehouse";
import NotCompleteMessage from "@/app/(application)/workInprogress/working";
import NewEmployeeForm from "../forms/actualForms/new-employee-form";
import InspectionForm from "../forms/actualForms/new-inspection";
import NewVendor from "../forms/actualForms/new-vendor-form";
import NewPurchaseOrderForm from "../forms/actualForms/new-purchase-order-form";
import GeneralExpense from "../forms/actualForms/new-general-expense";
import NewWorkOrderForm from "../forms/actualForms/work-order-form";
import EquipmentAssignment from "../forms/actualForms/assign-equipment";

export default function CreateAllButton() {
  const [open, setOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(
    null
  );

  const handleDropdownOptionSelect = (x: string) => {
    console.log("handleDropdownOptionSelect", x);
    setSelectedProjectType(x);
    setOpen(true);
  };

  const genericDropdown = (x: string) => {
    console.log("did something", x);
    handleDropdownOptionSelect(x);
  };

  const dropdownItems = [
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

  const handleCloseSheet = () => {
    setOpen(false);
    setSelectedProjectType(null);
    // Reset all forms
    // webForm.reset()
    // mobileForm.reset()
    // apiForm.reset()
    // desktopForm.reset()
    // designForm.reset()
    // aiForm.reset()
  };

  const formComponents = {
    "Daily Inspection": <InspectionForm/>,
    "Work Order": <NewWorkOrderForm/>,
    Expense: <GeneralExpense/>,
    Assignment: <EquipmentAssignment/>,
    Accident: <NewEmployeeForm/>,
    Part: <NewEmployeeForm/>,
    "Purchase Order": <NewPurchaseOrderForm/>,
    Employee: <NewEmployeeForm/>,
    Vendor: <NewVendor/>,
    "Receive | Adjust Inventory": <NewEmployeeForm/>,
    "Receive Purchase Order": <NewEmployeeForm/>,
  };
  const renderFormContent = () => {
    const SelectedComponent = formComponents[selectedProjectType || ""];
    console.log("new selected", SelectedComponent);
    return SelectedComponent ? SelectedComponent: null;
  };

  function onSubmit(data: any) {
    const selectedType = dropdownItems.find(
      (type) => type.label === selectedProjectType
    );

    toast("Project created successfully!", {
      description: (
        <div className="mt-2 space-y-2">
          <div>
            <p className="font-medium">{data.name}</p>
            <p className="text-xs text-blue-600 font-medium">
              Type: {selectedType?.label}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{data.description}</p>
          <p className="text-xs">
            Deadline: {data.deadline.toLocaleDateString()}
          </p>
        </div>
      ),
      duration: 8000,
    });

    handleCloseSheet();
  }

  function onError(errors: any) {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        return `${field}: ${error.message}`;
      }
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  }

  // const renderFormContent = () => {
  //   switch (selectedProjectType) {
  //     case "Expense":
  //       return <NewWarehouse />;
  //   }
  // };

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
          <DropdownMenuItem>
            <RepairRequestForm />
          </DropdownMenuItem>

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
        <SheetContent className="w-[400px] sm:w-[540px]">
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
            {renderFormContent()||"nothing else"}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
