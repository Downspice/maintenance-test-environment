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
import { useSheet } from "@/lib/sheet-providers";
import EquipmentForm from "./components/new-equipment-form";
import NewEquipmentDataTable from "./components/table/equipmentDatatable";
import UpdateMeters from "./components/update-meters-form";
 
import { useGetLocations } from "@/services/setups/vendor";

export const equipmentActiveDropdown = [
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

export default function EquipmentPage() {
      const { 
    data: locationOptionsList, 
    isLoading:locationOptionsListLoading, 
    error: locationOptionsListError
  } = useGetLocations<Array<{ id: string, name: string }>>();
  
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
              {locationOptionsList.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-2">
          <EquipmentForm />
          <UpdateMeters />
        </div>
      </div>
      <div>
        {/* <EquipmentPageDataTable realServer={false} /> */}
        <NewEquipmentDataTable />
      </div>
    </div>
  );
}
