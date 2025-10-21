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
import { toast } from "sonner";
const genericDropdown = () => {
  toast("did something");
};

const dropdownItemsSection1 = [
  { label: "User Preferences", onSelect: genericDropdown },
];

const dropdownItemsSection2 = [
  { label: "Manage Users", onSelect: genericDropdown },
  { label: "Change Password", onSelect: genericDropdown },
];

export default function HeaderProfileButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Avatar>
            {/* <AvatarImage src="https://github.com/shffadcn.png" alt="@shadcn" /> */}
            <AvatarFallback>YS</AvatarFallback>
          </Avatar>{" "}
          <span className="text-nowrap">Mr. Yaw Sarfo</span>
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
