"use client";
import { CircleGauge, Cog, ParkingMeterIcon, Plus } from "lucide-react";
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
  { label: "Settings", onSelect: genericDropdown },
 ];

const dropdownItemsSection2 = [
  { label: "Locations", onSelect: genericDropdown },
  { label: "Warehouses", onSelect: genericDropdown },
]; 

export default function OrganizationHeaderButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" > 
          <span className="text-nowrap">Our Company</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        // align={isMobile ? "end" : "start"}
      >
        {dropdownItemsSection1.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        <Separator orientation="horizontal" />
        {dropdownItemsSection2.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
