"use client";
import { CircleGauge, Cog, ParkingMeterIcon, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import CompanySettings from "../forms/actualForms/company-setting-form";
import LocationView from "./locationView";
import WarehouseSetup from "./warehouseView";

export default function OrganizationHeaderButton() {
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

  const dropdownItems1 = [{ label: "Settings", onSelect: genericDropdown }];

  const dropdownItems2 = [
    { label: "Locations", onSelect: genericDropdown },
    { label: "Warehouses", onSelect: genericDropdown },
  ];

  const formComponents = {
    Settings: <CompanySettings />,
    Locations: <LocationView />,
    Warehouses: <WarehouseSetup />,
  };
  const renderFormContent = () => {
    const SelectedComponent = formComponents[selectedProjectType || ""];
    console.log("new selected", SelectedComponent);
    return SelectedComponent ? SelectedComponent : null;
  };

  const selectedType = [...dropdownItems1, ...dropdownItems2].find(
    (type) => type.label === selectedProjectType
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="text-nowrap">Our Company</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          // side={isMobile ? "bottom" : "right"}
          // align={isMobile ? "end" : "start"}
        >
          {dropdownItems1.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <Separator orientation="horizontal" />
          {dropdownItems2.map((item) => (
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
