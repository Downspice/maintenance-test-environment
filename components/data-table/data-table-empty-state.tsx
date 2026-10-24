"use client";

import {
  Boxes,
  Building,
  Cog,
  File,
  ListTodo,
  Receipt,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/shared/utils";

export type DataTableEntityKey =
  | "equipment"
  | "work-orders"
  | "inventory"
  | "purchase-orders"
  | "customers"
  | "invoices"
  | "employees"
  | "vendors"
  | "payments";

type EmptyStateConfig = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const DATA_TABLE_EMPTY_STATE_CONFIG: Record<
  DataTableEntityKey,
  EmptyStateConfig
> = {
  equipment: {
    icon: Cog,
    title: "No equipment found",
    description:
      "Equipment you add will show up here. Try clearing filters or create new equipment from the toolbar.",
  },
  "work-orders": {
    icon: File,
    title: "No work orders found",
    description:
      "Open work orders will appear in this list. Adjust filters or create a work order to get started.",
  },
  inventory: {
    icon: Boxes,
    title: "No inventory items found",
    description:
      "Parts and stock records live here. Change your filters or add inventory from the quick actions.",
  },
  "purchase-orders": {
    icon: ShoppingCart,
    title: "No purchase orders found",
    description:
      "POs you create will display here. Clear filters or start a new purchase order when you're ready.",
  },
  customers: {
    icon: Users,
    title: "No customers found",
    description:
      "Customer accounts will list here. Update filters or add a customer to populate this table.",
  },
  invoices: {
    icon: ListTodo,
    title: "No invoices found",
    description:
      "Billing records show up in this view. Refine filters or create an invoice to see rows here.",
  },
  employees: {
    icon: Users,
    title: "No employees found",
    description:
      "Team members you add appear here. Try different filters or create an employee record.",
  },
  vendors: {
    icon: Building,
    title: "No vendors found",
    description:
      "Supplier records will show here. Clear filters or add a vendor to build your vendor list.",
  },
  payments: {
    icon: Receipt,
    title: "No payments found",
    description:
      "Received payments will list here when they exist. Adjust date or customer filters to search again.",
  },
};

export type DataTableEmptyStateProps = {
  entity?: DataTableEntityKey;
  title?: string;
  description?: string;
  className?: string;
};

export function DataTableEmptyState({
  entity,
  title,
  description,
  className,
}: DataTableEmptyStateProps) {
  const config = entity ? DATA_TABLE_EMPTY_STATE_CONFIG[entity] : undefined;
  const Icon = config?.icon ?? Boxes;
  const resolvedTitle = title ?? config?.title ?? "No results found";
  const resolvedDescription =
    description ??
    config?.description ??
    "Try adjusting your filters or search terms.";

  return (
    <div
      className={cn(
        "flex min-h-[12rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-bg-weak-50 text-primary-base ring-1 ring-stroke-soft-200">
        <Icon className="size-7" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="max-w-md space-y-1">
        <p className="text-label-md font-medium text-text-strong-950">
          {resolvedTitle}
        </p>
        <p className="text-paragraph-sm text-text-sub-600">
          {resolvedDescription}
        </p>
      </div>
    </div>
  );
}
