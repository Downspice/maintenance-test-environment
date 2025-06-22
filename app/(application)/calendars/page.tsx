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
import NewInspection from "@/components/forms/actualForms/new-inspection-form";
import NotCompleteMessage from "../workInProgress/page";

const locations = [
  { value: "delete_filter", label: "All Locations" },
  { value: "56533", label: "Location #1" },
  { value: "56534", label: "Location #2" },
  { value: "56532", label: "Main Location" },
];

export default function CalendarPage() {
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
      title: "Create Inspection",
      description: "Fill out the form below to create a Inspection order.",
      content: <NotCompleteMessage />,
    });
  };

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Calendar</h1>
      </div>

      <div className="flex justify-between items-center space-x-4">
        {/* Equipment Filter */}
        <div className="flex flex-row space-x-0.5">
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
      </div>
    </div>
  );
}
