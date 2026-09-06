"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  PaymentReceivedInterface,
} from "@/lib/domains/invoice/invoices-page-data";
import RecordPaymentForm from "@/components/forms/entities/record-payment-form";
import EditPaymentReceived from "./edit-payment-received";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { useGetInvoicePayments } from "@/services/setups/invoice";

const getAllEmployees = (
  employees: PaymentReceivedInterface[]
): PaymentReceivedInterface[] => {
  const result: PaymentReceivedInterface[] = [];
  const traverse = (emps: PaymentReceivedInterface[]) => {
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

// Map PaymentReceivedInterface to the format expected by EditPaymentReceived
const mapPaymentToEditForm = (payment: PaymentReceivedInterface) => {
  return {
    invoice_id: payment.invoice_id,
    amount_received: payment.amount_received?.toString() || "",
    date_received: payment.date_received,
    payment_method_id: payment.payment_method_id,
    metadata: {
      cheque_number: payment.metadata?.cheque_number || undefined,
      credit_number: payment.metadata?.credit_number || undefined,
      name_on_card: payment.metadata?.name_on_card || undefined,
      expiration_month: payment.metadata?.expiration_month || undefined,
      expiration_year: payment.metadata?.expiration_year || undefined,
      transaction: payment.metadata?.transaction || undefined,
      other: payment.metadata?.other || undefined,
    },
  };
};

export default function PaymentReceivedTable() {
  const confirmDialog = useConfirmDialog();

  // Fetch invoice payments from API
  const {
    data: paymentReceived = [],
    isLoading: isApiLoading,
    error: apiError,
  } = useGetInvoicePayments<PaymentReceivedInterface[]>();

  // State for "server-side" features (simulated locally)
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  // Process data: Filter -> Sort -> Paginate
  const processedData = useMemo(() => {
    let data = [...paymentReceived];

    // 1. Filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(lowerSearch)
        )
      );
    }

    // 2. Sort
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      data.sort((a, b) => {
        // Handle nested properties if needed, though currently flat
        const aValue = (a as any)[id];
        const bValue = (b as any)[id];

        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
        return 0;
      });
    }

    return data;
  }, [paymentReceived, search, sorting]);

  // 3. Paginate
  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, pageIndex, pageSize]);

  const totalRows = processedData.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  const paginationInfo = {
    pageIndex,
    pageSize,
    totalPages,
    totalRows,
  };

  // Handlers
  const handlePaginationChange = (action: "next" | "previous" | number) => {
    if (action === "next") {
      setPageIndex((p) => Math.min(p + 1, Math.max(0, totalPages - 1)));
    } else if (action === "previous") {
      setPageIndex((p) => Math.max(p - 1, 0));
    } else if (typeof action === "number") {
      setPageIndex(action);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(0); // Reset to first page
  };

  const handleServerSearch = (value: string) => {
    setSearch(value);
    setPageIndex(0); // Reset to first page
  };

  const handleServerSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    // Optional: Reset to first page on sort change? Usually good practice.
    // setPageIndex(0); 
  };

  // Generate filter options from the fetched data (for column headers)
  const flatEmployees = useMemo(() => getAllEmployees(paymentReceived), [paymentReceived]);
  const invoice_number = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.invoice_number)),
  ], [flatEmployees]);

  // ... (other filter options can remain if needed for specific column filters, 
  // but we are using global search mostly)

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
      title: "Delete selected payments?",
      description: `This will delete ${selectedRows.length} record(s). This action cannot be undone.`,
      confirmText: "Delete",
    })
    if (ok) {
      toast.success(`Deleted ${selectedRows.length} rows`)
    }
  };

  const handlePrintRow = (row: any) => {
    // ... existing print logic ...
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

  // Column definitions
  const columns: ColumnDef<PaymentReceivedInterface>[] = [
    {
      accessorKey: "date_received", // Fixed accessor key to match interface
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Date"
          sortable={true}
        />
      ),
      cell: ({ row }) => {
        // Format date if needed, or just display
        return <div>{row.getValue("date_received")}</div>
      }
    },
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
    },
    {
      accessorKey: "customer",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Customer"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "payment_method_name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Method"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "metadata.cheque_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Cheque#"
          sortable={true}
        />
      ),
      cell: ({ row }) => {
        // Format date if needed, or just display
        const metadata = row.original?.metadata
        console.log(metadata)
        return <div>{metadata?.cheque_number}</div>
      }
    },
    {
      accessorKey: "amount_received",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Amnt"
          sortable={true}
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
              title: "Delete payment?",
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
            <EditPaymentReceived
              children={
                <Button variant={"secondary"} size={"icon"}>
                  <FilePenIcon />
                </Button>
              }
              data={mapPaymentToEditForm(row.original)}
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
              <Trash2 className="  h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Show error state if API fails
  if (apiError) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading invoice payments. Please try again later.
      </div>
    );
  }

  return (
    <div className="">
      <RecordPaymentForm />
      <AdvancedDataTable
        columns={columns}
        data={paginatedData} // Use paginated data
        defaultVisibleColumns={[
          "date_received",
          "invoice_number",
          "category",
          "customer",
          "payment_method_name",
          "name",
          "amount",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="payments-received-table-visibility"

        // Enable "Server" Pagination (Simulated)
        realServerPagination={true}
        paginationInfo={paginationInfo}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[5, 10, 20, 50]}

        // Enable "Server" Search (Simulated)
        onServerSearch={handleServerSearch}

        // Enable "Server" Sorting (Simulated)
        serverSorting={sorting}
        onServerSortingChange={handleServerSortingChange}

        isLoading={isApiLoading}
      />
    </div>
  );
}
