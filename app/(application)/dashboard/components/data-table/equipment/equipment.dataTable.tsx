"use client";

import { useState, useEffect, Fragment } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Info,
  PenToolIcon as Tool,
  AlertTriangle,
  Plus,
  Filter,
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
import { useSheet } from "@/lib/sheet-providers";
import WorkOrderForm from "@/components/forms/actualForms/work-order-form";
import NotCompleteMessage from "@/app/(application)/invoices/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// Define the data structure
interface Task {
  id: string;
  title: string;
  type: "maintenance" | "incident" | "inspection" | "renewal" | "pm";
  instructions: string;
  assignedTo: string;
  dueDate: string;
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
  make: string; // e.g., Toyota, Honda
  type: string; // e.g., SUV, Sedan, Truck
  serialNumber: string; // VIN or internal serial
  location: string; // e.g., "Nairobi Garage", "Lot 5"
  category: string;
}

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
    carName: "Toyota Camry",
    carModel: "2020",
    carNumber: "KAB 123A",
    make: "Toyota",
    type: "Sedan",
    serialNumber: "JTNB11HK2L3056789",
    location: "Nairobi Garage A",
    category: "Fleet",
    tasksPending: 3,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["maintenance", "incident", "pm"],
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
    make: "Honda",
    type: "Sedan",
    serialNumber: "1HGCV1F33KA078963",
    location: "Garage B - West Lot",
    category: "Leased",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["maintenance"],
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
    make: "Mazda",
    type: "SUV",
    serialNumber: "JM3KFBCM6M0334567",
    location: "Mombasa Depot",
    category: "Fleet",
    tasksPending: 2,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["incident", "inspection"],
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
    make: "Subaru",
    type: "SUV",
    serialNumber: "JF2SKABC2JH567890",
    location: "Central Yard",
    category: "Owned",
    tasksPending: 4,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["maintenance", "incident", "pm"],
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
    make: "Ford",
    type: "Truck",
    serialNumber: "1FT7W2B68NEG12345",
    location: "Offsite Lot 3",
    category: "Fleet",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["incident"],
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
  {
    id: 6,
    carName: "Nissan X-Trail",
    carModel: "2020",
    carNumber: "KCL 987F",
    make: "Nissan",
    type: "SUV",
    serialNumber: "JN1BJ1CW3LW321654",
    location: "Nairobi Garage B",
    category: "Leased",
    tasksPending: 2,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["maintenance", "renewal"],
    tasks: [
      {
        id: "6-1",
        title: "Brake Pad Replacement",
        type: "maintenance",
        instructions: "Replace front and rear brake pads",
        assignedTo: "John Mechanic",
        dueDate: "2025-05-18",
      },
      {
        id: "6-2",
        title: "Registration Renewal",
        type: "renewal",
        instructions: "Process vehicle registration renewal",
        assignedTo: "Admin Staff",
        dueDate: "2025-05-19",
      },
    ],
  },
  {
    id: 7,
    carName: "Volkswagen Golf",
    carModel: "2017",
    carNumber: "KAR 741G",
    make: "Volkswagen",
    type: "Hatchback",
    serialNumber: "WVWZZZAUZHP567321",
    location: "Garage A - East Lot",
    category: "Owned",
    tasksPending: 3,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["maintenance", "incident", "pm"],
    tasks: [
      {
        id: "7-1",
        title: "Timing Belt Replacement",
        type: "maintenance",
        instructions: "Replace timing belt and water pump",
        assignedTo: "John Mechanic",
        dueDate: "2025-05-26",
      },
      {
        id: "7-2",
        title: "30,000 Mile Service",
        type: "pm",
        instructions: "Complete 30k mile preventive maintenance",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-27",
      },
      {
        id: "7-3",
        title: "Paint Scratch Repair",
        type: "incident",
        instructions: "Fix paint scratches on driver side door",
        assignedTo: "Sarah Bodyshop",
        dueDate: "2025-05-28",
      },
    ],
  },
  {
    id: 8,
    carName: "BMW X3",
    carModel: "2023",
    carNumber: "KDA 852H",
    make: "BMW",
    type: "SUV",
    serialNumber: "5UXTY5C02P9J98765",
    location: "Inspection Bay",
    category: "Fleet",
    tasksPending: 1,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["inspection"],
    tasks: [
      {
        id: "8-1",
        title: "Pre-delivery Inspection",
        type: "inspection",
        instructions: "Complete new vehicle inspection checklist",
        assignedTo: "Quality Control",
        dueDate: "2025-05-30",
      },
    ],
  },
  {
    id: 9,
    carName: "Mercedes-Benz C200",
    carModel: "2021",
    carNumber: "KBM 963J",
    make: "Mercedes-Benz",
    type: "Sedan",
    serialNumber: "WDDWF4JB8MR123456",
    location: "Garage C",
    category: "Leased",
    tasksPending: 5,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["incident", "renewal", "inspection"],
    tasks: [
      {
        id: "9-1",
        title: "Windshield Replacement",
        type: "incident",
        instructions: "Replace cracked windshield",
        assignedTo: "Tom Glass",
        dueDate: "2025-05-10",
      },
      {
        id: "9-2",
        title: "Side Mirror Repair",
        type: "incident",
        instructions: "Replace broken side mirror",
        assignedTo: "Sarah Bodyshop",
        dueDate: "2025-05-12",
      },
      {
        id: "9-3",
        title: "Insurance Renewal",
        type: "renewal",
        instructions: "Process insurance policy renewal",
        assignedTo: "Admin Staff",
        dueDate: "2025-05-14",
      },
      {
        id: "9-4",
        title: "Interior Trim Repair",
        type: "incident",
        instructions: "Fix damaged interior trim",
        assignedTo: "Sarah Bodyshop",
        dueDate: "2025-05-16",
      },
      {
        id: "9-5",
        title: "Emissions Inspection",
        type: "inspection",
        instructions: "Complete emissions testing",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-18",
      },
    ],
  },
  {
    id: 10,
    carName: "Hyundai Tucson",
    carModel: "2020",
    carNumber: "KCX 159K",
    make: "Hyundai",
    type: "SUV",
    serialNumber: "KM8J3CA46LU123789",
    location: "Main Warehouse",
    category: "Fleet",
    tasksPending: 2,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "due soon",
    taskTypes: ["maintenance", "pm"],
    tasks: [
      {
        id: "10-1",
        title: "Oil Change",
        type: "pm",
        instructions: "Change oil and replace filter",
        assignedTo: "John Mechanic",
        dueDate: "2025-05-29",
      },
      {
        id: "10-2",
        title: "Air Conditioning Service",
        type: "maintenance",
        instructions: "Recharge AC system and check for leaks",
        assignedTo: "Mike Technician",
        dueDate: "2025-05-30",
      },
    ],
  },
];

