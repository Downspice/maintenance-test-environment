"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
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
import { useState } from "react";
import React from "react";
import { VendorData, VendorInterface } from "@/lib/domains/vendor/vendor-data";
import { WorkOrderTask } from "@/lib/domains/work-order/mock-data";
import { matchesSearchAllFields } from "@/lib/shared/utils";
import EditShipToForm from "./edit-shipping-form";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";

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
const TaskTooltipContent = ({ tasks }: { tasks: WorkOrderTask[] }) => (
  <div className="space-y-2 max-w-xs">
    <div className="font-semibold text-sm">Tasks ({tasks.length})</div>
    {tasks.map((task) => (
      <div key={task.id} className="flex items-center gap-2 text-xs">
        {getTaskStatusIcon(task.status)}
        <div className="flex-1">
          <div className="font-medium">{task.name}</div>
          <div className="text-muted-foreground">
            Assigned to: {task.assignee}
            {task.dueDate && ` • Due: ${task.dueDate}`}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const getAllEmployees = (employees: VendorInterface[]): VendorInterface[] => {
  const result: VendorInterface[] = [];
  const traverse = (emps: VendorInterface[]) => {
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

const flatEmployees = getAllEmployees(VendorData);
const name = [...new Set(flatEmployees.map((emp) => emp.name))];
const type = [...new Set(flatEmployees.map((emp) => emp.type))];
const contact = [...new Set(flatEmployees.map((emp) => emp.contact))];
const address1 = [...new Set(flatEmployees.map((emp) => emp.address1))];
const city = [...new Set(flatEmployees.map((emp) => emp.city))];
const state_prov = [...new Set(flatEmployees.map((emp) => emp.state_prov))];
const postal_code = [...new Set(flatEmployees.map((emp) => emp.postal_code))];
const email = [...new Set(flatEmployees.map((emp) => emp.email))];

export default function ShippingSheetTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const confirmDialog = useConfirmDialog();
  const [currentData, setCurrentData] = useState(VendorData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(VendorData.length / 5),
    totalRows: VendorData.length,
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
    toast.info(`Printing ${selectedRows.length} selected rows`);
  };

  const handleEmailSelected = (selectedRows: any[]) => {
    console.log(
      "Email selected rows:",
      selectedRows.map((row) => row.original)
    );
    toast.info(`Emailing ${selectedRows.length} selected rows`);
  };

  const handleDeleteSelected = async (selectedRows: any[]) => {
    console.log(
      "Delete selected rows:",
      selectedRows.map((row) => row.original)
    );
    const ok = await confirmDialog({
      title: "Delete selected ship-to entries?",
      description: `This will delete ${selectedRows.length} item(s). This action cannot be undone.`,
      confirmText: "Delete",
    })
    if (ok) {
      toast.success(`Deleted ${selectedRows.length} rows`)
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
      const newData = VendorData.slice(startIndex, endIndex);

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
    (searchid: string) => {
      console.log(`🔍 Server Search: "${searchValue}"`);

      setIsLoading(true);

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

        setIsLoading(false);
      }, 800); // 800ms delay to simulate server response
    },
    [paginationInfo.pageSize]
  ); // Add dependencies that actually matter

  // Column definitions
  const columns: ColumnDef<VendorInterface>[] = [
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
        <div className="font-medium text-primary flex flex-col">
          {" "}
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "type",
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
      accessorKey: "contact",
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
      accessorKey: "address1",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Address #1"
          sortable={true}
          filterOptions={address1}
        />
      ),
      cell: ({ row }) => <>{row.original.address1}</>,
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
      accessorKey: "state_prov",
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
          title="Postal"
          sortable={true}
          filterOptions={postal_code}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          console.log("Delete row:", row.original);
          (async () => {
            const ok = await confirmDialog({
              title: "Delete entry?",
              description: `Are you sure you want to delete ${row.original.name}?`,
              confirmText: "Delete",
            })
            if (ok) {
              toast.success(`Deleted ${row.original.name}`)
            }
          })()
        };

        return (
          <div className="flex flex-row justify-between ">
            <EditShipToForm
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
    <div className="w-full min-w-0 max-w-none">
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
        emptyEntity="vendors"
        defaultVisibleColumns={[
          "name",
          "type",
          "contact",
          "address1",
          "city",
          "state_prov",
          "postal_code",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="shipping-sheet-table-visibility"
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
