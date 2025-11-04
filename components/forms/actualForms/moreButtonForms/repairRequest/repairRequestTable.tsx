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
import { matchesSearchAllFields } from "@/lib/utils";
import { MoreButtonRequestInterface } from "./repairRequestForm";
import EditRepairRequestForm from "./edit-repairRequestForm";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/confirm-dialog";

const DummyRepairRequests: MoreButtonRequestInterface[] = [
  {
    equipment: "Excavator A",
    requestedBy: "John Doe",
    dueDate: "2025-07-20",
    repairBy: 2,
    repairRequestId: "RR-001",
    repairsNeeded: [
      {
        repair: "Hydraulic Leak",
        type: "Mechanical",
        priority: "Medium",
        laborTime: 1.5,
        notes: "Leak near cylinder",
        image: undefined,
      },
      {
        repair: "Engine Noise",
        type: "Engine",
        priority: "Medium",
        laborTime: 2,
        notes: "Rattling during acceleration",
        image: undefined,
      },
    ],
  },
  {
    equipment: "Bulldozer B",
    requestedBy: "Jane Smith",
    dueDate: "2025-07-22",
    repairBy: 1,
    repairRequestId: "RR-002",
    repairsNeeded: [
      {
        repair: "Track Replacement",
        type: "Mechanical",
        priority: "Medium",
        laborTime: 3,
        notes: "Worn tracks on left side",
        image: undefined,
      },
    ],
  },
  {
    equipment: "Loader C",
    requestedBy: "Alex Johnson",
    dueDate: "2025-07-25",
    repairBy: 3,
    repairRequestId: "RR-003",
    repairsNeeded: [
      {
        repair: "Brake Check",
        type: "Safety",
        priority: "Medium",
        laborTime: 1,
        notes: "Soft brake pedal",
        image: undefined,
      },
      {
        repair: "Oil Change",
        type: "Maintenance",
        priority: "Medium",
        laborTime: 0.5,
        notes: "",
        image: undefined,
      },
    ],
  },
];

const getAllEmployees = (
  employees: MoreButtonRequestInterface[]
): MoreButtonRequestInterface[] => {
  const result: MoreButtonRequestInterface[] = [];
  const traverse = (emps: MoreButtonRequestInterface[]) => {
    emps.forEach((emp) => {
      result.push(emp);
    });
  };
  traverse(employees);
  return result;
};

const flatEmployees = getAllEmployees(DummyRepairRequests);
const dueDate = [...new Set(flatEmployees.map((emp) => emp.dueDate))];
const equipment = [...new Set(flatEmployees.map((emp) => emp.equipment))];
const task = [
  ...new Set(flatEmployees.map((emp) => emp.repairsNeeded[0].repair)),
];
const type = [
  ...new Set(flatEmployees.map((emp) => emp.repairsNeeded[0].type)),
];
const requestedBy = [...new Set(flatEmployees.map((emp) => emp.requestedBy))];
const priority = [
  ...new Set(flatEmployees.map((emp) => emp.repairsNeeded[0].priority)),
];
const notes = [
  ...new Set(flatEmployees.map((emp) => emp.repairsNeeded[0].notes ?? "")),
];

export default function RepairRequestTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const confirmDialog = useConfirmDialog();
  const [currentData, setCurrentData] = useState(
    DummyRepairRequests.slice(0, 5)
  ); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(DummyRepairRequests.length / 5),
    totalRows: DummyRepairRequests.length,
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
      title: "Delete selected repair requests?",
      description: `This will delete ${selectedRows.length} request(s). This action cannot be undone.`,
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
      const newData = DummyRepairRequests.slice(startIndex, endIndex);

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
        let filteredData = DummyRepairRequests;

        if (searchValue.trim()) {
          filteredData = DummyRepairRequests.filter((emp) =>
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
  const columns: ColumnDef<MoreButtonRequestInterface>[] = [
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Date"
          sortable={true}
          filterOptions={dueDate}
        />
      ),
    },
    {
      accessorKey: "equipment",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Equipment"
          sortable={true}
          filterOptions={equipment}
        />
      ),
    },
    {
      accessorKey: "task",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Task"
          sortable={true}
          filterOptions={task}
        />
      ),
      cell: ({ row }) => (
        <div className="   flex flex-col">
          {row.original.repairsNeeded[0].repair}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
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
      cell: ({ row }) => (
        <div className="   flex flex-col">
          {row.original.repairsNeeded[0].type}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "requestedBy",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Requested By"
          sortable={true}
          filterOptions={requestedBy}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Priority"
          sortable={true}
          filterOptions={priority}
        />
      ),
      cell: ({ row }) => (
        <div className="   flex flex-col">
          {row.original.repairsNeeded[0].priority}
        </div>
      ),
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Notes"
          sortable={true}
          filterOptions={notes}
        />
      ),
      cell: ({ row }) => (
        <div className="   flex flex-col">
          {row.original.repairsNeeded[0].notes}
        </div>
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
          (async () => {
            const ok = await confirmDialog({
              title: "Delete repair request?",
              description: `Are you sure you want to delete ${row.original.name}?`,
              confirmText: "Delete",
            })
            if (ok) {
              toast.success(`Deleted ${row.original.name}`)
            }
          })()
        };

        return (
          <div className="flex flex-row gap-1 justify-between ">
            <EditRepairRequestForm
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />
                </Button>
              }
              data={row.original}
            />

            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRow(row);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="w-full overflow-x-auto ">
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
        data={isServerMode ? currentData : DummyRepairRequests}
        defaultVisibleColumns={[
          "dueDate",
          "equipment",
          "task",
          "type",
          "requestedBy",
          "priority",
          "notes",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="repair-request-more-button-table-visibility"
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
