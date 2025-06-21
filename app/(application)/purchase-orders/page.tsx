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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/lib/sheet-providers";
import { InspectionPageDataTable } from "./components/inspections.page.dataTable";
import NewInspection from "@/components/forms/actualForms/new-inspection-form";
import { VendorPageDataTable } from "./components/vendors.page.datatable";
import NewVendor from "@/components/forms/actualForms/new-vendor-form";
import { PurchaseOrderPageDataTable } from "./component/purchase.order.page.dataTable";
import NewPurchaseOrderForm from "@/components/forms/actualForms/new-purchase-order-form";
import NotCompleteMessage from "../messages/page";
 
const ActiveDropdown = [
  { "label": "My Incomplete", "value": "my_open" },
  { "label": "My Requisition", "value": "my_requisition" },
  { "label": "Incomplete", "value": "open" },
  { "label": "Approval", "value": "approval" },
  { "label": "Requisition", "value": "requisition" },
  { "label": "Ordered", "value": "ordered" },
  { "label": "Received", "value": "received" },
  { "label": "Closed", "value": "closed" },
  { "label": "All", "value": "all" }
]

const locations = [
  { "label": "All Warehouses", "value": "all" },
  { "label": "Warehouse #1", "value": "40307" },
  { "label": "Warehouse #2", "value": "40308" }
]
;

export default function EmployeesPage() {
  const [filters, setFilters] = useState({
    equipment: "",
    location: "",
    custom: "",
    search: "",
  });

  const [debouncedSearch] = useDebounce(filters.search, 500);
  const { openSheet } = useSheet();

  const buildURL = (updatedFilters: typeof filters) => {
    const queryParams = new URLSearchParams();

    if (updatedFilters.equipment) {
      queryParams.set("filter_equipment", updatedFilters.equipment);
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

    const url = `/equipment?${queryParams.toString()}`;
    console.log("Generated URL:", url);
    // Use this URL to fetch or navigate
  };

  const handleSelectChange = (
    key: "equipment" | "location" | "custom",
    value: string
  ) => {
    if (value === "new") {
      console.log("Launching new location modal...");
      return;
    }

    const updated = { ...filters, [key]: value };
    setFilters(updated);

    if (key !== "search") {
      buildURL(updated);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  // Rebuild URL when debounced search changes
  useEffect(() => {
    buildURL({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  const createEquipment = () => {
    console.log("ïn the function");
    openSheet({
      title: "Create Purchase Order",
      description: "Fill out the form below to create a new Purchase Order.",
      content: <NotCompleteMessage />,
    });
  };

  return (
    <div className="pt-4 px-4 flex flex-col space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>
        <Badge>8</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4">
        {/* Equipment Filter */}

        <div className="flex flex-row space-x-0.5">
          {/* Location Filter */}
          <Select onValueChange={(val) => handleSelectChange("equipment", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {ActiveDropdown.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => handleSelectChange("location", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* New Location Trigger */}
          <Select onValueChange={(val) => handleSelectChange("custom", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new" className="text-blue-500 font-medium">
                + New Filter
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-0.5">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search ..."
            className="w-[240px]"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <Button onClick={createEquipment}>New</Button>
        </div>
      </div>
      <div>
        <PurchaseOrderPageDataTable />
      </div>
    </div>
  );
}
