"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, FilePenIcon, Plus, Trash2, X } from "lucide-react";
import {
  useGetEmployeeStatuses,
  useAddEmployeeStatus,
  useUpdateEmployeeStatus,
  useDeleteEmployeeStatus,
  useGetEmployeeCategories,
  useAddEmployeeCategory,
  useUpdateEmployeeCategory,
  useDeleteEmployeeCategory,
  useGetEmployeeRenewals,
  useAddEmployeeRenewal,
  useUpdateEmployeeRenewal,
  useDeleteEmployeeRenewal,
  useGetEmployeeTypes,
  useAddEmployeeType,
  useUpdateEmployeeType,
  useDeleteEmployeeType,
} from "@/services/setups/employee";
import {
  useAddPurchaseOrderTerm,
  useAddVendorType,
  useDeletePurchaseOrderTerm,
  useDeleteVendorType,
  useGetPurchaseOrderTerms,
  useGetVendorTypes,
  useUpdatePurchaseOrderTerm,
  useUpdateVendorType,
} from "@/services/setups/vendor";
import { useAddCostCenter, useAddInventoryCategory, useAddInventoryManufacturer, useAddInventoryUnitType, useDeleteCostCenter, useDeleteInventoryCategory, useDeleteInventoryManufacturer, useDeleteInventoryUnitType, useGetCostCenters, useGetInventoryCategories, useGetInventoryManufacturers, useGetInventoryUnitTypes, useUpdateCostCenter, useUpdateInventoryCategory, useUpdateInventoryManufacturer, useUpdateInventoryUnitType } from "@/services/setups/inventory";
import { useAddPurchaseOrderShipVia, useDeletePurchaseOrderShipVia, useGetPurchaseOrderShipVias, useUpdatePurchaseOrderShipVia } from "@/services/setups/purchaseOrder";

// ==============================
// CONTENTS OBJECT WITH SERVICES
// ==============================
// const tabData: TabData[] = [
//   {
//     id: "employee",
//     name: "Employees",
//     subs: [
//       { id: "status", name: "Status" },
//       { id: "types", name: "Types" },
//       { id: "category", name: "Category" },
//       { id: "renewals", name: "Renewals" },
//     ],
//   },
// ];

