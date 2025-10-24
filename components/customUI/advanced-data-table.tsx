"use client"

import { TableHeader } from "@/components/ui/table"

import * as React from "react"
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
import { Badge } from "@/components/ui/badge"

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
  onServerSearch?: (searchid: string) => void
  isLoading?: boolean
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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  // Search state for server-side search
  const [searchValue, setSearchValue] = React.useState("")
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>()
  const lastSearchValueRef = React.useRef("")
  const hasUserInteractedRef = React.useRef(false)

  // Memoize the server search function to prevent unnecessary re-renders
  const stableOnServerSearch = React.useCallback(
    (id: string) => {
      if (onServerSearch && typeof onServerSearch === "function") {
        onServerSearch(value)
      }
    },
    [onServerSearch],
  )

  // Handle server-side search with debounce
  const debouncedServerSearch = React.useCallback(
    (id: string) => {
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
      const columnId = typeof column.accessorKey === "string" ? column.accessorKey : column.id
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
    onSortingChange: setSorting,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: realServerPagination ? undefined : globalFilter,
      expanded,
      /*  Ensure pagination is **never** undefined.
          - In server mode we honour the supplied `paginationInfo`
          - In client mode we fall back to sensible defaults            */
      pagination: {
        pageIndex: paginationInfo?.pageIndex ?? 0,
        pageSize: paginationInfo?.pageSize ?? 10,
      },
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
  const handleSearchChange = (id: string) => {
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
    <div className="w-full space-y-4">
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Action Bar for Selected Rows */}
      {hasSelectedRows && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={realServerPagination ? "Search (server-side)..." : "Search..."}
            value={realServerPagination ? searchValue : (globalFilter ?? "")}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-sm"
            disabled={isLoading}
          />
          {realServerPagination && (
            <Badge variant="outline" className="text-xs">
              Server Mode
            </Badge>
          )}
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
              <DropdownMenuItem onClick={exportToHTML}>Export to HTML</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToText}>Export to Text</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>Export to PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows
  .filter((row) => row.depth === 0)
  .map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          paddingLeft: cell.column.id === "select" && row.depth > 0 ? `${row.depth * 20}px` : undefined,
                        }}
                      >
                        <div
                          className="cursor-pointer  rounded px-1 py-0.5 -mx-1 -my-0.5"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCellClick?.(cell, row)
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* Custom sub-row rendering */}
                  {renderSubRow && renderCustomSubRows(row)}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsWithSelection.length} className="h-24 text-center">
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {realServerPagination && paginationInfo ? (
            <>
              Page {paginationInfo.pageIndex + 1} of {paginationInfo.totalPages} ({paginationInfo.totalRows} total rows)
            </>
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </>
          )}
        </div>
        <div className="space-x-2">
          {realServerPagination ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination("previous")}
                disabled={isLoading || (paginationInfo?.pageIndex ?? 0) === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination("next")}
                disabled={isLoading || (paginationInfo?.pageIndex ?? 0) >= (paginationInfo?.totalPages ?? 1) - 1}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
