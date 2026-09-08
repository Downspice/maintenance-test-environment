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
import InvoicesDataTable from "./table/invoices-data-table";

import NewInvoiceForm from "@/components/forms/entities/new-invoice-form";
import PaymentReceivedTable from "./views/payments-received-data-table";
import { useGetLocations } from "@/services/setups/lookups";

const ActiveDropdown = [
  {
    name: "Outstanding",
    id: "Out of Stock",
  },
  {
    name: "Paid in Full",
    id: "PO Assigned",
  },
];

export default function EmployeesPage() {
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
      title: "Create Invoice",
      description: "Fill out the form below to create a new Invoice.",
      content: <NewInvoiceForm formId="new-invoice-form" hideSubmitButton />,
      renderActions: (
        <Button form="new-invoice-form" type="submit" variant="primary">
          Save Invoice
        </Button>
      ),
    });
  };

  const managePayments = () => {
    console.log("ïn the function");
    openSheet({
      title: "Manage Payments",
      description: "Fill out the form below to create a payment.",
      content: (
        <div className="flex flex-end">
          <PaymentReceivedTable />
        </div>
      ),
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 container mx-auto p-4 md:p-6 space-y-4 overflow-hidden">
      <div className="flex flex-row items-center space-x-2 shrink-0">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Badge>10</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4 shrink-0">
        {/* Equipment Filter */}

        <div className="flex flex-row space-x-0.5">
          {/* Location Filter */}
          <Select onValueChange={(val) => handleSelectChange("equipment", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Outstanding" />
            </SelectTrigger>
            <SelectContent>
              {ActiveDropdown.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {/* Search Input */}

          <Button onClick={createEquipment}>New</Button>
          <Button onClick={managePayments}>Manage Payments</Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <InvoicesDataTable />
      </div>
    </div>
  );
}
