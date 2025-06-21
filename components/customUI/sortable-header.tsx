"use client"

import type { Column } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  sortable?: boolean
  filterOptions?: string[]
}

export function SortableHeader<TData, TValue>({
  column,
  title,
  sortable = true,
  filterOptions = [],
}: SortableHeaderProps<TData, TValue>) {
  const currentFilter = column.getFilterValue() as string[] | undefined
  const hasFilter = filterOptions.length > 0

  return (
    <div className="flex items-center space-x-2">
      {sortable && (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0"
        >
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}

      {!sortable && <span>{title}</span>}

      {hasFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {currentFilter && currentFilter.length > 0 ? (
                <FilterX className="h-4 w-4 fill-current" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {currentFilter && currentFilter.length > 0 && (
              <>
                <DropdownMenuItem onClick={() => column.setFilterValue([])} className="text-destructive">
                  Clear Filter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {filterOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={currentFilter?.includes(option) ?? false}
                onCheckedChange={(checked) => {
                  const current = currentFilter || []
                  if (checked) {
                    column.setFilterValue([...current, option])
                  } else {
                    column.setFilterValue(current.filter((item) => item !== option))
                  }
                }}
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
