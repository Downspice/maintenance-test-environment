"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Info,
  PenToolIcon as Tool,
  AlertTriangle,
  Filter,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Calendar,
  Pen,
  RecycleIcon,
  File,
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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Employee } from "@/lib/work-orders-data";

type SortField = keyof Employee | null;
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

const employeesData: Employee[] = [
  {
    id: 250365,
    name: "Brad Cooke",
    first_name: "Brad",
    last_name: "Cooke",
    location: "Main Location",
    tech: "Yes",
    email: null,
    login: "",
    login_type: "Inactive",
    last_active_at: null,
    last_active_at_sort: null,
    labor_rate: 0.0,
    status: "Active",
    DT_RowId: "user-250365",
    DT_RowData: {
      remote: true,
      url: "/Employee/250365",
    },
  },
  {
    id: 250366,
    name: "David Cooke",
    first_name: "David",
    last_name: "Cooke",
    location: "Main Location",
    tech: "Yes",
    email: null,
    login: "",
    login_type: "Inactive",
    last_active_at: null,
    last_active_at_sort: null,
    labor_rate: 75.0,
    status: "Active",
    DT_RowId: "user-250366",
    DT_RowData: {
      remote: true,
      url: "/Employee/250366",
    },
  },
  {
    id: 250364,
    name: "kofi panyin",
    first_name: "kofi",
    last_name: "panyin",
    location: "Location #1, Location #2, Main Location",
    tech: "Yes",
    email: "festuspanyin@gmail.com",
    login: "festuspanyin@gmail.com",
    login_type: "Owner",
    last_active_at: "less than a minute",
    last_active_at_sort: "2025-06-12 09:17:02 UTC",
    labor_rate: 0.0,
    status: "Active",
    DT_RowId: "user-250364",
    DT_RowData: {
      remote: true,
      url: "/Employee/250364",
    },
  },
  {
    id: 250367,
    name: "Amara Johnson",
    first_name: "Amara",
    last_name: "Johnson",
    location: "Branch A",
    tech: "No",
    email: "amara.johnson@example.com",
    login: "amara.johnson@example.com",
    login_type: "Employee",
    last_active_at: "1 hour ago",
    last_active_at_sort: "2025-06-12 08:15:00 UTC",
    labor_rate: 45.5,
    status: "Inactive",
    DT_RowId: "user-250367",
    DT_RowData: {
      remote: true,
      url: "/Employee/250367",
    },
  },
  {
    id: 250368,
    name: "Kwame Mensah",
    first_name: "Kwame",
    last_name: "Mensah",
    location: "Location #2",
    tech: "Yes",
    email: "kwame.mensah@example.com",
    login: "kwame.mensah@example.com",
    login_type: "Admin",
    last_active_at: "2 days ago",
    last_active_at_sort: "2025-06-10 11:00:00 UTC",
    labor_rate: 60.0,
    status: "Active",
    DT_RowId: "user-250368",
    DT_RowData: {
      remote: true,
      url: "/Employee/250368",
    },
  },
  {
    id: 250369,
    name: "Linda Nartey",
    first_name: "Linda",
    last_name: "Nartey",
    location: "Main Location, Branch B",
    tech: "No",
    email: null,
    login: "",
    login_type: "Inactive",
    last_active_at: null,
    last_active_at_sort: null,
    labor_rate: 50.0,
    status: "Inactive",
    DT_RowId: "user-250369",
    DT_RowData: {
      remote: true,
      url: "/Employee/250369",
    },
  },
  {
    id: 250370,
    name: "Samir Diallo",
    first_name: "Samir",
    last_name: "Diallo",
    location: "Branch C",
    tech: "Yes",
    email: "samir.diallo@example.com",
    login: "samir.diallo@example.com",
    login_type: "Employee",
    last_active_at: "5 minutes ago",
    last_active_at_sort: "2025-06-12 09:12:00 UTC",
    labor_rate: 70.0,
    status: "Active",
    DT_RowId: "user-250370",
    DT_RowData: {
      remote: true,
      url: "/Employee/250370",
    },
  },
  {
    id: 250371,
    name: "Grace Osei",
    first_name: "Grace",
    last_name: "Osei",
    location: "Remote",
    tech: "No",
    email: "grace.osei@example.com",
    login: "grace.osei@example.com",
    login_type: "Contractor",
    last_active_at: "3 hours ago",
    last_active_at_sort: "2025-06-12 06:20:00 UTC",
    labor_rate: 40.0,
    status: "Active",
    DT_RowId: "user-250371",
    DT_RowData: {
      remote: true,
      url: "/Employee/250371",
    },
  },
];

interface DataTableProps {
  realServer: boolean;
}

export function EmployeePageDataTable({ realServer }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] =
    useState<FilterOption>("All Due Equipment");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const rowsPerPage = 5;

  const sortData = (
    data: Employee[],
    field: SortField,
    direction: SortDirection
  ): Employee[] => {
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
      // const filteredData = filterData(employeesData, filterOption);
      const sortedData = sortData(employeesData, sortField, sortDirection);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setData(paginatedData);
      setTotalPages(Math.ceil(employeesData.length / rowsPerPage));
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
      const filteredData = filterData(employeesData, filter);
      const sortedData = sortData(filteredData, field, direction);
      const startIndex = (page - 1) * limit;
      const paginatedData = sortedData.slice(startIndex, startIndex + limit);
      setData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / limit));
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
      <div className="rounded-md border">
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
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="status">Status</SortableHeader>
                  <SortableHeader field="login">Login</SortableHeader>
                  <SortableHeader field="tech">
                    Work Order Assignee
                  </SortableHeader>
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
                    key={car.id + car.tech}
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

                    <TableCell>
                      <div className="flex">{car.name}</div>
                    </TableCell>
                    <TableCell>{car.status}</TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className="w-fit">{car.login}</Badge>
                        {car.email}
                      </div>
                    </TableCell>
                    <TableCell>{car.tech}</TableCell>
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
                            onClick={() =>
                              handleRowAction("edit", car.first_name)
                            }
                          >
                            <Pen className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRowAction("renewal", car.first_name)
                            }
                          >
                            <RecycleIcon className="mr-2 h-4 w-4" />
                            Renewals
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRowAction("attachment", car.first_name)
                            }
                          >
                            <File className="mr-2 h-4 w-4" />
                            Attachments
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
