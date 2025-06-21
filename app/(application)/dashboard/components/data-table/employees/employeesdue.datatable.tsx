"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShoppingCart,
} from "lucide-react";

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
import { useDialog } from "@/lib/dialog-provider";
import UpdateEmployeeForm from "@/components/forms/actualForms/update-employee";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// Define the data structure
interface EmployeesDueItem {
  id: number;
  name: string;
  phone: string;
  cell: string;
  email: string;
  status: string;
  type: string; // e.g., "Technician"
  DLClass: string; // e.g., "A"
  DWClass: string; // e.g., "WY"
  hireDate: string; // format: YYYY-MM-DD
  address: string;
  city: string;
  stateProv: string;
  postalCode: string;
  renewal: string;
  issued: string; // format: YYYY-MM-DD
  expired: string; // format: YYYY-MM-DD
}

type SortField = keyof EmployeesDueItem | null;
type SortDirection = "asc" | "desc";

// Mock inventory data
const mockEmployeesDueData: EmployeesDueItem[] = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "555-123-4567",
    cell: "555-987-6543",
    email: "alice.johnson@example.com",
    status: "Active",
    type: "Technician",
    DLClass: "A",
    DWClass: "WY",
    hireDate: "2020-03-15",
    address: "123 Maple St",
    city: "Cheyenne",
    stateProv: "WY",
    postalCode: "82001",
    renewal: "CDL",
    issued: "2024-06-01",
    expired: "2025-05-31",
  },
  {
    id: 2,
    name: "Bob Smith",
    phone: "555-234-5678",
    cell: "555-876-5432",
    email: "bob.smith@example.com",
    status: "Active",
    type: "Technician",
    DLClass: "A",
    DWClass: "WY",
    hireDate: "2019-07-10",
    address: "456 Oak Ave",
    city: "Laramie",
    stateProv: "WY",
    postalCode: "82070",
    renewal: "Training",
    issued: "2024-07-15",
    expired: "2025-07-14",
  },
  {
    id: 3,
    name: "Charlie Williams",
    phone: "555-345-6789",
    cell: "555-765-4321",
    email: "charlie.williams@example.com",
    status: "Active",
    type: "Technician",
    DLClass: "A",
    DWClass: "WY",
    hireDate: "2018-11-20",
    address: "789 Pine Rd",
    city: "Casper",
    stateProv: "WY",
    postalCode: "82601",
    renewal: "Professional",
    issued: "2024-08-10",
    expired: "2025-08-09",
  },
  {
    id: 4,
    name: "Diana Rose",
    phone: "555-456-7890",
    cell: "555-654-3210",
    email: "diana.rose@example.com",
    status: "Active",
    type: "Technician",
    DLClass: "A",
    DWClass: "WY",
    hireDate: "2021-01-05",
    address: "321 Birch Blvd",
    city: "Gillette",
    stateProv: "WY",
    postalCode: "82718",
    renewal: "Contract",
    issued: "2024-09-20",
    expired: "2025-09-19",
  },
  {
    id: 5,
    name: "Edward King",
    phone: "555-567-8901",
    cell: "555-543-2109",
    email: "edward.king@example.com",
    status: "Active",
    type: "Technician",
    DLClass: "A",
    DWClass: "WY",
    hireDate: "2022-05-22",
    address: "654 Cedar Ln",
    city: "Rock Springs",
    stateProv: "WY",
    postalCode: "82901",
    renewal: "Professional",
    issued: "2024-10-05",
    expired: "2025-10-04",
  },
];

interface EmployeesDueDataTableProps {
  realServer: boolean;
}

