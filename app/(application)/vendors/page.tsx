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

import VendorDataTable from "./components/vendor-data-table";
import NewVendor from "@/components/forms/entities/new-vendor-form";
import { useGetLocations, useGetVendorTypes } from "@/services/setups/lookups";

export default function VendorsPage() {
  const {
    data: vendorTypeOptions,
    isLoading,
    error: vendorTypesError,
  } = useGetVendorTypes<Array<{ id: string; name: string }>>();
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();
  console.log("vendorTypeOptions", vendorTypeOptions);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    search: "",
  });

  const [debouncedSearch] = useDebounce(filters.search, 500);
  const { openSheet } = useSheet();

  const buildURL = (updatedFilters: typeof filters) => {
    const queryParams = new URLSearchParams();

    if (
      updatedFilters.location &&
      updatedFilters.location !== "delete_filter"
    ) {
      queryParams.set("location_id", updatedFilters.location);
    }

    if (updatedFilters.type && updatedFilters.type !== "delete_filter") {
      queryParams.set("type_id", updatedFilters.type);
    }

    if (updatedFilters.search.trim()) {
      queryParams.set("search", updatedFilters.search.trim());
    }

    const url = `/vendors?${queryParams.toString()}`;
    console.log("Generated URL:", url);
  };

  const handleSelectChange = (
    key: "location" | "type" | "search",
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
      title: "Create Vendor",
      description: "Fill out the form below to create a new Vendor.",
      className: "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none",
      content: <NewVendor formId="new-vendor-form" hideSubmitButton />,
      renderActions: (
        <Button form="new-vendor-form" type="submit" variant="primary">
          Save Vendor
        </Button>
      ),
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full p-4 md:p-6 space-y-4 overflow-hidden">
      <div className="flex flex-row items-center space-x-2 shrink-0">
        <h1 className="text-xl font-semibold">Vendors</h1>
        {/* <Badge>10</Badge> */}
      </div>

      <div className="flex justify-between items-center space-x-4 shrink-0">
        {/* Equipment Filter */}
        <div className="flex flex-row space-x-0.5">
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

          {/* New Location Trigger */}
          <Select onValueChange={(val) => handleSelectChange("type", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              {vendorTypeOptions?.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-0.5">
          <Button onClick={createEquipment}>Create New Vendor</Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <VendorDataTable
          locationId={filters.location || undefined}
          typeId={filters.type || undefined}
        />
      </div>
    </div>
  );
}
