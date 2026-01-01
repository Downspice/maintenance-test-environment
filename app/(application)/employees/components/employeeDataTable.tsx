"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FilePenIcon, RotateCcw } from "lucide-react";
import { useState } from "react";
import React from "react";
import {
  EmployeeTableInterface,
  RenewalInterface,
} from "@/lib/Employee/employee-data";
import EditEmployee from "../views/editEmployeeSheet";
import { useGetEmployeesPaginated, usePatchEmployeeIsActive, useGetEmployeeStatuses } from "@/services/setups/employee";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/confirm-dialog";

export default function EmployeeDataTable({
  locationId,
  typeId,
}: {
  locationId?: string;
  typeId?: string;
}) {
  return <EmployeeTableLoader locationId={locationId} typeId={typeId} />;
}

export function EmployeeTableLoader({ locationId, typeId }: { locationId?: string; typeId?: string }) {
  const patchIsActive = usePatchEmployeeIsActive();
  const { data: employeeStatuses } = useGetEmployeeStatuses<any[]>();
  const confirmDialog = useConfirmDialog();
  const [pageIndex, setPageIndex] = useState(0); // 0-based for UI
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const currentSort = sorting[0];
  const mapColumnIdToSortBy = (id?: string): string | undefined => {
    if (!id) return undefined;
    // Map nested accessor keys to API fields
    if (id === "type.name") return "type";
    // Fallback: use the id as-is for simple fields
    return id;
  };

  const { data: paged, isLoading } = useGetEmployeesPaginated<any>({
    search: search || undefined,
    location_id: locationId || undefined,
    type_id: typeId || undefined,
    size: pageSize,
    page: pageIndex + 1, // API expects 1-based
    sort_by: mapColumnIdToSortBy(currentSort?.id),
    sort_order: currentSort ? (currentSort.desc ? "desc" : "asc") : undefined,
  });

  const serverRows = paged?.data ?? [];
  const currentPage = paged?.current_page ? Number(paged.current_page) : pageIndex + 1;
  const totalPages = paged?.last_page ? Number(paged.last_page) : 1;
  const totalRows = paged?.total ? Number(paged.total) : serverRows.length;
  const effectivePageSize = paged?.per_page ? Number(paged.per_page) : pageSize;

  const paginationInfo = {
    pageIndex: currentPage - 1,
    pageSize: effectivePageSize,
    totalPages: totalPages,
    totalRows: totalRows,
  };

  // Get unique values for filter options (including sub-rows)
  const getAllEmployees = (
    employees: any[]
  ): any[] => {
    const result: any[] = [];
    const traverse = (emps: any[]) => {
      emps.forEach((emp) => {
        result.push(emp);
      });
    };
    traverse(employees);
    return result;
  };

  const flatEmployees = getAllEmployees(serverRows);
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
  const location = [...new Set(flatEmployees.map((emp) => emp.location?.name))];
  const type = [...new Set(flatEmployees.map((emp) => emp.type?.name))];
  const drivers_license_number = [
    ...new Set(flatEmployees.map((emp) => emp.driver_license_number)),
  ];
  const contact = [...new Set(flatEmployees.map((emp) => emp.cell))];

  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row.original);
  };

  const handleCellClick = (cell: any, row: any) => {
    console.log("Cell clicked:", cell.column.id, cell.getValue());
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
      title: "Deactivate selected employees?",
      description: `This will deactivate ${selectedRows.length} employee(s).`,
      confirmText: "Deactivate",
      variant: "destructive",
    })
    if (ok) {
      toast.success(`Deactivated ${selectedRows.length} rows`)
      // TODO: bulk deactivate API when available
    }
  };

  const handlePrintRow = (row: any) => {
    const employee = row.original;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
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
    if (action === "next") {
      setPageIndex((p) => Math.min(p + 1, Math.max(0, paginationInfo.totalPages - 1)));
    } else if (action === "previous") {
      setPageIndex((p) => Math.max(p - 1, 0));
    } else if (typeof action === "number") {
      setPageIndex(action);
    }
  };

  // Page size change handler: reset to first page to keep URL consistent
  const handlePageSizeChange = (size: number) => {
    setPageIndex(0);
    setPageSize(size);
  };

  // Server-side search handler
  const handleServerSearch = React.useCallback((value: string) => {
    setPageIndex(0);
    setSearch(value);
  }, []);

  // Server-side sorting handler
  const handleServerSortingChange = (next: SortingState) => {
    setPageIndex(0);
    setSorting(next);
  };

  const getSubRows = (originalRow: EmployeeTableInterface) => {
    return (originalRow as any).renewals;
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
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "employee_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Employee#"
          sortable={true}
        // filterOptions={employeeId}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium flex flex-col text-primary">
          {" "}
          {row.original.employee_number}
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
        // filterOptions={name}
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
      accessorKey: "type.name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
        // filterOptions={type}
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
        // filterOptions={drivers_license_number}
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
        // filterOptions={contact}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 60,
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          const currentStatusId: string | undefined = row.original?.status?.id
          const otherStatusId: string | undefined = Array.isArray(employeeStatuses)
            ? employeeStatuses.find((s: any) => s?.id !== currentStatusId)?.id
            : undefined

            ; (async () => {
              const isActive = row.original?.status?.is_active !== false
              const ok = await confirmDialog({
                title: isActive ? "Deactivate employee?" : "Restore employee?",
                description: isActive
                  ? `This will deactivate ${row.original.last_name + " " + row.original.first_name + " " + (row.original.middle_name ?? "")}.`
                  : `This will restore ${row.original.last_name + " " + row.original.first_name + " " + (row.original.middle_name ?? "")}.`,
                confirmText: isActive ? "Deactivate" : "Restore",
                variant: isActive ? "destructive" : "default",
                tone: isActive ? "danger" : "success",
              })
              if (ok) {
                if (!row.original?.id || !otherStatusId) {
                  toast.error("Unable to determine target status")
                  return
                }
                await patchIsActive.mutateAsync({ id: row.original.id, status_id: otherStatusId })
                toast.success(`Status updated`)
              }
            })()
        };

        const isActive = row.original?.status?.is_active !== false
        return (
          <div className="flex gap-2 w-fit">
            {isActive ? (
              <>
                <EditEmployee
                  children={
                    <Button variant={"secondary"} size={"icon"}>
                      <FilePenIcon />
                    </Button>
                  }
                  pageId={row.original.id}
                />
                <Button
                  variant={"secondary"}
                  size={"icon"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRow(row);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </>
            ) : (
              <Button
                variant={"secondary"}
                size={"sm"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRow(row);
                }}
              >
                Restore <RotateCcw className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="max-w-full">
      <AdvancedDataTable
        columns={columns}
        data={serverRows}
        defaultVisibleColumns={[
          "employee_number",
          "name",
          "type.name",
          "driver_license_number",
          "cell",
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
        enableExpanding={false}
        // Custom sub-row rendering
        renderSubRow={renderSubRow}
        subRowKey="renewals"
        // Server-side props
        realServerPagination={true}
        paginationInfo={paginationInfo}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 30, 50]}
        onServerSearch={handleServerSearch}
        serverSorting={sorting}
        onServerSortingChange={handleServerSortingChange}
        getRowClassName={(row) => (row.original?.status?.is_active === false ? "bg-red-50" : "")}
        isLoading={isLoading}
      />
    </div>
  );
}