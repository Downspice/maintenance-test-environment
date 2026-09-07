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
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
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
  carName: string;
  carModel: string;
  carNumber: string;
  tasksPending: number;
  carImage: string;
  taskStatus: "due soon" | "overdue";
  taskTypes: ("maintenance" | "incident" | "inspection" | "renewal" | "pm")[];
  tasks?: Task[]; // Added tasks array for sub-rows
  keywords: string[];
  meters: string;
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

// Action options
const actionOptions = [
  "Repair Request",
  "Work Order",
  "Inspection: DVIR Vehicle",
  "Fuel Transaction",
  "Fluid Entry",
  "Expense",
  "Update Meters",
  "Accident",
  "Duplicate",
  "Edit",
  "Task Setup",
  "Last Performed",
];

// Mock car data with tasks
const mockCarData: CarData[] = [
  {
    id: 1,
    carName: "Toyota Camry",
    carModel: "2020",
    carNumber: "KAB 123A",
    tasksPending: 3,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["maintenance", "incident", "pm"],
    keywords: ["sedan", "fuel-efficient", "reliable"],
    meters: "45,230 mi 1,250 hr",
    singleTask: {
      id: "task-001",
      number: "T-2025-001",
      status: "pending",
    },
    inspection: {
      id: "insp-001",
      result: "pass",
      date: "2025-05-20",
    },
    tasks: [
      {
        id: "1-1",
        title: "Oil Change",
        type: "pm",
        instructions: "Change oil and replace filter",
        assignedTo: "John Mechanic",
        dueDate: "2025-05-25",
      },
      {
        id: "1-2",
        title: "Brake Inspection",
        type: "maintenance",
        instructions: "Check brake pads and rotors",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-26",
      },
      {
        id: "1-3",
        title: "Accident Damage",
        type: "incident",
        instructions: "Repair front bumper damage",
        assignedTo: "Sarah Bodyshop",
        dueDate: "2025-05-28",
      },
    ],
  },
  {
    id: 2,
    carName: "Honda Accord",
    carModel: "2019",
    carNumber: "KCE 456B",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["maintenance"],
    keywords: ["sedan", "hybrid", "economical"],
    meters: "62,180 mi 2,100 hr",
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
    carName: "Mazda CX-5",
    carModel: "2021",
    carNumber: "KBX 789C",
    tasksPending: 2,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["incident", "inspection"],
    keywords: ["suv", "awd", "compact"],
    meters: "28,450 mi 890 hr",
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
    carName: "Subaru Forester",
    carModel: "2018",
    carNumber: "KDD 321D",
    tasksPending: 4,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["maintenance", "incident", "pm"],
    keywords: ["suv", "awd", "safety"],
    meters: "78,920 mi 3,200 hr",
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
    carName: "Ford Ranger",
    carModel: "2022",
    carNumber: "KCZ 654E",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["incident"],
    keywords: ["truck", "4wd", "utility"],
    meters: "15,680 mi 520 hr",
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

export function EquipmentPageDataTable({ realServer }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
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
        return data.filter((car) => car.taskStatus === "overdue");
      case "Due Soon":
        return data.filter((car) => car.taskStatus === "due soon");
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

  // Handle action dropdown selection
  const handleActionSelect = (action: string, car: CarData) => {
    console.log("Action:", action);
    console.log("Row data:", car);
  };

  // Handle task link click
  const handleTaskClick = (taskId: string) => {
    console.log("Navigating to task:", taskId);
    // In a real app, you would use router.push(`/task/${taskId}`)
    window.location.href = `/task/${taskId}`;
  };

  // Handle inspection link click
  const handleInspectionClick = (inspectionDate: string) => {
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

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Action: ${action}`);
    console.log("Selected car IDs:", Array.from(selectedRows));

    // Clear selections after action is performed
    setSelectedRows(new Set());
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get badge variant for task status
  const getTaskStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "overdue":
        return "destructive";
      case "pending":
      default:
        return "outline";
    }
  };

  // Get badge variant for inspection result
  const getInspectionResultVariant = (result: string) => {
    switch (result) {
      case "pass":
        return "default";
      case "fail":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }
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
      due: mockCarData.filter((car) => car.taskStatus === "overdue").length,
      dueSoon: mockCarData.filter((car) => car.taskStatus === "due soon")
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
                    New PO
                  </Button>
                  <Button variant="default" className="w-auto">
                    Edit
                  </Button>
                </>
              ) : (
                // Show filter dropdown when no rows are selected
                <>
                  <TableHead className="w-[50px]"></TableHead>
                  <SortableHeader field="carName">Vehicle</SortableHeader>
                  <SortableHeader field="keywords">Keywords</SortableHeader>
                  <SortableHeader field="meters">Meters</SortableHeader>
                  <TableHead>Task</TableHead>
                  <TableHead>Inspections</TableHead>
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
                    key={car.id}
                    className={selectedRows.has(car.id) ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(car.id)}
                        onCheckedChange={() => toggleRowSelection(car.id)}
                        aria-label={`Select ${car.carName}`}
                      />
                    </TableCell>
                    <TableCell>
                      {car.tasks && car.tasks.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRowExpansion(car.id)}
                          aria-label={
                            expandedRows.has(car.id)
                              ? "Collapse row"
                              : "Expand row"
                          }
                        >
                          {expandedRows.has(car.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={car.carImage || "/placeholder.svg"}
                            alt={car.carName}
                            className="h-16 w-8 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="font-medium text-sm text-gray-600">
                            {car.carNumber} • {car.carModel}
                          </div>
                          <div className="font-semibold">{car.carName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {car.keywords.map((keyword, index) => (
                          <Badge
                            key={index+keyword}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{car.meters}</div>
                    </TableCell>
                    <TableCell>
                      {car.singleTask && (
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={getTaskStatusVariant(
                              car.singleTask.status
                            )}
                            className="w-fit"
                          >
                            {car.singleTask.status}
                          </Badge>
                          <Button
                            onClick={() => handleTaskClick(car.singleTask!.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 underline text-left"
                          >
                            {car.singleTask.number}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {car.inspection && (
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={getInspectionResultVariant(
                              car.inspection.result
                            )}
                            className="w-fit"
                          >
                            {car.inspection.result}
                          </Badge>
                          <Button
                            onClick={() =>
                              handleInspectionClick(car.inspection!.date.toString)
                            }
                            className="text-sm text-blue-600 hover:text-blue-800 underline text-left"
                          >
                            {formatDate(car.inspection.date)}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {actionOptions.map((action) => (
                            <DropdownMenuItem
                              key={action}
                              onClick={() => handleActionSelect(action, car)}
                            >
                              {action}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Sub-rows for tasks */}
                  {expandedRows.has(car.id) && car.tasks && (
                    <TableRow
                      key={`${car.id}-tasks`}
                      className="bg-slate-50 hover:bg-slate-50"
                    >
                      <TableCell colSpan={9} className="p-0">
                        <div className="p-4">
                          <h4 className="text-sm font-medium mb-3">
                            Tasks for {car.carName}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {car.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-1">
                                    {task.type === "maintenance" ? (
                                      <div className="bg-blue-100 p-2 rounded-full">
                                        <Tool className="h-5 w-5 text-blue-600" />
                                      </div>
                                    ) : task.type === "incident" ? (
                                      <div className="bg-amber-100 p-2 rounded-full">
                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                      </div>
                                    ) : task.type === "pm" ? (
                                      <div className="bg-green-100 p-2 rounded-full">
                                        <Tool className="h-5 w-5 text-green-600" />
                                      </div>
                                    ) : task.type === "inspection" ? (
                                      <div className="bg-purple-100 p-2 rounded-full">
                                        <Info className="h-5 w-5 text-purple-600" />
                                      </div>
                                    ) : (
                                      <div className="bg-gray-100 p-2 rounded-full">
                                        <Info className="h-5 w-5 text-gray-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <h5 className="font-medium">
                                        {task.title}
                                      </h5>
                                      <Badge
                                        variant={
                                          task.dueDate <
                                          new Date().toISOString()
                                            ? "destructive"
                                            : "outline"
                                        }
                                        className="ml-2"
                                      >
                                        {formatDate(task.dueDate)}
                                      </Badge>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                      <p className="mb-1">
                                        <span className="font-medium">
                                          Assigned to:
                                        </span>{" "}
                                        {task.assignedTo}
                                      </p>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex items-center text-sm text-blue-600 cursor-help">
                                              <Info className="h-3.5 w-3.5 mr-1" />
                                              <span>View instructions</span>
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent className="w-72 p-3">
                                            <p>{task.instructions}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
              {Math.min(currentPage * rowsPerPage, totalItems)}
            </span>{" "}
            out of{" "}
            <span className="font-medium text-text-strong-950">{totalItems}</span>
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
