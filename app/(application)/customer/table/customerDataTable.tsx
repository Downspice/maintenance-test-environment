"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon, RotateCcw } from "lucide-react";
import { useState } from "react";
import React from "react";
import { CustomerTableDataInterface } from "@/lib/Customer/customer-data";
import EditCustomer from "../views/edit-customer";
import { useGetCustomersPaginated, usePatchCustomerIsActive } from "@/services/setups/vendor";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/confirm-dialog";

export default function CustomerDataTable({
  locationId,
  typeId,
}: {
  locationId?: string;
  typeId?: string;
}) {
  return <CustomerTableLoader locationId={locationId} typeId={typeId} />;
}

export function CustomerTableLoader({ locationId, typeId }: { locationId?: string; typeId?: string }) {
  const patchIsActive = usePatchCustomerIsActive();
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

  const { data: paged, isLoading } = useGetCustomersPaginated<any>({
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

  // Get unique values for filter options
  const getAllCustomers = (customers: CustomerTableDataInterface[]): CustomerTableDataInterface[] => {
    const result: CustomerTableDataInterface[] = [];
    const traverse = (custs: CustomerTableDataInterface[]) => {
      custs.forEach((cust) => {
        result.push(cust);
      });
    };
    traverse(customers);
    return result;
  };

  const flatCustomers = getAllCustomers(serverRows);
  const name = [...new Set(flatCustomers.map((cust) => cust.company_name ?? ""))];
  const type = [...new Set(flatCustomers.map((cust) => cust.type?.name ?? ""))];
  const address1 = [...new Set(flatCustomers.map((cust) => cust.address ?? ""))];
  const city = [...new Set(flatCustomers.map((cust) => cust.city ?? ""))];
  const state_prov = [...new Set(flatCustomers.map((cust) => cust.state ?? ""))];
  const postal_code = [...new Set(flatCustomers.map((cust) => cust.postal_code ?? ""))];
  const email = [...new Set(flatCustomers.map((cust) => cust.email ?? ""))];

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
      title: "Deactivate selected customers?",
      description: `This will deactivate ${selectedRows.length} customer(s).`,
      confirmText: "Deactivate",
      variant: "destructive",
    })
    if (ok) {
      toast.success(`Deactivated ${selectedRows.length} rows`)
      // TODO: bulk deactivate API when available
    }
  };

  const handlePrintRow = (row: any) => {
    const customer = row.original;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
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
      accessorKey: "company_name",
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
          {row.getValue("company_name")}
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
          filterOptions={type}
        />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Address #1"
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
          title="State/Prov"
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
      accessorKey: "email",
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
          ;(async () => {
            const isActive = row.original?.is_active === true
            const ok = await confirmDialog({
              title: isActive ? "Deactivate customer?" : "Restore customer?",
              description: isActive
                ? `This will deactivate ${row.original.company_name}.`
                : `This will restore ${row.original.company_name}.`,
              confirmText: isActive ? "Deactivate" : "Restore",
              variant: isActive ? "destructive" : "default",
              tone: isActive ? "danger" : "success",
            })
            if (ok) {
              if (!row.original?.id) {
                toast.error("Unable to determine customer ID")
                return
              }
              await patchIsActive.mutateAsync({ id: row.original.id, is_active: !isActive })
              toast.success(`Status updated`)
            }
          })()
        };

        const isActive = row.original?.is_active === true
        return (
          <div className="flex flex-row gap-2 justify-end">
            {isActive ? (
              <>
                <EditCustomer
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
          "company_name",
          "type",
          "address",
          "city",
          "state",
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
        storageKey="customer-table-visibility"
        realServerPagination={true}
        paginationInfo={paginationInfo}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 30, 50]}
        onServerSearch={handleServerSearch}
        serverSorting={sorting}
        onServerSortingChange={handleServerSortingChange}
        getRowClassName={(row) => (row.original?.is_active === false ? "bg-red-50" : "")}
        isLoading={isLoading}
      />
    </div>
  );
}