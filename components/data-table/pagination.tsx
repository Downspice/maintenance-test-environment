"use client";

import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/shared/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number;
  totalSelectedItems?: number;
  pageSizeOptions?: number[];
  size?: "sm" | "default" | "lg";
}

export function DataTablePagination<TData>({
  table,
  totalItems,
  totalSelectedItems = 0,
  pageSizeOptions = [10, 20, 30, 40, 50],
  size = "default",
}: DataTablePaginationProps<TData>) {
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount() || 1;

  const actualTotal = totalItems ?? table.getFilteredRowModel().rows.length;

  // "Showing X to Y out of Z"
  const from = actualTotal === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, actualTotal);

  const navBtnClass = (disabled: boolean) =>
    cn(
      "inline-flex items-center justify-center gap-1.5 h-8 px-3.5",
      "text-label-xs font-normal text-text-sub-600 whitespace-nowrap",
      "rounded-lg bg-bg-weak-50 border border-stroke-soft-200 shadow-regular-xs",
      "transition-all duration-150 cursor-pointer select-none",
      "hover:bg-bg-soft-200 hover:text-text-strong-950",
      disabled && "opacity-40 pointer-events-none"
    );

  const iconBtnClass = (disabled: boolean) =>
    cn(
      "inline-flex items-center justify-center h-8 w-8",
      "text-label-xs font-normal text-text-sub-600 whitespace-nowrap",
      "rounded-lg bg-bg-weak-50 border border-stroke-soft-200 shadow-regular-xs",
      "transition-all duration-150 cursor-pointer select-none",
      "hover:bg-bg-soft-200 hover:text-text-strong-950",
      disabled && "opacity-40 pointer-events-none"
    );

  const go = (pageIdx: number) =>
    table.setPagination({ pageIndex: pageIdx, pageSize });

  return (
    <div className="flex w-full items-center justify-between gap-4 px-1 py-3">
      {/* Left side: Page Size Selector + "Showing X to Y out of Z" */}
      <div className="flex items-center gap-4">
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            const url = new URL(window.location.href);
            url.searchParams.set("pageSize", value);
            url.searchParams.set("page", "1");
            window.history.replaceState({}, "", url.toString());
            table.setPagination({ pageIndex: 0, pageSize: Number(value) });
          }}
        >
          <SelectTrigger className="h-8 min-w-[100px] w-auto gap-2 border border-stroke-soft-200 bg-white-0 px-2.5 rounded-lg shadow-regular-xs text-label-xs text-text-strong-950 hover:bg-bg-weak-50 cursor-pointer">
            <SelectValue placeholder={`${pageSize} / page`}>
              {pageSize} / page
            </SelectValue>
          </SelectTrigger>
          <SelectContent side="top" align="start">
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={`${n}`} className="cursor-pointer text-label-xs">
                {n} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-paragraph-xs text-text-sub-600 shrink-0">
          Showing <span className="font-medium text-text-strong-950">{from}</span> to{" "}
          <span className="font-medium text-text-strong-950">{to}</span> out of{" "}
          <span className="font-medium text-text-strong-950">{actualTotal}</span>
        </p>
      </div>

      {/* Right side: Navigation buttons */}
      <div className="flex items-center gap-2">
        {/* First */}
        <button
          type="button"
          aria-label="First page"
          className={iconBtnClass(!table.getCanPreviousPage())}
          onClick={() => go(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <RiArrowLeftDoubleLine className="size-3.5" />
        </button>

        {/* Previous */}
        <button
          type="button"
          aria-label="Previous page"
          className={navBtnClass(!table.getCanPreviousPage())}
          onClick={() => go(pageIndex - 1)}
          disabled={!table.getCanPreviousPage()}
        >
          <RiArrowLeftSLine className="size-3.5" />
          Previous
        </button>

        {/* Next */}
        <button
          type="button"
          aria-label="Next page"
          className={navBtnClass(!table.getCanNextPage())}
          onClick={() => go(pageIndex + 1)}
          disabled={!table.getCanNextPage()}
        >
          Next
          <RiArrowRightSLine className="size-3.5" />
        </button>

        {/* Last */}
        <button
          type="button"
          aria-label="Last page"
          className={iconBtnClass(!table.getCanNextPage())}
          onClick={() => go(totalPages - 1)}
          disabled={!table.getCanNextPage()}
        >
          <RiArrowRightDoubleLine className="size-3.5" />
        </button>
      </div>
    </div>
  );
}