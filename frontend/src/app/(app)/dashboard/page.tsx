'use client';

import { useCallback } from 'react';
import { KpiCard } from "@/components/dashboard/kpi-card";
import { FleetUtilizationChart } from "@/components/dashboard/fleet-utilization-chart";
import { MaintenanceBacklogChart } from "@/components/dashboard/maintenance-backlog-chart";
import { PredictiveAlerts } from "@/components/dashboard/predictive-alerts";
import { LoadingWrapper } from "@/components/ui/loading-wrapper";
import { ApiTest } from "@/components/api-test";
import { dashboardService } from "@/lib/services/dashboardService";
import { useBackendData } from "@/hooks/use-backend-data";
import type { Kpi } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardContent() {
  const fetchKpis = useCallback(() => dashboardService.getKPIs(), []);
  const { data: kpis, loading, error, retry, isRetrying } = useBackendData<Kpi[]>(
    fetchKpis,
    {
      retryOnError: true,
      retryDelay: 10000,
      maxRetries: 3
    }
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-red-800">
              <strong>Connection Error:</strong> {error}
            </div>
            <button
              onClick={retry}
              disabled={isRetrying}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : (
          kpis?.map((kpi) => (
            <KpiCard key={kpi.title} kpi={kpi} />
          )) || []
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-12 lg:col-span-4">
            <FleetUtilizationChart />
        </div>
        <div className="col-span-12 lg:col-span-3">
            <MaintenanceBacklogChart />
        </div>
      </div>
      
     
      
      {/* Temporary API Test Component */}
      <div className="mt-8">
        <ApiTest />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <LoadingWrapper timeout={60000}>
      <DashboardContent />
    </LoadingWrapper>
  );
}
