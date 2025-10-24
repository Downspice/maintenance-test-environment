"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", maintenanceCost: 186 },
  { month: "February", maintenanceCost: 220 },
  { month: "March", maintenanceCost: 198 },
  { month: "April", maintenanceCost: 245 },
  { month: "May", maintenanceCost: 210 },
  { month: "June", maintenanceCost: 230 },
  { month: "July", maintenanceCost: 195 },
  { month: "August", maintenanceCost: 250 },
  { month: "September", maintenanceCost: 215 },
  { month: "October", maintenanceCost: 225 },
  { month: "November", maintenanceCost: 205 },
  { month: "December", maintenanceCost: 240 },
];

const chartConfig = {
  maintenanceCost: {
    name: "Maintenance Cost",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MonthlyMaintenanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Cost by Month Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="maintenanceCost"
              fill="var(--color-desktop)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total maintenance cost for the last year
        </div>
      </CardFooter>
    </Card>
  );
}
