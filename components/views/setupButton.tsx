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
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
    { label: "Settings", onSelect: genericDropdown },
    { label: "Locations", onSelect: genericDropdown },
    { label: "Warehouses", onSelect: genericDropdown },
    { label: "Manage Users", onSelect: genericDropdown },
    { label: "User Preferences", onSelect: genericDropdown },
    { label: "PO Shipping Address", onSelect: genericDropdown },
  ];

  const dropdownItemsSection2 = [
    { label: "PM Schedule Templates", onSelect: genericDropdown },
    { label: "Associations", onSelect: genericDropdown },
    { label: "Part Kits", onSelect: genericDropdown },
    { label: "Choice Lists", onSelect: genericDropdown },
    { label: "Scheduled reports", onSelect: genericDropdown },
  ];

  const dropdownItemsSection3 = [
    { label: "Equipment", onSelect: genericDropdown },
    { label: "Employees", onSelect: genericDropdown },
    { label: "Vendors", onSelect: genericDropdown },
    { label: "Parts Inventory", onSelect: genericDropdown },
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

  const selectedType = [
    ...dropdownItemsSection1,
    ...dropdownItemsSection2,
    ...dropdownItemsSection3,
  ].find((type) => type.label === selectedProjectType);

  const renderFormContent = () => {
    const SelectedComponent = formComponents[selectedProjectType || ""];
    console.log("new selected", SelectedComponent);
    return SelectedComponent ? SelectedComponent : null;
  };

  const formComponents = {
    Settings: <CompanySettings />,
    Locations: <NotCompleteMessage />,
    Warehouses: <NotCompleteMessage />,
    "Manage Users": <NotCompleteMessage />,
    "User Preferences": <NotCompleteMessage />,
    "PO Shipping Address": <NotCompleteMessage />,
    "PM Schedule Templates": <NotCompleteMessage />,
    Associations: <NotCompleteMessage />,
    "Part Kits": <NotCompleteMessage />,
    "Choice Lists": <NotCompleteMessage />,
    "Scheduled reports": <NotCompleteMessage />,
    Equipment: <NotCompleteMessage />,
    Employees: <NotCompleteMessage />,
    Vendors: <NotCompleteMessage />,
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
          className="w-48 rounded-lg"
          // side={isMobile ? "bottom" : "right"}
          // align={isMobile ? "end" : "start"}
        >
          <span className="font-bold">Company</span>
          {dropdownItemsSection1.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.onSelect(item.label)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <span className="font-bold">Maintenance</span>
          <Separator className="text-red-900" orientation="horizontal" />
          {dropdownItemsSection2.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.onSelect(item.label)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <span className="font-bold">Import</span>
          <Separator orientation="horizontal" />
          {dropdownItemsSection3.map((item) => (
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
            {renderFormContent() || "nothing else"}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
