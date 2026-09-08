"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  PurchaseOrderTableInterface,
  PurchaseOrderItem,
} from "@/lib/domains/purchase-order/purchaseOrder-data";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import EditPurchaseOrderForm from "../views/edit-purchaseOrder";
import ReceivePurchaseOrder from "../views/receive-purchase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetPurchaseOrdersPaginated } from "@/services/setups/purchaseOrder";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { toast } from "sonner";
import { DeletePurchaseOrderModal } from "./modals/delete-purchase-order-modal";
// import ViewPurchaseOrder from "../views/viewDetailsSheet";

export default function PurchaseOrderDataTable({
  locationId,
  statusId,
}: {
  locationId?: string;
  statusId?: string;
}) {
  return <PurchaseOrderDataLoader locationId={locationId} statusId={statusId} />;
}

export function PurchaseOrderDataLoader({
  locationId,
  statusId,
}: {
  locationId?: string;
  statusId?: string;
}) {
  const confirmDialog = useConfirmDialog();
  const [poToDelete, setPoToDelete] = useState<any | null>(null);
  const [pageIndex, setPageIndex] = useState(0); // 0-based for UI
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const currentSort = sorting[0];
  const mapColumnIdToSortBy = (id?: string): string | undefined => {
    if (!id) return undefined;
    if (id === "status.name") return "status";
    if (id === "buyer_name") return "buyer";
    return id;
  };

  const { data: paged, isLoading } = useGetPurchaseOrdersPaginated<any>({
    search: search || undefined,
    location_id: locationId || undefined,
    status_id: statusId || undefined,
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
      title: "Delete selected purchase orders?",
      description: `This will delete ${selectedRows.length} PO(s). This action cannot be undone.`,
      confirmText: "Delete",
    });
    if (ok) {
      toast.success(`Deleted ${selectedRows.length} rows`);
    }
  };

  const handlePrintRow = (row: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print PO</title>
          </head>
          <body>
            <div class="header">
              <h1>PO #${row.original.po_number}</h1>
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

  const getSubRows = (originalRow: PurchaseOrderTableInterface) => {
    return originalRow.items;
  };

  // Custom sub-row renderer
  const renderSubRow = (
    subRowData: PurchaseOrderItem,
    parentRow: any,
    depth: number
  ) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1  gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Items Information</CardTitle>
            </CardHeader>
            <CardContent className=" grid grid-cols-6 space-y-2 text-sm">
              <div className="col-span-1 ">
                <span className="ml-2">{subRowData.item}</span>
              </div>
              <div className="col-span-1 ">
                <span className="ml-2  ">Qty: {subRowData.quantity} </span>
              </div>
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  Amount #{subRowData.amount}
                </div>
              </div>
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  Unit Cost :{subRowData.cost}
                </div>
              </div>
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  Extended Cost :{subRowData.extended_cost}
                </div>
              </div>
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  #{subRowData.notes}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Column definitions
  const columns: ColumnDef<PurchaseOrderTableInterface>[] = [
    {
      accessorKey: "po_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="PO#"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        // <ViewPurchaseOrder
        //   children={
        <div
          className="font-bold text-primary flex flex-col cursor-pointer"
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          <div>{row.original.po_number}</div>
        </div>
        //   }
        //   purchaseOrderId={row.original.id}
        // />
      ),
    },
    {
      accessorKey: "status.name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Status"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "issued_date",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Issued On"
          sortable={true}
        />
      ),
      cell: ({ row }) => <>{row.original.issued_date}</>,
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Due"
          sortable={true}
        />
      ),
      cell: ({ row }) => <>{row.original.due_date}</>,
    },
    {
      accessorKey: "vendor",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Vendor"
          sortable={true}
        />
      ),
      cell: ({ row }) => <>{row.original.vendor}</>,
    },
    {
      accessorKey: "buyer_name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Buyer"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        <>
          {row.original.buyer.last_name +
            " " +
            row.original.buyer.first_name +
            " " +
            (row.original.buyer.middle_name ?? "")}
        </>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 60,
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          setPoToDelete(row.original);
        };

        const handleCloseRow = (row: any) => {
          console.log("Close row:", row.original);
          (async () => {
            const ok = await confirmDialog({
              title: "Close purchase order?",
              description: `Are you sure you want to close PO #${row.original.po_number}?`,
              confirmText: "Close",
              variant: "default",
            });
            if (ok) {
              toast.success(`PO #${row.original.po_number} closed`);
            }
          })();
        };
        const [open, setOpen] = useState(false);
        const [selectedProjectType, setSelectedProjectType] = useState<
          string | null
        >(null);

        const genericDropdown = (x: string) => {
          console.log("did something", x);
          setSelectedProjectType(x);
          setOpen(true);
        };
        const dropdownItems = [{ name: "Receive", onSelect: genericDropdown }];

        const formComponents = {
          Receive: <ReceivePurchaseOrder data={row.original} />,
        };
        const renderFormContent = () => {
          const SelectedComponent = formComponents[selectedProjectType || ""];
          console.log("new selected", SelectedComponent);
          return SelectedComponent ? SelectedComponent : null;
        };

        return (
          <div className="flex flex-row gap-2 justify-between ">
            <EditPurchaseOrderForm
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />
                </Button>
              }
              purchaseOrderId={row.original.id}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-68 " align="start">
                <DropdownMenuGroup>
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => item.onSelect(item.name)}
                    >
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Print
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseRow(row);
                  }}
                >
                  Change Status (Closed)
                </DropdownMenuItem>
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
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="w-[400px] sm:w-2/3">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    Receive Purchase Order
                  </SheetTitle>
                  <SheetDescription>
                  </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                  {renderFormContent() || "nothing else"}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <AdvancedDataTable
        columns={columns}
        data={serverRows}
        defaultVisibleColumns={[
          "po_number",
          "status.name",
          "issued_date",
          "due_date",
          "vendor",
          "buyer_name",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="purchase-table-visibility"
        getSubRows={getSubRows}
        enableExpanding={false}
        // Custom sub-row rendering
        renderSubRow={renderSubRow}
        subRowKey="items"
        // Server-side props
        realServerPagination={true}
        paginationInfo={paginationInfo}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 30, 50]}
        onServerSearch={handleServerSearch}
        serverSorting={sorting}
        onServerSortingChange={handleServerSortingChange}
        isLoading={isLoading}
      />

      <DeletePurchaseOrderModal
        purchaseOrder={poToDelete}
        onClose={() => setPoToDelete(null)}
      />
    </div>
  );
}
