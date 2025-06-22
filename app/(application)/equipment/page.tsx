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
import NewEquipmentSheet from "@/components/forms/sheets/newEquipmentForm";
import FormSheet from "@/components/form-sheet";
import EquipmentForm from "./components/new-equipment-form";
import NotCompleteMessage from "../workInProgress/page";
import NewEquipmentDataTable from "./components/table/equipmentDatatable";
import UpdateMeters from "./components/update-meters-form";

const equipmentActiveDropdown = [
  { value: "my", label: "My" },
  { value: "Active", label: "Active" },
  { value: "due", label: "Due" },
  { value: "work_order_assigned", label: "Work Order Assigned" },
  { value: "parent_equipment", label: "Parent" },
  { value: "In Shop", label: "In Shop" },
  { value: "Inactive", label: "Inactive" },
  { value: "Out of Service", label: "Out of Service" },
  { value: "Sold", label: "Sold" },
  { value: "Transferred", label: "Transferred" },
  { value: "deleted", label: "Deleted" },
  { value: "all", label: "All" },
];

const locations = [
  { value: "delete_filter", label: "All Locations" },
  { value: "56533", label: "Location #1" },
  { value: "56534", label: "Location #2" },
  { value: "56532", label: "Main Location" },
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
      title: "Create New Equipment",
      description: "Fill out the form below to create a new equipment.",
      content: <NotCompleteMessage />,
    });
  };

  return (
    <div className="flex flex-col container mx-auto py-10 space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Equipment</h1>
        <Badge>10</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4">
        {/* Equipment Filter */}
        <div className="flex flex-row space-x-0.5">
          <Select onValueChange={(val) => handleSelectChange("equipment", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              {equipmentActiveDropdown.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
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
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-2">
          {/* Search Input
          <Input
            type="text"
            placeholder="Search Equipment..."
            className="w-[240px]"
            value={filters.search}
            onChange={handleSearchChange}
          /> */}
          <EquipmentForm />
           <UpdateMeters/>
        </div>
      </div>
      <div>
        {/* <EquipmentPageDataTable realServer={false} /> */}
        <NewEquipmentDataTable />
      </div>
    </div>
  );
}
