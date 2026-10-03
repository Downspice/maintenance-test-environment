"use client";
import { LucideEllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";
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

export default function HeaderUploadButton() {
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
    { name: "Update Meters", onSelect: genericDropdown },
    { name: "Physical Inventory Count", onSelect: genericDropdown },
    { name: "Import Meter Readings", onSelect: genericDropdown },
  ];

  const dropdownItemsSection2 = [
    { name: "Generate Work Orders", onSelect: genericDropdown },
    { name: "Generate Purchase Orders", onSelect: genericDropdown },
    { name: "PM Forecaster", onSelect: genericDropdown },
  ];
    const dropdownItemsSection3 = [
      { name: "Repair Request (Outstanding)", onSelect: genericDropdown },
      { name: "Meter Updates", onSelect: genericDropdown },
      { name: "Job site Assignments", onSelect: genericDropdown },
      { name: "Meter Replacements", onSelect: genericDropdown },
      { name: "Email history", onSelect: genericDropdown },
    ];

    const formComponents = {
      "Email history": <EmailHistoryDataTable />,
      "Job site Assignments":<JobSiteAssignment/>,
      "Meter Updates":<MeterUpdatesMoreButton/>,
      "Repair Request (Outstanding)":<RepairRequestView/>,
      "PM Forecaster":<PMForecasterView/>,
      "Generate Purchase Orders": <GeneratePOMoreButtonView/>,
      "Generate Work Orders":<GenerateWorkOrderMoreButtonView/>,
      "Physical Inventory Count": <PhysicalInventoryUpdateMoreButton/>,
      "Update Meters":<UpdateMetersTable/>,
      "Meter Replacements":<MeterReplacementTab/>,

    };

    const renderFormContent = () => {
      const SelectedComponent = formComponents[selectedProjectType || ""];
      console.log("new selected", SelectedComponent);
      return SelectedComponent ? SelectedComponent : null;
    };

    const MORE_DESCRIPTIONS: Record<string, string> = {
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

    const WIDE_MORE_VIEWS = new Set([
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
    ]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <LucideEllipsisVertical /> More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          // side={isMobile ? "bottom" : "right"}
          // align={isMobile ? "end" : "start"}
        >
          <div className="w-full  *:p-3 items-end flex justify-between">
            {/* <Button variant="ghost">clear All</Button> */}
          </div>
          <div className="text-md font-semibold">Updates</div>

          {dropdownItemsSection1.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onClick={() => item.onSelect(item.name)}
            >
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <div className="text-md font-semibold">Bulk Actions</div>

          <Separator orientation="horizontal" />
          {dropdownItemsSection2.map((item) => (
            <DropdownMenuItem key={item.name} onClick={() => item.onSelect(item.name)}>
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
          <div className="text-md font-semibold">Misc Logs</div>
          <Separator orientation="horizontal" />
          {dropdownItemsSection3.map((item) => (
            <DropdownMenuItem key={item.name} onClick={() => item.onSelect(item.name)}>
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Drawer
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSelectedProjectType(null);
          }
        }}
        modal={false}
        title={selectedProjectType ?? "More"}
        description={
          selectedProjectType
            ? MORE_DESCRIPTIONS[selectedProjectType]
            : undefined
        }
        showFooter={false}
        className={cn(
          "w-full sm:max-w-2xl lg:max-w-3xl",
          selectedProjectType &&
            WIDE_MORE_VIEWS.has(selectedProjectType) &&
            "w-full sm:w-[92%] sm:min-w-[960px] sm:max-w-none lg:max-w-none",
        )}
        bodyClassName="flex min-h-0 flex-col overflow-hidden p-0"
      >
        <div className="flex h-[calc(100vh-160px)] min-h-0 flex-col overflow-hidden px-6 py-4">
          {renderFormContent()}
        </div>
      </Drawer>
    </>
  );
}
