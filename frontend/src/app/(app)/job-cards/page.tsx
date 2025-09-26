import { TrainJobCards } from "@/components/job-cards/train-job-cards";

export default function JobCardsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Job Card Management</h1>
      </div>
       <p className="text-muted-foreground">
        Select a train to view its maintenance history and open job cards.
      </p>
      <TrainJobCards />
    </div>
  );
}
