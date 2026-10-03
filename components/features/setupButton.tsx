"use client";
import {
  Boxes,
  Cog,
  Link2,
  ListTree,
  MapPin,
  Package,
  CalendarClock,
  Settings,
  Ship,
  Users,
  Warehouse,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  SectionedHeaderMenu,
  type HeaderMenuSection,
} from "./header/sectioned-header-menu";
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
  title?: string;
  description?: string;
  formId?: string;
  saveLabel?: string;
  fullscreen?: boolean;
  /** Wide drawer for data tables (e.g. PO shipping addresses). */
  wide?: boolean;
  /** Full-height split layout inside wide drawer (no form footer required). */
  wideSplitLayout?: boolean;
  noFooter?: boolean;
};

const STANDARD_DRAWER_CLASS =
  "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

const WIDE_DRAWER_CLASS =
  "w-full sm:w-[92%] sm:min-w-[960px] sm:max-w-none lg:max-w-none";

const SETUP_ITEMS: SetupItem[] = [
  {
    name: "Settings",
    title: "Company Settings",
    description: "Fill out the form below to update company settings.",
    formId: "company-settings-form",
    saveLabel: "Save Settings",
    fullscreen: false,
  },
  { name: "Locations", noFooter: true },
  { name: "Warehouses", noFooter: true },
  { name: "Manage Users", noFooter: true },
  { name: "User Preferences", noFooter: true },
  {
    name: "PO Shipping Address",
    title: "PO Shipping Address",
    description: "Manage ship-to addresses used on purchase orders.",
    noFooter: true,
    wide: true,
  },
  {
    name: "PM Schedule Templates",
    title: "PM Schedule Templates",
    description: "Create maintenance schedule templates and configure services.",
    formId: "pm-schedule-templates-form",
    saveLabel: "Save Templates",
    wide: true,
  },
  {
    name: "Associations",
    title: "Associations",
    description:
      "Configure part, labor, and instruction associations for scheduled equipment.",
    wide: true,
    wideSplitLayout: true,
    noFooter: true,
  },
  {
    name: "Part Kits",
    title: "Part Kits",
    description: "Define kits and the parts included in each kit.",
    formId: "part-kits-form",
    saveLabel: "Save Part Kits",
    wide: true,
  },
  { name: "Choice Lists", noFooter: true },
  {
    name: "Scheduled reports",
    title: "Scheduled Reports",
    description: "Create and manage automated report exports and delivery schedules.",
    noFooter: true,
    wide: true,
  },
  { name: "Equipment", formId: "setup-equipment-form", saveLabel: "Save Equipment", fullscreen: true },
  { name: "Employees", formId: "setup-employee-form", saveLabel: "Save Employee", fullscreen: true },
  { name: "Vendors", formId: "setup-vendor-form", saveLabel: "Save Vendor", fullscreen: false },
  { name: "Parts Inventory", noFooter: true },
];

type SetupMenuId = (typeof SETUP_ITEMS)[number]["name"];

const SETUP_MENU_SECTIONS: HeaderMenuSection<SetupMenuId>[] = [
  {
    label: "Company",
    items: [
      { id: "Settings", label: "Settings", icon: Settings },
      { id: "Locations", label: "Locations", icon: MapPin },
      { id: "Warehouses", label: "Warehouses", icon: Warehouse },
      { id: "Manage Users", label: "Manage users", icon: Users },
      { id: "User Preferences", label: "User preferences", icon: Settings },
      {
        id: "PO Shipping Address",
        label: "PO shipping address",
        icon: Ship,
      },
    ],
  },
  {
    label: "Maintenance",
    items: [
      {
        id: "PM Schedule Templates",
        label: "PM schedule templates",
        icon: CalendarClock,
      },
      { id: "Associations", label: "Associations", icon: Link2 },
      { id: "Part Kits", label: "Part kits", icon: Package },
      { id: "Choice Lists", label: "Choice lists", icon: ListTree },
      {
        id: "Scheduled reports",
        label: "Scheduled reports",
        icon: CalendarClock,
      },
    ],
  },
  {
    label: "Import",
    items: [
      { id: "Equipment", label: "Equipment", icon: Boxes },
      { id: "Employees", label: "Employees", icon: Users },
      { id: "Vendors", label: "Vendors", icon: Users },
      { id: "Parts Inventory", label: "Parts inventory", icon: Package },
    ],
  },
];

export default function HeaderSettingsButton() {
  const [open, setOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(null);

  const handleActionSelect = (name: SetupMenuId) => {
    setSelectedProjectType(name);
    window.setTimeout(() => setOpen(true), 0);
  };

  const handleCloseSheet = () => {
    setOpen(false);
    setSelectedProjectType(null);
  };

  const renderFormContent = () => {
    switch (selectedProjectType) {
      case "Settings":
        return (
          <CompanySettings
            formId="company-settings-form"
            hideSubmitButton
            onSuccess={handleCloseSheet}
          />
        );
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
        return (
          <ManagePMScheduleManager
            formId="pm-schedule-templates-form"
            hideSubmitButton
            onSuccess={handleCloseSheet}
          />
        );
      case "Associations":
        return <AssignmentConfigurations />;
      case "Part Kits":
        return (
          <PartKitManager
            formId="part-kits-form"
            hideSubmitButton
            onSuccess={handleCloseSheet}
          />
        );
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
    : activeItem?.wide
      ? WIDE_DRAWER_CLASS
      : STANDARD_DRAWER_CLASS;

  const drawerBodyScrollClass =
    "h-[calc(100vh-160px)] w-full min-w-0 overflow-auto pr-4";

  const drawerBodyFormLayoutClass =
    "flex h-[calc(100vh-160px)] min-h-0 w-full flex-col overflow-hidden pr-4";

  const useWideFormLayout = Boolean(
    activeItem?.wide &&
      (activeItem?.formId || activeItem?.wideSplitLayout),
  );

  const renderActions = activeItem?.formId ? (
    <Button form={activeItem.formId} type="submit" variant="primary">
      {activeItem.saveLabel ?? "Save"}
    </Button>
  ) : undefined;

  return (
    <>
      <SectionedHeaderMenu
        sections={SETUP_MENU_SECTIONS}
        onSelect={handleActionSelect}
        align="start"
        trigger={
          <Button variant="secondary" className="gap-2">
            <Cog className="size-4" />
            Setup
          </Button>
        }
      />

      <Drawer
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSelectedProjectType(null);
          }
        }}
        title={activeItem?.title ?? selectedProjectType ?? "Setup"}
        description={
          activeItem?.description ??
          (activeItem?.formId
            ? `Fill out the form below to configure ${selectedProjectType?.toLowerCase()}.`
            : undefined)
        }
        closeable={true}
        showFooter={!activeItem?.noFooter}
        renderActions={renderActions}
        className={drawerClassName}
        bodyClassName="min-w-0 overflow-hidden"
      >
        {useWideFormLayout ? (
          <div className={drawerBodyFormLayoutClass}>
            {renderFormContent()}
          </div>
        ) : activeItem?.wide ? (
          <div className={drawerBodyScrollClass}>
            {renderFormContent() || "nothing else"}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-160px)] pr-4">
            {renderFormContent() || "nothing else"}
          </ScrollArea>
        )}
      </Drawer>
    </>
  );
}
