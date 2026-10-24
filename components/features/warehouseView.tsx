"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Info,
  Plus,
  Check,
  ArrowLeft,
  FilePenIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import type { WarehouseRecord } from "@/lib/schemas/warehouse-schema";
import { WarehouseFormModal } from "@/components/forms/setup/warehouse-setup-modals";
import {
  useDeleteWarehouse,
  useGetWarehouses,
} from "@/services/setups/inventory";

interface Contact {
  id: string;
  name: string;
  email: string;
  type: "employee" | "customer" | "vendor";
}

interface NotificationContact {
  id: string;
  name: string;
  email: string;
}

const SEED_WAREHOUSES: WarehouseRecord[] = [
  {
    id: "1",
    name: "Main Distribution Center",
    location: "New York, NY",
    status: "active",
  },
  {
    id: "2",
    name: "West Coast Hub",
    location: "Los Angeles, CA",
    status: "active",
  },
  {
    id: "3",
    name: "Midwest Facility",
    location: "Chicago, IL",
    status: "inactive",
  },
  {
    id: "4",
    name: "Southeast Center",
    location: "Atlanta, GA",
    status: "active",
  },
  {
    id: "5",
    name: "Northeast Branch",
    location: "Boston, MA",
    status: "active",
  },
  {
    id: "6",
    name: "Pacific Northwest",
    location: "Seattle, WA",
    status: "active",
  },
  {
    id: "7",
    name: "Texas Operations",
    location: "Dallas, TX",
    status: "inactive",
  },
  {
    id: "8",
    name: "Florida Hub",
    location: "Miami, FL",
    status: "active",
  },
];

function mapApiWarehouse(item: { id: string; name: string }): WarehouseRecord {
  const seed = SEED_WAREHOUSES.find((w) => w.id === String(item.id));
  return {
    id: String(item.id),
    name: item.name,
    location: seed?.location ?? "",
    status: seed?.status ?? "active",
    notificationUserIds: seed?.notificationUserIds,
  };
}

