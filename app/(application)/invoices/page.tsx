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
import { useSheet } from "@/lib/sheet-providers";
import InvoicesDataTable from "./table/invoicesDataTable";
import { locationOptionsList } from "@/lib/option-list";
import NewInvoiceForm from "@/components/forms/actualForms/new-invoice-form";
import PaymentReceivedTable from "./view/payments-received-dataTable"; 

const ActiveDropdown = [
  {
    label: "Outstanding",
    value: "Out of Stock",
  },
  {
    label: "Paid in Full",
    value: "PO Assigned",
  },
];

export default function EmployeesPage() {
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

  const createEquipment = () => {
    console.log("ïn the function");
    openSheet({
      title: "Create Invoice",
      description: "Fill out the form below to create a new Invoice.",
      content: <NewInvoiceForm />,
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
    <div className="flex flex-col container mx-auto py-10 space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Badge>10</Badge>
      </div>

      <div className="flex justify-between items-center space-x-4">
        {/* Equipment Filter */}

        <div className="flex flex-row space-x-0.5">
          {/* Location Filter */}
          <Select onValueChange={(val) => handleSelectChange("equipment", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Outstanding" />
            </SelectTrigger>
            <SelectContent>
              {ActiveDropdown.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(val) => handleSelectChange("location", val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              {locationOptionsList.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
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
      <div>
        <InvoicesDataTable />
      </div>
    </div>
  );
}
