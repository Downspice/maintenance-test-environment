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
import WorkOrderDataTable from "./components/table/workOrderTable";
import { ActualWorkOrderForm } from "@/components/forms/actualForms/work-order-form";
import { useGetLocations } from "@/services/setups/vendor";
import { useGetWorkOrderStatuses } from "@/services/setups/workOrder";

export default function WorkOrdersPage() {
  const {
    data: locationOptionsList,
  } = useGetLocations<Array<{ id: string; name: string }>>();

  const {
    data: statusOptionsList,
  } = useGetWorkOrderStatuses<Array<{ id: string; name: string }>>();

  const [filters, setFilters] = useState({
    status: "",
    location: "",
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

    const url = `/work-orders?${queryParams.toString()}`;
    console.log("Generated URL:", url);
  };

  const handleSelectChange = (
    key: "status" | "location",
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

  const createWorkOrder = () => {
    openSheet({
      title: "Create New Work Order",
      description: "Fill out the form below to create a new work order.",
      content: <ActualWorkOrderForm />,
    });
  };

  return (
    <div className="flex flex-col container mx-auto py-10 space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Work Orders</h1>
        <Badge>5</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4">
        <div className="flex flex-row space-x-0.5">
          {/* Status Filter */}
          <Select onValueChange={(val) => handleSelectChange("status", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptionsList?.map((item) => (
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
        <div className="flex flex-row space-x-0.5">
          {/* Search Input */}
          {/* <Input
            type="text"
            placeholder="Search ..."
            className="w-[240px]"
            value={filters.search}
            onChange={handleSearchChange}
          /> */}
          <Button onClick={createWorkOrder}>New Work Order</Button>
        </div>
      </div>
      <div>
        <WorkOrderDataTable
          locationId={filters.location || undefined}
          statusId={filters.status === "all" ? undefined : filters.status || undefined}
        />
      </div>
    </div>
  );
}
