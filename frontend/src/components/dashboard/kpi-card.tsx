import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kpi } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import Link from 'next/link';

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const isIncrease = kpi.changeType === 'increase';

  const cardContent = (
    <Card className="hover:border-primary transition-colors h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className={cn(
            "flex items-center gap-0.5",
            isIncrease ? "text-green-600" : "text-red-600"
          )}>
            {isIncrease ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {kpi.change}
          </span>
          {kpi.description}
        </p>
      </CardContent>
    </Card>
  );

  if (kpi.filterValue) {
    const href = kpi.filterValue === 'all' 
      ? '/all-trains' 
      : `/all-trains?status=${kpi.filterValue}`;
    return (
      <Link href={href} className="h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
