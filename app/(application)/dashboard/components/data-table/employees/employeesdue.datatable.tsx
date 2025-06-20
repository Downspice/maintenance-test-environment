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

// Define the data structure
interface EmployeesDueItem {
  id: number;
  name: string;
  renewal: string;
  issued: string;
  expired: string;
}

type SortField = keyof EmployeesDueItem | null;
type SortDirection = "asc" | "desc";

// Mock inventory data

const mockEmployeesDueData: EmployeesDueItem[] = [
  {
    id: 1,
    name: "Alice Johnson",
    renewal: "CDL",
    issued: "2024-06-01",
    expired: "2025-05-31",
  },
  {
    id: 2,
    name: "Bob Smith",
    renewal: "Training",
    issued: "2024-07-15",
    expired: "2025-07-14",
  },
  {
    id: 3,
    name: "Charlie Williams",
    renewal: "Professional",
    issued: "2024-08-10",
    expired: "2025-08-09",
  },
  {
    id: 4,
    name: "Diana Rose",
    renewal: "Contract",
    issued: "2024-09-20",
    expired: "2025-09-19",
  },
  {
    id: 5,
    name: "Edward King",
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
const { openDialog } = useDialog()
  const [dialogSize, setDialogSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md")
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
      title: `Update User (${item.name}'s)` ,
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
                  Update Renewals ({selectedRows.size})
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
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.renewal}</TableCell>
                <TableCell>{item.issued}</TableCell>
                <TableCell>{item.expired}</TableCell>
                <TableCell className="text-right">
                  {" "}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenWorkOrderDialog(  item)}
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
