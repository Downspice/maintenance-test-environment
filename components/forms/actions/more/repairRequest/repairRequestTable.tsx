"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon } from "lucide-react";
import { useState, useMemo } from "react";
import React from "react";
import { matchesSearchAllFields } from "@/lib/shared/utils";
import { MoreButtonRequestInterface } from "./repairRequestForm";
import EditRepairRequestForm from "./edit-repairRequestForm";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { format } from "date-fns";

export const DummyRepairRequests: MoreButtonRequestInterface[] = [
  {
    equipment: "Excavator A",
    requestedBy: "John Doe",
    dueDate: "2025-07-20" as any,
    repairBy: 2,
    repairRequestId: "RR-001",
    repairsNeeded: [
      {
        repair: "Hydraulic Leak",
        type: "Mechanical",
        priority: "High",
        laborTime: 1.5,
        notes: "Leak near cylinder",
        image: undefined,
      },
      {
        repair: "Engine Noise",
        type: "Mechanical",
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
    dueDate: "2025-07-22" as any,
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
    dueDate: "2025-07-25" as any,
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

interface RepairRequestTableProps {
  data?: MoreButtonRequestInterface[];
  onUpdate?: (updated: MoreButtonRequestInterface) => void;
  onDelete?: (id: string) => void;
  onDeleteMany?: (ids: string[]) => void;
}

export default function RepairRequestTable({
  data: externalData,
  onUpdate,
  onDelete,
  onDeleteMany,
}: RepairRequestTableProps) {
  const [internalData, setInternalData] = useState<MoreButtonRequestInterface[]>(
    DummyRepairRequests
  );
  const data = externalData ?? internalData;

  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const confirmDialog = useConfirmDialog();
  const [currentData, setCurrentData] = useState(data.slice(0, 5));
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(data.length / 5),
    totalRows: data.length,
  });

  const dueDate = useMemo(
    () => [...new Set(data.map((emp) => String(emp.dueDate)))],
    [data]
  );
  const equipment = useMemo(
    () => [...new Set(data.map((emp) => emp.equipment))],
    [data]
  );
  const task = useMemo(
    () => [
      ...new Set(
        data.map((emp) => emp.repairsNeeded?.[0]?.repair).filter(Boolean)
      ),
    ],
    [data]
  );
  const type = useMemo(
    () => [
      ...new Set(
        data.map((emp) => emp.repairsNeeded?.[0]?.type).filter(Boolean)
      ),
    ],
    [data]
  );
  const requestedBy = useMemo(
    () => [...new Set(data.map((emp) => emp.requestedBy))],
    [data]
  );
  const priority = useMemo(
    () => [
      ...new Set(
        data.map((emp) => emp.repairsNeeded?.[0]?.priority).filter(Boolean)
      ),
    ],
    [data]
  );
  const notes = useMemo(
    () => [
      ...new Set(
        data.map((emp) => emp.repairsNeeded?.[0]?.notes ?? "").filter(Boolean)
      ),
    ],
    [data]
  );

  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row.original);
  };

  const handleCellClick = (cell: any, row: any) => {
    console.log("Cell clicked:", cell.column.id, cell.getValue());
  };

  const handlePrintSelected = (selectedRows: any[]) => {
    toast.info(`Printing ${selectedRows.length} selected rows`);
  };

  const handleEmailSelected = (selectedRows: any[]) => {
    toast.info(`Emailing ${selectedRows.length} selected rows`);
  };

  const handleDeleteSelected = async (selectedRows: any[]) => {
    const ids = selectedRows
      .map((r) => r.original.repairRequestId)
      .filter(Boolean);
    const ok = await confirmDialog({
      title: "Delete selected repair requests?",
      description: `This will delete ${selectedRows.length} request(s). This action cannot be undone.`,
      confirmText: "Delete",
    });
    if (ok) {
      if (onDeleteMany) {
        onDeleteMany(ids);
      } else {
        setInternalData((prev) =>
          prev.filter((r) => !ids.includes(r.repairRequestId || ""))
        );
      }
      toast.success(`Deleted ${selectedRows.length} rows`);
    }
  };

  const handlePrintRow = (row: any) => {
    const item = row.original;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Repair Request - ${item.repairRequestId || item.equipment}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .field { margin-bottom: 10px; }
              .label { font-weight: bold; display: inline-block; width: 140px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Repair Request ${item.repairRequestId || ""}</h1>
              <p>Equipment: ${item.equipment}</p>
              <p>Requested By: ${item.requestedBy}</p>
              <p>Due Date: ${item.dueDate}</p>
            </div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePaginationChange = (action: "next" | "previous" | number) => {
    setIsLoading(true);
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
      const startIndex = newPageIndex * paginationInfo.pageSize;
      const endIndex = startIndex + paginationInfo.pageSize;
      const newData = data.slice(startIndex, endIndex);

      setCurrentData(newData);
      setPaginationInfo((prev) => ({
        ...prev,
        pageIndex: newPageIndex,
      }));
      setIsLoading(false);
    }, 500);
  };

  const handleServerSearch = React.useCallback(
    (searchValue: string) => {
      setIsLoading(true);
      setTimeout(() => {
        let filteredData = data;
        if (searchValue.trim()) {
          filteredData = data.filter((item) =>
            matchesSearchAllFields(item, searchValue.trim())
          );
        }
        const newData = filteredData.slice(0, paginationInfo.pageSize);
        setCurrentData(newData);
        setPaginationInfo((prev) => ({
          ...prev,
          pageIndex: 0,
          totalPages: Math.ceil(filteredData.length / prev.pageSize),
          totalRows: filteredData.length,
        }));
        setIsLoading(false);
      }, 500);
    },
    [data, paginationInfo.pageSize]
  );

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
      cell: ({ row }) => {
        const val = row.original.dueDate;
        if (!val) return "-";
        try {
          const d = typeof val === "string" ? new Date(val) : val;
          return <span>{format(d, "yyyy-MM-dd")}</span>;
        } catch {
          return <span>{String(val)}</span>;
        }
      },
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
        <div className="flex flex-col">
          {row.original.repairsNeeded?.[0]?.repair || "-"}
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
        <div className="flex flex-col">
          {row.original.repairsNeeded?.[0]?.type || "-"}
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
        <div className="flex flex-col">
          {row.original.repairsNeeded?.[0]?.priority || "-"}
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
        <div className="flex flex-col">
          {row.original.repairsNeeded?.[0]?.notes || "-"}
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
        const handleDeleteRow = (targetRow: any) => {
          (async () => {
            const ok = await confirmDialog({
              title: "Delete repair request?",
              description: `Are you sure you want to delete repair request for ${targetRow.original.equipment}?`,
              confirmText: "Delete",
            });
            if (ok) {
              if (onDelete && targetRow.original.repairRequestId) {
                onDelete(targetRow.original.repairRequestId);
              } else {
                setInternalData((prev) =>
                  prev.filter(
                    (r) =>
                      r.repairRequestId !== targetRow.original.repairRequestId
                  )
                );
              }
              toast.success(
                `Deleted repair request ${targetRow.original.repairRequestId || ""}`
              );
            }
          })();
        };

        return (
          <div
            className="flex flex-row gap-1 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <EditRepairRequestForm
              data={row.original}
              onUpdate={onUpdate}
            >
              <Button variant="secondary" size="icon">
                <FilePenIcon className="size-4" />
              </Button>
            </EditRepairRequestForm>

            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRow(row);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <AdvancedDataTable
        columns={columns}
        data={isServerMode ? currentData : data}
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
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
