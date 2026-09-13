"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, FileTextIcon } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import EquipmentProfile, {
  HistoryTabs,
  PartsManager,
  Tasks,
} from "@/components/features/equipment";
import ActualRepairRequestForm from "@/components/forms/entities/repairRequest";
import InspectionForm from "@/components/forms/entities/new-inspection";
import FuelTransactionForm from "@/components/forms/entities/equipment/FuelTransactionForm";
import GeneralExpense from "@/components/forms/entities/new-general-expense";
import AssignEquipmentForm from "@/components/forms/entities/equipment/AssignEquipment";
import NewAccident from "@/components/forms/entities/new-accident";
import FluidConsumedForm from "@/components/forms/entities/equipment/FluidConsumed";
import NewMeterReplacementForm from "@/components/forms/entities/equipment/MeterReplacement";
import { ActualEquipmentForm } from "@/components/forms/entities/equipment/new-equipment-form";
import { ActualWorkOrderForm } from "@/components/forms/entities/work-order-form";
import { useGetEquipmentsPaginated } from "@/services/setups/equipments";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { DeleteEquipmentModal } from "./modals/delete-equipment-modal";

export default function DataTableDemo({
  locationId,
}: {
  locationId?: string;
}) {
  return <EquipmentTableLoader locationId={locationId} />;
}

export function EquipmentTableLoader({ locationId }: { locationId?: string }) {
  const confirmDialog = useConfirmDialog();
  const [equipmentToDelete, setEquipmentToDelete] = useState<any | null>(null);
  const [pageIndex, setPageIndex] = useState(0); // 0-based for UI
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const currentSort = sorting[0];
  const mapColumnIdToSortBy = (id?: string): string | undefined => {
    if (!id) return undefined;
    // Map nested accessor keys to API fields
    if (id === "type") return "type";
    // Fallback: use the id as-is for simple fields
    return id;
  };

  const { data: paged, isLoading } = useGetEquipmentsPaginated<any>({
    search: search || undefined,
    location_id: locationId || undefined,
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
    make_name: string;
    model_name: string;
    type_name: string;
    status_name: string;
    color_name: string;
    cost_center_name: string | null;
  };
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

  const flatEmployees = getAllEmployees(serverRows);
  const unit_number = [...new Set(flatEmployees.map((emp) => emp.unit_number))];
  const model = [...new Set(flatEmployees.map((emp) => emp.model))];
  const year = [...new Set(flatEmployees.map((emp) => emp.year))];
  const serial_number = [
    ...new Set(flatEmployees.map((emp) => emp.serial_number)),
  ];

  const equipmentType = [...new Set(flatEmployees.map((emp) => emp.type?.name ?? ""))];
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
          <span className="font-bold">{row.getValue("unit_number")}</span>
          <span className="text-muted-foreground text-xs font-normal">
            {row.original.description}
          </span>
        </div>
      ),
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
      accessorKey: "type_name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Type"
          sortable={true}
          filterOptions={equipmentType}
        />
      ),
    },
    {
      accessorKey: "serial_number",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={serial_number}
          column={column}
          title="Serial"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "status_name",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={taskStatus}
          column={column}
          title="Status"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "color_name",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Color"
          sortable={true}
        />
      ),
    },
    {
      accessorKey: "model_name",
      header: ({ column }) => (
        <SortableHeader
          filterOptions={model}
          column={column}
          title="Model"
          sortable={true}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 60,
      cell: ({ row }) => {
        const handleDeleteRow = (row: any) => {
          setEquipmentToDelete(row.original);
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
          (type) => type?.label === selectedProjectType
        );

        return (
          <div className="flex flex-row justify-between gap-x-2">
            <EquipmentProfile
              children={
                <Button variant={"secondary"} size={"icon"}>
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
              <SheetContent
                className={
                  selectedProjectType === "Repair Request" ||
                  selectedProjectType === "Issue WO" ||
                  selectedProjectType === "New (Duplicate)"
                    ? "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
                    : "w-[400px] sm:w-4/5"
                }
              >
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
        enableExpanding={false}
        // Custom sub-row rendering
        renderSubRow={renderSubRow}
        subRowKey="tasks"
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

      <DeleteEquipmentModal
        equipment={equipmentToDelete}
        onClose={() => setEquipmentToDelete(null)}
      />
    </div>
  );
}
