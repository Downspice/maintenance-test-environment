"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { InventoryData, InventoryDataInterface } from "@/lib/domains/inventory/mock-data";

type SortField = keyof InventoryDataInterface | null;
type SortDirection = "asc" | "desc";

// Filter types

interface DataTableProps {
  realServer: boolean;
}

export function InventoryPageDataTable({ realServer }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<InventoryDataInterface[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] =
    useState<FilterOption>("All Due Equipment");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const rowsPerPage = 5;

  const sortData = (
    data: InventoryDataInterface[],
    field: SortField,
    direction: SortDirection
  ): InventoryDataInterface[] => {
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
      // const filteredData = filterData(InventoryData, filterOption);
      const sortedData = sortData(InventoryData, sortField, sortDirection);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setData(paginatedData);
      setTotalPages(Math.ceil(InventoryData.length / rowsPerPage));
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
      //   const filteredData = filterData(InventoryData, filter);
      const sortedData = sortData(InventoryData, field, direction);
      const startIndex = (page - 1) * limit;
      const paginatedData = sortedData.slice(startIndex, startIndex + limit);
      setData(paginatedData);
      setTotalPages(Math.ceil(InventoryData.length / limit));
    }, 300);
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

  const handleRowAction = (actionType: string, id: string) => {
    console.log(actionType, id);
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
                    Edit
                  </Button>
                </>
              ) : (
                // Show filter dropdown when no rows are selected
                <>
                  {/* <TableHead className="w-[50px]"></TableHead> */}
                  <SortableHeader field="id">Part#</SortableHeader>
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="bin">Bin</SortableHeader>
                  <SortableHeader field="category">Category</SortableHeader>
                  <SortableHeader field="manufacturers">
                    Manufacturers
                  </SortableHeader>
                  <SortableHeader field="quantity">Quantity</SortableHeader>
                  <SortableHeader field="unit_cost">Unit Cost</SortableHeader>
                  <SortableHeader field="vendor_names">Vendors</SortableHeader>
                  <TableHead>Actions</TableHead>
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
                    key={car.id + car.name}
                    className={
                      selectedRows.has(car.id)
                        ? "bg-muted/50  cursor-context-menu  "
                        : ""
                    }
                    onClick={() => handleInspectionClick(car.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(car.id)}
                        onCheckedChange={() => toggleRowSelection(car.id)}
                        aria-label={`Select ${car.name}`}
                      />
                    </TableCell>

                    <TableCell> {car.id}</TableCell>
                    <TableCell> {car.name}</TableCell>
                    <TableCell> {car.bin}</TableCell>
                    <TableCell> {car.category}</TableCell>
                    <TableCell> {car.manufacturers}</TableCell>
                    <TableCell> {car.quantity}</TableCell>
                    <TableCell> $ {car.unit_cost}</TableCell>
                    <TableCell> {car.vendor_names}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRowAction("edit", car.name)}
                          >
                            Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRowAction("renewal", car.name)}
                          >
                            Issuance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRowAction("attachment", car.name)
                            }
                          >
                            Purchase Order
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRowAction("attachment", car.name)
                            }
                          >
                            Transfer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRowAction("attachment", car.name)
                            }
                          >
                            Assign Equipment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRowAction("attachment", car.name)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {/* Pagination */}
      <div className="flex w-full items-center justify-between gap-4 px-1 py-3">
        <div className="flex items-center gap-4">
          <p className="text-paragraph-xs text-text-sub-600 shrink-0">
            Showing{" "}
            <span className="font-medium text-text-strong-950">
              {data.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-text-strong-950">
              {Math.min(currentPage * rowsPerPage, totalPages * rowsPerPage)}
            </span>{" "}
            out of{" "}
            <span className="font-medium text-text-strong-950">{totalPages * rowsPerPage}</span>
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
            RiArrowRightDoubleLine className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
