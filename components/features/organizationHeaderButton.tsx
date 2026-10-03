"use client";

import { useState } from "react";

import CompanySettings from "../forms/entities/company-setting-form";
import LocationView from "./locationView";
import WarehouseSetup from "./warehouseView";
import { Button } from "../ui/button";
import { Drawer } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

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

  const activeItem = COMPANY_MENU_ITEMS.find((item) => item.key === selectedKey);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedKey(null);
    }
  };

  const handleSelect = (key: CompanyMenuKey) => {
    setSelectedKey(key);
    setOpen(true);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="text-nowrap">Our Company</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-lg">
          <DropdownMenuItem onClick={() => handleSelect("Settings")}>
            <span>Settings</span>
          </DropdownMenuItem>
          <Separator orientation="horizontal" />
          <DropdownMenuItem onClick={() => handleSelect("Locations")}>
            <span>Locations</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("Warehouses")}>
            <span>Warehouses</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
