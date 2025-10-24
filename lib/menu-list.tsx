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
  name: string;
  active?: boolean;
};

type Menu = {
  href: string;
  name: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  button?:React.JSX.Element; 
   
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
          name: "Home",
          icon: House,
          submenus: [],
        },
        {
          href: "/equipment",
          name: "Equipment",
          icon: Cog,
          submenus: [],
          button: <EquipmentForm variant="icon"/> 
        },
        {
          href: "/work-orders",
          name: "Work Orders",
          icon: File,
          submenus: [],
        },
        {
          href: "/inventory",
          name: "Inventory",
          icon: Boxes,
          submenus: [],
        },
        {
          href: "/purchase-orders",
          name: "Purchase Orders",
          icon: ShoppingCart,
          submenus: [],
        },
        {
          href: "/customer",
          name: "Customer",
          icon: Users,
          submenus: [],
        },
        // {
        //   href: "/inspections",
        //   name: "Inspections",
        //   icon: ListTodo,
        //   submenus: [],
        // },
        {
          href: "/invoices",
          name: "Invoices",
          icon: ListTodo,
          submenus: [],
        },
        {
          href: "/employees",
          name: "Employees",
          icon: Users,
          submenus: [],
        },
        {
          href: "/vendors",
          name: "Vendors",
          icon: Building,
          submenus: [],
        },
        {
          href: "/calendars",
          name: "Calendars",
          icon: CalendarRange,
          submenus: [],
        },
      ],
    },
  ];
}