const tabData = [
  { id: "accidentTypes", name: "Accident Types" },
  {
    id: "assignment",
    name: "Assignment",
    subs: [
      { id: "destinations", name: "Destinations" },
      { id: "types", name: "Types" },
    ],
  },
  { id: "costCentres", name: "Cost Centres" },
  {
    id: "employee",
    name: "Employees",
    subs: [
      { id: "status", name: "Status" },
      { id: "types", name: "Types" },
      { id: "category", name: "Category" },
      { id: "renewals", name: "Renewals" },
    ],
  },
  {
    id: "equipments",
    name: "Equipments",
    subs: [
      { id: "colors", name: "Colors" },
      { id: "masks", name: "Masks" },
      { id: "meterTypes", name: "Meter Types" },
      { id: "models", name: "Models" },
      { id: "renewals", name: "Renewals" },
      { id: "status", name: "Status" },
      { id: "types", name: "Types" },
    ],
  },
  {
    id: "fluids",
    name: "Fluids",
    subs: [
      { id: "types", name: "Types" },
      { id: "unitTypes", name: "Unit Types" },
    ],
  },
  { id: "generalExpenseTypes", name: "General Expense Types" },
  {
    id: "inventory",
    name: "Inventory",
    subs: [
      { id: "categories", name: "Categories" },
      { id: "manufacturers", name: "Manufacturers" },
      { id: "unitTypes", name: "Unit Types" },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    subs: [
      { id: "repairTypes", name: "Repair Types" },
      { id: "repairs", name: "Repairs" },
      { id: "taskTypes", name: "Task Types" },
    ],
  },
  {
    id: "purchaseOrders",
    name: "Purchase Orders",
    subs: [
      { id: "shippingMethods", name: "Shipping Methods" },
      { id: "terms", name: "Terms" },
    ],
  },
  { id: "vendorTypes", name: "Vendor Types" },
  {
    id: "workOrders",
    name: "Work Orders",
    subs: [
      { id: "customStatus", name: "Custom Status" },
      { id: "types", name: "Types" },
    ],
  },
];
export const contents = {
  "purchaseOrders:terms": {
    label: "Terms",
    component: () => (
      <GenericTab
        label="Terms"
        useGet={useGetPurchaseOrderTerms}
        useAdd={useAddPurchaseOrderTerm}
        useUpdate={useUpdatePurchaseOrderTerm}
        useDelete={useDeletePurchaseOrderTerm}
      />
    ),
  },
  vendorTypes: {
    label: "Vendor Types",
    component: () => (
      <GenericTab
        label="Vendor Types"
        useGet={useGetVendorTypes}
        useAdd={useAddVendorType}
        useUpdate={useUpdateVendorType}
        useDelete={useDeleteVendorType}
      />
    ),
  },
  "employee:status": {
    label: "Employee Status",
    component: () => (
      <GenericTab
        label="Employee Status"
        useGet={useGetEmployeeStatuses}
        useAdd={useAddEmployeeStatus}
        useUpdate={useUpdateEmployeeStatus}
        useDelete={useDeleteEmployeeStatus}
      />
    ),
  },
  "employee:category": {
    label: "Employee Category",
    component: () => (
      <GenericTab
        label="Employee Category"
        useGet={useGetEmployeeCategories}
        useAdd={useAddEmployeeCategory}
        useUpdate={useUpdateEmployeeCategory}
        useDelete={useDeleteEmployeeCategory}
      />
    ),
  },
  "employee:types": {
    label: "Employee Types",
    component: () => (
      <GenericTab
        label="Employee Types"
        useGet={useGetEmployeeTypes}
        useAdd={useAddEmployeeType}
        useUpdate={useUpdateEmployeeType}
        useDelete={useDeleteEmployeeType}
      />
    ),
  },
  "employee:renewals": {
    label: "Employee Renewals",
    component: () => (
      <GenericTab
        label="Employee Renewals"
        useGet={useGetEmployeeRenewals}
        useAdd={useAddEmployeeRenewal}
        useUpdate={useUpdateEmployeeRenewal}
        useDelete={useDeleteEmployeeRenewal}
      />
    ),
  },
  costCentres: {
    label: "Cost Centres",
    component: () => (
      <GenericTab
        label="Cost Centres "
        useGet={useGetCostCenters}
        useAdd={useAddCostCenter}
        useUpdate={useUpdateCostCenter}
        useDelete={useDeleteCostCenter}
      />
    ),
  },

   "purchaseOrders:shippingMethods" :{
    label: "Shipping Methods",
    component: () => (
      <GenericTab
        label="Shipping Methods"
        useGet={useGetPurchaseOrderShipVias}
        useAdd={useAddPurchaseOrderShipVia}
        useUpdate={useUpdatePurchaseOrderShipVia}
        useDelete={useDeletePurchaseOrderShipVia}
      />
    ),
  },
    "inventory:manufacturers" :{
    label: "Manufacturers",
    component: () => (
      <GenericTab
        label="Manufacturers"
        useGet={useGetInventoryManufacturers}
        useAdd={useAddInventoryManufacturer}
        useUpdate={useUpdateInventoryManufacturer}
        useDelete={useDeleteInventoryManufacturer}
      />
    ),
  },
     "inventory:categories" :{
    label: "Category",
    component: () => (
      <GenericTab
        label="Category"
        useGet={useGetInventoryCategories}
        useAdd={useAddInventoryCategory}
        useUpdate={useUpdateInventoryCategory}
        useDelete={useDeleteInventoryCategory}
      />
    ),
  },
       "inventory:unitTypes" :{
    label: "Unit Types",
    component: () => (
      <GenericTab
        label="Unit Types"
        useGet={useGetInventoryUnitTypes}
        useAdd={useAddInventoryUnitType}
        useUpdate={useUpdateInventoryUnitType}
        useDelete={useDeleteInventoryUnitType}
      />
    ),
  },
}

// ==============================
// TYPES
// ==============================
interface TabData {
  id: string;
  name: string;
  subs?: { id: string; name: string }[];
}

interface ContentItem {
  value: string;
  label: string;
}

interface DialogState {
  open: boolean;
  mode: "new" | "edit";
  input: string;
  editingId: string | null;
  loading: boolean;
}

interface Props {
  tabs: TabData[];
  contents: Record<string, any>;
}

// ==============================
// MAIN COMPONENT
// ==============================
export function TabbedMenuEditor({ tabs, contents }: Props) {
  // Always work with a safe array
  const safeTabs = tabs ?? [];

  // Safe default active tab
  const initialTab =
    safeTabs.length > 0
      ? safeTabs[0].subs && safeTabs[0].subs.length > 0
        ? `${safeTabs[0].id}:${safeTabs[0].subs[0].id}`
        : safeTabs[0].id
      : "";

  const [activeTab, setActiveTab] = useState<string>(initialTab ?? "");

  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    mode: "new",
    input: "",
    editingId: null,
    loading: false,
  });

  // Split the tab safely
  const [mainTabId, subTabId] = useMemo(() => {
    if (!activeTab) return ["", ""];
    const parts = activeTab.split(":");
    return [parts[0] ?? "", parts[1] ?? ""];
  }, [activeTab]);

  const isSubTab = Boolean(subTabId);
  const currentTab = isSubTab ? `${mainTabId}:${subTabId}` : mainTabId;

  const currentTabLabel = useMemo(() => {
    const main = safeTabs.find((t) => t.id === mainTabId || t.id === activeTab);
    const sub = main?.subs?.find((s) => s.id === subTabId);
    return isSubTab
      ? `${main?.name ?? ""} › ${sub?.name ?? ""}`
      : main?.name ?? "";
  }, [safeTabs, mainTabId, subTabId, activeTab, isSubTab]);

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

  // Guard ActiveTabComponent safely
  const ActiveTabComponent = contents?.[currentTab]?.component ?? null;

  if (safeTabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <p className="text-muted-foreground italic">No tabs available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-120px)] w-full bg-muted/20">
      {/* Tabs Section */}
      <aside className="w-64 h-[calc(100vh-120px)] overflow-scroll border-r border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Menu
        </h3>
        <nav className="space-y-0.5">
          {safeTabs.map((tab) => {
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
                      tab.subs && tab.subs.length > 0
                        ? `${tab.id}:${tab.subs[0].id}`
                        : tab.id
                    )
                  }
                >
                  {tab.name}
                </button>

                {tab.subs && activeMain && tab.subs.length > 0 && (
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
        {ActiveTabComponent ? (
          <ActiveTabComponent />
        ) : (
          <p className="text-muted-foreground italic">
            No content available for this tab.
          </p>
        )}
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

// ==============================
// CHOICE LIST WRAPPER
// ==============================
export default function ChoiceList() {
  return <TabbedMenuEditor tabs={tabData} contents={contents} />;
}

// ==============================
// TAB DATA (EXAMPLE)
// ==============================

// ==============================
// GENERIC TAB COMPONENT
// ==============================
export function GenericTab({
  label,
  useGet,
  useAdd,
  useUpdate,
  useDelete,
}: any) {
  const { data, isLoading } = useGet();
  const add = useAdd();
  const update = useUpdate();
  const remove = useDelete();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      update.mutate({ id, name: editValue });
      cancelEditing();
    }
  };

  const startAdding = () => {
    setIsAdding(true);
    setNewValue("");
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewValue("");
  };

  const saveNew = () => {
    if (newValue.trim()) {
      add.mutate({ name: newValue });
      cancelAdding();
    }
  };

  if (isLoading) return <p>Loading {label}...</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">{label}</h2>
        {!isAdding && (
          <div className="">
            <Button onClick={startAdding}>
              <Plus className="w-4 h-4 mr-2" /> Add {label}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add mode card */}
        {isAdding && (
          <Card className="border-2 border-dashed shadow-sm">
            <CardHeader className="pb-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter ${label} name`}
                autoFocus
              />
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={saveNew}
                disabled={!newValue.trim()}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelAdding}>
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing cards */}
        {(data ?? []).map((item: any) => (
          <Card key={item.id} className="shadow-sm border">
            <CardHeader className="pb-2">
              {editingId === item.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{item.name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {editingId === item.id ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => saveEdit(item.id)}
                    disabled={!editValue.trim()}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEditing}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(item)}
                  >
                    <FilePenIcon className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {label}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete “{item.name}”? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => remove.mutate({ id: item.id })}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
