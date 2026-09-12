"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/lib/providers/sheet-providers";
import PurchaseOrderDataTable from "./table/purchase-order-data-table";
import NewPurchaseOrderForm from "@/components/forms/entities/new-purchase-order-form";
import { useGetLocations } from "@/services/setups/lookups";

const ActiveDropdown = [
  { name: "Open", id: "my_open" },
  { name: "Requisition", id: "my_requisition" },
  { name: "Ordered", id: "open" },
  { name: "Received Partial", id: "approval" },
  { name: "Closed", id: "closed" },
  { name: "All", id: "all" },
];

export default function PurchaseOrdersPage() {
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();

  const [filters, setFilters] = useState({
    status: "",
    location: "",
    custom: "",
    search: "",
  });

  const [debouncedSearch] = useDebounce(filters.search, 500);
  const { openSheet } = useSheet();

  const buildURL = (updatedFilters: typeof filters) => {
    const queryParams = new URLSearchParams();

    if (updatedFilters.status && updatedFilters.status !== "all") {
      queryParams.set("status_id", updatedFilters.status);
    }

    if (
      updatedFilters.location &&
      updatedFilters.location !== "delete_filter"
    ) {
      queryParams.set("location_id", updatedFilters.location);
    }

    if (updatedFilters.search.trim()) {
      queryParams.set("search", updatedFilters.search.trim());
    }

    const url = `/purchase-orders?${queryParams.toString()}`;
    console.log("Generated URL:", url);
    // In a real app, you might use router.push(url) here to update the URL
  };

  const handleSelectChange = (
    key: "status" | "location" | "custom",
    value: string
  ) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    buildURL(updated);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  // Rebuild URL when debounced search changes
  useEffect(() => {
    buildURL({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  const createPurchaseOrder = () => {
    openSheet({
      title: "Create Purchase Order",
      description: "Fill out the form below to create a new Purchase Order.",
      className: "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none",
      content: (
        <NewPurchaseOrderForm
          formId="new-purchase-order-form"
          hideSubmitButton
        />
      ),
      renderActions: (
        <Button form="new-purchase-order-form" type="submit" variant="primary">
          Save Purchase Order
        </Button>
      ),
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 container mx-auto p-4 md:p-6 space-y-4 overflow-hidden">
      <div className="flex flex-row items-center space-x-2 shrink-0">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>
        {/* <Badge>8</Badge> */}
      </div>

      <div className="flex justify-between items-center space-x-4 shrink-0">
        {/* Filters */}
        <div className="flex flex-row space-x-0.5">
          {/* Status Filter */}
          <Select onValueChange={(val) => handleSelectChange("status", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {ActiveDropdown.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select onValueChange={(val) => handleSelectChange("location", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              {locationOptionsList?.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row space-x-0.5">
          <Button onClick={createPurchaseOrder}>New Purchase Order</Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <PurchaseOrderDataTable
          locationId={filters.location || undefined}
          statusId={
            filters.status === "all" ? undefined : filters.status || undefined
          }
        />
      </div>
    </div>
  );
}
