"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type DonutChartCardProps = {
  data: {
    name: string
    statistic: number
    fill: string
  }[]
  config: ChartConfig
  title?: string
  description?: string
  footerTrendText?: string
  footerSubText?: string
  centerLabel?: string
}

export const DonutChartCard: React.FC<DonutChartCardProps> = ({
  data,
  config,
  title = "Donut Chart",
  description = "Summary Data",
  footerTrendText = "Trending up this period",
  footerSubText = "Aggregated statistics",
  centerLabel = "Total",
}) => {
  const totalStatistic = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.statistic, 0),
    [data]
  )

  return (
    <Card className="flex flex-col h-fit py-2 gap-2 ">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[150px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="statistic"
              nameKey="name"
              innerRadius={40}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStatistic.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {footerTrendText} 
          {/* <TrendingUp className="h-4 w-4" /> */}
        {/* </div>
        <div className="leading-none text-muted-foreground">
          {footerSubText}
        </div>
      </CardFooter>  */}
    </Card>
  )
}
