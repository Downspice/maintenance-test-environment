"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { cn } from "@/lib/shared/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


import {
  PurchaseOrderData,
  PurchaseOrderInterface,
} from "@/lib/domains/purchase-order/purchaseOrder-data";

type SortField = keyof PurchaseOrderInterface | null;
type SortDirection = "asc" | "desc";

// Filter types
type FilterOption =
  | "All Due Equipment"
  | "Due"
  | "Due Soon"
  | "Repairs Due"
  | "PM Due"
  | "Renewals Due"
  | "Inspections Pending";

interface DataTableProps {
  realServer: boolean;
}

export function PurchaseOrderPageDataTable({ realServer }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<PurchaseOrderInterface[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] =
    useState<FilterOption>("All Due Equipment");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const rowsPerPage = 5;

  const sortData = (
    data: PurchaseOrderInterface[],
    field: SortField,
    direction: SortDirection
  ): PurchaseOrderInterface[] => {
    if (!field) return data;

    return [...data].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle arrays (like taskTypes or keywords)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aString = aValue.join(",");
        const bString = bValue.join(",");
        return direction === "asc"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }

      return 0;
    });
  };

  // Load data based on pagination and filter
  useEffect(() => {
    if (realServer) {
      // Simulate server-side pagination, filtering, and sorting
      fetchServerData(
        currentPage,
        rowsPerPage,
        filterOption,
        sortField,
        sortDirection
      );
    } else {
      // Client-side pagination, filtering, and sorting
      //   const filteredData = filterData(PurchaseOrderData, filterOption);
      const sortedData = sortData(PurchaseOrderData, sortField, sortDirection);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setData(paginatedData);
      setTotalPages(Math.ceil(PurchaseOrderData.length / rowsPerPage));
    }
  }, [currentPage, realServer, filterOption, sortField, sortDirection]);

  // Simulate fetching data from server
  const fetchServerData = (
    page: number,
    limit: number,
    filter: FilterOption,
    field: SortField = null,
    direction: SortDirection = "asc"
  ) => {
    console.log(
      `Fetching page ${page} with limit ${limit}, filter ${filter}, sorting by ${field} ${direction}`
    );

    // Simulate API delay
    setTimeout(() => {
      //   const filteredData = filterData(PurchaseOrderData, filter);
      const sortedData = sortData(PurchaseOrderData, field, direction);
      const startIndex = (page - 1) * limit;
      const paginatedData = sortedData.slice(startIndex, startIndex + limit);
      setData(paginatedData);
      setTotalPages(Math.ceil(PurchaseOrderData.length / limit));
    }, 300);
  };

  // Handle filter change
  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSort = (field: SortField) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set to ascending by default
      setSortField(field);
      setSortDirection("asc");
    }

    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Handle inspection link click
  const handleInspectionClick = (inspectionDate: number) => {
    console.log("Navigating to inspection:", inspectionDate);
    // In a real app, you would use router.push with the inspection date
    window.location.href = `/inspection/${inspectionDate}`;
  };

  // Toggle row selection
  const toggleRowSelection = (id: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  // Select all rows on current page
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = data.map((car) => car.id);
      setSelectedRows(new Set(allIds));
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (realServer) {
      // This would trigger the server-side pagination callback
      fetchServerData(
        page,
        rowsPerPage,
        filterOption,
        sortField,
        sortDirection
      );
    }
  };

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {sortField === field && (
          <span className="ml-1">
            {sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>

              {selectedRows.size > 0 ? (
                // Show actions dropdown when rows are selected
                <>
                  <Button variant="default" className="w-auto">
                    Print
                  </Button>
                </>
              ) : (
                // Show filter dropdown when no rows are selected
                <>
                  <SortableHeader field="sequential_id">Number</SortableHeader>
                  <SortableHeader field="created_on">Created</SortableHeader>
                  <SortableHeader field="required_on">Required</SortableHeader>
                  <SortableHeader field="invoice_number">
                    Invoice
                  </SortableHeader>
                  <SortableHeader field="vendor_name">Vendor</SortableHeader>
                  <SortableHeader field="warehouse_name">
                    Warehouse
                  </SortableHeader>
                  <SortableHeader field="status">Status</SortableHeader>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No vehicles match the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              data.map((car) => (
                <>
                  <TableRow
                    key={car.id + car.sequential_id}
                    className={
                      selectedRows.has(car.id)
                        ? "bg-muted/50  cursor-pointer "
                        : ""
                    }
                    onClick={() => handleInspectionClick(car.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(car.id)}
                        onCheckedChange={() => toggleRowSelection(car.id)}
                        aria-label={`Select ${car.sequential_id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex">{car.sequential_id}</div>
                    </TableCell>
                    <TableCell>{car.created_on}</TableCell>
                    <TableCell>{car.required_on}</TableCell>
                    <TableCell>{car.invoice_number}</TableCell>
                    <TableCell>{car.vendor_name}</TableCell>
                    <TableCell>{car.warehouse_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          car.status.toLocaleLowerCase() !== "requisition"
                            ? "outline"
                            : "default"
                        }
                      >
                        {car.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 bg-bg-white-0 border-t border-stroke-soft-200">
        <div className="flex items-center gap-4">
          <p className="text-paragraph-xs text-text-sub-600 shrink-0">
            Showing{" "}
            <span className="font-medium text-text-strong-950">
              {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-text-strong-950">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{" "}
            out of{" "}
            <span className="font-medium text-text-strong-950">{filteredData.length}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-lg bg-bg-weak-50 border border-stroke-soft-200 shadow-regular-xs text-label-xs text-text-sub-600 hover:bg-bg-soft-200 hover:text-text-strong-950 transition-all cursor-pointer",
              currentPage === 1 && "opacity-40 pointer-events-none"
            )}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <RiArrowLeftDoubleLine className="size-3.5" />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg bg-bg-weak-50 border border-stroke-soft-200 shadow-regular-xs text-label-xs text-text-sub-600 hover:bg-bg-soft-200 hover:text-text-strong-950 transition-all cursor-pointer",
              currentPage === 1 && "opacity-40 pointer-events-none"
            )}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <RiArrowLeftSLine className="size-3.5" />
            Previous
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg bg-bg-weak-50 border border-stroke-soft-200 shadow-regular-xs text-label-xs text-text-sub-600 hover:bg-bg-soft-200 hover:text-text-strong-950 transition-all cursor-pointer",
              currentPage === totalPages && "opacity-40 pointer-events-none"
            )}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <RiArrowRightSLine className="size-3.5" />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-lg bg-bg-weak-50 border border-stroke-soft-200 shadow-regular-xs text-label-xs text-text-sub-600 hover:bg-bg-soft-200 hover:text-text-strong-950 transition-all cursor-pointer",
              currentPage === totalPages && "opacity-40 pointer-events-none"
            )}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <RiArrowRightDoubleLine className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
