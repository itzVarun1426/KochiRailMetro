// src/app/(app)/all-trains/page.tsx
'use client';

import * as React from 'react';
import type { Train } from '@/lib/types';
import { TrainCard } from '@/components/all-trains/train-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { trainService } from '@/lib/services/trainService';
import { useCachedApi } from '@/hooks/use-api';


export default function AllTrainsPage({ extraTrains = [] }: { extraTrains?: Train[] }) {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isClient, setIsClient] = React.useState(false);

  const { data: apiTrains, loading, error } = useCachedApi<Train[]>(
    'all-trains',
    () => trainService.getAllTrains(),
    []
  );

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Combine API trains with extra trains
  const allTrains = React.useMemo(() => {
    if (!apiTrains) return extraTrains;
    if (extraTrains.length === 0) return apiTrains;
    
    const existingIds = new Set(apiTrains.map(t => t.trainId));
    const newTrains = extraTrains.filter(t => !existingIds.has(t.trainId));
    return [...apiTrains, ...newTrains];
  }, [apiTrains, extraTrains]);
  
  const filteredTrains = allTrains.filter(train => {
    const statusMatch = statusFilter === 'all' || train.status === statusFilter;
    const searchMatch = (train.trainNumber || String(train.trainId))
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">All Trains</h1>
            <p className="text-muted-foreground mt-1">
                Real-time overview of the entire fleet's status and location.
            </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <Input
              placeholder="Filter by Train Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
             <div className="flex items-center gap-2">
                <Label htmlFor="status-filter" className="sr-only">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="IN_SERVICE">In Service</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
      </div>
     
      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
              </div>
            ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-16">
          <p className="font-semibold">Error loading trains: {error}</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrains.map(train => (
                <TrainCard key={train.trainId} train={train} />
            ))}
            </div>
            {filteredTrains.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
                <p className="font-semibold">No trains match the current filters.</p>
            </div>
            )}
        </>
      )}
    </div>
  );
}
