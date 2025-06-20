"use client";
import { BarChartBig, CircleGauge, Cog, ParkingMeterIcon, Plus } from "lucide-react";
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
  { label: "History (Cost Summary) ", onSelect: genericDropdown },
  { label: "Fuel History ", onSelect: genericDropdown },
  { label: "Equipment Usage ", onSelect: genericDropdown },
  { label: "Inventory Listing", onSelect: genericDropdown },
  { label: "Update ", onSelect: genericDropdown },
];

const dropdownItemsSection2 = [{ label: "Charts", onSelect: genericDropdown }];

const dropdownItemsSection3 = [
  { label: "View All Reports", onSelect: genericDropdown },
];

export default function HeaderMeterButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <BarChartBig /> Reports
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        // align={isMobile ? "end" : "start"}
      >
        <span className="font-bold">Common Reports</span>
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
        <Separator orientation="horizontal" />
        {dropdownItemsSection3.map((item) => (
          <DropdownMenuItem key={item.label} onSelect={item.onSelect}>
            <span className="font-bold">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
