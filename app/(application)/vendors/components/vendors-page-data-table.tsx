"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  ArrowUp,
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
import { Badge } from "@/components/ui/badge";



// Define the data structure
interface Task {
  id: string;
  title: string;
  type: "maintenance" | "incident" | "inspection" | "renewal" | "pm";
  instructions: string;
  assignedTo: string;
  dueDate: string;
}

interface SingleTask {
  id: string;
  number: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
}

interface Inspection {
  id: string;
  result: "pass" | "fail" | "pending";
  date: string;
}

interface CarData {
  id: number;
  date: string;
  name: string;
  carModel: string;
  carNumber: string;
  tasksPending: number;
  carImage: string;
  phone: string;
  contact:string;
  type:string; 
  workOrderAssignee: "Yes" | "No";
   taskTypes: ("maintenance" | "incident" | "inspection" | "renewal" | "pm")[];
  tasks?: Task[]; // Added tasks array for sub-rows
  keywords: string[];
  phone: string;
  singleTask?: SingleTask;
  inspection?: Inspection;
}

type SortField = keyof CarData | null;
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

 

// Mock car data with tasks
const mockCarData: CarData[] = [
  {
    id: 1,
    contact: "Joseph Kweku",
    name: "Toyota Camry",
    workOrderAssignee: "Yes",
    date: "12-03-2024",
    carModel: "2020",
    carNumber: "KAB 123A",
    tasksPending: 3,
    carImage: "/placeholder.svg?height=60&width=100",
    type: "due soon",
    taskTypes: ["maintenance", "incident", "pm"],
    keywords: ["sedan", "fuel-efficient", "reliable"],
    phone: " ", 
  },
  {
    id: 2,
    name: "Honda Accord",
    contact: "Owusu Ansah",
    workOrderAssignee: "Yes",
    date: "10-01-2024",
    carModel: "2019",
    carNumber: "KCE 456B",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    type: "overdue",
    taskTypes: ["maintenance"],
    keywords: ["sedan", "hybrid", "economical"],
    phone: "0577210669",
    singleTask: {
      id: "task-002",
      number: "T-2025-002",
      status: "overdue",
    },
    inspection: {
      id: "insp-002",
      result: "fail",
      date: "2025-05-15",
    },
    tasks: [
      {
        id: "2-1",
        title: "Transmission Service",
        type: "maintenance",
        instructions: "Flush transmission fluid and replace filter",
        assignedTo: "John Mechanic",
        dueDate: "2025-05-15",
      },
    ],
  },
  {
    id: 3,
    name: "Mazda CX-5",
    contact: "Abed Sal",
    workOrderAssignee: "Yes",
    date: "4-03-2024",
    carModel: "2021",
    carNumber: "KBX 789C",
    tasksPending: 2,
    carImage: "/placeholder.svg?height=60&width=100",
    type: "due soon",
    taskTypes: ["incident", "inspection"],
    keywords: ["suv", "awd", "compact"],
    phone: "0577210669",
    singleTask: {
      id: "task-003",
      number: "T-2025-003",
      status: "in-progress",
    },
    inspection: {
      id: "insp-003",
      result: "pending",
      date: "2025-05-22",
    },
    tasks: [
      {
        id: "3-1",
        title: "Window Repair",
        type: "incident",
        instructions: "Replace broken driver side window",
        assignedTo: "Tom Glass",
        dueDate: "2025-05-24",
      },
      {
        id: "3-2",
        title: "Annual Safety Inspection",
        type: "inspection",
        instructions: "Complete annual safety inspection checklist",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-27",
      },
    ],
  },
  {
    id: 4,
    contact: "Salam",
    workOrderAssignee: "Yes",
    name: "Subaru Forester",
    date: "16-03-2024",
    carModel: "2018",
    carNumber: "KDD 321D",
    tasksPending: 4,
    carImage: "/placeholder.svg?height=60&width=100",
    type: "overdue",
    taskTypes: ["maintenance", "incident", "pm"],
    keywords: ["suv", "awd", "safety"],
    phone: "0577210669",
    singleTask: {
      id: "task-004",
      number: "T-2025-004",
      status: "completed",
    },
    inspection: {
      id: "insp-004",
      result: "pass",
      date: "2025-05-18",
    },
    tasks: [
      {
        id: "4-1",
        title: "Tire Rotation",
        type: "pm",
        instructions: "Rotate tires and check pressure",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-10",
      },
      {
        id: "4-2",
        title: "Air Filter Replacement",
        type: "maintenance",
        instructions: "Replace cabin and engine air filters",
        assignedTo: "John Mechanic",
        dueDate: "2025-05-12",
      },
      {
        id: "4-3",
        title: "Headlight Repair",
        type: "incident",
        instructions: "Replace broken headlight assembly",
        assignedTo: "Tom Glass",
        dueDate: "2025-05-14",
      },
      {
        id: "4-4",
        title: "Battery Replacement",
        type: "maintenance",
        instructions: "Replace dead battery",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-16",
      },
    ],
  },
  {
    id: 5,
    name: "Ford Ranger",
    workOrderAssignee: "Yes",
    contact: "Yaw Sarfo",
    date: "10-03-2024",
    carModel: "2022",
    carNumber: "KCZ 654E",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    type: "due soon",
    taskTypes: ["incident"],
    keywords: ["truck", "4wd", "utility"],
    phone: " ",
    singleTask: {
      id: "task-005",
      number: "T-2025-005",
      status: "pending",
    },
    inspection: {
      id: "insp-005",
      result: "pass",
      date: "2025-05-19",
    },
    tasks: [
      {
        id: "5-1",
        title: "Bumper Repair",
        type: "incident",
        instructions: "Fix damaged rear bumper",
        assignedTo: "Sarah Bodyshop",
        dueDate: "2025-05-29",
      },
    ],
  },
];

