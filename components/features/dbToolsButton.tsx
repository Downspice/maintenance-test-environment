"use client";
import {
  Database,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
const genericDropdown = () => {
  console.log("did something");
};

const dropdownItemsSection1 = [
  { name: "Backup", onSelect: genericDropdown },
  { name: "Restore", onSelect: genericDropdown },
];

const dropdownItemsSection2 = [
  { name: "Optimize/Repair", onSelect: genericDropdown },
  { name: "Purge", onSelect: genericDropdown },
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
