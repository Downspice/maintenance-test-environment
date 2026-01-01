"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import { SortableHeader } from "@/components/customUI/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileTextIcon,
  FilePenIcon,
  User,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useConfirmDialog } from "@/lib/confirm-dialog";
import { toast } from "sonner";
import EditWorkOrderForm from "../../view/edit-work-order";
import ChangePriorityForm from "../../forms/change-priority";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChangeAssigneesForm from "../../forms/change-assignee";
import ChangeCostCenterForm from "../../forms/change-cost-center";
import ChangeStatusForm from "../../forms/change-status";
import { useDeleteWorkOrder, useGetWorkOrdersPaginated } from "@/services/setups/workOrder";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-green-100 text-green-800 border border-green-200";
    case "in progress":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "on hold":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "complete":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case "in-progress":
      return <Clock className="h-3 w-3 text-blue-600" />;
    case "pending":
      return <AlertTriangle className="h-3 w-3 text-orange-600" />;
    default:
      return <Clock className="h-3 w-3 text-gray-600" />;
  }
};

const getAllEmployees = (
  employees: WorkOrderInterface[]
): WorkOrderInterface[] => {
  const result: WorkOrderInterface[] = [];
  const traverse = (emps: WorkOrderInterface[]) => {
    emps.forEach((emp) => {
      result.push(emp);
    });
  };
  traverse(employees);
  return result;
};

export default function WorkOrderDataTable({
  locationId,
  statusId,
}: {
  locationId?: string;
  statusId?: string;
}) {
  return <WorkOrderDataLoader locationId={locationId} statusId={statusId} />;
}

