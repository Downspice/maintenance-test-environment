"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import EquipmentForm from "@/app/(application)/equipment/components/new-equipment-form";
import RepairRequestForm from "../forms/actualForms/repair-request-form";
const genericDropdown = () => {
  console.log("did something");
};

const dropdownItems = [ 
  { label: "Daily Inspection", onSelect: genericDropdown },
  { label: "Work Order", onSelect: genericDropdown },
  { label: "Expense", onSelect: genericDropdown },
  { label: "Assignment", onSelect: genericDropdown },
  { label: "Accident", onSelect: genericDropdown },
  { label: "Part", onSelect: genericDropdown },
  { label: "Purchase Order", onSelect: genericDropdown },
  { label: "Employee", onSelect: genericDropdown },
  { label: "Vendor", onSelect: genericDropdown },
  { label: "Receive| Adjust Inventory", onSelect: genericDropdown },
  { label: "Receive Purchase Order", onSelect: genericDropdown },
];

export default function CreateAllButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus /> Quick Actions
          <span className="sr-only">Create Something</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        // align={isMobile ? "end" : "start"}
      >
        <div className="w-full  *:p-3 items-end flex justify-between">
          <div className="text-md font-semibold">Create New</div>
          {/* <Button variant="ghost">clear All</Button> */}
        </div>

          <DropdownMenuItem>
Equipment        </DropdownMenuItem>
        <DropdownMenuItem>
          <RepairRequestForm />
        </DropdownMenuItem>

        {dropdownItems.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
