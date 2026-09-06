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
import NewEmployeeForm from "@/components/forms/entities/new-employee-form";
 
import EmployeeDataTable from "./components/employee-data-table";
import {
  useGetLocations,
} from "@/services/setups/lookups";
import { useGetEmployeeTypes } from "@/services/setups/employee";

export default function EmployeesPage() {
  const {
    data: employeeTypeOptions,
    isLoading: employeeTypesLoading,
    error: employeeTypesError,
  } = useGetEmployeeTypes<Array<{ id: string; name: string }>>();
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();

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

    const url = `/employees?${queryParams.toString()}`;
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
      title: "Create Employee",
      description: "Fill out the form below to create a new Employee.",
      content: <NewEmployeeForm />,
    });
  };

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Employees</h1>
        {/* <Badge>10</Badge> */}
      </div>

      <div className="flex justify-between items-center space-x-4">
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

          {/* Employee Type Filter */}
          <Select onValueChange={(val) => handleSelectChange("type", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {employeeTypeOptions?.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row space-x-0.5">
          <Button onClick={createEquipment}>Create New Employee</Button>
        </div>
      </div>
      <div>
        <EmployeeDataTable locationId={filters.location || undefined} typeId={filters.type || undefined} />
      </div>
    </div>
  );
}
