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
  button?:React.JSX.Element; 
   
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

function yourImportedFunction() {
  console.log("jndfkj");
}
export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
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
          button: <EquipmentForm variant="icon"/> 
        },
        {
          href: "/work-orders",
          label: "Work Orders",
          icon: File,
          submenus: [],
        },
        {
          href: "/inventory",
          label: "Inventory",
          icon: Boxes,
          submenus: [],
        },
        {
          href: "/purchase-orders",
          label: "Purchase Orders",
          icon: ShoppingCart,
          submenus: [],
        },
        {
          href: "/customer",
          label: "Customer",
          icon: Users,
          submenus: [],
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
        },
        {
          href: "/employees",
          label: "Employees",
          icon: Users,
          submenus: [],
        },
        {
          href: "/vendors",
          label: "Vendors",
          icon: Building,
          submenus: [],
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
