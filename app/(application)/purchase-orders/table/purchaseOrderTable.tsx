"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Trash2, Printer, FilePenIcon } from "lucide-react";
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
  PurchaseOrderData,
  PurchaseOrderTableInterface,
  PurchaseOrderItemInterface,
  PurchaseOrderItem,
} from "@/lib/PurchaseOrder/purchaseOrder-data";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { matchesSearchAllFields } from "@/lib/utils";
import EditPurchaseOrderForm from "../views/edit-purchaseOrder";
import ReceivePurchaseOrder from "../views/receive-purchase";
import RepairRequestForm from "@/components/forms/actualForms/repair-request-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetPurchaseOrders } from "@/services/setups/purchaseOrder";

// Get unique values for filter options (including sub-rows)
export default function PurchaseOrderDataTable() {
  const {
    data: PurchaseOrderData,
    isLoading,
    error: EmployeeDataError,
  } = useGetPurchaseOrders();

  return PurchaseOrderData ? (
    <PurchaseOrderDataLoader
      PurchaseOrderData={PurchaseOrderData}
      isLoading={isLoading}
    />
  ) : (
    <div>is loading.......</div>
  );
}

export function PurchaseOrderDataLoader({ PurchaseOrderData, isLoading }) {
  const [isServerMode, setIsServerMode] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(PurchaseOrderData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(PurchaseOrderData.length / 5),
    totalRows: PurchaseOrderData.length,
  });

  const getAllEmployees = (
    employees: PurchaseOrderTableInterface[]
  ): PurchaseOrderTableInterface[] => {
    const result: PurchaseOrderTableInterface[] = [];
    const traverse = (emps: PurchaseOrderTableInterface[]) => {
      emps.forEach((emp) => {
        result.push(emp);
      });
    };
    traverse(employees);
    return result;
  };

  const flatEmployees = getAllEmployees(PurchaseOrderData);
  const sequential_id = [...new Set(flatEmployees.map((emp) => emp.po_number))];
  const status = [...new Set(flatEmployees.map((emp) => emp.status.name))];
  const created_on = [...new Set(flatEmployees.map((emp) => emp.issued_date))];
  const vendor_name = [...new Set(flatEmployees.map((emp) => emp.vendor))];
  const required_on = [...new Set(flatEmployees.map((emp) => emp.due_date))];
  const buyer_name = [
    ...new Set(
      flatEmployees.map(
        (emp) =>
          emp.buyer.last_name +
          " " +
          emp.buyer.first_name +
          " " +
          (emp.buyer.middle_name ?? "")
      )
    ),
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
            <title>Still in progress</title>
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
              <h1>Still in progress/h1>
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

    // setIsLoading(true);

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
      const newData = PurchaseOrderData.slice(startIndex, endIndex);

      setCurrentData(newData);
      setPaginationInfo((prev) => ({
        ...prev,
        pageIndex: newPageIndex,
      }));

      // setIsLoading(false);
    }, 1000); // 1 second delay to simulate server response
  };

  // Server-side search handler
  const handleServerSearch = React.useCallback(
    (searchValue: string) => {
      console.log(`🔍 Server Search: "${searchValue}"`);

      // setIsLoading(true);

      // Simulate server delay
      setTimeout(() => {
        let filteredData = PurchaseOrderData;

        if (searchValue.trim()) {
          filteredData = PurchaseOrderData.filter((emp) =>
            matchesSearchAllFields(emp, searchValue.trim())
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

        // setIsLoading(false);
      }, 800); // 800ms delay to simulate server response
    },
    [paginationInfo.pageSize]
  ); // Add dependencies that actually matter

  const getSubRows = (originalRow: PurchaseOrderTableInterface) => {
    return originalRow.items;
  };

  // Custom sub-row renderer
  const renderSubRow = (
    subRowData: PurchaseOrderItem,
    parentRow: any,
    depth: number
  ) => {
    console.log("subRowData", subRowData);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1  gap-4">
          {" "}
          <Card>
            {" "}
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Items Information</CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent className=" grid grid-cols-6 space-y-2 text-sm">
              {" "}
              <div className="col-span-1 ">
                <span className="ml-2">{subRowData.item}</span>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                {" "}
                <span className="ml-2  ">Qty: {subRowData.quantity} </span>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  Amount #{subRowData.amount}
                </div>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  Unit Cost :{subRowData.cost}
                </div>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  Extended Cost :{subRowData.extended_cost}
                </div>{" "}
              </div> 
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  #{subRowData.notes}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
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
          filterOptions={sequential_id}
        />
      ),
      cell: ({ row }) => (
        <div
          className="font-bold text-primary flex flex-col"
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          <div>{row.original.po_number}</div>
        </div>
      ),
    },
    {
      accessorKey: "status.name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Status"
          sortable={true}
          filterOptions={status}
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
          filterOptions={created_on}
        />
      ),
      cell: ({ row }) => <>{row.original.issued_date}</>,
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
          filterOptions={[required_on as unknown as string]}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
      cell: ({ row }) => <>{row.original.due_date}</>,
    },
    {
      accessorKey: "vendor",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Vendor"
          sortable={true}
          filterOptions={vendor_name as string[]}
        />
      ),
      cell: ({ row }) => <>{row.original.vendor}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "buyer_name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Buyer"
          sortable={true}
          filterOptions={buyer_name}
        />
      ),
      cell: ({ row }) => (
        <>
          {" "}
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
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          console.log("Delete row:", row.original);
          if (
            confirm(
              `Are you sure you want to delete ${row.original.purchaseOrderNumber}?`
            )
          ) {
            alert(`Deleted ${row.original.purchaseOrderNumber}`);
            // Here you would typically call your delete API
          }
        };

        const handleCloseRow = (row: any) => {
          console.log("Delete row:", row.original);
          if (
            confirm(
              `Are you sure you want to close P0 #${row.original.purchaseOrderNumber}?`
            )
          ) {
            alert(`P0 #${row.original.purchaseOrderNumber} is closed`);
            // Here you would typically call your delete API
          }
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
        const dropdownItems = [{ label: "Receive", onSelect: genericDropdown }];

        const formComponents = {
          Receive: <ReceivePurchaseOrder data={row.original} />,
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
                    handleCloseRow(row);
                  }}
                >
                  {" "}
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
                    {/* {selectedType && <selectedType.icon className="h-5 w-5" />} */}
                    Receive Purchase Order
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
        data={isServerMode ? currentData : PurchaseOrderData}
        defaultVisibleColumns={[
          "id",
          "status",
          "created_on",
          "required_on",
          "vendor_name",
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
        enableExpanding={true}
        // Custom sub-row rendering
        renderSubRow={renderSubRow}
        subRowKey="items"
        // Server-side props
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
