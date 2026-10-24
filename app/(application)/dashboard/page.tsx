"use client";
import { DonutChartCard } from "@/components/charts/donut-chart";
import ReusableButtonCard from "@/components/reusable/reusableButtonCard";
import ReusableButtonInventoryCard from "@/components/reusable/reusableButtonCardInventory";
import React from "react";
import { useState } from "react";
import { EquipmentDataTable } from "./components/data-table/equipment/equipment-data-table";
import { InventoryDataTable } from "./components/data-table/inventory/inventory-data-table";
import { EmployeesDataTable } from "./components/data-table/employees/employees-data-table";
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
  id: "3",
  overdue: "2  ",
  soon: "1  ",
};

const InventoryCardData = {
  name: "Inventory Due",
  description: "Statistics for Inventory Due",
  id: "3",
  outOfStock: "2  ",
  soon: "1  ",
};

const employeeCardData = {
  name: "Employees Due",
  description: "Statistics for Employees Due",
  id: "2",
  overdue: "0  ",
  soon: "5  ",
};

const data = [{ name: "Work Orders", statistic: 20, fill: "var(--primary)" }];
const config = {
  statistic: { label: "Total" },
  "Work Orders": { label: "Work Orders", color: "var(--primary)" },
};

const purchaseOrders = [
  { name: "Purchase Orders", statistic: 27, fill: "var(--primary)" },
];
const purchaseConfig = {
  statistic: { label: "Total" },
  "Purchase Orders": { label: "Purchase Orders", color: "var(--primary)" },
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
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex flex-row p-4 justify-between">
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
                <span className="font-bold cursor-pointer text-primary">
                  {selected}
                </span>
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

      <div className="grid grid-cols-6 gap-4 px-4 pt-0 pb-6">
        <div className="col-span-4">
          <div className="flex w-full flex-row gap-4 pb-3">
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
    </div>
  );
}