interface DataTableProps {
  realServer: boolean;
}

export function VendorPageDataTable({ realServer }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
   const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<CarData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] =
    useState<FilterOption>("All Due Equipment");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const rowsPerPage = 5;

  // Filter data based on selected option
  const filterData = (data: CarData[], option: FilterOption): CarData[] => {
    switch (option) {
      case "Due":
        return data.filter((car) => car.type === "overdue");
      case "Due Soon":
        return data.filter((car) => car.type === "due soon");
      case "Repairs Due":
        return data.filter((car) => car.taskTypes.includes("incident"));
      case "PM Due":
        return data.filter((car) => car.taskTypes.includes("pm"));
      case "Renewals Due":
        return data.filter((car) => car.taskTypes.includes("renewal"));
      case "Inspections Pending":
        return data.filter((car) => car.taskTypes.includes("inspection"));
      case "All Due Equipment":
      default:
        return data;
    }
  };

  const sortData = (
    data: CarData[],
    field: SortField,
    direction: SortDirection
  ): CarData[] => {
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
      const filteredData = filterData(mockCarData, filterOption);
      const sortedData = sortData(filteredData, sortField, sortDirection);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
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
      const filteredData = filterData(mockCarData, filter);
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

  // Get count of items for each filter option
  const getFilterCounts = () => {
    return {
      all: mockCarData.length,
      due: mockCarData.filter((car) => car.type === "overdue").length,
      dueSoon: mockCarData.filter((car) => car.type === "due soon")
        .length,
      repairs: mockCarData.filter((car) => car.taskTypes.includes("incident"))
        .length,
      pm: mockCarData.filter((car) => car.taskTypes.includes("pm")).length,
      renewals: mockCarData.filter((car) => car.taskTypes.includes("renewal"))
        .length,
      inspections: mockCarData.filter((car) =>
        car.taskTypes.includes("inspection")
      ).length,
    };
  };

  const counts = getFilterCounts();

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
                    New PO
                  </Button>
                  <Button variant="default" className="w-auto">
                    Edit
                  </Button>
                </>
              ) : (
                // Show filter dropdown when no rows are selected
                <>
                  {/* <TableHead className="w-[50px]"></TableHead> */}
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="contact">Contact</SortableHeader>
                  <SortableHeader field="type">Type</SortableHeader>
                  <SortableHeader field="workOrderAssignee">Work Order Assignee</SortableHeader>
                  <SortableHeader field="phone">Phone</SortableHeader>
                  <SortableHeader field="keywords">Keywords</SortableHeader>  
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
                    key={car.id + car.date}
                    className={selectedRows.has(car.id) ? "bg-muted/50  cursor-pointer " : ""}
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
                      <div className="flex">
                       {car.name}</div>
                    </TableCell>
                    <TableCell>
                      {car.contact}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className="w-fit">{car.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{car.workOrderAssignee}</TableCell>
                    <TableCell>{car.phone}</TableCell>
                    <TableCell>{car.keywords}</TableCell>
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
