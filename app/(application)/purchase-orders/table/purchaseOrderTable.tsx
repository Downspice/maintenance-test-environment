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
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import React from "react";
import {
  PurchaseOrderData,
  PurchaseOrderInterface,
} from "@/lib/purcahse-order-data";

// Get unique values for filter options (including sub-rows)
const getAllEmployees = (
  employees: PurchaseOrderInterface[]
): PurchaseOrderInterface[] => {
  const result: PurchaseOrderInterface[] = [];
  const traverse = (emps: PurchaseOrderInterface[]) => {
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

const flatEmployees = getAllEmployees(PurchaseOrderData);
const model = [...new Set(flatEmployees.map((emp) => emp.carModel))];
const serial = [...new Set(flatEmployees.map((emp) => emp.serialNumber))];
const location = [...new Set(flatEmployees.map((emp) => emp.location))];
const type = [...new Set(flatEmployees.map((emp) => emp.carType))];
const required_on = [...new Set(flatEmployees.map((emp) => emp.required_on))];

export default function PurchaseOrderDataTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(PurchaseOrderData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(PurchaseOrderData.length / 5),
    totalRows: PurchaseOrderData.length,
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
            <title>PurchaseOrderInterface Details - ${employee.name}</title>
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
              <h1>PurchaseOrderInterface Details</h1>
            </div>
            <div class="field">
              <span class="label">Name:</span>
              <span>${employee.name}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span>${employee.email}</span>
            </div>
            <div class="field">
              <span class="label">Role:</span>
              <span>${employee.role}</span>
            </div>
            <div class="field">
              <span class="label">Department:</span>
              <span>${employee.department}</span>
            </div>
            <div class="field">
              <span class="label">Status:</span>
              <span class="status ${employee.status}">${employee.status}</span>
            </div>
            <div class="field">
              <span class="label">Salary:</span>
              <span>${formattedSalary}</span>
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
      const newData = PurchaseOrderData.slice(startIndex, endIndex);

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
        let filteredData = PurchaseOrderData;

        if (searchValue.trim()) {
          filteredData = PurchaseOrderData.filter(
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

  const getSubRows = (originalRow: PurchaseOrderInterface) => {
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
  const columns: ColumnDef<PurchaseOrderInterface>[] = [
    {
      accessorKey: "sequential_id",
      header: ({ column }) => (
        <SortableHeader column={column} title="PO#" sortable={true} />
      ),
      cell: ({ row }) => (
        <div
          className="font-bold text-primary flex flex-col"
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          <div>{row.original.sequential_id}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader column={column} title="Status" sortable={true} />
      ),
    },
    {
      accessorKey: "created_on",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Issued On"
          sortable={true}
          filterOptions={type}
        />
      ),
      cell: ({ row }) => <>{row.original.created_on}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "required_on",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Due"
          sortable={true}
          filterOptions={[required_on as unknown as string]}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "vendor_name",
      header: ({ column }) => (
        <SortableHeader column={column} title="Vendor" sortable={true} />
      ),

      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "buyer_name",
      header: ({ column }) => (
        <SortableHeader column={column} title="Buyer" sortable={true} />
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
          <DropdownMenu>
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
        data={isServerMode ? currentData : PurchaseOrderData}
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
