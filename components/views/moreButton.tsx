"use client";
import { CloudUpload, LucideEllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import NotCompleteMessage from "@/app/(application)/workInprogress/working";
import { useSheet } from "@/lib/sheet-providers";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import EmailHistoryDataTable from "../forms/actualForms/moreButtonForms/emailHistory";
import AdjustInventoryForm from "../forms/actualForms/adjust-inventory-form";
import EquipmentAssignment from "../forms/actualForms/assign-equipment";
import NewAccident from "../forms/actualForms/new-accident";
import NewEmployeeForm from "../forms/actualForms/new-employee-form";
import GeneralExpense from "../forms/actualForms/new-general-expense";
import InspectionForm from "../forms/actualForms/new-inspection";
import NewPurchaseOrderForm from "../forms/actualForms/new-purchase-order-form";
import NewVendor from "../forms/actualForms/new-vendor-form";
import NewPart from "../forms/actualForms/quickActions/addPart";
import QuickActionsReceivePurchaseOrder from "../forms/actualForms/quickActions/recievePurchaseOrder";
import RepairRequestForm from "../forms/actualForms/repair-request-form";
import NewWorkOrderForm from "../forms/actualForms/work-order-form";
import JobSiteAssignment from "../forms/actualForms/moreButtonForms/jobsiteassignment/jobsiteAssignments";
import MeterUpdatesMoreButton from "../forms/actualForms/moreButtonForms/meterUpdate/meterUpdateView";
import RepairRequestFormMoreButton from "../forms/actualForms/moreButtonForms/repairRequest/repairRequestForm";
import RepairRequestView from "../forms/actualForms/moreButtonForms/repairRequest/repairRequestView";
import PMForecasterView from "../forms/actualForms/moreButtonForms/pmForecaster/pmForecasterView";
import GeneratePOMoreButtonView from "../forms/actualForms/moreButtonForms/generatePO/generatePOMoreButton";
import GenerateWorkOrderMoreButtonView from "../forms/actualForms/moreButtonForms/generateWorkOrder/generateWorkOrderView";
import PhysicalInventoryUpdateMoreButton from "../forms/actualForms/moreButtonForms/updatePhysicalInventory/updatePhysicalInventoryView";
import UpdateMetersTable from "@/app/(application)/equipment/components/update-meter-table";
import { MeterReplacementTab } from "@/app/(application)/equipment/components/views/EquipmentProfile";

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
    { label: "Update Meters", onSelect: genericDropdown },
    { label: "Physical Inventory Count", onSelect: genericDropdown },
    { label: "Import Meter Readings", onSelect: genericDropdown },
  ];

  const dropdownItemsSection2 = [
    { label: "Generate Work Orders", onSelect: genericDropdown },
    { label: "Generate Purchase Orders", onSelect: genericDropdown },
    { label: "PM Forecaster", onSelect: genericDropdown },
  ];
    const dropdownItemsSection3 = [
      { label: "Repair Request (Outstanding)", onSelect: genericDropdown },
      { label: "Meter Updates", onSelect: genericDropdown },
      { label: "Job site Assignments", onSelect: genericDropdown },
      { label: "Meter Replacements", onSelect: genericDropdown },
      { label: "Email history", onSelect: genericDropdown },
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
              key={item.label}
              onClick={() => item.onSelect(item.label)}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <div className="text-md font-semibold">Bulk Actions</div>

          <Separator orientation="horizontal" />
          {dropdownItemsSection2.map((item) => (
            <DropdownMenuItem key={item.label} onClick={() => item.onSelect(item.label)}>
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <div className="text-md font-semibold">Misc Logs</div>
          <Separator orientation="horizontal" />
          {dropdownItemsSection3.map((item) => (
            <DropdownMenuItem key={item.label} onClick={() => item.onSelect(item.label)}>
              <span>{item.label}</span>
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
