"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSheet } from "@/lib/sheet-providers";
import PurchaseOrderDataTable from "./table/purchaseOrderTable";
import { dateFilterOptionsList } from "@/lib/option-list";
import NewPurchaseOrderForm from "@/components/forms/actualForms/new-purchase-order-form";
import { useGetLocations } from "@/services/setups/vendor";

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
      content: <NewPurchaseOrderForm />,
    });
  };

  return (
    <div className="flex flex-col p-4 mx-auto py-10 space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>
        {/* <Badge>8</Badge> */}
      </div>

      <div className="flex justify-between items-center space-x-4">
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

          {/* Date Filter (Custom) */}
          <Select onValueChange={(val) => handleSelectChange("custom", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptionsList.map((option) => (
                <SelectItem value={option.id} key={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row space-x-0.5">
          {/* Search Input */}
          {/* <Input
            type="text"
            placeholder="Search ..."
            className="w-[240px]"
            value={filters.search}
            onChange={handleSearchChange}
          /> */}
          <Button onClick={createPurchaseOrder}>New Purchase Order</Button>
        </div>
      </div>
      <div>
        <PurchaseOrderDataTable
          locationId={filters.location || undefined}
          statusId={filters.status === "all" ? undefined : filters.status || undefined}
        />
      </div>
    </div>
  );
}
