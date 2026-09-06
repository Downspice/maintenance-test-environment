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
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
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

    const selectedType = [
      ...dropdownItemsSection1,
      ...dropdownItemsSection2,
      ...dropdownItemsSection3,
    ].find((type) => type.label === selectedProjectType);

 
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px] sm:w-5/6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {/* {selectedType && <selectedType.icon className="h-5 w-5" />} */}
              {selectedType?.label || "nothing"}
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
