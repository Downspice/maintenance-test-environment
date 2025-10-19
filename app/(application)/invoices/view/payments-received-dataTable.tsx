"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenIcon } from "lucide-react";
import React, { useState } from "react";
import {
  paymentReceived,
  PaymentReceivedInterface,
} from "@/lib/Invoice/invoices-page-data";
import RecordPaymentForm from "@/components/forms/actualForms/record-payment-form";
import EditPaymentReceived from "./edit-payment-received";

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

const flatEmployees = getAllEmployees(paymentReceived);
const name = [...new Set(flatEmployees.map((emp) => emp.name))];
const dateReceived = [...new Set(flatEmployees.map((emp) => emp.dateReceived))];
const invoice_number = [
  ...new Set(flatEmployees.map((emp) => emp.invoice_number)),
];
const category = [...new Set(flatEmployees.map((emp) => emp.category))];
const customer = [...new Set(flatEmployees.map((emp) => emp.customer))];
const methodOfPayment = [
  ...new Set(flatEmployees.map((emp) => emp.methodOfPayment)),
];
const chequeNumber = [
  ...new Set(flatEmployees.map((emp) => emp.chequeNumber || "")),
];
const cardNumber = [
  ...new Set(flatEmployees.map((emp) => emp.cardNumber || "")),
];
const expMonth = [...new Set(flatEmployees.map((emp) => emp.expMonth || ""))];
const expYear = [...new Set(flatEmployees.map((emp) => emp.expYear || ""))];
const transactionNumber = [
  ...new Set(flatEmployees.map((emp) => emp.transactionNumber || "")),
];
const amount = [
  ...new Set(flatEmployees.map((emp) => emp.amount?.toString() || "")),
];

export default function PaymentReceivedTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(paymentReceived.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(paymentReceived.length / 5),
    totalRows: paymentReceived.length,
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
    alert(`Printing ${selectedRows.length} selected rows`);
  };

  const handleEmailSelected = (selectedRows: any[]) => {
    console.log(
      "Email selected rows:",
      selectedRows.map((row) => row.original)
    );
    alert(`Emailing ${selectedRows.length} selected rows`);
  };

  const handleDeleteSelected = (selectedRows: any[]) => {
    console.log(
      "Delete selected rows:",
      selectedRows.map((row) => row.original)
    );
    if (
      confirm(
        `Are you sure you want to delete ${selectedRows.length} selected rows?`
      )
    ) {
      alert(`Deleted ${selectedRows.length} rows`);
      // Here you would typically call your bulk delete API
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
    [paginationInfo.pageSize]
  ); // Add dependencies that actually matter

  // Column definitions
  const columns: ColumnDef<PaymentReceivedInterface>[] = [
    {
      accessorKey: "dateReceived",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Date"
          sortable={true}
          filterOptions={dateReceived}
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
          if (
            confirm(`Are you sure you want to delete ${row.original.name}?`)
          ) {
            alert(`Deleted ${row.original.name}`);
            // Here you would typically call your delete API
          }
        };

        return (
          <div className="flex flex-row gap-1 justify-between ">
            <EditPaymentReceived
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
        isLoading={isLoading}
      />
    </div>
  );
}
