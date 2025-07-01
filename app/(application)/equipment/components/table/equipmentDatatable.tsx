"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Trash2, Printer, FileTextIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import React from "react";

// Enhanced data type with sub-rows
type Employee = {
  id: number;
  carName: string;
  carModel: string;
  carNumber: string;
  tasksPending: number;
  carImage: string;
  taskStatus: "due soon" | "overdue";
  taskTypes: ("maintenance" | "incident" | "inspection" | "renewal" | "pm")[];
  tasks?: {
    id: string;
    title: string;
    type: "maintenance" | "incident" | "inspection" | "renewal" | "pm";
    instructions: string;
    woNumber: string;
    dueDate: string;
  }[]; // Added tasks array for sub-rows
  make: string; // e.g., Toyota, Honda
  meter: string;
  carType: string; // e.g., SUV, Sedan, Truck
  serialNumber: string; // VIN or internal serial
  location: string; // e.g., "Nairobi Garage", "Lot 5"
  category: string;
};
interface Task {
  id: string;
  title: string;
  type: "maintenance" | "incident" | "inspection" | "renewal" | "pm";
  instructions: string;
  woNumber: string;
  dueDate: string;
}

// Sample data with custom sub-row structure
const allEquipments: Employee[] = [
  {
    id: 1,
    carName: "Toyota Camry",
    carModel: "2020",
    carNumber: "KAB 123A",
    make: "Toyota",
    carType: "Sedan",
    meter: "4hours",
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
        woNumber: "WO123",
        dueDate: "2025-05-25",
      },
      {
        id: "1-2",
        title: "Brake Inspection",
        type: "maintenance",
        instructions: "Check brake pads and rotors",
        woNumber: "WO124",
        dueDate: "2025-05-26",
      },
      {
        id: "1-3",
        title: "Accident Damage",
        type: "incident",
        instructions: "Repair front bumper damage",
        woNumber: "WO125",
        dueDate: "2025-05-28",
      },
    ],
  },
  {
    id: 2,
    carName: "Honda Accord",
    carModel: "2019",
    carNumber: "KCE 456B",
    meter: "6hours",
    make: "Honda",
    carType: "Sedan",
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
        woNumber: "WO126",
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
    meter: "9hours",
    carType: "SUV",
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
        woNumber: "WO127",
        dueDate: "2025-05-24",
      },
      {
        id: "3-2",
        title: "Annual Safety Inspection",
        type: "inspection",
        instructions: "Complete annual safety inspection checklist",
        woNumber: "WO123",
        dueDate: "2025-05-27",
      },
    ],
  },
  {
    id: 4,
    carName: "Subaru Forester",
    carModel: "2018",
    carNumber: "KDD 321D",
    meter: "10 hours",
    make: "Subaru",
    carType: "SUV",
    serialNumber: "JF2SKABC2JH567890",
    location: "Central Yard",
    category: "Owned",
    tasksPending: 4,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["maintenance", "incident", "pm"],
  },
  {
    id: 5,
    carName: "Ford Ranger",
    carModel: "2022",
    carNumber: "KCZ 654E",
    meter: "34 hours",
    make: "Ford",
    carType: "Truck",
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
        woNumber: "WO123",
        dueDate: "2025-05-29",
      },
    ],
  },
  {
    id: 6,
    carName: "Nissan X-Trail",
    carModel: "2020",
    carNumber: "KCL 987F",
    meter: "60 hours",
    make: "Nissan",
    carType: "SUV",
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
        woNumber: "WO123",
        dueDate: "2025-05-18",
      },
      {
        id: "6-2",
        title: "Registration Renewal",
        type: "renewal",
        instructions: "Process vehicle registration renewal",
        woNumber: "WO123",
        dueDate: "2025-05-19",
      },
    ],
  },
  {
    id: 7,
    carName: "Volkswagen Golf",
    carModel: "2017",
    carNumber: "KAR 741G",
    meter: "90 hours",
    make: "Volkswagen",
    carType: "Hatchback",
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
        woNumber: "WO123",
        dueDate: "2025-05-26",
      },
      {
        id: "7-2",
        title: "30,000 Mile Service",
        type: "pm",
        instructions: "Complete 30k mile preventive maintenance",
        woNumber: "WO123",
        dueDate: "2025-05-27",
      },
      {
        id: "7-3",
        title: "Paint Scratch Repair",
        type: "incident",
        instructions: "Fix paint scratches on driver side door",
        woNumber: "WO12344",
        dueDate: "2025-05-28",
      },
    ],
  },
  {
    id: 8,
    carName: "BMW X3",
    carModel: "2023",
    carNumber: "KDA 852H",
    meter: "400 hours",
    make: "BMW",
    carType: "SUV",
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
        woNumber: "WO1233",
        dueDate: "2025-05-30",
      },
    ],
  },
  {
    id: 9,
    carName: "Mercedes-Benz C200",
    carModel: "2021",
    carNumber: "KBM 963J",
    meter: "560 hours",
    make: "Mercedes-Benz",
    carType: "Sedan",
    serialNumber: "WDDWF4JB8MR123456",
    location: "Garage C",
    category: "Leased",
    tasksPending: 5,
    carImage: "/placeholder.svg?height=60&width=100",
    taskStatus: "overdue",
    taskTypes: ["incident", "renewal", "inspection"],
  },
  {
    id: 10,
    carName: "Hyundai Tucson",
    carModel: "2020",
    carNumber: "KCX 159K",
    meter: "100 hours",
    make: "Hyundai",
    carType: "SUV",
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
        woNumber: "WO1234",
        dueDate: "2025-05-29",
      },
      {
        id: "10-2",
        title: "Air Conditioning Service",
        type: "maintenance",
        instructions: "Recharge AC system and check for leaks",
        woNumber: "WO1234",
        dueDate: "2025-05-30",
      },
    ],
  },
];

