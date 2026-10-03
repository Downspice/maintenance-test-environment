"use client"

import { TableHeader } from "@/components/ui/table"

import * as React from "react"
import { cn } from "@/lib/shared/utils"
import { DataTablePagination } from "@/components/data-table/pagination"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type Row,
  type ExpandedState,
} from "@tanstack/react-table"
import { ChevronDown, Download, Settings2, X, Printer, Mail, RotateCcw, ChevronRight, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DataTableEmptyState,
  type DataTableEntityKey,
  type DataTableEmptyStateProps,
} from "@/components/data-table/data-table-empty-state"

interface PaginationInfo {
  pageIndex: number
  pageSize: number
  totalPages: number
  totalRows: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: Row<TData>) => void
  onCellClick?: (cell: any, row: Row<TData>) => void
  storageKey?: string
  defaultVisibleColumns?: string[]
  onPrintSelected?: (selectedRows: Row<TData>[]) => void
  onEmailSelected?: (selectedRows: Row<TData>[]) => void
  onDeleteSelected?: (selectedRows: Row<TData>[]) => void
  onDeleteRow?: (row: Row<TData>) => void
  onPrintRow?: (row: Row<TData>) => void
  getSubRows?: (originalRow: TData, index: number) => any[] | undefined
  enableExpanding?: boolean
  // Custom sub-row rendering
  renderSubRow?: (subRowData: any, parentRow: Row<TData>, depth: number) => React.ReactNode
  subRowKey?: string // Key to identify sub-row data in the parent row
  // Server-side functionality
  realServerPagination?: boolean
  paginationInfo?: PaginationInfo
  onPaginationChange?: (action: "next" | "previous" | number) => void
  onServerSearch?: (value: string) => void
  isLoading?: boolean
  // Server-side sorting
  serverSorting?: SortingState
  onServerSortingChange?: (sorting: SortingState) => void
  // Row styling
  getRowClassName?: (row: Row<TData>) => string
  // Page size control
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  /** Icon + copy for the empty table body (matches main nav entities). */
  emptyEntity?: DataTableEntityKey
  emptyState?: React.ReactNode
  emptyStateProps?: Omit<DataTableEmptyStateProps, "entity">
}

