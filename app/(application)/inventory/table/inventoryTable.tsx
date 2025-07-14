"use client";

import type { ColumnDef } from "@tanstack/react-table";
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
  InventoryData,
  InventoryInterface,
} from "@/lib/Inventory/inventory-data";
import { matchesSearchAllFields } from "@/lib/utils";
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
import TransferInventoryForm from "../form/transferinventory";
import CategoryChangeForm from "../form/changeCategory";
import EnableTrackingForm from "../form/enableTracking";
import ChangeMarkUpForm from "../form/changeMarkUp";
import HistoryTable from "../view/history-inventory";

const getAllEmployees = (
  employees: InventoryInterface[]
): InventoryInterface[] => {
  const result: InventoryInterface[] = [];
  const traverse = (emps: InventoryInterface[]) => {
    emps.forEach((emp) => {
      result.push(emp);
    });
  };
  traverse(employees);
  return result;
};

const flatEmployees = getAllEmployees(InventoryData);

const unit_cost = [
  ...new Set(flatEmployees.map((emp) => emp.unitCost.toString())),
];
const number = [...new Set(flatEmployees.map((emp) => emp.number))];
const name = [...new Set(flatEmployees.map((emp) => emp.name))];
const category = [
  ...new Set(flatEmployees.map((emp) => emp.category?.toString())),
];
const vendor_names = [
  ...new Set(flatEmployees.map((emp) => emp?.warehouses?.[0]?.vendor ?? "")),
];
const quantity = [
  ...new Set(flatEmployees.map((emp) => emp?.warehouses?.[0]?.quantity ?? "")),
];

export default function InventoryDataTable() {
  const [isServerMode, setIsServerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(InventoryData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(InventoryData.length / 5),
    totalRows: InventoryData.length,
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
      const newData = InventoryData.slice(startIndex, endIndex);

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
        let filteredData = InventoryData;

        if (searchValue.trim()) {
          filteredData = InventoryData.filter((emp) =>
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

        setIsLoading(false);
      }, 800); // 800ms delay to simulate server response
    },
    [paginationInfo.pageSize]
  ); // Add dependencies that actually matter

  // Column definitions
  const columns: ColumnDef<InventoryInterface>[] = [
    {
      accessorKey: "number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Part#"
          sortable={true}
          filterOptions={number}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary flex flex-col">
          {" "}
          {row.getValue("number")}
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
          filterOptions={name}
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
          filterOptions={category as string[]}
        />
      ),
      cell: ({ row }) => <>{row.original.category}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "vendor",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Vendor"
          sortable={true}
          filterOptions={vendor_names}
        />
      ),
      cell: ({ row }) => <>{row.original.warehouses?.[0]?.vendor ?? ""}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Quantity"
          sortable={true}
          filterOptions={quantity}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1 text-sm">
            {row.original.warehouses?.[0]?.reorderPoint ??
            0 >= row.original.warehouses?.[0]?.quantity ??
            0 ? (
              <span className=" font-bold text-red-600">
                {row.original.warehouses?.[0]?.quantity ?? 0}
              </span>
            ) : (
              <div className=" ">
                {row.original.warehouses?.[0]?.quantity ?? ""}{" "}
              </div>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "unit_cost",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit Cost"
          sortable={true}
          filterOptions={unit_cost}
        />
      ),
      cell: ({ row }) => {
        return <> ${row.original.unitCost}</>;
      },
    },
    {
      accessorKey: "number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="PO #"
          sortable={true}
          filterOptions={number}
        />
      ),
      cell: ({ row }) => (
        <>
          <div className="flex  items-end gap-1 text-primary cursor-pointer">
            {row.original.number}
          </div>
        </>
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
          { label: "Adjust", onSelect: genericDropdown },
          { label: "Transfer", onSelect: genericDropdown },
          { label: "History", onSelect: genericDropdown },
        ];

        const dropdownItems2 = [
          { label: "Change Category", onSelect: genericDropdown },
        ];

        const dropdownItems3 = [
          { label: "Enable Tacking", onSelect: genericDropdown },
          { label: "Change MarkUp", onSelect: genericDropdown },
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
              data={row.original}
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
                      key={item.label}
                      onClick={() => item.onSelect(item.label)}
                    >
                      <span>{item.label}</span>
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
                    key={item.label}
                    onClick={() => item.onSelect(item.label)}
                  >
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {dropdownItems3.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => item.onSelect(item.label)}
                  >
                    <span>{item.label}</span>
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
        data={isServerMode ? currentData : InventoryData}
        defaultVisibleColumns={["name", "email", "department", "actions"]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="employee-table-visibility"
        realServerPagination={isServerMode}
        paginationInfo={isServerMode ? paginationInfo : undefined}
        onPaginationChange={isServerMode ? handlePaginationChange : undefined}
        onServerSearch={isServerMode ? handleServerSearch : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