interface DataTableProps {
  realServer: boolean;
}

export function EquipmentDataTable({ realServer }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<CarData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOption, setFilterOption] =
    useState<FilterOption>("All Due Equipment");
  const { openSheet } = useSheet();

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

  // Load data based on pagination and filter
  useEffect(() => {
    if (realServer) {
      // Simulate server-side pagination and filtering
      fetchServerData(currentPage, rowsPerPage, filterOption);
    } else {
      // Client-side pagination and filtering
      const filteredData = filterData(mockCarData, filterOption);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
    }
  }, [currentPage, realServer, filterOption]);

  // Simulate fetching data from server
  const fetchServerData = (
    page: number,
    limit: number,
    filter: FilterOption
  ) => {
    console.log(
      `Fetching page ${page} with limit ${limit} and filter ${filter}`
    );

    // Simulate API delay
    setTimeout(() => {
      const filteredData = filterData(mockCarData, filter);
      const startIndex = (page - 1) * limit;
      const paginatedData = filteredData.slice(startIndex, startIndex + limit);
      setData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / limit));
    }, 300);
  };

  // Handle filter change
  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
    setCurrentPage(1); // Reset to first page when filter changes
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

  // Create new work order
  const createWorkOrder = (car: CarData) => {
    console.log("Creating new work order for:", car);
    openSheet({
      title: "Create Work Order",
      description:
        "Fill out the form below to create a new work order for equipment maintenance or repair.",
      content: <NotCompleteMessage />,
    });
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
      fetchServerData(page, rowsPerPage, filterOption);
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

  return (
    <div className="space-y-4 shadow-primary">
      <div className="rounded-md border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-auto">
              <Filter className="mr-2 h-4 w-4" />
              {filterOption}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem
              onClick={() => handleFilterChange("All Due Equipment")}
            >
              All Due Equipment ({counts.all})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("Due")}>
              Due ({counts.due})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("Due Soon")}>
              Due Soon ({counts.dueSoon})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("Repairs Due")}>
              Repairs Due ({counts.repairs})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("PM Due")}>
              PM Due ({counts.pm})
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("Renewals Due")}
            >
              Renewals Due ({counts.renewals})
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("Inspections Pending")}
            >
              Inspections Pending ({counts.inspections})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <TableHead className="w-[50px]"></TableHead>

              {selectedRows.size > 0 ? (
                // Show actions dropdown when rows are selected
                <TableHead colSpan={3} className="w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" className="w-auto">
                        Actions ({selectedRows.size})
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("schedule")}
                      >
                        Create Work Order
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleBulkAction("export")}
                      >
                        Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              ) : (
                // Show filter dropdown when no rows are selected
                <>
                  <TableHead>Unit</TableHead>
                  <TableHead className="w-[50px]">Due Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody key={data.length}>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No vehicles match the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              data.map((car) => (
                <Fragment key={car.id}>
                  <TableRow
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
                        <div className="flex flex-col">
                          <Popover>
                            <PopoverTrigger>
                              <span className="w-fit font-bold flex flex-row text-primary text-bold hover:shadow cursor-pointer">
                                {car.carNumber}
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="bg-white">
                              <div className="grid gap-2">
                                <div className="space-y-1">
                                  <h4 className="leading-none font-medium">
                                    Unit #{car.carNumber}
                                  </h4>
                                  <p className="text-muted-foreground text-sm">
                                    Short details of the equipment.
                                  </p>
                                </div>
                                <div className="grid space-y-0.5">
                                  <div className="flex justify-center items-center">
                                    <img src={car.carImage} className="w-20" />
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-1">
                                    <Label htmlFor="width">Make</Label>
                                    <span className="col-span-2  ">
                                      {car.make}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-1">
                                    <Label htmlFor="width">Model</Label>
                                    <span className="col-span-2  ">
                                      {car.carModel}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-1">
                                    <Label htmlFor="width">Type</Label>
                                    <span className="col-span-2  ">
                                      {car.type}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-1">
                                    <Label htmlFor="width">Serial #</Label>
                                    <span className="col-span-2  ">
                                      {car.serialNumber}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-1">
                                    <Label htmlFor="width">Location</Label>
                                    <span className="col-span-2  ">
                                      {car.location}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-1">
                                    <Label htmlFor="width">Category</Label>
                                    <span className="col-span-2  ">
                                      {car.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <div className="font-semibold">{car.carName}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <div>
                          <Badge
                            variant={
                              car.taskStatus === "overdue"
                                ? "destructive"
                                : "default"
                            }
                            className="capitalize"
                          >
                            {car.taskStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* <span className="font-medium">
                            {car.tasksPending} Tasks
                          </span>
                          <div className="flex gap-1">
                            {car.taskTypes.includes("maintenance") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Tool className="h-4 w-4 text-blue-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Maintenance Required</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {car.taskTypes.includes("incident") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Incident Reported</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div> */}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="w-fit px-2">
                      <Button
                        onClick={() => createWorkOrder(car)}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Work Order
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Sub-rows for tasks */}
                  {expandedRows.has(car.id) && car.tasks && (
                    <TableRow
                      key={`${car.id}-tasks`}
                      className="bg-slate-50 hover:bg-slate-50"
                    >
                      <TableCell colSpan={5} className="p-0">
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
                </Fragment>
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
