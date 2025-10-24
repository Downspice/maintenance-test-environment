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
import { EquipmentPageDataTable } from "./components/equipment.page.dataTable";
import WorkOrderForm from "@/components/forms/actualForms/work-order-form";
import { useSheet } from "@/lib/sheet-providers";
import EquipmentForm from "@/app/(application)/equipment/components/new-equipment-form";
import WorkOrdersTable from "./components/work-orders-table";
import NotCompleteMessage from "../workInprogress/working";import WorkOrderDataTable from "./components/table/workOrderTable";
import NewWorkOrderForm from "@/components/forms/actualForms/work-order-form";

const equipmentActiveDropdown = [
  { id: "Active", name: "All Outstanding" },
  { id: "due", name: "Open" },
  { id: "work_order_assigned", name: "In Progress" },
  { id: "parent_equipment", name: "On Hold" },
  { id: "In Shop", name: "Assigned" },
  { id: "Inactive", name: "Inactive" },
  { id: "Out of Service", name: "Unassigned" },
  { id: "Sold", name: "Closed" },
];

const locations = [
  { id: "delete_filter", name: "All Locations" },
  { id: "56533", name: "Location #1" },
  { id: "56534", name: "Location #2" },
  { id: "56532", name: "Main Location" },
];

export default function EquipmentPage() {
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
    id: string
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
      title: "Create New Work Order",
      description: "Fill out the form below to create a new work order.",
      content: <NotCompleteMessage />,
    });
  };

  return (
    <div className="flex flex-col container mx-auto py-10 space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Work Orders</h1>
        <Badge>5</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4">
        {/* Equipment Filter */}
        <div className="flex flex-row space-x-0.5">
          <Select onValueChange={(val) => handleSelectChange("equipment", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Outstanding" />
            </SelectTrigger>
            <SelectContent>
              {equipmentActiveDropdown.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select onValueChange={(val) => handleSelectChange("location", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
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
          <NewWorkOrderForm />
        </div>
      </div>
      <div>
        {/* <WorkOrdersTable/> */}
        <WorkOrderDataTable />
      </div>
    </div>
  );
}
