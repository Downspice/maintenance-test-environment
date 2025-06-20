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

const dropdownItemsSection3 = [
  { label: "Repair Request (Outstanding)", onSelect: genericDropdown },
  { label: "Meter Updates", onSelect: genericDropdown },
  { label: "Jobsite Assignments", onSelect: genericDropdown },
  { label: "Meter Replacements", onSelect: genericDropdown },
  { label: "Email history", onSelect: genericDropdown },
];

export default function HeaderUploadButton() {
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
