"use client";
import { Cog, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction, useSidebar } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
const genericDropdown = () => {
  toast("did something");
};

const dropdownItemsSection1 = [
  { label: "Settings", onSelect: genericDropdown },
  { label: "Locations", onSelect: genericDropdown },
  { label: "Warehouses", onSelect: genericDropdown },
  { label: "Manage Users", onSelect: genericDropdown },
  { label: "User Preferences", onSelect: genericDropdown },
  { label: "PO Shipping Address", onSelect: genericDropdown },
];

const dropdownItemsSection2 = [
  { label: "PM Schedule Templates", onSelect: genericDropdown },
  { label: "Associations", onSelect: genericDropdown },
  { label: "Part Kits", onSelect: genericDropdown },
  { label: "Choice Lists", onSelect: genericDropdown },
  { label: "Scheduled reports", onSelect: genericDropdown },
];

const dropdownItemsSection3 = [
  { label: "Equipment", onSelect: genericDropdown },
  { label: "Employees", onSelect: genericDropdown },
  { label: "Vendors", onSelect: genericDropdown },
  { label: "Parts Inventory", onSelect: genericDropdown },
];

export default function HeaderSettingsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Cog /> Setup
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        // align={isMobile ? "end" : "start"}
      >
        <span className="font-bold">Company</span>
        {dropdownItemsSection1.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <span className="font-bold">Maintenance</span>
        <Separator className="text-red-900" orientation="horizontal" />
        {dropdownItemsSection2.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <span className="font-bold">Import</span>
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
