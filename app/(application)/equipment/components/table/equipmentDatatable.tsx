"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Trash2, Printer, FileTextIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import EquipmentProfile, {
  HistoryTabs,
  PartsManager,
  Tasks,
} from "../views/EquipmentProfile";
import AdjustInventoryForm from "@/components/forms/actualForms/adjust-inventory-form";
import ActualRepairRequestForm from "@/components/forms/actualForms/repairRequest";
import InspectionForm from "@/components/forms/actualForms/new-inspection";
import FuelTransactionForm from "../forms/FuelTransactionForm";
import GeneralExpense from "@/components/forms/actualForms/new-general-expense";
import AssignEquipmentForm from "../forms/AssignEquipment";
import NewAccident from "@/components/forms/actualForms/new-accident";
import FluidConsumedForm from "../forms/FluidConsumed";
import NewMeterReplacementForm from "../forms/MeterReplacement";
import { ActualEquipmentForm } from "../new-equipment-form";
import { ActualWorkOrderForm } from "@/components/forms/actualForms/work-order-form";
import { useGetEquipments } from "@/services/setups/equipments";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/confirm-dialog";

export default function DataTableDemo() {
  const {
    data: EquipmentData,
    isLoading,
    error: vendorTypesError,
  } = useGetEquipments();

  return EquipmentData ? (
    <EquipmentTableLoader EquipmentData={EquipmentData} isLoading={isLoading} />
  ) : (
    <div>is loading.......</div>
  );
}

