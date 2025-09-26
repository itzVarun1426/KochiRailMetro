// src/components/job-cards/train-job-cards.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Train, Wrench } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Train as TrainType, JobCard, BackendJobCard } from '@/lib/types';
import { trainService } from '@/lib/services/trainService';
import { jobCardService } from '@/lib/services/jobCardService';
import { useCachedApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type FilterValue = 'all' | 'open' | 'none' | 'completed';

export function TrainJobCards() {
  const [filter, setFilter] = useState<FilterValue>('open');
  const { toast } = useToast();

  // Simple create form state
  const [formTrainId, setFormTrainId] = useState<string>('');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formDetails, setFormDetails] = useState<string>('');
  const [formPriority, setFormPriority] = useState<'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'>('MEDIUM');
  const [formWorkType, setFormWorkType] = useState<'CORRECTIVE'|'PREVENTIVE'>('CORRECTIVE');
  const [formAssetComponent, setFormAssetComponent] = useState<string>('GENERAL');
  const [formAssignedTo, setFormAssignedTo] = useState<string>('Team-A');
  const [formTargetDate, setFormTargetDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: trains, loading: trainsLoading, error: trainsError } = useCachedApi<TrainType[]>(
    'all-trains',
    () => trainService.getAllTrains(),
    []
  );

  const { data: jobCards, loading: jobCardsLoading, error: jobCardsError } = useCachedApi<JobCard[]>(
    'all-job-cards',
    () => jobCardService.getAllJobCards(),
    []
  );

  const loading = trainsLoading || jobCardsLoading;
  const error = trainsError || jobCardsError;

  const getOpenJobsCount = (trainId: string) => {
    if (!jobCards) return 0;
    return jobCards.filter(job => job.trainId === trainId && job.status !== 'Completed').length;
  };
  
  const getCompletedJobsCount = (trainId: string) => {
    if (!jobCards) return 0;
    return jobCards.filter(job => job.trainId === trainId && job.status === 'Completed').length;
  }

  const getFilteredTrains = (): TrainType[] => {
    if (!trains) return [];
    switch (filter) {
      case 'open':
        return trains.filter(train => getOpenJobsCount(String(train.trainId)) > 0);
      case 'none':
        return trains.filter(train => getOpenJobsCount(String(train.trainId)) === 0);
      case 'completed':
          return trains.filter(train => getCompletedJobsCount(String(train.trainId)) > 0 && getOpenJobsCount(String(train.trainId)) === 0);
      case 'all':
      default:
        return trains;
    }
  };

  const filteredTrains = getFilteredTrains();

  return (
    <div className="space-y-6">
      {/* Quick Add Job Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add Job Card</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="col-span-1">
            <Label htmlFor="trainId">Train</Label>
            <Select value={formTrainId} onValueChange={setFormTrainId}>
              <SelectTrigger id="trainId"><SelectValue placeholder="Select a train" /></SelectTrigger>
              <SelectContent>
                {(trains || []).map(t => (
                  <SelectItem key={t.trainId} value={String(t.trainId)}>{t.trainNumber || t.trainId}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Input id="summary" value={formSummary} onChange={e => setFormSummary(e.target.value)} placeholder="Short description" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="details">Details</Label>
            <Input id="details" value={formDetails} onChange={e => setFormDetails(e.target.value)} placeholder="Additional details" />
          </div>
          <div className="col-span-1">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formPriority} onValueChange={(v: any)=> setFormPriority(v)}>
              <SelectTrigger id="priority"><SelectValue placeholder="Select priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="LOW">LOW</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="workType">Work Type</Label>
            <Select value={formWorkType} onValueChange={(v: any)=> setFormWorkType(v)}>
              <SelectTrigger id="workType"><SelectValue placeholder="Select work type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CORRECTIVE">CORRECTIVE</SelectItem>
                <SelectItem value="PREVENTIVE">PREVENTIVE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="assetComponent">Asset Component</Label>
            <Input id="assetComponent" value={formAssetComponent} onChange={e => setFormAssetComponent(e.target.value)} placeholder="e.g. GENERAL" />
          </div>
          <div className="col-span-1">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input id="assignedTo" value={formAssignedTo} onChange={e => setFormAssignedTo(e.target.value)} placeholder="Team name" />
          </div>
          <div className="col-span-1">
            <Label htmlFor="target">Target Completion</Label>
            <Input id="target" type="datetime-local" value={formTargetDate} onChange={e => setFormTargetDate(e.target.value)} />
          </div>
          <div className="col-span-4 flex justify-end">
            <Button
              onClick={async ()=>{
                if (!formTrainId || !formSummary) {
                  toast({ title: 'Missing fields', description: 'Select train and enter summary', variant: 'destructive' });
                  return;
                }
                setIsSubmitting(true);
                const now = new Date();
                const pad = (n: number) => String(n).padStart(2, '0');
                const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                const jobId = `JC-${Date.now()}`; // simple unique id
                const payload: BackendJobCard = {
                  jobCardId: jobId,
                  trainId: Number(formTrainId),
                  trainsetId: null,
                  assetComponent: formAssetComponent,
                  workType: formWorkType,
                  priority: formPriority,
                  status: 'OPEN',
                  reportedDate: ts,
                  targetCompletionDate: formTargetDate || ts,
                  actualStart: null,
                  actualEnd: null,
                  summary: formSummary,
                  details: formDetails,
                  laborHoursLogged: 0,
                  assignedTo: formAssignedTo,
                  supervisorOverride: false,
                  lastUpdated: ts,
                };
                try {
                  await jobCardService.createJobCardEntity(payload);
                  toast({ title: 'Job card created', description: jobId });
                } catch (e:any) {
                  toast({ title: 'Failed to create job card', description: e?.message || 'Unknown error', variant: 'destructive' });
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            >{isSubmitting ? 'Adding...' : 'Add Job Card'}</Button>
          </div>
        </CardContent>
      </Card>

       <div className="flex items-center space-x-4">
        <Label htmlFor="status-filter" className="text-sm font-medium">Filter by Status:</Label>
        <Select value={filter} onValueChange={(value: string) => setFilter(value as FilterValue)}>
          <SelectTrigger id="status-filter" className="w-[200px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trains</SelectItem>
            <SelectItem value="open">With Open Jobs</SelectItem>
            <SelectItem value="none">No Open Jobs</SelectItem>
            <SelectItem value="completed">With Completed Jobs</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-16">
          <p className="font-semibold">Error loading data: {error}</p>
        </div>
      ) : filteredTrains.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTrains.map(train => {
            const openJobsCount = getOpenJobsCount(String(train.trainId));
            return (
                <Link href={`/job-cards/${train.trainId}`} key={train.trainId}>
                <Card className="hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold text-primary">{train.trainNumber || String(train.trainId)}</CardTitle>
                    <Train className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                    {openJobsCount > 0 ? (
                        <div className="flex items-center gap-2 text-destructive">
                            <Wrench className="h-5 w-5" />
                            <span className="font-bold text-lg">{openJobsCount}</span>
                            <span className="text-sm">Open Job(s)</span>
                        </div>
                    ) : (
                        <p className="text-sm text-green-600 font-semibold">No Open Jobs</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">Click to view all job cards</p>
                    </CardContent>
                </Card>
                </Link>
            );
            })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
            <p className="font-semibold">No trains match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
