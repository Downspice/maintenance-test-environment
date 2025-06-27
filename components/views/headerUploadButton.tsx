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

const genericDropdown = () => {
  toast("did something");
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

export default function HeaderUploadButton() {
  const { openSheet } = useSheet();
  const repairRequest = () => {
    console.log("ïn the function");
    document.body.style.pointerEvents = "auto";
    openSheet({
      title: "Create Inspection",
      description: "Fill out the form below to create a Inspection order.",
      content: <NotCompleteMessage />,
    });
  };
  const dropdownItemsSection3 = [
    { label: "Repair Request (Outstanding)", onSelect: repairRequest },
    { label: "Meter Updates", onSelect: genericDropdown },
    { label: "Job site Assignments", onSelect: genericDropdown },
    { label: "Meter Replacements", onSelect: genericDropdown },
    { label: "Email history", onSelect: genericDropdown },
  ];
  return (
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
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <div className="text-md font-semibold">Bulk Actions</div>

        <Separator orientation="horizontal" />
        {dropdownItemsSection2.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <div className="text-md font-semibold">Misc Logs</div>
        <Separator orientation="horizontal" />
        {dropdownItemsSection3.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
