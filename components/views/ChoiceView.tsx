"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  contents: Record<string, ContentItem[]>;
}

export default function TabbedMenuEditor({ tabs, contents }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id);

  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: "new" | "edit";
    input: string;
    editingId: string | null;
    loading: boolean;
  }>({
    open: false,
    mode: "new",
    input: "",
    editingId: null,
    loading: false,
  });

  const isSubTab = useMemo(() => activeTab.includes(":"), [activeTab]);
  const [mainTabId, subTabId] = useMemo(
    () => activeTab.split(":"),
    [activeTab]
  );

  const currentTab = isSubTab ? `${mainTabId}:${subTabId}` : activeTab;

  const currentTabLabel = useMemo(() => {
    const main = tabs.find((t) => t.id === mainTabId || t.id === activeTab);
    const sub = main?.subs?.find((s) => s.id === subTabId);
    return isSubTab ? `${main?.name} › ${sub?.name}` : main?.name;
  }, [tabs, mainTabId, subTabId, activeTab, isSubTab]);

  const openNewDialog = useCallback(() => {
    setDialog({
      open: true,
      mode: "new",
      input: "",
      editingId: null,
      loading: false,
    });
  }, []);

  const openEditDialog = useCallback((item: ContentItem) => {
    setDialog({
      open: true,
      mode: "edit",
      input: item.label,
      editingId: item.value,
      loading: false,
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!dialog.input.trim()) return;
    try {
      setDialog((d) => ({ ...d, loading: true }));
      const action = dialog.mode;
      const menuPath = isSubTab ? `${mainTabId}/${subTabId}` : mainTabId;
      const url = `/${action}/choice/${menuPath}/${dialog.input}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Failed request");
      setDialog({
        open: false,
        mode: "new",
        input: "",
        editingId: null,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setDialog((d) => ({ ...d, loading: false }));
    }
  }, [dialog.input, dialog.mode, isSubTab, mainTabId, subTabId]);

  return (
    <div className="flex flex-1 h-[calc(100vh-120px)] w-full bg-muted/20">
      {/* Tabs Section */}
      <aside className="w-64 h-[calc(100vh-120px)] overflow-scroll border-r border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Menu
        </h3>
        <nav className="space-y-0.5">
          {tabs.map((tab) => {
            const activeMain =
              activeTab === tab.id || activeTab.startsWith(`${tab.id}:`);
            return (
              <div key={tab.id}>
                <button
                  aria-selected={activeMain}
                  className={cn(
                    "w-full text-left py-2 px-3 rounded-md transition-colors",
                    "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
                    activeMain && "bg-primary/20 text-primary font-medium"
                  )}
                  onClick={() =>
                    setActiveTab(
                      tab.subs?.length ? `${tab.id}:${tab.subs[0].id}` : tab.id
                    )
                  }
                >
                  {tab.name}
                </button>

                {tab.subs && activeMain && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                    {tab.subs.map((sub) => (
                      <button
                        key={sub.id}
                        aria-selected={activeTab === `${tab.id}:${sub.id}`}
                        className={cn(
                          "w-full text-left py-1.5 px-2 rounded-md text-sm transition-colors",
                          "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary",
                          activeTab === `${tab.id}:${sub.id}` &&
                            "bg-primary/20 text-primary font-medium"
                        )}
                        onClick={() => setActiveTab(`${tab.id}:${sub.id}`)}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Content Section */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b-3 border-text">
          <h2 className="text-2xl font-bold tracking-tight">
            {currentTabLabel}
          </h2>
          <Button size="sm" onClick={openNewDialog}>
            + Add Item
          </Button>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contents[currentTab]?.length ? (
            contents[currentTab].map((item) => (
              <li
                key={item.value}
                className="flex justify-between items-center rounded-lg border border-border bg-card px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-medium">{item.label}</span>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditDialog(item)}
                    className="hover:bg-primary/10"
                  >
                    <FilePenIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-muted-foreground italic">
              No items yet. Click “Add Item” to get started.
            </p>
          )}
        </ul>
      </main>

      {/* Dialog */}
      <Dialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {dialog.mode === "new"
                ? `Add to ${currentTabLabel}`
                : `Edit ${currentTabLabel}`}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={dialog.input}
              onChange={(e) =>
                setDialog((d) => ({ ...d, input: e.target.value }))
              }
              placeholder="Enter name"
              className="h-11 text-base"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!dialog.input.trim() || dialog.loading}
              className="w-full sm:w-auto"
            >
              {dialog.loading ? "Saving..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