function WarehouseRowActions({
  warehouse,
  onEdit,
  onDelete,
}: {
  warehouse: WarehouseRecord;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={`Edit ${warehouse.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <FilePenIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={`Delete ${warehouse.name}`}
        className="text-destructive focus:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

const WarehouseSetup: React.FC = () => {
  const confirmDialog = useConfirmDialog();
  const deleteWarehouse = useDeleteWarehouse();
  const { data: warehouseOptions } =
    useGetWarehouses<Array<{ id: string; name: string }>>();

  const [warehouses, setWarehouses] =
    useState<WarehouseRecord[]>(SEED_WAREHOUSES);
  const [activeTab, setActiveTab] = useState<string>("warehouses");
  const [currentView, setCurrentView] = useState<"list" | "selection">("list");
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseRecord | null>(null);
  const [activeSelectionTab, setActiveSelectionTab] = useState<
    "employees" | "customers" | "vendors"
  >("employees");
  const [selectedContacts, setSelectedContacts] = useState<{
    [key: string]: string[];
  }>({
    employees: [],
    customers: [],
    vendors: [],
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editWarehouse, setEditWarehouse] = useState<WarehouseRecord | null>(
    null
  );

  useEffect(() => {
    if (!warehouseOptions?.length) return;
    setWarehouses((prev) => {
      const byId = new Map(prev.map((w) => [w.id, w]));
      return warehouseOptions.map((opt) => {
        const existing = byId.get(String(opt.id));
        if (existing) {
          return { ...existing, name: opt.name };
        }
        return mapApiWarehouse(opt);
      });
    });
  }, [warehouseOptions]);

  const notificationContacts: NotificationContact[] = [
    { id: "1", name: "John Smith", email: "john.smith@company.com" },
    { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
    { id: "3", name: "Mike Davis", email: "mike.davis@company.com" },
    { id: "4", name: "Emily Brown", email: "emily.brown@company.com" },
  ];

  const allContacts: Contact[] = [
    {
      id: "1",
      name: "Alice Wilson",
      email: "alice.wilson@company.com",
      type: "employee",
    },
    {
      id: "2",
      name: "Bob Chen",
      email: "bob.chen@company.com",
      type: "employee",
    },
    {
      id: "3",
      name: "Carol Martinez",
      email: "carol.martinez@company.com",
      type: "employee",
    },
    {
      id: "4",
      name: "David Lee",
      email: "david.lee@company.com",
      type: "employee",
    },
    {
      id: "5",
      name: "Emma Taylor",
      email: "emma.taylor@customer.com",
      type: "customer",
    },
    {
      id: "6",
      name: "Frank Miller",
      email: "frank.miller@customer.com",
      type: "customer",
    },
    {
      id: "7",
      name: "Grace Anderson",
      email: "grace.anderson@customer.com",
      type: "customer",
    },
    {
      id: "8",
      name: "Henry Garcia",
      email: "henry.garcia@customer.com",
      type: "customer",
    },
    {
      id: "9",
      name: "Ivy Thompson",
      email: "ivy.thompson@vendor.com",
      type: "vendor",
    },
    {
      id: "10",
      name: "Jack Wilson",
      email: "jack.wilson@vendor.com",
      type: "vendor",
    },
    {
      id: "11",
      name: "Kate Rodriguez",
      email: "kate.rodriguez@vendor.com",
      type: "vendor",
    },
    {
      id: "12",
      name: "Leo Martinez",
      email: "leo.martinez@vendor.com",
      type: "vendor",
    },
  ];

  const handleWarehouseClick = (warehouse: WarehouseRecord) => {
    setSelectedWarehouse(warehouse);
    setActiveTab(`notifications-${warehouse.id}`);
  };

  const handleNewContactClick = () => {
    setCurrentView("selection");
    setSelectedContacts({ employees: [], customers: [], vendors: [] });
  };

  const handleContactSelection = (
    contactId: string,
    type: "employees" | "customers" | "vendors"
  ) => {
    setSelectedContacts((prev) => ({
      ...prev,
      [type]: prev[type].includes(contactId)
        ? prev[type].filter((id) => id !== contactId)
        : [...prev[type], contactId],
    }));
  };

  const handleConfirmSelection = () => {
    console.log("Selected contacts:", selectedContacts);
    setCurrentView("list");
    setSelectedContacts({ employees: [], customers: [], vendors: [] });
  };

  const handleCancelSelection = () => {
    setCurrentView("list");
    setSelectedContacts({ employees: [], customers: [], vendors: [] });
  };

  const handleDeleteContact = (contactId: string) => {
    console.log("Delete contact:", contactId);
  };

  const upsertWarehouse = (record: WarehouseRecord) => {
    setWarehouses((prev) => {
      const idx = prev.findIndex((w) => w.id === record.id);
      if (idx === -1) return [...prev, record];
      const next = [...prev];
      next[idx] = record;
      return next;
    });
    if (selectedWarehouse?.id === record.id) {
      setSelectedWarehouse(record);
    }
  };

  const handleDeleteWarehouse = (warehouse: WarehouseRecord) => {
    void (async () => {
      const ok = await confirmDialog({
        title: "Delete warehouse?",
        description: `Are you sure you want to delete "${warehouse.name}"? Inventory linked to this warehouse may need to be reassigned.`,
        confirmText: "Delete warehouse",
        tone: "danger",
        item: {
          name: warehouse.name,
          description: warehouse.location || undefined,
        },
      });
      if (!ok) return;

      await deleteWarehouse.mutateAsync({ id: warehouse.id });

      setWarehouses((prev) => prev.filter((w) => w.id !== warehouse.id));
      if (selectedWarehouse?.id === warehouse.id) {
        setSelectedWarehouse(null);
        setActiveTab("warehouses");
      }
      toast.success(`Deleted "${warehouse.name}"`);
    })();
  };

  const renderWarehouseList = () => (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Warehouses</CardTitle>
        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 size-4" />
          New warehouse
        </Button>
      </CardHeader>
      <CardContent>
        <div className="max-h-[80dvh] space-y-2 overflow-y-auto">
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              role="button"
              tabIndex={0}
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl p-4",
                "bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200",
                "cursor-pointer transition-colors hover:bg-bg-weak-50"
              )}
              onClick={() => handleWarehouseClick(warehouse)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleWarehouseClick(warehouse);
                }
              }}
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-text-strong-950">
                  {warehouse.name}
                </h3>
                {warehouse.location ? (
                  <p className="mt-0.5 truncate text-sm text-text-sub-600">
                    {warehouse.location}
                  </p>
                ) : null}
              </div>
              <WarehouseRowActions
                warehouse={warehouse}
                onEdit={() => setEditWarehouse(warehouse)}
                onDelete={() => handleDeleteWarehouse(warehouse)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationView = () => {
    if (currentView === "selection") {
      return (
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Contacts</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelSelection}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeSelectionTab}
              onValueChange={(value) =>
                setActiveSelectionTab(value as typeof activeSelectionTab)
              }
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
              </TabsList>

              {(["employees", "customers", "vendors"] as const).map((type) => (
                <TabsContent key={type} value={type} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium capitalize">{type}</h3>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add {type.slice(0, -1)}
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allContacts
                          .filter(
                            (contact) => contact.type === type.slice(0, -1)
                          )
                          .map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedContacts[type].includes(
                                    contact.id
                                  )}
                                  onCheckedChange={() =>
                                    handleContactSelection(contact.id, type)
                                  }
                                />
                              </TableCell>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelSelection}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSelection}>
                <Check className="mr-2 h-4 w-4" />
                OK
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>
                Email Notifications - {selectedWarehouse?.name}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Contacts who receive inventory and warehouse alerts for this
                location.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificationContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell
                    className="w-px whitespace-nowrap"
                    style={{ width: "1%" }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      type="button"
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <Button onClick={handleNewContactClick}>
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          {selectedWarehouse && (
            <TabsTrigger value={`notifications-${selectedWarehouse.id}`}>
              Email Notifications - {selectedWarehouse.name}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="warehouses" className="mt-6">
          {renderWarehouseList()}
        </TabsContent>

        {selectedWarehouse && (
          <TabsContent
            value={`notifications-${selectedWarehouse.id}`}
            className="mt-6"
          >
            {renderNotificationView()}
          </TabsContent>
        )}
      </Tabs>

      <WarehouseFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSuccess={upsertWarehouse}
      />
      <WarehouseFormModal
        open={!!editWarehouse}
        onOpenChange={(open) => {
          if (!open) setEditWarehouse(null);
        }}
        mode="edit"
        warehouse={editWarehouse}
        onSuccess={upsertWarehouse}
      />
    </>
  );
};

export default WarehouseSetup;
