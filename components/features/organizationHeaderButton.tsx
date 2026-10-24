"use client";

import { useState } from "react";

import CompanySettings from "../forms/entities/company-setting-form";
import LocationView from "./locationView";
import WarehouseSetup from "./warehouseView";
import { Button } from "../ui/button";
import { Drawer } from "@/components/ui/drawer";
import { MapPin, Settings, Warehouse } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  SectionedHeaderMenu,
  type HeaderMenuSection,
} from "./header/sectioned-header-menu";

const STANDARD_DRAWER_CLASS =
  "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

type CompanyMenuKey = "Settings" | "Locations" | "Warehouses";

type CompanyMenuItem = {
  key: CompanyMenuKey;
  title: string;
  description?: string;
  formId?: string;
  saveLabel?: string;
  showFooter?: boolean;
};

const COMPANY_MENU_SECTIONS: HeaderMenuSection<CompanyMenuKey>[] = [
  {
    label: "Our company",
    items: [
      { id: "Settings", label: "Company settings", icon: Settings },
      { id: "Locations", label: "Locations", icon: MapPin },
      { id: "Warehouses", label: "Warehouses", icon: Warehouse },
    ],
  },
];

const COMPANY_MENU_ITEMS: CompanyMenuItem[] = [
  {
    key: "Settings",
    title: "Company Settings",
    description: "Fill out the form below to update company settings.",
    formId: "company-settings-form",
    saveLabel: "Save Settings",
    showFooter: true,
  },
  {
    key: "Locations",
    title: "Locations",
    description: "Manage company locations.",
    showFooter: false,
  },
  {
    key: "Warehouses",
    title: "Warehouses",
    description: "Manage warehouse setup.",
    showFooter: false,
  },
];

export default function OrganizationHeaderButton() {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<CompanyMenuKey | null>(null);

  const activeItem = COMPANY_MENU_ITEMS.find(
    (item) => item.key === selectedKey
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedKey(null);
    }
  };

  const handleSelect = (key: CompanyMenuKey) => {
    setSelectedKey(key);
    window.setTimeout(() => setOpen(true), 0);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "Settings":
        return (
          <CompanySettings
            formId="company-settings-form"
            hideSubmitButton
            onSuccess={() => handleOpenChange(false)}
          />
        );
      case "Locations":
        return <LocationView />;
      case "Warehouses":
        return <WarehouseSetup />;
      default:
        return null;
    }
  };

  return (
    <>
      <SectionedHeaderMenu
        sections={COMPANY_MENU_SECTIONS}
        onSelect={handleSelect}
        trigger={
          <Button variant="secondary" className="gap-2">
            <span className="text-nowrap">Our company</span>
          </Button>
        }
      />

      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        title={activeItem?.title ?? "Our Company"}
        description={activeItem?.description}
        closeable
        showFooter={activeItem?.showFooter ?? true}
        renderActions={
          activeItem?.formId ? (
            <Button form={activeItem.formId} type="submit" variant="primary">
              {activeItem.saveLabel ?? "Save"}
            </Button>
          ) : undefined
        }
        className={STANDARD_DRAWER_CLASS}
      >
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          {renderContent()}
        </ScrollArea>
      </Drawer>
    </>
  );
}