export function EquipmentTableLoader({ EquipmentData, isLoading }) {
  const [isServerMode, setIsServerMode] = useState(false);
  const confirmDialog = useConfirmDialog();
  // const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(EquipmentData.slice(0, 5)); // Show first 5 for demo
  const [paginationInfo, setPaginationInfo] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: Math.ceil(EquipmentData.length / 5),
    totalRows: EquipmentData.length,
  });

  // Enhanced data type with sub-rows
  type Employee = {
    id: string;
    unit_number: string;
    make_id: string;
    model_id: string;
    year: string;
    serial_number: string;
    tag_number: any;
    type_id: string;
    description: any;
    location: any;
    status_id: string;
    employee_id: any;
    cost_center_id: any;
    parent_id: any;
    is_sync: boolean;
    color_id: string;
    length: any;
    width: any;
    height: any;
    gross_weight: number;
    notes: any;
    created_by: any;
    updated_by: any;
    created_at: string;
    updated_at: string;
    type: Type;
  };

  interface Type {
    id: string;
    name: string;
    created_by: any;
    updated_by: any;
    created_at: string;
    updated_at: string;
  }
  interface Task {
    id: string;
    title: string;
    type: "maintenance" | "incident" | "inspection" | "renewal" | "pm";
    instructions: string;
    woNumber: string;
    dueDate: string;
  }

  // Get unique values for filter options (including sub-rows)
  const getAllEmployees = (employees: Employee[]): Employee[] => {
    const result: Employee[] = [];
    const traverse = (emps: Employee[]) => {
      emps.forEach((emp) => {
        result.push(emp);
      });
    };
    traverse(employees);
    return result;
  };

  const flatEmployees = getAllEmployees(EquipmentData);
  const unit_number = [...new Set(flatEmployees.map((emp) => emp.unit_number))];
  const model = [...new Set(flatEmployees.map((emp) => emp.model))];
  const year = [...new Set(flatEmployees.map((emp) => emp.year))];
  const serial_number = [
    ...new Set(flatEmployees.map((emp) => emp.serial_number)),
  ];

  const equipmentType = [...new Set(flatEmployees.map((emp) => emp.type.name))];
  const meter = [...new Set(flatEmployees.map((emp) => emp.meter))];
  const taskStatus = [...new Set(flatEmployees.map((emp) => emp.taskStatus))];

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
    toast.info(`Currently unavailable`);
  };

  const handleEmailSelected = (selectedRows: any[]) => {
    console.log(
      "Email selected rows:",
      selectedRows.map((row) => row.original)
    );
    toast.info(`Currently unavailable`);
    // alert(`Emailing ${selectedRows.length} selected rows`);
  };

  const handleDeleteSelected = async (selectedRows: any[]) => {
    console.log(
      "Delete selected rows:",
      selectedRows.map((row) => row.original)
    );
    const ok = await confirmDialog({
      title: "Delete selected equipment?",
      description: `This will delete ${selectedRows.length} item(s). This action cannot be undone.`,
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
      const newData = EquipmentData.slice(startIndex, endIndex);

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
    (searchid: string) => {
      console.log(`🔍 Server Search: "${searchValue}"`);

      // setIsLoading(true);

      // Simulate server delay
      setTimeout(() => {
        let filteredData = EquipmentData;

        if (searchValue.trim()) {
          filteredData = EquipmentData.filter(
            (emp) =>
              emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              emp.unit_number
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              emp.serial_number
                .toLowerCase()
                .includes(searchValue.toLowerCase())
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

  const getSubRows = (originalRow: Employee) => {
    return originalRow.tasks;
  };

  // Custom sub-row renderer
  const renderSubRow = (subRowData: Task, parentRow: any, depth: number) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1  gap-4">
          {" "}
          <Card>
            {" "}
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Work Information</CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent className=" grid grid-cols-3 space-y-2 text-sm">
              {" "}
              <div className="col-span-1 ">
                <span className="ml-2">{subRowData.instructions}</span>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                {" "}
                <span className="ml-2 text-destructive">
                  {subRowData.dueDate}{" "}
                </span>{" "}
              </div>{" "}
              <div className="col-span-1 ">
                <div className="ml-2 font-bold text-primary underline cursor-pointer">
                  #{subRowData.woNumber}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        </div>
      </div>
    );
  };

  // Column definitions
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "unit_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit"
          sortable={true}
          filterOptions={unit_number}
        />
      ),
      cell: ({ row }) => (
        <div
          className="font-medium flex flex-col"
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          <div>{row.getValue("unit_number")}</div>
          <div>{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "serial_number",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={serial_number}
          column={column}
          title="Status"
          sortable={true}
        />
      ),
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={year}
          column={column}
          title="Year"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
          filterOptions={equipmentType}
        />
      ),
      cell: ({ row }) => <>{row.original.type?.name}</>,
      filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
      },
    },
    // {
    //   accessorKey: "meter",
    //   header: ({ column }) => (
    //     <SortableHeader
    //       column={column}
    //       title="Meter"
    //       sortable={true}
    //       filterOptions={meter}
    //     />
    //   ),
    //   filterFn: (row, id, value) => {
    //     return value.length === 0 || value.includes(row.getValue(id));
    //   },
    // },

    {
      accessorKey: "taskStatus",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={taskStatus}
          column={column}
          title="Due status"
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
              title: "Delete equipment?",
              description: `Are you sure you want to delete ${row.original.name}?`,
              confirmText: "Delete",
            })
            if (ok) {
              toast.success(`Deleted ${row.original.name}`)
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
          { name: "Issue WO", onSelect: genericDropdown },
          { name: "Repair Request", onSelect: genericDropdown },
          { name: "Inspection", onSelect: genericDropdown },
          { name: "Record Fuel", onSelect: genericDropdown },
          { name: "Record Expense", onSelect: genericDropdown },
          { name: "Sign Out", onSelect: genericDropdown },
        ];

        const dropdownItemsSubMenu = [
          { name: "Record Accident", onSelect: genericDropdown },
          { name: "Record Fluid Usage", onSelect: genericDropdown },
          { name: "Record Meter Replacement", onSelect: genericDropdown },
          { name: "View Equipment Parts", onSelect: genericDropdown },
        ];

        const secondDropdowns = [
          { name: "History", onSelect: genericDropdown },
          { name: "Task Setup", onSelect: genericDropdown },
          { name: "New (Duplicate)", onSelect: genericDropdown },
        ];

        const formComponents = {
          "Issue WO": <ActualWorkOrderForm />,
          "Repair Request": <ActualRepairRequestForm />,
          Inspection: <InspectionForm />,
          "Record Fuel": <FuelTransactionForm />,
          "Sign Out": <AssignEquipmentForm />,
          "Record Expense": <GeneralExpense />,
          "Record Accident": <NewAccident />,
          "Record Fluid Usage": <FluidConsumedForm />,
          "Record Meter Replacement": <NewMeterReplacementForm />,
          "View Equipment Parts": (
            <PartsManager equipment={row.original.name} />
          ),
          History: <HistoryTabs />,
          "Task Setup": <Tasks />,
          "New (Duplicate)": <ActualEquipmentForm />,
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
          <div className="flex flex-row justify-between">
            <EquipmentProfile
              children={
                <Button variant="ghost" size="icon">
                  <FileTextIcon className="h-4 w-4" />
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
                      key={item.name}
                      onClick={() => item.onSelect(item.name)}
                    >
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {dropdownItemsSubMenu.map((item) => (
                        <DropdownMenuItem
                          key={item.name}
                          onClick={() => item.onSelect(item.name)}
                        >
                          <span>{item.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                {secondDropdowns.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => item.onSelect(item.name)}
                  >
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="w-[400px] sm:w-4/5">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {selectedType?.label}
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
        data={isServerMode ? currentData : EquipmentData}
        defaultVisibleColumns={[
          "unit_number",
          "year",
          "model",
          "type",
          // "meter",
          "serial_number",
          "taskStatus",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="equipment-table-visibility"
        getSubRows={getSubRows}
        enableExpanding={true}
        // Custom sub-row rendering
        renderSubRow={renderSubRow}
        subRowKey="tasks"
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
