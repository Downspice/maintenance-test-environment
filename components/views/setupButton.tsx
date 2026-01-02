"use client";
import { Cog } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useState } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "../ui/sheet";
import NewEmployeeForm from "../forms/actualForms/new-employee-form";
import NotCompleteMessage from "@/app/(application)/workInprogress/working";
import CompanySettings from "../forms/actualForms/company-setting-form";
import { ScrollArea } from "../ui/scroll-area";
import LocationView from "./locationView";
import WarehouseSetup from "./warehouseView";
import ShippingView from "./shipping/shippingVieew";
import NewVendor from "../forms/actualForms/new-vendor-form";
import ChoiceList from "../forms/actualForms/setupForms/choiceList";
import ScheduledReportView from "./scheduledReport/scheduled-report";
import PartKitManager from "../forms/actualForms/setupForms/partKit/PartKitManager";
import AssignmentConfigurations from "../forms/actualForms/setupForms/assignment/assignmentManager";
import ManagePMScheduleManager from "../forms/actualForms/setupForms/managePMSchedule/ManagePMScheduleManager";
import { ActualEquipmentForm } from "@/app/(application)/equipment/components/new-equipment-form";

export default function HeaderSettingsButton() {
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

  const dropdownItemsSection1 = [
    { name: "Settings", onSelect: genericDropdown },
    { name: "Locations", onSelect: genericDropdown },
    { name: "Warehouses", onSelect: genericDropdown },
    { name: "Manage Users", onSelect: genericDropdown },
    { name: "User Preferences", onSelect: genericDropdown },
    { name: "PO Shipping Address", onSelect: genericDropdown },
  ];

  const dropdownItemsSection2 = [
    { name: "PM Schedule Templates", onSelect: genericDropdown },
    { name: "Associations", onSelect: genericDropdown },
    { name: "Part Kits", onSelect: genericDropdown },
    { name: "Choice Lists", onSelect: genericDropdown },
    { name: "Scheduled reports", onSelect: genericDropdown },
  ];

  const dropdownItemsSection3 = [
    { name: "Equipment", onSelect: genericDropdown },
    { name: "Employees", onSelect: genericDropdown },
    { name: "Vendors", onSelect: genericDropdown },
    { name: "Parts Inventory", onSelect: genericDropdown },
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

  // const selectedType = [
  //   ...dropdownItemsSection1,
  //   ...dropdownItemsSection2,
  //   ...dropdownItemsSection3,
  // ].find((type) => type.label === selectedProjectType);

  const renderFormContent = () => {
    const SelectedComponent = formComponents[selectedProjectType ?? ""];
    console.log("new selected", SelectedComponent);
    return SelectedComponent ? SelectedComponent : null;
  };

  const formComponents: any = {
    Settings: <CompanySettings />,
    Locations: <LocationView />,
    Warehouses: <WarehouseSetup />,
    "Manage Users": <NotCompleteMessage />,
    "User Preferences": <NotCompleteMessage />,
    "PO Shipping Address": <ShippingView />,
    "PM Schedule Templates": <ManagePMScheduleManager />,
    Associations: <AssignmentConfigurations />,
    "Part Kits": <PartKitManager />,
    "Choice Lists": <ChoiceList />,
    "Scheduled reports": <ScheduledReportView />,
    Equipment: <ActualEquipmentForm />,
    Employees: <NewEmployeeForm />,
    Vendors: <NewVendor />,
    "Parts Inventory": <NotCompleteMessage />,
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Cog /> Setup
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        // align={isMobile ? "end" : "start"}
        >
          <span className="font-bold">Company</span>
          {dropdownItemsSection1.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <span className="font-bold">Maintenance</span>
          <Separator className="text-red-900" orientation="horizontal" />
          {dropdownItemsSection2.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <span className="font-bold">Import</span>
          <Separator orientation="horizontal" />
          {dropdownItemsSection3.map((item) => (
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
        <SheetContent className="w-[400px] sm:w-3/4">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {/* {selectedType && <selectedType.icon className="h-5 w-5" />} */}
              {selectedProjectType || "Setup"}
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
