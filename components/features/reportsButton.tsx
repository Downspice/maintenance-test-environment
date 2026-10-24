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

type ReportConfig = {
  title: string;
  description?: string;
  formId?: string;
  content: ReactNode;
};

const REPORT_CONTENT: Record<ReportMenuId, ReportConfig> = {
  "history-cost": {
    title: "History (cost summary)",
    description:
      "Filter by equipment and date range, then set sort order for the export.",
    formId: "history-report-form",
    content: (
      <HistoryReportGeneration formId="history-report-form" hideSubmitButton />
    ),
  },
  "fuel-history": {
    title: "Fuel history",
    description:
      "Filter by equipment and date range, then set sort order for the export.",
    formId: "fuel-report-form",
    content: (
      <FuelReportGeneration formId="fuel-report-form" hideSubmitButton />
    ),
  },
  "equipment-usage": {
    title: "Equipment usage",
    description:
      "Filter by equipment and date range, then set sort order for the export.",
    formId: "equipment-usage-report-form",
    content: (
      <EquipmentReportGeneration
        formId="equipment-usage-report-form"
        hideSubmitButton
      />
    ),
  },
  "inventory-listing": {
    title: "Inventory listing",
    description: "Choose how rows are sorted in the listing export.",
    formId: "inventory-listing-report-form",
    content: (
      <InventoryReportGeneration
        formId="inventory-listing-report-form"
        hideSubmitButton
      />
    ),
  },
  "inventory-update": {
    title: "Inventory update",
    description:
      "Filter by scope and date range, then set sort order for the update report.",
    formId: "inventory-update-report-form",
    content: (
      <InventoryUsageReportGeneration
        formId="inventory-update-report-form"
        hideSubmitButton
      />
    ),
  },
  charts: {
    title: "Charts",
    content: (
      <div className="py-8 text-center text-text-sub-600">Charts view</div>
    ),
  },
  "view-all": {
    title: "All reports",
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
        description={report?.description}
        size="xl"
        className="sm:min-w-[720px]"
        closeable
        showFooter={Boolean(report?.formId)}
        bodyClassName="min-h-0 overflow-y-auto"
        renderActions={
          report?.formId ? (
            <Button form={report.formId} type="submit" variant="primary">
              Generate report
            </Button>
          ) : undefined
        }
      >
        {report?.content}
      </Modal>
    </>
  );
}
