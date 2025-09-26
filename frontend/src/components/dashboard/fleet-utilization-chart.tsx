"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", operational: 18, maintenance: 6, idle: 4 },
  { month: "February", operational: 19, maintenance: 5, idle: 4 },
  { month: "March", operational: 20, maintenance: 4, idle: 4 },
  { month: "April", operational: 18, maintenance: 6, idle: 4 },
  { month: "May", operational: 21, maintenance: 3, idle: 4 },
  { month: "June", operational: 22, maintenance: 2, idle: 4 },
]

const chartConfig = {
  operational: {
    label: "Operational",
    color: "hsl(var(--chart-1))",
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-2))",
  },
  idle: {
    label: "Idle",
    color: "hsl(var(--muted))",
  },
}

export function FleetUtilizationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Utilization</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="operational" stackId="a" fill="var(--color-operational)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="maintenance" stackId="a" fill="var(--color-maintenance)" />
            <Bar dataKey="idle" stackId="a" fill="var(--color-idle)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Overall utilization increased by 5.2% this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total fleet status for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
