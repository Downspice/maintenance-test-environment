"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, FilePenIcon } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
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
import { InvoiceTableInterface } from "@/lib/domains/invoice/invoice-data";
import EditInvoice from "../views/edit-invoice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActualRecordPaymentForm } from "@/components/forms/entities/record-payment-form";
import { useDeleteInvoice, useGetInvoices } from "@/services/setups/invoice";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { DeleteInvoiceModal } from "./modals/delete-invoice-modal";

export default function InvoicesDataTable() {
  const {
    data: InvoiceData,
    isLoading,
  } = useGetInvoices<InvoiceTableInterface[]>();

  return (
    <InvoicesTableLoader InvoiceData={InvoiceData ?? []} isLoading={isLoading} />
  );
}

export function InvoicesTableLoader({
  InvoiceData = [],
  isLoading,
}: {
  InvoiceData?: InvoiceTableInterface[];
  isLoading: boolean;
}) {
  const deleteApi = useDeleteInvoice();
  const confirmDialog = useConfirmDialog();
  const [invoiceToDelete, setInvoiceToDelete] = useState<any | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // For now, using client-side pagination until paginated API is available
  // This structure matches the vendor table pattern
  const serverRows = InvoiceData ?? [];
  const currentPage = pageIndex + 1;
  const totalPages = Math.max(1, Math.ceil(serverRows.length / pageSize));
  const totalRows = serverRows.length;

  const paginationInfo = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalPages: totalPages,
    totalRows: totalRows,
  };

  const getAllEmployees = (
    employees: InvoiceTableInterface[]
  ): InvoiceTableInterface[] => {
    const result: InvoiceTableInterface[] = [];
    const traverse = (emps: InvoiceTableInterface[]) => {
      emps.forEach((emp) => {
        result.push(emp);
      });
    };
    traverse(employees);
    return result;
  };

  const flatEmployees = getAllEmployees(serverRows);
  const invoice_number = [
    ...new Set(flatEmployees.map((emp) => emp.invoice_number)),
  ];
  const status = [...new Set(flatEmployees.map((emp) => emp.status))];
  const issued_date = [...new Set(flatEmployees.map((emp) => emp.invoice_date))];
  const due_date = [...new Set(flatEmployees.map((emp) => emp.due_date))];
  const customer_name = [
    ...new Set(flatEmployees.map((emp) => emp.customer?.company_name).filter(Boolean)),
  ];
  const total = [
    ...new Set(flatEmployees.map((emp) => emp.total?.toString()).filter(Boolean)),
  ];
  const payment = [
    ...new Set(flatEmployees.map((emp) => emp.payments?.toString()).filter(Boolean)),
  ];

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
      title: "Delete selected invoices?",
      description: `This will delete ${selectedRows.length} invoice(s). This action cannot be undone.`,
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
  const columns: ColumnDef<InvoiceTableInterface>[] = [
    {
      accessorKey: "invoice_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Invoice#"
          sortable={true}
          filterOptions={invoice_number}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary flex flex-col">
          {" "}
          {row.getValue("invoice_number")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Status"
          sortable={true}
          filterOptions={status}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary">{row.original.status}</div>
      ),
    },
    {
      accessorKey: "invoice_date",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Issued"
          sortable={true}
          filterOptions={issued_date}
        />
      ),
      cell: ({ row }) => <>{row.original.invoice_date}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Due"
          sortable={true}
          filterOptions={due_date}
        />
      ),
      cell: ({ row }) => <>{row.original.due_date}</>,

      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "customer",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Customer"
          sortable={true}
          filterOptions={customer_name}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1 text-primary">
            {row.original.customer?.company_name}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Total"
          sortable={true}
          filterOptions={total}
        />
      ),
      cell: ({ row }) => {
        return <> ${row.original.total}</>;
      },
    },
    {
      accessorKey: "payments",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Payment"
          sortable={true}
          filterOptions={payment}
        />
      ),
      cell: ({ row }) => {
        return <> ${row.original.payments}</>;
      },
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
          setInvoiceToDelete(row.original);
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
          { name: "Record Payment", onSelect: genericDropdown },
        ];

        const formComponents: Record<string, React.ReactElement> = {
          "Record Payment": (
            <ActualRecordPaymentForm
              invoiceNumber={row.original.id}
              onSuccess={() => setOpen(false)}
            />
          ),
        };
        const renderFormContent = () => {
          const SelectedComponent = selectedProjectType ? formComponents[selectedProjectType] : null;
          console.log("new selected", SelectedComponent);
          return SelectedComponent ? SelectedComponent : null;
        };

        const selectedType = dropdownItems.find(
          (type) => type.name === selectedProjectType
        );

        return (
          <div className="flex flex-row justify-between gap-x-2">
            <EditInvoice
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />
                </Button>
              }
              invoiceId={row.original.id}
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
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {selectedType?.name}
                    {/* Receive Purchase Order */}
                  </SheetTitle>
                  <SheetDescription></SheetDescription>
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
        emptyEntity="invoices"
        defaultVisibleColumns={[
          "invoice_number",
          "status",
          "invoice_date",
          "due_date",
          "customer",
          "total",
          "payments",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="invoices-table-visibility"
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

      <DeleteInvoiceModal
        invoice={invoiceToDelete}
        onClose={() => setInvoiceToDelete(null)}
        deleteApi={deleteApi}
      />
    </div>
  );
}
