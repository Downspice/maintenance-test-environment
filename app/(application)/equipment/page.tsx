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
import { useSheet } from "@/lib/providers/sheet-providers";
import EquipmentFormWrapper from "@/components/forms/fields/equipment-form-wrapper";
import NewEquipmentDataTable from "./components/table/equipment-data-table";
import UpdateMeters from "@/components/forms/entities/equipment/update-meters-form";

import { useGetLocations } from "@/services/setups/lookups";

export const equipmentActiveDropdown = [
  { id: "my", name: "My" },
  { id: "Active", name: "Active" },
  { id: "due", name: "Due" },
  { id: "work_order_assigned", name: "Work Order Assigned" },
  { id: "parent_equipment", name: "Parent" },
  { id: "In Shop", name: "In Shop" },
  { id: "Inactive", name: "Inactive" },
  { id: "Out of Service", name: "Out of Service" },
  { id: "Sold", name: "Sold" },
  { id: "Transferred", name: "Transferred" },
  { id: "deleted", name: "Deleted" },
  { id: "all", name: "All" },
];

export default function EquipmentPage() {
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();

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
    key: "equipment" | "location" | "custom" | "search",
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

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full p-4 md:p-6 space-y-4 overflow-hidden">
      <div className="flex flex-row items-center space-x-2 shrink-0">
        <h1 className="text-xl font-semibold">Equipment</h1>
      </div>

      <div className="flex justify-between items-center space-x-4 shrink-0">
        {/* Equipment Filter */}
        <div className="flex flex-row space-x-0.5">
          <Select onValueChange={(val) => handleSelectChange("equipment", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Active" />
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
              {locationOptionsList?.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-2">
          <EquipmentFormWrapper />
          <UpdateMeters />
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <NewEquipmentDataTable locationId={filters.location || undefined} />
      </div>
    </div>
  );
}