// Get unique values for filter options (including sub-rows)
const getAllEmployees = (employees: Employee[]): Employee[] => {
  const result: Employee[] = [];
  const traverse = (emps: Employee[]) => {
    emps.forEach((emp) => {
      result.push(emp);
      //   if (emp.tasks) {
      //     console.log(emp.tasks);

      //     // traverse(emp.tasks);
      //   }
    });
  };
  traverse(employees);
  return result;
};

const flatEmployees = getAllEmployees(allEquipments);
const carNumber = [...new Set(flatEmployees.map((emp) => emp.carNumber))];
const carModel = [...new Set(flatEmployees.map((emp) => emp.carModel))];
const serialNumber = [...new Set(flatEmployees.map((emp) => emp.serialNumber))];
const carType = [...new Set(flatEmployees.map((emp) => emp.carType))];
const meter = [...new Set(flatEmployees.map((emp) => emp.meter))];
const taskStatus = [...new Set(flatEmployees.map((emp) => emp.taskStatus))];

export default function DataTableDemo() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(allEquipments.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(allEquipments.length / 5),
    totalRows: allEquipments.length,
  });

  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row.original);
    // alert(`Row clicked: ${row.original.name} (Depth: ${row.depth})`);
  };

  const handleCellClick = (cell: any, row: any) => {
    console.log("Cell clicked:", cell.column.id, cell.getValue());
    // alert(`Cell clicked: ${cell.column.id} = ${cell.getValue()}`);
  };

  const handlePrintSelected = (selectedRows: any[]) => {
    console.log(
      "Print selected rows:",
      selectedRows.map((row) => row.original)
    );
    // alert(`Printing ${selectedRows.length} selected rows`);
    alert(`Currently Unavailable`);
  };

  const handleEmailSelected = (selectedRows: any[]) => {
    console.log(
      "Email selected rows:",
      selectedRows.map((row) => row.original)
    );
    alert(`Currently Unavailable`);
    // alert(`Emailing ${selectedRows.length} selected rows`);
  };

  const handleDeleteSelected = (selectedRows: any[]) => {
    console.log(
      "Delete selected rows:",
      selectedRows.map((row) => row.original)
    );
    if (
      confirm(
        `Are you sure you want to delete ${selectedRows.length} selected rows?`
      )
    ) {
      alert(`Deleted ${selectedRows.length} rows`);
      // Here you would typically call your bulk delete API
    }
  };

  const handlePrintRow = (row: any) => {
    const employee = row.original;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const formattedSalary = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(employee.salary);

      printWindow.document.write(`
        <html>
          <head>
            <title>Work In Progress</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; display: inline-block; width: 120px; }
              .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
              .status.active { background-color: #d4edda; color: #155724; }
              .status.inactive { background-color: #f8d7da; color: #721c24; }
              .status.pending { background-color: #fff3cd; color: #856404; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Working On This Feature</h1>
            </div> 
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Server-side pagination handler
  const handlePaginationChange = (action: "next" | "previous" | number) => {
    console.log(`🔄 Server Pagination Action: ${action}`);

    setIsLoading(true);

    // Simulate server delay
    setTimeout(() => {
      let newPageIndex = paginationInfo.pageIndex;

      if (action === "next") {
        newPageIndex = Math.min(
          paginationInfo.pageIndex + 1,
          paginationInfo.totalPages - 1
        );
      } else if (action === "previous") {
        newPageIndex = Math.max(paginationInfo.pageIndex - 1, 0);
      } else if (typeof action === "number") {
        newPageIndex = action;
      }

      // Simulate fetching data for the new page
      const startIndex = newPageIndex * paginationInfo.pageSize;
      const endIndex = startIndex + paginationInfo.pageSize;
      const newData = allEquipments.slice(startIndex, endIndex);

      setCurrentData(newData);
      setPaginationInfo((prev) => ({
        ...prev,
        pageIndex: newPageIndex,
      }));

      setIsLoading(false);
    }, 1000); // 1 second delay to simulate server response
  };

  // Server-side search handler
  const handleServerSearch = React.useCallback(
    (searchValue: string) => {
      console.log(`🔍 Server Search: "${searchValue}"`);

      setIsLoading(true);

      // Simulate server delay
      setTimeout(() => {
        let filteredData = allEquipments;

        if (searchValue.trim()) {
          filteredData = allEquipments.filter(
            (emp) =>
              emp.carName.toLowerCase().includes(searchValue.toLowerCase()) ||
              emp.carNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
              emp.serialNumber.toLowerCase().includes(searchValue.toLowerCase())
          );
        }

        // Reset to first page and update data
        const newData = filteredData.slice(0, paginationInfo.pageSize);
        setCurrentData(newData);
        setPaginationInfo((prev) => ({
          ...prev,
          pageIndex: 0,
          totalPages: Math.ceil(filteredData.length / prev.pageSize),
          totalRows: filteredData.length,
        }));

        setIsLoading(false);
      }, 800); // 800ms delay to simulate server response
    },
    [paginationInfo.pageSize]
  ); // Add dependencies that actually matter

  const getSubRows = (originalRow: Employee) => {
    return originalRow.tasks;
  };

  // Custom sub-row renderer
  const renderSubRow = (subRowData: Task, parentRow: any, depth: number) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1  gap-4">
          {" "}
          <Card>
            {" "}
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Work Information</CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent className=" grid grid-cols-3 space-y-2 text-sm">
              {" "}
              <div className="col-span-1 ">
                <span className="ml-2">{subRowData.instructions}</span>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                {" "}
                <span className="ml-2 text-destructive">
                  {subRowData.dueDate}{" "}
                </span>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  #{subRowData.woNumber}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        </div>
      </div>
    );
  };

  // Column definitions
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "carNumber",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit"
          sortable={true}
          filterOptions={carNumber}
        />
      ),
      cell: ({ row }) => (
        <div
          className="font-medium flex flex-col"
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          <div>{row.getValue("carNumber")}</div>
          <div>{row.original.carName}</div>
        </div>
      ),
    },
    {
      accessorKey: "carModel",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={carModel}
          column={column}
          title="Year"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "carType",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
          filterOptions={carType}
        />
      ),
      cell: ({ row }) => <>{row.original.carType}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "meter",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Meter"
          sortable={true}
          filterOptions={meter}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "serialNumber",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={serialNumber}
          column={column}
          title="Status"
          sortable={true}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "taskStatus",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={taskStatus}
          column={column}
          title="Due status"
          sortable={true}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          console.log("Delete row:", row.original);
          if (
            confirm(`Are you sure you want to delete ${row.original.name}?`)
          ) {
            alert(`Deleted ${row.original.name}`);
            // Here you would typically call your delete API
          }
        };

        return (
          <div className="flex flex-row justify-between">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Edit ${row.getValue("name")}`);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrintRow(row);
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <Button variant={"secondary"} size={"icon"}>
              <FileTextIcon />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                  <MoreHorizontal   />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="start">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Issue WO
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Repair Request
                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Inspection
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Record Expense
                    {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Record Accident</DropdownMenuItem>
                        <DropdownMenuItem>record Fluid Usage</DropdownMenuItem>
                        <DropdownMenuItem>
                          Record Meter Replacement
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View equipment parts
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    History
                    {/* <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Task Setup</DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem>New (Duplicate)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRow(row);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="">
      {/* <div className="mb-8">
         

        <div className="flex items-center gap-4 mb-4">
          <Button
            variant={isServerMode ? "default" : "outline"}
            onClick={() => setIsServerMode(!isServerMode)}
          >
            {isServerMode ? "Server Mode ON" : "Client Mode ON"}
          </Button>
          {isServerMode && (
            <Badge variant="secondary">
              Page {paginationInfo.pageIndex + 1} of {paginationInfo.totalPages}
            </Badge>
          )}
        </div>
      </div> */}

      <AdvancedDataTable
        columns={columns}
        data={isServerMode ? currentData : allEquipments}
        defaultVisibleColumns={["name", "email", "department", "actions"]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="employee-table-visibility"
        getSubRows={getSubRows}
        enableExpanding={true}
        // Custom sub-row rendering
        renderSubRow={renderSubRow}
        subRowKey="tasks"
        // Server-side props
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