export function AdvancedDataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  onCellClick,
  storageKey = "datatable-visibility",
  defaultVisibleColumns = [],
  onPrintSelected,
  onEmailSelected,
  onDeleteSelected,
  onDeleteRow,
  onPrintRow,
  getSubRows,
  enableExpanding = false,
  renderSubRow,
  subRowKey = "subRows",
  // Server-side props
  realServerPagination = false,
  paginationInfo,
  onPaginationChange,
  onServerSearch,
  isLoading = false,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
  serverSorting,
  onServerSortingChange,
  getRowClassName,
  emptyEntity,
  emptyState,
  emptyStateProps,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(serverSorting ?? [])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [clientPagination, setClientPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSizeOptions[0] ?? 10,
  })

  // Search state for server-side search
  const [searchValue, setSearchValue] = React.useState("")
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastSearchValueRef = React.useRef("")
  const hasUserInteractedRef = React.useRef(false)

  // Memoize the server search function to prevent unnecessary re-renders
  const stableOnServerSearch = React.useCallback(
    (value: string) => {
      if (onServerSearch && typeof onServerSearch === "function") {
        onServerSearch(value)
      }
    },
    [onServerSearch],
  )

  // Handle server-side search with debounce
  const debouncedServerSearch = React.useCallback(
    (value: string) => {
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Only proceed if:
      // 1. We're in server mode
      // 2. We have a search callback
      // 3. The user has interacted with the search (or the value has actually changed)
      // 4. The value is different from the last search
      if (
        realServerPagination &&
        stableOnServerSearch &&
        hasUserInteractedRef.current &&
        lastSearchValueRef.current !== value
      ) {
        searchTimeoutRef.current = setTimeout(() => {
          console.log(`🔍 Debounced Server Search: "${value}"`)
          lastSearchValueRef.current = value
          stableOnServerSearch(value)
        }, 800)
      }
    },
    [realServerPagination, stableOnServerSearch],
  )

  // Watch for search value changes
  React.useEffect(() => {
    debouncedServerSearch(searchValue)

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchValue, debouncedServerSearch])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Initialize default column visibility
  const getDefaultColumnVisibility = React.useCallback(() => {
    if (defaultVisibleColumns.length === 0) {
      return {} // Show all columns if no default specified
    }

    const visibility: VisibilityState = {}
    columns.forEach((column) => {
      const maybeAccessorKey = (column as any)?.accessorKey as string | undefined
      const columnId = (maybeAccessorKey ?? column.id) as string | undefined
      if (columnId) {
        visibility[columnId] = defaultVisibleColumns.includes(columnId)
      }
    })
    return visibility
  }, [columns, defaultVisibleColumns])

  // Load column visibility from localStorage on mount, or use defaults
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setColumnVisibility(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse stored column visibility:", error)
        setColumnVisibility(getDefaultColumnVisibility())
      }
    } else {
      setColumnVisibility(getDefaultColumnVisibility())
    }
  }, [storageKey, getDefaultColumnVisibility])

  // Save column visibility to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(columnVisibility))
  }, [columnVisibility, storageKey])

  // Add selection column to the beginning of columns
  const columnsWithSelection = React.useMemo(() => {
    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        // Only show checkbox for parent rows (depth 0)
        if (row.depth > 0) {
          return null
        }
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        )
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }

    const expandColumn: ColumnDef<TData, TValue> = {
      id: "expand",
      header: () => null,
      cell: ({ row }) => {
        if (!row.getCanExpand()) return null
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              row.toggleExpanded()
            }}
            className="h-8 w-8 p-0"
          >
            {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )
      },
      enableSorting: false,
      enableHiding: false,
    }

    const baseColumns = enableExpanding ? [selectionColumn, expandColumn, ...columns] : [selectionColumn, ...columns]
    return baseColumns
  }, [columns, enableExpanding])

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(realServerPagination ? (serverSorting ?? sorting) : sorting) : updater
      if (realServerPagination) {
        onServerSortingChange?.(nextSorting)
        setSorting(nextSorting)
      } else {
        setSorting(nextSorting)
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: realServerPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: realServerPagination ? undefined : getSortedRowModel(),
    getFilteredRowModel: realServerPagination ? undefined : getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: realServerPagination ? undefined : setGlobalFilter,
    onExpandedChange: setExpanded,
    getSubRows,
    enableExpanding: enableExpanding,
    globalFilterFn: "includesString",
    // Server-side pagination configuration
    manualPagination: realServerPagination,
    pageCount: realServerPagination
      ? paginationInfo
        ? paginationInfo.totalPages
        : 1 // at least 1 page so TanStack is happy
      : undefined,
    onPaginationChange: (updater) => {
      const currentPagination = realServerPagination
        ? {
          pageIndex: paginationInfo?.pageIndex ?? 0,
          pageSize: paginationInfo?.pageSize ?? 10,
        }
        : clientPagination

      const nextPagination = typeof updater === "function" ? updater(currentPagination) : updater

      if (realServerPagination) {
        if (nextPagination.pageSize !== currentPagination.pageSize) {
          onPageSizeChange?.(nextPagination.pageSize)
        }
        if (nextPagination.pageIndex !== currentPagination.pageIndex) {
          onPaginationChange?.(
            nextPagination.pageIndex > currentPagination.pageIndex
              ? "next"
              : nextPagination.pageIndex < currentPagination.pageIndex
                ? "previous"
                : nextPagination.pageIndex,
          )
        }
      } else {
        setClientPagination(nextPagination)
      }
    },
    state: {
      sorting: realServerPagination ? (serverSorting ?? sorting) : sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: realServerPagination ? undefined : globalFilter,
      expanded,
      pagination: realServerPagination
        ? {
          pageIndex: paginationInfo?.pageIndex ?? 0,
          pageSize: paginationInfo?.pageSize ?? 10,
        }
        : clientPagination,
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  const resetColumnLayout = () => {
    const defaultVisibility = getDefaultColumnVisibility()
    setColumnVisibility(defaultVisibility)
    localStorage.setItem(storageKey, JSON.stringify(defaultVisibility))
  }

  // Handle pagination for server-side
  const handlePagination = (action: "next" | "previous" | number) => {
    if (realServerPagination && onPaginationChange) {
      console.log(`Pagination action: ${action}`)
      onPaginationChange(action)
    }
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    // Mark that user has interacted with search
    hasUserInteractedRef.current = true

    if (realServerPagination) {
      console.log(`📝 Search input changed: "${value}"`)
      setSearchValue(value)
    } else {
      setGlobalFilter(value)
    }
  }

  // Render custom sub-rows
  // const renderCustomSubRows = (row: Row<TData>) => {
  //   if (!renderSubRow || !row.getIsExpanded()) return null

  //   const parentData = row.original as any
  //   const subRowsData = parentData[subRowKey]

  //   if (!subRowsData || !Array.isArray(subRowsData)) return null

  //   return subRowsData.map((subRowData, index) => (
  //     <TableRow key={`${row.id}-sub-${index}`} className="bg-muted/30 this">
  //       <TableCell colSpan={columnsWithSelection.length} className="p-0">
  //         <div className="p-4" style={{ paddingLeft: `${(row.depth + 1) * 20 + 16}px` }}>
  //           {renderSubRow(subRowData, row, row.depth + 1)}
  //         </div>
  //       </TableCell>
  //     </TableRow>
  //   ))
  // }

  const renderCustomSubRows = (row: Row<TData>) => {
    if (!renderSubRow || !row.getIsExpanded()) return null

    const parentData = row.original as any
    const subRowsData = parentData[subRowKey]

    if (!Array.isArray(subRowsData) || subRowsData.length === 0) return null

    return subRowsData.map((subRowData, index) => (
      <TableRow key={`${row.id}-sub-${index}`} className="bg-muted/30">
        <TableCell colSpan={columnsWithSelection.length} className="p-0">
          <div className="p-4" style={{ paddingLeft: `${(row.depth + 1) * 20 + 16}px` }}>
            {renderSubRow(subRowData, row, row.depth + 1)}
          </div>
        </TableCell>
      </TableRow>
    ))
  }


  const exportToCSV = () => {
    const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== "select")
    const headers = visibleColumns.map((col) => col.columnDef.header as string).join(",")
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) =>
        visibleColumns
          .map((col) => {
            const value = row.getValue(col.id)
            return typeof value === "string" ? `"${value}"` : value
          })
          .join(","),
      )
      .join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table-data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== "select")
    const headers = visibleColumns.map((col) => col.columnDef.header as string).join("\t")
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => visibleColumns.map((col) => row.getValue(col.id)).join("\t"))
      .join("\n")

    const excel = `${headers}\n${rows}`
    const blob = new Blob([excel], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table-data.xls"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToHTML = () => {
    const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== "select")
    const headers = visibleColumns.map((col) => `<th>${col.columnDef.header}</th>`).join("")
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => `<tr>${visibleColumns.map((col) => `<td>${row.getValue(col.id)}</td>`).join("")}</tr>`)
      .join("")

    const html = `
      <table border="1">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table-data.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToText = () => {
    const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== "select")
    const headers = visibleColumns.map((col) => col.columnDef.header as string).join("\t")
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => visibleColumns.map((col) => row.getValue(col.id)).join("\t"))
      .join("\n")

    const text = `${headers}\n${rows}`
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table-data.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== "select")
      const headers = visibleColumns
        .map((col) => `<th style="border: 1px solid #ddd; padding: 8px;">${col.columnDef.header}</th>`)
        .join("")
      const rows = table
        .getFilteredRowModel()
        .rows.map(
          (row) =>
            `<tr>${visibleColumns.map((col) => `<td style="border: 1px solid #ddd; padding: 8px;">${row.getValue(col.id)}</td>`).join("")}</tr>`,
        )
        .join("")

      printWindow.document.write(`
        <html>
          <head><title>Table Data</title></head>
          <body>
            <table style="border-collapse: collapse; width: 100%;">
              <thead><tr>${headers}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col space-y-3 overflow-hidden">
      {/* Loading indicator replaced by table skeletons */}

      {/* Action Bar for Selected Rows */}
      {hasSelectedRows && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedRows.length} row(s) selected</Badge>
            <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
              <X className="h-4 w-4" />
              Clear selection
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onPrintSelected?.(selectedRows)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEmailSelected?.(selectedRows)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteSelected?.(selectedRows)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={realServerPagination ? "Search (server-side)..." : "Search..."}
            value={realServerPagination ? searchValue : (globalFilter ?? "")}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-sm"
            disabled={isLoading}
          />
          {/* {realServerPagination && (
            <Badge variant="outline" className="text-xs">
              Server Mode
            </Badge>
          )} */}
        </div>
        <div className="flex items-center space-x-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>Export to CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>Export to Excel</DropdownMenuItem>
              {/* <DropdownMenuItem onClick={exportToHTML}>Export to HTML</DropdownMenuItem> */}
              {/* <DropdownMenuItem onClick={exportToText}>Export to Text</DropdownMenuItem> */}
              <DropdownMenuItem onClick={exportToPDF}>Export to PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Hide/Show Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetColumnLayout}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isActions =
                    header.column.id === "actions" ||
                    header.id === "actions" ||
                    (typeof header.column.columnDef.header === "string" &&
                      /actions?/i.test(header.column.columnDef.header))
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        isActions &&
                          "sticky right-0 z-20 bg-bg-weak-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] border-l border-stroke-soft-200 w-px whitespace-nowrap"
                      )}
                      style={
                        isActions
                          ? { width: "1%", whiteSpace: "nowrap" }
                          : header.column.columnDef.size
                          ? {
                              minWidth: `${header.column.columnDef.size}px`,
                              maxWidth: `${header.column.columnDef.size}px`,
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: Math.min(8, paginationInfo?.pageSize ?? 10) }).map((_, idx) => (
                <TableRow key={`skeleton-row-${idx}`}>
                  {table.getVisibleLeafColumns().map((col, cIdx) => {
                    const isActions =
                      col.id === "actions" ||
                      (typeof col.columnDef.header === "string" &&
                        /actions?/i.test(col.columnDef.header))
                    return (
                      <TableCell
                        key={`skeleton-cell-${idx}-${col.id}`}
                        className={cn(
                          isActions &&
                            "sticky right-0 z-10 bg-bg-white-0 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] border-l border-stroke-soft-200 w-px whitespace-nowrap"
                        )}
                        style={isActions ? { width: "1%", whiteSpace: "nowrap" } : undefined}
                      >
                        {col.id === "select" || col.id === "expand" ? (
                          <Skeleton className="h-4 w-4 rounded-sm" />
                        ) : isActions ? (
                          <Skeleton className="h-4 w-8 rounded-sm" />
                        ) : (
                          <Skeleton className={cIdx % 3 === 0 ? "h-4 w-2/3" : cIdx % 3 === 1 ? "h-4 w-1/2" : "h-4 w-3/4"} />
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.filter((row) => row.depth === 0)
                .map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={`group/row cursor-pointer hover:bg-muted/50 ${getRowClassName ? getRowClassName(row) : ""}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isActions =
                          cell.column.id === "actions" ||
                          cell.id.includes("actions") ||
                          (typeof cell.column.columnDef.header === "string" &&
                            /actions?/i.test(cell.column.columnDef.header))
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              isActions &&
                                "sticky right-0 z-10 bg-bg-white-0 group-hover/row:bg-muted/50 transition-colors shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] border-l border-stroke-soft-200 w-px whitespace-nowrap"
                            )}
                            style={
                              isActions
                                ? { width: "1%", whiteSpace: "nowrap" }
                                : {
                                    paddingLeft:
                                      cell.column.id === "select" && row.depth > 0
                                        ? `${row.depth * 20}px`
                                        : undefined,
                                  }
                            }
                          >
                            <div
                              className={cn(
                                "cursor-pointer rounded px-1 py-0.5 -mx-1 -my-0.5",
                                isActions && "w-fit"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                onCellClick?.(cell, row)
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    {/* Custom sub-row rendering */}
                    {renderSubRow && renderCustomSubRows(row)}
                  </React.Fragment>
                ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnsWithSelection.length}
                  className="p-0 align-middle"
                >
                  {emptyState ?? (
                    <DataTableEmptyState
                      entity={emptyEntity}
                      {...emptyStateProps}
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="shrink-0 pt-2">
        <DataTablePagination
          table={table}
          totalItems={realServerPagination ? (paginationInfo?.totalRows ?? data.length) : table.getFilteredRowModel().rows.length}
          totalSelectedItems={table.getFilteredSelectedRowModel().rows.length}
          pageSizeOptions={pageSizeOptions}
        />
      </div>
    </div>
  )
}
