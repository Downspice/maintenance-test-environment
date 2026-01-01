"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, FilePenIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import React from "react";
import {
  InventoryTableInterface,
} from "@/lib/Inventory/inventory-data";
import EditInventory from "../view/edit-inventory";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdjustInventoryForm from "@/components/forms/actualForms/adjust-inventory-form";
import CategoryChangeForm from "../form/changeCategory";
import EnableTrackingForm from "../form/enableTracking";
import ChangeMarkUpForm from "../form/changeMarkUp";
import HistoryTable from "../view/history-inventory";
import TransferInventoryForm from "../form/transferInventory";
import { useDeleteInventory, useGetInventoriesPaginated } from "@/services/setups/inventory";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/confirm-dialog";

export default function InventoryDataTable({
  locationId,
  filterType,
}: {
  locationId?: string;
  filterType?: string;
}) {
  return <InventoryDataLoader locationId={locationId} filterType={filterType} />;
}

export function InventoryDataLoader({
  locationId,
  filterType,
}: {
  locationId?: string;
  filterType?: string;
}) {
  const confirmDialog = useConfirmDialog();
  const deleteApi = useDeleteInventory();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const currentSort = sorting[0];
  const mapColumnIdToSortBy = (id?: string): string | undefined => {
    if (!id) return undefined;
    if (id === "category") return "category";
    return id;
  };

  const { data: paged, isLoading } = useGetInventoriesPaginated<any>({
    search: search || undefined,
    location_id: locationId || undefined,
    low_stock: filterType === "low_stock" ? 1 : undefined,
    out_of_stock: filterType === "out_of_stock" ? 1 : undefined,
    po_assigned: filterType === "po_assigned" ? 1 : undefined,
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
      title: "Delete selected inventory?",
      description: `This will delete ${selectedRows.length} item(s). This action cannot be undone.`,
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
            <title>Print Inventory</title>
          </head>
          <body>
            <div class="header">
              <h1>Inventory Item: ${row.original.name}</h1>
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

  // Page size change handler
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
  const columns: ColumnDef<InventoryTableInterface>[] = [
    {
      accessorKey: "part_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Part#"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary flex flex-col">
          {" "}
          {row.getValue("part_number")}
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
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-primary">{row.original.name}</div>
          <div className="font-light text-primary">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Category"
          sortable={true}
        />
      ),
      cell: ({ row }) => <>{row.original.category.name}</>,
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
      cell: ({ row }) => <>{row.original?.inventory_trackings?.[0]?.vendor_name?? ""}</>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Quantity"
          sortable={true}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1 text-sm">
            <div className=" ">
              {row.original?.inventory_trackings?.[0]?.quantity ?? ""}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "unit_cost",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit Cost"
          sortable={true}
        />
      ),
      cell: ({ row }) => {
        return <> ${row.original.unit_cost}</>;
      },
    },
    {
      accessorKey: "number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="PO #"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        <>
          <div className="flex  items-end gap-1 text-primary cursor-pointer">
            {row.original.part_number}
          </div>
        </>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 60,
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          console.log("Delete row:", row.original);

          (async () => {
            const ok = await confirmDialog({
              title: "Delete inventory item?",
              description: `Are you sure you want to delete ${row.original.name}?`,
              confirmText: "Delete",
            })
            if (ok) {
              await deleteApi.mutateAsync(row.original)
              toast.success(`Deleted Successfully`)
            }
          })()
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
        const dropdownItems = [
          { name: "Adjust", onSelect: genericDropdown },
          { name: "Transfer", onSelect: genericDropdown },
          { name: "History", onSelect: genericDropdown },
        ];

        const dropdownItems2 = [
          { name: "Change Category", onSelect: genericDropdown },
        ];

        const dropdownItems3 = [
          { name: "Enable Tacking", onSelect: genericDropdown },
          { name: "Change MarkUp", onSelect: genericDropdown },
        ];
        const formComponents = {
          Adjust: <AdjustInventoryForm data={row.original} />,
          Transfer: <TransferInventoryForm data={row.original} />,
          "Change Category": <CategoryChangeForm data={row.original} />,
          "Enable Tacking": <EnableTrackingForm data={row.original} />,
          "Change MarkUp": <ChangeMarkUpForm data={row.original} />,
          History: <HistoryTable />,
          // History: <HistoryTable data={row.original} />,
        };
        const renderFormContent = () => {
          const SelectedComponent = formComponents[selectedProjectType || ""];
          console.log("new selected", SelectedComponent);
          return SelectedComponent ? SelectedComponent : null;
        };
        const selectedType = dropdownItems.find(
          (type) => type.label === selectedProjectType
        );

        return (
          <div className="flex flex-row gap-2 justify-between ">
            <EditInventory
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />
                </Button>
              }
              pageId={row.original.id}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="start">
                <DropdownMenuGroup>
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => item.onSelect(item.name)}
                    >
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Create PO</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Create new PO</DropdownMenuItem>
                        <DropdownMenuItem>Add to existing PO</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    disabled={typeof row.original.purchase_order !== "string"}
                  >
                    Receive Purchase Order
                    {/* <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {dropdownItems2.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => item.onSelect(item.name)}
                  >
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {dropdownItems3.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => item.onSelect(item.name)}
                  >
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                ))}{" "}
                <DropdownMenuSeparator />
                <DropdownMenuItem>Email Notification</DropdownMenuItem>
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
                    {selectedType?.label}
                    {/* Receive Purchase Order */}
                  </SheetTitle>
                  <SheetDescription>
                    {/* {selectedType?.label ||
                            "Fill out the form below to set up your new development project."} */}
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
    <div className="">
      <AdvancedDataTable
        columns={columns}
        data={serverRows}
        defaultVisibleColumns={["part_number", "name", "category", "vendor", "quantity", "unit_cost", "number", "actions"]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="inventory-table-visibility"
        enableExpanding={false}
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
    </div>
  );
}