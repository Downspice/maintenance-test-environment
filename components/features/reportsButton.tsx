"use client";

import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BarChartBig,
  Fuel,
  History,
  LayoutGrid,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "@/components/ui/modal";
import {
  SectionedHeaderMenu,
  type HeaderMenuSection,
} from "./header/sectioned-header-menu";
import HistoryReportGeneration from "./reportDialogs/history";
import FuelReportGeneration from "./reportDialogs/fuel";
import EquipmentReportGeneration from "./reportDialogs/equipments";
import InventoryReportGeneration from "./reportDialogs/inventory";
import InventoryUsageReportGeneration from "./reportDialogs/inventoryUsage";

type ReportMenuId =
  | "history-cost"
  | "fuel-history"
  | "equipment-usage"
  | "inventory-listing"
  | "inventory-update"
  | "charts"
  | "view-all";

const REPORT_MENU_SECTIONS: HeaderMenuSection<ReportMenuId>[] = [
  {
    label: "Common reports",
    items: [
      {
        id: "history-cost",
        label: "History (cost summary)",
        icon: History,
      },
      { id: "fuel-history", label: "Fuel history", icon: Fuel },
      {
        id: "equipment-usage",
        label: "Equipment usage",
        icon: Truck,
      },
      {
        id: "inventory-listing",
        label: "Inventory listing",
        icon: Package,
      },
      {
        id: "inventory-update",
        label: "Inventory update",
        icon: Package,
      },
    ],
  },
  {
    label: "Analytics",
    items: [{ id: "charts", label: "Charts", icon: BarChart3 }],
  },
  {
    label: "Browse",
    items: [
      {
        id: "view-all",
        label: "View all reports",
        icon: LayoutGrid,
        emphasize: true,
      },
    ],
  },
];

const REPORT_CONTENT: Record<ReportMenuId, { title: string; content: ReactNode }> =
  {
    "history-cost": {
      title: "History (Cost Summary)",
      content: <HistoryReportGeneration />,
    },
    "fuel-history": {
      title: "Fuel History",
      content: <FuelReportGeneration />,
    },
    "equipment-usage": {
      title: "Equipment Usage",
      content: <EquipmentReportGeneration />,
    },
    "inventory-listing": {
      title: "Inventory Listing",
      content: <InventoryReportGeneration />,
    },
    "inventory-update": {
      title: "Inventory Update",
      content: <InventoryUsageReportGeneration />,
    },
    charts: {
      title: "Charts",
      content: <div className="py-8 text-center text-text-sub-600">Charts view</div>,
    },
    "view-all": {
      title: "All Reports",
      content: (
        <div className="py-8 text-center text-text-sub-600">
          All reports listed here…
        </div>
      ),
    },
  };

export default function HeaderMeterButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeReport, setActiveReport] = useState<ReportMenuId | null>(null);

  const handleReportSelect = (id: ReportMenuId) => {
    setActiveReport(id);
    window.setTimeout(() => setOpenDialog(true), 0);
  };

  const report = activeReport ? REPORT_CONTENT[activeReport] : null;

  return (
    <>
      <SectionedHeaderMenu
        sections={REPORT_MENU_SECTIONS}
        onSelect={handleReportSelect}
        align="start"
        trigger={
          <Button variant="secondary" className="gap-2">
            <BarChartBig className="size-4" />
            Reports
          </Button>
        }
      />

      <Modal
        open={openDialog}
        onOpenChange={(next) => {
          setOpenDialog(next);
          if (!next) setActiveReport(null);
        }}
        title={report?.title ?? "Report"}
        size="lg"
        closeable
      >
        {report?.content}
      </Modal>
    </>
  );
}
