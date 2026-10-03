"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon } from "lucide-react";
import { useState } from "react";
import React from "react";
import { matchesSearchAllFields } from "@/lib/shared/utils";
import EditScheduledReportForm, {
  ScheduledReportInterface,
} from "@/components/forms/setup/edit-scheduled-report-form";
import { ScheduledReportData } from "./scheduleReportDummy";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { CalendarClock } from "lucide-react";

// Get unique values for filter options (including sub-rows)
const getAllEmployees = (
  employees: ScheduledReportInterface[]
): ScheduledReportInterface[] => {
  const result: ScheduledReportInterface[] = [];
  const traverse = (emps: ScheduledReportInterface[]) => {
    emps.forEach((emp) => {
      result.push(emp);
    });
  };
  traverse(employees);
  return result;
};

function ScheduledReportRowActions({
  row,
  onDelete,
}: {
  row: { original: ScheduledReportInterface };
  onDelete: () => void;
}) {
  const formId = `edit-scheduled-report-${row.original.report.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-row justify-end gap-2">
      <EditScheduledReportForm data={row.original} formId={formId}>
        <Button variant="secondary" size="icon" type="button">
          <FilePenIcon className="size-4" />
        </Button>
      </EditScheduledReportForm>
      <Button
        variant="secondary"
        size="icon"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

const flatEmployees = getAllEmployees(ScheduledReportData);
const report = [...new Set(flatEmployees.map((emp) => emp.report))];
const frequency = [...new Set(flatEmployees.map((emp) => emp.frequency))];
const dateField = [...new Set(flatEmployees.map((emp) => emp.dateField))];
const location = [...new Set(flatEmployees.map((emp) => emp.location))];
const category = [...new Set(flatEmployees.map((emp) => emp.category))];
const equipmentFilter = [
  ...new Set(flatEmployees.map((emp) => emp.equipmentFilter.toString())),
];

export default function ScheduledReportDataTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const confirmDialog = useConfirmDialog();
  const [currentData, setCurrentData] = useState(
    ScheduledReportData.slice(0, 5)
  ); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(ScheduledReportData.length / 5),
    totalRows: ScheduledReportData.length,
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
      title: "Delete selected scheduled reports?",
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
            <title>Still in progress</title>
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
              <h1>Still in progress/h1>
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
      const newData = ScheduledReportData.slice(startIndex, endIndex);

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
        let filteredData = ScheduledReportData;

        if (searchValue.trim()) {
          filteredData = ScheduledReportData.filter((emp) =>
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
  const columns: ColumnDef<ScheduledReportInterface>[] = [
    {
      accessorKey: "report",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Report"
          sortable={true}
          filterOptions={report}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold text-primary flex flex-col">
          <div>{row.original.report}</div>
        </div>
      ),
    },
    {
      accessorKey: "frequency",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Frequency"
          sortable={true}
          filterOptions={frequency}
        />
      ),
    },
    {
      accessorKey: "dateField",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Date Field"
          sortable={true}
          filterOptions={dateField}
        />
      ),
      cell: ({ row }) => <>{row.original.date?.toDateString()}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Location"
          sortable={true}
          filterOptions={location}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
      cell: ({ row }) => <>{row.original.dueDate?.toDateString()}</>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Category"
          sortable={true}
          filterOptions={category}
        />
      ),
      cell: ({ row }) => <>{row.original.category}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "equipmentFilter",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Equipment filter"
          sortable={true}
          filterOptions={equipmentFilter}
        />
      ),
      cell: ({ row }) => <>{row.original.equipmentFilter}</>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDeleteRow = () => {
          (async () => {
            const ok = await confirmDialog({
              title: "Delete scheduled report?",
              description: `Are you sure you want to delete the report "${row.original.report}"?`,
              confirmText: "Delete",
            });
            if (ok) {
              toast.success(`Deleted "${row.original.report}"`);
            }
          })();
        };

        return (
          <ScheduledReportRowActions row={row} onDelete={handleDeleteRow} />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
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
        data={isServerMode ? currentData : ScheduledReportData}
        defaultVisibleColumns={[
          "report",
          "frequency",
          "dateField",
          "location",
          "category",
          "equipmentFilter",
          "dateInterval",
          "recipients",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="scheduled-report-table-visibility"
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
        emptyState={
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-bg-weak-50 text-primary-base ring-1 ring-stroke-soft-200">
              <CalendarClock className="size-7" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="max-w-md space-y-1">
              <p className="text-label-md font-medium text-text-strong-950">
                No scheduled reports
              </p>
              <p className="text-paragraph-sm text-text-sub-600">
                Automated exports you configure will appear here. Use New
                Scheduled Report to create one.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
