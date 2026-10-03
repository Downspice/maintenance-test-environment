"use client";

import {
  ClipboardList,
  Gauge,
  History,
  LucideEllipsisVertical,
  Mail,
  MapPin,
  RefreshCw,
  Replace,
  ShoppingCart,
  Sparkles,
  Upload,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Drawer } from "@/components/ui/drawer";
import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import EmailHistoryDataTable from "../forms/actions/more/emailHistory";
import JobSiteAssignment from "../forms/actions/more/jobsiteassignment/jobsiteAssignments";
import MeterUpdatesMoreButton from "../forms/actions/more/meterUpdate/meterUpdateView";
import RepairRequestView from "../forms/actions/more/repairRequest/repairRequestView";
import PMForecasterView from "../forms/actions/more/pmForecaster/pmForecasterView";
import GeneratePOMoreButtonView from "../forms/actions/more/generatePO/generatePOMoreButton";
import GenerateWorkOrderMoreButtonView from "../forms/actions/more/generateWorkOrder/generateWorkOrderView";
import PhysicalInventoryUpdateMoreButton from "../forms/actions/more/updatePhysicalInventory/updatePhysicalInventoryView";
import UpdateMetersTable from "@/components/features/equipment/update-meter-table";
import { MeterReplacementTab } from "@/components/features/equipment/meter-replacement-tab";

const WIDE_DRAWER_CLASS =
  "w-full sm:w-[92%] sm:min-w-[960px] sm:max-w-none lg:max-w-none";

type MoreActionId =
  | "Update Meters"
  | "Physical Inventory Count"
  | "Import Meter Readings"
  | "Generate Work Orders"
  | "Generate Purchase Orders"
  | "PM Forecaster"
  | "Repair Request (Outstanding)"
  | "Meter Updates"
  | "Job site Assignments"
  | "Meter Replacements"
  | "Email history";

type MoreMenuItem = {
  id: MoreActionId;
  label: string;
  icon: LucideIcon;
};

type MoreMenuSection = {
  label: string;
  items: MoreMenuItem[];
};

const MORE_MENU_SECTIONS: MoreMenuSection[] = [
  {
    label: "Updates",
    items: [
      { id: "Update Meters", label: "Update meters", icon: Gauge },
      {
        id: "Physical Inventory Count",
        label: "Physical inventory count",
        icon: ClipboardList,
      },
      {
        id: "Import Meter Readings",
        label: "Import meter readings",
        icon: Upload,
      },
    ],
  },
  {
    label: "Bulk actions",
    items: [
      {
        id: "Generate Work Orders",
        label: "Generate work orders",
        icon: Wrench,
      },
      {
        id: "Generate Purchase Orders",
        label: "Generate purchase orders",
        icon: ShoppingCart,
      },
      { id: "PM Forecaster", label: "PM forecaster", icon: Sparkles },
    ],
  },
  {
    label: "Logs & assignments",
    items: [
      {
        id: "Repair Request (Outstanding)",
        label: "Repair requests (outstanding)",
        icon: Wrench,
      },
      { id: "Meter Updates", label: "Meter updates log", icon: RefreshCw },
      {
        id: "Job site Assignments",
        label: "Job site assignments",
        icon: MapPin,
      },
      { id: "Meter Replacements", label: "Meter replacements", icon: Replace },
      { id: "Email history", label: "Email history", icon: Mail },
    ],
  },
];

const MORE_DESCRIPTIONS: Record<MoreActionId, string> = {
  "Email history": "Review emails sent from the system.",
  "Job site Assignments": "Manage equipment assignments to job sites.",
  "Meter Updates": "Bulk update equipment meter readings.",
  "Repair Request (Outstanding)": "View and manage open repair requests.",
  "PM Forecaster": "Forecast upcoming preventive maintenance.",
  "Generate Purchase Orders": "Create purchase orders in bulk.",
  "Generate Work Orders": "Create work orders in bulk.",
  "Physical Inventory Count": "Update physical inventory counts.",
  "Update Meters": "Edit current meter readings across equipment.",
  "Meter Replacements": "Log and review equipment meter replacement history.",
  "Import Meter Readings": "Import meter readings from a file.",
};

const WIDE_MORE_VIEWS = new Set<MoreActionId>([
  "Meter Replacements",
  "Update Meters",
  "Email history",
  "Repair Request (Outstanding)",
  "Meter Updates",
  "Job site Assignments",
  "Generate Work Orders",
  "Generate Purchase Orders",
  "PM Forecaster",
  "Physical Inventory Count",
  "Import Meter Readings",
]);

function MoreActionPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="text-label-md font-medium text-text-strong-950">{title}</p>
      <p className="max-w-sm text-paragraph-sm text-text-sub-600">
        Not available in this environment yet. Work in progress.
      </p>
    </div>
  );
}

export default function HeaderUploadButton() {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MoreActionId | null>(
    null
  );
  const handleActionSelect = (id: MoreActionId) => {
    setSelectedAction(id);
    // Defer until after the dropdown closes so the same pointer event cannot dismiss the drawer.
    window.setTimeout(() => {
      setOpen(true);
    }, 0);
  };

  const formComponents: Record<MoreActionId, ReactNode> = {
    "Email history": <EmailHistoryDataTable />,
    "Job site Assignments": <JobSiteAssignment />,
    "Meter Updates": <MeterUpdatesMoreButton />,
    "Repair Request (Outstanding)": <RepairRequestView />,
    "PM Forecaster": <PMForecasterView />,
    "Generate Purchase Orders": <GeneratePOMoreButtonView />,
    "Generate Work Orders": <GenerateWorkOrderMoreButtonView />,
    "Physical Inventory Count": <PhysicalInventoryUpdateMoreButton />,
    "Update Meters": <UpdateMetersTable />,
    "Meter Replacements": <MeterReplacementTab />,
    "Import Meter Readings": (
      <MoreActionPlaceholder title="Import meter readings" />
    ),
  };

  const renderFormContent = () => {
    if (!selectedAction) return null;
    return formComponents[selectedAction] ?? null;
  };

  const drawerTitle = selectedAction ?? "More";

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <LucideEllipsisVertical className="size-4" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-[min(100vw-2rem,17.5rem)] rounded-xl p-1.5"
        >
          {MORE_MENU_SECTIONS.map((section, sectionIndex) => (
            <DropdownMenuGroup key={section.label}>
              {sectionIndex > 0 && <DropdownMenuSeparator className="my-1.5" />}
              <DropdownMenuLabel className="px-2 pb-1 pt-1.5">
                {section.label}
              </DropdownMenuLabel>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.id}
                    className="whitespace-normal py-2 leading-snug"
                    onSelect={() => handleActionSelect(item.id)}
                  >
                    <Icon className="size-4 shrink-0 text-text-soft-400" />
                    <span className="text-text-strong-950">{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSelectedAction(null);
          }
        }}
        title={drawerTitle}
        description={
          selectedAction ? MORE_DESCRIPTIONS[selectedAction] : undefined
        }
        showFooter={false}
        className={cn(
          "w-full sm:max-w-2xl lg:max-w-3xl",
          selectedAction &&
            WIDE_MORE_VIEWS.has(selectedAction) &&
            WIDE_DRAWER_CLASS
        )}
        bodyClassName="flex min-h-0 min-w-0 flex-col overflow-hidden p-0"
      >
        <div className="flex h-[calc(100vh-160px)] min-h-0 w-full min-w-0 flex-col overflow-hidden px-6 py-4">
          {renderFormContent()}
        </div>
      </Drawer>
    </>
  );
}
