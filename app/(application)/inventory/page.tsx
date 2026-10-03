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
import { useSheet } from "@/lib/providers/sheet-providers";
import InventoryDataTable from "./table/inventory-data-table";
import NewInventory from "@/components/forms/entities/new-inventory-form";
import { useGetLocations } from "@/services/setups/lookups";

const FilterOptions = [
  { name: "All Parts", id: "all" },
  { name: "Low-Stock", id: "low_stock" },
  { name: "Out of Stock", id: "out_of_stock" },
  { name: "PO Assigned", id: "po_assigned" },
];

export default function InventoryPage() {
  const { data: locationOptionsList } =
    useGetLocations<Array<{ id: string; name: string }>>();

  const [filters, setFilters] = useState({
    filterType: "all",
    location: "",
    search: "",
  });

  const [debouncedSearch] = useDebounce(filters.search, 500);
  const { openSheet } = useSheet();

  const buildURL = (updatedFilters: typeof filters) => {
    const queryParams = new URLSearchParams();

    if (updatedFilters.filterType && updatedFilters.filterType !== "all") {
      queryParams.set(updatedFilters.filterType, "1");
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

    const url = `/inventory?${queryParams.toString()}`;
    console.log("Generated URL:", url);
  };

  const handleSelectChange = (
    key: "filterType" | "location",
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

  const createInventory = () => {
    openSheet({
      title: "Create Inventory",
      description: "Fill out the form below to create a new Inventory.",
      className: "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none",
      content: <NewInventory formId="new-inventory-form" hideSubmitButton />,
      renderActions: (
        <Button form="new-inventory-form" type="submit" variant="primary">
          Save Inventory
        </Button>
      ),
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full p-4 md:p-6 space-y-4 overflow-hidden">
      <div className="flex flex-row items-center space-x-2 shrink-0">
        <h1 className="text-xl font-semibold">Inventories</h1>
        <Badge>9</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4 shrink-0">
        <div className="flex flex-row space-x-0.5">
          {/* Status Filter */}
          <Select
            onValueChange={(val) => handleSelectChange("filterType", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Parts" />
            </SelectTrigger>
            <SelectContent>
              {FilterOptions.map((item) => (
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
          <Button onClick={createInventory}>New Inventory</Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <InventoryDataTable
          locationId={filters.location || undefined}
          filterType={
            filters.filterType === "all" ? undefined : filters.filterType
          }
        />
      </div>
    </div>
  );
}
