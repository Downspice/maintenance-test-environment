"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, FilePenIcon } from "lucide-react";
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
import { VendorTableInterface } from "@/lib/vendor-data";
import ViewVendor from "../view/viewDetailsSheet";
import EditVendor from "../view/editVendorSheet";
import { matchesSearchAllFields } from "@/lib/utils";
import { useGetVendors } from "@/services/setups/vendor";

export default function VendorDataTable() {
  const {
    data: VendorData,
    isLoading,
    error: vendorTypesError,
  } = useGetVendors();

  return VendorData ? (
    <VendorTableLoader VendorData={VendorData} isLoading={isLoading} />
  ) : (
    <div>is loading.......</div>
  );
}
export function VendorTableLoader({ VendorData, isLoading }) {
  const [isServerMode, setIsServerMode] = useState(false);
  // const [isLoading, setIsLoading] = useState(isLoading);
  const [currentData, setCurrentData] = useState(VendorData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(VendorData?.length / 5),
    totalRows: VendorData?.length,
  });

  const getAllEmployees = (
    employees: VendorTableInterface[]
  ): VendorTableInterface[] => {
    const result: VendorTableInterface[] = [];
    const traverse = (emps: VendorTableInterface[]) => {
      emps.forEach((emp) => {
        result.push(emp);
      });
    };
    traverse(employees);
    return result;
  };

  const flatEmployees = getAllEmployees(VendorData);
  const name = [...new Set(flatEmployees.map((emp) => emp.name))];
  const type = [...new Set(flatEmployees.map((emp) => emp.type.name))];
  const contact = [...new Set(flatEmployees.map((emp) => emp.contact.phone_one))];
  const address1 = [...new Set(flatEmployees.map((emp) => emp.address))];
  const city = [...new Set(flatEmployees.map((emp) => emp.city))];
  const state_prov = [...new Set(flatEmployees.map((emp) => emp.state))];
  const postal_code = [...new Set(flatEmployees.map((emp) => emp.postal_code))];
  const email = [...new Set(flatEmployees.map((emp) => emp.contact.email))];

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
      printWindow.document.write(`
        <html>
          <head>
            <title>Work In Progress</title> 
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
      const newData = VendorData.slice(startIndex, endIndex);

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
        let filteredData = VendorData;

        if (searchValue.trim()) {
          filteredData = VendorData.filter((emp) =>
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

  // Column definitions
  const columns: ColumnDef<VendorTableInterface>[] = [
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
        <ViewVendor
          children={
            <div className="font-medium text-primary flex flex-col">
              {row.getValue("name")}
            </div>
          }
          data={row.original}
        />
      ),
    },
    {
      accessorKey: "type.name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
          filterOptions={type}
        />
      ),
    },
    {
      accessorKey: "contact.phone_one",
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
      accessorKey: "address",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Address"
          sortable={true}
          filterOptions={address1}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="City"
          sortable={true}
          filterOptions={city}
        />
      ),
      cell: ({ row }) => <>{row.original.city}</>,

      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "state",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="State"
          sortable={true}
          filterOptions={state_prov}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "postal_code",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Postal Code"
          sortable={true}
          filterOptions={postal_code}
        />
      ),
    },
    {
      accessorKey: "contact.email",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Email"
          sortable={true}
          filterOptions={email}
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
            <EditVendor
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />{" "}
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
    <div className="max-w-full">
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
        data={isServerMode ? currentData : VendorData}
        defaultVisibleColumns={[
          "name",
          "type",
          "contact",
          "address1",
          "city",
          "state_prov",
          "postal_code",
          "email",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="vendor-table-visibility"
        enableExpanding={false}
        subRowKey="tasks"
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
