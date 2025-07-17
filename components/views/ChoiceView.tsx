"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FilePenIcon, Trash2 } from "lucide-react";

interface TabData {
  id: string;
  name: string;
  subs?: { id: string; name: string }[];
}

interface ContentItem {
  value: string;
  label: string;
}

interface Props {
  tabs: TabData[];
  contents: Record<string, ContentItem[]>; // key = tabId or tabId:subId
}

export default function TabbedMenuEditor({ tabs, contents }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"new" | "edit">("new");
  const [dialogInput, setDialogInput] = useState("");
  const [editingItem, setEditingItem] = useState<null | string>(null);

  const isSubTab = activeTab.includes(":");
  const [mainTabId, subTabId] = activeTab.split(":");

  const currentTab = isSubTab ? `${mainTabId}:${subTabId}` : activeTab;
  const currentTabLabel = (() => {
    const main = tabs.find((t) => t.id === mainTabId || t.id === activeTab);
    const sub = main?.subs?.find((s) => s.id === subTabId);
    return isSubTab ? `${main?.name} > ${sub?.name}` : main?.name;
  })();

  const handleNew = () => {
    setDialogInput("");
    setDialogMode("new");
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: ContentItem) => {
    setDialogInput(item.label);
    setDialogMode("edit");
    setEditingItem(item.value);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const action = dialogMode;
    const menuPath = isSubTab ? `${mainTabId}/${subTabId}` : mainTabId;
    const url = `/${action}/choice/${menuPath}/${dialogInput}`;
    await fetch(url, { method: "POST" });
    setDialogOpen(false);
  };

  return (
    <div className="flex h-full w-full">
      {/* Tabs Section */}
      <div className="w-1/4 h-full border-r border-border bg-muted p-4">
        {tabs.map((tab) => (
          <div key={tab.id}>
            <button
              className={cn(
                "w-full text-left py-2 px-3 rounded hover:bg-primary/10",
                (activeTab === tab.id || activeTab.startsWith(`${tab.id}:`)) &&
                  "bg-primary/30 font-semibold"
              )}
              onClick={() => {
                if (tab.subs && tab.subs.length > 0) {
                  setActiveTab(`${tab.id}:${tab.subs[0].id}`);
                } else {
                  setActiveTab(tab.id);
                }
              }}
            >
              {tab.name}
            </button>

            {tab.subs && activeTab.startsWith(`${tab.id}:`) && (
              <div className="ml-4">
                {tab.subs.map((sub) => (
                  <button
                    key={sub.id}
                    className={cn(
                      "w-full text-left py-1 px-2 rounded hover:bg-primary/10 text-sm",
                      activeTab === `${tab.id}:${sub.id}` &&
                        "bg-primary/30 font-semibold"
                    )}
                    onClick={() => setActiveTab(`${tab.id}:${sub.id}`)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="w-3/4 p-6 space-y-4 bg-background">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{currentTabLabel}</h2>
          <Button onClick={handleNew}>Add New</Button>
        </div>
        <ul className="space-y-0.5">
          {contents[currentTab]?.map((item) => (
            <li
              key={item.value}
              className="flex justify-between items-center px-3  border border-border rounded-md hover:bg-primary/10"
            >
              <span>{item.label}</span>
              <div className="space-x-2">
                <Button
                  size={"sm"}
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  <FilePenIcon />
                </Button>
                <Button size={"sm"} variant="outline">
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            </li>
          )) || <p className="text-muted-foreground">No items yet.</p>}
        </ul>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "new"
                ? `Enter the name of ${currentTabLabel}`
                : `Enter new name for ${currentTabLabel}`}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={dialogInput}
            onChange={(e) => setDialogInput(e.target.value)}
            placeholder="Enter name"
          />
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={!dialogInput.trim()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
