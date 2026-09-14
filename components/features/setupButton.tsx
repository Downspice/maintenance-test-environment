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
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import NewEmployeeForm from "../forms/entities/new-employee-form";
import NotCompleteMessage from "@/app/(application)/workInprogress/working";
import CompanySettings from "../forms/entities/company-setting-form";
import LocationView from "./locationView";
import WarehouseSetup from "./warehouseView";
import ShippingView from "./shipping/shipping-view";
import NewVendor from "../forms/entities/new-vendor-form";
import ChoiceList from "../forms/setup/choiceList";
import ScheduledReportView from "./scheduledReport/scheduled-report";
import PartKitManager from "../forms/setup/partKit/PartKitManager";
import AssignmentConfigurations from "../forms/setup/assignment/assignmentManager";
import ManagePMScheduleManager from "../forms/setup/managePMSchedule/ManagePMScheduleManager";
import { ActualEquipmentForm } from "@/components/forms/entities/equipment/new-equipment-form";

type SetupItem = {
  name: string;
  formId?: string;
  saveLabel?: string;
  fullscreen?: boolean;
  noFooter?: boolean;
};

const SETUP_ITEMS: SetupItem[] = [
  { name: "Settings", formId: "company-settings-form", saveLabel: "Save Settings", fullscreen: false },
  { name: "Locations", noFooter: true },
  { name: "Warehouses", noFooter: true },
  { name: "Manage Users", noFooter: true },
  { name: "User Preferences", noFooter: true },
  { name: "PO Shipping Address", noFooter: true },
  { name: "PM Schedule Templates", noFooter: true },
  { name: "Associations", noFooter: true },
  { name: "Part Kits", noFooter: true },
  { name: "Choice Lists", noFooter: true },
  { name: "Scheduled reports", noFooter: true },
  { name: "Equipment", formId: "setup-equipment-form", saveLabel: "Save Equipment", fullscreen: true },
  { name: "Employees", formId: "setup-employee-form", saveLabel: "Save Employee", fullscreen: true },
  { name: "Vendors", formId: "setup-vendor-form", saveLabel: "Save Vendor", fullscreen: false },
  { name: "Parts Inventory", noFooter: true },
];

export default function HeaderSettingsButton() {
  const [open, setOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(null);

  const handleDropdownOptionSelect = (x: string) => {
    setSelectedProjectType(x);
    setOpen(true);
  };

  const genericDropdown = (x: string) => {
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
  };

  const renderFormContent = () => {
    switch (selectedProjectType) {
      case "Settings":
        return <CompanySettings formId="company-settings-form" hideSubmitButton />;
      case "Locations":
        return <LocationView />;
      case "Warehouses":
        return <WarehouseSetup />;
      case "Manage Users":
        return <NotCompleteMessage />;
      case "User Preferences":
        return <NotCompleteMessage />;
      case "PO Shipping Address":
        return <ShippingView />;
      case "PM Schedule Templates":
        return <ManagePMScheduleManager />;
      case "Associations":
        return <AssignmentConfigurations />;
      case "Part Kits":
        return <PartKitManager />;
      case "Choice Lists":
        return <ChoiceList />;
      case "Scheduled reports":
        return <ScheduledReportView />;
      case "Equipment":
        return (
          <ActualEquipmentForm
            formId="setup-equipment-form"
            hideSubmitButton
            onSuccess={handleCloseSheet}
          />
        );
      case "Employees":
        return (
          <NewEmployeeForm
            formId="setup-employee-form"
            hideSubmitButton
            onSuccess={handleCloseSheet}
          />
        );
      case "Vendors":
        return <NewVendor formId="setup-vendor-form" hideSubmitButton />;
      case "Parts Inventory":
        return <NotCompleteMessage />;
      default:
        return null;
    }
  };

  const getActiveItem = (): SetupItem | undefined =>
    SETUP_ITEMS.find((i) => i.name === selectedProjectType);

  const activeItem = getActiveItem();

  const drawerClassName = activeItem?.fullscreen
    ? "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
    : "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

  const renderActions = activeItem?.formId ? (
    <Button form={activeItem.formId} type="submit" variant="primary">
      {activeItem.saveLabel ?? "Save"}
    </Button>
  ) : undefined;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Cog /> Setup
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 rounded-lg">
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

      <Drawer
        open={open}
        onOpenChange={setOpen}
        title={selectedProjectType || "Setup"}
        description={
          activeItem?.formId
            ? `Fill out the form below to configure ${selectedProjectType?.toLowerCase()}.`
            : undefined
        }
        closeable={true}
        showFooter={!activeItem?.noFooter}
        renderActions={renderActions}
        className={drawerClassName}
      >
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          {renderFormContent() || "nothing else"}
        </ScrollArea>
      </Drawer>
    </>
  );
}
