"use client";
import {
  CircleGauge,
  Cog,
  Database,
  ParkingMeterIcon,
  Plus,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const genericDropdown = () => {
  console.log("did something");
};

const dropdownItemsSection1 = [
  { label: "Backup", onSelect: genericDropdown },
  { label: "Restore", onSelect: genericDropdown },
];

const dropdownItemsSection2 = [
  { label: "Optimize/Repair", onSelect: genericDropdown },
  { label: "Purge", onSelect: genericDropdown },
];

export default function DBToolsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Database />Tools
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        // align={isMobile ? "end" : "start"}
      >
        {dropdownItemsSection1.map((item) => (
          <DropdownMenuItem key={item.name} onSelect={item.onSelect}>
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
        <Separator orientation="horizontal" />
        {dropdownItemsSection2.map((item) => (
          <DropdownMenuItem key={item.name} onSelect={item.onSelect}>
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
