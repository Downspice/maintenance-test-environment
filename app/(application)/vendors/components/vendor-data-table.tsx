"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon, RecycleIcon } from "lucide-react";
import { useState } from "react";
import React from "react";
// Using API response shape directly for table rows
import ViewVendor from "../views/viewDetailsSheet";
import EditVendor from "../views/editVendorSheet";
import {
  useGetStatusOnes,
} from "@/services/setups/lookups";
import {
  useGetVendorsPaginated,
  usePatchVendorIsActive,
} from "@/services/setups/vendor";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";

export default function VendorDataTable({
  locationId,
  typeId,
}: {
  locationId?: string;
  typeId?: string;
}) {
  return <VendorTableLoader locationId={locationId} typeId={typeId} />;
}

export function VendorTableLoader({ locationId, typeId }: { locationId?: string; typeId?: string }) {
  const patchIsActive = usePatchVendorIsActive();
  const { data: statusOnes } = useGetStatusOnes<any[]>();
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
    if (id === "vendor_contact.phone_one") return "contact";
    if (id === "vendor_contact.email") return "email";
    // Fallback: use the id as-is for simple fields
    return id;
  };

  const { data: paged, isLoading } = useGetVendorsPaginated<any>({
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
  const name = [...new Set(flatEmployees.map((emp) => emp.name))];
  const type = [...new Set(flatEmployees.map((emp) => emp.type.name))];
  const contact = [...new Set(flatEmployees.map((emp) => emp.contact?.phone_one))];
  const address1 = [...new Set(flatEmployees.map((emp) => emp.address))];
  const city = [...new Set(flatEmployees.map((emp) => emp.city))];
  const state_prov = [...new Set(flatEmployees.map((emp) => emp.state))];
  const postal_code = [...new Set(flatEmployees.map((emp) => emp.postal_code))];
  const email = [...new Set(flatEmployees.map((emp) => emp.vendor_contact.email))];

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
      title: "Delete selected vendors?",
      description: `This will delete ${selectedRows.length} vendor(s). This action cannot be undone.`,
      confirmText: "Delete",
    })
    if (ok) {
      toast.success(`Deleted ${selectedRows.length} rows`)
      // TODO: bulk delete API when available
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

  // Column definitions
  const columns: ColumnDef<any>[] = [
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
        // filterOptions={type}
        />
      ),
    },
    {
      accessorKey: "vendor_contact.phone_one",
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
      accessorKey: "address",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Address"
          sortable={true}
        // filterOptions={address1}
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
        // filterOptions={city}
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
        // filterOptions={state_prov}
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
        // filterOptions={postal_code}
        />
      ),
    },
    {
      accessorKey: "vendor_contact.email",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Email"
          sortable={true}
        // filterOptions={email}
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
          const otherStatusId: string | undefined = Array.isArray(statusOnes)
            ? statusOnes.find((s: any) => s?.id !== currentStatusId)?.id
            : undefined

            ; (async () => {
              const isActive = row.original?.status?.is_active !== false
              const ok = await confirmDialog({
                title: isActive ? "Deactivate vendor?" : "Restore vendor?",
                description: isActive
                  ? `This will deactivate ${row.original.name}.`
                  : `This will restore ${row.original.name}.`,
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
          <div className="flex flex-row gap-2 justify-end">
            {isActive ? (
              <>
                <EditVendor
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
                Restore <RecycleIcon className="w-4 h-4" />
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
        data={serverRows}
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
