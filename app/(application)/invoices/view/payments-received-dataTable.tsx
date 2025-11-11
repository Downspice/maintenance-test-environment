"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  PaymentReceivedInterface,
} from "@/lib/Invoice/invoices-page-data";
import RecordPaymentForm from "@/components/forms/actualForms/record-payment-form";
import EditPaymentReceived from "./edit-payment-received";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/confirm-dialog";
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
    invoice_number: payment.invoice_number,
    amount: payment.amount?.toString() || "",
    date: payment.dateReceived,
    paymentMethod: payment.methodOfPayment,
    chequeNumber: payment.chequeNumber || undefined,
    creditNumber: payment.cardNumber || undefined,
    name: payment.name || undefined,
    expirationMonth: payment.expMonth || undefined,
    expirationYear: payment.expYear || undefined,
    transaction: payment.transactionNumber || undefined,
    other: payment.otherPaymentMethod || undefined,
  };
};

export default function PaymentReceivedTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const confirmDialog = useConfirmDialog();
  
  // Fetch invoice payments from API
  const {
    data: paymentReceived = [],
    isLoading: isApiLoading,
    error: apiError,
  } = useGetInvoicePayments<PaymentReceivedInterface[]>();

  // Generate filter options from the fetched data
  const flatEmployees = useMemo(() => getAllEmployees(paymentReceived), [paymentReceived]);
  const name = useMemo(() => [...new Set(flatEmployees.map((emp) => emp.name))], [flatEmployees]);
  const dateReceived = useMemo(() => [...new Set(flatEmployees.map((emp) => emp.dateReceived))], [flatEmployees]);
  const invoice_number = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.invoice_number)),
  ], [flatEmployees]);
  const category = useMemo(() => [...new Set(flatEmployees.map((emp) => emp.category))], [flatEmployees]);
  const customer = useMemo(() => [...new Set(flatEmployees.map((emp) => emp.customer))], [flatEmployees]);
  const methodOfPayment = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.methodOfPayment)),
  ], [flatEmployees]);
  const chequeNumber = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.chequeNumber || "")),
  ], [flatEmployees]);
  const cardNumber = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.cardNumber || "")),
  ], [flatEmployees]);
  const expMonth = useMemo(() => [...new Set(flatEmployees.map((emp) => emp.expMonth || ""))], [flatEmployees]);
  const expYear = useMemo(() => [...new Set(flatEmployees.map((emp) => emp.expYear || ""))], [flatEmployees]);
  const transactionNumber = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.transactionNumber || "")),
  ], [flatEmployees]);
  const amount = useMemo(() => [
    ...new Set(flatEmployees.map((emp) => emp.amount?.toString() || "")),
  ], [flatEmployees]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState<PaymentReceivedInterface[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: 0,
    totalRows: 0,
  });

  // Update pagination info when data changes
  React.useEffect(() => {
    if (paymentReceived.length > 0) {
      setPaginationInfo({
        pageIndex: 0,
        pageSize: 5,
        totalPages: Math.ceil(paymentReceived.length / 5),
        totalRows: paymentReceived.length,
      });
      setCurrentData(paymentReceived.slice(0, 5));
    }
  }, [paymentReceived]);

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
      title: "Delete selected payments?",
      description: `This will delete ${selectedRows.length} record(s). This action cannot be undone.`,
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
      const newData = paymentReceived.slice(startIndex, endIndex);

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
        let filteredData = paymentReceived;

        if (searchValue.trim()) {
          filteredData = paymentReceived.filter((item) =>
            Object.values(item).some((value) =>
              value
                ?.toString()
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            )
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
    [paymentReceived, paginationInfo.pageSize]
  );

  // Column definitions
  const columns: ColumnDef<PaymentReceivedInterface>[] = [
    {
      accessorKey: "date_received",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Date"
          sortable={true}
          // filterOptions={dateReceived}
        />
      ),
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
          filterOptions={category}
        />
      ),
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
          filterOptions={customer}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "methodOfPayment",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Method"
          sortable={true}
          filterOptions={methodOfPayment}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    // {
    //   accessorKey: "chequeNumber",
    //   header: ({ column }) => (
    //     <SortableHeader
    //       column={column}
    //       title="Check#"
    //       sortable={true}
    //       filterOptions={chequeNumber||""}
    //     />
    //   ),
    // },
    // {
    //   accessorKey: "cardNumber",
    //   header: ({ column }) => (
    //     <SortableHeader
    //       column={column}
    //       title="Card#"
    //       sortable={true}
    //       filterOptions={cardNumber}
    //     />
    //   ),
    //   filterFn: (row, id, value) => {
    //     return value.length === 0 || value.includes(row.getValue(id));
    //   },
    // },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Name"
          sortable={true}
          filterOptions={name}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Amnt"
          sortable={true}
          filterOptions={amount}
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
      <RecordPaymentForm />
      <AdvancedDataTable
        columns={columns}
        data={isServerMode ? currentData : paymentReceived}
        defaultVisibleColumns={[
          "dateReceived",
          "invoice_number",
          "category",
          "customer",
          "methodOfPayment",
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
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading || isApiLoading}
      />
    </div>
  );
}
