"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileTextIcon,
  FilePenIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { useState } from "react";
import React from "react";
import {
  mockWorkOrders,
  WorkOrderInterface,
} from "@/lib/WorkOrder/workOrder-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { matchesSearchAllFields } from "@/lib/utils";
import EditWorkOrderForm from "../../view/edit-work-order";
import ChangePriorityForm from "../../forms/change-priority";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChangeAssigneesForm from "../../forms/change-assignee";
import ChangeCostCenterForm from "../../forms/change-cost-center";

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "closed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case "in-progress":
      return <Clock className="h-3 w-3 text-blue-600" />;
    case "pending":
      return <AlertTriangle className="h-3 w-3 text-orange-600" />;
    default:
      return <Clock className="h-3 w-3 text-gray-600" />;
  }
};

const getAllEmployees = (
  employees: WorkOrderInterface[]
): WorkOrderInterface[] => {
  const result: WorkOrderInterface[] = [];
  const traverse = (emps: WorkOrderInterface[]) => {
    emps.forEach((emp) => {
      result.push(emp);
    });
  };
  traverse(employees);
  return result;
};

const flatEmployees = getAllEmployees(mockWorkOrders);
const number = [...new Set(flatEmployees.map((emp) => emp.workOrderNumber))];
const equipment = [...new Set(flatEmployees.map((emp) => emp.equipment))];
const status = [...new Set(flatEmployees.map((emp) => emp.status ?? ""))];
const dueDate = [
  ...new Set(flatEmployees.map((emp) => emp.dueOn?.toUTCString())),
];
const assignees = [
  ...new Set(flatEmployees.map((emp) => emp?.assigneeIds?.toString() ?? "")),
];
// const progress = [
//   ...new Set(flatEmployees.map((emp) => emp.progress.completed.toString())),
// ];
const total = [
  ...new Set(flatEmployees.map((emp) => emp.workOrderTotal ?? "")),
];

export default function WorkOrderDataTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(mockWorkOrders.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(mockWorkOrders.length / 5),
    totalRows: mockWorkOrders.length,
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
    alert(`Printing ${selectedRows.length} selected rows`);
  };

  const handleEmailSelected = (selectedRows: any[]) => {
    console.log(
      "Email selected rows:",
      selectedRows.map((row) => row.original)
    );
    alert(`Emailing ${selectedRows.length} selected rows`);
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
      const newData = mockWorkOrders.slice(startIndex, endIndex);

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
        let filteredData = mockWorkOrders;

        if (searchValue.trim()) {
          filteredData = mockWorkOrders.filter((emp) =>
            matchesSearchAllFields(emp, searchValue.trim())
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

  // Column definitions
  const columns: ColumnDef<WorkOrderInterface>[] = [
    {
      accessorKey: "workOrderNumber",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="WO#"
          sortable={true}
          filterOptions={number}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary flex flex-col">
          {" "}
          {row.getValue("workOrderNumber")}
        </div>
      ),
    },
    {
      accessorKey: "equipment",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit#"
          sortable={true}
          filterOptions={equipment}
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-primary">
            {row.original.equipment}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Status"
          sortable={true}
          filterOptions={status}
        />
      ),
      cell: ({ row }) => (
        <>
          <Badge className={`text-xs ${getStatusColor(row.original.status)}`}>
            {row.original.status?.toUpperCase()}
          </Badge>
        </>
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "dueOn",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Due Date"
          sortable={true}
          filterOptions={dueDate}
        />
      ),
      cell: ({ row }) => (
        <>
          <div className="flex  text-destructive items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-destructive" />
            {row.original.dueOn?.toUTCString()}
          </div>
        </>
      ),

      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "assignees",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Assigned to"
          sortable={true}
          filterOptions={assignees}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            {row.original.assigneeIds?.map((assignee, index) => (
              <div key={assignee} className="flex items-center gap-1 text-sm">
                {/* {assignee.type === "employee" ? (
                  <Users className="h-3 w-3 text-green-600" />
                ) : (
                  <Users className="h-3 w-3 text-purple-600" />
                )}
                <span
                  className={
                    assignee.type === "employee"
                      ? "text-green-700"
                      : "text-purple-700"
                  }
                > */}
                {assignee}
                {/* </span> */}
              </div>
            ))}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    // {
    //   accessorKey: "progress",
    //   header: ({ column }) => (
    //     <SortableHeader
    //       column={column}
    //       title="Due status"
    //       sortable={true}
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     const progressPercentage =
    //       (row.original.progress.completed / row.original.progress.total) * 100;

    //     return (
    //       <TooltipProvider>
    //         <Tooltip>
    //           <TooltipTrigger asChild>
    //             <div className="space-y-1 cursor-help">
    //               <div className="flex items-center gap-2">
    //                 <Progress value={progressPercentage} className="w-20 h-2" />
    //                 <span className="text-xs text-muted-foreground">
    //                   {row.original.progress.completed}/
    //                   {row.original.progress.total}
    //                 </span>
    //               </div>
    //             </div>
    //           </TooltipTrigger>
    //           <TooltipContent side="top" className="max-w-sm">
    //             <TaskTooltipContent tasks={row.original.tasks} />
    //           </TooltipContent>
    //         </Tooltip>
    //       </TooltipProvider>
    //     );
    //   },
    // },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Total"
          sortable={true}
          filterOptions={total}
        />
      ),
      cell: ({ row }) => (
        <>
          <div className="flex  items-end gap-1 text-sm">
            $ {row.original.workOrderTotal}
          </div>
        </>
      ),

      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          console.log("Delete row:", row.original);
          if (
            confirm(`Are you sure you want to delete ${row.original.workOrderNumber}?`)
          ) {
            alert(`Deleted ${row.original.workOrderNumber}`);
            // Here you would typically call your delete API
          }
        };

        const handleStatus = (status: string, row: any) => {
          console.log("change row status:", row.original);
          if (
            confirm(`Are you sure you want to change the status to ${status}?`)
          ) {
            alert(`Status changed`);
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
          { label: "Change Assignee", onSelect: genericDropdown },
          { label: "Change Priority", onSelect: genericDropdown },
          { label: "Change Cost Center", onSelect: genericDropdown },
        ];

        const formComponents = {
          "Change Assignee": <ChangeAssigneesForm data={row.original} />,
          "Change Priority": <ChangePriorityForm data={row.original} />,
          "Change Cost Center": <ChangeCostCenterForm data={row.original} />,
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
          <div className="flex flex-row gap-2 justify-between ">
            <EditWorkOrderForm
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />
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
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Email
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Print
                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                  </DropdownMenuItem>

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
                <DropdownMenuItem
                  onClick={() => handleStatus("Closed", row)}
                  disabled={row.original.status === "open"}
                >
                  Change Status (Open)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatus("Open", row)}
                  disabled={row.original.status === "closed"}
                >
                  Change Status (Close)
                </DropdownMenuItem>
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
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="w-[400px] sm:w-2/3">
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
      <AdvancedDataTable
        columns={columns}
        data={isServerMode ? currentData : mockWorkOrders}
        defaultVisibleColumns={[
          "workOrderNumber",
          "equipment",
          "status",
          "dueOn",
          "assignees",
          "total",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="work-order-table-visibility"
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
