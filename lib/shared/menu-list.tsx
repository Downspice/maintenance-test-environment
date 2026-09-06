import { Users, LucideIcon } from "lucide-react";
import {
  House,
  Cog,
  File,
  ListTodo,
  CalendarRange,
  Boxes,
  ShoppingCart,
  Building,
} from "lucide-react";
import React from "react";
import EquipmentForm from "@/components/forms/entities/equipment/new-equipment-form";
import WorkOrderFormWrapper from "@/components/forms/fields/work-order-form-wrapper";
import InventoryFormWrapper from "@/components/forms/fields/inventory-form-wrapper";
import PurchaseOrderFormWrapper from "@/components/forms/fields/purchase-order-form-wrapper";
import EmployeeFormWrapper from "@/components/forms/fields/employee-form-wrapper";
import VendorFormWrapper from "@/components/forms/fields/vendor-form-wrapper";
import InvoiceFormWrapper from "@/components/forms/fields/invoice-form-wrapper";
import CustomerFormWrapper from "@/components/forms/fields/customer-form-wrapper";
type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  button?: React.JSX.Element;

};

type Group = {
  groupname: string;
  menus: Menu[];
};

function yourImportedFunction() {
  console.log("jndfkj");
}
export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupname: "",
      menus: [
        {
          href: "/dashboard",
          label: "Home",
          icon: House,
          submenus: [],
        },
        {
          href: "/equipment",
          label: "Equipment",
          icon: Cog,
          submenus: [],
          button: <EquipmentForm variant="icon" />
        },
        {
          href: "/work-orders",
          label: "Work Orders",
          icon: File,
          submenus: [],
          button: <WorkOrderFormWrapper variant="icon" />
        },
        {
          href: "/inventory",
          label: "Inventory",
          icon: Boxes,
          submenus: [],
          button: <InventoryFormWrapper variant="icon" />
        },
        {
          href: "/purchase-orders",
          label: "Purchase Orders",
          icon: ShoppingCart,
          submenus: [],
          button: <PurchaseOrderFormWrapper variant="icon" />
        },
        {
          href: "/customer",
          label: "Customer",
          icon: Users,
          submenus: [],
          button: <CustomerFormWrapper variant="icon" />
        },
        // {
        //   href: "/inspections",
        //   label: "Inspections",
        //   icon: ListTodo,
        //   submenus: [],
        // },
        {
          href: "/invoices",
          label: "Invoices",
          icon: ListTodo,
          submenus: [],
          button: <InvoiceFormWrapper variant="icon" />
        },
        {
          href: "/employees",
          label: "Employees",
          icon: Users,
          submenus: [],
          button: <EmployeeFormWrapper variant="icon" />
        },
        {
          href: "/vendors",
          label: "Vendors",
          icon: Building,
          submenus: [],
          button: <VendorFormWrapper variant="icon" />
        },
        {
          href: "/calendars",
          label: "Calendars",
          icon: CalendarRange,
          submenus: [],
        },
      ],
    },
  ];
}
