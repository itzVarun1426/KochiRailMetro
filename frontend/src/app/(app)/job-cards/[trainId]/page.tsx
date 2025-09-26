
// src/app/(app)/job-cards/[trainId]/page.tsx
import { trainService } from "@/lib/services/trainService";
import { jobCardService } from "@/lib/services/jobCardService";
import type { BackendJobCard, JobCard } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from 'next/navigation';
import { JobCardsTable } from "@/components/job-cards/job-cards-table";

export default async function TrainJobCardsPage({ params }: { params: { trainId: string } }) {
  const trainId = params.trainId;
  
  try {
    const [train, allJobCards] = await Promise.all([
      trainService.getTrainById(trainId),
      jobCardService.getAllJobCards(),
    ]);

    if (!train) {
      notFound();
    }

    const mapStatus = (s: string): JobCard['status'] => {
      const v = (s || '').toUpperCase();
      if (v === 'COMPLETED' || v === 'CLOSED') return 'Completed';
      if (v === 'IN_PROGRESS') return 'In Progress';
      if (v === 'BLOCKED') return 'Blocked';
      return 'Pending';
    };

    const mapPriority = (p: string): JobCard['priority'] => {
      const v = (p || '').toUpperCase();
      if (v === 'HIGH' || v === 'CRITICAL') return 'High';
      if (v === 'MEDIUM') return 'Medium';
      return 'Low';
    };

    const uiJobs: JobCard[] = (allJobCards as unknown as BackendJobCard[]).map((b) => ({
      id: b.jobCardId,
      trainId: String(b.trainId),
      task: b.summary,
      status: mapStatus(b.status),
      assignedTo: b.assignedTo,
      createdDate: b.reportedDate,
      priority: mapPriority(b.priority),
      expectedCompletion: b.targetCompletionDate,
      supervisor: b.supervisorOverride ? 'Override' : '',
      attachments: [],
    }));

    const jobsForTrain = uiJobs.filter(job => String(job.trainId) === String(trainId));
    const openJobs = jobsForTrain.filter(job => job.status !== 'Completed');
    const completedJobs = jobsForTrain.filter(job => job.status === 'Completed');

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
                Job Cards for Metro: <span className="text-primary">{train.trainNumber || train.trainId}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
                A complete maintenance history and all open jobs for this metro.
            </p>
        </div>
      </div>

       <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Jobs ({openJobs.length})</CardTitle>
            <CardDescription>Maintenance tasks that are currently pending, in progress, or blocked.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobCardsTable jobs={openJobs} trainMileage={0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs ({completedJobs.length})</CardTitle>
            <CardDescription>A historical record of all completed maintenance tasks for this train.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobCardsTable jobs={completedJobs} trainMileage={0} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
  } catch (error) {
    console.error('Error fetching job card data:', error);
    notFound();
  }
}
