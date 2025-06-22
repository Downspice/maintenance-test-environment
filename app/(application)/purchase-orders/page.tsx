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
import NotCompleteMessage from "../workInprogress/working";import PurchaseOrderDataTable from "./table/purchaseOrderTable";
import { dateFilterOptionsList, locationOptionsList } from "@/lib/option-list";

const ActiveDropdown = [
  { label: "Open", value: "my_open" },
  { label: "Requisition", value: "my_requisition" },
  { label: "Ordered", value: "open" },
  { label: "Received Partial", value: "approval" },
  { label: "Closed", value: "closed" },
  { label: "All", value: "all" },
];

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
    <div className="flex flex-col container mx-auto py-10 space-y-4">
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
              {locationOptionsList.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* New Location Trigger */}
          <Select onValueChange={(val) => handleSelectChange("custom", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptionsList.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-0.5">
          {/* Search Input
          <Input
            type="text"
            placeholder="Search ..."
            className="w-[240px]"
            value={filters.search}
            onChange={handleSearchChange}
          /> */}
          <Button onClick={createEquipment}>New</Button>
        </div>
      </div>
      <div>
        {/* <PurchaseOrderPageDataTable /> */}
        <PurchaseOrderDataTable />
      </div>
    </div>
  );
}
