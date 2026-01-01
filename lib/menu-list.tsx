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
  ChartArea,
  Smartphone,
} from "lucide-react";
import React from "react";
import AddEquipmentsButton from "@/components/sideBarButtons/add-equipments-buttons";
import EquipmentForm from "@/app/(application)/equipment/components/new-equipment-form";
import WorkOrderFormWrapper from "@/components/forms/wrappers/work-order-form-wrapper";
import InventoryFormWrapper from "@/components/forms/wrappers/inventory-form-wrapper";
import PurchaseOrderFormWrapper from "@/components/forms/wrappers/purchase-order-form-wrapper";
import EmployeeFormWrapper from "@/components/forms/wrappers/employee-form-wrapper";
import VendorFormWrapper from "@/components/forms/wrappers/vendor-form-wrapper";
import InvoiceFormWrapper from "@/components/forms/wrappers/invoice-form-wrapper";
import CustomerFormWrapper from "@/components/forms/wrappers/customer-form-wrapper";
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