export function WorkOrderDataLoader({
  locationId,
  statusId,
}: {
  locationId?: string;
  statusId?: string;
}) {
  const confirmDialog = useConfirmDialog();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const currentSort = sorting[0];
  const mapColumnIdToSortBy = (id?: string): string | undefined => {
    if (!id) return undefined;
    if (id === "wo_number") return "work_order_number";
    return id;
  };

  const { data: paged, isLoading } = useGetWorkOrdersPaginated<any>({
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
      title: "Delete selected work orders?",
      description: `This will delete ${selectedRows.length} WO(s). This action cannot be undone.`,
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
  const columns: ColumnDef<WorkOrderInterface>[] = [
    {
      accessorKey: "wo_number",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="WO#"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary flex flex-col">
          {" "}
          {row.getValue("wo_number")}
        </div>
      ),
    },
    {
      accessorKey: "equipment",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Unit#"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-primary">
            {row.original.equipment}
          </div>
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
        />
      ),
      cell: ({ row }) => (
        <>
          <Badge className={`text-xs ${getStatusColor(row.original.status_name)}`}>
            {row.original.status_name?.toUpperCase()}
          </Badge>
        </>
      ),
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Due Date"
          sortable={true}
        />
      ),
      cell: ({ row }) => {
        const dueDate = row.original.due_date;
        const isPastDue = dueDate ? new Date(dueDate) < new Date() : false;

        return (
          <>
            <div className={`flex items-center gap-1 text-sm ${isPastDue ? 'text-destructive font-bold' : ''}`}>
              <Calendar className={`h-3 w-3 ${isPastDue ? 'text-destructive' : ''}`} />
              {dueDate}
            </div>
          </>
        );
      },
    },
    {
      accessorKey: "assignees",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Assigned to"
          sortable={true}
        />
      ),
      cell: ({ row }) => {
        const assignees = row.original.assigned_to || [];

        return (
          <div className="flex flex-wrap gap-1">
            {assignees.map((assignment: any) => {
              const isVendor = assignment.assignee_type_name === "Vendor";
              const isEmployee = assignment.assignee_type_name === "Employee";

              return (
                <Badge
                  key={assignment.id}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs px-2 py-1"
                >
                  {isEmployee && <User className="h-3 w-3" />}
                  {isVendor && <Building className="h-3 w-3" />}
                  <span>{assignment.assignee_name}</span>
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title="Total"
          sortable={true}
        />
      ),
      cell: ({ row }) => (
        <>
          <div className="flex  items-end gap-1 text-sm">
            {row.original.currency} {row.original.total}
          </div>
        </>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 60,
      cell: ({ row }) => {
        const { mutate: deleteWorkOrder } = useDeleteWorkOrder();

        const handleDeleteRow = (row: any) => {
          console.log("Delete row:", row.original);
          (async () => {
            const ok = await confirmDialog({
              title: "Delete work order?",
              description: `Are you sure you want to delete ${row.original.wo_number}?`,
              confirmText: "Delete",
              variant: "destructive",
            })
            if (ok) {
              deleteWorkOrder({ id: row.original.id }, {
                onSuccess: () => {
                  toast.success(`Deleted ${row.original.wo_number || "Work Order"}`)
                },
                onError: (error) => {
                  toast.error(error?.response?.data?.message || "Failed to delete work order")
                }
              })
            }
          })()
        };

        const handleStatus = (status: string, row: any) => {
          console.log("change row status:", row.original);
          (async () => {
            const ok = await confirmDialog({
              title: "Change status?",
              description: `Are you sure you want to change the status to ${status}?`,
              confirmText: "Change",
              variant: "default",
            })
            if (ok) {
              toast.success(`Status changed`)
            }
          })()
        };

        const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
        const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
        const [costCenterDialogOpen, setCostCenterDialogOpen] = useState(false);
        const [statusDialogOpen, setStatusDialogOpen] = useState(false);

        const openAssigneeDialog = () => {
          setAssigneeDialogOpen(true);
        };

        const openPriorityDialog = () => {
          setPriorityDialogOpen(true);
        };

        const openCostCenterDialog = () => {
          setCostCenterDialogOpen(true);
        };

        const openStatusDialog = () => {
          setStatusDialogOpen(true);
        };

        const dropdownItems = [
          { name: "Change Assignee", onSelect: openAssigneeDialog },
          { name: "Change Priority", onSelect: openPriorityDialog },
          { name: "Change Cost Center", onSelect: openCostCenterDialog },
          { name: "Change Status", onSelect: openStatusDialog },
        ];

        return (
          <div className="flex flex-row gap-2 justify-between">
            <EditWorkOrderForm
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
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Email
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Print
                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                  </DropdownMenuItem>

                  {dropdownItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => item.onSelect()}
                    >
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
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
            {/* Change Status Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Change Status for Work Order {row.original.wo_number || row.original.workOrderNumber}
                  </DialogTitle>
                </DialogHeader>
                <ChangeStatusForm
                  data={row.original}
                  onSuccess={() => setStatusDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Change Cost Center Dialog */}
            <Dialog open={costCenterDialogOpen} onOpenChange={setCostCenterDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Change Cost Center for Work Order {row.original.wo_number || row.original.workOrderNumber}
                  </DialogTitle>
                </DialogHeader>
                <ChangeCostCenterForm
                  data={row.original}
                  onSuccess={() => setCostCenterDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Change Assignee Dialog */}
            <Dialog open={assigneeDialogOpen} onOpenChange={setAssigneeDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Change Assignee for Work Order {row.original.wo_number || row.original.workOrderNumber}
                  </DialogTitle>
                </DialogHeader>
                <ChangeAssigneesForm
                  data={row.original}
                  onSuccess={() => setAssigneeDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Change Priority Dialog */}
            <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Change Priority for Work Order {row.original.wo_number || row.original.workOrderNumber}
                  </DialogTitle>
                </DialogHeader>
                <ChangePriorityForm
                  data={row.original}
                  onSuccess={() => setPriorityDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
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
        defaultVisibleColumns={[
          "wo_number",
          "equipment",
          "status",
          "dueOn",
          "assignees",
          "total",
          "actions",
        ]}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
        onPrintRow={handlePrintRow}
        storageKey="work-order-table-visibility"
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
