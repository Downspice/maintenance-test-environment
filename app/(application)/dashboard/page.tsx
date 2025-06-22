"use client";
import { DonutChartCard } from "@/components/charts/donughtChart";
import ReusableButtonCard from "@/components/reusable/reusableButtonCard";
import ReusableButtonInventoryCard from "@/components/reusable/reusableButtonCardInventory";
import React from "react";
import { useState } from "react";
import { EquipmentDataTable } from "./components/data-table/equipment/equipment.dataTable";
import { InventoryDataTable } from "./components/data-table/inventory/inventory.dataTable";
import { EmployeesDataTable } from "./components/data-table/employees/employeesdue.datatable";
import { MonthlyMaintenanceChart } from "./components/charts/monthlyBarChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const homeCardData = {
  name: "Equipment Due",
  description: "Statistics for Equipments Due",
  value: "3",
  overdue: "2  ",
  soon: "1  ",
};

const InventoryCardData = {
  name: "Inventory Due",
  description: "Statistics for Inventory Due",
  value: "3",
  outOfStock: "2  ",
  soon: "1  ",
};

const employeeCardData = {
  name: "Employees Due",
  description: "Statistics for Employees Due",
  value: "2",
  overdue: "0  ",
  soon: "5  ",
};

const data = [
  { name: "Chrome", statistic: 20, fill: "#55B2C9" },
  // { name: "Safari", statistic: 200, fill: "var(--color-safari)" },
  // { name: "Firefox", statistic: 287, fill: "var(--color-firefox)" },
  // { name: "Edge", statistic: 173, fill: "var(--color-edge)" },
  // { name: "Other", statistic: 190, fill: "var(--color-other)" },
];
const config = {
  statistic: { label: "Total" },
  Chrome: { label: "Work Order", color: "#55B2C9" },
  // Safari: { label: "Safari", color: "hsl(var(--chart-2))" },
  // Firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  // Edge: { label: "Edge", color: "hsl(var(--chart-4))" },
  // Other: { label: "Other", color: "hsl(var(--chart-5))" },
};

const purchaseOrders = [
  { name: "Purchase Order", statistic: 27, fill: "#55B2C9" },
];
const purchaseConfig = {
  statistic: { label: "Total" },
  Chrome: { label: "Work Order", color: "#55B2C9" },
  // Safari: { label: "Safari", color: "hsl(var(--chart-2))" },
  // Firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  // Edge: { label: "Edge", color: "hsl(var(--chart-4))" },
  // Other: { label: "Other", color: "hsl(var(--chart-5))" },
};

const options = ["All Locations", "Location 1", "Location 2", "Main Location"];

export default function Page() {
  const [activeCard, setActiveCard] = useState(1);
  const [selected, setSelected] = React.useState("All Locations");
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    console.log("Selected:", option);
    setOpen(false); // close after selection
  };
  return (
    <>
      <div className="flex flex-row  p-4 justify-between">
        <span className="text-2xl font-bold">Welcome, Yaw Sarfo</span>
        <div>
          You are currently viewing your dashboard for{" "}
          <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="inline-block"
          >
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <span className="font-bold cursor-pointer text-primary">{selected}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4  px-4 pt-0">
        <div className="col-span-4  ">
          <div className=" flex w-full flex-row gap-4 pb-3">
            <ReusableButtonCard
              data={homeCardData}
              onClick={() => setActiveCard(1)}
              isActive={activeCard === 1}
            />
            <ReusableButtonInventoryCard
              data={InventoryCardData}
              onClick={() => setActiveCard(2)}
              isActive={activeCard === 2}
            />
            <ReusableButtonCard
              data={employeeCardData}
              onClick={() => setActiveCard(3)}
              isActive={activeCard === 3}
            />
          </div>
          <div>
            {activeCard === 1 && <EquipmentDataTable realServer={false} />}
            {activeCard === 2 && <InventoryDataTable realServer={false} />}
            {activeCard === 3 && <EmployeesDataTable realServer={false} />}
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <DonutChartCard
            data={data}
            config={config}
            title="Work Orders"
            description=" "
            footerTrendText=" "
            footerSubText=" "
            centerLabel=" "
          />
          <DonutChartCard
            data={purchaseOrders}
            config={purchaseConfig}
            title="Purchase Orders"
            description=" "
            footerTrendText=" "
            footerSubText=" "
            centerLabel=" "
          />
          <MonthlyMaintenanceChart />
        </div>
      </div>
    </>
  );
}
