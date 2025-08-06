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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import EquipmentProfile, {
  HistoryTabs,
  PartsManager,
  Tasks,
} from "../views/EquipmentProfile";
import AdjustInventoryForm from "@/components/forms/actualForms/adjust-inventory-form";
import ActualRepairRequestForm from "@/components/forms/actualForms/repairRequest";
import InspectionForm from "@/components/forms/actualForms/new-inspection";
import FuelTransactionForm from "../forms/FuelTransactionForm";
import GeneralExpense from "@/components/forms/actualForms/new-general-expense";
import AssignEquipmentForm from "../forms/AssignEquipment";
import NewAccident from "@/components/forms/actualForms/new-accident";
import FluidConsumedForm from "../forms/FluidConsumed";
import NewMeterReplacementForm from "../forms/MeterReplacement";
import { ActualEquipmentForm } from "../new-equipment-form";
import { ActualWorkOrderForm } from "@/components/forms/actualForms/work-order-form";

// Enhanced data type with sub-rows
type Employee = {
  id: number;
  name: string;
  model: string;
  unitNumber: string;
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
  equipmentType: string; // e.g., SUV, Sedan, Truck
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
    name: "Toyota Camry",
    model: "2020",
    unitNumber: "KAB 123A",
    make: "Toyota",
    equipmentType: "Sedan",
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
    unitNumber: "EQ-001",
    name: "Unit 1",
    make: "Hayes Inc",
    model: "result",
    serialNumber: "7cbbf4e0-1677-43b4-affd-c863bd9eed13",
    year: 2024,
    equipmentType: "food",
    status: "active",
    soldDate: "2025-02-14",
    soldTo: "Murphy-Davis",
    soldPrice: 30407.75,
    assigneeIds: [
      "32e9484c-94b3-407c-9ba6-10c1a24a988e",
      "202bc0e0-b7ca-4fd6-b8a1-5a9d8454a084",
    ],
    categoryId: "7546c7ee-d459-4d44-bdae-af7cb7bd19c3",
    parentId: "57997d1c-b00a-4fe1-83fc-8f3946738b47",
    pmSchedule: "quarterly",
    primaryMeterUnit: "hours",
    primary: 1086,
    secondaryMeterUnit: "miles",
    secondary: 18719,
    btu: "12090",
    inputVolts: "110V",
    installDate: "2024-09-27",
    custom: {},
    color: "HotPink",
    length: "1 ft",
    width: "2 ft",
    height: "4 ft",
    grossWeight: 7963.82,
    customSpecifications: {},
    warrantyDescription: "Standard 1-year warranty",
    warrantyExpirationDate: "2020-12-09",
    primaryWarrantyMeter: 4978,
    secondaryWarrantyDescription: "Extended coverage",
    secondaryWarrantyExpirationDate: "2023-12-07",
    secondaryWarrantyMeter: 10357,
    CustomSecondary: {},
    vendor: "Bryan, Keith and White",
    purchaseDate: "2024-04-03",
    meter: 3809,
    price: 60084.82,
    purchaseOrderCustom: {},
    note: "Require Republican cause fill both enter just.",
    depreciationLifeMonths: 68,
    startingPrice: 33301.58,
    salvagePrice: 9729.81,
    ownership: "owned",
    customerName: "Garcia PLC",
    inService: "2025-01-02",
    outService: "2024-10-16",
    transferred: "yes",
    notes:
      "Section its result bit line alone interesting. Pm thousand behavior me already choose. Eight do law institution study region agent.",
    tracker: ["6462e621-d6d7-4401-9bc5-3e598317f5fb"],
    budget: 11581.32,
    enableMeter1: true,
    average1: 12.18,
    lastMaintenanceCheck1: "2021-08-03",
    enableMeter2: false,
    average2: 19.68,
    Attachments: [],
    generalNotes:
      "Like cold material sense difference. Whose knowledge civil admit low strategy people thank. Machine lot save history.",
    expenses: [
      {
        id: "c1572788-5906-4557-8d79-a791828d636b",
        name: "life",
        lastDate: "2021-02-12",
        nextDate: "2021-12-09",
        period: "monthly",
        interval: 2,
        cost: 1007.09,
        quantity: 8,
        notes: "Quality production sign.",
      },
      {
        id: "25e87fb8-0984-4234-8538-cd1dd75de1cd",
        name: "never",
        lastDate: "2025-05-06",
        nextDate: "2022-06-29",
        period: "annually",
        interval: 4,
        cost: 1892.87,
        quantity: 10,
        notes: "Movement candidate television according.",
      },
    ],
    notifications: [
      {
        id: "028cbb1c-d71e-4b55-b9c9-7a83ff6a762d",
        name: "Kelly Shepard",
        email: "charles72@yahoo.com",
        maintenance: true,
        renewals: false,
        workOrders: true,
      },
      {
        id: "12a4ea89-da99-4249-8ae5-1d6ddb080d7b",
        name: "James Hensley",
        email: "ericksonlinda@johnson-smith.com",
        maintenance: false,
        renewals: false,
        workOrders: true,
      },
    ],
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
const unitNumber = [...new Set(flatEmployees.map((emp) => emp.unitNumber))];
const model = [...new Set(flatEmployees.map((emp) => emp.model))];
const serialNumber = [...new Set(flatEmployees.map((emp) => emp.serialNumber))];
const equipmentType = [
  ...new Set(flatEmployees.map((emp) => emp.equipmentType)),
];
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
              emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              emp.unitNumber
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
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
      accessorKey: "unitNumber",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit"
          sortable={true}
          filterOptions={unitNumber}
        />
      ),
      cell: ({ row }) => (
        <div
          className="font-medium flex flex-col"
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          <div>{row.getValue("unitNumber")}</div>
          <div>{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={model}
          column={column}
          title="Year"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "equipmentType",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
          filterOptions={equipmentType}
        />
      ),
      cell: ({ row }) => <>{row.original.equipmentType}</>,
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

        const [open, setOpen] = useState(false);
        const [selectedProjectType, setSelectedProjectType] = useState<
          string | null
        >(null);

        const genericDropdown = (x: string) => {
          console.log("did something", x);
          setSelectedProjectType(x);
          setOpen(true);
        };

        const dropdownItems = [
          { label: "Issue WO", onSelect: genericDropdown },
          { label: "Repair Request", onSelect: genericDropdown },
          { label: "Inspection", onSelect: genericDropdown },
          { label: "Record Fuel", onSelect: genericDropdown },
          { label: "Record Expense", onSelect: genericDropdown },
          { label: "Sign Out", onSelect: genericDropdown },
        ];

        const dropdownItemsSubMenu = [
          { label: "Record Accident", onSelect: genericDropdown },
          { label: "Record Fluid Usage", onSelect: genericDropdown },
          { label: "Record Meter Replacement", onSelect: genericDropdown },
          { label: "View Equipment Parts", onSelect: genericDropdown },
        ];

        const secondDropdowns = [
          { label: "History", onSelect: genericDropdown },
          { label: "Task Setup", onSelect: genericDropdown },
          { label: "New (Duplicate)", onSelect: genericDropdown },
        ];

        const formComponents = {
          "Issue WO": <ActualWorkOrderForm />,
          "Repair Request": <ActualRepairRequestForm />,
          Inspection: <InspectionForm />,
          "Record Fuel": <FuelTransactionForm />,
          "Sign Out": <AssignEquipmentForm />,
          "Record Expense": <GeneralExpense />,
          "Record Accident": <NewAccident />,
          "Record Fluid Usage": <FluidConsumedForm />,
          "Record Meter Replacement": <NewMeterReplacementForm />,
          "View Equipment Parts": (
            <PartsManager equipment={row.original.name} />
          ),
          History: <HistoryTabs />,
          "Task Setup": <Tasks />,
          "New (Duplicate)": <ActualEquipmentForm />,
        };

        const renderFormContent = () => {
          const SelectedComponent = formComponents[selectedProjectType || ""];
          console.log("new selected", SelectedComponent);
          return SelectedComponent ? SelectedComponent : null;
        };
        const selectedType = dropdownItems.find(
          (type) => type.label === selectedProjectType
        );

        return (
          <div className="flex flex-row justify-between">
            <EquipmentProfile
              children={
                <Button variant="ghost" size="icon">
                  <FileTextIcon className="h-4 w-4" />
                </Button>
              }
              data={row.original}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="start">
                <DropdownMenuGroup>
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      onClick={() => item.onSelect(item.label)}
                    >
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {dropdownItemsSubMenu.map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          onClick={() => item.onSelect(item.label)}
                        >
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                {secondDropdowns.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => item.onSelect(item.label)}
                  >
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="w-[400px] sm:w-4/5">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {selectedType?.label}
                    {/* Receive Purchase Order */}
                  </SheetTitle>
                  <SheetDescription>
                    {/* {selectedType?.label ||
                                        "Fill out the form below to set up your new development project."} */}
                  </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                  {renderFormContent() || "nothing else"}
                </ScrollArea>
              </SheetContent>
            </Sheet>
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
        defaultVisibleColumns={[
          "unitNumber",
          "model",
          "equipmentType",
          "meter",
          "serialNumber",
          "taskStatus",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="equipment-table-visibility"
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