export function EmployeesDataTable({ realServer }: EmployeesDueDataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<EmployeesDueItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 8;

  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { openDialog } = useDialog();
  const [dialogSize, setDialogSize] = useState<
    "sm" | "md" | "lg" | "xl" | "full"
  >("md");
  const sortData = (
    data: EmployeesDueItem[],
    field: SortField,
    direction: SortDirection
  ): EmployeesDueItem[] => {
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

      // Handle arrays (like vendors)
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

  // Load data based on pagination
  useEffect(() => {
    if (realServer) {
      // Simulate server-side pagination and sorting
      fetchServerData(currentPage, rowsPerPage, sortField, sortDirection);
    } else {
      // Client-side pagination and sorting
      const sortedData = sortData(
        mockEmployeesDueData,
        sortField,
        sortDirection
      );
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setData(paginatedData);
      setTotalPages(Math.ceil(mockEmployeesDueData.length / rowsPerPage));
    }
  }, [currentPage, realServer, sortField, sortDirection]);

  // Simulate fetching data from server
  const fetchServerData = (
    page: number,
    limit: number,
    field: SortField = null,
    direction: SortDirection = "asc"
  ) => {
    console.log(
      `Fetching inventory page ${page} with limit ${limit}, sorting by ${field} ${direction}`
    );

    // Simulate API delay
    setTimeout(() => {
      const sortedData = sortData(mockEmployeesDueData, field, direction);
      const startIndex = (page - 1) * limit;
      const paginatedData = sortedData.slice(startIndex, startIndex + limit);
      setData(paginatedData);
      setTotalPages(Math.ceil(mockEmployeesDueData.length / limit));
    }, 300);
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

  // Create new purchase order

  const createNewPO = () => {
    console.log(
      "Creating new purchase order for part IDs:",
      Array.from(selectedRows)
    );
    setSelectedRows(new Set()); // Clear selections after action
  };

  // Handle row actions

  const handleOpenWorkOrderDialog = (item: EmployeesDueItem) => {
    console.log("Creating updating Employee order for:", item);
    openDialog({
      title: `Update User (${item.name}'s)`,
      description: `Fill out the form to update an ${item.name}'s due date`,
      content: <UpdateEmployeeForm />,
      size: dialogSize,
    });
  };

  // Select all rows on current page
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = data.map((item) => item.id);
      setSelectedRows(new Set(allIds));
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (realServer) {
      // This would trigger the server-side pagination callback
      fetchServerData(page, rowsPerPage, sortField, sortDirection);
    }
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

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
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
    <div className="space-y-4 shadow-primary">
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
                <Button onClick={createNewPO} size="sm">
                  Email ({selectedRows.size})
                </Button>
              ) : (
                <>
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="renewal">Renewal</SortableHeader>
                  <SortableHeader field="issued">Issued</SortableHeader>
                  <SortableHeader field="expired">Expired</SortableHeader>
                  <TableHead className="text-right">Action </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className={selectedRows.has(item.id) ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.id)}
                    onCheckedChange={() => toggleRowSelection(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <Popover>
                      <PopoverTrigger>
                        <span className="w-fit flex flex-row text-primary text-bold hover:shadow cursor-pointer">
                          {item.id}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="bg-white">
                        <div className="grid gap-2">
                          <div className="space-y-1">
                            <h4 className="leading-none font-medium">
                              {item.name}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              Short details of the employee.
                            </p>
                          </div>
                          <div className="grid space-y-0.5">
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Employee #</Label>
                              <span className="col-span-2  ">{item.id}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Phone #</Label>
                              <span className="col-span-2  ">
                                {item.phone}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Email</Label>
                              <span className="col-span-2  ">
                                {item.email}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Status</Label>
                              <span className="col-span-2  ">
                                {item.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">DL Class</Label>
                              <span className="col-span-2  ">
                                {item.DLClass}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">DW state</Label>
                              <span className="col-span-2  ">
                                {item.DWClass}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Hire Date</Label>
                              <span className="col-span-2  ">
                                {item.hireDate}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Address</Label>
                              <span className="col-span-2  ">
                                {item.address}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">City</Label>
                              <span className="col-span-2  ">
                                {item.city}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">State/Prov</Label>
                              <span className="col-span-2  ">
                                {item.stateProv}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-1">
                              <Label htmlFor="width">Postal Code</Label>
                              <span className="col-span-2  ">
                                {item.postalCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div>{item.name}</div>
                  </div>
                </TableCell>
                <TableCell>{item.renewal}</TableCell>
                <TableCell>{item.issued}</TableCell>
                <TableCell>{item.expired}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenWorkOrderDialog(item)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
