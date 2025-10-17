"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Trash2, Printer, FilePenIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import React from "react";
import {
  EmployeeTableInterface,
  RenewalInterface,
} from "@/lib/Employee/employee-data";
import EditEmployee from "../views/editEmployeeSheet";
import { matchesSearchAllFields } from "@/lib/utils";
import { useGetEmployees } from "@/services/setups/employee";

export default function EmployeeDataTable() {
  const {
    data: EmployeeData,
    isLoading,
    error: EmployeeDataError,
  } = useGetEmployees();

  return EmployeeData ? (
    <EmployeeTableLoader EmployeeData={EmployeeData} isLoading={isLoading} />
  ) : (
    <div>is loading.......</div>
  );
}

export function EmployeeTableLoader({ EmployeeData, isLoading }) {
  const [isServerMode, setIsServerMode] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(EmployeeData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(EmployeeData.length / 5),
    totalRows: EmployeeData.length,
  });

  // Get unique values for filter options (including sub-rows)
  const getAllEmployees = (
    employees: EmployeeTableInterface[]
  ): EmployeeTableInterface[] => {
    const result: EmployeeTableInterface[] = [];
    const traverse = (emps: EmployeeTableInterface[]) => {
      emps.forEach((emp) => {
        result.push(emp);
      });
    };
    traverse(employees);
    return result;
  };

  const flatEmployees = getAllEmployees(EmployeeData);
  const employeeId = [
    ...new Set(flatEmployees.map((emp) => emp.id?.toString())),
  ];
  const name = [
    ...new Set(
      flatEmployees.map(
        (emp) =>
          emp.last_name + " " + emp.first_name + " " + (emp.middle_name ?? "")
      )
    ),
  ];
  const location = [...new Set(flatEmployees.map((emp) => emp.location_id))];
  const type = [...new Set(flatEmployees.map((emp) => emp.type_id))];
  const drivers_license_number = [
    ...new Set(flatEmployees.map((emp) => emp.driver_license_number)),
  ];
  const contact = [...new Set(flatEmployees.map((emp) => emp.cell))];

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
            <title>Still In Progress</title>
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
              <h1>Still In Progress</h1>
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

    // setIsLoading(true);

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
      const newData = EmployeeData.slice(startIndex, endIndex);

      setCurrentData(newData);
      setPaginationInfo((prev) => ({
        ...prev,
        pageIndex: newPageIndex,
      }));

      // setIsLoading(false);
    }, 1000); // 1 second delay to simulate server response
  };

  // Server-side search handler
  const handleServerSearch = React.useCallback(
    (searchValue: string) => {
      console.log(`🔍 Server Search: "${searchValue}"`);

      // setIsLoading(true);

      // Simulate server delay
      setTimeout(() => {
        let filteredData = EmployeeData;

        if (searchValue.trim()) {
          filteredData = EmployeeData.filter((emp) =>
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

        // setIsLoading(false);
      }, 800); // 800ms delay to simulate server response
    },
    [paginationInfo.pageSize]
  ); // Add dependencies that actually matter

  const getSubRows = (originalRow: EmployeeTableInterface) => {
    return originalRow.renewals;
  };

  // Custom sub-row renderer
  const renderSubRow = (
    subRowData: RenewalInterface,
    parentRow: any,
    depth: number
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          {" "}
          <Card className="  w-full">
            <CardContent className=" p-2 grid grid-cols-2 w-full items-center">
              {" "}
              <div className="col-span-1 flex items-center">
                <span className="text-destructive">{subRowData.name}</span>
                &nbsp;&nbsp;expires on&nbsp;&nbsp;{"     "}
                <span className="text-destructive">
                  {subRowData.expired_date}{" "}
                </span>
              </div>
              <div className="col-span-1">
                <Button variant={"ghost"}>Update</Button>
              </div>
            </CardContent>{" "}
          </Card>
        </div>
      </div>
    );
  };

  // Column definitions
  const columns: ColumnDef<EmployeeTableInterface>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Employee#"
          sortable={true}
          filterOptions={employeeId}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium flex flex-col text-primary">
          {" "}
          {row.original.ssn}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Name"
          sortable={true}
          filterOptions={name}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium flex flex-row">
          {row.original.last_name +
            " " +
            row.original.first_name +
            " " +
            (row.original.middle_name ?? "")}
        </div>
      ),
    },
    {
      accessorKey: "type_id",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
          filterOptions={type}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "driver_license_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Driver's License#"
          sortable={true}
          filterOptions={drivers_license_number}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "cell",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Contact"
          sortable={true}
          filterOptions={contact}
        />
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
            confirm(`Are you sure you want to delete ${row.original.name}?`)
          ) {
            alert(`Deleted ${row.original.name}`);
            // Here you would typically call your delete API
          }
        };

        return (
          <div className="flex flex-row justify-between ">
            <EditEmployee
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
              <DropdownMenuContent className="w-62 " align="start">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Email
                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Print
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
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
        data={isServerMode ? currentData : EmployeeData}
        defaultVisibleColumns={[
          "id",
          "name",
          "type",
          "driverNumber",
          "contact",
          "actions",
        ]}
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
        subRowKey="renewals"
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
