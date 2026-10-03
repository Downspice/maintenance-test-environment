"use client";

import { Database, Download, HardDriveDownload, Trash2, Wrench } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  SectionedHeaderMenu,
  type HeaderMenuSection,
} from "./header/sectioned-header-menu";

type DbToolsMenuId = "backup" | "restore" | "optimize" | "purge";

const DB_TOOLS_SECTIONS: HeaderMenuSection<DbToolsMenuId>[] = [
  {
    label: "Backup & restore",
    items: [
      { id: "backup", label: "Backup database", icon: Download },
      { id: "restore", label: "Restore database", icon: HardDriveDownload },
    ],
  },
  {
    label: "Maintenance",
    items: [
      { id: "optimize", label: "Optimize / repair", icon: Wrench },
      { id: "purge", label: "Purge old data", icon: Trash2, emphasize: true },
    ],
  },
];

export default function DBToolsButton() {
  const handleSelect = (id: DbToolsMenuId) => {
    toast.info(`Database tool "${id}" — coming soon`);
  };

  return (
    <SectionedHeaderMenu
      sections={DB_TOOLS_SECTIONS}
      onSelect={handleSelect}
      trigger={
        <Button variant="secondary" className="gap-2">
          <Database className="size-4" />
          Tools
        </Button>
      }
    />
  );
}
