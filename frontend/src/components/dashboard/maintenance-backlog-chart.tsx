"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Tooltip } from "recharts"

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
  { priority: "High", tasks: 275, fill: "var(--color-high)" },
  { priority: "Medium", tasks: 200, fill: "var(--color-medium)" },
  { priority: "Low", tasks: 287, fill: "var(--color-low)" },
]

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-2))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-1))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--muted))",
  },
}

export function MaintenanceBacklogChart() {
  const totalTasks = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.tasks, 0)
  }, [])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Maintenance Backlog</CardTitle>
        <CardDescription>By Priority</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="tasks"
              nameKey="priority"
              innerRadius={60}
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
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Backlog is trending down <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total pending maintenance tasks
        </div>
      </CardFooter>
    </Card>
  )
}
