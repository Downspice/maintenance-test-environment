"use client";

import { useState } from "react";
import {
  BarChartBig,
  CircleGauge,
  Cog,
  ParkingMeterIcon,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import HistoryReportGeneration from "./reportDialogs/history";
import FuelReportGeneration from "./reportDialogs/fuel";
import EquipmentReportGeneration from "./reportDialogs/equipments";
import InventoryReportGeneration from "./reportDialogs/inventory";
import InventoryUsageReportGeneration from "./reportDialogs/inventoryUsage";

export default function HeaderMeterButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogTitle, setDialogTitle] = useState("");

  const handleDropdownSelect = (label: string, content: React.ReactNode) => {
    setDialogTitle(label);
    setDialogContent(content);
    setOpenDialog(true);
  };

  const dropdownItemsSection1 = [
    {
      label: "History (Cost Summary)",
      content: <HistoryReportGeneration/>,
    },
    {
      label: "Fuel History",
      content: <FuelReportGeneration/>,
    },
    {
      label: "Equipment Usage",
      content: <EquipmentReportGeneration/>,
    },
    {
      label: "Inventory Listing",
      content: <InventoryReportGeneration/>,
    },
    {
      label: " Inventory Update",
      content: <InventoryUsageReportGeneration/>,
    },
  ];

  const dropdownItemsSection2 = [
    {
      label: "Charts",
      content: <div>Charts view</div>,
    },
  ];

  const dropdownItemsSection3 = [
    {
      label: "View All Reports",
      content: <div>All reports listed here...</div>,
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <BarChartBig className="mr-2 h-4 w-4" /> Reports
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-lg">
          <span className="font-bold px-2 py-1">Common Reports</span>
          {dropdownItemsSection1.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onSelect={() => handleDropdownSelect(item.label, item.content)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
          <Separator />
          {dropdownItemsSection2.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onSelect={() => handleDropdownSelect(item.label, item.content)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
          <Separator />
          {dropdownItemsSection3.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onSelect={() => handleDropdownSelect(item.label, item.content)}
            >
              <span className="font-bold">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </>
  );
}
